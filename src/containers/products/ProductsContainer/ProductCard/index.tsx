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

import { Product } from "@/api/productsApi";

import { productsStyles } from "../products.styles";

type ProductCardProps = {
  product: Product;

  /*
  Acción visual de edición.

  La card no abre modales por sí misma
  ni conoce lógica de negocio. Sólo
  notifica al container qué producto
  fue seleccionado.
  */
  onEdit: (product: Product) => void;
};

const unitLabels: Record<string, string> = {
  GRAMOS: "g",
  UNIDADES: "unidades",
};

const formatLabel = (value?: string | null) => {
  if (!value) {
    return "No definido";
  }

  return value
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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
- exponer acción de edición al container;
- mantener ProductsContainer más limpio y enfocado en filtros/listado.

No ejecuta lógica de negocio.
No realiza llamadas al backend.
No administra modales.
*/
export function ProductCard({ product, onEdit }: ProductCardProps) {
  const stockTotal = product.stock?.cantidad_total ?? 0;
  const stockReserved = product.stock?.cantidad_reservada ?? 0;
  const stockAvailable = product.stock?.cantidad_disponible ?? 0;

  const availabilityLevel = getAvailabilityLevel(stockAvailable);
  const unitLabel = unitLabels[product.unidad_medida] ?? product.unidad_medida;

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

        <Tooltip title="Editar producto" arrow>
          <IconButton
            aria-label={`Editar producto ${product.nombre}`}
            onClick={() => onEdit(product)}
            sx={productsStyles.editProductButton}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent sx={productsStyles.productCardContent}>
        <Box sx={productsStyles.productTitleRow}>
          <Typography variant="h6" sx={productsStyles.productName}>
            {product.nombre}
          </Typography>

          <Box sx={productsStyles.productHeaderChips}>
            <Chip
              size="small"
              label={formatLabel(product.genetica)}
              sx={productsStyles.productGeneticsChip}
            />

            <Chip
              size="small"
              label={formatLabel(product.estado)}
              sx={
                product.estado === "ACTIVO"
                  ? productsStyles.productActiveChip
                  : productsStyles.productInactiveChip
              }
            />
          </Box>
        </Box>

        <Typography variant="body2" sx={productsStyles.productDescription}>
          {product.descripcion || "Sin descripción"}
        </Typography>

        <Box sx={productsStyles.productChipGroup}>
          <Chip
            size="small"
            label={formatLabel(product.tipo)}
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
              {stockTotal} {unitLabel}
            </Typography>
          </Box>

          <Box sx={productsStyles.productStat}>
            <Typography variant="caption" sx={productsStyles.productStatLabel}>
              Reservado
            </Typography>

            <Typography variant="body1" sx={productsStyles.productStatValue}>
              {stockReserved} {unitLabel}
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
              {stockAvailable} {unitLabel}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
