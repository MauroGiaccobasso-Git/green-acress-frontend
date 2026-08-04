import type { Dispatch, SetStateAction } from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import type { ReservationsFilters } from "@/api/reservationsApi";
import type {
  ReservationMemberOption,
  ReservationProductOption,
} from "@/hooks/reservations/useReservations";

import { reservationsStyles } from "../reservations.styles";

/*
Modal de filtros avanzados del módulo Reservas.

Responsabilidades:
- permitir filtrar por socio;
- permitir filtrar por producto;
- permitir aplicar o limpiar filtros avanzados;
- delegar cambios y acciones al Container.

Criterio UX:
- búsqueda, estado y fechas permanecen visibles
  en la pantalla principal;
- el modal utiliza Progressive Disclosure para
  mostrar únicamente filtros secundarios;
- las opciones provienen del hook y corresponden
  a socios y productos con reservas registradas;
- mantiene el mismo patrón visual de los modales
  administrativos Gold del sistema.

No realiza llamadas HTTP.
No conoce la capa API.
No aplica filtros por sí mismo.
No contiene lógica de negocio.
*/
type ReservationsFiltersModalProps = {
  open: boolean;

  filterForm: ReservationsFilters;

  memberOptions: ReservationMemberOption[];

  productOptions: ReservationProductOption[];

  onChange: Dispatch<SetStateAction<ReservationsFilters>>;

  onClose: () => void;

  onClear: () => void;

  onApply: () => void;
};

export default function ReservationsFiltersModal({
  open,
  filterForm,
  memberOptions,
  productOptions,
  onChange,
  onClose,
  onClear,
  onApply,
}: ReservationsFiltersModalProps) {
  const selectedMember =
    memberOptions.find(
      (member) => member.id === filterForm.socioId,
    ) ?? null;

  const selectedProduct =
    productOptions.find(
      (product) => product.id === filterForm.productoId,
    ) ?? null;

  const hasActiveFilters = Boolean(
    filterForm.socioId || filterForm.productoId,
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="reservations-filters-title"
      aria-describedby="reservations-filters-description"
      slotProps={{
        paper: {
          sx: reservationsStyles.reservationsFiltersDialogPaper,
        },
      }}
    >
      <DialogTitle sx={reservationsStyles.reservationsFiltersHeader}>
        <Box sx={reservationsStyles.reservationsFiltersHeaderContent}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              id="reservations-filters-title"
              component="h2"
              sx={reservationsStyles.reservationsFiltersTitle}
            >
              Filtrar reservas
            </Typography>

            <Typography
              id="reservations-filters-description"
              sx={reservationsStyles.reservationsFiltersSubtitle}
            >
              Refiná el listado por socio o producto reservado.
            </Typography>
          </Box>

          <IconButton
            aria-label="Cerrar filtros de reservas"
            onClick={onClose}
            sx={reservationsStyles.reservationsFiltersCloseButton}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={reservationsStyles.reservationsFiltersContent}>
        <Box sx={reservationsStyles.reservationsFiltersInfoCard}>
          <Box sx={reservationsStyles.reservationsFiltersInfoIcon}>
            <FilterAltOutlinedIcon />
          </Box>

          <Box sx={reservationsStyles.reservationsFiltersInfoContent}>
            <Typography sx={reservationsStyles.reservationsFiltersInfoTitle}>
              Criterios complementarios
            </Typography>

            <Typography sx={reservationsStyles.reservationsFiltersInfoText}>
              Estos filtros se combinan con la búsqueda, el estado y las fechas
              definidos en la pantalla principal.
            </Typography>
          </Box>
        </Box>

        <Typography sx={reservationsStyles.reservationsFiltersSectionTitle}>
          Selección avanzada
        </Typography>

        <Box sx={reservationsStyles.reservationsFiltersFieldsGrid}>
          <Box sx={reservationsStyles.reservationsFiltersFieldGroup}>
            <Autocomplete
              options={memberOptions}
              value={selectedMember}
              onChange={(_, member) =>
                onChange((current) => ({
                  ...current,
                  socioId: member?.id,
                }))
              }
              getOptionLabel={(member) =>
                `${member.fullName} · CI ${member.document}`
              }
              isOptionEqualToValue={(option, value) =>
                option.id === value.id
              }
              noOptionsText="No hay socios disponibles"
              sx={reservationsStyles.reservationsFiltersAutocomplete}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Socio"
                  placeholder="Seleccionar socio"
                />
              )}
            />

            <Typography sx={reservationsStyles.reservationsFiltersHelperText}>
              Muestra únicamente reservas asociadas al socio seleccionado.
            </Typography>
          </Box>

          <Box sx={reservationsStyles.reservationsFiltersFieldGroup}>
            <Autocomplete
              options={productOptions}
              value={selectedProduct}
              onChange={(_, product) =>
                onChange((current) => ({
                  ...current,
                  productoId: product?.id,
                }))
              }
              getOptionLabel={(product) => product.name}
              isOptionEqualToValue={(option, value) =>
                option.id === value.id
              }
              noOptionsText="No hay productos disponibles"
              sx={reservationsStyles.reservationsFiltersAutocomplete}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Producto"
                  placeholder="Seleccionar producto"
                />
              )}
            />

            <Typography sx={reservationsStyles.reservationsFiltersHelperText}>
              Filtra por productos que ya aparecen en reservas registradas.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={reservationsStyles.reservationsFiltersActions}>
        <Button
          variant="outlined"
          startIcon={<RestartAltRoundedIcon />}
          disabled={!hasActiveFilters}
          onClick={onClear}
          sx={reservationsStyles.reservationsFiltersClearButton}
        >
          Limpiar filtros
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="text"
            onClick={onClose}
            sx={reservationsStyles.reservationsFiltersCancelButton}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            startIcon={<FilterAltOutlinedIcon />}
            onClick={onApply}
            sx={reservationsStyles.reservationsFiltersApplyButton}
          >
            Aplicar filtros
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}