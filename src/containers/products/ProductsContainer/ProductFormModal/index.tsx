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

import { Product, UpdateProductPayload } from "@/api/productsApi";

import { productsStyles } from "../products.styles";

type ProductFormModalProps = {
  open: boolean;
  product: Product | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (productId: number, payload: UpdateProductPayload) => Promise<void>;
};

type ProductFormContentProps = {
  open: boolean;
  product: Product;
  loading: boolean;
  onClose: () => void;
  onSubmit: (productId: number, payload: UpdateProductPayload) => Promise<void>;
};

type ProductFormState = {
  nombre: string;
  descripcion: string;
  imagen_url: string;
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
  if (!value) {
    return "No definido";
  }

  return value.toLowerCase().replace("_", " ");
};

/*
Construye el estado inicial del formulario
a partir del producto seleccionado.

Se mantiene separado para evitar useEffect
con setState y favorecer un formulario
más predecible.
*/
function buildInitialFormState(product: Product): ProductFormState {
  return {
    nombre: product.nombre,
    descripcion: product.descripcion,
    imagen_url: product.imagen_url ?? "",
    genetica: product.genetica,
    porcentaje_thc:
      product.porcentaje_thc !== null ? String(product.porcentaje_thc) : "",
    precio_venta_actual: String(product.precio_venta_actual),
    estado: product.estado,
  };
}

/*
Valida una URL de forma básica.

La validación definitiva de persistencia
sigue quedando en backend, pero este control
evita errores evidentes antes de enviar.
*/
function isValidUrl(value: string) {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(value);

    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

/*
Compara el estado actual contra el estado inicial.

Permite detectar cambios sin guardar y prevenir
cierres accidentales del modal.
*/
function hasUnsavedChanges(
  currentForm: ProductFormState,
  initialForm: ProductFormState,
) {
  return (
    currentForm.nombre !== initialForm.nombre ||
    currentForm.descripcion !== initialForm.descripcion ||
    currentForm.imagen_url !== initialForm.imagen_url ||
    currentForm.genetica !== initialForm.genetica ||
    currentForm.porcentaje_thc !== initialForm.porcentaje_thc ||
    currentForm.precio_venta_actual !== initialForm.precio_venta_actual ||
    currentForm.estado !== initialForm.estado
  );
}

/*
Devuelve el error correspondiente a un campo.

Centralizar esta lógica permite reutilizarla
tanto al salir de un input como al enviar
el formulario completo.
*/
function getFieldError(
  field: keyof ProductFormState,
  form: ProductFormState,
  isSeed: boolean,
) {
  if (field === "nombre" && !form.nombre.trim()) {
    return "El nombre es obligatorio.";
  }

  if (field === "descripcion" && !form.descripcion.trim()) {
    return "La descripción es obligatoria.";
  }

  if (
    field === "imagen_url" &&
    form.imagen_url.trim() &&
    !isValidUrl(form.imagen_url)
  ) {
    return "Ingresá una URL válida que comience con http o https.";
  }

  if (field === "precio_venta_actual") {
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
Contenido interno del formulario.

Se separa del componente exportado para permitir
reinicializar el estado local mediante key={product.id},
sin usar setState dentro de useEffect.
*/
function ProductFormContent({
  open,
  product,
  loading,
  onClose,
  onSubmit,
}: ProductFormContentProps) {
  const [initialForm] = useState<ProductFormState>(() =>
    buildInitialFormState(product),
  );

  const [form, setForm] = useState<ProductFormState>(initialForm);

  const [errors, setErrors] = useState<ProductFormErrors>({});

  /*
  Controla si la imagen ingresada no pudo
  cargarse en la vista previa.

  Esto evita mostrar el ícono nativo de imagen rota
  y mantiene una experiencia visual más cuidada.
  */
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);

  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  const isSeed = product.tipo === "SEMILLA";

  const stockAvailable = product.stock?.cantidad_disponible ?? 0;

  const unitLabel = unitLabels[product.unidad_medida] ?? product.unidad_medida;

  const isDirty = hasUnsavedChanges(form, initialForm);

  const handleChange = (field: keyof ProductFormState, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    /*
    Limpia el error del campo editado.

    Esto evita mantener mensajes viejos
    después de que el usuario corrige
    el dato.
    */
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
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

  /*
  Validaciones básicas de experiencia.

  No reemplazan las reglas de negocio
  del backend, pero previenen errores
  evidentes antes de enviar el formulario.
  */
  const validateForm = () => {
    const fieldsToValidate: Array<keyof ProductFormState> = [
      "nombre",
      "descripcion",
      "imagen_url",
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

    if (!validateForm()) {
      return;
    }

    await onSubmit(product.id, {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      imagen_url: form.imagen_url.trim() !== "" ? form.imagen_url.trim() : null,
      genetica: form.genetica,
      porcentaje_thc: isSeed ? null : Number(form.porcentaje_thc),
      precio_venta_actual: Number(form.precio_venta_actual),
      estado: form.estado,
    });
  };

  /*
  Controla cierres solicitados por botón,
  tecla Escape o click fuera del modal.

  Si existen cambios sin guardar, se pide
  confirmación para evitar pérdida accidental.
  */
  const handleRequestClose = () => {
    if (loading) {
      return;
    }

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
                Editar producto
              </DialogTitle>

              <Typography sx={productsStyles.productFormSubtitle}>
                Actualizá los datos visibles del catálogo sin modificar el tipo
                ni el stock asociado.
              </Typography>
            </Box>

            <Chip
              label={formatLabel(form.estado)}
              sx={
                form.estado === "ACTIVO"
                  ? productsStyles.productFormStatusActiveChip
                  : productsStyles.productFormStatusInactiveChip
              }
            />
          </Box>

          <DialogContent sx={productsStyles.productFormContent}>
            <Box sx={productsStyles.productFormLayout}>
              <Box sx={productsStyles.productFormPreviewCard}>
                <Box sx={productsStyles.productFormImageFrame}>
                  {form.imagen_url && !imagePreviewFailed ? (
                    <Box
                      component="img"
                      src={form.imagen_url}
                      alt={`Imagen de ${form.nombre || product.nombre}`}
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
                      label={formatLabel(product.tipo)}
                      sx={productsStyles.productFormPreviewChip}
                    />

                    <Chip
                      size="small"
                      label={formatLabel(form.genetica)}
                      sx={productsStyles.productFormPreviewChip}
                    />

                    <Chip
                      size="small"
                      label={`${stockAvailable} ${unitLabel} disponibles`}
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
                      label="Descripción *"
                      value={form.descripcion}
                      onChange={(event) =>
                        handleChange("descripcion", event.target.value)
                      }
                      onBlur={() => handleBlur("descripcion")}
                      multiline
                      minRows={3}
                      fullWidth
                      error={Boolean(errors.descripcion)}
                      helperText={errors.descripcion}
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
                      Información operativa visible para la gestión.
                    </Typography>
                  </Box>

                  <Box sx={productsStyles.productFormGrid}>
                    <TextField
                      label="Precio de venta *"
                      type="number"
                      value={form.precio_venta_actual}
                      onChange={(event) =>
                        handleChange("precio_venta_actual", event.target.value)
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

                  <Box sx={productsStyles.productFormMetaGrid}>
                    <Box sx={productsStyles.productFormReadonlyCard}>
                      <Typography sx={productsStyles.productFormReadonlyLabel}>
                        Tipo
                      </Typography>

                      <Typography sx={productsStyles.productFormReadonlyValue}>
                        {formatLabel(product.tipo)}
                      </Typography>

                      <Typography sx={productsStyles.productFormReadonlyHint}>
                        No modificable luego de la creación.
                      </Typography>
                    </Box>

                    <Box sx={productsStyles.productFormReadonlyCard}>
                      <Typography sx={productsStyles.productFormReadonlyLabel}>
                        Unidad
                      </Typography>

                      <Typography sx={productsStyles.productFormReadonlyValue}>
                        {formatLabel(product.unidad_medida)}
                      </Typography>

                      <Typography sx={productsStyles.productFormReadonlyHint}>
                        Definida automáticamente por el tipo.
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={productsStyles.productFormGrid}>
                    <TextField
                      select
                      label="Genética *"
                      value={form.genetica}
                      onChange={(event) =>
                        handleChange("genetica", event.target.value)
                      }
                      fullWidth
                      sx={productsStyles.productFormField}
                    >
                      <MenuItem value="INDICA">Índica</MenuItem>

                      <MenuItem value="SATIVA">Sativa</MenuItem>

                      <MenuItem value="HIBRIDA">Híbrida</MenuItem>
                    </TextField>

                    <TextField
                      label="THC (%) *"
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
                          ? "Las semillas no admiten porcentaje THC."
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

              {loading ? "Guardando..." : "Guardar cambios"}
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

/*
Modal visual para edición de productos.

No realiza llamadas directas a la API.
No utiliza hooks de negocio.
No contiene reglas definitivas del backend.
*/
export default function ProductFormModal({
  open,
  product,
  loading,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  if (!product) {
    return null;
  }

  return (
    <ProductFormContent
      key={product.id}
      open={open}
      product={product}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
