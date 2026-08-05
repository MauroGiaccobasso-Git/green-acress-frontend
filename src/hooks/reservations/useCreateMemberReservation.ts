"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  type CreateMemberReservationPayload,
  type CreateMemberReservationResult,
  type MemberReservation,
  type ReservationStatus,
  reservationsApi,
} from "@/api/reservationsApi";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const MEMBER_RESERVATION_CREATE_ERROR_MESSAGE =
  "No fue posible procesar la solicitud de reserva.";

/* =========================================================
   TIPOS
========================================================= */

/*
Resultado funcional interpretado por frontend.

Una respuesta HTTP 201 no implica necesariamente
que la reserva haya sido confirmada.

Backend puede devolver:

- CONFIRMED:
  reserva confirmada y stock bloqueado;

- REJECTED:
  solicitud registrada pero rechazada;

- PENDING:
  solicitud todavía en procesamiento;

- UNKNOWN:
  estado defensivo ante una respuesta inesperada.
*/
export type MemberReservationCreationOutcome =
  | "CONFIRMED"
  | "REJECTED"
  | "PENDING"
  | "UNKNOWN";

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

/*
Interpreta el estado funcional devuelto
por backend después de procesar la solicitud.

No considera HTTP 201 como confirmación
automática de la reserva.
*/
function resolveCreationOutcome(
  status: ReservationStatus,
): MemberReservationCreationOutcome {
  if (status === "CONFIRMADA") {
    return "CONFIRMED";
  }

  if (status === "RECHAZADA") {
    return "REJECTED";
  }

  if (status === "PENDIENTE") {
    return "PENDING";
  }

  return "UNKNOWN";
}

/*
Construye el mensaje funcional principal.

En reservas rechazadas se prioriza el motivo
específico calculado por backend.

Para el resto de los estados se conserva
el mensaje general de la operación.
*/
function resolveCreationMessage(
  result: CreateMemberReservationResult,
): string {
  if (
    result.reservation.estado === "RECHAZADA" &&
    result.reservation.motivo
  ) {
    return result.reservation.motivo;
  }

  return result.message;
}

/* =========================================================
   HOOK DE CREACIÓN
========================================================= */

/*
Administra exclusivamente la creación
de una reserva del socio autenticado.

Responsabilidades:

- enviar el payload a reservationsApi;
- evitar envíos simultáneos;
- administrar el estado de procesamiento;
- manejar errores HTTP o de red;
- almacenar la reserva procesada;
- conservar el mensaje funcional;
- interpretar CONFIRMADA, RECHAZADA,
  PENDIENTE o un estado inesperado;
- permitir limpiar el resultado anterior.

No contiene JSX.
No administra el catálogo.
No administra el borrador.
No calcula precios.
No valida stock.
No valida el límite legal.
No refresca otros hooks automáticamente.

La coordinación posterior corresponde
al container de Productos disponibles.
*/
export function useCreateMemberReservation() {
  /*
  Reserva devuelta después de que backend
  procesa la solicitud.
  */
  const [
    createdMemberReservation,
    setCreatedMemberReservation,
  ] = useState<MemberReservation | null>(
    null,
  );

  /*
  Mensaje funcional asociado al resultado.

  Cuando la reserva es rechazada se conserva
  preferentemente su motivo específico.
  */
  const [
    memberReservationCreationMessage,
    setMemberReservationCreationMessage,
  ] = useState<string | null>(null);

  /*
  Interpretación funcional del estado
  de la reserva procesada.
  */
  const [
    memberReservationCreationOutcome,
    setMemberReservationCreationOutcome,
  ] =
    useState<MemberReservationCreationOutcome | null>(
      null,
    );

  /*
  Indica si existe una solicitud
  actualmente en procesamiento.
  */
  const [
    isCreatingMemberReservation,
    setIsCreatingMemberReservation,
  ] = useState(false);

  /*
  Error técnico o controlado ocurrido
  al ejecutar POST /reservas.

  Una reserva RECHAZADA no se guarda aquí,
  porque representa un resultado funcional
  válido devuelto por backend.
  */
  const [
    createMemberReservationError,
    setCreateMemberReservationError,
  ] = useState<string | null>(null);

  /*
  Bloqueo sincrónico utilizado para evitar
  dos envíos antes de que React actualice
  el estado visual de carga.
  */
  const isSubmittingRef = useRef(false);

  /*
  Identificador utilizado para invalidar
  resultados anteriores cuando el estado
  del hook se limpia explícitamente.
  */
  const latestRequestIdRef = useRef(0);

  /* =========================================================
     CREACIÓN DE LA RESERVA
  ========================================================= */

  /*
  Envía y procesa una solicitud de reserva.

  Retorna el resultado completo para que
  el container pueda decidir coordinadamente:

  - limpiar el borrador;
  - refrescar productos;
  - refrescar el perfil;
  - mostrar feedback;
  - navegar a Mis reservas.

  Retorna null cuando ocurre un error
  o cuando ya existe otro envío en curso.
  */
  const createMemberReservation =
    useCallback(
      async (
        payload: CreateMemberReservationPayload,
      ): Promise<CreateMemberReservationResult | null> => {
        if (isSubmittingRef.current) {
          return null;
        }

        const requestId =
          latestRequestIdRef.current + 1;

        latestRequestIdRef.current =
          requestId;

        isSubmittingRef.current = true;

        try {
          setIsCreatingMemberReservation(
            true,
          );

          setCreateMemberReservationError(
            null,
          );

          setCreatedMemberReservation(
            null,
          );

          setMemberReservationCreationMessage(
            null,
          );

          setMemberReservationCreationOutcome(
            null,
          );

          const result =
            await reservationsApi.createMemberReservation(
              payload,
            );

          if (
            latestRequestIdRef.current !==
            requestId
          ) {
            return null;
          }

          const outcome =
            resolveCreationOutcome(
              result.reservation.estado,
            );

          const message =
            resolveCreationMessage(result);

          setCreatedMemberReservation(
            result.reservation,
          );

          setMemberReservationCreationMessage(
            message,
          );

          setMemberReservationCreationOutcome(
            outcome,
          );

          return result;
        } catch (error) {
          if (
            latestRequestIdRef.current !==
            requestId
          ) {
            return null;
          }

          setCreateMemberReservationError(
            getErrorMessage(
              error,
              MEMBER_RESERVATION_CREATE_ERROR_MESSAGE,
            ),
          );

          return null;
        } finally {
          /*
          El bloqueo sincrónico se libera
          al finalizar la solicitud real,
          incluso si su resultado fue invalidado.
          */
          isSubmittingRef.current = false;

          if (
            latestRequestIdRef.current ===
            requestId
          ) {
            setIsCreatingMemberReservation(
              false,
            );
          }
        }
      },
      [],
    );

  /* =========================================================
     LIMPIEZA
  ========================================================= */

  /*
  Limpia exclusivamente el error técnico
  de la última solicitud.
  */
  const clearCreateMemberReservationError =
    useCallback(() => {
      setCreateMemberReservationError(null);
    }, []);

  /*
  Limpia el resultado funcional anterior.

  No modifica el catálogo, el perfil
  ni la reserva en preparación.
  */
  const clearCreatedMemberReservation =
    useCallback(() => {
      setCreatedMemberReservation(null);

      setMemberReservationCreationMessage(
        null,
      );

      setMemberReservationCreationOutcome(
        null,
      );
    }, []);

  /*
  Reinicia completamente el estado público
  del hook e invalida la respuesta pendiente.

  El bloqueo de envío se mantiene hasta que
  la solicitud HTTP activa realmente finalice,
  evitando solicitudes simultáneas.
  */
  const resetCreateMemberReservation =
    useCallback(() => {
      latestRequestIdRef.current += 1;

      setCreatedMemberReservation(null);

      setMemberReservationCreationMessage(
        null,
      );

      setMemberReservationCreationOutcome(
        null,
      );

      setCreateMemberReservationError(null);

      setIsCreatingMemberReservation(false);
    }, []);

  /* =========================================================
     ESTADOS DERIVADOS
  ========================================================= */

  const wasMemberReservationConfirmed =
    memberReservationCreationOutcome ===
    "CONFIRMED";

  const wasMemberReservationRejected =
    memberReservationCreationOutcome ===
    "REJECTED";

  const isMemberReservationPending =
    memberReservationCreationOutcome ===
    "PENDING";

  /* =========================================================
     API PÚBLICA DEL HOOK
  ========================================================= */

  return {
    createdMemberReservation,

    memberReservationCreationMessage,

    memberReservationCreationOutcome,

    createMemberReservationError,

    isCreatingMemberReservation,

    wasMemberReservationConfirmed,

    wasMemberReservationRejected,

    isMemberReservationPending,

    createMemberReservation,

    clearCreateMemberReservationError,

    clearCreatedMemberReservation,

    resetCreateMemberReservation,
  };
}