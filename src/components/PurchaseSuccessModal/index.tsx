"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";

import { purchaseSuccessModalStyles } from "./PurchaseSuccessModal.styles";

type PurchaseSuccessModalProps = {
  open: boolean;
  purchaseId: number | null;
  providerName: string;
  createdAt: string | null;
  itemsCount: number;
  totalUnits: number;
  totalAmount: number;
  onClose: () => void;
};

const formatCurrency = (value: number) => {
  return value.toLocaleString("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  });
};

/*
Formatea la fecha con un criterio más claro y profesional:
DD/MM/YYYY · HH:mm

Evita formatos ambiguos como "p. m." y mejora la lectura
dentro del resumen de la operación.
*/
const formatDateTime = (value: string | null) => {
  if (!value) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(value))
    .replace(",", " ·");
};

/*
Mantiene consistencia visual con el label del resumen.

Se capitaliza la unidad porque el valor funciona como
dato destacado dentro de una tarjeta de resumen.
*/
const formatItemsCount = (value: number) => {
  return value === 1 ? "1 Semilla" : `${value} Semillas`;
};

/*
Mantiene consistencia visual con el label del resumen.

Se capitaliza la unidad porque el valor funciona como
dato destacado dentro de una tarjeta de resumen.
*/
const formatUnits = (value: number) => {
  return value === 1 ? "1 Unidad" : `${value} Unidades`;
};

/*
Modal de confirmación exitosa de compra.

Responsabilidades:
- mostrar feedback visual luego de registrar una compra;
- resumir la operación realizada;
- reforzar trazabilidad de stock y auditoría;
- mantener PurchasesContainer enfocado en estado y lógica del flujo.

No registra compras.
No modifica stock.
No realiza llamadas al backend.
*/
export function PurchaseSuccessModal({
  open,
  purchaseId,
  providerName,
  createdAt,
  itemsCount,
  totalUnits,
  totalAmount,
  onClose,
}: PurchaseSuccessModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: purchaseSuccessModalStyles.paper,
        },
      }}
    >
      <DialogContent sx={purchaseSuccessModalStyles.content}>
        <Box sx={purchaseSuccessModalStyles.hero}>
          <Box sx={purchaseSuccessModalStyles.iconWrapper}>
            <CheckCircleRoundedIcon sx={purchaseSuccessModalStyles.heroIcon} />
          </Box>

          <Typography component="h2" sx={purchaseSuccessModalStyles.title}>
            Compra registrada con éxito
          </Typography>

          <Typography sx={purchaseSuccessModalStyles.subtitle}>
            El ingreso de semillas fue procesado y el inventario quedó
            actualizado.
          </Typography>
        </Box>

        <Box sx={purchaseSuccessModalStyles.purchaseBadge}>
          <ReceiptLongOutlinedIcon sx={purchaseSuccessModalStyles.badgeIcon} />

          <Box>
            <Typography sx={purchaseSuccessModalStyles.badgeLabel}>
              Compra registrada
            </Typography>

            <Typography sx={purchaseSuccessModalStyles.badgeValue}>
              {purchaseId ? `Compra #${purchaseId}` : "Compra confirmada"}
            </Typography>
          </Box>
        </Box>

        <Box sx={purchaseSuccessModalStyles.summaryGrid}>
          <Box sx={purchaseSuccessModalStyles.summaryItem}>
            <Typography sx={purchaseSuccessModalStyles.summaryLabel}>
              Fecha y hora
            </Typography>

            <Typography sx={purchaseSuccessModalStyles.summaryValue}>
              {formatDateTime(createdAt)}
            </Typography>
          </Box>

          <Box sx={purchaseSuccessModalStyles.summaryItem}>
            <Typography sx={purchaseSuccessModalStyles.summaryLabel}>
              Proveedor
            </Typography>

            <Typography sx={purchaseSuccessModalStyles.summaryValue}>
              {providerName || "Sin proveedor"}
            </Typography>
          </Box>

          <Box sx={purchaseSuccessModalStyles.summaryItem}>
            <Typography sx={purchaseSuccessModalStyles.summaryLabel}>
              Semillas incorporadas
            </Typography>

            <Typography sx={purchaseSuccessModalStyles.summaryValue}>
              {formatItemsCount(itemsCount)}
            </Typography>
          </Box>

          <Box sx={purchaseSuccessModalStyles.summaryItem}>
            <Typography sx={purchaseSuccessModalStyles.summaryLabel}>
              Unidades ingresadas
            </Typography>

            <Typography sx={purchaseSuccessModalStyles.summaryValue}>
              {formatUnits(totalUnits)}
            </Typography>
          </Box>
        </Box>

        <Box sx={purchaseSuccessModalStyles.totalBox}>
          <Box>
            <Typography sx={purchaseSuccessModalStyles.totalLabel}>
              Total registrado
            </Typography>

            <Typography sx={purchaseSuccessModalStyles.totalHint}>
              Costo interno de la compra
            </Typography>
          </Box>

          <Typography sx={purchaseSuccessModalStyles.totalValue}>
            {formatCurrency(totalAmount)}
          </Typography>
        </Box>

        <Box sx={purchaseSuccessModalStyles.traceabilityBox}>
          <Box sx={purchaseSuccessModalStyles.traceabilityItem}>
            <TaskAltRoundedIcon sx={purchaseSuccessModalStyles.checkIcon} />

            <Typography sx={purchaseSuccessModalStyles.traceabilityText}>
              Stock actualizado.
            </Typography>
          </Box>

          <Box sx={purchaseSuccessModalStyles.traceabilityItem}>
            <Inventory2OutlinedIcon sx={purchaseSuccessModalStyles.checkIcon} />

            <Typography sx={purchaseSuccessModalStyles.traceabilityText}>
              Movimiento registrado.
            </Typography>
          </Box>

          <Box sx={purchaseSuccessModalStyles.traceabilityItem}>
            <TaskAltRoundedIcon sx={purchaseSuccessModalStyles.checkIcon} />

            <Typography sx={purchaseSuccessModalStyles.traceabilityText}>
              Auditoría registrada.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={purchaseSuccessModalStyles.actions}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={purchaseSuccessModalStyles.acceptButton}
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}