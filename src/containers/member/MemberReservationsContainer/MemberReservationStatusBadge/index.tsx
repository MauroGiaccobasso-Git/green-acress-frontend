import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { Chip } from "@mui/material";

import type { ReservationStatus } from "@/api/reservationsApi";

import { memberReservationsStyles as styles } from "../memberReservations.styles";

/* =========================================================
   TIPOS
========================================================= */

type MemberReservationStatusBadgeProps = {
  status: ReservationStatus;

  /*
  Se prioriza la descripción funcional enviada
  por backend:

  - Procesando
  - Lista para retirar
  - Rechazada
  - Cancelada
  - Vencida
  - Retirada
  */
  label?: string;

  compact?: boolean;
};

/* =========================================================
   CONSTANTES
========================================================= */

const fallbackStatusLabels: Record<
  ReservationStatus,
  string
> = {
  PENDIENTE: "Procesando",
  CONFIRMADA: "Lista para retirar",
  RECHAZADA: "Rechazada",
  CANCELADA: "Cancelada",
  VENCIDA: "Vencida",
  FINALIZADA: "Retirada",
};

/* =========================================================
   HELPERS VISUALES
========================================================= */

function getStatusIcon(status: ReservationStatus) {
  switch (status) {
    case "CONFIRMADA":
      return <CheckCircleRoundedIcon />;

    case "FINALIZADA":
      return <TaskAltRoundedIcon />;

    case "VENCIDA":
      return <EventBusyRoundedIcon />;

    case "RECHAZADA":
    case "CANCELADA":
      return <CancelRoundedIcon />;

    case "PENDIENTE":
    default:
      return <HourglassTopRoundedIcon />;
  }
}

function getStatusStyles(status: ReservationStatus) {
  switch (status) {
    case "CONFIRMADA":
      return styles.statusConfirmed;

    case "FINALIZADA":
      return styles.statusCompleted;

    case "RECHAZADA":
      return styles.statusRejected;

    case "CANCELADA":
      return styles.statusCancelled;

    case "VENCIDA":
      return styles.statusExpired;

    case "PENDIENTE":
    default:
      return styles.statusProcessing;
  }
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Presenta el estado funcional de una reserva
dentro del Portal Socio.

PENDIENTE se conserva únicamente como soporte
defensivo ante una eventual visualización durante
el procesamiento automático.

No modifica estados.
No interpreta reglas de negocio.
No ofrece acciones administrativas.
*/
export function MemberReservationStatusBadge({
  status,
  label,
  compact = false,
}: MemberReservationStatusBadgeProps) {
  const visibleLabel =
    label?.trim() || fallbackStatusLabels[status];

  return (
    <Chip
      size="small"
      icon={getStatusIcon(status)}
      label={visibleLabel}
      aria-label={`Estado de la reserva: ${visibleLabel}`}
      sx={{
        ...styles.statusBadge,
        ...(compact
          ? styles.statusBadgeCompact
          : {}),
        ...getStatusStyles(status),
      }}
    />
  );
}