"use client";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import type { FormEvent } from "react";
import { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import type {
  GetSociosParams,
  SocioStatus,
} from "@/api/sociosApi";

import { membersStyles } from "../members.styles";

export type MembersFilters = Pick<GetSociosParams, "estado">;

type MembersFiltersModalProps = {
  open: boolean;
  filters: MembersFilters;
  onClose: () => void;
  onApply: (filters: MembersFilters) => void;
};

/* =========================================================
   OPCIONES DEL DOMINIO
========================================================= */

const SOCIO_STATUS_OPTIONS: Array<{
  value: SocioStatus;
  label: string;
}> = [
  {
    value: "ACTIVO",
    label: "Activo",
  },
  {
    value: "INACTIVO",
    label: "Inactivo",
  },
  {
    value: "SUSPENDIDO",
    label: "Suspendido",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function normalizeFilters(filters: MembersFilters): MembersFilters {
  return {
    ...(filters.estado ? { estado: filters.estado } : {}),
  };
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Modal de filtros del módulo administrativo de Socios.

Responsabilidades:
- permitir filtrar por estado funcional del socio;
- mantener una copia temporal mientras el modal está abierto;
- aplicar o limpiar filtros mediante callbacks del container;
- preservar una experiencia responsive y accesible.

No realiza solicitudes HTTP.
No pagina resultados.
No filtra colecciones localmente.
No implementa reglas de negocio.
*/
export function MembersFiltersModal({
  open,
  filters,
  onClose,
  onApply,
}: MembersFiltersModalProps) {
  const [draftFilters, setDraftFilters] =
    useState<MembersFilters>(filters);

  const hasDraftFilters = Boolean(draftFilters.estado);

  /*
  Sincroniza la copia temporal al comenzar cada apertura.

  Se ejecuta desde la transición del diálogo para evitar
  derivar estado mediante useEffect y renders encadenados.
  */
  const handleDialogEnter = () => {
    setDraftFilters(normalizeFilters(filters));
  };

  const handleSocioStatusChange = (value: string) => {
    setDraftFilters({
      estado: value ? (value as SocioStatus) : undefined,
    });
  };

  const handleClear = () => {
    setDraftFilters({});
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply(normalizeFilters(draftFilters));
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      aria-labelledby="members-filters-title"
      aria-describedby="members-filters-description"
      onClose={onClose}
      slotProps={{
        transition: {
          onEnter: handleDialogEnter,
        },
        paper: {
          sx: membersStyles.filtersDialog,
        },
      }}
    >
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Box sx={membersStyles.memberFormHeader}>
          <Box sx={membersStyles.memberFormHeaderContent}>
            <DialogTitle
              id="members-filters-title"
              sx={membersStyles.memberFormTitle}
            >
              Filtrar socios
            </DialogTitle>

            <Typography
              id="members-filters-description"
              sx={membersStyles.memberFormSubtitle}
            >
              Refiná el listado por el estado funcional del socio.
            </Typography>
          </Box>

          <IconButton
            aria-label="Cerrar filtros de socios"
            onClick={onClose}
            sx={membersStyles.memberFormCloseButton}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5 }}>
            <Box sx={{ ...membersStyles.memberFormIntro, mb: 0 }}>
              <Box sx={membersStyles.memberFormIntroIcon}>
                <FilterAltOutlinedIcon />
              </Box>

              <Box>
                <Typography sx={membersStyles.memberFormIntroTitle}>
                  Filtro
                </Typography>

                <Typography
                  sx={membersStyles.memberFormIntroDescription}
                >
                  El criterio se aplica sobre el conjunto completo de socios y
                  mantiene la paginación consistente con los resultados.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              ...membersStyles.filtersContent,
              gridTemplateColumns: "minmax(0, 1fr)",
            }}
          >
            <TextField
              select
              fullWidth
              label="Estado del socio"
              value={draftFilters.estado ?? ""}
              onChange={(event) =>
                handleSocioStatusChange(event.target.value)
              }
              helperText="Estado funcional utilizado para operar en el club."
              sx={membersStyles.filterField}
            >
              <MenuItem value="">Todos los estados</MenuItem>

              {SOCIO_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={membersStyles.memberFormActions}>
          <Button
            type="button"
            variant="outlined"
            startIcon={<RestartAltOutlinedIcon />}
            disabled={!hasDraftFilters}
            onClick={handleClear}
            sx={{
              ...membersStyles.memberFormCancelButton,
              mr: {
                sm: "auto",
              },
              borderColor: "divider",
            }}
          >
            Limpiar filtro
          </Button>

          <Button
            type="button"
            variant="text"
            onClick={onClose}
            sx={membersStyles.memberFormCancelButton}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<FilterAltOutlinedIcon />}
            sx={membersStyles.memberFormSubmitButton}
          >
            Aplicar filtro
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}