"use client";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";

import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { useAdminHeaderActions } from "@/layouts/admin/AdminLayout";

import DashboardSummary from "./DashboardSummary";
import OperationalAlerts from "./OperationalAlerts";
import SmartRecommendations from "./SmartRecommendations";
import TopProducts from "./TopProducts";
import { dashboardStyles } from "./dashboard.styles";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const DEFAULT_DEMAND_PERIOD_DAYS = 30;

const DEFAULT_TIME_ZONE = "America/Montevideo";

/* =========================================================
   HELPERS DE FECHA
========================================================= */

/*
Valida la zona horaria enviada por backend.

El fallback evita que un valor inválido rompa
el renderizado completo del Dashboard.
*/
function getSafeTimeZone(timeZone: string): string {
  try {
    new Intl.DateTimeFormat("es-UY", {
      timeZone,
    }).format(new Date());

    return timeZone;
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}

/*
Genera una clave de fecha utilizando la zona horaria
oficial del Dashboard.

Permite determinar si la información fue generada
durante el día actual.
*/
function getDateKey(
  date: Date,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).format(date);
}

/*
Formatea la fecha de generación de manera compacta.

Ejemplos:

Actualizado: hoy, 18:30
Actualizado: 02/08/2026, 17:45
*/
function formatUpdatedAt(
  value: string,
  receivedTimeZone: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Actualización no disponible";
  }

  const timeZone = getSafeTimeZone(receivedTimeZone);
  const currentDate = new Date();

  const isToday =
    getDateKey(date, timeZone) ===
    getDateKey(currentDate, timeZone);

  const formattedTime = new Intl.DateTimeFormat("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);

  if (isToday) {
    return `Actualizado: hoy, ${formattedTime}`;
  }

  const formattedDate = new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).format(date);

  return `Actualizado: ${formattedDate}, ${formattedTime}`;
}

/* =========================================================
   ESTADO DE ERROR INICIAL
========================================================= */

type InitialDashboardErrorProps = {
  message: string;

  onRetry: () => void;
};

function InitialDashboardError({
  message,
  onRetry,
}: InitialDashboardErrorProps) {
  return (
    <Box
      role="alert"
      aria-labelledby="dashboard-error-title"
      sx={dashboardStyles.initialErrorCard}
    >
      <Box
        aria-hidden="true"
        sx={dashboardStyles.initialErrorIcon}
      >
        <ErrorOutlineRoundedIcon />
      </Box>

      <Typography
        id="dashboard-error-title"
        component="h2"
        sx={dashboardStyles.initialErrorTitle}
      >
        No pudimos cargar el Dashboard
      </Typography>

      <Typography sx={dashboardStyles.initialErrorText}>
        {message}
      </Typography>

      <Button
        type="button"
        variant="contained"
        startIcon={<RefreshRoundedIcon />}
        onClick={onRetry}
        sx={dashboardStyles.retryButton}
      >
        Reintentar
      </Button>
    </Box>
  );
}

/* =========================================================
   CONTAINER PRINCIPAL
========================================================= */

/*
Container principal del Dashboard administrativo.

Responsabilidades:
- ejecutar la carga inicial;
- coordinar los datos obtenidos mediante useDashboard;
- presentar el estado global de error;
- conservar datos anteriores ante fallos no bloqueantes;
- integrar la fecha de actualización en el header;
- componer indicadores, alertas, IA y demanda;
- mantener independientes Dashboard y Gemini.

No realiza solicitudes HTTP directas.
No calcula indicadores.
No calcula demanda.
No calcula cantidades de reposición.
No modifica stock, ventas ni reservas.
*/
export default function DashboardContainer() {
  const {
    dashboard,

    recommendations,
    recommendationsGeneratedAt,

    loadingDashboard,
    generatingRecommendations,

    dashboardError,
    recommendationsError,

    hasGeneratedRecommendations,
    recommendationsUnavailable,

    fetchDashboard,
    generateRecommendations,
  } = useDashboard();

  const {
    setHeaderActions,
    clearHeaderActions,
  } = useAdminHeaderActions();

  /* =========================================================
     CARGA INICIAL
  ========================================================= */

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  /* =========================================================
     ACCIÓN CONTEXTUAL DEL HEADER
  ========================================================= */

  /*
  El indicador de actualización pertenece conceptualmente
  al encabezado de la pantalla.

  Se registra cuando existe una respuesta válida y se elimina
  automáticamente cuando el Dashboard se desmonta o cambia
  hacia otra pantalla administrativa.
  */
  useEffect(() => {
    if (!dashboard) {
      clearHeaderActions();

      return;
    }

    const updatedAtLabel = formatUpdatedAt(
      dashboard.generatedAt,
      dashboard.timeZone,
    );

    setHeaderActions(
      <Chip
        icon={<AccessTimeRoundedIcon />}
        label={updatedAtLabel}
        aria-label={updatedAtLabel}
        sx={dashboardStyles.updatedAtChip}
      />,
    );

    return () => {
      clearHeaderActions();
    };
  }, [
    dashboard,
    setHeaderActions,
    clearHeaderActions,
  ]);

  /* =========================================================
     HANDLERS
  ========================================================= */

  const handleRetryDashboard = () => {
    void fetchDashboard();
  };

  /* =========================================================
     ESTADOS DERIVADOS
  ========================================================= */

  /*
  También contempla el primer render anterior al useEffect.

  Evita mostrar una pantalla vacía durante el instante previo
  a que loadingDashboard cambie a true.
  */
  const isInitialLoading =
    !dashboard &&
    (loadingDashboard || !dashboardError);

  const hasBlockingError =
    !dashboard &&
    !loadingDashboard &&
    Boolean(dashboardError);

  const periodDays =
    dashboard?.demanda.periodo.dias ??
    DEFAULT_DEMAND_PERIOD_DAYS;

  const topProducts =
    dashboard?.demanda.productosMasDemandados ?? [];

  /* =========================================================
     ERROR BLOQUEANTE
  ========================================================= */

  if (hasBlockingError && dashboardError) {
    return (
      <Box sx={dashboardStyles.root}>
        <InitialDashboardError
          message={dashboardError}
          onRetry={handleRetryDashboard}
        />
      </Box>
    );
  }

  /* =========================================================
     RENDER PRINCIPAL
  ========================================================= */

  return (
    <Box sx={dashboardStyles.root}>
      <Box sx={dashboardStyles.pageStack}>
        {dashboardError && dashboard ? (
          <Alert
            severity="warning"
            action={
              <Button
                type="button"
                color="inherit"
                size="small"
                startIcon={<RefreshRoundedIcon />}
                onClick={handleRetryDashboard}
                disabled={loadingDashboard}
                sx={{
                  minWidth: "auto",
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Reintentar
              </Button>
            }
            sx={dashboardStyles.nonBlockingAlert}
          >
            No fue posible actualizar el Dashboard. Se continúa
            mostrando la última información disponible.
          </Alert>
        ) : null}

        <DashboardSummary
          summary={dashboard?.resumen ?? null}
          loading={isInitialLoading}
        />

        <Box sx={dashboardStyles.mainGrid}>
          <OperationalAlerts
            attentionRequired={
              dashboard?.atencionRequerida ?? null
            }
            loading={isInitialLoading}
          />

          <SmartRecommendations
            recommendations={recommendations}
            generatedAt={recommendationsGeneratedAt}
            generating={generatingRecommendations}
            error={recommendationsError}
            unavailable={recommendationsUnavailable}
            hasGenerated={hasGeneratedRecommendations}
            onGenerate={generateRecommendations}
          />
        </Box>

        <TopProducts
          products={topProducts}
          periodDays={periodDays}
          loading={isInitialLoading}
        />
      </Box>
    </Box>
  );
}