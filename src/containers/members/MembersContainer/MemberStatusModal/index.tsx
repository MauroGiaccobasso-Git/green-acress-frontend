"use client";

import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  ButtonBase,
  Chip,
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
  Socio,
  SocioStatus,
  UpdateSocioStatusPayload,
} from "@/api/sociosApi";
import { colors } from "@/theme/colors";

import { membersStyles } from "../members.styles";

type MemberStatusModalProps = {
  open: boolean;
  socio: Socio | null;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onClearError?: () => void;
  onSubmit: (payload: UpdateSocioStatusPayload) => Promise<void>;
};

type StatusOption = {
  value: SocioStatus;
  label: string;
  description: string;
  color: string;
  icon: ReactNode;
};

type FormErrors = {
  estado?: string;
  motivo?: string;
};

/* =========================================================
   CONFIGURACIÓN DEL DOMINIO
========================================================= */

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "ACTIVO",
    label: "Activo",
    description:
      "Habilita nuevamente la operación normal del socio dentro del sistema.",
    color: colors.state.success,
    icon: <CheckCircleOutlineOutlinedIcon fontSize="small" />,
  },
  {
    value: "INACTIVO",
    label: "Inactivo",
    description:
      "Mantiene el acceso al portal, pero restringe las operaciones del socio.",
    color: colors.state.warning,
    icon: <PauseCircleOutlineOutlinedIcon fontSize="small" />,
  },
  {
    value: "SUSPENDIDO",
    label: "Suspendido",
    description:
      "Bloquea el acceso y ejecuta las reglas de seguridad y reservas asociadas.",
    color: colors.state.error,
    icon: <BlockOutlinedIcon fontSize="small" />,
  },
];

const STATUS_LABELS: Record<SocioStatus, string> = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
  SUSPENDIDO: "Suspendido",
};

const MAX_REASON_LENGTH = 500;

/* =========================================================
   HELPERS
========================================================= */

function normalizeReason(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function validateForm(
  selectedStatus: SocioStatus | null,
  reason: string,
): FormErrors {
  const errors: FormErrors = {};
  const normalizedReason = normalizeReason(reason);

  if (!selectedStatus) {
    errors.estado = "Seleccioná el nuevo estado del socio.";
  }

  if (!normalizedReason) {
    errors.motivo = "El motivo del cambio de estado es obligatorio.";
  } else if (normalizedReason.length > MAX_REASON_LENGTH) {
    errors.motivo = `El motivo no puede superar los ${MAX_REASON_LENGTH} caracteres.`;
  }

  return errors;
}

function getStatusWarning(status: SocioStatus | null) {
  if (status === "ACTIVO") {
    return {
      severity: "success" as const,
      title: "Reactivación del socio",
      description:
        "El socio recuperará su estado operativo. Si estaba suspendido, deberá iniciar una nueva sesión porque los tokens anteriores permanecen revocados.",
    };
  }

  if (status === "INACTIVO") {
    return {
      severity: "warning" as const,
      title: "Restricción operativa",
      description:
        "El socio conservará el acceso al portal, pero quedará restringido para operar. El backend rechazará el cambio si existen reservas activas.",
    };
  }

  if (status === "SUSPENDIDO") {
    return {
      severity: "error" as const,
      title: "Suspensión y revocación de acceso",
      description:
        "Se bloqueará el acceso, se cancelarán las reservas activas, se liberará el stock comprometido, se enviarán las notificaciones correspondientes y se invalidarán las sesiones vigentes.",
    };
  }

  return null;
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Modal administrativo para cambios de estado de socios.

Responsabilidades:
- presentar las transiciones disponibles;
- impedir seleccionar el estado actual;
- exigir un motivo explícito y trazable;
- comunicar el impacto funcional de cada estado;
- proteger cambios sin confirmar;
- delegar la mutación al container mediante onSubmit.

No realiza solicitudes HTTP.
No replica reglas críticas del backend.
*/
export function MemberStatusModal({
  open,
  socio,
  loading,
  error,
  onClose,
  onClearError,
  onSubmit,
}: MemberStatusModalProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<SocioStatus | null>(null);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [discardDialogOpen, setDiscardDialogOpen] =
    useState(false);

  const isDirty = Boolean(selectedStatus || reason.trim());

  const selectedWarning = useMemo(
    () => getStatusWarning(selectedStatus),
    [selectedStatus],
  );

  /*
  Reinicia el formulario al comenzar cada apertura del diálogo.

  Se ejecuta desde el evento de transición de MUI, evitando
  sincronizar estado derivado mediante useEffect.
  */
  const handleDialogEnter = () => {
    setSelectedStatus(null);
    setReason("");
    setErrors({});
    setDiscardDialogOpen(false);
    onClearError?.();
  };

  if (!socio) {
    return null;
  }

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

  const handleStatusSelect = (status: SocioStatus) => {
    if (status === socio.estado || loading) {
      return;
    }

    setSelectedStatus(status);
    setErrors((currentErrors) => ({
      ...currentErrors,
      estado: undefined,
    }));
    onClearError?.();
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
    setErrors((currentErrors) => ({
      ...currentErrors,
      motivo: undefined,
    }));
    onClearError?.();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(selectedStatus, reason);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !selectedStatus) {
      return;
    }

    await onSubmit({
      estado: selectedStatus,
      motivo: normalizeReason(reason),
    });
  };

  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
        aria-labelledby="member-status-title"
        onClose={(_, closeReason) => {
          if (
            closeReason === "backdropClick" ||
            closeReason === "escapeKeyDown"
          ) {
            requestClose();
          }
        }}
        slotProps={{
          transition: {
            onEnter: handleDialogEnter,
          },
          paper: {
            sx: membersStyles.memberStatusDialog,
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
                id="member-status-title"
                sx={membersStyles.memberFormTitle}
              >
                Cambiar estado del socio
              </DialogTitle>

              <Typography sx={membersStyles.memberFormSubtitle}>
                {socio.nombre} {socio.apellido} se encuentra actualmente en
                estado {STATUS_LABELS[socio.estado].toLowerCase()}. Seleccioná
                el nuevo estado e ingresá el motivo administrativo.
              </Typography>
            </Box>

            <IconButton
              aria-label="Cerrar cambio de estado"
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
                <ManageAccountsOutlinedIcon />
              </Box>

              <Box>
                <Typography sx={membersStyles.memberFormIntroTitle}>
                  Operación administrativa trazable
                </Typography>

                <Typography
                  sx={membersStyles.memberFormIntroDescription}
                >
                  El cambio sincronizará el estado funcional del socio con su
                  acceso al sistema y quedará registrado en auditoría.
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
                Nuevo estado
              </Typography>

              <Box
                role="radiogroup"
                aria-label="Nuevo estado del socio"
                aria-describedby={
                  errors.estado ? "member-status-error" : undefined
                }
                sx={membersStyles.statusOptionsGrid}
              >
                {STATUS_OPTIONS.map((option) => {
                  const isCurrent = option.value === socio.estado;
                  const isSelected = option.value === selectedStatus;

                  return (
                    <ButtonBase
                      key={option.value}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${option.label}${
                        isCurrent ? ", estado actual" : ""
                      }`}
                      disabled={isCurrent || loading}
                      disableRipple
                      onClick={() => handleStatusSelect(option.value)}
                      sx={{
                        ...membersStyles.statusOption(
                          isSelected,
                          option.color,
                        ),
                        ...(isCurrent
                          ? {
                              cursor: "default",
                              opacity: 0.62,
                            }
                          : {}),
                      }}
                    >
                      <Box sx={membersStyles.statusOptionHeader}>
                        <Box
                          aria-hidden="true"
                          sx={membersStyles.statusOptionDot(
                            option.color,
                          )}
                        />

                        <Typography
                          sx={membersStyles.statusOptionTitle}
                        >
                          {option.label}
                        </Typography>

                        {isCurrent && (
                          <Chip
                            size="small"
                            label="Estado actual"
                            variant="outlined"
                            sx={membersStyles.statusChip}
                          />
                        )}
                      </Box>

                      <Box
                        aria-hidden="true"
                        sx={{ color: option.color }}
                      >
                        {option.icon}
                      </Box>

                      <Typography
                        sx={membersStyles.statusOptionDescription}
                      >
                        {option.description}
                      </Typography>
                    </ButtonBase>
                  );
                })}
              </Box>

              {errors.estado && (
                <Typography
                  id="member-status-error"
                  role="alert"
                  sx={{
                    mt: 0.75,
                    fontSize: 12,
                    color: colors.state.error,
                  }}
                >
                  {errors.estado}
                </Typography>
              )}

              {selectedWarning && (
                <Alert
                  severity={selectedWarning.severity}
                  sx={membersStyles.statusWarning}
                >
                  <AlertTitle>{selectedWarning.title}</AlertTitle>
                  {selectedWarning.description}
                </Alert>
              )}

              <TextField
                required
                multiline
                minRows={4}
                maxRows={7}
                label="Motivo del cambio"
                placeholder="Describí de forma clara por qué se realiza este cambio de estado."
                value={reason}
                error={Boolean(errors.motivo)}
                helperText={
                  errors.motivo ??
                  `${reason.length}/${MAX_REASON_LENGTH} caracteres`
                }
                disabled={loading}
                onChange={(event) =>
                  handleReasonChange(event.target.value)
                }
                slotProps={{
                  htmlInput: {
                    maxLength: MAX_REASON_LENGTH,
                  },
                }}
                sx={membersStyles.memberFormField}
              />
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
              disabled={loading || !selectedStatus}
              startIcon={
                loading ? (
                  <CircularProgress size={17} color="inherit" />
                ) : (
                  <ManageAccountsOutlinedIcon />
                )
              }
              sx={membersStyles.memberFormSubmitButton}
            >
              {loading ? "Actualizando..." : "Confirmar cambio"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={discardDialogOpen}
        maxWidth="xs"
        fullWidth
        aria-labelledby="discard-status-title"
        onClose={() => {
          if (!loading) {
            setDiscardDialogOpen(false);
          }
        }}
        slotProps={{
          paper: {
            sx: membersStyles.memberDiscardDialog,
          },
        }}
      >
        <DialogTitle id="discard-status-title">
          ¿Descartar el cambio?
        </DialogTitle>

        <DialogContent sx={membersStyles.memberDiscardContent}>
          <Typography color="text.secondary">
            El estado y el motivo ingresados no se guardarán.
          </Typography>
        </DialogContent>

        <DialogActions sx={membersStyles.memberDiscardActions}>
          <Button
            disabled={loading}
            onClick={() => setDiscardDialogOpen(false)}
          >
            Continuar editando
          </Button>

          <Button
            color="error"
            variant="contained"
            disabled={loading}
            onClick={() => {
              setDiscardDialogOpen(false);
              onClose();
            }}
          >
            Descartar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}