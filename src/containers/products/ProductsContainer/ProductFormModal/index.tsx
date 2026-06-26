"use client";

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
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useState } from "react";

import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "@/api/productsApi";

import { productsStyles } from "../products.styles";

type ProductFormMode = "create" | "edit";

/*
Payload utilizado por el formulario en modo edición.

Incluye estado porque la UI permite modificarlo,
pero el container será responsable de separar:

- datos generales → PUT /productos/:id
- estado lógico → PATCH /productos/:id/estado
*/
export type EditProductFormPayload = UpdateProductPayload & {
  estado: Product["estado"];
};

export type ProductFormSubmitPayload =
  | CreateProductPayload
  | EditProductFormPayload;

type ProductFormModalProps = {
  open: boolean;
  mode: ProductFormMode;
  product?: Product | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductFormSubmitPayload) => Promise<void>;
};

type ProductFormContentProps = ProductFormModalProps;

type ProductFormState = {
  nombre: string;
  descripcion: string;
  imagen_url: string;
  tipo: "FLOR" | "SEMILLA";
  genetica: "INDICA" | "SATIVA" | "HIBRIDA";
  porcentaje_thc: string;
  precio_venta_actual: string;
  estado: "ACTIVO" | "INACTIVO";
};

type ProductFormErrors = Partial<Record<keyof ProductFormState, string>>;

const unitLabels: Record<string, string> = {
  GRAMOS: "g",
  UNIDADES: "unidades",
};

const formatLabel = (value?: string | null) => {
  if (!value) return "No definido";
  return value.toLowerCase().replace("_", " ");
};

/*
Obtiene la unidad de medida correspondiente
al tipo de producto.
*/
function getUnitByType(type: ProductFormState["tipo"]) {
  return type === "FLOR" ? "GRAMOS" : "UNIDADES";
}

/*
Construye el estado inicial del formulario.
*/
function buildInitialFormState(
  mode: ProductFormMode,
  product?: Product | null,
): ProductFormState {
  if (mode === "edit" && product) {
    return {
      nombre: product.nombre,
      descripcion: product.descripcion ?? "",
      imagen_url: product.imagen_url ?? "",
      tipo: product.tipo,
      genetica: product.genetica,
      porcentaje_thc:
        product.porcentaje_thc !== null && product.porcentaje_thc !== undefined
          ? String(product.porcentaje_thc)
          : "",
      precio_venta_actual:
        product.precio_venta_actual !== null &&
        product.precio_venta_actual !== undefined
          ? String(product.precio_venta_actual)
          : "",
      estado: product.estado,
    };
  }

  return {
    nombre: "",
    descripcion: "",
    imagen_url: "",
    tipo: "FLOR",
    genetica: "HIBRIDA",
    porcentaje_thc: "",
    precio_venta_actual: "",
    estado: "ACTIVO",
  };
}

function isValidUrl(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function hasUnsavedChanges(
  currentForm: ProductFormState,
  initialForm: ProductFormState,
) {
  return (
    currentForm.nombre !== initialForm.nombre ||
    currentForm.descripcion !== initialForm.descripcion ||
    currentForm.imagen_url !== initialForm.imagen_url ||
    currentForm.tipo !== initialForm.tipo ||
    currentForm.genetica !== initialForm.genetica ||
    currentForm.porcentaje_thc !== initialForm.porcentaje_thc ||
    currentForm.precio_venta_actual !== initialForm.precio_venta_actual ||
    currentForm.estado !== initialForm.estado
  );
}

function getFieldError(
  field: keyof ProductFormState,
  form: ProductFormState,
  isSeed: boolean,
) {
  if (field === "nombre" && !form.nombre.trim()) {
    return "El nombre es obligatorio.";
  }

  if (field === "nombre" && form.nombre.trim().length > 50) {
    return "El nombre no puede superar los 50 caracteres.";
  }

  if (
    field === "imagen_url" &&
    form.imagen_url.trim() &&
    !isValidUrl(form.imagen_url)
  ) {
    return "Ingresá una URL válida que comience con http o https.";
  }

  if (field === "tipo" && !form.tipo) {
    return "El tipo de producto es obligatorio.";
  }

  if (field === "genetica" && !form.genetica) {
    return "La genética es obligatoria.";
  }

  /*
  El precio de venta solo aplica a productos tipo FLOR.
  Las semillas forman parte del circuito de compras,
  inventario y producción interna.
  */
  if (field === "precio_venta_actual" && !isSeed) {
    const price = Number(form.precio_venta_actual);

    if (!form.precio_venta_actual || Number.isNaN(price) || price <= 0) {
      return "El precio debe ser mayor a 0.";
    }

    if (!Number.isInteger(price)) {
      return "El precio debe ser un número entero mayor a 0.";
    }
  }

  if (field === "porcentaje_thc" && !isSeed) {
    const thc = Number(form.porcentaje_thc);

    if (!form.porcentaje_thc || Number.isNaN(thc)) {
      return "El THC es obligatorio para flores.";
    }

    if (thc < 1 || thc > 100) {
      return "El THC debe estar entre 1 y 100.";
    }
  }

  return undefined;
}

/*
Componente interno que contiene el formulario real.

Se renderiza con una key desde el modal para reiniciar correctamente
el estado local al alternar entre alta y edición.
*/
function ProductFormContent({
  open,
  mode,
  product,
  loading,
  onClose,
  onSubmit,
}: ProductFormContentProps) {
  const [initialForm] = useState<ProductFormState>(() =>
    buildInitialFormState(mode, product),
  );

  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  const isCreateMode = mode === "create";
  const isSeed = form.tipo === "SEMILLA";
  const derivedUnit = getUnitByType(form.tipo);
  const stockAvailable = product?.stock?.cantidad_disponible ?? 0;
  const unitLabel = unitLabels[derivedUnit] ?? derivedUnit;
  const isDirty = hasUnsavedChanges(form, initialForm);

  const title = isCreateMode ? "Nuevo producto" : "Editar producto";

  const subtitle = isCreateMode
    ? "Registrá un nuevo producto para incorporarlo al catálogo administrativo."
    : "Actualizá los datos visibles del catálogo sin modificar el tipo ni el stock asociado.";

  const submitLabel = isCreateMode ? "Crear producto" : "Guardar cambios";
  const loadingLabel = isCreateMode ? "Creando..." : "Guardando...";

  const handleChange = (field: keyof ProductFormState, value: string) => {
    setForm((currentForm) => {
      if (field === "tipo" && value === "SEMILLA") {
        return {
          ...currentForm,
          tipo: "SEMILLA",
          porcentaje_thc: "",
          precio_venta_actual: "",
        };
      }

      return {
        ...currentForm,
        [field]: value,
      };
    });

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
      ...(field === "tipo"
        ? {
            porcentaje_thc: undefined,
            precio_venta_actual: undefined,
          }
        : {}),
    }));

    if (field === "imagen_url") {
      setImagePreviewFailed(false);
    }
  };

  const handleBlur = (field: keyof ProductFormState) => {
    const fieldError = getFieldError(field, form, isSeed);

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: fieldError,
    }));
  };

  const validateForm = () => {
    const fieldsToValidate: Array<keyof ProductFormState> = [
      "nombre",
      "imagen_url",
      "tipo",
      "genetica",
      "precio_venta_actual",
      "porcentaje_thc",
    ];

    const nextErrors = fieldsToValidate.reduce<ProductFormErrors>(
      (accumulatedErrors, field) => {
        const fieldError = getFieldError(field, form, isSeed);

        if (fieldError) {
          accumulatedErrors[field] = fieldError;
        }

        return accumulatedErrors;
      },
      {},
    );

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (isCreateMode) {
      await onSubmit({
        nombre: form.nombre.trim(),
        descripcion:
          form.descripcion.trim() !== "" ? form.descripcion.trim() : null,
        imagen_url:
          form.imagen_url.trim() !== "" ? form.imagen_url.trim() : null,
        tipo: form.tipo,
        genetica: form.genetica,
        porcentaje_thc: isSeed ? null : Number(form.porcentaje_thc),
        precio_venta_actual: isSeed ? null : Number(form.precio_venta_actual),
      });

      return;
    }

    await onSubmit({
      nombre: form.nombre.trim(),
      descripcion:
        form.descripcion.trim() !== "" ? form.descripcion.trim() : null,
      imagen_url: form.imagen_url.trim() !== "" ? form.imagen_url.trim() : null,
      genetica: form.genetica,
      porcentaje_thc: isSeed ? null : Number(form.porcentaje_thc),
      precio_venta_actual: isSeed ? null : Number(form.precio_venta_actual),
      estado: form.estado,
    });
  };

  const handleRequestClose = () => {
    if (loading) return;

    if (isDirty) {
      setDiscardDialogOpen(true);
      return;
    }

    onClose();
  };

  const handleConfirmDiscard = () => {
    setDiscardDialogOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleRequestClose}
        fullWidth
        maxWidth="md"
        slotProps={{
          paper: {
            sx: productsStyles.productFormDialog,
          },
        }}
      >
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Box sx={productsStyles.productFormHeader}>
            <Box>
              <DialogTitle sx={productsStyles.productFormTitle}>
                {title}
              </DialogTitle>

              <Typography sx={productsStyles.productFormSubtitle}>
                {subtitle}
              </Typography>

              {isCreateMode && (
                <Typography sx={productsStyles.productFormDefaultStatusText}>
                  Los nuevos productos se crean activos por defecto.
                </Typography>
              )}
            </Box>

            {!isCreateMode && (
              <Chip
                label={formatLabel(form.estado)}
                sx={
                  form.estado === "ACTIVO"
                    ? productsStyles.productFormStatusActiveChip
                    : productsStyles.productFormStatusInactiveChip
                }
              />
            )}
          </Box>

          <DialogContent sx={productsStyles.productFormContent}>
            <Box sx={productsStyles.productFormLayout}>
              <Box sx={productsStyles.productFormPreviewCard}>
                <Box sx={productsStyles.productFormImageFrame}>
                  {form.imagen_url && !imagePreviewFailed ? (
                    <Box
                      component="img"
                      src={form.imagen_url}
                      alt={`Imagen de ${
                        form.nombre || product?.nombre || "producto"
                      }`}
                      onError={() => setImagePreviewFailed(true)}
                      sx={productsStyles.productFormImage}
                    />
                  ) : (
                    <Box sx={productsStyles.productFormImageFallback}>
                      <Typography
                        sx={productsStyles.productFormImageFallbackText}
                      >
                        Vista previa no disponible
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={productsStyles.productFormPreviewContent}>
                  <Typography sx={productsStyles.productFormPreviewLabel}>
                    Vista previa
                  </Typography>

                  <Typography sx={productsStyles.productFormPreviewTitle}>
                    {form.nombre || "Producto sin nombre"}
                  </Typography>

                  <Box sx={productsStyles.productFormPreviewChips}>
                    <Chip
                      size="small"
                      label={formatLabel(form.tipo)}
                      sx={productsStyles.productFormPreviewChip}
                    />

                    <Chip
                      size="small"
                      label={formatLabel(form.genetica)}
                      sx={productsStyles.productFormPreviewChip}
                    />

                    <Chip
                      size="small"
                      label={
                        isCreateMode
                          ? `Unidad: ${formatLabel(derivedUnit)}`
                          : `${stockAvailable} ${unitLabel} disponibles`
                      }
                      sx={productsStyles.productFormPreviewChip}
                    />
                  </Box>

                  <Typography sx={productsStyles.productFormPreviewText}>
                    {form.descripcion.trim()
                      ? form.descripcion
                      : "Agregá una descripción para visualizar cómo se presentará el producto."}
                  </Typography>
                </Box>
              </Box>

              <Box sx={productsStyles.productFormSections}>
                <Box sx={productsStyles.productFormSection}>
                  <Box sx={productsStyles.productFormSectionHeader}>
                    <Typography sx={productsStyles.productFormSectionTitle}>
                      Información principal
                    </Typography>

                    <Typography sx={productsStyles.productFormSectionText}>
                      Datos que identifican visualmente el producto.
                    </Typography>
                  </Box>

                  <Box sx={productsStyles.productFormGrid}>
                    <TextField
                      label="Nombre *"
                      value={form.nombre}
                      onChange={(event) =>
                        handleChange("nombre", event.target.value)
                      }
                      onBlur={() => handleBlur("nombre")}
                      fullWidth
                      error={Boolean(errors.nombre)}
                      helperText={errors.nombre}
                      sx={[
                        productsStyles.productFormField,
                        productsStyles.productFormFullWidth,
                      ]}
                    />

                    <TextField
                      label="Descripción"
                      value={form.descripcion}
                      onChange={(event) =>
                        handleChange("descripcion", event.target.value)
                      }
                      multiline
                      minRows={3}
                      fullWidth
                      error={Boolean(errors.descripcion)}
                      helperText={
                        errors.descripcion ??
                        "Opcional. Ayuda a identificar mejor el producto en el catálogo."
                      }
                      sx={[
                        productsStyles.productFormField,
                        productsStyles.productFormFullWidth,
                      ]}
                    />

                    <TextField
                      label="URL de imagen"
                      value={form.imagen_url}
                      onChange={(event) =>
                        handleChange("imagen_url", event.target.value)
                      }
                      onBlur={() => handleBlur("imagen_url")}
                      fullWidth
                      error={Boolean(errors.imagen_url)}
                      helperText={
                        errors.imagen_url ??
                        "Opcional. Se actualiza la vista previa al modificarla."
                      }
                      sx={[
                        productsStyles.productFormField,
                        productsStyles.productFormFullWidth,
                      ]}
                    />
                  </Box>
                </Box>

                <Divider sx={productsStyles.productFormDivider} />

                <Box sx={productsStyles.productFormSection}>
                  <Box sx={productsStyles.productFormSectionHeader}>
                    <Typography sx={productsStyles.productFormSectionTitle}>
                      Datos comerciales
                    </Typography>

                    <Typography sx={productsStyles.productFormSectionText}>
                      {isSeed
                        ? "Las semillas se gestionan como insumos de producción interna."
                        : "Información operativa visible para la gestión."}
                    </Typography>
                  </Box>

                  <Box sx={productsStyles.productFormGrid}>
                    {isSeed ? (
                      <Box sx={productsStyles.productFormReadonlyCard}>
                        <Typography
                          sx={productsStyles.productFormReadonlyLabel}
                        >
                          Precio de venta
                        </Typography>

                        <Typography
                          sx={productsStyles.productFormReadonlyValue}
                        >
                          No aplica
                        </Typography>

                        <Typography sx={productsStyles.productFormReadonlyHint}>
                          Las semillas no se comercializan a socios. Su costo se
                          registra en compras.
                        </Typography>
                      </Box>
                    ) : (
                      <TextField
                        label="Precio de venta *"
                        type="number"
                        value={form.precio_venta_actual}
                        onChange={(event) =>
                          handleChange(
                            "precio_venta_actual",
                            event.target.value,
                          )
                        }
                        onBlur={() => handleBlur("precio_venta_actual")}
                        fullWidth
                        error={Boolean(errors.precio_venta_actual)}
                        helperText={errors.precio_venta_actual}
                        slotProps={{
                          htmlInput: {
                            min: 1,
                            step: 1,
                          },
                        }}
                        sx={productsStyles.productFormField}
                      />
                    )}

                    {!isCreateMode && (
                      <TextField
                        select
                        label="Estado *"
                        value={form.estado}
                        onChange={(event) =>
                          handleChange("estado", event.target.value)
                        }
                        fullWidth
                        sx={productsStyles.productFormField}
                      >
                        <MenuItem value="ACTIVO">Activo</MenuItem>
                        <MenuItem value="INACTIVO">Inactivo</MenuItem>
                      </TextField>
                    )}
                  </Box>
                </Box>

                <Divider sx={productsStyles.productFormDivider} />

                <Box sx={productsStyles.productFormSection}>
                  <Box sx={productsStyles.productFormSectionHeader}>
                    <Typography sx={productsStyles.productFormSectionTitle}>
                      Clasificación
                    </Typography>

                    <Typography sx={productsStyles.productFormSectionText}>
                      Reglas del dominio asociadas al producto.
                    </Typography>
                  </Box>

                  {isCreateMode ? (
                    <Box sx={productsStyles.productFormGrid}>
                      <TextField
                        select
                        label="Tipo *"
                        value={form.tipo}
                        onChange={(event) =>
                          handleChange("tipo", event.target.value)
                        }
                        onBlur={() => handleBlur("tipo")}
                        fullWidth
                        error={Boolean(errors.tipo)}
                        helperText={
                          errors.tipo ??
                          "Define la unidad y las reglas asociadas al producto."
                        }
                        sx={productsStyles.productFormField}
                      >
                        <MenuItem value="FLOR">Flor</MenuItem>
                        <MenuItem value="SEMILLA">Semilla</MenuItem>
                      </TextField>

                      <Box sx={productsStyles.productFormReadonlyCard}>
                        <Typography
                          sx={productsStyles.productFormReadonlyLabel}
                        >
                          Unidad
                        </Typography>

                        <Typography
                          sx={productsStyles.productFormReadonlyValue}
                        >
                          {formatLabel(derivedUnit)}
                        </Typography>

                        <Typography sx={productsStyles.productFormReadonlyHint}>
                          Se define automáticamente por el tipo seleccionado.
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={productsStyles.productFormMetaGrid}>
                      <Box sx={productsStyles.productFormReadonlyCard}>
                        <Typography
                          sx={productsStyles.productFormReadonlyLabel}
                        >
                          Tipo
                        </Typography>

                        <Typography
                          sx={productsStyles.productFormReadonlyValue}
                        >
                          {formatLabel(form.tipo)}
                        </Typography>

                        <Typography sx={productsStyles.productFormReadonlyHint}>
                          No modificable luego de la creación.
                        </Typography>
                      </Box>

                      <Box sx={productsStyles.productFormReadonlyCard}>
                        <Typography
                          sx={productsStyles.productFormReadonlyLabel}
                        >
                          Unidad
                        </Typography>

                        <Typography
                          sx={productsStyles.productFormReadonlyValue}
                        >
                          {formatLabel(derivedUnit)}
                        </Typography>

                        <Typography sx={productsStyles.productFormReadonlyHint}>
                          Definida automáticamente por el tipo.
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <Box sx={productsStyles.productFormGrid}>
                    <TextField
                      select
                      label="Genética *"
                      value={form.genetica}
                      onChange={(event) =>
                        handleChange("genetica", event.target.value)
                      }
                      onBlur={() => handleBlur("genetica")}
                      fullWidth
                      error={Boolean(errors.genetica)}
                      helperText={errors.genetica}
                      sx={productsStyles.productFormField}
                    >
                      <MenuItem value="INDICA">Índica</MenuItem>
                      <MenuItem value="SATIVA">Sativa</MenuItem>
                      <MenuItem value="HIBRIDA">Híbrida</MenuItem>
                    </TextField>

                    <TextField
                      label={isSeed ? "THC (%)" : "THC (%) *"}
                      type="number"
                      value={form.porcentaje_thc}
                      onChange={(event) =>
                        handleChange("porcentaje_thc", event.target.value)
                      }
                      onBlur={() => handleBlur("porcentaje_thc")}
                      disabled={isSeed}
                      fullWidth
                      error={Boolean(errors.porcentaje_thc)}
                      slotProps={{
                        htmlInput: {
                          min: 1,
                          max: 100,
                          step: 0.1,
                        },
                      }}
                      helperText={
                        errors.porcentaje_thc ??
                        (isSeed
                          ? "No aplica para semillas."
                          : "Valor requerido para productos de tipo flor.")
                      }
                      sx={
                        isSeed
                          ? productsStyles.productFormReadonlyField
                          : productsStyles.productFormField
                      }
                    />
                  </Box>
                </Box>

                <Box sx={productsStyles.productFormHelpBox}>
                  <Typography sx={productsStyles.productFormHelpText}>
                    El stock no se modifica desde esta pantalla. Los cambios de
                    inventario deben registrarse mediante movimientos de stock
                    para mantener trazabilidad.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={productsStyles.productFormActions}>
            <Button
              type="button"
              variant="outlined"
              onClick={handleRequestClose}
              disabled={loading}
              sx={productsStyles.productFormCancelButton}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={productsStyles.productFormSubmitButton}
            >
              {loading && (
                <CircularProgress
                  size={18}
                  color="inherit"
                  sx={productsStyles.productFormSubmitSpinner}
                />
              )}

              {loading ? loadingLabel : submitLabel}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={discardDialogOpen}
        onClose={() => setDiscardDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: productsStyles.productFormConfirmDialog,
          },
        }}
      >
        <DialogTitle sx={productsStyles.productFormConfirmTitle}>
          ¿Descartar cambios?
        </DialogTitle>

        <DialogContent sx={productsStyles.productFormConfirmContent}>
          <Typography sx={productsStyles.productFormConfirmText}>
            Tenés cambios sin guardar. Si salís ahora, se perderán las
            modificaciones realizadas.
          </Typography>
        </DialogContent>

        <DialogActions sx={productsStyles.productFormConfirmActions}>
          <Button
            variant="outlined"
            onClick={() => setDiscardDialogOpen(false)}
            sx={productsStyles.productFormCancelButton}
          >
            Seguir editando
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDiscard}
            sx={productsStyles.productFormDiscardButton}
          >
            Descartar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function ProductFormModal({
  open,
  mode,
  product,
  loading,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  if (mode === "edit" && !product) {
    return null;
  }

  return (
    <ProductFormContent
      key={mode === "edit" ? product?.id : `create-product-${Number(open)}`}
      open={open}
      mode={mode}
      product={product}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
