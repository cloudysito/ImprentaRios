import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { login as loginRequest, type Empleado } from "../services/authService";

const STORAGE_KEY = "imprenta.user";
const TOKEN_KEY = "imprenta.token";

interface AuthContextType {
  user: Empleado | null;
  token: string | null;
  estaAutenticado: boolean;
  cargandoSesion: boolean;
  avisoSesion: string | null;
  login: (usuario: string, password: string) => Promise<void>;
  logout: () => void;
  limpiarAvisoSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): Empleado | null => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) as Empleado : null;
  } catch (error) {
    console.error("No se pudo restaurar la sesión guardada:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState<Empleado | null>(readStoredUser);
  const [cargandoSesion, setCargandoSesion] = useState(false);
  const [avisoSesion, setAvisoSesion] = useState<string | null>(null);

  const login = async (usuario: string, password: string) => {
    setCargandoSesion(true);
    setAvisoSesion(null);

    try {
      const { token: newToken, empleado } = await loginRequest(usuario, password);
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(empleado));
      setToken(newToken);
      setUser(empleado);
    } finally {
      setCargandoSesion(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
      setAvisoSesion(
        "Tu sesión ha expirado o la credencial ya no es válida. Por favor, inicia sesión nuevamente."
      );
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        estaAutenticado: !!token && !!user,
        cargandoSesion,
        avisoSesion,
        login,
        logout,
        limpiarAvisoSesion: () => setAvisoSesion(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
