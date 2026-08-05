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
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Product,
  ProductImageFile,
} from "@/api/productsApi";
import {
  buildInitialProductFormValues,
  buildProductFormSubmission,
  formatProductLabel,
  getProductFormFieldError,
  getProductUnitByType,
  getProductUnitLabel,
  hasProductFormChanges,
  hasProductFormErrors,
  type ProductFormErrors,
  type ProductFormField,
  type ProductFormMode,
  type ProductFormSubmission,
  type ProductFormValues,
  validateProductForm,
  validateProductImageFile,
} from "@/features/products/utils/productForm";

import { ProductImageField } from "./ProductImageField";
import { productsStyles } from "../products.styles";

/* =========================================================
   CONTRATOS
========================================================= */

/*
Alias público conservado para que el container consuma
el contrato definitivo construido por el formulario.
*/
export type ProductFormSubmitPayload = ProductFormSubmission;

type ProductFormModalProps = {
  open: boolean;
  mode: ProductFormMode;
  product?: Product | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (submission: ProductFormSubmission) => Promise<void>;
};

type ProductFormContentProps = ProductFormModalProps;

/* =========================================================
   COMPONENTE INTERNO
========================================================= */

/*
Contiene el estado visual del formulario.

Las reglas reutilizables de:

- inicialización;
- normalización;
- validación;
- detección de cambios;
- construcción de payloads;

se encuentran en features/products/utils/productForm.ts.
*/
function ProductFormContent({
  open,
  mode,
  product,
  loading,
  onClose,
  onSubmit,
}: ProductFormContentProps) {
  const [initialForm] = useState<ProductFormValues>(() =>
    buildInitialProductFormValues(mode, product),
  );

  const [form, setForm] = useState<ProductFormValues>(initialForm);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const [imageFile, setImageFile] =
    useState<ProductImageFile>(null);

  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    product?.imagen_url ?? null,
  );
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);

  /*
  Conserva la URL temporal creada para una imagen local.

  Se utiliza para revocarla cuando:

  - el administrador cambia nuevamente la imagen;
  - descarta la selección;
  - cierra el modal.
  */
  const imageObjectUrlRef = useRef<string | null>(null);

  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  const isCreateMode = mode === "create";
  const isSeed = form.tipo === "SEMILLA";
  const derivedUnit = getProductUnitByType(form.tipo);
  const stockAvailable = product?.stock?.cantidad_disponible ?? 0;
  const unitLabel = getProductUnitLabel(form.tipo);

  const isDirty = hasProductFormChanges(
    initialForm,
    form,
    imageFile,
  );

  const title = isCreateMode ? "Nuevo producto" : "Editar producto";

  const subtitle = isCreateMode
    ? "Registrá un nuevo producto para incorporarlo al catálogo administrativo."
    : "Actualizá los datos visibles del catálogo sin modificar el tipo ni el stock asociado.";

  const submitLabel = isCreateMode ? "Crear producto" : "Guardar cambios";
  const loadingLabel = isCreateMode ? "Creando..." : "Guardando...";

  /*
  Libera la URL temporal cuando se desmonta el formulario.

  La creación y el reemplazo de la vista previa se realizan
  directamente cuando el administrador selecciona un archivo.

  De esta forma evitamos actualizaciones de estado dentro del
  efecto y prevenimos renders encadenados innecesarios.
  */
  useEffect(() => {
    return () => {
      if (imageObjectUrlRef.current) {
        URL.revokeObjectURL(imageObjectUrlRef.current);
        imageObjectUrlRef.current = null;
      }
    };
  }, []);

  /* =========================================================
     MANEJO DEL FORMULARIO
  ========================================================= */

  const handleChange = (
    field: ProductFormField,
    value: string,
  ) => {
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
      } as ProductFormValues;
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
  };

  const handleBlur = (field: ProductFormField) => {
    const fieldError = getProductFormFieldError(field, form);

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: fieldError,
    }));
  };

  const handleImageChange = (file: ProductImageFile) => {
    const nextImageError = validateProductImageFile(file);

    /*
    Antes de crear una nueva vista previa se libera la URL
    temporal anterior para evitar consumo acumulado de memoria.
    */
    if (imageObjectUrlRef.current) {
      URL.revokeObjectURL(imageObjectUrlRef.current);
      imageObjectUrlRef.current = null;
    }

    /*
    Solo se genera una vista previa local cuando el archivo
    cumple las validaciones básicas del frontend.

    Si el archivo es inválido o se descarta la selección,
    se vuelve a mostrar la imagen actualmente persistida.
    */
    if (file && !nextImageError) {
      const nextPreviewUrl = URL.createObjectURL(file);

      imageObjectUrlRef.current = nextPreviewUrl;
      setImagePreviewUrl(nextPreviewUrl);
    } else {
      setImagePreviewUrl(product?.imagen_url ?? null);
    }

    setImageFile(file);
    setImageError(nextImageError);
    setImagePreviewFailed(false);
  };

  const validateForm = (): boolean => {
    const nextErrors = validateProductForm(form);
    const nextImageError = validateProductImageFile(imageFile);

    setErrors(nextErrors);
    setImageError(nextImageError);

    return !hasProductFormErrors(nextErrors) && !nextImageError;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submission = buildProductFormSubmission(
      mode,
      form,
      imageFile,
    );

    await onSubmit(submission);
  };

  /* =========================================================
     CIERRE SEGURO
  ========================================================= */

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

  /* =========================================================
     RENDER
  ========================================================= */

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
                <Typography
                  sx={productsStyles.productFormDefaultStatusText}
                >
                  Los nuevos productos se crean activos por defecto.
                </Typography>
              )}
            </Box>

            {!isCreateMode && (
              <Chip
                label={formatProductLabel(form.estado)}
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
                  {imagePreviewUrl && !imagePreviewFailed ? (
                    <Box
                      component="img"
                      src={imagePreviewUrl}
                      alt={`Imagen de ${
                        form.nombre || product?.nombre || "producto"
                      }`}
                      onError={() => setImagePreviewFailed(true)}
                      sx={productsStyles.productFormImage}
                    />
                  ) : (
                    <Box sx={productsStyles.productFormImageFallback}>
                      <Typography
                        sx={
                          productsStyles.productFormImageFallbackText
                        }
                      >
                        Vista previa no disponible
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={productsStyles.productFormPreviewContent}>
                  <Typography
                    sx={productsStyles.productFormPreviewLabel}
                  >
                    Vista previa
                  </Typography>

                  <Typography
                    sx={productsStyles.productFormPreviewTitle}
                  >
                    {form.nombre || "Producto sin nombre"}
                  </Typography>

                  <Box sx={productsStyles.productFormPreviewChips}>
                    <Chip
                      size="small"
                      label={formatProductLabel(form.tipo)}
                      sx={productsStyles.productFormPreviewChip}
                    />

                    <Chip
                      size="small"
                      label={formatProductLabel(form.genetica)}
                      sx={productsStyles.productFormPreviewChip}
                    />

                    <Chip
                      size="small"
                      label={
                        isCreateMode
                          ? `Unidad: ${formatProductLabel(derivedUnit)}`
                          : `${stockAvailable} ${unitLabel} disponibles`
                      }
                      sx={productsStyles.productFormPreviewChip}
                    />
                  </Box>

                  <Typography
                    sx={productsStyles.productFormPreviewText}
                  >
                    {form.descripcion.trim()
                      ? form.descripcion
                      : "Agregá una descripción para visualizar cómo se presentará el producto."}
                  </Typography>
                </Box>
              </Box>

              <Box sx={productsStyles.productFormSections}>
                <Box sx={productsStyles.productFormSection}>
                  <Box sx={productsStyles.productFormSectionHeader}>
                    <Typography
                      sx={productsStyles.productFormSectionTitle}
                    >
                      Información principal
                    </Typography>

                    <Typography
                      sx={productsStyles.productFormSectionText}
                    >
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
                      disabled={loading}
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
                        handleChange(
                          "descripcion",
                          event.target.value,
                        )
                      }
                      disabled={loading}
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

                    <ProductImageField
                      currentImageUrl={product?.imagen_url}
                      selectedFile={imageFile}
                      error={imageError}
                      disabled={loading}
                      onChange={handleImageChange}
                    />
                  </Box>
                </Box>

                <Divider sx={productsStyles.productFormDivider} />

                <Box sx={productsStyles.productFormSection}>
                  <Box sx={productsStyles.productFormSectionHeader}>
                    <Typography
                      sx={productsStyles.productFormSectionTitle}
                    >
                      Datos comerciales
                    </Typography>

                    <Typography
                      sx={productsStyles.productFormSectionText}
                    >
                      {isSeed
                        ? "Las semillas se gestionan como insumos de producción interna."
                        : "Información operativa visible para la gestión."}
                    </Typography>
                  </Box>

                  <Box sx={productsStyles.productFormGrid}>
                    {isSeed ? (
                      <Box sx={productsStyles.productFormReadonlyCard}>
                        <Typography
                          sx={
                            productsStyles.productFormReadonlyLabel
                          }
                        >
                          Precio de venta
                        </Typography>

                        <Typography
                          sx={
                            productsStyles.productFormReadonlyValue
                          }
                        >
                          No aplica
                        </Typography>

                        <Typography
                          sx={
                            productsStyles.productFormReadonlyHint
                          }
                        >
                          Las semillas no se comercializan a socios. Su
                          costo se registra en compras.
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
                        onBlur={() =>
                          handleBlur("precio_venta_actual")
                        }
                        disabled={loading}
                        fullWidth
                        error={Boolean(
                          errors.precio_venta_actual,
                        )}
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
                          handleChange(
                            "estado",
                            event.target.value,
                          )
                        }
                        disabled={loading}
                        fullWidth
                        sx={productsStyles.productFormField}
                      >
                        <MenuItem value="ACTIVO">Activo</MenuItem>
                        <MenuItem value="INACTIVO">
                          Inactivo
                        </MenuItem>
                      </TextField>
                    )}
                  </Box>
                </Box>

                <Divider sx={productsStyles.productFormDivider} />

                <Box sx={productsStyles.productFormSection}>
                  <Box sx={productsStyles.productFormSectionHeader}>
                    <Typography
                      sx={productsStyles.productFormSectionTitle}
                    >
                      Clasificación
                    </Typography>

                    <Typography
                      sx={productsStyles.productFormSectionText}
                    >
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
                          handleChange(
                            "tipo",
                            event.target.value,
                          )
                        }
                        onBlur={() => handleBlur("tipo")}
                        disabled={loading}
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

                      <Box
                        sx={productsStyles.productFormReadonlyCard}
                      >
                        <Typography
                          sx={
                            productsStyles.productFormReadonlyLabel
                          }
                        >
                          Unidad
                        </Typography>

                        <Typography
                          sx={
                            productsStyles.productFormReadonlyValue
                          }
                        >
                          {formatProductLabel(derivedUnit)}
                        </Typography>

                        <Typography
                          sx={
                            productsStyles.productFormReadonlyHint
                          }
                        >
                          Se define automáticamente por el tipo
                          seleccionado.
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={productsStyles.productFormMetaGrid}>
                      <Box
                        sx={productsStyles.productFormReadonlyCard}
                      >
                        <Typography
                          sx={
                            productsStyles.productFormReadonlyLabel
                          }
                        >
                          Tipo
                        </Typography>

                        <Typography
                          sx={
                            productsStyles.productFormReadonlyValue
                          }
                        >
                          {formatProductLabel(form.tipo)}
                        </Typography>

                        <Typography
                          sx={
                            productsStyles.productFormReadonlyHint
                          }
                        >
                          No modificable luego de la creación.
                        </Typography>
                      </Box>

                      <Box
                        sx={productsStyles.productFormReadonlyCard}
                      >
                        <Typography
                          sx={
                            productsStyles.productFormReadonlyLabel
                          }
                        >
                          Unidad
                        </Typography>

                        <Typography
                          sx={
                            productsStyles.productFormReadonlyValue
                          }
                        >
                          {formatProductLabel(derivedUnit)}
                        </Typography>

                        <Typography
                          sx={
                            productsStyles.productFormReadonlyHint
                          }
                        >
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
                        handleChange(
                          "genetica",
                          event.target.value,
                        )
                      }
                      onBlur={() => handleBlur("genetica")}
                      disabled={loading}
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
                        handleChange(
                          "porcentaje_thc",
                          event.target.value,
                        )
                      }
                      onBlur={() => handleBlur("porcentaje_thc")}
                      disabled={loading || isSeed}
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
                  <Typography
                    sx={productsStyles.productFormHelpText}
                  >
                    El stock no se modifica desde esta pantalla. Los
                    cambios de inventario deben registrarse mediante
                    movimientos de stock para mantener trazabilidad.
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

        <DialogActions
          sx={productsStyles.productFormConfirmActions}
        >
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

/* =========================================================
   MODAL PÚBLICO
========================================================= */

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
      key={
        mode === "edit"
          ? product?.id
          : `create-product-${Number(open)}`
      }
      open={open}
      mode={mode}
      product={product}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}