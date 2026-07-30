"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

import { useAuthentication } from "@/hooks/auth/useAuthentication";
import { useAuth } from "@/hooks/auth/useAuth";

import { consentStyles } from "./consent.styles";

/*
==================================================
CONTAINER DE CONSENTIMIENTO INFORMADO
==================================================
*/

/*
Container correspondiente al flujo de
aceptación del consentimiento informado.

Responsabilidades:

- renderizar la interfaz del consentimiento;

- administrar interacción visual;

- ejecutar aceptación mediante
  useAuthentication;

- controlar estados visuales del formulario.

Este container NO realiza llamadas
directas al backend.

Este container NO contiene reglas
de negocio.

Toda la comunicación con backend
ocurre mediante useAuthentication.
*/
export default function ConsentContainer() {
  const router = useRouter();

  const [accepted, setAccepted] = useState(false);

  const { handleAcceptConsentimiento, isAcceptingConsentimiento } =
    useAuthentication();

  const { logout } = useAuth();

  /*
  Envía la aceptación del consentimiento.

  Luego de aceptar correctamente,
  el usuario vuelve al login.

  El próximo acceso permitirá
  ingresar normalmente al portal.
  */
  const handleSubmitConsent = async () => {
    const response = await handleAcceptConsentimiento();

    if (response) {
      router.push("/");

      return;
    }
  };

  /*
Abandona el flujo de consentimiento.

El usuario cierra la sesión actual
y vuelve al inicio de sesión.

Si vuelve a ingresar y todavía
no aceptó el consentimiento informado,
el sistema volverá a solicitar
la aceptación antes de permitir
el acceso al portal del socio.
*/
  const handleBackToLogin = () => {
    logout();

    router.push("/");
  };

  const consentItems = [
    "Autorizo al Club Green Acres a recolectar, almacenar y tratar mis datos personales necesarios para la gestión de mi condición de socio, de acuerdo con la normativa vigente en Uruguay.",

    "Mis datos serán utilizados exclusivamente para la administración interna del club, incluyendo gestión de membresía, reservas, compras y comunicaciones relacionadas.",

    "Los datos personales proporcionados no serán compartidos con terceros ajenos al club, salvo obligación legal.",

    "Podré ejercer mis derechos de acceso, rectificación, actualización o supresión de mis datos personales mediante solicitud al club.",

    "Comprendo que la aceptación del consentimiento es necesaria para acceder a las funcionalidades disponibles como socio.",

    "El consentimiento tendrá vigencia mientras mantenga mi condición de socio activo del club.",
  ];

  return (
    <Box component="main" sx={consentStyles.page}>
      <Container maxWidth={false} sx={consentStyles.container}>
        <Stack spacing={1.2} sx={consentStyles.brandWrapper}>
          <Box sx={consentStyles.brandIcon}>G</Box>

          <Box>
            <Typography
              component="h1"
              variant="h4"
              sx={consentStyles.brandTitle}
            >
              Green Acres
            </Typography>

            <Typography variant="body2" sx={consentStyles.brandSubtitle}>
              Gestión inteligente para clubes
            </Typography>
          </Box>
        </Stack>

        <Paper elevation={0} sx={consentStyles.card}>
          <Stack spacing={2}>
            <Box>
              <Typography
                component="h2"
                variant="h5"
                sx={consentStyles.cardTitle}
              >
                Consentimiento informado
              </Typography>

              <Typography variant="body2" sx={consentStyles.cardSubtitle}>
                Para continuar utilizando el portal debes aceptar el
                consentimiento informado del club.
              </Typography>
            </Box>

            <Box sx={consentStyles.consentBox}>
              <Typography variant="subtitle2" sx={consentStyles.consentTitle}>
                Información importante
              </Typography>

              <Typography variant="body2" sx={consentStyles.consentDescription}>
                Lee atentamente las condiciones del consentimiento informado y
                confirma tu aceptación para continuar.
              </Typography>
            </Box>

            <Box sx={consentStyles.legalBox}>
              <Typography variant="subtitle2" sx={consentStyles.legalTitle}>
                Consentimiento informado
              </Typography>

              <Typography variant="body2" sx={consentStyles.legalIntroduction}>
                Al aceptar el presente consentimiento, declaro haber leído,
                comprendido y aceptado las condiciones detalladas a
                continuación:
              </Typography>

              <Box sx={consentStyles.legalList}>
                {consentItems.map((item) => (
                  <Box key={item} sx={consentStyles.legalItem}>
                    <CheckCircleOutlineRoundedIcon
                      sx={consentStyles.legalItemIcon}
                    />

                    <Typography
                      variant="body2"
                      sx={consentStyles.legalItemText}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                />
              }
              label={
                <Typography sx={consentStyles.checkboxLabel}>
                  Acepto los términos y condiciones del consentimiento informado
                  y autorizo el tratamiento de mis datos personales conforme a
                  lo descrito anteriormente.
                </Typography>
              }
              sx={consentStyles.checkboxContainer}
            />

            <Button
              type="button"
              variant="contained"
              fullWidth
              disabled={!accepted || isAcceptingConsentimiento}
              onClick={handleSubmitConsent}
              sx={consentStyles.submitButton}
            >
              {isAcceptingConsentimiento
                ? "Aceptando..."
                : "Aceptar consentimiento"}
            </Button>

            <Button
              type="button"
              variant="text"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={handleBackToLogin}
              sx={consentStyles.backToLoginLink}
            >
              Volver al inicio de sesión
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
