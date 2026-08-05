"use client";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { Alert, Box, Button, Chip, Skeleton, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { useMemberProfile } from "@/hooks/socios/useMemberProfile";
import { useMemberHeaderActions } from "@/layouts/member/MemberLayout";

import { MemberLegalLimitSummary } from "./MemberLegalLimitSummary";
import { MemberPersonalInformation } from "./MemberPersonalInformation";
import { MemberProfileHeader } from "./MemberProfileHeader";
import { MemberQuickAccess } from "./MemberQuickAccess";
import { memberProfileStyles as styles } from "./memberProfile.styles";

/* =========================================================
   CONSTANTES
========================================================= */

const MEMBER_PORTAL_TIME_ZONE = "America/Montevideo";

/* =========================================================
   HELPERS DE FECHA
========================================================= */

/*
Genera una clave de calendario utilizando
la zona horaria oficial del sistema.
*/
function getDateKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).format(date);
}

/*
Formatea el momento en que frontend recibió
correctamente la información del perfil.

Este valor es únicamente informativo
y no representa una fecha persistida.
*/
function formatUpdatedAt(date: Date): string {
  const currentDate = new Date();

  const isToday =
    getDateKey(date, MEMBER_PORTAL_TIME_ZONE) ===
    getDateKey(currentDate, MEMBER_PORTAL_TIME_ZONE);

  const formattedTime = new Intl.DateTimeFormat("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: MEMBER_PORTAL_TIME_ZONE,
  }).format(date);

  if (isToday) {
    return `Actualizado: hoy, ${formattedTime}`;
  }

  const formattedDate = new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: MEMBER_PORTAL_TIME_ZONE,
  }).format(date);

  return `Actualizado: ${formattedDate}, ${formattedTime}`;
}

/* =========================================================
   ESTADO DE CARGA
========================================================= */

/*
Mantiene una estructura equivalente al contenido
final para reducir saltos visuales durante
la consulta inicial.
*/
function MemberProfileLoadingState() {
  return (
    <Box
      aria-label="Cargando perfil del socio"
      aria-busy="true"
      sx={styles.pageStack}
    >
      <Box sx={styles.skeletonProfileCard}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Skeleton
              variant="circular"
              width={82}
              height={82}
              animation="wave"
            />

            <Box>
              <Skeleton width={210} height={34} animation="wave" />

              <Skeleton width={250} height={24} animation="wave" />

              <Skeleton width={76} height={30} animation="wave" />
            </Box>
          </Box>

          <Skeleton
            variant="rounded"
            width={138}
            height={42}
            animation="wave"
          />
        </Box>
      </Box>

      <Box sx={styles.skeletonContentGrid}>
        <Box sx={styles.skeletonCard}>
          <Skeleton width={220} height={34} animation="wave" />

          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} width="100%" height={58} animation="wave" />
          ))}
        </Box>

        <Box sx={styles.skeletonCard}>
          <Skeleton width={250} height={34} animation="wave" />

          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))",
              },
              gap: 1.25,
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={112}
                animation="wave"
              />
            ))}
          </Box>

          <Skeleton sx={{ mt: 3 }} width={210} height={28} animation="wave" />

          <Skeleton
            sx={{ mt: 1.5 }}
            variant="rounded"
            width="100%"
            height={14}
            animation="wave"
          />

          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                width={135}
                height={32}
                animation="wave"
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={styles.quickAccessCard}>
        <Skeleton width={230} height={34} animation="wave" />

        <Box sx={styles.quickAccessGrid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              height={92}
              animation="wave"
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* =========================================================
   ESTADO DE ERROR
========================================================= */

type InitialMemberProfileErrorProps = {
  message: string;
  loading: boolean;
  onRetry: () => void;
};

/*
Estado bloqueante utilizado cuando todavía
no existe información válida para mostrar.
*/
function InitialMemberProfileError({
  message,
  loading,
  onRetry,
}: InitialMemberProfileErrorProps) {
  return (
    <Box
      role="alert"
      aria-labelledby="member-profile-error-title"
      sx={styles.errorCard}
    >
      <Box aria-hidden="true" sx={styles.errorIcon}>
        <ErrorOutlineRoundedIcon />
      </Box>

      <Typography
        id="member-profile-error-title"
        component="h2"
        sx={styles.errorTitle}
      >
        No pudimos cargar tu perfil
      </Typography>

      <Typography component="p" sx={styles.errorDescription}>
        {message}
      </Typography>

      <Button
        type="button"
        variant="contained"
        startIcon={<RefreshRoundedIcon />}
        onClick={onRetry}
        disabled={loading}
        sx={styles.retryButton}
      >
        {loading ? "Reintentando..." : "Reintentar"}
      </Button>
    </Box>
  );
}

/* =========================================================
   CONTAINER PRINCIPAL
========================================================= */

/*
Coordina el perfil del socio autenticado.

Responsabilidades:

- ejecutar la carga inicial;
- coordinar el hook del perfil;
- registrar la última carga exitosa;
- presentar los componentes visuales;
- resolver loading, error y reintento;
- conservar datos anteriores ante fallos posteriores.

No realiza solicitudes HTTP directas.
No recalcula reglas legales.
No expone información administrativa.
*/
export default function MemberProfileContainer() {
  const {
    memberProfile,
    loadingMemberProfile,
    memberProfileError,
    fetchMemberProfile,
    clearMemberProfileError,
  } = useMemberProfile();

  const { setHeaderActions, clearHeaderActions } = useMemberHeaderActions();

  const [lastSuccessfulLoadAt, setLastSuccessfulLoadAt] = useState<Date | null>(
    null,
  );

  /* =========================================================
     CARGA DEL PERFIL
  ========================================================= */

  const loadMemberProfile = useCallback(async (): Promise<void> => {
    const profile = await fetchMemberProfile();

    if (profile) {
      setLastSuccessfulLoadAt(new Date());
    }
  }, [fetchMemberProfile]);

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(async () => {
      if (cancelled) {
        return;
      }

      await loadMemberProfile();
    });

    return () => {
      cancelled = true;
    };
  }, [loadMemberProfile]);

  /* =========================================================
     ACCIÓN CONTEXTUAL DEL HEADER
  ========================================================= */

  useEffect(() => {
    if (!lastSuccessfulLoadAt) {
      clearHeaderActions();

      return;
    }

    const updatedAtLabel = formatUpdatedAt(lastSuccessfulLoadAt);

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
  }, [lastSuccessfulLoadAt, setHeaderActions, clearHeaderActions]);

  /* =========================================================
     HANDLERS
  ========================================================= */

  const handleRetry = (): void => {
    clearMemberProfileError();

    void loadMemberProfile();
  };

  /* =========================================================
     ESTADOS DERIVADOS
  ========================================================= */

  /*
  Contempla también el primer render anterior
  a que el efecto active formalmente la carga.
  */
  const isInitialLoading =
    !memberProfile && (loadingMemberProfile || !memberProfileError);

  const hasBlockingError =
    !memberProfile && !loadingMemberProfile && Boolean(memberProfileError);

  /* =========================================================
     ERROR BLOQUEANTE
  ========================================================= */

  if (hasBlockingError && memberProfileError) {
    return (
      <Box sx={styles.root}>
        <InitialMemberProfileError
          message={memberProfileError}
          loading={loadingMemberProfile}
          onRetry={handleRetry}
        />
      </Box>
    );
  }

  /* =========================================================
     CARGA INICIAL
  ========================================================= */

  if (isInitialLoading) {
    return (
      <Box sx={styles.root}>
        <MemberProfileLoadingState />
      </Box>
    );
  }

  /*
  Estado defensivo ante una combinación
  inesperada del hook.
  */
  if (!memberProfile) {
    return null;
  }

  /* =========================================================
     RENDER PRINCIPAL
  ========================================================= */

  return (
    <Box sx={styles.root}>
      <Box sx={styles.pageStack}>
        {memberProfileError ? (
          <Alert
            severity="warning"
            sx={styles.nonBlockingAlert}
            action={
              <Button
                type="button"
                color="inherit"
                size="small"
                startIcon={<RefreshRoundedIcon />}
                onClick={handleRetry}
                disabled={loadingMemberProfile}
                sx={{
                  minWidth: "auto",
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                {loadingMemberProfile ? "Reintentando..." : "Reintentar"}
              </Button>
            }
          >
            No fue posible actualizar tu perfil. Se continúa mostrando la última
            información disponible.
          </Alert>
        ) : null}

        <MemberProfileHeader profile={memberProfile} />

        <Box sx={styles.contentGrid}>
          <MemberPersonalInformation profile={memberProfile} />

          <MemberLegalLimitSummary
            summary={memberProfile.limite_legal_mensual}
          />
        </Box>

        <MemberQuickAccess />
      </Box>
    </Box>
  );
}
