/*
==================================================
ESTILOS - VERIFICACIÓN MFA
==================================================
*/

/*
Estilos exclusivos de la pantalla
de verificación MFA.

Objetivos:

- mantener consistencia visual con login
- priorizar legibilidad y jerarquía
- ofrecer una experiencia mobile first
- conservar foco visible y accesible
- evitar valores dependientes
  de una paleta externa al componente

Los colores principales utilizan
tokens del theme de MUI para mantenerse
alineados con la configuración global.
*/
export const verifyMfaStyles = {
  /*
  Superficie principal de la pantalla.

  Ocupa como mínimo toda la altura visible
  y centra el contenido horizontal
  y verticalmente.
  */
  page: {
    minHeight: "100dvh",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    px: {
      xs: 2,
      sm: 3,
    },

    py: {
      xs: 4,
      sm: 6,
    },

    backgroundColor: "background.default",
  },

  /*
  Contenedor central.

  Limita el ancho para mantener
  una lectura cómoda tanto en mobile
  como en escritorio.
  */
  container: {
    width: "100%",

    maxWidth: 460,

    px: "0 !important",
  },

  /*
  Encabezado de marca ubicado
  sobre la tarjeta.
  */
  brandWrapper: {
    display: "flex",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    mb: {
      xs: 2.5,
      sm: 3,
    },
  },

  /*
  Identificador visual de Green Acres.

  Mantiene una presencia compacta
  sin depender de un recurso gráfico.
  */
  brandIcon: {
    width: 46,

    height: 46,

    flexShrink: 0,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: 2,

    backgroundColor: "primary.main",

    color: "primary.contrastText",

    fontSize: "1.35rem",

    fontWeight: 800,

    lineHeight: 1,

    boxShadow: 1,

    userSelect: "none",
  },

  /*
  Nombre principal del producto.
  */
  brandTitle: {
    color: "text.primary",

    fontWeight: 800,

    lineHeight: 1.1,

    letterSpacing: "-0.02em",

    fontSize: {
      xs: "1.65rem",
      sm: "1.9rem",
    },
  },

  /*
  Descripción breve de la marca.
  */
  brandSubtitle: {
    mt: 0.35,

    color: "text.secondary",

    lineHeight: 1.4,
  },

  /*
  Tarjeta principal de verificación.

  Utiliza borde y sombra moderada
  para separar el contenido sin generar
  una interfaz visualmente pesada.
  */
  card: {
    width: "100%",

    p: {
      xs: 2.5,
      sm: 4,
    },

    border: 1,

    borderColor: "divider",

    borderRadius: {
      xs: 2.5,
      sm: 3,
    },

    backgroundColor: "background.paper",

    boxShadow: {
      xs: "0 8px 24px rgba(0, 0, 0, 0.06)",
      sm: "0 14px 36px rgba(0, 0, 0, 0.08)",
    },
  },

  /*
  Título funcional de la pantalla.
  */
  cardTitle: {
    color: "text.primary",

    fontWeight: 750,

    lineHeight: 1.25,

    letterSpacing: "-0.01em",
  },

  /*
  Texto explicativo del método
  de verificación seleccionado.
  */
  cardSubtitle: {
    mt: 0.75,

    color: "text.secondary",

    lineHeight: 1.55,
  },

  /*
  Bloque informativo de la cuenta
  sobre la cual se completa MFA.
  */
  accountBox: {
    display: "flex",

    flexDirection: "column",

    gap: 0.35,

    px: 1.75,

    py: 1.35,

    border: 1,

    borderColor: "divider",

    borderRadius: 2,

    backgroundColor: "action.hover",
  },

  /*
  Etiqueta secundaria del bloque
  de cuenta administrativa.
  */
  accountLabel: {
    color: "text.secondary",

    fontWeight: 600,

    lineHeight: 1.3,

    textTransform: "uppercase",

    letterSpacing: "0.045em",
  },

  /*
  Correo administrativo asociado
  al desafío MFA.
  */
  accountEmail: {
    color: "text.primary",

    fontWeight: 600,

    lineHeight: 1.45,

    overflowWrap: "anywhere",
  },

  /*
  Etiqueta superior de los campos.
  */
  fieldLabel: {
    color: "text.primary",

    fontWeight: 650,

    lineHeight: 1.4,
  },

  /*
  Campo específico para códigos TOTP.

  El contenido se muestra centrado
  y con espaciado entre caracteres
  para facilitar la lectura
  de los seis dígitos.
  */
  codeInput: {
    "& .MuiOutlinedInput-root": {
      minHeight: 52,

      borderRadius: 2,

      backgroundColor: "background.paper",

      transition:
        "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",

      "& fieldset": {
        borderColor: "divider",
      },

      "&:hover fieldset": {
        borderColor: "text.secondary",
      },

      "&.Mui-focused": {
        boxShadow: (theme: {
          palette: {
            primary: {
              main: string;
            };
          };
        }) => `0 0 0 3px ${theme.palette.primary.main}1F`,
      },

      "&.Mui-focused fieldset": {
        borderWidth: 1.5,
      },

      "&.Mui-disabled": {
        backgroundColor: "action.disabledBackground",
      },
    },

    "& .MuiInputBase-input": {
      py: 1.35,

      px: 2,

      textAlign: "center",

      fontSize: {
        xs: "1.25rem",
        sm: "1.35rem",
      },

      fontWeight: 700,

      letterSpacing: {
        xs: "0.3em",
        sm: "0.38em",
      },

      fontVariantNumeric: "tabular-nums",
    },

    "& .MuiInputBase-input::placeholder": {
      color: "text.disabled",

      opacity: 1,
    },
  },

  /*
  Campo para códigos de recuperación.

  Conserva una composición convencional
  porque el formato puede incluir
  letras, números o separadores.
  */
  recoveryInput: {
    "& .MuiOutlinedInput-root": {
      minHeight: 52,

      borderRadius: 2,

      backgroundColor: "background.paper",

      transition:
        "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",

      "& fieldset": {
        borderColor: "divider",
      },

      "&:hover fieldset": {
        borderColor: "text.secondary",
      },

      "&.Mui-focused": {
        boxShadow: (theme: {
          palette: {
            primary: {
              main: string;
            };
          };
        }) => `0 0 0 3px ${theme.palette.primary.main}1F`,
      },

      "&.Mui-focused fieldset": {
        borderWidth: 1.5,
      },

      "&.Mui-disabled": {
        backgroundColor: "action.disabledBackground",
      },
    },

    "& .MuiInputBase-input": {
      py: 1.35,

      px: 1.75,

      fontSize: "0.95rem",

      fontWeight: 550,

      letterSpacing: "0.025em",
    },

    "& .MuiInputBase-input::placeholder": {
      color: "text.disabled",

      opacity: 1,
    },
  },

  /*
  Mensaje de validación generado
  en la interfaz.
  */
  validationError: {
    mt: 0.25,

    color: "error.main",

    fontWeight: 500,

    lineHeight: 1.4,
  },

  /*
  Alerta correspondiente a errores
  devueltos por backend.
  */
  errorAlert: {
    borderRadius: 2,

    alignItems: "center",

    "& .MuiAlert-message": {
      width: "100%",

      lineHeight: 1.45,
    },
  },

  /*
  Acción primaria de la pantalla.
  */
  submitButton: {
    minHeight: 48,

    mt: 0.25,

    borderRadius: 2,

    fontWeight: 700,

    textTransform: "none",

    boxShadow: "none",

    transition:
      "background-color 160ms ease, box-shadow 160ms ease, transform 120ms ease",

    "&:hover": {
      boxShadow: 2,
    },

    "&:active": {
      transform: "translateY(1px)",
    },

    "&.Mui-disabled": {
      color: "action.disabled",

      backgroundColor: "action.disabledBackground",
    },
  },

  /*
  Acción secundaria para alternar
  entre TOTP y código de recuperación.
  */
  alternativeButton: {
    minHeight: 42,

    borderRadius: 2,

    color: "primary.main",

    fontWeight: 650,

    textTransform: "none",

    "&:hover": {
      backgroundColor: "action.hover",
    },
  },

  /*
  Acción para abandonar el flujo MFA
  y regresar al inicio de sesión.
  */
  cancelLink: {
    width: "fit-content",

    mx: "auto",

    p: 0,

    border: 0,

    background: "none",

    color: "text.secondary",

    cursor: "pointer",

    fontFamily: "inherit",

    fontSize: "0.875rem",

    fontWeight: 600,

    lineHeight: 1.5,

    textAlign: "center",

    transition: "color 150ms ease",

    "&:hover": {
      color: "text.primary",
    },

    "&:focus-visible": {
      borderRadius: 1,

      outline: "2px solid",

      outlineColor: "primary.main",

      outlineOffset: 3,
    },

    "&:disabled": {
      color: "action.disabled",

      cursor: "default",
    },
  },

  /*
  Bloque final de contexto de seguridad.
  */
  securityBox: {
    mt: 0.5,

    px: 1.75,

    py: 1.5,

    border: 1,

    borderColor: "divider",

    borderRadius: 2,

    backgroundColor: "action.hover",
  },

  /*
  Título del bloque de seguridad.
  */
  securityTitle: {
    color: "text.primary",

    fontWeight: 700,

    lineHeight: 1.4,
  },

  /*
  Descripción del bloque de seguridad.
  */
  securityDescription: {
    mt: 0.35,

    color: "text.secondary",

    lineHeight: 1.5,
  },

  /*
  Texto mostrado mientras se valida
  la existencia del desafío MFA
  o se procesa una redirección.
  */
  loadingText: {
    color: "text.secondary",

    fontWeight: 600,

    textAlign: "center",

    lineHeight: 1.5,
  },
};