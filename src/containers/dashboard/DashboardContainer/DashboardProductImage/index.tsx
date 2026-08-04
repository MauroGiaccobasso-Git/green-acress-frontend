"use client";

import LocalFloristRoundedIcon from "@mui/icons-material/LocalFloristRounded";
import { Box } from "@mui/material";
import { useState } from "react";

/* =========================================================
   TIPOS
========================================================= */

type DashboardProductImageVariant =
  | "recommendation"
  | "topProduct";

type DashboardProductImageProps = {
  /*
  URL de la imagen almacenada para el producto.

  Puede ser null porque existen productos históricos
  o datos locales que todavía no tienen fotografía.
  */
  src: string | null;

  /*
  Nombre descriptivo utilizado como texto alternativo
  cuando la fotografía se carga correctamente.
  */
  alt: string;

  /*
  Permite adaptar el tamaño de la miniatura según
  la sección del Dashboard que la utiliza.
  */
  variant: DashboardProductImageVariant;
};

/* =========================================================
   ESTILOS
========================================================= */

const sharedStyles = {
  width: 48,
  height: 48,
  flexShrink: 0,
  border: "1px solid rgba(27, 94, 32, 0.12)",
  bgcolor: "#F3F7F3",
};

const variantStyles: Record<
  DashboardProductImageVariant,
  Record<string, unknown>
> = {
  recommendation: {
    borderRadius: "14px",
  },

  topProduct: {
    borderRadius: "13px",
  },
};

const imageStyles = {
  ...sharedStyles,
  display: "block",
  objectFit: "cover",
};

const fallbackStyles = {
  ...sharedStyles,
  display: "grid",
  placeItems: "center",
  color: "#2E7D4F",
};

const fallbackIconStyles = {
  fontSize: 25,
};

/* =========================================================
   COMPONENTE
========================================================= */

/*
Representa la imagen de un producto FLOR dentro del Dashboard.

Comportamiento:

- URL válida:
  muestra la fotografía real del producto.

- URL nula o vacía:
  muestra un ícono visual de flor.

- URL existente que falla al cargar:
  reemplaza automáticamente la imagen rota por el ícono.

La miniatura no realiza solicitudes adicionales ni conoce
reglas de negocio. Únicamente resuelve la presentación visual.
*/
export default function DashboardProductImage({
  src,
  alt,
  variant,
}: DashboardProductImageProps) {
  const normalizedSource = src?.trim() || null;

  /*
  Guardamos la URL que produjo el error en lugar de un booleano.

  Si el componente recibe posteriormente una URL diferente,
  intentará cargarla normalmente sin necesitar efectos adicionales.
  */
  const [failedSource, setFailedSource] = useState<string | null>(
    null,
  );

  const shouldShowImage =
    normalizedSource !== null &&
    normalizedSource !== failedSource;

  if (shouldShowImage) {
    return (
      <Box
        component="img"
        src={normalizedSource}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={() => {
          setFailedSource(normalizedSource);
        }}
        sx={{
          ...imageStyles,
          ...variantStyles[variant],
        }}
      />
    );
  }

  return (
    <Box
      role="img"
      aria-label={`Imagen no disponible de ${alt}`}
      sx={{
        ...fallbackStyles,
        ...variantStyles[variant],
      }}
    >
      <LocalFloristRoundedIcon
        aria-hidden="true"
        sx={fallbackIconStyles}
      />
    </Box>
  );
}