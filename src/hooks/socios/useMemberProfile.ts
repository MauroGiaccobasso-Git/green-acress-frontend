"use client";

import { useCallback, useRef, useState } from "react";

import {
  type MemberProfile,
  sociosApi,
} from "@/api/sociosApi";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const MEMBER_PROFILE_LOAD_ERROR_MESSAGE =
  "No fue posible cargar la información de tu perfil.";

/* =========================================================
   HELPERS
========================================================= */

/*
Obtiene un mensaje seguro para mostrar
dentro del Portal Socio.

Prioriza el mensaje controlado recibido
desde backend y utiliza un fallback cuando
el error no posee información válida.
*/
function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (
    error instanceof Error &&
    error.message.trim().length > 0
  ) {
    return error.message;
  }

  return fallbackMessage;
}

/* =========================================================
   HOOK DEL PERFIL DEL SOCIO
========================================================= */

/*
Hook responsable de administrar el perfil
del socio correspondiente a la sesión actual.

Responsabilidades:

- consultar el perfil público del socio;
- conservar el resumen del límite legal mensual;
- administrar el estado de carga;
- manejar errores controlados;
- evitar que respuestas antiguas sobrescriban
  una consulta más reciente.

No contiene JSX.
No conoce componentes visuales.
No realiza solicitudes HTTP directas.
No calcula el límite legal en frontend.
No reutiliza estados del módulo administrativo.
*/
export function useMemberProfile() {
  /*
  Perfil público correspondiente
  al socio autenticado.
  */
  const [memberProfile, setMemberProfile] =
    useState<MemberProfile | null>(null);

  /*
  Indica si la consulta del perfil
  se encuentra en ejecución.
  */
  const [loadingMemberProfile, setLoadingMemberProfile] =
    useState(false);

  /*
  Error asociado exclusivamente
  a la consulta del perfil.
  */
  const [memberProfileError, setMemberProfileError] =
    useState<string | null>(null);

  /*
  Identificador incremental utilizado para evitar
  que una respuesta antigua sobrescriba el resultado
  de una solicitud posterior.
  */
  const latestRequestIdRef = useRef(0);

  /* =========================================================
     CARGA DEL PERFIL
  ========================================================= */

  /*
  Obtiene el perfil del socio autenticado.

  Backend determina la identidad mediante el JWT
  y calcula el resumen legal mensual utilizando
  las reglas y la zona horaria oficiales.
  */
  const fetchMemberProfile =
    useCallback(async (): Promise<MemberProfile | null> => {
      const requestId =
        latestRequestIdRef.current + 1;

      latestRequestIdRef.current = requestId;

      try {
        setLoadingMemberProfile(true);
        setMemberProfileError(null);

        const profile =
          await sociosApi.getMyProfile();

        if (
          latestRequestIdRef.current !== requestId
        ) {
          return null;
        }

        setMemberProfile(profile);

        return profile;
      } catch (error) {
        if (
          latestRequestIdRef.current !== requestId
        ) {
          return null;
        }

        setMemberProfileError(
          getErrorMessage(
            error,
            MEMBER_PROFILE_LOAD_ERROR_MESSAGE,
          ),
        );

        return null;
      } finally {
        if (
          latestRequestIdRef.current === requestId
        ) {
          setLoadingMemberProfile(false);
        }
      }
    }, []);

  /* =========================================================
     LIMPIEZA
  ========================================================= */

  /*
  Limpia únicamente el error actual
  asociado a la consulta del perfil.
  */
  const clearMemberProfileError = useCallback(() => {
    setMemberProfileError(null);
  }, []);

  /*
  Limpia los datos mantenidos por el hook
  e invalida cualquier solicitud pendiente.

  Puede utilizarse al desmontar un flujo
  o cuando se necesite reiniciar su estado.
  */
  const clearMemberProfile = useCallback(() => {
    latestRequestIdRef.current += 1;

    setMemberProfile(null);
    setMemberProfileError(null);
    setLoadingMemberProfile(false);
  }, []);

  /* =========================================================
     API PÚBLICA DEL HOOK
  ========================================================= */

  return {
    memberProfile,

    loadingMemberProfile,

    memberProfileError,

    fetchMemberProfile,

    clearMemberProfileError,

    clearMemberProfile,
  };
}