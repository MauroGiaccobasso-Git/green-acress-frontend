import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";

import { Sale } from "@/api/salesApi";
import { salesStyles } from "../sales.styles";

type SaleDetailModalProps = {
  open: boolean;
  sale: Sale | null;
  loading: boolean;
  onClose: () => void;
};

/*
Modal encargado de mostrar el detalle completo
de una venta registrada.

Responsabilidades:
- presentar datos generales de la venta;
- mostrar socio asociado;
- mostrar administrador responsable;
- listar productos incluidos;
- exponer total, observaciones y trazabilidad.

No realiza llamadas HTTP.
No modifica estado externo.
No contiene reglas de negocio.
*/
export function SaleDetailModal({
  open,
  sale,
  loading,
  onClose,
}: SaleDetailModalProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));

  const saleCode = sale ? `#V-${sale.id.toString().padStart(6, "0")}` : "—";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: salesStyles.saleDetailDialog,
        },
      }}
    >
      <DialogTitle sx={salesStyles.saleDetailHeader}>
        <Box sx={salesStyles.saleDetailHeaderContent}>
          <Box>
            <Typography sx={salesStyles.saleDetailTitle}>
              Detalle de venta
            </Typography>

            <Typography sx={salesStyles.saleDetailSubtitle}>
              Registro de venta {saleCode}
            </Typography>
          </Box>

          {sale && (
            <Chip
              label={sale.estado}
              size="small"
              sx={
                sale.estado === "REGISTRADA"
                  ? salesStyles.registeredChip
                  : salesStyles.cancelledChip
              }
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={salesStyles.saleDetailContent}>
        {loading && (
          <Box sx={salesStyles.loadingBox}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!loading && sale && (
          <Box sx={salesStyles.saleDetailBody}>
            <Box sx={salesStyles.saleDetailSummaryGrid}>
              <Box sx={salesStyles.saleDetailInfoCard}>
                <Typography sx={salesStyles.saleDetailLabel}>
                  Código
                </Typography>

                <Typography sx={salesStyles.saleDetailValue}>
                  {saleCode}
                </Typography>
              </Box>

              <Box sx={salesStyles.saleDetailInfoCard}>
                <Typography sx={salesStyles.saleDetailLabel}>
                  Fecha
                </Typography>

                <Typography sx={salesStyles.saleDetailValue}>
                  {formatDate(sale.fecha)}
                </Typography>
              </Box>

              <Box sx={salesStyles.saleDetailInfoCard}>
                <Typography sx={salesStyles.saleDetailLabel}>
                  Socio
                </Typography>

                <Typography sx={salesStyles.saleDetailValue}>
                  {sale.socio.nombre} {sale.socio.apellido}
                </Typography>

                <Typography sx={salesStyles.saleDetailMuted}>
                  CI: {sale.socio.documento}
                </Typography>
              </Box>

              <Box sx={salesStyles.saleDetailInfoCard}>
                <Typography sx={salesStyles.saleDetailLabel}>
                  Total
                </Typography>

                <Typography sx={salesStyles.saleDetailValueGreen}>
                  {formatCurrency(sale.total)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={salesStyles.divider} />

            <Box sx={salesStyles.saleDetailSection}>
              <Box sx={salesStyles.saleDetailSectionHeader}>
                <Typography sx={salesStyles.saleDetailSectionTitle}>
                  Productos incluidos
                </Typography>

                <Typography sx={salesStyles.saleDetailSectionHint}>
                  Valores registrados al momento de la venta
                </Typography>
              </Box>

              <Box sx={salesStyles.saleDetailTable}>
                <Box sx={salesStyles.saleDetailTableHeader}>
                  <Typography>Producto</Typography>
                  <Typography>THC</Typography>
                  <Typography>Cantidad</Typography>
                  <Typography>Precio unit.</Typography>
                  <Typography>Subtotal</Typography>
                </Box>

                {sale.detalles.map((detail) => (
                  <Box key={detail.id} sx={salesStyles.saleDetailTableRow}>
                    <Box>
                      <Typography sx={salesStyles.saleDetailProductName}>
                        {detail.producto.nombre}
                      </Typography>

                      <Typography sx={salesStyles.saleDetailMuted}>
                        {detail.producto.tipo} · {detail.producto.genetica}
                      </Typography>
                    </Box>

                    <Typography sx={salesStyles.saleDetailTableText}>
                      {detail.producto.porcentaje_thc ?? "—"}%
                    </Typography>

                    <Typography sx={salesStyles.saleDetailTableTextStrong}>
                      {detail.cantidad.toString().replace(".", ",")} g
                    </Typography>

                    <Typography sx={salesStyles.saleDetailTableText}>
                      {formatCurrency(detail.precio_unitario)}
                    </Typography>

                    <Typography sx={salesStyles.subtotalText}>
                      {formatCurrency(detail.subtotal)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider sx={salesStyles.divider} />

            <Box sx={salesStyles.saleDetailFooterGrid}>
              <Box sx={salesStyles.saleDetailObservationBox}>
                <Typography sx={salesStyles.saleDetailLabel}>
                  Observaciones
                </Typography>

                <Typography sx={salesStyles.saleDetailObservationText}>
                  {sale.observaciones || "Sin observaciones registradas."}
                </Typography>
              </Box>

              <Box sx={salesStyles.saleDetailTraceBox}>
                <Typography sx={salesStyles.saleDetailLabel}>
                  Trazabilidad
                </Typography>

                <Typography sx={salesStyles.saleDetailMuted}>
                  Registrada por {sale.usuario.email}
                </Typography>

                <Typography sx={salesStyles.saleDetailMuted}>
                  Registro de venta {saleCode}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={salesStyles.saleDetailActions}>
        <Button onClick={onClose} sx={salesStyles.saleDetailCloseButton}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}