import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import { StockItem } from "@/api/stockApi";

import { stockStyles } from "../stock.styles";

/*
Formatea cantidades respetando la unidad operativa
del producto recibido desde el DTO de Stock.
*/
function formatQuantity(value: number, unit: "GRAMOS" | "UNIDADES") {
  const suffix = unit === "GRAMOS" ? "g" : "un.";

  return `${value} ${suffix}`;
}

type StockAdjustmentModalProps = {
  open: boolean;

  selectedStockItem: StockItem | null;

  adjustmentQuantity: string;

  adjustmentObservation: string;

  adjustmentError: string | null;

  adjustmentSuccess: string | null;

  adjustingStock: boolean;

  onClose: () => void;

  onQuantityChange: (value: string) => void;

  onObservationChange: (value: string) => void;

  onSubmit: () => void;
};

/*
Modal de ajuste manual de stock.

Responsabilidades:
- mostrar el producto seleccionado;
- permitir ingresar la cantidad a sumar o restar;
- solicitar una observación obligatoria;
- presentar feedback de error o éxito;
- delegar la acción de guardado al container.

No llama APIs.
No contiene lógica de negocio.
No accede al hook directamente.
*/
export default function StockAdjustmentModal({
  open,
  selectedStockItem,
  adjustmentQuantity,
  adjustmentObservation,
  adjustmentError,
  adjustmentSuccess,
  adjustingStock,
  onClose,
  onQuantityChange,
  onObservationChange,
  onSubmit,
}: StockAdjustmentModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Ajustar stock
        <IconButton
          aria-label="Cerrar ajuste de stock"
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "grid", gap: 2.25, pt: 1 }}>
          {selectedStockItem && (
            <Box>
              <Typography sx={stockStyles.productName}>
                {selectedStockItem.producto.nombre}
              </Typography>

              <Typography sx={stockStyles.productMeta}>
                Stock actual:{" "}
                {formatQuantity(
                  selectedStockItem.cantidad_total,
                  selectedStockItem.producto.unidad_medida,
                )}{" "}
                · Reservado:{" "}
                {formatQuantity(
                  selectedStockItem.cantidad_reservada,
                  selectedStockItem.producto.unidad_medida,
                )}
              </Typography>
            </Box>
          )}

          <TextField
            label="Cantidad a ajustar (+/-)"
            placeholder="Ej: 40 o -15"
            value={adjustmentQuantity}
            onChange={(event) => onQuantityChange(event.target.value)}
            helperText="Ingresá una cantidad positiva para sumar stock o negativa para descontar."
            fullWidth
          />

          <TextField
            label="Observación obligatoria"
            value={adjustmentObservation}
            onChange={(event) => onObservationChange(event.target.value)}
            multiline
            minRows={3}
            fullWidth
          />

          {adjustmentError && (
            <Box sx={stockStyles.errorBox}>{adjustmentError}</Box>
          )}

          {adjustmentSuccess && (
            <Box sx={stockStyles.filtersNotice}>
              <Typography sx={stockStyles.filtersNoticeText}>
                {adjustmentSuccess}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              pt: 1,
            }}
          >
            <Button variant="text" onClick={onClose}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={adjustingStock}
            >
              {adjustingStock ? "Guardando..." : "Guardar ajuste"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}