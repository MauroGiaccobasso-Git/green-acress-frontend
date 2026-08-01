"use client";

import {
  type ChangeEvent,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

import type { CreateProviderPayload, Provider } from "@/api/providersApi";
import {
  buildProviderPayload,
  EMPTY_PROVIDER_FORM_VALUES,
  hasProviderFormErrors,
  normalizeProviderFormValues,
  type ProviderFormErrors,
  type ProviderFormField,
  type ProviderFormValues,
  validateProviderForm,
} from "@/features/providers/utils/providerForm";

import { createProviderModalStyles } from "./CreateProviderModal.styles";

type CreateProviderModalProps = {
  open: boolean;
  creating: boolean;
  onClose: () => void;
  onCreate: (
    payload: CreateProviderPayload,
  ) => Promise<Provider | null>;
};

const createEmptyFormValues = (): ProviderFormValues => ({
  ...EMPTY_PROVIDER_FORM_VALUES,
});

/*
Modal especializado para el alta rápida de proveedores
desde el módulo de Compras.

Permite registrar un proveedor completo sin abandonar
el flujo operativo de creación de una compra.

Las reglas reutilizables de normalización y validación
se encuentran centralizadas en features/providers.
*/
export function CreateProviderModal({
  open,
  creating,
  onClose,
  onCreate,
}: CreateProviderModalProps) {
  const [formValues, setFormValues] = useState<ProviderFormValues>(
    createEmptyFormValues,
  );

  const [fieldErrors, setFieldErrors] =
    useState<ProviderFormErrors>({});

  const [formError, setFormError] = useState<string | null>(null);

  /*
  Evita habilitar el envío cuando existen campos vacíos.

  La validación completa de formatos se ejecuta al confirmar.
  */
  const canSubmit = useMemo(() => {
    const normalizedValues =
      normalizeProviderFormValues(formValues);

    return (
      Boolean(normalizedValues.nombre) &&
      Boolean(normalizedValues.contacto) &&
      Boolean(normalizedValues.telefono) &&
      Boolean(normalizedValues.email) &&
      !creating
    );
  }, [creating, formValues]);

  const resetForm = () => {
    setFormValues(createEmptyFormValues());
    setFieldErrors({});
    setFormError(null);
  };

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

  const handleClose = () => {
    if (creating) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleCreate = async () => {
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

    const createdProvider = await onCreate(
      buildProviderPayload(formValues),
    );

    if (!createdProvider) {
      setFormError(
        "No se pudo registrar el proveedor. Revisá los datos e intentá nuevamente.",
      );
      return;
    }

    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: createProviderModalStyles.paper,
        },
      }}
    >
      <DialogTitle sx={createProviderModalStyles.title}>
        <Box sx={createProviderModalStyles.header}>
          <Box sx={createProviderModalStyles.iconBox}>
            <LocalShippingOutlinedIcon />
          </Box>

          <Box sx={createProviderModalStyles.headerText}>
            <Typography
              component="h2"
              sx={createProviderModalStyles.heading}
            >
              Nuevo proveedor
            </Typography>

            <Typography sx={createProviderModalStyles.subtitle}>
              Creá un proveedor sin salir del flujo de compra.
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={createProviderModalStyles.content}>
        {formError && (
          <Alert
            severity="error"
            sx={createProviderModalStyles.errorAlert}
          >
            {formError}
          </Alert>
        )}

        <Box sx={createProviderModalStyles.form}>
          <TextField
            label="Nombre *"
            value={formValues.nombre}
            onChange={handleFieldChange("nombre")}
            error={Boolean(fieldErrors.nombre)}
            helperText={fieldErrors.nombre}
            placeholder="Ej: Fertilizantes del Valle"
            autoComplete="organization"
            disabled={creating}
            fullWidth
          />

          <TextField
            label="Contacto *"
            value={formValues.contacto}
            onChange={handleFieldChange("contacto")}
            error={Boolean(fieldErrors.contacto)}
            helperText={fieldErrors.contacto}
            placeholder="Ej: Juan Pérez"
            autoComplete="name"
            disabled={creating}
            fullWidth
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
            disabled={creating}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
              },
            }}
            fullWidth
          />

          <TextField
            label="Email *"
            type="email"
            value={formValues.email}
            onChange={handleFieldChange("email")}
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
            placeholder="Ej: proveedor@correo.com"
            autoComplete="email"
            disabled={creating}
            fullWidth
          />

          <Box sx={createProviderModalStyles.helperBox}>
            <Typography sx={createProviderModalStyles.helperText}>
              Se registrará un proveedor activo con toda la
              información requerida. Luego podrá administrarse desde
              el módulo de Proveedores.
            </Typography>
          </Box>

          <Box sx={createProviderModalStyles.actions}>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={creating}
              startIcon={<CloseIcon />}
              sx={createProviderModalStyles.cancelButton}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!canSubmit}
              startIcon={<AddIcon />}
              sx={createProviderModalStyles.submitButton}
            >
              {creating
                ? "Creando..."
                : "Crear proveedor"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}