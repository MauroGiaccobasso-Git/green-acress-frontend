"use client";

import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
import { alpha } from "@mui/material/styles";
import { type FormEvent, useState } from "react";

import type { PublishNewsPayload } from "@/api/newsApi";
import { colors } from "@/theme/colors";

import { newsStyles } from "../news.styles";

type NewsFormModalProps = {
  open: boolean;
  publishing: boolean;
  error: string | null;
  onSubmit: (payload: PublishNewsPayload) => Promise<boolean>;
  onClose: () => void;
  onClearError: () => void;
};

type NewsFormValues = {
  titulo: string;
  contenido: string;
};

type NewsFormTouched = {
  titulo: boolean;
  contenido: boolean;
};

const INITIAL_VALUES: NewsFormValues = {
  titulo: "",
  contenido: "",
};

const INITIAL_TOUCHED: NewsFormTouched = {
  titulo: false,
  contenido: false,
};

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Modal administrativo para publicar novedades.

Responsabilidades:
- capturar título y contenido;
- validar campos obligatorios;
- normalizar valores antes del envío;
- explicar el impacto de la publicación;
- proteger cambios sin guardar;
- representar carga y errores funcionales.

No realiza solicitudes HTTP.
No asigna el estado inicial.
No genera notificaciones directamente.
*/
export function NewsFormModal({
  open,
  publishing,
  error,
  onSubmit,
  onClose,
  onClearError,
}: NewsFormModalProps) {
  const [values, setValues] = useState<NewsFormValues>(INITIAL_VALUES);

  const [touched, setTouched] = useState<NewsFormTouched>(INITIAL_TOUCHED);

  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  const normalizedTitle = values.titulo.trim();
  const normalizedContent = values.contenido.trim();

  const titleError = touched.titulo && normalizedTitle.length === 0;

  const contentError = touched.contenido && normalizedContent.length === 0;

  const hasChanges = values.titulo.length > 0 || values.contenido.length > 0;

  const canSubmit =
    normalizedTitle.length > 0 && normalizedContent.length > 0 && !publishing;

  /* =========================================================
     HELPERS DE ESTADO
  ========================================================= */

  const updateField = (field: keyof NewsFormValues, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    if (error) {
      onClearError();
    }
  };

  const resetForm = () => {
    setValues(INITIAL_VALUES);
    setTouched(INITIAL_TOUCHED);
    setDiscardDialogOpen(false);
    onClearError();
  };

  /* =========================================================
     CIERRE Y DESCARTE
  ========================================================= */

  const closeModal = () => {
    if (publishing) {
      return;
    }

    if (hasChanges) {
      setDiscardDialogOpen(true);
      return;
    }

    resetForm();
    onClose();
  };

  const confirmDiscard = () => {
    resetForm();
    onClose();
  };

  /* =========================================================
     PUBLICACIÓN
  ========================================================= */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched({
      titulo: true,
      contenido: true,
    });

    if (
      normalizedTitle.length === 0 ||
      normalizedContent.length === 0 ||
      publishing
    ) {
      return;
    }

    const published = await onSubmit({
      titulo: normalizedTitle,
      contenido: normalizedContent,
    });

    if (!published) {
      return;
    }

    resetForm();
    onClose();
  };

  return (
    <>
      {/* =====================================================
          MODAL PRINCIPAL
      ====================================================== */}

      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
        scroll="paper"
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            closeModal();
          }
        }}
        aria-labelledby="publish-news-dialog-title"
        aria-describedby="publish-news-dialog-description"
        slotProps={{
          paper: {
            sx: {
              ...newsStyles.modalPaper,

              width: {
                xs: "calc(100% - 24px)",
                sm: "100%",
              },

              maxWidth: 760,

              maxHeight: {
                xs: "calc(100% - 24px)",
                sm: "calc(100% - 64px)",
              },

              m: {
                xs: 1.5,
                sm: 4,
              },

              borderRadius: "22px",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* =================================================
              ENCABEZADO
          ================================================== */}

          <Box
            sx={{
              ...newsStyles.modalHeader,

              px: {
                xs: 2,
                sm: 3,
              },

              py: {
                xs: 2,
                sm: 2.5,
              },

              background: `linear-gradient(
                135deg,
                ${colors.background.surface} 0%,
                ${alpha(colors.background.soft, 0.72)} 100%
              )`,
            }}
          >
            <Box sx={newsStyles.modalHeaderContent}>
              <DialogTitle
                id="publish-news-dialog-title"
                component="h2"
                sx={{
                  ...newsStyles.modalTitle,

                  fontSize: {
                    xs: 20,
                    sm: 22,
                  },

                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                Publicar nueva novedad
              </DialogTitle>

              <Typography
                id="publish-news-dialog-description"
                sx={{
                  ...newsStyles.modalSubtitle,
                  mt: 0.75,
                  maxWidth: 560,
                  fontSize: 13.5,
                }}
              >
                Comunicá información importante a los socios habilitados del
                club.
              </Typography>
            </Box>

            <IconButton
              type="button"
              aria-label="Cerrar formulario de publicación"
              disabled={publishing}
              onClick={closeModal}
              sx={{
                ...newsStyles.modalCloseButton,
                border: `1px solid ${colors.border.default}`,
                backgroundColor: colors.background.surface,

                "&:hover": {
                  color: colors.text.primary,
                  borderColor: colors.border.strong,
                  backgroundColor: colors.background.soft,
                },
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          {/* =================================================
              CONTENIDO
          ================================================== */}

          <DialogContent
            dividers={false}
            sx={{
              ...newsStyles.modalContent,

              minHeight: 0,
              overflowY: "auto",

              px: {
                xs: 2,
                sm: 3,
              },

              py: {
                xs: 2.25,
                sm: 3,
              },

              backgroundColor: colors.background.surface,
            }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{
                  ...newsStyles.alert,
                  mb: 2.25,
                }}
              >
                {error}
              </Alert>
            )}

            {/* =================================================
                INTRODUCCIÓN
            ================================================== */}

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.4,
                mb: 2.5,
                p: 1.75,
                borderRadius: "15px",
                color: colors.brand.primaryDark,
                backgroundColor: colors.background.soft,
                border: `1px solid ${colors.border.default}`,
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "11px",
                  color: colors.brand.primary,
                  backgroundColor: colors.background.surface,
                  border: `1px solid ${colors.border.default}`,

                  "& svg": {
                    fontSize: 21,
                  },
                }}
              >
                <CampaignOutlinedIcon />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13.5,
                    fontWeight: 650,
                    color: colors.text.primary,
                  }}
                >
                  Publicación inmediata
                </Typography>

                <Typography
                  sx={{
                    mt: 0.35,
                    fontSize: 12.5,
                    color: colors.text.secondary,
                    lineHeight: 1.45,
                  }}
                >
                  La novedad se publicará directamente en estado Activa y se
                  generarán las notificaciones para los destinatarios
                  habilitados.
                </Typography>
              </Box>
            </Box>

            {/* =================================================
                FORMULARIO
            ================================================== */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Typography
                component="h3"
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: colors.brand.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.065em",
                }}
              >
                Contenido de la publicación
              </Typography>

              <TextField
                autoFocus
                required
                fullWidth
                id="news-title"
                name="titulo"
                label="Título"
                placeholder="Ej.: Nuevo ingreso de variedades"
                value={values.titulo}
                error={titleError}
                helperText={
                  titleError
                    ? "El título de la novedad es obligatorio."
                    : "Será el encabezado principal visible para los socios."
                }
                disabled={publishing}
                onChange={(event) => updateField("titulo", event.target.value)}
                sx={{
                  ...newsStyles.field,

                  "& .MuiOutlinedInput-root": {
                    minHeight: 52,
                    borderRadius: "13px",
                    backgroundColor: colors.background.surface,
                    fontSize: 14,
                  },
                }}
              />

              <Typography
                aria-live="polite"
                sx={{
                  mt: -1.1,
                  display: "flex",
                  justifyContent: "flex-end",
                  fontSize: 10.75,
                  fontWeight: 500,
                  color: colors.text.muted,
                }}
              >
                {values.titulo.length} caracteres
              </Typography>

              <TextField
                required
                fullWidth
                multiline
                rows={6}
                id="news-content"
                name="contenido"
                label="Contenido"
                placeholder="Escribí el contenido completo que recibirán los socios..."
                value={values.contenido}
                error={contentError}
                helperText={
                  contentError
                    ? "El contenido de la novedad es obligatorio."
                    : "Este texto se mostrará en el Portal Socio y en el correo electrónico."
                }
                disabled={publishing}
                onChange={(event) =>
                  updateField("contenido", event.target.value)
                }
                sx={{
                  ...newsStyles.field,

                  "& .MuiOutlinedInput-root": {
                    alignItems: "flex-start",
                    minHeight: "auto",
                    borderRadius: "13px",
                    backgroundColor: colors.background.surface,
                    fontSize: 14,
                  },

                  "& textarea": {
                    minHeight: "unset !important",
                    lineHeight: 1.6,
                    resize: "none",
                  },
                }}
              />

              <Typography
                aria-live="polite"
                sx={{
                  mt: -1.1,
                  display: "flex",
                  justifyContent: "flex-end",
                  fontSize: 10.75,
                  fontWeight: 500,
                  color: colors.text.muted,
                }}
              >
                {values.contenido.length} caracteres
              </Typography>

              <Box sx={newsStyles.publicationNotice}>
                <InfoOutlinedIcon aria-hidden="true" />

                <Typography sx={newsStyles.publicationNoticeText}>
                  Después de publicarla no podrá editarse. Solamente podrá
                  activarse o inactivarse y estos cambios no reenviarán las
                  notificaciones.
                </Typography>
              </Box>
            </Box>
          </DialogContent>

          {/* =================================================
              ACCIONES
          ================================================== */}

          <DialogActions
            sx={{
              ...newsStyles.modalActions,

              flexDirection: {
                xs: "column-reverse",
                sm: "row",
              },

              justifyContent: "flex-end",

              px: {
                xs: 2,
                sm: 3,
              },

              py: 2,

              "& > :not(style) ~ :not(style)": {
                ml: 0,
              },
            }}
          >
            <Button
              type="button"
              disabled={publishing}
              onClick={closeModal}
              sx={{
                ...newsStyles.cancelButton,

                width: {
                  xs: "100%",
                  sm: "auto",
                },

                minHeight: 44,
                px: 2.25,
                borderRadius: "12px",
                fontWeight: 700,
              }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!canSubmit}
              startIcon={
                publishing ? (
                  <CircularProgress size={17} thickness={5} color="inherit" />
                ) : (
                  <CampaignOutlinedIcon />
                )
              }
              sx={{
                ...newsStyles.submitButton,

                width: {
                  xs: "100%",
                  sm: "auto",
                },

                minHeight: 44,
                px: 2.5,
                borderRadius: "12px",
                fontWeight: 750,
              }}
            >
              {publishing ? "Publicando..." : "Publicar novedad"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* =====================================================
          CONFIRMACIÓN DE DESCARTE
      ====================================================== */}

      <Dialog
        open={discardDialogOpen}
        fullWidth
        maxWidth="xs"
        onClose={() => {
          if (!publishing) {
            setDiscardDialogOpen(false);
          }
        }}
        aria-labelledby="discard-news-dialog-title"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "18px",
              border: `1px solid ${colors.border.default}`,
              boxShadow: "0 28px 80px rgba(15, 39, 27, 0.18)",
            },
          },
        }}
      >
        <Box
          sx={{
            ...newsStyles.modalHeader,
            px: 3,
            py: 2.25,
          }}
        >
          <Box sx={newsStyles.modalHeaderContent}>
            <DialogTitle
              id="discard-news-dialog-title"
              component="h2"
              sx={newsStyles.modalTitle}
            >
              ¿Descartar la novedad?
            </DialogTitle>

            <Typography sx={newsStyles.modalSubtitle}>
              Los datos ingresados todavía no fueron publicados.
            </Typography>
          </Box>

          <IconButton
            type="button"
            aria-label="Cerrar confirmación"
            disabled={publishing}
            onClick={() => setDiscardDialogOpen(false)}
            sx={newsStyles.modalCloseButton}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <DialogContent
          sx={{
            px: 3,
            pt: 2.25,
            pb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: 13.25,
              color: colors.text.secondary,
              lineHeight: 1.6,
            }}
          >
            Al descartar los cambios se perderán el título y el contenido
            ingresados en el formulario.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            gap: 1,

            "& > :not(style) ~ :not(style)": {
              ml: 0,
            },
          }}
        >
          <Button
            type="button"
            disabled={publishing}
            onClick={() => setDiscardDialogOpen(false)}
            sx={newsStyles.cancelButton}
          >
            Seguir editando
          </Button>

          <Button
            type="button"
            disabled={publishing}
            onClick={confirmDiscard}
            sx={newsStyles.dangerButton}
          >
            Descartar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
