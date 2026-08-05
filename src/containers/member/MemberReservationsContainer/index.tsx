"use client";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Skeleton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useMemberReservationDetail } from "@/hooks/reservations/useMemberReservationDetail";
import { useMemberReservations } from "@/hooks/reservations/useMemberReservations";
import { useMemberHeaderActions } from "@/layouts/member/MemberLayout";

import { MemberReservationCard } from "./MemberReservationCard";
import { MemberReservationDetail } from "./MemberReservationDetail";
import { MemberReservationsHero } from "./MemberReservationsHero";
import {
  type MemberReservationsTab,
  MemberReservationsTabs,
} from "./MemberReservationsTabs";
import { memberReservationsStyles as styles } from "./memberReservations.styles";

/* =========================================================
   CONSTANTES
========================================================= */

const MEMBER_PORTAL_TIME_ZONE =
  "America/Montevideo";

const RESERVATIONS_SKELETON_COUNT = 3;

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

No representa una fecha persistida
por el backend.
*/
function formatUpdatedAt(date: Date): string {
  const currentDate = new Date();

  const isToday =
    getDateKey(date) ===
    getDateKey(currentDate);

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
   ESTADO DE CARGA
========================================================= */

/*
Replica la estructura actual del módulo
para reducir saltos de layout durante
la primera consulta.

El skeleton utiliza únicamente los estilos
vigentes del hero simplificado.
*/
function MemberReservationsLoadingState() {
  return (
    <Box
      role="status"
      aria-label="Cargando tus reservas"
      aria-busy="true"
      sx={styles.pageStack}
    >
      <Box
        aria-hidden="true"
        sx={styles.heroCard}
      >
        <Box sx={styles.heroIcon}>
          <Skeleton
            variant="rounded"
            width="60%"
            height="60%"
          />
        </Box>

        <Box sx={styles.heroCopy}>
          <Skeleton
            width="48%"
            height={42}
          />

          <Skeleton
            width="92%"
            height={24}
          />

          <Skeleton
            width="76%"
            height={24}
          />

          <Skeleton
            variant="rounded"
            width={190}
            height={36}
          />
        </Box>
      </Box>

      <Skeleton
        variant="rounded"
        height={50}
      />

      <Box sx={styles.reservationsList}>
        {Array.from({
          length: RESERVATIONS_SKELETON_COUNT,
        }).map((_, index) => (
          <Box
            key={index}
            aria-hidden="true"
            sx={styles.reservationCard}
          >
            <Box sx={styles.reservationCardHeader}>
              <Box sx={styles.reservationIdentity}>
                <Skeleton
                  variant="rounded"
                  sx={styles.reservationIdentityIcon}
                />

                <Box>
                  <Skeleton
                    width={150}
                    height={27}
                  />

                  <Skeleton
                    width={190}
                    height={20}
                  />
                </Box>
              </Box>

              <Skeleton
                variant="rounded"
                width={125}
                height={31}
              />
            </Box>

            <Box sx={styles.reservationCardBody}>
              <Skeleton
                variant="rounded"
                height={78}
              />

              <Box sx={styles.reservationMetrics}>
                <Skeleton
                  variant="rounded"
                  height={70}
                />

                <Skeleton
                  variant="rounded"
                  height={70}
                />
              </Box>
            </Box>

            <Box sx={styles.reservationCardFooter}>
              <Skeleton
                width={105}
                height={38}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* =========================================================
   ESTADO DE ERROR BLOQUEANTE
========================================================= */

type MemberReservationsErrorStateProps = {
  message: string;

  isRetrying: boolean;

  onRetry: () => void;
};

function MemberReservationsErrorState({
  message,
  isRetrying,
  onRetry,
}: MemberReservationsErrorStateProps) {
  return (
    <Box
      role="alert"
      aria-labelledby="member-reservations-error-title"
      sx={styles.emptyState}
    >
      <Box
        aria-hidden="true"
        sx={styles.emptyStateIcon}
      >
        <ErrorOutlineRoundedIcon />
      </Box>

      <Typography
        id="member-reservations-error-title"
        component="h2"
        sx={styles.emptyStateTitle}
      >
        No pudimos cargar tus reservas
      </Typography>

      <Typography
        component="p"
        sx={styles.emptyStateDescription}
      >
        {message}
      </Typography>

      <Button
        type="button"
        variant="contained"
        startIcon={<RefreshRoundedIcon />}
        onClick={onRetry}
        disabled={isRetrying}
        sx={styles.detailRetryButton}
      >
        {isRetrying
          ? "Reintentando..."
          : "Reintentar"}
      </Button>
    </Box>
  );
}

/* =========================================================
   ESTADOS VACÍOS
========================================================= */

type MemberReservationsEmptyStateProps = {
  activeTab: MemberReservationsTab;
};

function MemberReservationsEmptyState({
  activeTab,
}: MemberReservationsEmptyStateProps) {
  const isActiveTab =
    activeTab === "active";

  return (
    <Box
      role="status"
      aria-labelledby="member-reservations-empty-title"
      sx={styles.emptyState}
    >
      <Box
        aria-hidden="true"
        sx={styles.emptyStateIcon}
      >
        {isActiveTab ? (
          <EventAvailableRoundedIcon />
        ) : (
          <HistoryRoundedIcon />
        )}
      </Box>

      <Typography
        id="member-reservations-empty-title"
        component="h2"
        sx={styles.emptyStateTitle}
      >
        {isActiveTab
          ? "No tenés reservas activas"
          : "Todavía no tenés historial"}
      </Typography>

      <Typography
        component="p"
        sx={styles.emptyStateDescription}
      >
        {isActiveTab
          ? "Cuando realices una reserva confirmada, vas a encontrar aquí su estado y la fecha límite de retiro."
          : "Las reservas retiradas, rechazadas, canceladas o vencidas aparecerán disponibles en esta sección."}
      </Typography>

      {isActiveTab ? (
        <Button
          component={Link}
          href="/socio/reservar"
          variant="contained"
          sx={styles.detailRetryButton}
        >
          Explorar productos
        </Button>
      ) : null}
    </Box>
  );
}

/* =========================================================
   CONTAINER PRINCIPAL
========================================================= */

/*
Coordina el módulo Mis reservas
dentro del Portal Socio.

Responsabilidades:

- ejecutar la carga inicial;
- coordinar listado y detalle;
- mantener la pestaña seleccionada;
- calcular el contador funcional del hero;
- registrar la última carga exitosa;
- publicar la actualización en el header;
- manejar errores bloqueantes y no bloqueantes;
- abrir y cerrar el detalle responsive.

No realiza solicitudes HTTP directas.
No modifica ni cancela reservas.
No reordena ni reclasifica el contrato del backend.
No expone información administrativa.
*/
export default function MemberReservationsContainer() {
  const {
    memberReservations,
    loadingMemberReservations,
    memberReservationsError,
    fetchMemberReservations,
    clearMemberReservationsError,
  } = useMemberReservations();

  const {
    memberReservationDetail,
    loadingMemberReservationDetail,
    memberReservationDetailError,
    fetchMemberReservationDetail,
    clearMemberReservationDetailError,
    clearMemberReservationDetail,
  } = useMemberReservationDetail();

  const {
    setHeaderActions,
    clearHeaderActions,
  } = useMemberHeaderActions();

  const [
    activeTab,
    setActiveTab,
  ] = useState<MemberReservationsTab>(
    "active",
  );

  const [
    selectedReservationId,
    setSelectedReservationId,
  ] = useState<number | null>(null);

  const [
    isDetailOpen,
    setIsDetailOpen,
  ] = useState(false);

  const [
    lastSuccessfulLoadAt,
    setLastSuccessfulLoadAt,
  ] = useState<Date | null>(null);

  /* =========================================================
     VALORES DERIVADOS
  ========================================================= */

  const activeReservations =
    memberReservations.activas;

  const historicalReservations =
    memberReservations.historial;

  /*
  PENDIENTE se conserva únicamente como soporte
  defensivo dentro del listado.

  La métrica principal considera solamente
  reservas realmente confirmadas.
  */
  const readyToCollectCount =
    useMemo(
      () =>
        activeReservations.filter(
          (reservation) =>
            reservation.estado === "CONFIRMADA",
        ).length,
      [activeReservations],
    );

  const visibleReservations =
    activeTab === "active"
      ? activeReservations
      : historicalReservations;

  const hasAnyReservations =
    activeReservations.length > 0 ||
    historicalReservations.length > 0;

  /* =========================================================
     CARGA DEL LISTADO
  ========================================================= */

  const loadMemberReservations =
    useCallback(async (): Promise<void> => {
      const reservations =
        await fetchMemberReservations();

      if (reservations) {
        setLastSuccessfulLoadAt(new Date());
      }
    }, [fetchMemberReservations]);

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(async () => {
      if (cancelled) {
        return;
      }

      await loadMemberReservations();
    });

    return () => {
      cancelled = true;
    };
  }, [loadMemberReservations]);

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
     HANDLERS DEL LISTADO
  ========================================================= */

  const handleTabChange =
    useCallback(
      (
        nextTab: MemberReservationsTab,
      ): void => {
        setActiveTab(nextTab);
      },
      [],
    );

  const handleRetryList =
    useCallback((): void => {
      clearMemberReservationsError();

      void loadMemberReservations();
    }, [
      clearMemberReservationsError,
      loadMemberReservations,
    ]);

  /* =========================================================
     HANDLERS DEL DETALLE
  ========================================================= */

  const handleViewDetail =
    useCallback(
      (reservationId: number): void => {
        setSelectedReservationId(
          reservationId,
        );
        setIsDetailOpen(true);

        clearMemberReservationDetailError();

        void fetchMemberReservationDetail(
          reservationId,
        );
      },
      [
        clearMemberReservationDetailError,
        fetchMemberReservationDetail,
      ],
    );

  const handleRetryDetail =
    useCallback((): void => {
      if (!selectedReservationId) {
        return;
      }

      clearMemberReservationDetailError();

      void fetchMemberReservationDetail(
        selectedReservationId,
      );
    }, [
      selectedReservationId,
      clearMemberReservationDetailError,
      fetchMemberReservationDetail,
    ]);

  const handleCloseDetail =
    useCallback((): void => {
      setIsDetailOpen(false);
      setSelectedReservationId(null);

      clearMemberReservationDetail();
    }, [clearMemberReservationDetail]);

  /* =========================================================
     ESTADOS DERIVADOS
  ========================================================= */

  const hasSuccessfulLoad =
    lastSuccessfulLoadAt !== null;

  const isInitialLoading =
    !hasSuccessfulLoad &&
    !hasAnyReservations &&
    (
      loadingMemberReservations ||
      !memberReservationsError
    );

  const hasBlockingError =
    Boolean(memberReservationsError) &&
    !hasSuccessfulLoad &&
    !loadingMemberReservations;

  const showNonBlockingError =
    Boolean(memberReservationsError) &&
    hasSuccessfulLoad;

  /* =========================================================
     RENDER
  ========================================================= */

  if (isInitialLoading) {
    return (
      <Box sx={styles.root}>
        <MemberReservationsLoadingState />
      </Box>
    );
  }

  if (
    hasBlockingError &&
    memberReservationsError
  ) {
    return (
      <Box sx={styles.root}>
        <MemberReservationsErrorState
          message={memberReservationsError}
          isRetrying={
            loadingMemberReservations
          }
          onRetry={handleRetryList}
        />
      </Box>
    );
  }

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
                onClick={handleRetryList}
                disabled={
                  loadingMemberReservations
                }
              >
                {loadingMemberReservations
                  ? "Reintentando..."
                  : "Reintentar"}
              </Button>
            }
          >
            No fue posible actualizar tus reservas.
            Se continúa mostrando la última
            información disponible.
          </Alert>
        ) : null}

        <MemberReservationsHero
          readyToCollectCount={
            readyToCollectCount
          }
        />

        <MemberReservationsTabs
          activeTab={activeTab}
          activeCount={
            activeReservations.length
          }
          historyCount={
            historicalReservations.length
          }
          onChange={handleTabChange}
        />

        <Box
          id={
            activeTab === "active"
              ? "member-active-reservations-panel"
              : "member-reservations-history-panel"
          }
          role="tabpanel"
          aria-label={
            activeTab === "active"
              ? "Reservas activas"
              : "Historial de reservas"
          }
          sx={styles.tabPanel}
        >
          {visibleReservations.length === 0 ? (
            <MemberReservationsEmptyState
              activeTab={activeTab}
            />
          ) : (
            <Box sx={styles.reservationsList}>
              {visibleReservations.map(
                (reservation) => (
                  <MemberReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onViewDetail={
                      handleViewDetail
                    }
                  />
                ),
              )}
            </Box>
          )}
        </Box>
      </Box>

      <MemberReservationDetail
        open={isDetailOpen}
        reservation={
          memberReservationDetail
        }
        isLoading={
          loadingMemberReservationDetail
        }
        errorMessage={
          memberReservationDetailError
        }
        onClose={handleCloseDetail}
        onRetry={handleRetryDetail}
      />
    </Box>
  );
}