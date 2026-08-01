"use client";

import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
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

import type { ProviderStatus } from "@/api/providersApi";

import { providersStyles } from "../providers.styles";

type ProviderStatusFilter = ProviderStatus | "TODOS";

type ProviderFiltersModalProps = {
  open: boolean;
  value: ProviderStatusFilter;
  onClose: () => void;
  onApply: (value: ProviderStatusFilter) => void;
};

type ProviderFiltersModalContentProps = Omit<
  ProviderFiltersModalProps,
  "open"
>;

type FilterOption = {
  value: ProviderStatusFilter;
  title: string;
  description: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  {
    value: "TODOS",
    title: "Todos los proveedores",
    description:
      "Muestra proveedores activos e inactivos.",
  },
  {
    value: "ACTIVO",
    title: "Proveedores activos",
    description:
      "Disponibles para registrar nuevas compras.",
  },
  {
    value: "INACTIVO",
    title: "Proveedores inactivos",
    description:
      "Conservados por trazabilidad y no disponibles para nuevas compras.",
  },
];

/*
Contenido interno del modal.

Se monta nuevamente cada vez que el modal se abre,
por lo que el filtro temporal siempre comienza con
el valor aplicado actualmente.
*/
function ProviderFiltersModalContent({
  value,
  onClose,
  onApply,
}: ProviderFiltersModalContentProps) {
  const [selectedValue, setSelectedValue] =
    useState<ProviderStatusFilter>(value);

  const handleApply = () => {
    onApply(selectedValue);
  };

  const handleClear = () => {
    setSelectedValue("TODOS");
  };

  return (
    <Dialog
      open
      onClose={onClose}
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
          <DialogTitle
            component="h2"
            sx={providersStyles.modalTitle}
          >
            Filtrar proveedores
          </DialogTitle>

          <Typography sx={providersStyles.modalSubtitle}>
            Seleccioná el estado operativo que querés visualizar.
          </Typography>
        </Box>

        <IconButton
          aria-label="Cerrar filtros"
          onClick={onClose}
          sx={providersStyles.modalCloseButton}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={providersStyles.modalContent}>
        <Box sx={providersStyles.filterOptions}>
          {FILTER_OPTIONS.map((option) => {
            const isSelected =
              selectedValue === option.value;

            return (
              <ButtonBase
                key={option.value}
                component="button"
                type="button"
                disableRipple
                aria-pressed={isSelected}
                onClick={() =>
                  setSelectedValue(option.value)
                }
                sx={providersStyles.filterOption(
                  isSelected,
                )}
              >
                <Box sx={providersStyles.filterOptionText}>
                  <Typography
                    sx={providersStyles.filterOptionTitle}
                  >
                    {option.title}
                  </Typography>

                  <Typography
                    sx={
                      providersStyles.filterOptionDescription
                    }
                  >
                    {option.description}
                  </Typography>
                </Box>

                <Box
                  aria-hidden="true"
                  sx={providersStyles.filterOptionIndicator(
                    isSelected,
                  )}
                />
              </ButtonBase>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={providersStyles.modalActions}>
        <Button
          type="button"
          variant="outlined"
          onClick={handleClear}
          disabled={selectedValue === "TODOS"}
          sx={providersStyles.cancelButton}
        >
          Limpiar
        </Button>

        <Button
          type="button"
          variant="contained"
          startIcon={<FilterAltOutlinedIcon />}
          onClick={handleApply}
          sx={providersStyles.submitButton}
        >
          Aplicar filtros
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/*
Modal encargado únicamente de seleccionar
el filtro administrativo por estado.

No consulta backend.
No modifica proveedores.
El Container aplica el valor seleccionado.
*/
export function ProviderFiltersModal({
  open,
  value,
  onClose,
  onApply,
}: ProviderFiltersModalProps) {
  if (!open) {
    return null;
  }

  return (
    <ProviderFiltersModalContent
      value={value}
      onClose={onClose}
      onApply={onApply}
    />
  );
}