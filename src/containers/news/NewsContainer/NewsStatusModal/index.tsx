"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import type {
  News,
  NewsStatus,
} from "@/api/newsApi";

import { newsStyles } from "../news.styles";

type NewsStatusModalProps = {
  open: boolean;
  news: News | null;
  updating: boolean;
  error: string | null;
  onSubmit: (
    newsId: number,
    targetStatus: NewsStatus,
  ) => Promise<boolean>;
  onClose: () => void;
  onClearError: () => void;
};

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

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

function getTargetStatus(
  currentStatus: NewsStatus,
): NewsStatus {
  return currentStatus === "ACTIVA"
    ? "INACTIVA"
    : "ACTIVA";
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Modal de cambio de estado del módulo Novedades.

Responsabilidades:
- confirmar activación o inactivación;
- explicar el impacto funcional de la operación;
- informar que una reactivación no reenvía correos;
- bloquear el cierre durante la actualización;
- representar errores funcionales del backend.

No realiza solicitudes HTTP.
No modifica datos directamente.
No permite seleccionar estados arbitrarios.
No contiene reglas críticas de negocio.
*/
export function NewsStatusModal({
  open,
  news,
  updating,
  error,
  onSubmit,
  onClose,
  onClearError,
}: NewsStatusModalProps) {
  if (!news) {
    return null;
  }

  const targetStatus = getTargetStatus(news.estado);
  const isActivation = targetStatus === "ACTIVA";

  const actionTitle = isActivation
    ? "Reactivar novedad"
    : "Inactivar novedad";

  const actionDescription = isActivation
    ? "La novedad volverá a estar visible para los socios."
    : "La novedad dejará de estar visible para los socios.";

  const actionButtonLabel = isActivation
    ? "Reactivar novedad"
    : "Inactivar novedad";

  const handleClose = () => {
    if (updating) {
      return;
    }

    onClearError();
    onClose();
  };

  const handleSubmit = async () => {
    if (updating) {
      return;
    }

    const updated = await onSubmit(
      news.id,
      targetStatus,
    );

    if (!updated) {
      return;
    }

    onClearError();
    onClose();
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
      onClose={(_, reason) => {
        if (
          reason === "backdropClick" ||
          reason === "escapeKeyDown"
        ) {
          handleClose();
        }
      }}
      aria-labelledby="news-status-dialog-title"
      aria-describedby="news-status-dialog-description"
      slotProps={{
        paper: {
          sx: newsStyles.modalPaper,
        },
      }}
    >
      <Box sx={newsStyles.modalHeader}>
        <Box sx={newsStyles.modalHeaderContent}>
          <DialogTitle
            id="news-status-dialog-title"
            component="h2"
            sx={newsStyles.modalTitle}
          >
            {actionTitle}
          </DialogTitle>

          <Typography
            id="news-status-dialog-description"
            sx={newsStyles.modalSubtitle}
          >
            {actionDescription}
          </Typography>
        </Box>

        <IconButton
          type="button"
          aria-label="Cerrar cambio de estado"
          disabled={updating}
          onClick={handleClose}
          sx={newsStyles.modalCloseButton}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <DialogContent sx={newsStyles.modalContent}>
        {error && (
          <Alert
            severity="error"
            sx={{
              ...newsStyles.alert,
              mb: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={newsStyles.statusSummary}>
          <Avatar
            aria-hidden="true"
            sx={newsStyles.newsAvatar(
              news.estado === "INACTIVA",
            )}
          >
            {getNewsInitials(news.titulo)}
          </Avatar>

          <Box sx={newsStyles.statusSummaryContent}>
            <Typography
              component="h3"
              sx={newsStyles.statusSummaryTitle}
            >
              {news.titulo}
            </Typography>

            <Typography sx={newsStyles.statusSummaryMeta}>
              Estado actual:{" "}
              {news.estado === "ACTIVA"
                ? "Activa"
                : "Inactiva"}
            </Typography>
          </Box>
        </Box>

        <Box sx={newsStyles.statusWarning(isActivation)}>
          {isActivation ? (
            <InfoOutlinedIcon aria-hidden="true" />
          ) : (
            <WarningAmberRoundedIcon aria-hidden="true" />
          )}

          <Typography sx={newsStyles.statusWarningText}>
            {isActivation
              ? "La novedad volverá a mostrarse en el Portal Socio. La reactivación no genera nuevas notificaciones ni reenvía los correos existentes."
              : "La novedad dejará de mostrarse en el Portal Socio. El registro, las notificaciones y las entregas existentes se conservarán para mantener la trazabilidad."}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={newsStyles.modalActions}>
        <Button
          type="button"
          disabled={updating}
          onClick={handleClose}
          sx={newsStyles.cancelButton}
        >
          Cancelar
        </Button>

        <Button
          type="button"
          variant="contained"
          disabled={updating}
          startIcon={
            updating ? (
              <CircularProgress
                size={17}
                thickness={5}
                color="inherit"
              />
            ) : isActivation ? (
              <VisibilityOutlinedIcon />
            ) : (
              <VisibilityOffOutlinedIcon />
            )
          }
          onClick={handleSubmit}
          sx={
            isActivation
              ? newsStyles.submitButton
              : newsStyles.dangerButton
          }
        >
          {updating
            ? "Actualizando..."
            : actionButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}