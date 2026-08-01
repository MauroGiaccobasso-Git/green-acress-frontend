"use client";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import type { Provider } from "@/api/providersApi";

import { providersStyles } from "../providers.styles";

type ProviderStatusModalProps = {
  open: boolean;
  provider: Provider | null;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<Provider | null>;
};

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

function getProviderInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "PR";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0].charAt(0)}${words.at(-1)?.charAt(0) ?? ""}`.toUpperCase();
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Modal de confirmación para el cambio de estado lógico.

Responsabilidades:
- comunicar claramente el impacto de la operación;
- diferenciar activación e inactivación;
- impedir cierres durante la solicitud;
- delegar la operación al Container.

No realiza solicitudes HTTP.
No modifica compras históricas.
No implementa reglas de negocio del backend.
*/
export function ProviderStatusModal({
  open,
  provider,
  submitting,
  onClose,
  onConfirm,
}: ProviderStatusModalProps) {
  if (!open || !provider) {
    return null;
  }

  const isDeactivation = provider.estado === "ACTIVO";

  const nextStatusLabel = isDeactivation ? "Inactivo" : "Activo";

  const title = isDeactivation ? "Inactivar proveedor" : "Activar proveedor";

  const subtitle = isDeactivation
    ? "Confirmá que el proveedor dejará de estar disponible para nuevas compras."
    : "Confirmá que el proveedor volverá a estar disponible para nuevas compras.";

  const confirmLabel = submitting
    ? isDeactivation
      ? "Inactivando..."
      : "Activando..."
    : isDeactivation
      ? "Inactivar proveedor"
      : "Activar proveedor";

  const handleClose = () => {
    if (submitting) {
      return;
    }

    onClose();
  };

  const handleConfirm = async () => {
    const updatedProvider = await onConfirm();

    if (!updatedProvider) {
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: providersStyles.modalPaper,
        },
      }}
    >
      <Box sx={providersStyles.modalHeader}>
        <Box sx={providersStyles.modalHeaderContent}>
          <DialogTitle component="h2" sx={providersStyles.modalTitle}>
            {title}
          </DialogTitle>

          <Typography sx={providersStyles.modalSubtitle}>{subtitle}</Typography>
        </Box>

        <IconButton
          aria-label="Cerrar confirmación"
          onClick={handleClose}
          disabled={submitting}
          sx={providersStyles.modalCloseButton}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={providersStyles.modalContent}>
        <Box sx={providersStyles.statusSummary}>
          <Avatar sx={providersStyles.statusSummaryAvatar}>
            {getProviderInitials(provider.nombre)}
          </Avatar>

          <Box sx={providersStyles.statusSummaryContent}>
            <Typography sx={providersStyles.statusSummaryName}>
              {provider.nombre}
            </Typography>

            <Typography sx={providersStyles.statusSummaryMeta}>
              Estado actual:{" "}
              {provider.estado === "ACTIVO" ? "Activo" : "Inactivo"}
            </Typography>

            <Typography sx={providersStyles.statusSummaryMeta}>
              Nuevo estado: {nextStatusLabel}
            </Typography>
          </Box>
        </Box>

        <Box sx={providersStyles.statusWarning}>
          <WarningAmberOutlinedIcon />

          <Typography sx={providersStyles.statusWarningText}>
            {isDeactivation
              ? "El proveedor se conservará en el sistema por trazabilidad, pero no podrá seleccionarse al registrar nuevas compras. Su historial no será eliminado."
              : "El proveedor volverá a estar disponible para registrar nuevas compras. Sus datos y su historial se mantienen sin modificaciones."}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={providersStyles.modalActions}>
        <Button
          type="button"
          variant="outlined"
          onClick={handleClose}
          disabled={submitting}
          sx={providersStyles.cancelButton}
        >
          Cancelar
        </Button>

        <Button
          type="button"
          variant="contained"
          onClick={handleConfirm}
          disabled={submitting}
          startIcon={
            isDeactivation ? (
              <PauseCircleOutlineOutlinedIcon />
            ) : (
              <CheckCircleOutlineOutlinedIcon />
            )
          }
          sx={
            isDeactivation
              ? providersStyles.dangerButton
              : providersStyles.submitButton
          }
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
