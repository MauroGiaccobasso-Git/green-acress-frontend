"use client";

import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import {
  Box,
  Button,
  FormHelperText,
  Typography,
} from "@mui/material";
import {
  type ChangeEvent,
  useId,
} from "react";

import type { ProductImageFile } from "@/api/productsApi";
import {
  PRODUCT_IMAGE_ACCEPT,
  PRODUCT_IMAGE_MAX_SIZE_MB,
} from "@/features/products/utils/productForm";

import { productsStyles } from "../../products.styles";

/* =========================================================
   TIPOS
========================================================= */

type ProductImageFieldProps = {
  /*
  URL de la imagen actualmente persistida.

  Se utiliza para informar si la imagen existente
  se conservará o será reemplazada.
  */
  currentImageUrl?: string | null;

  /*
  Archivo nuevo seleccionado por el administrador.

  null significa que no existe una imagen pendiente de subir.
  */
  selectedFile: ProductImageFile;

  /*
  Mensaje de validación calculado por el formulario.
  */
  error?: string | null;

  /*
  Evita cambios mientras el formulario se está guardando.
  */
  disabled?: boolean;

  /*
  Notifica al formulario cuando se selecciona o descarta
  una imagen nueva.
  */
  onChange: (file: ProductImageFile) => void;
};

/* =========================================================
   HELPERS
========================================================= */

const formatFileSize = (sizeInBytes: number): string => {
  const sizeInMegabytes = sizeInBytes / 1024 / 1024;

  if (sizeInMegabytes >= 1) {
    return `${sizeInMegabytes.toFixed(2)} MB`;
  }

  return `${Math.max(1, Math.round(sizeInBytes / 1024))} KB`;
};

/* =========================================================
   COMPONENTE
========================================================= */

/*
Campo especializado para seleccionar la imagen de un producto.

Responsabilidades:

- abrir el selector nativo de archivos;
- restringir visualmente los formatos aceptados;
- mostrar el archivo pendiente;
- permitir descartar una selección nueva;
- informar si se conserva una imagen existente;
- exponer errores de validación accesibles.

No valida reglas de negocio.
No genera vistas previas.
No realiza llamadas a la API.
No conoce Amazon S3.
*/
export function ProductImageField({
  currentImageUrl,
  selectedFile,
  error,
  disabled = false,
  onChange,
}: ProductImageFieldProps) {
  const inputId = useId();
  const helperTextId = `${inputId}-helper-text`;

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextFile = event.target.files?.[0] ?? null;

    onChange(nextFile);

    /*
    Permite volver a seleccionar el mismo archivo después
    de descartarlo o corregir una validación.
    */
    event.target.value = "";
  };

  const handleClearSelection = () => {
    onChange(null);
  };

  const statusTitle = selectedFile
    ? selectedFile.name
    : currentImageUrl
      ? "Se conservará la imagen actual"
      : "Sin imagen seleccionada";

  const statusDescription = selectedFile
    ? `${formatFileSize(selectedFile.size)} · Imagen lista para subir`
    : currentImageUrl
      ? "Seleccioná un archivo nuevo únicamente para reemplazarla."
      : "La imagen es opcional y puede agregarse más adelante.";

  const helperText = currentImageUrl
    ? "La imagen seleccionada reemplazará a la anterior al guardar."
    : "La imagen se cargará al guardar el producto.";

  return (
    <Box
      sx={[
        productsStyles.productImageField,
        productsStyles.productFormFullWidth,
      ]}
    >
      <Box sx={productsStyles.productImageFieldHeader}>
        <Box sx={productsStyles.productImageFieldHeading}>
          <Box sx={productsStyles.productImageFieldIcon}>
            <ImageOutlinedIcon fontSize="small" />
          </Box>

          <Box>
            <Typography sx={productsStyles.productImageFieldTitle}>
              Imagen del producto
            </Typography>

            <Typography
              sx={productsStyles.productImageFieldDescription}
            >
              JPG, PNG o WEBP. Tamaño máximo:{" "}
              {PRODUCT_IMAGE_MAX_SIZE_MB} MB.
            </Typography>
          </Box>
        </Box>

        <Box sx={productsStyles.productImageFieldActions}>
          <Button
            component="label"
            htmlFor={inputId}
            variant="outlined"
            startIcon={<UploadFileOutlinedIcon />}
            disabled={disabled}
            sx={productsStyles.productImageFieldSelectButton}
          >
            {selectedFile ? "Cambiar imagen" : "Seleccionar imagen"}

            <Box
              component="input"
              id={inputId}
              type="file"
              accept={PRODUCT_IMAGE_ACCEPT}
              aria-describedby={helperTextId}
              disabled={disabled}
              onChange={handleFileChange}
              sx={productsStyles.productImageFieldHiddenInput}
            />
          </Button>

          {selectedFile && (
            <Button
              type="button"
              variant="text"
              startIcon={<DeleteOutlinedIcon />}
              disabled={disabled}
              onClick={handleClearSelection}
              sx={productsStyles.productImageFieldClearButton}
            >
              Descartar
            </Button>
          )}
        </Box>
      </Box>

      <Box
        sx={
          error
            ? productsStyles.productImageFieldStatusError
            : productsStyles.productImageFieldStatus
        }
      >
        <Typography
          title={statusTitle}
          sx={productsStyles.productImageFieldFileName}
        >
          {statusTitle}
        </Typography>

        <Typography sx={productsStyles.productImageFieldFileMeta}>
          {statusDescription}
        </Typography>
      </Box>

      <FormHelperText
        id={helperTextId}
        error={Boolean(error)}
        sx={productsStyles.productImageFieldHelperText}
      >
        {error ?? helperText}
      </FormHelperText>
    </Box>
  );
}