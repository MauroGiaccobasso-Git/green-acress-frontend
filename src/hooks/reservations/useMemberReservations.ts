"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  type MemberReservationsCollection,
  reservationsApi,
} from "@/api/reservationsApi";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const MEMBER_RESERVATIONS_LOAD_ERROR_MESSAGE =
  "No fue posible cargar tus reservas.";

/* =========================================================
   HELPERS
========================================================= */

/*
Construye el estado vacío inicial sin compartir
una referencia mutable entre reinicios del hook.
*/
function createEmptyMemberReservations():
  MemberReservationsCollection {
  return {
    activas: [],
    historial: [],
  };
}

/*
Obtiene un mensaje seguro para mostrar
dentro del Portal Socio.

Prioriza los mensajes controlados provenientes
del backend y utiliza un fallback cuando
el error no contiene información válida.
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
   HOOK DE RESERVAS DEL SOCIO
========================================================= */

/*
Administra el listado personal de reservas
del socio autenticado.

Responsabilidades:

- consultar exclusivamente las reservas propias;
- conservar la separación realizada por backend
  entre activas e historial;
- administrar el estado de carga;
- manejar errores controlados;
- permitir actualizaciones posteriores;
- evitar que respuestas antiguas sobrescriban
  una consulta más reciente.

No contiene JSX.
No construye interfaz.
No realiza solicitudes HTTP directas.
No filtra ni reordena reservas en frontend.
No consulta el detalle individual.
No permite cancelar reservas.
No interpreta reglas administrativas.
*/
export function useMemberReservations() {
  /*
  Colección pública perteneciente
  al socio autenticado.

  Backend determina qué reservas pertenecen
  a cada grupo funcional.
  */
  const [
    memberReservations,
    setMemberReservations,
  ] = useState<MemberReservationsCollection>(
    createEmptyMemberReservations,
  );

  /*
  Indica si la consulta del listado
  se encuentra actualmente en ejecución.
  */
  const [
    loadingMemberReservations,
    setLoadingMemberReservations,
  ] = useState(false);

  /*
  Error asociado exclusivamente
  a la consulta del listado personal.
  */
  const [
    memberReservationsError,
    setMemberReservationsError,
  ] = useState<string | null>(null);

  /*
  Identificador incremental utilizado para evitar
  que una respuesta antigua sobrescriba el resultado
  de una solicitud posterior.
  */
  const latestRequestIdRef = useRef(0);

  /* =========================================================
     CARGA DEL LISTADO
  ========================================================= */

  /*
  Obtiene las reservas del socio autenticado.

  Backend:

  - resuelve la identidad mediante la sesión;
  - impide acceder a reservas de otros socios;
  - separa reservas activas e historial;
  - devuelve únicamente el contrato público.
  */
  const fetchMemberReservations =
    useCallback(async (): Promise<
      MemberReservationsCollection | null
    > => {
      const requestId =
        latestRequestIdRef.current + 1;

      latestRequestIdRef.current = requestId;

      try {
        setLoadingMemberReservations(true);
        setMemberReservationsError(null);

        const reservations =
          await reservationsApi.getMyReservations();

        if (
          latestRequestIdRef.current !== requestId
        ) {
          return null;
        }

        setMemberReservations(reservations);

        return reservations;
      } catch (error) {
        if (
          latestRequestIdRef.current !== requestId
        ) {
          return null;
        }

        /*
        Ante un fallo posterior se conserva
        la última colección válida disponible.

        El container podrá informar el error
        sin eliminar información ya cargada.
        */
        setMemberReservationsError(
          getErrorMessage(
            error,
            MEMBER_RESERVATIONS_LOAD_ERROR_MESSAGE,
          ),
        );

        return null;
      } finally {
        if (
          latestRequestIdRef.current === requestId
        ) {
          setLoadingMemberReservations(false);
        }
      }
    }, []);

  /* =========================================================
     LIMPIEZA
  ========================================================= */

  /*
  Limpia únicamente el error actual
  asociado a la consulta del listado.
  */
  const clearMemberReservationsError =
    useCallback(() => {
      setMemberReservationsError(null);
    }, []);

  /*
  Limpia el estado completo e invalida
  cualquier solicitud todavía pendiente.
  */
  const clearMemberReservations =
    useCallback(() => {
      latestRequestIdRef.current += 1;

      setMemberReservations(
        createEmptyMemberReservations(),
      );
      setMemberReservationsError(null);
      setLoadingMemberReservations(false);
    }, []);

  /* =========================================================
     API PÚBLICA DEL HOOK
  ========================================================= */

  return {
    memberReservations,

    loadingMemberReservations,

    memberReservationsError,

    fetchMemberReservations,

    clearMemberReservationsError,

    clearMemberReservations,
  };
}