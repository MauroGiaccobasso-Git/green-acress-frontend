"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  type MemberReservation,
  reservationsApi,
} from "@/api/reservationsApi";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const MEMBER_RESERVATION_DETAIL_ERROR_MESSAGE =
  "No fue posible cargar el detalle de la reserva.";

const INVALID_MEMBER_RESERVATION_MESSAGE =
  "La reserva seleccionada no es válida.";

/* =========================================================
   HELPERS
========================================================= */

/*
Obtiene un mensaje seguro para mostrar
dentro del Portal Socio.

Prioriza mensajes controlados provenientes
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
   HOOK DE DETALLE
========================================================= */

/*
Administra exclusivamente el detalle público
de una reserva perteneciente al socio autenticado.

Responsabilidades:

- consultar una reserva específica;
- almacenar el detalle seleccionado;
- administrar loading y error;
- validar defensivamente el identificador;
- evitar que respuestas antiguas sobrescriban
  una consulta más reciente;
- permitir limpiar el detalle al cerrar la vista.

Backend verifica que la reserva pertenezca
al socio autenticado.

No contiene JSX.
No realiza solicitudes HTTP directas.
No administra el listado general.
No permite cancelar reservas.
No expone información administrativa.
*/
export function useMemberReservationDetail() {
  /*
  Reserva actualmente seleccionada
  dentro del Portal Socio.
  */
  const [
    memberReservationDetail,
    setMemberReservationDetail,
  ] = useState<MemberReservation | null>(null);

  /*
  Indica si el detalle se encuentra
  actualmente en proceso de carga.
  */
  const [
    loadingMemberReservationDetail,
    setLoadingMemberReservationDetail,
  ] = useState(false);

  /*
  Error asociado exclusivamente
  a la consulta individual.
  */
  const [
    memberReservationDetailError,
    setMemberReservationDetailError,
  ] = useState<string | null>(null);

  /*
  Identificador incremental utilizado para impedir
  que una respuesta anterior reemplace el detalle
  correspondiente a una selección más reciente.
  */
  const latestRequestIdRef = useRef(0);

  /* =========================================================
     CARGA DEL DETALLE
  ========================================================= */

  const fetchMemberReservationDetail =
    useCallback(
      async (
        reservationId: number,
      ): Promise<MemberReservation | null> => {
        if (
          !Number.isInteger(reservationId) ||
          reservationId <= 0
        ) {
          latestRequestIdRef.current += 1;

          setMemberReservationDetail(null);
          setLoadingMemberReservationDetail(false);
          setMemberReservationDetailError(
            INVALID_MEMBER_RESERVATION_MESSAGE,
          );

          return null;
        }

        const requestId =
          latestRequestIdRef.current + 1;

        latestRequestIdRef.current = requestId;

        /*
        Se conserva el detalle actual únicamente
        cuando corresponde a la misma reserva.

        Al seleccionar otra reserva se elimina
        el contenido anterior para evitar mostrar
        información asociada a otro registro.
        */
        setMemberReservationDetail(
          (currentReservation) =>
            currentReservation?.id === reservationId
              ? currentReservation
              : null,
        );

        try {
          setLoadingMemberReservationDetail(true);
          setMemberReservationDetailError(null);

          const reservation =
            await reservationsApi.getMyReservationById(
              reservationId,
            );

          if (
            latestRequestIdRef.current !== requestId
          ) {
            return null;
          }

          setMemberReservationDetail(reservation);

          return reservation;
        } catch (error) {
          if (
            latestRequestIdRef.current !== requestId
          ) {
            return null;
          }

          setMemberReservationDetailError(
            getErrorMessage(
              error,
              MEMBER_RESERVATION_DETAIL_ERROR_MESSAGE,
            ),
          );

          return null;
        } finally {
          if (
            latestRequestIdRef.current === requestId
          ) {
            setLoadingMemberReservationDetail(false);
          }
        }
      },
      [],
    );

  /* =========================================================
     LIMPIEZA
  ========================================================= */

  /*
  Limpia únicamente el error actual
  asociado a la consulta individual.
  */
  const clearMemberReservationDetailError =
    useCallback(() => {
      setMemberReservationDetailError(null);
    }, []);

  /*
  Invalida cualquier solicitud pendiente
  y limpia completamente el detalle.
  */
  const clearMemberReservationDetail =
    useCallback(() => {
      latestRequestIdRef.current += 1;

      setMemberReservationDetail(null);
      setMemberReservationDetailError(null);
      setLoadingMemberReservationDetail(false);
    }, []);

  /* =========================================================
     API PÚBLICA DEL HOOK
  ========================================================= */

  return {
    memberReservationDetail,

    loadingMemberReservationDetail,

    memberReservationDetailError,

    fetchMemberReservationDetail,

    clearMemberReservationDetailError,

    clearMemberReservationDetail,
  };
}