"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useMemo,
  useState,
} from "react";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import type {
  CreateProviderPayload,
  Provider,
  UpdateProviderPayload,
} from "@/api/providersApi";
import {
  buildProviderPayload,
  EMPTY_PROVIDER_FORM_VALUES,
  hasProviderFormChanges,
  hasProviderFormErrors,
  normalizeProviderFormValues,
  providerToFormValues,
  type ProviderFormErrors,
  type ProviderFormField,
  type ProviderFormValues,
  validateProviderForm,
} from "@/features/providers/utils/providerForm";

import { providersStyles } from "../providers.styles";

type ProviderFormMode = "create" | "edit";

type ProviderFormModalProps = {
  open: boolean;
  mode: ProviderFormMode;
  provider: Provider | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (
    payload: CreateProviderPayload | UpdateProviderPayload,
  ) => Promise<Provider | null>;
};

type ProviderFormModalContentProps = Omit<
  ProviderFormModalProps,
  "open"
>;

const createEmptyValues = (): ProviderFormValues => ({
  ...EMPTY_PROVIDER_FORM_VALUES,
});

function getInitialValues(
  mode: ProviderFormMode,
  provider: Provider | null,
): ProviderFormValues {
  if (mode === "edit" && provider) {
    return providerToFormValues(provider);
  }

  return createEmptyValues();
}

/*
Contenido interno del modal.

Se monta nuevamente cada vez que el modal se abre.
Esto permite inicializar y limpiar el formulario sin
sincronizar múltiples estados mediante useEffect.
*/
function ProviderFormModalContent({
  mode,
  provider,
  submitting,
  onClose,
  onSubmit,
}: ProviderFormModalContentProps) {
  const [initialValues] = useState<ProviderFormValues>(() =>
    getInitialValues(mode, provider),
  );

  const [formValues, setFormValues] =
    useState<ProviderFormValues>(() =>
      getInitialValues(mode, provider),
    );

  const [fieldErrors, setFieldErrors] =
    useState<ProviderFormErrors>({});

  const [formError, setFormError] = useState<string | null>(
    null,
  );

  const [isDiscardDialogOpen, setIsDiscardDialogOpen] =
    useState(false);

  const isEditMode = mode === "edit";

  const hasChanges = useMemo(
    () =>
      hasProviderFormChanges(initialValues, formValues),
    [formValues, initialValues],
  );

  /*
  Mantiene deshabilitado el envío cuando:
  - falta algún campo obligatorio;
  - existe una operación en curso;
  - se está editando pero no hubo modificaciones.
  */
  const canSubmit = useMemo(() => {
    const normalizedValues =
      normalizeProviderFormValues(formValues);

    const hasRequiredValues =
      Boolean(normalizedValues.nombre) &&
      Boolean(normalizedValues.contacto) &&
      Boolean(normalizedValues.telefono) &&
      Boolean(normalizedValues.email);

    if (!hasRequiredValues || submitting) {
      return false;
    }

    return isEditMode ? hasChanges : true;
  }, [formValues, hasChanges, isEditMode, submitting]);

  const handleFieldChange =
    (field: ProviderFormField) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setFormValues((currentValues) => ({
        ...currentValues,
        [field]: value,
      }));

      setFieldErrors((currentErrors) => {
        if (!currentErrors[field]) {
          return currentErrors;
        }

        const nextErrors = { ...currentErrors };
        delete nextErrors[field];

        return nextErrors;
      });

      setFormError(null);
    };

  const closeWithoutConfirmation = () => {
    setIsDiscardDialogOpen(false);
    onClose();
  };

  const handleRequestClose = () => {
    if (submitting) {
      return;
    }

    if (hasChanges) {
      setIsDiscardDialogOpen(true);
      return;
    }

    closeWithoutConfirmation();
  };

  const handleCancelDiscard = () => {
    setIsDiscardDialogOpen(false);
  };

  const handleConfirmDiscard = () => {
    closeWithoutConfirmation();
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setFormError(null);

    const validationErrors =
      validateProviderForm(formValues);

    setFieldErrors(validationErrors);

    if (hasProviderFormErrors(validationErrors)) {
      setFormError(
        "Revisá los campos señalados antes de continuar.",
      );
      return;
    }

    if (isEditMode && !hasChanges) {
      setFormError(
        "No realizaste cambios en los datos del proveedor.",
      );
      return;
    }

    const savedProvider = await onSubmit(
      buildProviderPayload(formValues),
    );

    if (!savedProvider) {
      setFormError(
        isEditMode
          ? "No se pudieron actualizar los datos del proveedor."
          : "No se pudo registrar el proveedor.",
      );
      return;
    }

    closeWithoutConfirmation();
  };

  const modalTitle = isEditMode
    ? "Editar proveedor"
    : "Nuevo proveedor";

  const modalSubtitle = isEditMode
    ? "Actualizá la información general y de contacto."
    : "Ingresá la información requerida para registrar el proveedor.";

  return (
    <>
      <Dialog
        open
        onClose={handleRequestClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: providersStyles.modalPaper,
          },
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
        >
          <Box sx={providersStyles.modalHeader}>
            <Box sx={providersStyles.modalHeaderContent}>
              <DialogTitle
                component="h2"
                sx={providersStyles.modalTitle}
              >
                {modalTitle}
              </DialogTitle>

              <Typography sx={providersStyles.modalSubtitle}>
                {modalSubtitle}
              </Typography>
            </Box>

            <IconButton
              aria-label="Cerrar formulario"
              onClick={handleRequestClose}
              disabled={submitting}
              sx={providersStyles.modalCloseButton}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent sx={providersStyles.modalContent}>
            {formError && (
              <Alert
                severity="error"
                sx={providersStyles.modalError}
              >
                {formError}
              </Alert>
            )}

            <Box sx={providersStyles.formGrid}>
              <TextField
                label="Nombre del proveedor *"
                value={formValues.nombre}
                onChange={handleFieldChange("nombre")}
                error={Boolean(fieldErrors.nombre)}
                helperText={fieldErrors.nombre}
                placeholder="Ej: Fertilizantes del Valle"
                autoComplete="organization"
                autoFocus
                disabled={submitting}
                fullWidth
                sx={{
                  ...providersStyles.formField,
                  ...providersStyles.fullWidthField,
                }}
              />

              <TextField
                label="Persona de contacto *"
                value={formValues.contacto}
                onChange={handleFieldChange("contacto")}
                error={Boolean(fieldErrors.contacto)}
                helperText={fieldErrors.contacto}
                placeholder="Ej: Juan Pérez"
                autoComplete="name"
                disabled={submitting}
                fullWidth
                sx={providersStyles.formField}
              />

              <TextField
                label="Teléfono *"
                type="tel"
                value={formValues.telefono}
                onChange={handleFieldChange("telefono")}
                error={Boolean(fieldErrors.telefono)}
                helperText={fieldErrors.telefono}
                placeholder="Ej: 099123456"
                autoComplete="tel"
                disabled={submitting}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                  },
                }}
                fullWidth
                sx={providersStyles.formField}
              />

              <TextField
                label="Correo electrónico *"
                type="email"
                value={formValues.email}
                onChange={handleFieldChange("email")}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
                placeholder="Ej: proveedor@correo.com"
                autoComplete="email"
                disabled={submitting}
                fullWidth
                sx={{
                  ...providersStyles.formField,
                  ...providersStyles.fullWidthField,
                }}
              />
            </Box>

            <Box sx={providersStyles.formInformationBox}>
              <InfoOutlinedIcon
                sx={providersStyles.formInformationIcon}
              />

              <Typography
                sx={providersStyles.formInformationText}
              >
                {isEditMode
                  ? "Los cambios quedarán registrados para mantener la trazabilidad administrativa."
                  : "El proveedor se registrará inicialmente en estado activo y quedará disponible para nuevas compras."}
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={providersStyles.modalActions}>
            <Button
              type="button"
              variant="outlined"
              onClick={handleRequestClose}
              disabled={submitting}
              sx={providersStyles.cancelButton}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!canSubmit}
              startIcon={
                isEditMode ? (
                  <EditOutlinedIcon />
                ) : (
                  <AddIcon />
                )
              }
              sx={providersStyles.submitButton}
            >
              {submitting
                ? isEditMode
                  ? "Guardando..."
                  : "Registrando..."
                : isEditMode
                  ? "Guardar cambios"
                  : "Registrar proveedor"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={isDiscardDialogOpen}
        onClose={handleCancelDiscard}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          ¿Descartar los cambios?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Los datos ingresados no fueron guardados.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCancelDiscard}
            sx={{ textTransform: "none" }}
          >
            Continuar editando
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirmDiscard}
            sx={{ textTransform: "none" }}
          >
            Descartar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/*
Modal reutilizable para alta y edición.

Cuando open pasa a false, el contenido interno se desmonta.
Al abrirse nuevamente, el formulario nace limpio y con los
datos correctos del proveedor seleccionado.
*/
export function ProviderFormModal({
  open,
  mode,
  provider,
  submitting,
  onClose,
  onSubmit,
}: ProviderFormModalProps) {
  if (!open) {
    return null;
  }

  return (
    <ProviderFormModalContent
      mode={mode}
      provider={provider}
      submitting={submitting}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}