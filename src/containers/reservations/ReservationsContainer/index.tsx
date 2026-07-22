"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";

import type {
  Reservation,
  ReservationsFilters,
  ReservationStatus,
  ReservationSummary,
} from "@/api/reservationsApi";
import { AppPagination } from "@/components/common/Pagination";
import { useReservations } from "@/hooks/reservations/useReservations";

import ReservationsFiltersModal from "./ReservationsFiltersModal";
import { reservationsStyles } from "./reservations.styles";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

/*
Tiempo de espera aplicado al buscador dinámico.

Replica el comportamiento del módulo Stock para evitar
una solicitud HTTP por cada tecla ingresada.
*/
const SEARCH_DEBOUNCE_MS = 400;

/*
Ventana temporal utilizada para destacar reservas
confirmadas próximas a vencer.

"Por vencer" no representa un nuevo estado del dominio:
es una condición visual derivada del estado CONFIRMADA
y del tiempo restante hasta la fecha límite de retiro.
*/
const EXPIRING_SOON_HOURS = 24;

/*
Estado limpio utilizado por el modal
de filtros avanzados.

El modal funciona como constructor de una nueva búsqueda
y no arrastra valores anteriores al volver a abrirse.
*/
const emptyAdvancedFilters: ReservationsFilters = {
  socioId: undefined,
  productoId: undefined,
};

/*
Etiquetas amigables correspondientes
a los estados reales del backend.
*/
const reservationStatusLabels: Record<ReservationStatus, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADA: "Confirmada",
  RECHAZADA: "Rechazada",
  CANCELADA: "Cancelada",
  VENCIDA: "Vencida",
  FINALIZADA: "Finalizada",
};

/* =========================================================
   HELPERS DE FORMATO
========================================================= */

function formatReservationCode(reservationId: number) {
  return `RES-${String(reservationId).padStart(3, "0")}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatGrams(value: number) {
  return `${new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)} g`;
}

function formatDocument(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 8) {
    return value;
  }

  return `${digits[0]}.${digits.slice(1, 4)}.${digits.slice(4, 7)}-${digits[7]}`;
}

function formatPhone(value: string | null) {
  if (!value) {
    return "No registrado";
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length !== 9) {
    return value;
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

function getMemberInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatRemainingTime(
  value: string | null,
  currentTimestamp: number | null,
) {
  if (!value) {
    return "No aplica";
  }

  if (currentTimestamp === null) {
    return "Calculando...";
  }

  const expirationDate = new Date(value);

  if (Number.isNaN(expirationDate.getTime())) {
    return "No disponible";
  }

  const remainingMilliseconds = expirationDate.getTime() - currentTimestamp;

  if (remainingMilliseconds <= 0) {
    return "Plazo vencido";
  }

  const totalMinutes = Math.floor(remainingMilliseconds / (1000 * 60));

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} d ${hours} h`;
  }

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }

  return `${minutes} min`;
}

/*
Determina si una reserva confirmada se encuentra
dentro de las próximas 24 horas de su vencimiento.

Esta condición se utiliza únicamente para reforzar
la prioridad operativa dentro del listado. El estado
real de la reserva continúa siendo CONFIRMADA.
*/
function isReservationExpiringSoon(
  reservation: ReservationSummary | Reservation,
  currentTimestamp: number | null,
) {
  if (
    currentTimestamp === null ||
    reservation.estado !== "CONFIRMADA" ||
    !reservation.fecha_limite_retiro
  ) {
    return false;
  }

  const expirationTimestamp = new Date(
    reservation.fecha_limite_retiro,
  ).getTime();

  if (Number.isNaN(expirationTimestamp)) {
    return false;
  }

  const remainingMilliseconds = expirationTimestamp - currentTimestamp;
  const expiringSoonThreshold =
    EXPIRING_SOON_HOURS * 60 * 60 * 1000;

  return (
    remainingMilliseconds > 0 &&
    remainingMilliseconds <= expiringSoonThreshold
  );
}

function getReservationStatusDescription(status: ReservationStatus) {
  switch (status) {
    case "CONFIRMADA":
      return "Stock reservado y retiro pendiente.";

    case "FINALIZADA":
      return "Retiro registrado y venta asociada.";

    case "CANCELADA":
      return "Reserva cancelada y stock liberado.";

    case "VENCIDA":
      return "Plazo de retiro vencido y stock liberado.";

    case "RECHAZADA":
      return "La solicitud no pudo ser confirmada.";

    case "PENDIENTE":
    default:
      return "Solicitud en procesamiento automático.";
  }
}

function getReservationTotalGrams(
  reservation: ReservationSummary | Reservation,
) {
  return reservation.detalles.reduce(
    (total, detail) => total + detail.cantidad,
    0,
  );
}

function getPaginationRange(page: number, limit: number, total: number) {
  if (total === 0) {
    return {
      from: 0,
      to: 0,
    };
  }

  return {
    from: (page - 1) * limit + 1,
    to: Math.min(page * limit, total),
  };
}

/* =========================================================
   HELPERS VISUALES DE ESTADO
========================================================= */

function getStatusChipStyles(status: ReservationStatus) {
  switch (status) {
    case "CONFIRMADA":
      return reservationsStyles.statusConfirmed;

    case "FINALIZADA":
      return reservationsStyles.statusCompleted;

    case "CANCELADA":
      return reservationsStyles.statusCancelled;

    case "VENCIDA":
      return reservationsStyles.statusExpired;

    case "RECHAZADA":
    case "PENDIENTE":
    default:
      return reservationsStyles.statusRejected;
  }
}

function ReservationStatusChip({ status }: { status: ReservationStatus }) {
  return (
    <Chip
      label={reservationStatusLabels[status]}
      size="small"
      sx={{
        ...reservationsStyles.statusChip,
        ...getStatusChipStyles(status),
      }}
    />
  );
}

/*
Representación contextual utilizada exclusivamente
dentro del listado administrativo.

Cuando una reserva CONFIRMADA vence dentro de las
próximas 24 horas, se muestra "Por vencer" en naranja
para facilitar el escaneo operativo. No modifica el estado
real ni afecta el panel de detalle, historial o backend.
*/
function ReservationListStatusChip({
  reservation,
  currentTimestamp,
}: {
  reservation: ReservationSummary;
  currentTimestamp: number | null;
}) {
  if (isReservationExpiringSoon(reservation, currentTimestamp)) {
    return (
      <Chip
        label="Por vencer"
        size="small"
        sx={{
          ...reservationsStyles.statusChip,
          ...reservationsStyles.statusExpiring,
        }}
      />
    );
  }

  return <ReservationStatusChip status={reservation.estado} />;
}

/* =========================================================
   COMPONENTES VISUALES INTERNOS
========================================================= */

function SummaryCard({
  icon,
  label,
  value,
  hint,
  iconStyles,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  hint: string;
  iconStyles: object;
}) {
  return (
    <Box sx={reservationsStyles.summaryCard}>
      <Box
        sx={{
          ...reservationsStyles.summaryIcon,
          ...iconStyles,
        }}
      >
        {icon}
      </Box>

      <Box sx={reservationsStyles.summaryContent}>
        <Typography sx={reservationsStyles.summaryLabel}>{label}</Typography>

        <Typography sx={reservationsStyles.summaryValue}>{value}</Typography>

        <Typography sx={reservationsStyles.summaryHint}>{hint}</Typography>
      </Box>
    </Box>
  );
}

function SummarySkeletons() {
  return (
    <Box sx={reservationsStyles.summaryGrid}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Box key={index} sx={reservationsStyles.skeletonSummaryCard}>
          <Skeleton
            variant="rounded"
            width={54}
            height={54}
            sx={{ borderRadius: "16px" }}
          />

          <Box sx={{ flex: 1 }}>
            <Skeleton width="68%" height={18} />
            <Skeleton width="34%" height={38} />
            <Skeleton width="82%" height={16} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function TableSkeleton() {
  return (
    <Box sx={reservationsStyles.tableWrapper}>
      <Box sx={reservationsStyles.tableHeader}>
        <span>Código</span>
        <span>Socio</span>
        <span>Fecha reserva</span>
        <span>Vence el</span>
        <span>Estado</span>
        <span>Productos</span>
        <span>Total gramos</span>
      </Box>

      {Array.from({ length: 5 }).map((_, index) => (
        <Box key={index} sx={reservationsStyles.skeletonTableRow}>
          {Array.from({ length: 7 }).map((_, skeletonIndex) => (
            <Skeleton
              key={skeletonIndex}
              height={24}
              width={skeletonIndex === 1 || skeletonIndex === 5 ? "86%" : "72%"}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}

function DetailSkeleton() {
  return (
    <Box sx={reservationsStyles.skeletonDetail}>
      <Skeleton width="35%" height={18} />
      <Skeleton width="58%" height={38} />

      <Divider sx={{ my: 2.5 }} />

      <Skeleton variant="rounded" height={94} sx={{ borderRadius: "14px" }} />

      <Skeleton
        variant="rounded"
        height={120}
        sx={{ mt: 2, borderRadius: "14px" }}
      />

      <Skeleton
        variant="rounded"
        height={160}
        sx={{ mt: 2, borderRadius: "14px" }}
      />

      <Skeleton
        variant="rounded"
        height={100}
        sx={{ mt: 2, borderRadius: "14px" }}
      />
    </Box>
  );
}

/* =========================================================
   CONTAINER PRINCIPAL
========================================================= */

/*
Container principal del módulo administrativo de Reservas.

Responsabilidades:
- renderizar la pantalla administrativa;
- inicializar la información del módulo;
- manejar estado local exclusivamente visual;
- coordinar buscador, filtros y paginación;
- controlar la selección Master / Detail;
- mostrar confirmaciones administrativas;
- delegar consultas y acciones al hook.

NO llama endpoints directamente.
NO construye URLs.
NO accede a httpClient.
NO implementa reglas críticas de negocio.
NO coordina hooks pertenecientes a otros dominios.
*/
export default function ReservationsContainer() {
  /*
  useReservations actúa como hook orquestador completo
  del módulo.

  Expone datos listos para renderizar y centraliza:

  - listado;
  - detalle;
  - KPI;
  - filtros;
  - paginación;
  - cancelación;
  - confirmación de retiro;
  - estados de carga y error.
  */
  const {
    paginatedReservations,
    selectedReservation,

    reservationFilters,
    reservationKpis,

    memberOptions,
    productOptions,

    currentPage,
    pageSize,
    totalReservations,
    totalPages,

    hasFiltersApplied,
    hasRegisteredReservations,
    hasResults,

    loadingCatalog,
    loadingReservations,
    loadingDetail,
    cancellingReservation,
    confirmingWithdrawal,

    catalogError,
    reservationsError,
    detailError,
    actionError,
    actionSuccess,

    fetchInitialReservations,
    fetchReservationById,

    applyReservationFilters,
    clearReservationFilters,

    selectReservation,

    changeReservationPage,

    cancelReservation,
    confirmReservationWithdrawal,

    clearActionFeedback,
    clearDetailError,
  } = useReservations();

  const [searchTerm, setSearchTerm] = useState("");
  const isInitialSearchRender = useRef(true);

  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "">("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const [advancedFilterForm, setAdvancedFilterForm] =
    useState<ReservationsFilters>(emptyAdvancedFilters);

  const [reservationPendingCancellation, setReservationPendingCancellation] =
    useState<Reservation | null>(null);

  const [cancellationObservation, setCancellationObservation] = useState("");

  const [reservationPendingWithdrawal, setReservationPendingWithdrawal] =
    useState<Reservation | null>(null);

  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);

  /* =========================================================
     CARGA INICIAL
  ========================================================= */

  useEffect(() => {
    void fetchInitialReservations();
  }, [fetchInitialReservations]);

  /*
  Mantiene actualizado el tiempo restante de retiro
  sin generar diferencias entre render del servidor
  e hidratación del cliente.
  */
  useEffect(() => {
    const updateCurrentTimestamp = () => {
      setCurrentTimestamp(Date.now());
    };

    updateCurrentTimestamp();

    const intervalId = window.setInterval(updateCurrentTimestamp, 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  /* =========================================================
     BUSCADOR DINÁMICO
  ========================================================= */

  /*
  Ejecuta la búsqueda administrativa con debounce.

  Replica el patrón Gold de Stock para evitar solicitudes
  innecesarias mientras el usuario continúa escribiendo.
  */
  useEffect(() => {
    if (isInitialSearchRender.current) {
      isInitialSearchRender.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchTerm.trim();

      if ((reservationFilters.search ?? "") === normalizedSearch) {
        return;
      }

      void applyReservationFilters({
        ...reservationFilters,
        search: normalizedSearch,
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm, reservationFilters, applyReservationFilters]);

  /* =========================================================
     VALORES DERIVADOS
  ========================================================= */

  const paginationRange = useMemo(() => {
    return getPaginationRange(currentPage, pageSize, totalReservations);
  }, [currentPage, pageSize, totalReservations]);

  const isInitialLoading =
    (loadingCatalog || loadingReservations) && !hasRegisteredReservations;

  const pageError = reservationsError ?? catalogError;

  /* =========================================================
     FILTROS VISIBLES
  ========================================================= */

  const applyVisibleFilters = async (
    nextStatus: ReservationStatus | "" = statusFilter,
    nextFromDate: string = fromDate,
    nextToDate: string = toDate,
  ) => {
    if (
      nextFromDate &&
      nextToDate &&
      new Date(nextFromDate) > new Date(nextToDate)
    ) {
      setDateRangeError(
        "La fecha desde no puede ser mayor que la fecha hasta.",
      );
      return;
    }

    setDateRangeError(null);

    await applyReservationFilters({
      ...reservationFilters,
      search: searchTerm.trim(),
      estado: nextStatus || undefined,
      fechaDesde: nextFromDate || undefined,
      fechaHasta: nextToDate || undefined,
    });
  };

  const handleStatusChange = (value: ReservationStatus | "") => {
    setStatusFilter(value);
    void applyVisibleFilters(value, fromDate, toDate);
  };

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    void applyVisibleFilters(statusFilter, value, toDate);
  };

  const handleToDateChange = (value: string) => {
    setToDate(value);
    void applyVisibleFilters(statusFilter, fromDate, value);
  };

  /* =========================================================
     FILTROS AVANZADOS
  ========================================================= */

  /*
  El modal comienza limpio en cada apertura,
  replicando el criterio adoptado en Stock.
  */
  const handleOpenFiltersModal = () => {
    setAdvancedFilterForm(emptyAdvancedFilters);
    setIsFiltersModalOpen(true);
  };

  const handleCloseFiltersModal = () => {
    setIsFiltersModalOpen(false);
  };

  const handleApplyAdvancedFilters = async () => {
    setIsFiltersModalOpen(false);

    await applyReservationFilters({
      ...reservationFilters,
      search: searchTerm.trim(),
      estado: statusFilter || undefined,
      fechaDesde: fromDate || undefined,
      fechaHasta: toDate || undefined,
      socioId: advancedFilterForm.socioId,
      productoId: advancedFilterForm.productoId,
    });
  };

  const handleClearAllFilters = async () => {
    isInitialSearchRender.current = true;

    setSearchTerm("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setDateRangeError(null);
    setAdvancedFilterForm(emptyAdvancedFilters);
    setIsFiltersModalOpen(false);

    await clearReservationFilters();
  };

  /* =========================================================
     SELECCIÓN MASTER / DETAIL
  ========================================================= */

  const handleSelectReservation = async (reservationId: number) => {
    clearActionFeedback();
    clearDetailError();

    await selectReservation(reservationId);
  };

  const handleRetryDetail = async () => {
    if (!selectedReservation) {
      return;
    }

    await fetchReservationById(selectedReservation.id);
  };

  /* =========================================================
     CANCELACIÓN
  ========================================================= */

  const handleOpenCancellation = () => {
    if (!selectedReservation || selectedReservation.estado !== "CONFIRMADA") {
      return;
    }

    clearActionFeedback();
    setCancellationObservation("");
    setReservationPendingCancellation(selectedReservation);
  };

  const handleCloseCancellation = () => {
    if (cancellingReservation) {
      return;
    }

    setReservationPendingCancellation(null);
    setCancellationObservation("");
    clearActionFeedback();
  };

  const handleConfirmCancellation = async () => {
    if (!reservationPendingCancellation) {
      return;
    }

    const result = await cancelReservation(reservationPendingCancellation.id, {
      observaciones: cancellationObservation.trim() || undefined,
    });

    if (result) {
      setReservationPendingCancellation(null);
      setCancellationObservation("");
    }
  };

  /* =========================================================
     CONFIRMACIÓN DE RETIRO
  ========================================================= */

  const handleOpenWithdrawal = () => {
    if (!selectedReservation || selectedReservation.estado !== "CONFIRMADA") {
      return;
    }

    clearActionFeedback();
    setReservationPendingWithdrawal(selectedReservation);
  };

  const handleCloseWithdrawal = () => {
    if (confirmingWithdrawal) {
      return;
    }

    setReservationPendingWithdrawal(null);
    clearActionFeedback();
  };

  const handleConfirmWithdrawal = async () => {
    if (!reservationPendingWithdrawal) {
      return;
    }

    const result = await confirmReservationWithdrawal(
      reservationPendingWithdrawal.id,
    );

    if (result) {
      setReservationPendingWithdrawal(null);
    }
  };

  /* =========================================================
     RENDER DE ESTADOS UX
  ========================================================= */

  const renderListState = () => {
    if (loadingReservations) {
      return <TableSkeleton />;
    }

    if (pageError) {
      return (
        <Box sx={reservationsStyles.stateWrapper}>
          <Box sx={reservationsStyles.stateContent}>
            <Box
              sx={{
                ...reservationsStyles.stateIcon,
                ...reservationsStyles.stateIconError,
              }}
            >
              <ErrorOutlineRoundedIcon />
            </Box>

            <Typography sx={reservationsStyles.stateTitle}>
              No pudimos cargar las reservas.
            </Typography>

            <Typography sx={reservationsStyles.stateDescription}>
              Ocurrió un problema al obtener la información. Intentá nuevamente.
            </Typography>

            <Button
              variant="contained"
              startIcon={<RefreshRoundedIcon />}
              onClick={() => void fetchInitialReservations()}
              sx={reservationsStyles.stateButton}
            >
              Reintentar
            </Button>
          </Box>
        </Box>
      );
    }

    if (!hasRegisteredReservations && !hasFiltersApplied) {
      return (
        <Box sx={reservationsStyles.stateWrapper}>
          <Box sx={reservationsStyles.stateContent}>
            <Box sx={reservationsStyles.stateIcon}>
              <Inventory2OutlinedIcon />
            </Box>

            <Typography sx={reservationsStyles.stateTitle}>
              Aún no hay reservas registradas.
            </Typography>

            <Typography sx={reservationsStyles.stateDescription}>
              Cuando los socios comiencen a realizar reservas, aparecerán aquí
              para su gestión.
            </Typography>
          </Box>
        </Box>
      );
    }

    if (!hasResults) {
      return (
        <Box sx={reservationsStyles.stateWrapper}>
          <Box sx={reservationsStyles.stateContent}>
            <Box sx={reservationsStyles.stateIcon}>
              <SearchOutlinedIcon />
            </Box>

            <Typography sx={reservationsStyles.stateTitle}>
              No encontramos reservas.
            </Typography>

            <Typography sx={reservationsStyles.stateDescription}>
              Probá ajustando o limpiando los filtros para ver más resultados.
            </Typography>

            <Button
              variant="contained"
              onClick={() => void handleClearAllFilters()}
              sx={reservationsStyles.stateButton}
            >
              Limpiar filtros
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <>
        <Box sx={reservationsStyles.tableWrapper}>
          <Box sx={reservationsStyles.tableHeader}>
            <span>Código</span>
            <span>Socio</span>
            <span>Fecha reserva</span>
            <span>Vence el</span>
            <span>Estado</span>
            <span>Productos</span>
            <span>Total gramos</span>
          </Box>

          {paginatedReservations.map((reservation) => {
            const isSelected = selectedReservation?.id === reservation.id;

            const firstProduct = reservation.detalles[0];

            const remainingProducts = reservation.detalles.length - 1;

            return (
              <Box
                key={reservation.id}
                component="button"
                type="button"
                aria-pressed={isSelected}
                onClick={() => void handleSelectReservation(reservation.id)}
                sx={{
                  ...reservationsStyles.reservationRow,
                  ...(isSelected
                    ? reservationsStyles.reservationRowSelected
                    : {}),
                  appearance: "none",
                  borderTop: 0,
                  borderLeft: 0,
                  borderRight: 0,
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <Box sx={reservationsStyles.codeCell}>
                  <Typography sx={reservationsStyles.reservationCode}>
                    {formatReservationCode(reservation.id)}
                  </Typography>
                </Box>

                <Box sx={reservationsStyles.memberCell}>
                  <Typography sx={reservationsStyles.cellLabelMobile}>
                    Socio
                  </Typography>

                  <Typography sx={reservationsStyles.memberName}>
                    {reservation.socio.nombre} {reservation.socio.apellido}
                  </Typography>

                  <Typography sx={reservationsStyles.memberDocument}>
                    CI {reservation.socio.documento}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={reservationsStyles.cellLabelMobile}>
                    Fecha reserva
                  </Typography>

                  <Typography sx={reservationsStyles.dateValue}>
                    {formatDate(reservation.fecha_solicitud)}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={reservationsStyles.cellLabelMobile}>
                    Vence el
                  </Typography>

                  <Typography sx={reservationsStyles.dateValue}>
                    {formatDate(reservation.fecha_limite_retiro)}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={reservationsStyles.cellLabelMobile}>
                    Estado
                  </Typography>

                  <ReservationListStatusChip
                    reservation={reservation}
                    currentTimestamp={currentTimestamp}
                  />
                </Box>

                <Box sx={reservationsStyles.productList}>
                  <Typography sx={reservationsStyles.cellLabelMobile}>
                    Productos
                  </Typography>

                  <Typography sx={reservationsStyles.productName}>
                    {firstProduct
                      ? firstProduct.producto.nombre
                      : "Sin productos"}
                  </Typography>

                  {remainingProducts > 0 && (
                    <Typography sx={reservationsStyles.productMore}>
                      +{remainingProducts} producto
                      {remainingProducts === 1 ? "" : "s"}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography sx={reservationsStyles.cellLabelMobile}>
                    Total gramos
                  </Typography>

                  <Typography sx={reservationsStyles.gramsValue}>
                    {formatGrams(getReservationTotalGrams(reservation))}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={reservationsStyles.footerRow}>
          <Typography sx={reservationsStyles.footerText}>
            Mostrando {paginationRange.from} a {paginationRange.to} de{" "}
            {totalReservations} reservas
          </Typography>

          <AppPagination
            page={currentPage}
            totalPages={totalPages}
            onChange={changeReservationPage}
          />
        </Box>
      </>
    );
  };

  const renderDetailPanel = () => {
    if (loadingDetail) {
      return <DetailSkeleton />;
    }

    if (detailError) {
      return (
        <Box sx={reservationsStyles.detailCard}>
          <Box sx={reservationsStyles.detailEmptyState}>
            <Box sx={reservationsStyles.stateContent}>
              <Box
                sx={{
                  ...reservationsStyles.stateIcon,
                  ...reservationsStyles.stateIconError,
                }}
              >
                <ErrorOutlineRoundedIcon />
              </Box>

              <Typography sx={reservationsStyles.stateTitle}>
                No pudimos cargar el detalle.
              </Typography>

              <Typography sx={reservationsStyles.stateDescription}>
                Intentá seleccionar nuevamente la reserva o reintentar la
                consulta.
              </Typography>

              <Button
                variant="contained"
                onClick={() => void handleRetryDetail()}
                sx={reservationsStyles.stateButton}
              >
                Reintentar
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    if (!selectedReservation) {
      return (
        <Box sx={reservationsStyles.detailCard}>
          <Box sx={reservationsStyles.detailEmptyState}>
            <Box sx={reservationsStyles.stateContent}>
              <Box sx={reservationsStyles.stateIcon}>
                <PersonOutlineRoundedIcon />
              </Box>

              <Typography sx={reservationsStyles.stateTitle}>
                Seleccioná una reserva.
              </Typography>

              <Typography sx={reservationsStyles.stateDescription}>
                Elegí una fila para consultar su información, historial y
                acciones disponibles.
              </Typography>
            </Box>
          </Box>
        </Box>
      );
    }

    const totalGrams = getReservationTotalGrams(selectedReservation);

    const isConfirmed = selectedReservation.estado === "CONFIRMADA";

    return (
      <Box sx={reservationsStyles.detailCard}>
        <Box sx={reservationsStyles.detailHeader}>
          <Box sx={reservationsStyles.detailHeaderContent}>
            <Typography sx={reservationsStyles.detailEyebrow}>
              Detalle de la reserva
            </Typography>

            <Typography sx={reservationsStyles.detailCode}>
              {formatReservationCode(selectedReservation.id)}
            </Typography>

            <Typography sx={reservationsStyles.detailDate}>
              Reservada el {formatDateTime(selectedReservation.fecha_solicitud)}
            </Typography>
          </Box>

          <ReservationStatusChip status={selectedReservation.estado} />
        </Box>

        <Box sx={reservationsStyles.detailBody}>
          {/* DATOS DEL SOCIO */}
          <Box sx={reservationsStyles.detailSection}>
            <Typography sx={reservationsStyles.detailSectionTitle}>
              Socio
            </Typography>

            <Box sx={reservationsStyles.memberCard}>
              <Box sx={reservationsStyles.memberIdentity}>
                <Avatar sx={reservationsStyles.memberAvatar}>
                  {getMemberInitials(
                    selectedReservation.socio.nombre,
                    selectedReservation.socio.apellido,
                  )}
                </Avatar>

                <Box sx={reservationsStyles.memberIdentityContent}>
                  <Typography sx={reservationsStyles.memberNamePrimary}>
                    {selectedReservation.socio.nombre}{" "}
                    {selectedReservation.socio.apellido}
                  </Typography>

                  <Typography sx={reservationsStyles.memberDocumentPrimary}>
                    CI: {formatDocument(selectedReservation.socio.documento)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={reservationsStyles.memberCardDivider} />

              <Box sx={reservationsStyles.memberContactList}>
                <Box sx={reservationsStyles.memberContactRow}>
                  <Box sx={reservationsStyles.memberContactIcon}>
                    <CalendarMonthRoundedIcon />
                  </Box>

                  <Typography sx={reservationsStyles.memberContactLabel}>
                    Socio desde:
                  </Typography>

                  <Typography sx={reservationsStyles.memberContactValue}>
                    {formatDate(selectedReservation.socio.fecha_alta)}
                  </Typography>
                </Box>

                <Box sx={reservationsStyles.memberContactRow}>
                  <Box sx={reservationsStyles.memberContactIcon}>
                    <PhoneRoundedIcon />
                  </Box>

                  <Typography sx={reservationsStyles.memberContactLabel}>
                    Teléfono:
                  </Typography>

                  <Typography sx={reservationsStyles.memberContactValue}>
                    {formatPhone(selectedReservation.socio.telefono)}
                  </Typography>
                </Box>

                <Box sx={reservationsStyles.memberContactRow}>
                  <Box sx={reservationsStyles.memberContactIcon}>
                    <MailOutlineRoundedIcon />
                  </Box>

                  <Typography sx={reservationsStyles.memberContactLabel}>
                    Email:
                  </Typography>

                  <Typography
                    sx={{
                      ...reservationsStyles.memberContactValue,
                      wordBreak: "break-word",
                    }}
                  >
                    {selectedReservation.socio.usuario.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={reservationsStyles.detailDivider} />

          {/* ESTADO Y PLAZO DE RETIRO */}
          <Box sx={reservationsStyles.detailSection}>
            <Box sx={reservationsStyles.reservationStatusCard}>
              <Box sx={reservationsStyles.reservationStatusSummary}>
                <Typography sx={reservationsStyles.reservationStatusTitle}>
                  Estado actual
                </Typography>

                <ReservationStatusChip status={selectedReservation.estado} />

                <Typography
                  sx={reservationsStyles.reservationStatusDescription}
                >
                  {getReservationStatusDescription(selectedReservation.estado)}
                </Typography>
              </Box>

              <Divider sx={reservationsStyles.reservationStatusDivider} />

              <Box sx={reservationsStyles.reservationTimingGrid}>
                <Box sx={reservationsStyles.reservationTimingItem}>
                  <Typography sx={reservationsStyles.reservationTimingLabel}>
                    Fecha de reserva
                  </Typography>

                  <Typography sx={reservationsStyles.reservationTimingValue}>
                    {formatDateTime(selectedReservation.fecha_solicitud)}
                  </Typography>
                </Box>

                <Box sx={reservationsStyles.reservationTimingItem}>
                  <Typography sx={reservationsStyles.reservationTimingLabel}>
                    Vence el
                  </Typography>

                  <Typography sx={reservationsStyles.reservationTimingValue}>
                    {selectedReservation.fecha_limite_retiro
                      ? formatDateTime(selectedReservation.fecha_limite_retiro)
                      : "No aplica"}
                  </Typography>
                </Box>

                <Box sx={reservationsStyles.reservationTimingItem}>
                  <Typography sx={reservationsStyles.reservationTimingLabel}>
                    Tiempo restante
                  </Typography>

                  {isConfirmed ? (
                    <Box sx={reservationsStyles.reservationTimingRemaining}>
                      <AccessTimeRoundedIcon
                        sx={reservationsStyles.reservationTimingRemainingIcon}
                      />

                      <Typography
                        component="span"
                        sx={reservationsStyles.reservationTimingRemainingValue}
                      >
                        {formatRemainingTime(
                          selectedReservation.fecha_limite_retiro,
                          currentTimestamp,
                        )}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography sx={reservationsStyles.reservationTimingValue}>
                      No aplica
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={reservationsStyles.detailDivider} />

          {/* PRODUCTOS RESERVADOS */}
          <Box sx={reservationsStyles.detailSection}>
            <Typography sx={reservationsStyles.detailSectionTitle}>
              Productos reservados
            </Typography>

            <Box sx={reservationsStyles.reservedProductsTable}>
              <Box sx={reservationsStyles.reservedProductsHeader}>
                <Typography>Producto</Typography>
                <Typography>Cantidad</Typography>
                <Typography>Stock bloqueado</Typography>
              </Box>

              <Box sx={reservationsStyles.reservedProductsBody}>
                {selectedReservation.detalles.map((detail) => (
                  <Box
                    key={detail.id}
                    sx={reservationsStyles.reservedProductRow}
                  >
                    <Box sx={reservationsStyles.reservedProductIdentity}>
                      {detail.producto.imagen_url ? (
                        <Box
                          component="img"
                          src={detail.producto.imagen_url}
                          alt={detail.producto.nombre}
                          sx={reservationsStyles.reservedProductThumbnail}
                        />
                      ) : (
                        <Box
                          sx={
                            reservationsStyles.reservedProductThumbnailFallback
                          }
                        >
                          <Inventory2OutlinedIcon fontSize="small" />
                        </Box>
                      )}

                      <Box sx={reservationsStyles.reservedProductInformation}>
                        <Typography sx={reservationsStyles.reservedProductName}>
                          {detail.producto.nombre}
                        </Typography>

                        <Typography sx={reservationsStyles.reservedProductMeta}>
                          Flor · {formatCurrency(detail.precio_unitario)} por
                          gramo
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={reservationsStyles.reservedProductMetric}>
                      <Typography
                        sx={reservationsStyles.reservedProductMobileLabel}
                      >
                        Cantidad
                      </Typography>

                      <Typography
                        sx={reservationsStyles.reservedProductQuantity}
                      >
                        {formatGrams(detail.cantidad)}
                      </Typography>
                    </Box>

                    <Box sx={reservationsStyles.reservedProductMetric}>
                      <Typography
                        sx={reservationsStyles.reservedProductMobileLabel}
                      >
                        Stock bloqueado
                      </Typography>

                      <Typography
                        sx={reservationsStyles.reservedProductBlockedQuantity}
                      >
                        {formatGrams(detail.cantidad)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={reservationsStyles.reservedProductsTotal}>
                <Typography sx={reservationsStyles.reservedProductsTotalLabel}>
                  Total reservado
                </Typography>

                <Typography sx={reservationsStyles.reservedProductsTotalValue}>
                  {formatGrams(totalGrams)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={reservationsStyles.detailDivider} />

          {/* HISTORIAL */}
          <Box sx={reservationsStyles.detailSection}>
            <Typography sx={reservationsStyles.detailSectionTitle}>
              Historial
            </Typography>

            <Box sx={reservationsStyles.historyList}>
              {selectedReservation.historial.map((historyItem) => {
                const historyStateStyles = {
                  PENDIENTE: reservationsStyles.historyStatePending,
                  CONFIRMADA: reservationsStyles.historyStateConfirmed,
                  FINALIZADA: reservationsStyles.historyStateCompleted,
                  CANCELADA: reservationsStyles.historyStateCancelled,
                  VENCIDA: reservationsStyles.historyStateExpired,
                  RECHAZADA: reservationsStyles.historyStateRejected,
                }[historyItem.estado];

                return (
                  <Box key={historyItem.id} sx={reservationsStyles.historyItem}>
                    <Box sx={reservationsStyles.historyIndicator} />

                    <Box sx={reservationsStyles.historyContent}>
                      <Box sx={reservationsStyles.historyHeader}>
                        <Typography
                          sx={{
                            ...reservationsStyles.historyState,
                            ...historyStateStyles,
                          }}
                        >
                          {reservationStatusLabels[historyItem.estado]}
                        </Typography>

                        <Typography sx={reservationsStyles.historyMeta}>
                          {formatDateTime(historyItem.fecha)}
                          {" · "}
                          {historyItem.usuario
                            ? historyItem.usuario.email
                            : "Sistema"}
                        </Typography>
                      </Box>

                      {historyItem.observaciones && (
                        <Typography sx={reservationsStyles.historyObservation}>
                          {historyItem.observaciones}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Divider sx={reservationsStyles.detailDivider} />

          {/* ACCIONES */}
          <Box sx={reservationsStyles.detailSection}>
            <Typography sx={reservationsStyles.detailSectionTitle}>
              Acciones
            </Typography>

            {isConfirmed ? (
              <Box sx={reservationsStyles.actionsSection}>
                <Button
                  variant="outlined"
                  startIcon={<CloseRoundedIcon />}
                  onClick={handleOpenCancellation}
                  disabled={cancellingReservation || confirmingWithdrawal}
                  sx={reservationsStyles.cancelButton}
                >
                  Cancelar reserva
                </Button>

                <Button
                  variant="contained"
                  startIcon={<ShoppingCartRoundedIcon />}
                  onClick={handleOpenWithdrawal}
                  disabled={cancellingReservation || confirmingWithdrawal}
                  sx={reservationsStyles.withdrawalButton}
                >
                  Registrar retiro
                </Button>
              </Box>
            ) : (
              <Box sx={reservationsStyles.readonlyNotice}>
                No hay acciones disponibles para esta reserva.
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  /* =========================================================
     RENDER PRINCIPAL
  ========================================================= */

  return (
    <Box sx={reservationsStyles.root}>
      <Box sx={reservationsStyles.pageContent}>
        {/* KPI */}
        {isInitialLoading ? (
          <SummarySkeletons />
        ) : (
          <Box sx={reservationsStyles.summaryGrid}>
            <SummaryCard
              icon={<LockRoundedIcon />}
              label="Confirmadas"
              value={reservationKpis.confirmed}
              hint="Reservas activas"
              iconStyles={reservationsStyles.summaryIconConfirmed}
            />

            <SummaryCard
              icon={<ScheduleRoundedIcon />}
              label="Por vencer (24 hs)"
              value={reservationKpis.expiringSoon}
              hint="Requieren atención"
              iconStyles={reservationsStyles.summaryIconExpiring}
            />

            <SummaryCard
              icon={<ShoppingCartRoundedIcon />}
              label="Finalizadas"
              value={reservationKpis.completedThisMonth}
              hint="Este mes"
              iconStyles={reservationsStyles.summaryIconCompleted}
            />

            <SummaryCard
              icon={<LockOpenRoundedIcon />}
              label="Canceladas"
              value={reservationKpis.cancelledThisMonth}
              hint="Este mes"
              iconStyles={reservationsStyles.summaryIconCancelled}
            />

            <SummaryCard
              icon={<EventBusyRoundedIcon />}
              label="Vencidas"
              value={reservationKpis.expiredThisMonth}
              hint="Este mes"
              iconStyles={reservationsStyles.summaryIconExpired}
            />
          </Box>
        )}

        {/* PANEL OPERATIVO */}
        <Box sx={reservationsStyles.panel}>
          <Box sx={reservationsStyles.panelBody}>
            {actionSuccess && (
              <Alert
                severity="success"
                onClose={clearActionFeedback}
                sx={{ mb: 2 }}
              >
                {actionSuccess}
              </Alert>
            )}

            {actionError &&
              !reservationPendingCancellation &&
              !reservationPendingWithdrawal && (
                <Alert
                  severity="error"
                  onClose={clearActionFeedback}
                  sx={{ mb: 2 }}
                >
                  {actionError}
                </Alert>
              )}

            <Box sx={reservationsStyles.masterDetailGrid}>
              {/* MASTER */}
              <Box sx={reservationsStyles.masterPanel}>
                <Box sx={reservationsStyles.toolbar}>
                  <TextField
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar por código, socio o documento..."
                    size="small"
                    sx={reservationsStyles.searchField}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchOutlinedIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Button
                    variant="outlined"
                    startIcon={<FilterListOutlinedIcon />}
                    onClick={handleOpenFiltersModal}
                    sx={reservationsStyles.filterButton}
                  >
                    Filtros
                  </Button>
                </Box>

                <Box
                  sx={{
                    ...reservationsStyles.filtersGrid,
                    mt: 1.25,
                  }}
                >
                  <TextField
                    select
                    label="Estado"
                    value={statusFilter}
                    onChange={(event) =>
                      handleStatusChange(
                        event.target.value as ReservationStatus | "",
                      )
                    }
                    size="small"
                    sx={reservationsStyles.filterField}
                  >
                    <MenuItem value="">Todos los estados</MenuItem>
                    <MenuItem value="CONFIRMADA">Confirmada</MenuItem>
                    <MenuItem value="FINALIZADA">Finalizada</MenuItem>
                    <MenuItem value="CANCELADA">Cancelada</MenuItem>
                    <MenuItem value="VENCIDA">Vencida</MenuItem>
                    <MenuItem value="RECHAZADA">Rechazada</MenuItem>
                  </TextField>

                  <TextField
                    label="Fecha desde"
                    type="date"
                    value={fromDate}
                    onChange={(event) =>
                      handleFromDateChange(event.target.value)
                    }
                    size="small"
                    sx={reservationsStyles.filterField}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />

                  <TextField
                    label="Fecha hasta"
                    type="date"
                    value={toDate}
                    onChange={(event) => handleToDateChange(event.target.value)}
                    size="small"
                    sx={reservationsStyles.filterField}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />

                  {hasFiltersApplied && (
                    <Button
                      variant="text"
                      onClick={() => void handleClearAllFilters()}
                      sx={reservationsStyles.clearFiltersButton}
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </Box>

                {dateRangeError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {dateRangeError}
                  </Alert>
                )}

                {hasFiltersApplied && (
                  <Box sx={reservationsStyles.filtersNotice}>
                    <Typography sx={reservationsStyles.filtersNoticeText}>
                      Hay filtros aplicados sobre el listado.
                    </Typography>

                    <Button
                      variant="text"
                      onClick={() => void handleClearAllFilters()}
                      sx={reservationsStyles.clearFiltersButton}
                    >
                      Limpiar filtros
                    </Button>
                  </Box>
                )}

                {renderListState()}
              </Box>

              {/* DETAIL */}
              <Box sx={reservationsStyles.detailPanel}>
                {renderDetailPanel()}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FILTROS AVANZADOS */}
      <ReservationsFiltersModal
        open={isFiltersModalOpen}
        filterForm={advancedFilterForm}
        memberOptions={memberOptions}
        productOptions={productOptions}
        onChange={setAdvancedFilterForm}
        onClose={handleCloseFiltersModal}
        onClear={() => void handleClearAllFilters()}
        onApply={() => void handleApplyAdvancedFilters()}
      />

      {/* CONFIRMACIÓN DE CANCELACIÓN */}
      <Dialog
        open={Boolean(reservationPendingCancellation)}
        onClose={handleCloseCancellation}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: reservationsStyles.actionDialogPaper,
          },
        }}
      >
        <DialogTitle sx={reservationsStyles.actionDialogTitle}>
          <Box sx={reservationsStyles.actionDialogTitleContent}>
            <Box
              sx={{
                ...reservationsStyles.actionDialogIcon,
                ...reservationsStyles.actionDialogIconDanger,
              }}
            >
              <CloseRoundedIcon />
            </Box>

            <Box>
              <Typography sx={reservationsStyles.actionDialogTitleText}>
                Cancelar reserva
              </Typography>

              <Typography sx={reservationsStyles.actionDialogSubtitle}>
                Esta acción no puede deshacerse.
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={reservationsStyles.actionDialogContent}>
          <Typography sx={reservationsStyles.actionDialogDescription}>
            La reserva pasará al estado Cancelada y el stock reservado será
            liberado automáticamente.
          </Typography>

          {reservationPendingCancellation && (
            <Box sx={reservationsStyles.actionDialogSummary}>
              <Box sx={reservationsStyles.actionDialogSummaryHeader}>
                <Typography sx={reservationsStyles.actionDialogReservationCode}>
                  {formatReservationCode(reservationPendingCancellation.id)}
                </Typography>

                <ReservationStatusChip
                  status={reservationPendingCancellation.estado}
                />
              </Box>

              <Typography sx={reservationsStyles.actionDialogSummaryMeta}>
                {reservationPendingCancellation.socio.nombre}{" "}
                {reservationPendingCancellation.socio.apellido}
                {" · "}
                {formatGrams(
                  getReservationTotalGrams(reservationPendingCancellation),
                )}
              </Typography>
            </Box>
          )}

          <TextField
            label="Observaciones (opcional)"
            placeholder="Ingresá un motivo o aclaración opcional"
            value={cancellationObservation}
            onChange={(event) => setCancellationObservation(event.target.value)}
            multiline
            minRows={3}
            fullWidth
            disabled={cancellingReservation}
            sx={reservationsStyles.actionDialogTextField}
          />

          {actionError && (
            <Alert severity="error" sx={reservationsStyles.actionDialogAlert}>
              {actionError}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={reservationsStyles.actionDialogActions}>
          <Button
            variant="outlined"
            onClick={handleCloseCancellation}
            disabled={cancellingReservation}
            sx={reservationsStyles.actionDialogSecondaryButton}
          >
            Volver
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<CloseRoundedIcon />}
            onClick={() => void handleConfirmCancellation()}
            disabled={cancellingReservation}
            sx={reservationsStyles.actionDialogDangerButton}
          >
            {cancellingReservation ? "Cancelando..." : "Confirmar cancelación"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CONFIRMACIÓN DE RETIRO */}
      <Dialog
        open={Boolean(reservationPendingWithdrawal)}
        onClose={handleCloseWithdrawal}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: reservationsStyles.actionDialogPaper,
          },
        }}
      >
        <DialogTitle sx={reservationsStyles.actionDialogTitle}>
          <Box sx={reservationsStyles.actionDialogTitleContent}>
            <Box
              sx={{
                ...reservationsStyles.actionDialogIcon,
                ...reservationsStyles.actionDialogIconSuccess,
              }}
            >
              <ShoppingCartRoundedIcon />
            </Box>

            <Box>
              <Typography sx={reservationsStyles.actionDialogTitleText}>
                Registrar retiro
              </Typography>

              <Typography sx={reservationsStyles.actionDialogSubtitle}>
                Confirmación del retiro presencial.
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={reservationsStyles.actionDialogContent}>
          <Typography sx={reservationsStyles.actionDialogDescription}>
            Al confirmar, el sistema generará la venta asociada, consumirá el
            stock reservado y finalizará la reserva.
          </Typography>

          {reservationPendingWithdrawal && (
            <Box sx={reservationsStyles.actionDialogSummary}>
              <Box sx={reservationsStyles.actionDialogSummaryHeader}>
                <Typography sx={reservationsStyles.actionDialogReservationCode}>
                  {formatReservationCode(reservationPendingWithdrawal.id)}
                </Typography>

                <ReservationStatusChip
                  status={reservationPendingWithdrawal.estado}
                />
              </Box>

              <Typography sx={reservationsStyles.actionDialogSummaryMeta}>
                {reservationPendingWithdrawal.socio.nombre}{" "}
                {reservationPendingWithdrawal.socio.apellido}
                {" · "}
                {formatGrams(
                  getReservationTotalGrams(reservationPendingWithdrawal),
                )}
              </Typography>
            </Box>
          )}

          {actionError && (
            <Alert severity="error" sx={reservationsStyles.actionDialogAlert}>
              {actionError}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={reservationsStyles.actionDialogActions}>
          <Button
            variant="outlined"
            onClick={handleCloseWithdrawal}
            disabled={confirmingWithdrawal}
            sx={reservationsStyles.actionDialogSecondaryButton}
          >
            Volver
          </Button>

          <Button
            variant="contained"
            startIcon={<ShoppingCartRoundedIcon />}
            onClick={() => void handleConfirmWithdrawal()}
            disabled={confirmingWithdrawal}
            sx={reservationsStyles.actionDialogPrimaryButton}
          >
            {confirmingWithdrawal ? "Registrando..." : "Confirmar retiro"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}