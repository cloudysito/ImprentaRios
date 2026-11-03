import { createContext, useContext } from "react";
import type { Empleado } from "../services/authService";

export interface AuthContextValue {
  user: Empleado | null;
  login: (usuario: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return context;
}
