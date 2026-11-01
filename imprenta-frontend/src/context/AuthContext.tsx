import { useState, type ReactNode } from "react";
import { login as loginRequest, type Empleado } from "../services/authService";
import { AuthContext } from "../hooks/useAuth";

const STORAGE_KEY = "imprenta.user";

const readStoredUser = (): Empleado | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Empleado) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Empleado | null>(readStoredUser);

  const login = async (usuario: string, password: string) => {
    const empleado = await loginRequest(usuario, password);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(empleado));
    } catch {
    }
    setUser(empleado);
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
