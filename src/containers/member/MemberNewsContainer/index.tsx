"use client";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
} from "@mui/material";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useMemberNews } from "@/hooks/news/useMemberNews";
import { useMemberHeaderActions } from "@/layouts/member/MemberLayout";

import { MemberNewsFeed } from "./MemberNewsFeed";
import { memberNewsStyles as styles } from "./memberNews.styles";

/* =========================================================
   CONSTANTES
========================================================= */

const MEMBER_PORTAL_TIME_ZONE =
  "America/Montevideo";

/* =========================================================
   HELPERS DE FECHA
========================================================= */

/*
Genera una clave de calendario utilizando
la zona horaria oficial del sistema.
*/
function getDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: MEMBER_PORTAL_TIME_ZONE,
  }).format(date);
}

/*
Presenta el momento de la última consulta
completada correctamente.

Este valor es únicamente informativo
y no representa una fecha persistida.
*/
function formatUpdatedAt(date: Date): string {
  const currentDate = new Date();

  const isToday =
    getDateKey(date) === getDateKey(currentDate);

  const formattedTime =
    new Intl.DateTimeFormat("es-UY", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: MEMBER_PORTAL_TIME_ZONE,
    }).format(date);

  if (isToday) {
    return `Actualizado: hoy, ${formattedTime}`;
  }

  const formattedDate =
    new Intl.DateTimeFormat("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: MEMBER_PORTAL_TIME_ZONE,
    }).format(date);

  return `Actualizado: ${formattedDate}, ${formattedTime}`;
}

/* =========================================================
   CONTAINER PRINCIPAL
========================================================= */

/*
Coordina el módulo Novedades
dentro del Portal Socio.

Responsabilidades:

- ejecutar la carga inicial;
- coordinar el hook de novedades;
- registrar la última carga exitosa;
- publicar la actualización en el header;
- resolver reintentos;
- conservar información anterior ante
  fallos posteriores;
- presentar el feed público.

No realiza solicitudes HTTP directas.
No filtra ni ordena novedades.
No expone información administrativa.
No incorpora paginación.
*/
export default function MemberNewsContainer() {
  const {
    memberNews,
    loadingMemberNews,
    memberNewsError,
    fetchMemberNews,
    clearMemberNewsError,
  } = useMemberNews();

  const {
    setHeaderActions,
    clearHeaderActions,
  } = useMemberHeaderActions();

  /*
  Permite distinguir una carga exitosa
  con resultado vacío del estado anterior
  a la primera consulta.
  */
  const [
    lastSuccessfulLoadAt,
    setLastSuccessfulLoadAt,
  ] = useState<Date | null>(null);

  /* =========================================================
     CARGA DE NOVEDADES
  ========================================================= */

  const loadMemberNews =
    useCallback(async (): Promise<void> => {
      const news = await fetchMemberNews();

      if (news) {
        setLastSuccessfulLoadAt(new Date());
      }
    }, [fetchMemberNews]);

  /*
  Ejecuta la carga inicial del módulo.

  La protección interna del hook evita que
  una respuesta antigua reemplace otra
  consulta más reciente.
  */
  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(async () => {
      if (cancelled) {
        return;
      }

      await loadMemberNews();
    });

    return () => {
      cancelled = true;
    };
  }, [loadMemberNews]);

  /* =========================================================
     ACCIÓN CONTEXTUAL DEL HEADER
  ========================================================= */

  useEffect(() => {
    if (!lastSuccessfulLoadAt) {
      clearHeaderActions();

      return;
    }

    const updatedAtLabel =
      formatUpdatedAt(lastSuccessfulLoadAt);

    setHeaderActions(
      <Chip
        icon={<AccessTimeRoundedIcon />}
        label={updatedAtLabel}
        aria-label={updatedAtLabel}
        sx={styles.updatedAtChip}
      />,
    );

    return () => {
      clearHeaderActions();
    };
  }, [
    lastSuccessfulLoadAt,
    setHeaderActions,
    clearHeaderActions,
  ]);

  /* =========================================================
     REINTENTO
  ========================================================= */

  const handleRetry =
    useCallback((): void => {
      clearMemberNewsError();

      void loadMemberNews();
    }, [
      clearMemberNewsError,
      loadMemberNews,
    ]);

  /* =========================================================
     ESTADOS DERIVADOS
  ========================================================= */

  const hasNews = memberNews.length > 0;

  /*
  También contempla el primer render,
  anterior a que el efecto active
  formalmente la solicitud.
  */
  const isInitialLoading =
    !lastSuccessfulLoadAt &&
    !hasNews &&
    (
      loadingMemberNews ||
      !memberNewsError
    );

  const showNonBlockingError =
    Boolean(memberNewsError) && hasNews;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Box sx={styles.root}>
      <Box sx={styles.pageStack}>
        {showNonBlockingError ? (
          <Alert
            severity="warning"
            sx={styles.nonBlockingAlert}
            action={
              <Button
                type="button"
                color="inherit"
                size="small"
                startIcon={
                  <RefreshRoundedIcon />
                }
                onClick={handleRetry}
                disabled={loadingMemberNews}
                sx={{
                  minWidth: "auto",
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                {loadingMemberNews
                  ? "Reintentando..."
                  : "Reintentar"}
              </Button>
            }
          >
            No fue posible actualizar las novedades.
            Se continúa mostrando la última
            información disponible.
          </Alert>
        ) : null}

        <MemberNewsFeed
          news={memberNews}
          isLoading={
            isInitialLoading ||
            loadingMemberNews
          }
          errorMessage={memberNewsError}
          onRetry={handleRetry}
        />
      </Box>
    </Box>
  );
}