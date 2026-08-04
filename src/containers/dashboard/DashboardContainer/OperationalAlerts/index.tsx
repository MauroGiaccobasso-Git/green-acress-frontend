import type { ReactNode } from "react";

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";
import Link from "next/link";

import type {
  DashboardAttentionRequired,
  DashboardDeliveryAlert,
  DashboardReservationAlert,
  DashboardStockAlert,
} from "@/api/dashboardApi";

import { dashboardStyles } from "../dashboard.styles";

/* =========================================================
   CONSTANTES
========================================================= */

/*
El Dashboard presenta solamente la información necesaria
para tomar una decisión rápida.

Los totales completos continúan visibles y el administrador
puede ingresar al módulo correspondiente cuando existe
una pantalla administrativa relacionada.
*/
const MAX_VISIBLE_RESERVATIONS = 2;
const MAX_VISIBLE_STOCK_ITEMS = 2;
const MAX_VISIBLE_DELIVERIES = 2;

/* =========================================================
   TIPOS
========================================================= */

type OperationalAlertsProps = {
  attentionRequired: DashboardAttentionRequired | null;

  loading: boolean;
};

type AlertTone = "warning" | "critical" | "error";

type AlertSectionProps = {
  icon: ReactNode;

  title: string;

  countLabel: string;

  description?: string;

  tone: AlertTone;

  href?: string;

  actionLabel?: string;

  children?: ReactNode;
};

/* =========================================================
   HELPERS
========================================================= */

function formatGrams(value: number): string {
  return `${new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)} g`;
}

/*
Las fechas se muestran utilizando la zona horaria oficial
del sistema, independientemente de la configuración local
del dispositivo.
*/
function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Montevideo",
  }).format(date);
}

function formatCount(
  value: number,
  singular: string,
  plural: string,
): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

function getStockReasonLabel(
  alert: DashboardStockAlert,
): string {
  if (alert.motivo === "TODO_RESERVADO") {
    return "Todo el stock se encuentra reservado";
  }

  return "Sin existencias";
}

/*
Ordena visualmente los productos sin alterar la colección
recibida desde backend.

Los productos cuyo stock está completamente reservado se
presentan primero porque requieren revisar compromisos activos.
Luego se ordenan alfabéticamente para mantener estabilidad.
*/
function sortStockAlerts(
  alerts: DashboardStockAlert[],
): DashboardStockAlert[] {
  return [...alerts].sort((first, second) => {
    if (first.motivo !== second.motivo) {
      return first.motivo === "TODO_RESERVADO"
        ? -1
        : 1;
    }

    return first.nombre.localeCompare(
      second.nombre,
      "es-UY",
      {
        sensitivity: "base",
      },
    );
  });
}

/*
Las reservas más próximas a vencer se muestran primero.
*/
function sortReservationAlerts(
  alerts: DashboardReservationAlert[],
): DashboardReservationAlert[] {
  return [...alerts].sort((first, second) => {
    const firstDate = new Date(
      first.fechaLimiteRetiro,
    ).getTime();

    const secondDate = new Date(
      second.fechaLimiteRetiro,
    ).getTime();

    const safeFirstDate = Number.isNaN(firstDate)
      ? Number.POSITIVE_INFINITY
      : firstDate;

    const safeSecondDate = Number.isNaN(secondDate)
      ? Number.POSITIVE_INFINITY
      : secondDate;

    return safeFirstDate - safeSecondDate;
  });
}

/*
Las entregas con actividad más reciente se muestran primero.
*/
function sortDeliveryAlerts(
  alerts: DashboardDeliveryAlert[],
): DashboardDeliveryAlert[] {
  return [...alerts].sort((first, second) => {
    const firstDate = new Date(
      first.fechaUltimoIntento,
    ).getTime();

    const secondDate = new Date(
      second.fechaUltimoIntento,
    ).getTime();

    const safeFirstDate = Number.isNaN(firstDate)
      ? 0
      : firstDate;

    const safeSecondDate = Number.isNaN(secondDate)
      ? 0
      : secondDate;

    return safeSecondDate - safeFirstDate;
  });
}

/* =========================================================
   ACCIÓN DE CADA SECCIÓN
========================================================= */

/*
Muestra una acción únicamente cuando existe una pantalla
administrativa de destino válida.

Las entregas con error permanecen informativas porque el MVP
todavía no dispone de un módulo específico para consultarlas,
filtrarlas o reintentarlas.
*/
function AlertSectionAction({
  href,
  title,
  actionLabel,
}: {
  href?: string;

  title: string;

  actionLabel?: string;
}) {
  if (!href) {
    return null;
  }

  return (
    <Box
      component={Link}
      href={href}
      aria-label={`${actionLabel ?? "Ver detalle"}: ${title}`}
      sx={dashboardStyles.alertSectionAction}
    >
      <ChevronRightRoundedIcon />
    </Box>
  );
}

/* =========================================================
   SECCIÓN REUTILIZABLE
========================================================= */

function AlertSection({
  icon,
  title,
  countLabel,
  description,
  tone,
  href,
  actionLabel,
  children,
}: AlertSectionProps) {
  const toneStyles = {
    warning: {
      icon: dashboardStyles.alertIconWarning,
      count: dashboardStyles.alertCountWarning,
    },
    critical: {
      icon: dashboardStyles.alertIconCritical,
      count: dashboardStyles.alertCountCritical,
    },
    error: {
      icon: dashboardStyles.alertIconError,
      count: dashboardStyles.alertCountError,
    },
  } as const;

  return (
    <Box sx={dashboardStyles.alertSection}>
      <Box sx={dashboardStyles.alertSectionHeader}>
        <Box
          aria-hidden="true"
          sx={{
            ...dashboardStyles.alertIcon,
            ...toneStyles[tone].icon,
          }}
        >
          {icon}
        </Box>

        <Box sx={dashboardStyles.alertHeaderContent}>
          <Typography
            component="h3"
            sx={dashboardStyles.alertTitle}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              ...dashboardStyles.alertCount,
              ...toneStyles[tone].count,
            }}
          >
            {countLabel}
          </Typography>

          {description ? (
            <Typography
              sx={dashboardStyles.alertDescription}
            >
              {description}
            </Typography>
          ) : null}

          {children}
        </Box>

        <AlertSectionAction
          href={href}
          title={title}
          actionLabel={actionLabel}
        />
      </Box>
    </Box>
  );
}

/* =========================================================
   DETALLE DE RESERVAS
========================================================= */

function ReservationAlerts({
  alerts,
}: {
  alerts: DashboardReservationAlert[];
}) {
  if (alerts.length === 0) {
    return null;
  }

  const visibleAlerts = sortReservationAlerts(alerts).slice(
    0,
    MAX_VISIBLE_RESERVATIONS,
  );

  return (
    <Box
      component="ul"
      aria-label="Reservas próximas a vencer"
      sx={dashboardStyles.alertItemsList}
    >
      {visibleAlerts.map((alert) => (
        <Box
          component="li"
          key={alert.reservaId}
          sx={dashboardStyles.alertItem}
        >
          <Box
            component="span"
            sx={dashboardStyles.alertItemTitle}
          >
            Reserva #{alert.reservaId}
          </Box>

          <Box
            component="span"
            sx={dashboardStyles.alertItemMeta}
          >
            {" "}
            — {formatGrams(alert.gramosReservados)}, vence{" "}
            {formatDateTime(alert.fechaLimiteRetiro)}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* =========================================================
   DETALLE DE STOCK
========================================================= */

function StockAlerts({
  alerts,
}: {
  alerts: DashboardStockAlert[];
}) {
  if (alerts.length === 0) {
    return null;
  }

  const visibleAlerts = sortStockAlerts(alerts).slice(
    0,
    MAX_VISIBLE_STOCK_ITEMS,
  );

  return (
    <Box
      component="ul"
      aria-label="Productos sin stock disponible"
      sx={dashboardStyles.alertItemsList}
    >
      {visibleAlerts.map((alert) => (
        <Box
          component="li"
          key={alert.productoId}
          sx={dashboardStyles.alertItem}
        >
          <Box
            component="span"
            sx={dashboardStyles.alertItemTitle}
          >
            {alert.nombre}
          </Box>

          <Box
            component="span"
            sx={dashboardStyles.alertItemMeta}
          >
            {" "}
            — {getStockReasonLabel(alert)}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* =========================================================
   DETALLE DE ENTREGAS
========================================================= */

function DeliveryAlerts({
  alerts,
}: {
  alerts: DashboardDeliveryAlert[];
}) {
  if (alerts.length === 0) {
    return null;
  }

  const visibleAlerts = sortDeliveryAlerts(alerts).slice(
    0,
    MAX_VISIBLE_DELIVERIES,
  );

  return (
    <Box
      component="ul"
      aria-label="Entregas con error"
      sx={dashboardStyles.alertItemsList}
    >
      {visibleAlerts.map((alert) => (
        <Box
          component="li"
          key={alert.entregaId}
          sx={dashboardStyles.alertItem}
        >
          <Box sx={dashboardStyles.alertItemContent}>
            <Typography
              component="span"
              sx={dashboardStyles.alertItemTitle}
            >
              {alert.origen.etiqueta}
            </Typography>

            <Typography
              component="span"
              sx={dashboardStyles.alertItemMeta}
            >
              {" "}
              — {alert.error}
            </Typography>

            <Typography
              sx={dashboardStyles.alertItemSecondaryMeta}
            >
              Último intento:{" "}
              {formatDateTime(alert.fechaUltimoIntento)}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function OperationalAlertsSkeleton() {
  return (
    <Box
      component="section"
      aria-label="Cargando situaciones que requieren atención"
      aria-busy="true"
      sx={dashboardStyles.attentionCard}
    >
      <Skeleton width={210} height={34} />

      <Box sx={dashboardStyles.alertSkeletonList}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Box key={index}>
            <Box sx={dashboardStyles.alertSkeletonItem}>
              <Skeleton
                variant="rounded"
                width={64}
                height={64}
                sx={{
                  borderRadius: "16px",
                  flexShrink: 0,
                }}
              />

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Skeleton width="48%" height={24} />
                <Skeleton width="24%" height={21} />
                <Skeleton width="62%" height={20} />
              </Box>

              {index < 2 ? (
                <Skeleton
                  variant="circular"
                  width={28}
                  height={28}
                />
              ) : null}
            </Box>

            {index < 2 ? (
              <Divider
                sx={dashboardStyles.alertDivider}
              />
            ) : null}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Presenta las situaciones que requieren atención administrativa.

La composición replica la referencia Premium:
- encabezado simple;
- tres bloques compactos;
- iconos semánticos de gran tamaño;
- totales destacados;
- detalle mínimo y accionable;
- divisores completos;
- navegación solo cuando existe una pantalla válida;
- máximo de dos registros visibles por categoría.

No consulta endpoints.
No modifica reservas, stock ni entregas.
No recalcula reglas del dominio.
*/
export default function OperationalAlerts({
  attentionRequired,
  loading,
}: OperationalAlertsProps) {
  if (loading && !attentionRequired) {
    return <OperationalAlertsSkeleton />;
  }

  if (!attentionRequired) {
    return null;
  }

  const {
    reservasProximasVencer,
    floresSinStock,
    entregasConError,
  } = attentionRequired;

  return (
    <Box
      component="section"
      aria-labelledby="operational-alerts-title"
      sx={dashboardStyles.attentionCard}
    >
      <Typography
        id="operational-alerts-title"
        component="h2"
        sx={dashboardStyles.cardTitle}
      >
        Atención requerida
      </Typography>

      <Box sx={dashboardStyles.alertSections}>
        <AlertSection
          icon={<ScheduleRoundedIcon />}
          title="Reservas próximas a vencer"
          countLabel={formatCount(
            reservasProximasVencer.total,
            "reserva",
            "reservas",
          )}
          description="Vencen durante las próximas 24 horas"
          tone="warning"
          href="/admin/reservations"
          actionLabel="Ver reservas"
        >
          <ReservationAlerts
            alerts={reservasProximasVencer.items}
          />
        </AlertSection>

        <Divider sx={dashboardStyles.alertDivider} />

        <AlertSection
          icon={<WarningAmberRoundedIcon />}
          title="Flores sin stock disponible"
          countLabel={formatCount(
            floresSinStock.total,
            "producto",
            "productos",
          )}
          tone="critical"
          href="/admin/stock"
          actionLabel="Ver stock"
        >
          <StockAlerts alerts={floresSinStock.items} />
        </AlertSection>

        <Divider sx={dashboardStyles.alertDivider} />

        <AlertSection
          icon={<ErrorOutlineRoundedIcon />}
          title="Entregas con error"
          countLabel={formatCount(
            entregasConError.total,
            "error",
            "errores",
          )}
          description="Últimos 30 días"
          tone="error"
        >
          <DeliveryAlerts alerts={entregasConError.items} />
        </AlertSection>
      </Box>
    </Box>
  );
}