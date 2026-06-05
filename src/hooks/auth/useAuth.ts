import { useContext } from "react";

import { AuthContext } from "@/providers/AuthProvider";

/*
Hook reutilizable encargado de consumir
el contexto global de autenticación.

Su objetivo es evitar que los componentes
deban interactuar directamente con
useContext(AuthContext).

Esto permite:

- simplificar consumo del contexto

- centralizar validaciones

- ocultar detalles internos
  de implementación

Cualquier componente que necesite:

- usuario actual

- token

- login()

- logout()

debería utilizar este hook.
*/
export function useAuth() {

  /*
  Obtiene información compartida
  almacenada dentro de AuthProvider.

  useContext permite acceder al
  valor expuesto por el Provider
  más cercano dentro del árbol
  de componentes.
  */
  const context =
    useContext(AuthContext);

  /*
  Evita utilizar el hook fuera
  de AuthProvider.

  Si alguien intenta consumir
  autenticación sin Provider,
  significa que la arquitectura
  fue utilizada incorrectamente.

  Fallamos explícitamente para
  detectar el problema rápido.
  */
  if (!context) {

    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );

  }

  /*
  Devuelve acceso simplificado
  al sistema global de autenticación.
  */
  return context;
}