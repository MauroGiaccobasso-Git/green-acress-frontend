"use client";

import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

import type { NewsStatus } from "@/api/newsApi";

import { newsStyles } from "../news.styles";

type NewsStatusFilter = NewsStatus | null;

type NewsFiltersModalProps = {
  open: boolean;
  selectedStatus: NewsStatusFilter;
  onSelectStatus: (status: NewsStatusFilter) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
};

type FilterOption = {
  value: NewsStatusFilter;
  title: string;
  description: string;
  icon: ReactNode;
};

const FILTER_OPTIONS: FilterOption[] = [
  {
    value: null,
    title: "Todos los estados",
    description:
      "Mostrá novedades activas e inactivas en el mismo listado.",
    icon: <CampaignOutlinedIcon />,
  },
  {
    value: "ACTIVA",
    title: "Novedades activas",
    description:
      "Mostrá únicamente las novedades visibles en el Portal Socio.",
    icon: <VisibilityOutlinedIcon />,
  },
  {
    value: "INACTIVA",
    title: "Novedades inactivas",
    description:
      "Mostrá las novedades retiradas temporalmente del Portal Socio.",
    icon: <VisibilityOffOutlinedIcon />,
  },
];

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Modal de filtros del módulo administrativo de Novedades.

Responsabilidades:
- permitir seleccionar un filtro por estado;
- diferenciar visualmente la opción seleccionada;
- comunicar aplicar, limpiar y cancelar;
- mantener el estado controlado por el Container.

No realiza solicitudes HTTP.
No administra búsqueda.
No modifica novedades.
No contiene reglas críticas de negocio.
*/
export function NewsFiltersModal({
  open,
  selectedStatus,
  onSelectStatus,
  onApply,
  onClear,
  onClose,
}: NewsFiltersModalProps) {
  const hasSelectedFilter = selectedStatus !== null;

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
      onClose={onClose}
      aria-labelledby="news-filters-dialog-title"
      aria-describedby="news-filters-dialog-description"
      slotProps={{
        paper: {
          sx: newsStyles.modalPaper,
        },
      }}
    >
      <Box sx={newsStyles.modalHeader}>
        <Box sx={newsStyles.modalHeaderContent}>
          <DialogTitle
            id="news-filters-dialog-title"
            component="h2"
            sx={newsStyles.modalTitle}
          >
            Filtrar novedades
          </DialogTitle>

          <Typography
            id="news-filters-dialog-description"
            sx={newsStyles.modalSubtitle}
          >
            Seleccioná el estado de las novedades que querés
            consultar.
          </Typography>
        </Box>

        <IconButton
          type="button"
          aria-label="Cerrar filtros de novedades"
          onClick={onClose}
          sx={newsStyles.modalCloseButton}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <DialogContent sx={newsStyles.modalContent}>
        <Box
          role="group"
          aria-label="Estados disponibles"
          sx={newsStyles.filterOptions}
        >
          {FILTER_OPTIONS.map((option) => {
            const selected =
              selectedStatus === option.value;

            return (
              <ButtonBase
                key={option.value ?? "TODAS"}
                component="button"
                type="button"
                disableRipple
                aria-pressed={selected}
                aria-label={option.title}
                onClick={() =>
                  onSelectStatus(option.value)
                }
                sx={newsStyles.filterOption(selected)}
              >
                <Box
                  aria-hidden="true"
                  sx={newsStyles.filterOptionIcon(selected)}
                >
                  {option.icon}
                </Box>

                <Box sx={newsStyles.filterOptionContent}>
                  <Typography
                    component="span"
                    sx={newsStyles.filterOptionTitle}
                  >
                    {option.title}
                  </Typography>

                  <Typography
                    component="span"
                    sx={newsStyles.filterOptionDescription}
                  >
                    {option.description}
                  </Typography>
                </Box>

                {selected && (
                  <Box
                    aria-hidden="true"
                    sx={newsStyles.filterSelectedIndicator}
                  >
                    <CheckRoundedIcon />
                  </Box>
                )}
              </ButtonBase>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={newsStyles.modalActions}>
        <Button
          type="button"
          disabled={!hasSelectedFilter}
          onClick={onClear}
          sx={newsStyles.cancelButton}
        >
          Limpiar filtro
        </Button>

        <Button
          type="button"
          variant="contained"
          onClick={onApply}
          sx={newsStyles.submitButton}
        >
          Aplicar filtro
        </Button>
      </DialogActions>
    </Dialog>
  );
}