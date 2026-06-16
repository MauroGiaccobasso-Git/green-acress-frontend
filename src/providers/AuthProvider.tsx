"use client";

import { createContext, useState } from "react";

import {
  clearSession,
  getStoredToken,
  getStoredUser,
  saveSession,
  StoredAuthUser,
} from "@/features/auth/utils/authStorage";

/*
Define qué información y acciones
va a compartir el contexto de autenticación.

Este tipo funciona como un "contrato":
todo componente que consuma AuthContext
va a poder acceder a estas propiedades.
*/
type AuthContextValue = {
  /*
  Usuario autenticado actualmente.

  Puede ser null cuando:
  - el usuario no inició sesión
  - la sesión fue cerrada
  - no existe sesión guardada
  */
  user: StoredAuthUser | null;

  /*
  Token JWT utilizado para consumir
  endpoints protegidos del backend.

  Puede ser null si no hay sesión activa.
  */
  token: string | null;

  /*
  Acción utilizada para iniciar sesión
  dentro del frontend.

  Recibe:
  - usuario autenticado
  - token JWT

  Luego actualiza el estado global
  y guarda la sesión en localStorage.
  */
  login: (
    user: StoredAuthUser,
    token: string
  ) => void;

  /*
  Acción utilizada para cerrar sesión.

  Limpia:
  - estado en memoria
  - información persistida localmente
  */
  logout: () => void;
};

/*
Contexto global de autenticación.

Se inicializa en null porque todavía
no tiene valor hasta que AuthProvider
envuelve la aplicación.

Los componentes no deberían consumir
este contexto directamente.

Para eso usamos el hook useAuth.
*/
export const AuthContext =
  createContext<AuthContextValue | null>(null);

/*
Provider global de autenticación.

Su responsabilidad es administrar
la sesión del usuario dentro del frontend.

Actúa como una "memoria compartida"
para que distintas pantallas puedan saber:

- si hay usuario logueado
- qué usuario está logueado
- qué token existe
- cómo iniciar sesión
- cómo cerrar sesión
*/
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /*
  Estado del usuario autenticado.

  Se inicializa leyendo authStorage.

  Esto permite recuperar la sesión
  si el usuario refresca la página
  y todavía existe información válida
  guardada en localStorage.
  */
  const [user, setUser] =
    useState<StoredAuthUser | null>(() =>
      getStoredUser()
    );

  /*
  Estado del token JWT.

  También se inicializa desde authStorage
  para mantener la sesión luego de recargar
  la aplicación.
  */
  const [token, setToken] =
    useState<string | null>(() =>
      getStoredToken()
    );

  /*
  Inicia sesión dentro del frontend.

  Primero actualiza el estado en memoria,
  para que la aplicación pueda reaccionar
  inmediatamente.

  Luego delega el guardado persistente
  a authStorage.

  De esta forma, AuthProvider no conoce
  detalles internos de localStorage.
  */
  const login = (
    user: StoredAuthUser,
    token: string
  ) => {
    setUser(user);

    setToken(token);

    saveSession(user, token);
  };

  /*
  Cierra sesión dentro del frontend.

  Primero limpia el estado en memoria,
  dejando al sistema sin usuario ni token.

  Luego elimina la información persistida
  mediante authStorage.

  Esto asegura que, al recargar la página,
  la sesión no vuelva a restaurarse.
  */
  const logout = () => {
    setUser(null);

    setToken(null);

    clearSession();
  };

  /*
  Expone la información y acciones
  de autenticación a todos los componentes
  hijos de la aplicación.

  Cualquier componente dentro de este Provider
  puede acceder a estos datos usando useAuth.
  */
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}