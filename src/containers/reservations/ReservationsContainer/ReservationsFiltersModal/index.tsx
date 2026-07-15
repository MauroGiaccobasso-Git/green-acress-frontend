import type { Dispatch, SetStateAction } from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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
  a socios y productos con reservas registradas.

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ pr: 7 }}>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: "1.125rem",
            fontWeight: 700,
          }}
        >
          Filtros avanzados
        </Typography>

        <Typography
          component="span"
          sx={{
            display: "block",
            mt: 0.5,
            color: "text.secondary",
            fontSize: "0.875rem",
            fontWeight: 400,
          }}
        >
          Refiná las reservas por socio o producto.
        </Typography>

        <IconButton
          aria-label="Cerrar filtros"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gap: 2.25,
            pt: 1,
          }}
        >
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Socio"
                placeholder="Seleccionar socio"
              />
            )}
          />

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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Producto"
                placeholder="Seleccionar producto"
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          gap: 1,
        }}
      >
        <Button
          variant="text"
          onClick={onClear}
        >
          Limpiar filtros
        </Button>

        <Button
          variant="contained"
          onClick={onApply}
        >
          Aplicar filtros
        </Button>
      </DialogActions>
    </Dialog>
  );
}