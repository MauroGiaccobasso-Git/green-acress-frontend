"use client";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import type {
  CreateSocioPayload,
  Socio,
  UpdateSocioPayload,
} from "@/api/sociosApi";

import { membersStyles } from "../members.styles";

export type MemberFormMode = "create" | "edit";

export type MemberFormSubmitPayload =
  | CreateSocioPayload
  | UpdateSocioPayload;

type MemberFormModalProps = {
  open: boolean;
  mode: MemberFormMode;
  socio?: Socio | null;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onClearError?: () => void;
  onSubmit: (payload: MemberFormSubmitPayload) => Promise<void>;
};

type MemberFormState = {
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  email: string;
};

type MemberFormErrors = Partial<
  Record<keyof MemberFormState, string>
>;

/* =========================================================
   REGLAS DE VALIDACIÓN
========================================================= */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOCUMENT_PATTERN = /^\d{7,8}$/;
const PHONE_PATTERN = /^\d{8,15}$/;
const PERSON_NAME_PATTERN =
  /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;

const DEFAULT_FORM_STATE: MemberFormState = {
  nombre: "",
  apellido: "",
  documento: "",
  telefono: "",
  email: "",
};

/* =========================================================
   HELPERS DE NORMALIZACIÓN
========================================================= */

function normalizePersonalText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeNumericText(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeForm(form: MemberFormState): MemberFormState {
  return {
    nombre: normalizePersonalText(form.nombre),
    apellido: normalizePersonalText(form.apellido),
    documento: normalizeNumericText(form.documento),
    telefono: normalizeNumericText(form.telefono),
    email: normalizeEmail(form.email),
  };
}

function buildInitialFormState(
  mode: MemberFormMode,
  socio?: Socio | null,
): MemberFormState {
  if (mode === "edit" && socio) {
    return {
      nombre: socio.nombre,
      apellido: socio.apellido,
      documento: socio.documento,
      telefono: socio.telefono ?? "",
      email: socio.usuario.email,
    };
  }

  return DEFAULT_FORM_STATE;
}

function isFieldChanged(
  field: keyof MemberFormState,
  currentForm: MemberFormState,
  initialForm: MemberFormState,
) {
  const normalizedCurrent = normalizeForm(currentForm);
  const normalizedInitial = normalizeForm(initialForm);

  return normalizedCurrent[field] !== normalizedInitial[field];
}

function hasUnsavedChanges(
  currentForm: MemberFormState,
  initialForm: MemberFormState,
) {
  const normalizedCurrent = normalizeForm(currentForm);
  const normalizedInitial = normalizeForm(initialForm);

  return (
    normalizedCurrent.nombre !== normalizedInitial.nombre ||
    normalizedCurrent.apellido !== normalizedInitial.apellido ||
    normalizedCurrent.documento !== normalizedInitial.documento ||
    normalizedCurrent.telefono !== normalizedInitial.telefono ||
    normalizedCurrent.email !== normalizedInitial.email
  );
}

/* =========================================================
   HELPERS DE VALIDACIÓN
========================================================= */

function getFieldError(
  field: keyof MemberFormState,
  form: MemberFormState,
  initialForm: MemberFormState,
  mode: MemberFormMode,
) {
  const normalizedForm = normalizeForm(form);
  const shouldValidate =
    mode === "create" || isFieldChanged(field, form, initialForm);

  if (!shouldValidate) {
    return undefined;
  }

  if (field === "nombre") {
    if (!normalizedForm.nombre) {
      return "El nombre es obligatorio.";
    }

    if (!PERSON_NAME_PATTERN.test(normalizedForm.nombre)) {
      return "Ingresá entre 2 y 50 letras; se permiten espacios y tildes.";
    }
  }

  if (field === "apellido") {
    if (!normalizedForm.apellido) {
      return "El apellido es obligatorio.";
    }

    if (!PERSON_NAME_PATTERN.test(normalizedForm.apellido)) {
      return "Ingresá entre 2 y 50 letras; se permiten espacios y tildes.";
    }
  }

  if (field === "documento") {
    if (!normalizedForm.documento) {
      return "El documento es obligatorio.";
    }

    if (!DOCUMENT_PATTERN.test(normalizedForm.documento)) {
      return "Ingresá una cédula de 7 u 8 dígitos, sin puntos ni guiones.";
    }
  }

  if (field === "telefono") {
    if (!normalizedForm.telefono) {
      return "El teléfono es obligatorio.";
    }

    if (!PHONE_PATTERN.test(normalizedForm.telefono)) {
      return "Ingresá entre 8 y 15 dígitos, sin espacios ni guiones.";
    }
  }

  if (field === "email") {
    if (!normalizedForm.email) {
      return "El correo electrónico es obligatorio.";
    }

    if (!EMAIL_PATTERN.test(normalizedForm.email)) {
      return "Ingresá un correo electrónico válido.";
    }
  }

  return undefined;
}

function validateForm(
  form: MemberFormState,
  initialForm: MemberFormState,
  mode: MemberFormMode,
) {
  const fields: Array<keyof MemberFormState> = [
    "nombre",
    "apellido",
    "documento",
    "telefono",
    "email",
  ];

  return fields.reduce<MemberFormErrors>((errors, field) => {
    const fieldError = getFieldError(
      field,
      form,
      initialForm,
      mode,
    );

    if (fieldError) {
      errors[field] = fieldError;
    }

    return errors;
  }, {});
}

/* =========================================================
   HELPERS DE PAYLOAD
========================================================= */

function buildCreatePayload(
  form: MemberFormState,
): CreateSocioPayload {
  const normalizedForm = normalizeForm(form);

  return {
    nombre: normalizedForm.nombre,
    apellido: normalizedForm.apellido,
    documento: normalizedForm.documento,
    telefono: normalizedForm.telefono,
    email: normalizedForm.email,
  };
}

function buildUpdatePayload(
  form: MemberFormState,
  initialForm: MemberFormState,
): UpdateSocioPayload {
  const normalizedForm = normalizeForm(form);
  const normalizedInitial = normalizeForm(initialForm);
  const payload: UpdateSocioPayload = {};

  if (normalizedForm.nombre !== normalizedInitial.nombre) {
    payload.nombre = normalizedForm.nombre;
  }

  if (normalizedForm.apellido !== normalizedInitial.apellido) {
    payload.apellido = normalizedForm.apellido;
  }

  if (normalizedForm.documento !== normalizedInitial.documento) {
    payload.documento = normalizedForm.documento;
  }

  if (normalizedForm.telefono !== normalizedInitial.telefono) {
    payload.telefono = normalizedForm.telefono;
  }

  if (normalizedForm.email !== normalizedInitial.email) {
    payload.email = normalizedForm.email;
  }

  return payload;
}

/* =========================================================
   CONTENIDO DEL FORMULARIO
========================================================= */

type MemberFormContentProps = MemberFormModalProps;

function MemberFormContent({
  open,
  mode,
  socio,
  loading,
  error,
  onClose,
  onClearError,
  onSubmit,
}: MemberFormContentProps) {
  const [initialForm] = useState<MemberFormState>(() =>
    buildInitialFormState(mode, socio),
  );
  const [form, setForm] =
    useState<MemberFormState>(initialForm);
  const [errors, setErrors] =
    useState<MemberFormErrors>({});
  const [discardDialogOpen, setDiscardDialogOpen] =
    useState(false);

  const isCreateMode = mode === "create";
  const isDirty = useMemo(
    () => hasUnsavedChanges(form, initialForm),
    [form, initialForm],
  );

  const title = isCreateMode ? "Nuevo socio" : "Editar socio";
  const subtitle = isCreateMode
    ? "Registrá los datos personales y de acceso del nuevo integrante del club."
    : `Actualizá la información de ${socio?.nombre ?? "este socio"} sin modificar su estado funcional.`;
  const submitLabel = isCreateMode
    ? "Registrar socio"
    : "Guardar cambios";
  const loadingLabel = isCreateMode
    ? "Registrando..."
    : "Guardando...";

  const handleChange = (
    field: keyof MemberFormState,
    value: string,
  ) => {
    const nextValue =
      field === "documento" || field === "telefono"
        ? normalizeNumericText(value)
        : value;

    setForm((currentForm) => ({
      ...currentForm,
      [field]: nextValue,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));

    onClearError?.();
  };

  const handleBlur = (field: keyof MemberFormState) => {
    const fieldError = getFieldError(
      field,
      form,
      initialForm,
      mode,
    );

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: fieldError,
    }));
  };

  const requestClose = () => {
    if (loading) {
      return;
    }

    if (isDirty) {
      setDiscardDialogOpen(true);
      return;
    }

    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(
      form,
      initialForm,
      mode,
    );

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!isCreateMode && !isDirty) {
      return;
    }

    const payload = isCreateMode
      ? buildCreatePayload(form)
      : buildUpdatePayload(form, initialForm);

    await onSubmit(payload);
  };

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        aria-labelledby="member-form-title"
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            requestClose();
          }
        }}
        slotProps={{
          paper: {
            sx: membersStyles.memberFormDialog,
          },
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={(event) => void handleSubmit(event)}
        >
          <Box sx={membersStyles.memberFormHeader}>
            <Box sx={membersStyles.memberFormHeaderContent}>
              <DialogTitle
                id="member-form-title"
                sx={membersStyles.memberFormTitle}
              >
                {title}
              </DialogTitle>

              <Typography sx={membersStyles.memberFormSubtitle}>
                {subtitle}
              </Typography>
            </Box>

            <IconButton
              aria-label="Cerrar formulario"
              disabled={loading}
              onClick={requestClose}
              sx={membersStyles.memberFormCloseButton}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </Box>

          <DialogContent sx={membersStyles.memberFormContent}>
            <Box sx={membersStyles.memberFormIntro}>
              <Box sx={membersStyles.memberFormIntroIcon}>
                {isCreateMode ? (
                  <SecurityOutlinedIcon />
                ) : (
                  <EditNoteOutlinedIcon />
                )}
              </Box>

              <Box>
                <Typography sx={membersStyles.memberFormIntroTitle}>
                  {isCreateMode
                    ? "Acceso inicial seguro"
                    : "Actualización trazable"}
                </Typography>

                <Typography
                  sx={membersStyles.memberFormIntroDescription}
                >
                  {isCreateMode
                    ? "El sistema generará una contraseña temporal, la enviará por correo y exigirá cambiarla en el primer acceso."
                    : "Solo se enviarán los campos modificados. Los cambios quedarán registrados en la auditoría administrativa."}
                </Typography>
              </Box>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{ ...membersStyles.feedbackAlert, mb: 2.5 }}
              >
                {error}
              </Alert>
            )}

            <Box sx={membersStyles.memberFormSection}>
              <Typography sx={membersStyles.memberFormSectionTitle}>
                Datos personales y de acceso
              </Typography>

              <Box sx={membersStyles.memberFormGrid}>
                <TextField
                  autoFocus
                  required={isCreateMode}
                  label="Nombre"
                  value={form.nombre}
                  error={Boolean(errors.nombre)}
                  helperText={
                    errors.nombre ?? "Entre 2 y 50 letras."
                  }
                  autoComplete="given-name"
                  disabled={loading}
                  onBlur={() => handleBlur("nombre")}
                  onChange={(event) =>
                    handleChange("nombre", event.target.value)
                  }
                  slotProps={{
                    htmlInput: {
                      maxLength: 50,
                    },
                  }}
                  sx={membersStyles.memberFormField}
                />

                <TextField
                  required={isCreateMode}
                  label="Apellido"
                  value={form.apellido}
                  error={Boolean(errors.apellido)}
                  helperText={
                    errors.apellido ?? "Entre 2 y 50 letras."
                  }
                  autoComplete="family-name"
                  disabled={loading}
                  onBlur={() => handleBlur("apellido")}
                  onChange={(event) =>
                    handleChange("apellido", event.target.value)
                  }
                  slotProps={{
                    htmlInput: {
                      maxLength: 50,
                    },
                  }}
                  sx={membersStyles.memberFormField}
                />

                <TextField
                  required={isCreateMode}
                  label="Documento"
                  value={form.documento}
                  error={Boolean(errors.documento)}
                  helperText={
                    errors.documento ??
                    "Cédula de 7 u 8 dígitos, sin puntos ni guiones."
                  }
                  autoComplete="off"
                  disabled={loading}
                  onBlur={() => handleBlur("documento")}
                  onChange={(event) =>
                    handleChange("documento", event.target.value)
                  }
                  slotProps={{
                    htmlInput: {
                      inputMode: "numeric",
                      maxLength: 8,
                    },
                  }}
                  sx={membersStyles.memberFormField}
                />

                <TextField
                  required={isCreateMode}
                  label="Teléfono"
                  value={form.telefono}
                  error={Boolean(errors.telefono)}
                  helperText={
                    errors.telefono ??
                    "Entre 8 y 15 dígitos, sin espacios ni guiones."
                  }
                  autoComplete="tel"
                  disabled={loading}
                  onBlur={() => handleBlur("telefono")}
                  onChange={(event) =>
                    handleChange("telefono", event.target.value)
                  }
                  slotProps={{
                    htmlInput: {
                      inputMode: "tel",
                      maxLength: 15,
                    },
                  }}
                  sx={membersStyles.memberFormField}
                />

                <Box sx={membersStyles.memberFormFullWidthField}>
                  <TextField
                    fullWidth
                    required={isCreateMode}
                    type="email"
                    label="Correo electrónico"
                    value={form.email}
                    error={Boolean(errors.email)}
                    helperText={
                      errors.email ??
                      (isCreateMode
                        ? "Se utilizará para enviar la contraseña temporal y acceder al portal."
                        : "Cambiarlo también actualizará el correo utilizado para iniciar sesión.")
                    }
                    autoComplete="email"
                    disabled={loading}
                    onBlur={() => handleBlur("email")}
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                    slotProps={{
                      htmlInput: {
                        maxLength: 254,
                      },
                    }}
                    sx={membersStyles.memberFormField}
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={membersStyles.memberFormActions}>
            <Button
              type="button"
              disabled={loading}
              onClick={requestClose}
              sx={membersStyles.memberFormCancelButton}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading || (!isCreateMode && !isDirty)}
              startIcon={
                loading ? (
                  <CircularProgress size={17} color="inherit" />
                ) : isCreateMode ? (
                  <PersonAddAlt1OutlinedIcon />
                ) : (
                  <EditNoteOutlinedIcon />
                )
              }
              sx={membersStyles.memberFormSubmitButton}
            >
              {loading ? loadingLabel : submitLabel}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={discardDialogOpen}
        maxWidth="xs"
        fullWidth
        aria-labelledby="discard-member-form-title"
        onClose={() => setDiscardDialogOpen(false)}
        slotProps={{
          paper: {
            sx: membersStyles.memberDiscardDialog,
          },
        }}
      >
        <DialogTitle id="discard-member-form-title">
          Descartar cambios
        </DialogTitle>

        <DialogContent sx={membersStyles.memberDiscardContent}>
          <Typography color="text.secondary">
            Hay cambios sin guardar. Esta información se perderá si
            cerrás el formulario.
          </Typography>
        </DialogContent>

        <DialogActions sx={membersStyles.memberDiscardActions}>
          <Button
            onClick={() => setDiscardDialogOpen(false)}
            sx={membersStyles.memberFormCancelButton}
          >
            Seguir editando
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setDiscardDialogOpen(false);
              onClose();
            }}
            sx={membersStyles.memberFormSubmitButton}
          >
            Descartar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/* =========================================================
   COMPONENTE PÚBLICO
========================================================= */

/*
Modal reutilizable para alta y edición de socios.

Responsabilidades:
- administrar el estado local del formulario;
- validar según las mismas reglas del backend;
- normalizar datos antes de enviarlos;
- enviar solo campos modificados durante la edición;
- proteger cambios sin guardar;
- representar loading y errores de la operación.

No realiza solicitudes HTTP.
No conoce el hook useSocios.
No cambia estados funcionales del socio.
*/
export function MemberFormModal(props: MemberFormModalProps) {
  if (!props.open) {
    return null;
  }

  const formKey = `${props.mode}-${props.socio?.id ?? "new"}`;

  return <MemberFormContent key={formKey} {...props} />;
}