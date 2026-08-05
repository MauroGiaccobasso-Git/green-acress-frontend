"use client";

import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";

import type { MemberAvailableProduct } from "@/api/productsApi";
import { MEMBER_RESERVATION_GRAM_STEP } from "@/hooks/reservations/useMemberReservationDraft";

import { availableProductsStyles as styles } from "../availableProducts.styles";

/* =========================================================
   TIPOS
========================================================= */

type AvailableProductCardProps = {
  product: MemberAvailableProduct;

  selectedQuantity: number;

  disabled?: boolean;

  onAddProduct: (
    product: MemberAvailableProduct,
  ) => void;

  onIncrementProduct: (
    productId: number,
  ) => void;

  onDecrementProduct: (
    productId: number,
  ) => void;
};

/* =========================================================
   CONSTANTES
========================================================= */

const FLOATING_POINT_TOLERANCE =
  0.000001;

const LOW_STOCK_THRESHOLD_GRAMS = 5;

const GENETICS_LABELS: Record<
  MemberAvailableProduct["genetica"],
  string
> = {
  INDICA: "Indica",
  SATIVA: "Sativa",
  HIBRIDA: "Híbrida",
};

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

/*
Evita presentar números negativos o inválidos
sin alterar los valores reales del dominio.
*/
function normalizeNumber(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(value, 0);
}

/*
Formatea importes en pesos uruguayos.

La tarjeta muestra únicamente una estimación.
Backend vuelve a validar y congelar el precio
cuando se crea la reserva.
*/
function formatCurrency(
  value: number,
): string {
  const formattedValue =
    new Intl.NumberFormat("es-UY", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(normalizeNumber(value));

  return `$${formattedValue}`;
}

/*
Formatea el stock sin forzar decimales
innecesarios.
*/
function formatAvailableGrams(
  value: number,
): string {
  return new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(normalizeNumber(value));
}

/*
Las cantidades seleccionadas siempre se
presentan con un decimal para respetar
visualmente los pasos de 0,5 gramos.
*/
function formatSelectedGrams(
  value: number,
): string {
  const formattedValue =
    new Intl.NumberFormat("es-UY", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(normalizeNumber(value));

  return `${formattedValue} g`;
}

/*
Presenta el porcentaje de THC sin agregar
decimales que no existan en el dato real.
*/
function formatThc(
  value: number,
): string {
  return new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(normalizeNumber(value));
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Representa un producto disponible dentro
del catálogo Premium del Portal Socio.

Responsabilidades:

- mostrar información pública del producto;
- resolver imagen y fallback visual;
- informar stock visible;
- reflejar el estado seleccionado;
- permitir agregar o ajustar la cantidad;
- evitar incrementos superiores al stock
  actualmente presentado.

No realiza solicitudes HTTP.
No administra el borrador.
No valida el límite legal.
No confirma disponibilidad concurrente.
*/
export function AvailableProductCard({
  product,
  selectedQuantity,
  disabled = false,
  onAddProduct,
  onIncrementProduct,
  onDecrementProduct,
}: AvailableProductCardProps) {
  const [
    imageLoadFailed,
    setImageLoadFailed,
  ] = useState(false);

  const isSelected =
    selectedQuantity > 0;

  const hasUsableImage =
    Boolean(product.imagen) &&
    !imageLoadFailed;

  const normalizedAvailableStock =
    normalizeNumber(
      product.cantidadDisponible,
    );

  const isLowStock =
    normalizedAvailableStock <=
    LOW_STOCK_THRESHOLD_GRAMS;

  const canAddInitialQuantity =
    normalizedAvailableStock +
      FLOATING_POINT_TOLERANCE >=
    MEMBER_RESERVATION_GRAM_STEP;

  /*
  Esta validación mejora la experiencia
  inmediata, pero backend conserva siempre
  la autoridad sobre el stock concurrente.
  */
  const canIncrement =
    selectedQuantity +
      MEMBER_RESERVATION_GRAM_STEP <=
    normalizedAvailableStock +
      FLOATING_POINT_TOLERANCE;

  const visibleDescription =
    product.descripcion?.trim() ||
    "Sin descripción disponible.";

  const handleAddProduct = (): void => {
    onAddProduct(product);
  };

  const handleIncrement = (): void => {
    onIncrementProduct(product.id);
  };

  const handleDecrement = (): void => {
    onDecrementProduct(product.id);
  };

  return (
    <Card
      component="article"
      elevation={0}
      aria-label={`${product.nombre}, ${formatCurrency(
        product.precioPorGramo,
      )} por gramo`}
      sx={styles.productCard(isSelected)}
    >
      <Box sx={styles.productImageWrapper}>
        {hasUsableImage ? (
          <Box
            component="img"
            src={product.imagen ?? undefined}
            alt={`Flor ${product.nombre}`}
            loading="lazy"
            onError={() =>
              setImageLoadFailed(true)
            }
            sx={styles.productImage}
          />
        ) : (
          <Box
            role="img"
            aria-label={`${product.nombre} sin imagen disponible`}
            sx={styles.productImageFallback}
          >
            <LocalFloristOutlinedIcon
              aria-hidden="true"
            />

            <Typography
              component="span"
              sx={
                styles.productImageFallbackText
              }
            >
              Imagen no disponible
            </Typography>
          </Box>
        )}

        {isSelected ? (
          <Box
            aria-label="Producto agregado a la reserva"
            title="Producto seleccionado"
            sx={
              styles.selectedProductIndicator
            }
          >
            <CheckRoundedIcon />
          </Box>
        ) : null}
      </Box>

      <CardContent
        sx={styles.productCardContent}
      >
        <Typography
          component="h3"
          title={product.nombre}
          sx={styles.productName}
        >
          {product.nombre}
        </Typography>

        <Box sx={styles.productMetadata}>
          <Chip
            size="small"
            label={`Genética: ${
              GENETICS_LABELS[
                product.genetica
              ]
            }`}
            sx={
              styles.productGeneticsChip
            }
          />

          <Chip
            size="small"
            label={`THC: ${formatThc(
              product.porcentajeThc,
            )}%`}
            sx={styles.productThcChip}
          />
        </Box>

        <Typography
          component="p"
          title={visibleDescription}
          sx={styles.productDescription}
        >
          {visibleDescription}
        </Typography>

        <Box
          aria-hidden="true"
          sx={styles.productDivider}
        />

        <Typography
          component="p"
          sx={styles.productPrice}
        >
          {formatCurrency(
            product.precioPorGramo,
          )}{" "}
          / g
        </Typography>

        <Typography
          component="p"
          sx={{
            ...styles.productAvailability,
            ...(isLowStock
              ? styles.productAvailabilityLow
              : {}),
          }}
        >
          Disponible:{" "}
          {formatAvailableGrams(
            normalizedAvailableStock,
          )}{" "}
          g
        </Typography>

        <Box sx={styles.productCardAction}>
          {isSelected ? (
            <Box
              role="group"
              aria-label={`Cantidad seleccionada de ${product.nombre}`}
              sx={styles.quantityControl}
            >
              <IconButton
                type="button"
                aria-label={`Reducir cantidad de ${product.nombre}`}
                onClick={handleDecrement}
                disabled={disabled}
                sx={styles.quantityButton}
              >
                <RemoveIcon />
              </IconButton>

              <Typography
                component="span"
                aria-live="polite"
                sx={styles.quantityValue}
              >
                {formatSelectedGrams(
                  selectedQuantity,
                )}
              </Typography>

              <IconButton
                type="button"
                aria-label={`Aumentar cantidad de ${product.nombre}`}
                onClick={handleIncrement}
                disabled={
                  disabled ||
                  !canIncrement
                }
                sx={styles.quantityButton}
              >
                <AddIcon />
              </IconButton>
            </Box>
          ) : (
            <Button
              type="button"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddProduct}
              disabled={
                disabled ||
                !canAddInitialQuantity
              }
              aria-label={`Agregar ${product.nombre} a la reserva`}
              sx={styles.addProductButton}
            >
              Agregar
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}