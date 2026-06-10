import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import { productsStyles } from "../products.styles";

type ProductCardProps = {
  product: {
    id: number;
    nombre: string;
    descripcion?: string | null;
    imagen_url?: string | null;
    tipo: string;
    genetica?: string | null;
    porcentaje_thc?: number | null;
    unidad_medida: string;
    precio_venta_actual: number | string;
    estado: string;
    stock?: {
      cantidad_total: number;
      cantidad_reservada: number;
      cantidad_disponible: number;
    } | null;
  };
};

const formatLabel = (value?: string | null) => {
  if (!value) {
    return "No definido";
  }

  return value.toLowerCase().replace("_", " ");
};

const formatPrice = (value: number | string) => {
  return Number(value).toLocaleString("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  });
};

const getAvailabilityLevel = (availableStock: number) => {
  if (availableStock <= 0) return "empty";
  if (availableStock <= 5) return "low";

  return "available";
};

/*
Card visual de producto.

Responsabilidades:
- mostrar imagen, información principal y estado;
- presentar atributos del producto mediante chips;
- mostrar datos de stock de forma clara;
- preparar la acción visual de edición para el futuro modal;
- mantener ProductsContainer más limpio y enfocado en filtros/listado.

No ejecuta lógica de negocio.
No realiza llamadas al backend.
*/
export function ProductCard({ product }: ProductCardProps) {
  const stockTotal = product.stock?.cantidad_total ?? 0;
  const stockReserved = product.stock?.cantidad_reservada ?? 0;
  const stockAvailable = product.stock?.cantidad_disponible ?? 0;

  const availabilityLevel = getAvailabilityLevel(stockAvailable);

  return (
    <Card sx={productsStyles.productCard}>
      <Box sx={productsStyles.productImageWrapper}>
        {product.imagen_url ? (
          <Box
            component="img"
            src={product.imagen_url}
            alt={product.nombre}
            sx={productsStyles.productImage}
          />
        ) : (
          <Box sx={productsStyles.productImageFallback}>
            <Typography variant="caption" sx={productsStyles.productImageText}>
              Sin imagen
            </Typography>
          </Box>
        )}

        <Box sx={productsStyles.imageOverlay} />

        <Chip
          size="small"
          label={formatLabel(product.estado)}
          sx={
            product.estado === "ACTIVO"
              ? productsStyles.activeStatusChip
              : productsStyles.inactiveStatusChip
          }
        />

        <Tooltip title="Editar producto" arrow>
          <IconButton
            aria-label={`Editar producto ${product.nombre}`}
            sx={productsStyles.editProductButton}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent sx={productsStyles.productCardContent}>
        <Box sx={productsStyles.productCardHeader}>
          <Box sx={productsStyles.productTitleGroup}>
            <Typography variant="h6" sx={productsStyles.productName}>
              {product.nombre}
            </Typography>

            <Typography variant="body2" sx={productsStyles.productDescription}>
              {product.descripcion || "Sin descripción"}
            </Typography>
          </Box>
        </Box>

        <Box sx={productsStyles.productChipGroup}>
          <Chip
            size="small"
            label={formatLabel(product.tipo)}
            sx={productsStyles.productInfoChip}
          />

          <Chip
            size="small"
            label={formatLabel(product.genetica)}
            sx={productsStyles.productInfoChip}
          />

          <Chip
            size="small"
            label={
              product.porcentaje_thc !== null &&
              product.porcentaje_thc !== undefined
                ? `THC ${product.porcentaje_thc}%`
                : "Sin THC"
            }
            sx={productsStyles.productInfoChip}
          />
        </Box>

        <Divider sx={productsStyles.productDivider} />

        <Box sx={productsStyles.productStatsGrid}>
          <Box sx={productsStyles.productStat}>
            <Typography variant="caption" sx={productsStyles.productStatLabel}>
              Precio
            </Typography>

            <Typography variant="body1" sx={productsStyles.productStatValue}>
              {formatPrice(product.precio_venta_actual)}
            </Typography>
          </Box>

          <Box sx={productsStyles.productStat}>
            <Typography variant="caption" sx={productsStyles.productStatLabel}>
              Total
            </Typography>

            <Typography variant="body1" sx={productsStyles.productStatValue}>
              {stockTotal} {product.unidad_medida}
            </Typography>
          </Box>

          <Box sx={productsStyles.productStat}>
            <Typography variant="caption" sx={productsStyles.productStatLabel}>
              Reservado
            </Typography>

            <Typography variant="body1" sx={productsStyles.productStatValue}>
              {stockReserved} {product.unidad_medida}
            </Typography>
          </Box>

          <Box
            sx={[
              productsStyles.productAvailableStat,
              availabilityLevel === "low" && productsStyles.productLowStock,
              availabilityLevel === "empty" && productsStyles.productEmptyStock,
            ]}
          >
            <Typography
              variant="caption"
              sx={productsStyles.productAvailableLabel}
            >
              Disponible
            </Typography>

            <Typography variant="h6" sx={productsStyles.productAvailableValue}>
              {stockAvailable} {product.unidad_medida}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}