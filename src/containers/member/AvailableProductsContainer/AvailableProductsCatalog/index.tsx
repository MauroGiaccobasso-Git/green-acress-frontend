"use client";

import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  Box,
  Button,
  Chip,
  Skeleton,
  Typography,
} from "@mui/material";

import type { MemberAvailableProduct } from "@/api/productsApi";

import { AvailableProductCard } from "../AvailableProductCard";
import { availableProductsStyles as styles } from "../availableProducts.styles";

/* =========================================================
   TIPOS
========================================================= */

type AvailableProductsCatalogProps = {
  products: MemberAvailableProduct[];

  isLoading: boolean;

  errorMessage: string | null;

  disabled?: boolean;

  getSelectedQuantity: (
    productId: number,
  ) => number;

  onAddProduct: (
    product: MemberAvailableProduct,
  ) => void;

  onIncrementProduct: (
    productId: number,
  ) => void;

  onDecrementProduct: (
    productId: number,
  ) => void;

  onRetry: () => void;
};

/* =========================================================
   CONSTANTES
========================================================= */

const CATALOG_SKELETON_COUNT = 6;

/* =========================================================
   HELPERS
========================================================= */

/*
Construye una etiqueta natural para
la cantidad visible de productos.
*/
function getProductsCountLabel(
  productsCount: number,
): string {
  if (productsCount === 1) {
    return "1 producto disponible";
  }

  return `${productsCount} productos disponibles`;
}

/* =========================================================
   SKELETON PREMIUM
========================================================= */

/*
Replica la proporción visual de las tarjetas
definitivas para evitar saltos de layout
durante la carga inicial.
*/
function AvailableProductsLoadingState() {
  return (
    <Box
      role="status"
      aria-label="Cargando productos disponibles"
      aria-busy="true"
      sx={styles.skeletonGrid}
    >
      {Array.from({
        length: CATALOG_SKELETON_COUNT,
      }).map((_, index) => (
        <Box
          key={index}
          aria-hidden="true"
          sx={styles.skeletonProductCard}
        >
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={styles.skeletonProductImage}
          />

          <Box sx={styles.skeletonProductBody}>
            <Skeleton
              animation="wave"
              width="68%"
              height={30}
            />

            <Box
              sx={{
                mt: 0.8,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <Skeleton
                variant="rounded"
                animation="wave"
                width={104}
                height={26}
              />

              <Skeleton
                variant="rounded"
                animation="wave"
                width={72}
                height={26}
              />
            </Box>

            <Box sx={{ mt: 1.15 }}>
              <Skeleton
                animation="wave"
                width="100%"
                height={20}
              />

              <Skeleton
                animation="wave"
                width="84%"
                height={20}
              />
            </Box>

            <Skeleton
              animation="wave"
              sx={{ mt: 1.4 }}
              width="100%"
              height={2}
            />

            <Skeleton
              animation="wave"
              sx={{ mt: 1.2 }}
              width="44%"
              height={27}
            />

            <Skeleton
              animation="wave"
              width="38%"
              height={21}
            />

            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{ mt: 1.35 }}
              width="100%"
              height={44}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* =========================================================
   ESTADO DE ERROR
========================================================= */

type CatalogErrorStateProps = {
  message: string;

  isRetrying: boolean;

  onRetry: () => void;
};

/*
Se presenta únicamente cuando todavía
no existe un catálogo válido para mostrar.
*/
function CatalogErrorState({
  message,
  isRetrying,
  onRetry,
}: CatalogErrorStateProps) {
  return (
    <Box
      role="alert"
      aria-labelledby="available-products-error-title"
      sx={styles.catalogStateCard}
    >
      <Box
        aria-hidden="true"
        sx={{
          ...styles.catalogStateIcon,
          ...styles.catalogErrorIcon,
        }}
      >
        <ErrorOutlineRoundedIcon />
      </Box>

      <Typography
        id="available-products-error-title"
        component="h3"
        sx={styles.catalogStateTitle}
      >
        No pudimos cargar los productos
      </Typography>

      <Typography
        component="p"
        sx={styles.catalogStateDescription}
      >
        {message}
      </Typography>

      <Button
        type="button"
        variant="contained"
        startIcon={<RefreshRoundedIcon />}
        onClick={onRetry}
        disabled={isRetrying}
        sx={styles.retryButton}
      >
        {isRetrying
          ? "Reintentando..."
          : "Reintentar"}
      </Button>
    </Box>
  );
}

/* =========================================================
   ESTADO VACÍO
========================================================= */

/*
Representa una respuesta exitosa del backend
sin flores actualmente disponibles.
*/
function EmptyCatalogState() {
  return (
    <Box
      role="status"
      aria-labelledby="available-products-empty-title"
      sx={styles.catalogStateCard}
    >
      <Box
        aria-hidden="true"
        sx={styles.catalogStateIcon}
      >
        <LocalFloristOutlinedIcon />
      </Box>

      <Typography
        id="available-products-empty-title"
        component="h3"
        sx={styles.catalogStateTitle}
      >
        No hay productos disponibles
      </Typography>

      <Typography
        component="p"
        sx={styles.catalogStateDescription}
      >
        En este momento no existen flores con
        stock disponible para reservar. Volvé a
        consultar más tarde.
      </Typography>
    </Box>
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Presenta el catálogo Premium del Portal Socio.

Responsabilidades:

- mostrar el encabezado del catálogo;
- informar la cantidad de productos;
- resolver carga, error y estado vacío;
- presentar la grilla de tarjetas;
- delegar las acciones del borrador.

No realiza solicitudes HTTP.
No administra cantidades.
No calcula totales.
No contiene reglas de stock definitivas.
*/
export function AvailableProductsCatalog({
  products,
  isLoading,
  errorMessage,
  disabled = false,
  getSelectedQuantity,
  onAddProduct,
  onIncrementProduct,
  onDecrementProduct,
  onRetry,
}: AvailableProductsCatalogProps) {
  const hasProducts =
    products.length > 0;

  const isInitialLoading =
    isLoading && !hasProducts;

  const hasBlockingError =
    Boolean(errorMessage) &&
    !hasProducts &&
    !isLoading;

  const showEmptyState =
    !isInitialLoading &&
    !hasBlockingError &&
    !hasProducts;

  return (
    <Box
      component="section"
      aria-labelledby="available-products-catalog-title"
      aria-busy={isLoading}
      sx={styles.catalogSection}
    >
      <Box sx={styles.catalogHeader}>
        <Box sx={styles.catalogHeaderCopy}>
          <Typography
            id="available-products-catalog-title"
            component="h2"
            sx={styles.catalogTitle}
          >
            Catálogo de flores
          </Typography>

          <Typography
            component="p"
            sx={styles.catalogSubtitle}
          >
            Agregá uno o varios productos y
            ajustá cada cantidad en pasos de
            0,5 gramos.
          </Typography>
        </Box>

        {!isInitialLoading &&
        !hasBlockingError ? (
          <Chip
            size="small"
            variant="outlined"
            label={getProductsCountLabel(
              products.length,
            )}
            sx={styles.catalogCountChip}
          />
        ) : null}
      </Box>

      {isInitialLoading ? (
        <AvailableProductsLoadingState />
      ) : null}

      {hasBlockingError &&
      errorMessage ? (
        <CatalogErrorState
          message={errorMessage}
          isRetrying={isLoading}
          onRetry={onRetry}
        />
      ) : null}

      {showEmptyState ? (
        <EmptyCatalogState />
      ) : null}

      {hasProducts ? (
        <Box sx={styles.catalogGrid}>
          {products.map((product) => (
            <AvailableProductCard
              key={product.id}
              product={product}
              selectedQuantity={getSelectedQuantity(
                product.id,
              )}
              disabled={disabled}
              onAddProduct={onAddProduct}
              onIncrementProduct={
                onIncrementProduct
              }
              onDecrementProduct={
                onDecrementProduct
              }
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}