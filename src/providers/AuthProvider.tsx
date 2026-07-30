"use client";

import { createContext, useEffect, useState } from "react";

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
  Indica si el frontend ya terminó
  de restaurar la sesión persistida.

  Es necesario en Next.js para evitar
  diferencias entre el HTML generado
  inicialmente y el HTML hidratado
  en el navegador.

  Mientras este valor sea false,
  las rutas protegidas no deben decidir
  si redirigen o muestran contenido privado.
  */
  isAuthReady: boolean;

  /*
  Acción utilizada para iniciar sesión
  dentro del frontend.

  Recibe:
  - usuario autenticado
  - token JWT

  Luego actualiza el estado global
  y guarda la sesión en localStorage.
  */
  login: (user: StoredAuthUser, token: string) => void;

  /*
  Actualiza parcialmente la información
  del usuario autenticado.

  Se utiliza cuando una acción del sistema
  modifica información asociada a la sesión
  actual sin requerir un nuevo login.

  Ejemplo:
  - aceptación de consentimiento informado
  */
  updateUser: (
    user: Partial<StoredAuthUser>
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
export const AuthContext = createContext<AuthContextValue | null>(null);

/*
Provider global de autenticación.

Su responsabilidad es administrar
la sesión del usuario dentro del frontend.

Actúa como una "memoria compartida"
para que distintas pantallas puedan saber:

- si hay usuario logueado
- qué usuario está logueado
- qué token existe
- si la sesión persistida ya fue restaurada
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

  Importante:
  no se inicializa leyendo localStorage
  directamente dentro de useState.

  En Next.js, el primer render debe ser
  consistente entre servidor y cliente.
  Como localStorage solo existe en el navegador,
  la sesión se restaura después del montaje
  usando useEffect.
  */
  const [user, setUser] = useState<StoredAuthUser | null>(null);

  /*
  Estado del token JWT.

  Se inicializa en null por la misma razón:
  evitar diferencias de hidratación entre
  el render inicial y el cliente.
  */
  const [token, setToken] = useState<string | null>(null);

  /*
  Estado que indica si el AuthProvider
  ya terminó de verificar si existe
  una sesión persistida.

  Mientras sea false, RequireAuth debe mostrar
  un estado neutral de validación y no debe
  renderizar contenido protegido ni redirigir.
  */
  const [isAuthReady, setIsAuthReady] = useState(false);

  /*
  Restaura la sesión persistida luego
  de que el componente se monta en el navegador.

  Este efecto corre únicamente del lado cliente,
  por lo que es seguro acceder a localStorage
  mediante authStorage.

  Esta decisión corrige el hydration mismatch
  detectado en rutas protegidas como /admin/products.
  */
  useEffect(() => {
    /*
    La restauración se difiere a una microtarea
    para evitar setState sincrónico dentro del effect,
    cumpliendo con la regla de ESLint de React.

    Esto mantiene la corrección del hydration mismatch
    sin romper la persistencia de sesión.
    */
    queueMicrotask(() => {
      const storedUser = getStoredUser();

      const storedToken = getStoredToken();

      setUser(storedUser);

      setToken(storedToken);

      setIsAuthReady(true);
    });
  }, []);

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
  const login = (user: StoredAuthUser, token: string) => {
    setUser(user);

    setToken(token);

    setIsAuthReady(true);

    saveSession(user, token);
  };


  /*
  Actualiza parcialmente la información
  del usuario autenticado.

  Mantiene sincronizados:

  - estado global React
  - sesión persistida en localStorage

  Esto permite reflejar cambios de sesión
  sin obligar al usuario a autenticarse
  nuevamente.

  Ejemplo:
  - aceptación de consentimiento informado
  */
  const updateUser = (
    updatedFields: Partial<StoredAuthUser>
  ) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return null;
      }

      const updatedUser = {
        ...currentUser,
        ...updatedFields,
      };

      saveSession(
        updatedUser,
        token ?? ""
      );

      return updatedUser;
    });
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

    setIsAuthReady(true);

    clearSession();
  };

  /*
  Expone la información y acciones
  de autenticación a todos los componentes
  hijos.

  Cualquier componente dentro de este Provider
  puede acceder a estos datos usando useAuth.
  */
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthReady,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}