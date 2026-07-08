import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
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

import type { Product } from "@/api/productsApi";

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
Renderiza la representación visual principal del producto.

Criterio UX:
- si existe imagen cargada, se muestra la imagen real;
- si el producto es SEMILLA y no tiene imagen, se muestra una
  representación visual intencional del sistema;
- si el producto es FLOR y no tiene imagen, se mantiene el estado
  informativo "Sin imagen".

De esta forma la ausencia de fotografía en semillas no se comunica
como un error o dato faltante, sino como una decisión propia del dominio.
*/
const renderProductImage = (product: Product, isSeed: boolean) => {
  if (product.imagen_url) {
    return (
      <Box
        component="img"
        src={product.imagen_url}
        alt={product.nombre}
        sx={productsStyles.productImage}
      />
    );
  }

  if (isSeed) {
    return (
      <Box sx={productsStyles.productSeedFallback}>
        <Box sx={productsStyles.productSeedIllustration}>
          <SpaOutlinedIcon sx={productsStyles.productSeedFallbackIcon} />
        </Box>

        <Typography
          variant="caption"
          sx={productsStyles.productSeedFallbackText}
        >
          Semilla
        </Typography>

        <Typography
          variant="caption"
          sx={productsStyles.productSeedFallbackSubtext}
        ></Typography>
      </Box>
    );
  }

  return (
    <Box sx={productsStyles.productImageFallback}>
      <Typography variant="caption" sx={productsStyles.productImageText}>
        Sin imagen
      </Typography>
    </Box>
  );
};

/*
Badge visual del tipo de producto.

Se construye como elemento propio y no como Chip de MUI
para mantener control fino del diseño visual del catálogo.

Permite diferenciar rápidamente productos tipo FLOR y SEMILLA
sin depender únicamente de la imagen o del contenido textual
inferior de la card.
*/
const renderProductTypeBadge = (isSeed: boolean) => {
  const Icon = isSeed ? SpaOutlinedIcon : LocalFloristOutlinedIcon;

  return (
    <Box
      sx={
        isSeed
          ? productsStyles.productTypeSeedBadge
          : productsStyles.productTypeFlowerBadge
      }
    >
      <Icon sx={productsStyles.productTypeBadgeIcon} />

      <Typography variant="caption" sx={productsStyles.productTypeBadgeText}>
        {isSeed ? "Semilla" : "Flor"}
      </Typography>
    </Box>
  );
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
  const isSeed = product.tipo === "SEMILLA";

  const stockTotal = product.stock?.cantidad_total ?? 0;
  const stockReserved = product.stock?.cantidad_reservada ?? 0;
  const stockAvailable = product.stock?.cantidad_disponible ?? 0;

  const availabilityLevel = getAvailabilityLevel(stockAvailable);
  const unitLabel = unitLabels[product.unidad_medida] ?? product.unidad_medida;

  return (
    <Card sx={productsStyles.productCard}>
      <Box sx={productsStyles.productImageWrapper}>
        {renderProductTypeBadge(isSeed)}

        {renderProductImage(product, isSeed)}

        {!isSeed && <Box sx={productsStyles.imageOverlay} />}

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
          {!isSeed && (
            <Box sx={productsStyles.productStat}>
              <Typography
                variant="caption"
                sx={productsStyles.productStatLabel}
              >
                Precio
              </Typography>

              <Typography variant="body1" sx={productsStyles.productStatValue}>
                {formatPrice(product.precio_venta_actual ?? 0)}
              </Typography>
            </Box>
          )}

          <Box sx={productsStyles.productStat}>
            <Typography variant="caption" sx={productsStyles.productStatLabel}>
              Total
            </Typography>

            <Typography variant="body1" sx={productsStyles.productStatValue}>
              {stockTotal} {unitLabel}
            </Typography>
          </Box>

          {!isSeed && (
            <Box sx={productsStyles.productStat}>
              <Typography
                variant="caption"
                sx={productsStyles.productStatLabel}
              >
                Reservado
              </Typography>

              <Typography variant="body1" sx={productsStyles.productStatValue}>
                {stockReserved} {unitLabel}
              </Typography>
            </Box>
          )}

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
