import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import {
  Box,
  Chip,
  Skeleton,
  Typography,
} from "@mui/material";

import type { DashboardTopProduct } from "@/api/dashboardApi";

import DashboardProductImage from "../DashboardProductImage";
import { dashboardStyles } from "../dashboard.styles";

/* =========================================================
   TIPOS
========================================================= */

type TopProductsProps = {
  products: DashboardTopProduct[];

  periodDays: number;

  loading: boolean;
};

type AvailabilityTone =
  | "healthy"
  | "warning"
  | "critical"
  | "inactive";

/* =========================================================
   HELPERS DE FORMATO
========================================================= */

function formatGrams(value: number): string {
  return `${new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)} g`;
}

/*
Clasificación exclusivamente visual.

No reemplaza ninguna regla de stock del backend:

- sin disponibilidad: stock menor o igual a cero;
- disponibilidad baja: stock inferior a la demanda reciente;
- disponible: stock suficiente frente a la demanda observada;
- inactivo: producto fuera de operación.
*/
function getAvailabilityTone(
  product: DashboardTopProduct,
): AvailabilityTone {
  if (product.estado === "INACTIVO") {
    return "inactive";
  }

  if (product.cantidadDisponible <= 0) {
    return "critical";
  }

  if (product.cantidadDisponible < product.demandaTotal) {
    return "warning";
  }

  return "healthy";
}

function getAvailabilityLabel(
  tone: AvailabilityTone,
): string {
  const labels: Record<AvailabilityTone, string> = {
    healthy: "Disponible",
    warning: "Disponibilidad baja",
    critical: "Sin disponibilidad",
    inactive: "Producto inactivo",
  };

  return labels[tone];
}

function getAvailabilityStyles(
  tone: Exclude<AvailabilityTone, "healthy">,
) {
  if (tone === "critical") {
    return dashboardStyles.topProductsAvailabilityCritical;
  }

  if (tone === "warning") {
    return dashboardStyles.topProductsAvailabilityWarning;
  }

  return dashboardStyles.topProductsAvailabilityInactive;
}

/* =========================================================
   CELDA DE MÉTRICA
========================================================= */

function MetricCell({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <Box
      role="cell"
      sx={dashboardStyles.topProductsMetricCell}
    >
      <Typography
        aria-hidden="true"
        sx={dashboardStyles.topProductsMobileLabel}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          ...dashboardStyles.topProductsMetricValue,
          ...(emphasized
            ? dashboardStyles.topProductsDemandValue
            : {}),
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/* =========================================================
   DISPONIBILIDAD
========================================================= */

function AvailabilityCell({
  product,
}: {
  product: DashboardTopProduct;
}) {
  const tone = getAvailabilityTone(product);

  const formattedAvailability = formatGrams(
    product.cantidadDisponible,
  );

  const availabilityLabel = getAvailabilityLabel(tone);

  return (
    <Box
      role="cell"
      sx={dashboardStyles.topProductsAvailabilityCell}
    >
      <Typography
        aria-hidden="true"
        sx={dashboardStyles.topProductsMobileLabel}
      >
        Disponible
      </Typography>

      {tone === "healthy" ? (
        <Typography
          aria-label={`${formattedAvailability} disponibles`}
          sx={dashboardStyles.topProductsAvailabilityHealthyValue}
        >
          {formattedAvailability}
        </Typography>
      ) : (
        <Chip
          size="small"
          label={formattedAvailability}
          aria-label={`${formattedAvailability} disponibles. ${availabilityLabel}`}
          sx={{
            ...dashboardStyles.topProductsAvailabilityChip,
            ...getAvailabilityStyles(tone),
          }}
        />
      )}
    </Box>
  );
}

/* =========================================================
   FILA DE PRODUCTO
========================================================= */

function ProductRow({
  product,
  periodDays,
}: {
  product: DashboardTopProduct;
  periodDays: number;
}) {
  return (
    <Box
      role="row"
      sx={dashboardStyles.topProductsRow}
    >
      <Box
        role="cell"
        sx={dashboardStyles.topProductsProductCell}
      >
        <DashboardProductImage
          src={product.imagenUrl}
          alt={product.nombre}
          variant="topProduct"
        />

        <Box
          sx={dashboardStyles.topProductsProductIdentity}
        >
          <Typography
            component="h3"
            sx={dashboardStyles.topProductsProductName}
          >
            {product.nombre}
          </Typography>

          <Typography
            sx={dashboardStyles.topProductsProductMeta}
          >
            {product.estado === "ACTIVO"
              ? "Activo"
              : "Inactivo"}
          </Typography>
        </Box>
      </Box>

      <MetricCell
        label={`Vendidos ${periodDays} días`}
        value={formatGrams(product.gramosVendidos)}
      />

      <MetricCell
        label="Reservados"
        value={formatGrams(product.gramosReservados)}
      />

      <MetricCell
        label="Demanda total"
        value={formatGrams(product.demandaTotal)}
        emphasized
      />

      <AvailabilityCell product={product} />
    </Box>
  );
}

/* =========================================================
   ESTADO VACÍO
========================================================= */

function EmptyProductsState({
  periodDays,
}: {
  periodDays: number;
}) {
  return (
    <Box sx={dashboardStyles.topProductsEmptyState}>
      <Box
        aria-hidden="true"
        sx={dashboardStyles.topProductsEmptyIcon}
      >
        <TrendingUpRoundedIcon />
      </Box>

      <Typography
        sx={dashboardStyles.topProductsEmptyTitle}
      >
        Todavía no hay demanda registrada
      </Typography>

      <Typography
        sx={dashboardStyles.topProductsEmptyText}
      >
        No se registraron ventas ni reservas durante los últimos{" "}
        {periodDays} días.
      </Typography>
    </Box>
  );
}

/* =========================================================
   ESTADO DE CARGA
========================================================= */

function TopProductsSkeleton() {
  return (
    <Box
      component="section"
      aria-label="Cargando productos con mayor demanda"
      sx={dashboardStyles.topProductsCard}
    >
      <Box sx={dashboardStyles.topProductsHeader}>
        <Box sx={{ flex: 1 }}>
          <Skeleton width={280} height={32} />
          <Skeleton width="58%" height={20} />
        </Box>

        <Skeleton
          variant="rounded"
          width={124}
          height={32}
          sx={{ borderRadius: "999px" }}
        />
      </Box>

      <Box sx={dashboardStyles.topProductsSkeletonList}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            sx={dashboardStyles.topProductsSkeletonRow}
          >
            <Box
              sx={dashboardStyles.topProductsProductCell}
            >
              <Skeleton
                variant="rounded"
                width={48}
                height={48}
                sx={{
                  borderRadius: "13px",
                  flexShrink: 0,
                }}
              />

              <Box sx={{ flex: 1 }}>
                <Skeleton width="68%" height={21} />
                <Skeleton width="32%" height={17} />
              </Box>
            </Box>

            {Array.from({ length: 4 }).map(
              (_, metricIndex) => (
                <Skeleton
                  key={metricIndex}
                  width={58}
                  height={22}
                />
              ),
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Presenta los productos con mayor demanda reciente.

Responsabilidades:
- mostrar exclusivamente los resultados agregados por backend;
- adaptar la tabla desktop a tarjetas legibles en mobile;
- informar ventas, reservas, demanda y disponibilidad;
- mostrar la fotografía real del producto cuando esté disponible;
- utilizar un fallback seguro cuando la imagen falte o falle;
- aplicar una jerarquía visual sin inventar reglas de negocio;
- contemplar carga inicial y ausencia válida de resultados;
- informar claramente el período analizado;
- evitar desplazamiento horizontal global.

No consulta endpoints.
No calcula demanda.
No modifica inventario.
*/
export default function TopProducts({
  products,
  periodDays,
  loading,
}: TopProductsProps) {
  if (loading && products.length === 0) {
    return <TopProductsSkeleton />;
  }

  return (
    <Box
      component="section"
      aria-labelledby="top-products-title"
      sx={dashboardStyles.topProductsCard}
    >
      <Box sx={dashboardStyles.topProductsHeader}>
        <Box>
          <Typography
            id="top-products-title"
            component="h2"
            sx={dashboardStyles.cardTitle}
          >
            Productos con mayor demanda
          </Typography>

          <Typography sx={dashboardStyles.cardSubtitle}>
            Análisis de los productos más vendidos y reservados en
            los últimos {periodDays} días.
          </Typography>
        </Box>

        <Chip
          icon={<Inventory2OutlinedIcon />}
          label={`Últimos ${periodDays} días`}
          sx={dashboardStyles.topProductsPeriodChip}
        />
      </Box>

      {products.length === 0 ? (
        <EmptyProductsState periodDays={periodDays} />
      ) : (
        <Box
          role="table"
          aria-label={`Productos con mayor demanda durante los últimos ${periodDays} días`}
          sx={dashboardStyles.topProductsTable}
        >
          <Box
            role="row"
            sx={dashboardStyles.topProductsTableHeader}
          >
            <Typography role="columnheader">
              Producto
            </Typography>

            <Typography role="columnheader">
              Vendidos {periodDays} días
            </Typography>

            <Typography role="columnheader">
              Reservados
            </Typography>

            <Typography role="columnheader">
              Demanda total
            </Typography>

            <Typography role="columnheader">
              Disponible
            </Typography>
          </Box>

          <Box role="rowgroup">
            {products.map((product) => (
              <ProductRow
                key={product.productoId}
                product={product}
                periodDays={periodDays}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
