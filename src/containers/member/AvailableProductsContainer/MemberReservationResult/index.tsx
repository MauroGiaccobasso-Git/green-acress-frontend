"use client";

import type { ReactNode } from "react";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";

import type { MemberReservation } from "@/api/reservationsApi";
import type { MemberReservationCreationOutcome } from "@/hooks/reservations/useCreateMemberReservation";

import { availableProductsStyles as styles } from "../availableProducts.styles";

/* =========================================================
   TIPOS
========================================================= */

type MemberReservationResultProps = {
  open: boolean;

  reservation: MemberReservation | null;

  outcome:
    | MemberReservationCreationOutcome
    | null;

  message: string | null;

  onClose: () => void;

  onViewReservations: () => void;
};

type ResultTone =
  | "success"
  | "warning"
  | "info"
  | "error";

type ResultPresentation = {
  title: string;

  fallbackMessage: string;

  tone: ResultTone;

  icon: ReactNode;
};

type ResultSummaryRowProps = {
  label: string;

  value: string;
};

/* =========================================================
   CONSTANTES
========================================================= */

const MEMBER_PORTAL_TIME_ZONE =
  "America/Montevideo";

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

/*
Evita representar números inválidos o negativos
sin modificar los datos reales de la reserva.
*/
function normalizeNumber(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(value, 0);
}

/*
Presenta cantidades generales sin agregar
decimales innecesarios.
*/
function formatGrams(
  value: number,
): string {
  const formattedValue =
    new Intl.NumberFormat("es-UY", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(normalizeNumber(value));

  return `${formattedValue} g`;
}

/*
Presenta el total definitivo informado
por backend en pesos uruguayos.
*/
function formatCurrency(
  value: number,
): string {
  const formattedValue =
    new Intl.NumberFormat("es-UY", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(normalizeNumber(value));

  return `$${formattedValue}`;
}

/*
Presenta la fecha límite utilizando la zona
horaria oficial del sistema.
*/
function formatWithdrawalDeadline(
  value: string | null,
): string {
  if (!value) {
    return "No aplica";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: MEMBER_PORTAL_TIME_ZONE,
  }).format(date);
}

/*
Construye una etiqueta natural para
la cantidad de productos reservados.
*/
function formatProductsCount(
  productsCount: number,
): string {
  if (productsCount === 1) {
    return "1 producto";
  }

  return `${productsCount} productos`;
}

/*
Define la presentación correspondiente al
resultado funcional devuelto por backend.

Una respuesta HTTP exitosa no implica
necesariamente una reserva confirmada.
*/
function getResultPresentation(
  outcome: MemberReservationCreationOutcome,
): ResultPresentation {
  switch (outcome) {
    case "CONFIRMED":
      return {
        title: "Reserva confirmada",
        fallbackMessage:
          "Tu reserva fue confirmada y el stock quedó bloqueado correctamente.",
        tone: "success",
        icon: <CheckRoundedIcon />,
      };

    case "REJECTED":
      return {
        title: "No pudimos confirmar la reserva",
        fallbackMessage:
          "La solicitud fue procesada, pero no cumplió todas las condiciones necesarias.",
        tone: "warning",
        icon: <ErrorOutlineRoundedIcon />,
      };

    case "PENDING":
      return {
        title: "Reserva en procesamiento",
        fallbackMessage:
          "Tu solicitud fue registrada y continúa siendo procesada.",
        tone: "info",
        icon: <AccessTimeRoundedIcon />,
      };

    case "UNKNOWN":
    default:
      return {
        title: "Resultado no disponible",
        fallbackMessage:
          "La solicitud fue procesada, pero no pudimos interpretar su estado final.",
        tone: "error",
        icon: <ErrorOutlineRoundedIcon />,
      };
  }
}

/* =========================================================
   FILA DEL RESUMEN
========================================================= */

/*
Representa una fila del resumen definitivo
de la reserva procesada.
*/
function ResultSummaryRow({
  label,
  value,
}: ResultSummaryRowProps) {
  return (
    <Box sx={styles.resultSummaryRow}>
      <Typography
        component="span"
        sx={styles.resultSummaryLabel}
      >
        {label}
      </Typography>

      <Typography
        component="strong"
        sx={styles.resultSummaryValue}
      >
        {value}
      </Typography>
    </Box>
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Presenta el resultado funcional de la creación
de una reserva dentro de un diálogo Premium.

Responsabilidades:

- diferenciar confirmación, rechazo,
  procesamiento y resultado inesperado;
- mostrar el mensaje real del backend;
- presentar el resumen definitivo;
- permitir continuar en el catálogo;
- facilitar el acceso a Mis reservas.

No crea reservas.
No modifica el borrador.
No refresca datos.
No contiene reglas de stock.
No interpreta directamente códigos HTTP.
*/
export function MemberReservationResult({
  open,
  reservation,
  outcome,
  message,
  onClose,
  onViewReservations,
}: MemberReservationResultProps) {
  /*
  No renderizamos un diálogo incompleto.

  El container controla conjuntamente
  la reserva procesada y su resultado.
  */
  if (!reservation || !outcome) {
    return null;
  }

  const presentation =
    getResultPresentation(outcome);

  const visibleMessage =
    message?.trim() ||
    reservation.motivo?.trim() ||
    presentation.fallbackMessage;

  const prioritizesReservations =
    outcome === "CONFIRMED" ||
    outcome === "PENDING";

  const primaryActionLabel =
    outcome === "REJECTED"
      ? "Revisar selección"
      : outcome === "UNKNOWN"
        ? "Cerrar"
        : "Ver mis reservas";

  const secondaryActionLabel =
    prioritizesReservations
      ? "Seguir viendo productos"
      : "Ver mis reservas";

  const handlePrimaryAction = (): void => {
    if (prioritizesReservations) {
      onViewReservations();

      return;
    }

    onClose();
  };

  const handleSecondaryAction = (): void => {
    if (prioritizesReservations) {
      onClose();

      return;
    }

    onViewReservations();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="member-reservation-result-title"
      aria-describedby="member-reservation-result-message"
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: styles.resultDialogPaper,
        },
      }}
    >
      <DialogContent sx={styles.resultContent}>
        <Box
          aria-hidden="true"
          sx={styles.resultIcon(
            presentation.tone,
          )}
        >
          {presentation.icon}
        </Box>

        <Typography
          id="member-reservation-result-title"
          component="h2"
          sx={styles.resultTitle}
        >
          {presentation.title}
        </Typography>

        <Typography
          id="member-reservation-result-message"
          component="p"
          sx={styles.resultMessage}
        >
          {visibleMessage}
        </Typography>

        <Box
          aria-label="Resumen de la reserva procesada"
          sx={styles.resultSummary}
        >
          <ResultSummaryRow
            label="Número de reserva"
            value={`#${reservation.id}`}
          />

          <ResultSummaryRow
            label="Estado"
            value={
              reservation.estadoDescripcion
            }
          />

          <ResultSummaryRow
            label="Productos"
            value={formatProductsCount(
              reservation.productos.length,
            )}
          />

          <ResultSummaryRow
            label="Total de gramos"
            value={formatGrams(
              reservation.totalGramos,
            )}
          />

          <ResultSummaryRow
            label="Total"
            value={formatCurrency(
              reservation.total,
            )}
          />

          {reservation.fechaLimiteRetiro ? (
            <ResultSummaryRow
              label="Fecha límite de retiro"
              value={formatWithdrawalDeadline(
                reservation.fechaLimiteRetiro,
              )}
            />
          ) : null}
        </Box>
      </DialogContent>

      <DialogActions sx={styles.resultActions}>
        <Button
          type="button"
          variant="outlined"
          onClick={handleSecondaryAction}
          sx={styles.resultSecondaryButton}
        >
          {secondaryActionLabel}
        </Button>

        <Button
          type="button"
          variant="contained"
          onClick={handlePrimaryAction}
          sx={styles.resultPrimaryButton}
        >
          {primaryActionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}