"use client";

import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

import type {
  NewsDetail,
  NewsStatus,
} from "@/api/newsApi";

import { newsStyles } from "../news.styles";

type NewsDetailPanelProps = {
  news: NewsDetail | null;
  loading: boolean;
  error: string | null;
  updatingStatus: boolean;
  onChangeStatus: (news: NewsDetail) => void;
};

/* =========================================================
   FORMATEADORES
========================================================= */

const dateTimeFormatter = new Intl.DateTimeFormat(
  "es-UY",
  {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Montevideo",
  },
);

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return dateTimeFormatter.format(date);
}

function getNewsInitials(title: string): string {
  const words = title
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "NV";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0].charAt(0)}${
    words.at(-1)?.charAt(0) ?? ""
  }`.toUpperCase();
}

function formatAuthorLabel(email: string): string {
  const localPart = email.split("@")[0]?.trim();

  if (!localPart) {
    return email;
  }

  const normalizedWords = localPart
    .split(/[._-]+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (normalizedWords.length === 0) {
    return email;
  }

  return normalizedWords
    .map(
      (word) =>
        `${word.charAt(0).toUpperCase()}${word
          .slice(1)
          .toLowerCase()}`,
    )
    .join(" ");
}

function getStatusActionLabel(
  status: NewsStatus,
): string {
  return status === "ACTIVA"
    ? "Inactivar novedad"
    : "Reactivar novedad";
}

/* =========================================================
   COMPONENTES INTERNOS
========================================================= */

function NewsStatusChip({
  status,
}: {
  status: NewsStatus;
}) {
  return (
    <Chip
      size="small"
      label={
        status === "ACTIVA"
          ? "Activa"
          : "Inactiva"
      }
      sx={newsStyles.statusChip(status)}
    />
  );
}

type DetailSectionHeadingProps = {
  icon: ReactNode;
  title: string;
};

function DetailSectionHeading({
  icon,
  title,
}: DetailSectionHeadingProps) {
  return (
    <Box sx={newsStyles.sectionHeading}>
      <Box
        aria-hidden="true"
        sx={newsStyles.sectionIconSurface}
      >
        {icon}
      </Box>

      <Typography
        component="h3"
        sx={newsStyles.sectionTitle}
      >
        {title}
      </Typography>
    </Box>
  );
}

type DetailInformationItemProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

function DetailInformationItem({
  label,
  value,
  icon,
}: DetailInformationItemProps) {
  return (
    <Box sx={newsStyles.detailItem}>
      <Typography sx={newsStyles.detailLabel}>
        {label}
      </Typography>

      <Box sx={newsStyles.detailValueRow}>
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            display: "inline-flex",
            alignItems: "center",

            "& svg": newsStyles.detailValueIcon,
          }}
        >
          {icon}
        </Box>

        <Typography sx={newsStyles.detailValue}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

type DeliveryMetricProps = {
  label: string;
  value: number;
  tone:
    | "default"
    | "success"
    | "error"
    | "warning";
};

function DeliveryMetric({
  label,
  value,
  tone,
}: DeliveryMetricProps) {
  return (
    <Box sx={newsStyles.deliveryCard}>
      <Typography sx={newsStyles.deliveryLabel}>
        {label}
      </Typography>

      <Typography sx={newsStyles.deliveryValue(tone)}>
        {value}
      </Typography>
    </Box>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Panel Detail del módulo administrativo de Novedades.

Responsabilidades:
- presentar la novedad seleccionada;
- mostrar publicación, autor y estado;
- representar el contenido completo;
- mostrar el resumen real de entregas;
- iniciar el cambio de estado;
- resolver carga, error y ausencia de selección.

No realiza solicitudes HTTP.
No cambia estados directamente.
No inventa eventos de auditoría no expuestos por backend.
*/
export function NewsDetailPanel({
  news,
  loading,
  error,
  updatingStatus,
  onChangeStatus,
}: NewsDetailPanelProps) {
  const showInitialLoading =
    loading && !news;

  if (showInitialLoading) {
    return (
      <Box
        component="section"
        aria-label="Detalle de la novedad"
        aria-busy="true"
        sx={{
          ...newsStyles.panel,
          ...newsStyles.detailPanel,
        }}
      >
        <Box sx={newsStyles.detailLoading}>
          <CircularProgress
            size={34}
            thickness={4}
            aria-hidden="true"
          />

          <Typography sx={newsStyles.loadingText}>
            Cargando detalle de la novedad...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error && !news) {
    return (
      <Box
        component="section"
        aria-labelledby="news-detail-error-title"
        sx={{
          ...newsStyles.panel,
          ...newsStyles.detailPanel,
        }}
      >
        <Box sx={newsStyles.stateContainer}>
          <Box sx={newsStyles.stateIconSurface}>
            <ErrorOutlineRoundedIcon />
          </Box>

          <Typography
            id="news-detail-error-title"
            component="h2"
            sx={newsStyles.stateTitle}
          >
            No se pudo cargar el detalle
          </Typography>

          <Typography sx={newsStyles.stateDescription}>
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!news) {
    return (
      <Box
        component="section"
        aria-labelledby="news-detail-empty-title"
        sx={{
          ...newsStyles.panel,
          ...newsStyles.detailPanel,
        }}
      >
        <Box sx={newsStyles.stateContainer}>
          <Box sx={newsStyles.stateIconSurface}>
            <CampaignOutlinedIcon />
          </Box>

          <Typography
            id="news-detail-empty-title"
            component="h2"
            sx={newsStyles.stateTitle}
          >
            Seleccioná una novedad
          </Typography>

          <Typography sx={newsStyles.stateDescription}>
            Elegí una novedad del listado para consultar su
            contenido, estado y resultado de notificaciones.
          </Typography>
        </Box>
      </Box>
    );
  }

  const isInactive =
    news.estado === "INACTIVA";

  const authorLabel = formatAuthorLabel(
    news.usuario.email,
  );

  const publicationDate = formatDateTime(
    news.fecha_creacion,
  );

  const updateDate = formatDateTime(
    news.fecha_actualizacion,
  );

  /*
  Fallback defensivo para evitar una caída visual
  si una respuesta antigua no incluye el resumen.
  */
  const deliverySummary =
    news.resumenEntregas ?? {
      total: news.cantidadNotificaciones,
      enviadas: 0,
      errores: 0,
      pendientes: news.cantidadNotificaciones,
    };

  const statusActionLabel =
    getStatusActionLabel(news.estado);

  return (
    <Box
      component="section"
      aria-labelledby="news-detail-title"
      aria-busy={loading || updatingStatus}
      sx={{
        ...newsStyles.panel,
        ...newsStyles.detailPanel,
      }}
    >
      {/* =====================================================
          ENCABEZADO
      ====================================================== */}

      <Box sx={newsStyles.panelHeader}>
        <Box sx={newsStyles.panelHeaderContent}>
          <Typography
            id="news-detail-title"
            component="h2"
            sx={newsStyles.panelTitle}
          >
            Detalle de la novedad
          </Typography>

          <Typography sx={newsStyles.panelHint}>
            Información completa y gestión de la novedad
            seleccionada.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Box sx={{ px: 2.25, pt: 1.75 }}>
          <Alert
            severity="error"
            sx={newsStyles.alert}
          >
            {error}
          </Alert>
        </Box>
      )}

      <Box sx={newsStyles.detailContent}>
        {/* ===================================================
            IDENTIDAD Y ACCIÓN
        ==================================================== */}

        <Box sx={newsStyles.detailHero}>
          <Box sx={newsStyles.detailIdentity}>
            <Avatar
              aria-hidden="true"
              sx={newsStyles.detailAvatar(isInactive)}
            >
              {getNewsInitials(news.titulo)}
            </Avatar>

            <Box sx={newsStyles.detailIdentityText}>
              <Typography
                component="h3"
                sx={newsStyles.detailTitle}
              >
                {news.titulo}
              </Typography>

              <Typography sx={newsStyles.detailMeta}>
                Publicada el {publicationDate}
              </Typography>

              <Box sx={newsStyles.detailStatusRow}>
                <NewsStatusChip
                  status={news.estado}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={newsStyles.detailActions}>
            <Button
              type="button"
              variant="outlined"
              startIcon={
                <PublishedWithChangesOutlinedIcon />
              }
              disabled={
                updatingStatus ||
                loading
              }
              onClick={() =>
                onChangeStatus(news)
              }
              sx={newsStyles.secondaryActionButton}
            >
              {statusActionLabel}
            </Button>
          </Box>
        </Box>

        {/* ===================================================
            INFORMACIÓN GENERAL
        ==================================================== */}

        <Box sx={newsStyles.detailSection}>
          <DetailSectionHeading
            icon={<InfoOutlinedIcon />}
            title="Información general"
          />

          <Box sx={newsStyles.informationGrid}>
            <DetailInformationItem
              label="Fecha de publicación"
              value={publicationDate}
              icon={<CalendarMonthOutlinedIcon />}
            />

            <DetailInformationItem
              label="Última actualización"
              value={updateDate}
              icon={<UpdateOutlinedIcon />}
            />

            <DetailInformationItem
              label="Autor responsable"
              value={authorLabel}
              icon={<PersonOutlineRoundedIcon />}
            />

            <Box sx={newsStyles.detailItem}>
              <Typography sx={newsStyles.detailLabel}>
                Estado
              </Typography>

              <Box sx={newsStyles.detailValueRow}>
                <NewsStatusChip
                  status={news.estado}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ===================================================
            CONTENIDO
        ==================================================== */}

        <Box sx={newsStyles.detailSection}>
          <DetailSectionHeading
            icon={<ArticleOutlinedIcon />}
            title="Contenido"
          />

          <Typography sx={newsStyles.contentText}>
            {news.contenido}
          </Typography>
        </Box>

        {/* ===================================================
            NOTIFICACIONES
        ==================================================== */}

        <Box sx={newsStyles.detailSection}>
          <DetailSectionHeading
            icon={<NotificationsNoneOutlinedIcon />}
            title="Notificaciones"
          />

          <Box sx={newsStyles.deliveryGrid}>
            <DeliveryMetric
              label="Destinatarios válidos"
              value={deliverySummary.total}
              tone="default"
            />

            <DeliveryMetric
              label="Enviadas"
              value={deliverySummary.enviadas}
              tone="success"
            />

            <DeliveryMetric
              label="Errores"
              value={deliverySummary.errores}
              tone="error"
            />

            <DeliveryMetric
              label="Pendientes"
              value={deliverySummary.pendientes}
              tone="warning"
            />
          </Box>
        </Box>

        {/* ===================================================
            INFORMACIÓN FUNCIONAL
        ==================================================== */}

        <Box sx={newsStyles.informationBanner}>
          <InfoOutlinedIcon aria-hidden="true" />

          <Typography
            sx={newsStyles.informationBannerText}
          >
            Cambiar el estado de la novedad no reenvía las
            notificaciones a los socios.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}