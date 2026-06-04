"use client";

import { createContext, useState } from "react";
import {
  clearSession,
  getStoredToken,
  getStoredUser,
  saveSession,
  StoredAuthUser,
} from "@/features/auth/utils/authStorage";

type AuthContextValue = {
  user: StoredAuthUser | null;
  token: string | null;
  login: (user: StoredAuthUser, token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inicializa la sesión desde localStorage
  // en caso de existir una sesión previa.
  const [user, setUser] = useState<StoredAuthUser | null>(() =>
    getStoredUser()
  );

  const [token, setToken] = useState<string | null>(() =>
    getStoredToken()
  );

  // Actualiza sesión en memoria
  // y delega la persistencia a authStorage.
  const login = (user: StoredAuthUser, token: string) => {
    setUser(user);
    setToken(token);

    saveSession(user, token);
  };

  // Limpia sesión en memoria
  // y elimina la persistencia local.
  const logout = () => {
    setUser(null);
    setToken(null);

    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}