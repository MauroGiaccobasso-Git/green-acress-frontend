"use client";

import { createContext, useState } from "react";

// Estructura mínima del usuario autenticado
// que será utilizada dentro del frontend.
type AuthUser = {
  id: number;
  email: string;
  rol: "ADMIN" | "SOCIO";
};

// Define qué información y acciones compartirá
// globalmente el contexto de autenticación.
type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
};

// Contexto global de autenticación.
//
// Permitirá compartir información relacionada
// a la sesión actual entre distintas pantallas
// y componentes de la aplicación.
export const AuthContext = createContext<AuthContextValue | null>(null);

// Provider encargado de centralizar el estado
// de autenticación dentro del frontend.
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Estado encargado de almacenar información
  // del usuario autenticado actualmente.
  const [user, setUser] = useState<AuthUser | null>(null);

  // Estado encargado de almacenar el JWT
  // utilizado posteriormente para consumir
  // endpoints protegidos del backend.
  const [token, setToken] = useState<string | null>(null);

  // Guarda en memoria frontend los datos
  // principales de la sesión autenticada.
  const login = (user: AuthUser, token: string) => {
    setUser(user);
    setToken(token);
  };

  // Limpia la información de sesión
  // almacenada en el frontend.
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    // Expone el estado y las acciones de autenticación
    // al resto de componentes envueltos dentro de AuthProvider.
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}