"use client";

import { useCallback, useEffect, useState } from "react";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";

import type { MemberAvailableProduct } from "@/api/productsApi";
import { useAvailableProducts } from "@/hooks/products/useAvailableProducts";
import { useCreateMemberReservation } from "@/hooks/reservations/useCreateMemberReservation";
import { useMemberReservationDraft } from "@/hooks/reservations/useMemberReservationDraft";
import { useMemberProfile } from "@/hooks/socios/useMemberProfile";
import { useMemberHeaderActions } from "@/layouts/member/MemberLayout";

import { AvailableProductsCatalog } from "./AvailableProductsCatalog";
import { availableProductsStyles as styles } from "./availableProducts.styles";
import { MemberReservationDraft } from "./MemberReservationDraft";
import { MemberReservationResult } from "./MemberReservationResult";

/* =========================================================
   CONSTANTES
========================================================= */

const MEMBER_PORTAL_TIME_ZONE = "America/Montevideo";

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

/*
Evita representar números inválidos o negativos
sin modificar los datos reales del dominio.
*/
function normalizeNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(value, 0);
}

/*
Presenta cantidades generales en gramos.
*/
function formatGrams(value: number): string {
  const formattedValue = new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(normalizeNumber(value));

  return `${formattedValue} g`;
}

/*
Presenta importes estimados
en pesos uruguayos.
*/
function formatCurrency(value: number): string {
  const formattedValue = new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(normalizeNumber(value));

  return `$${formattedValue}`;
}

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
Presenta el momento de la última
actualización exitosa del módulo.
*/
function formatUpdatedAt(date: Date): string {
  const currentDate = new Date();

  const isToday = getDateKey(date) === getDateKey(currentDate);

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
   CONTAINER PRINCIPAL
========================================================= */

/*
Coordina el catálogo Premium y el flujo
de creación de reservas del Portal Socio.

Responsabilidades:

- cargar catálogo y perfil;
- coordinar el borrador multi-producto;
- ejecutar la solicitud de reserva;
- interpretar el resultado funcional;
- refrescar stock y límite legal;
- conservar o limpiar el borrador según
  el resultado real;
- coordinar desktop, mobile y drawer;
- publicar la última actualización
  en el header compartido.

No realiza solicitudes HTTP directas.
No congela precios.
No valida stock concurrente.
No aplica el límite legal definitivo.
No reemplaza reglas del backend.
*/
export default function AvailableProductsContainer() {
  const router = useRouter();
  const theme = useTheme();

  /*
  Se presenta una única instancia real
  del panel de reserva.

  En desktop vive dentro de la columna sticky.
  En mobile vive dentro del drawer inferior.
  */
  const isDesktopDraft = useMediaQuery(theme.breakpoints.up("lg"), {
    noSsr: true,
  });

  const [isMobileDraftOpen, setIsMobileDraftOpen] = useState(false);

  const [lastSuccessfulLoadAt, setLastSuccessfulLoadAt] = useState<Date | null>(
    null,
  );

  /* =========================================================
     CATÁLOGO
  ========================================================= */

  const {
    availableProducts,
    loadingAvailableProducts,
    availableProductsError,
    fetchAvailableProducts,
    clearAvailableProductsError,
  } = useAvailableProducts();

  /* =========================================================
     PERFIL Y LÍMITE LEGAL
  ========================================================= */

  const {
    memberProfile,
    loadingMemberProfile,
    memberProfileError,
    fetchMemberProfile,
    clearMemberProfileError,
  } = useMemberProfile();

  const memberStatus = memberProfile?.estado ?? null;

  const availableLegalGrams =
    memberProfile?.limite_legal_mensual.gramos_disponibles ?? null;

  /* =========================================================
     BORRADOR DE RESERVA
  ========================================================= */

  const {
    reservationDraftItems,
    reservationObservations,
    reservationDraftError,
    reservationDraftValidationError,
    selectedProductsCount,
    totalDraftGrams,
    estimatedDraftTotal,
    createReservationPayload,
    hasReservationDraftItems,
    canSubmitReservationDraft,
    addProductToDraft,
    incrementDraftProduct,
    decrementDraftProduct,
    removeProductFromDraft,
    updateReservationObservations,
    getDraftProductQuantity,
    clearReservationDraftError,
    clearReservationDraft,
  } = useMemberReservationDraft({
    memberStatus,
    availableLegalGrams,
  });

  /* =========================================================
     CREACIÓN DE RESERVA
  ========================================================= */

  const {
    createdMemberReservation,
    memberReservationCreationMessage,
    memberReservationCreationOutcome,
    createMemberReservationError,
    isCreatingMemberReservation,
    createMemberReservation,
    clearCreateMemberReservationError,
    clearCreatedMemberReservation,
  } = useCreateMemberReservation();

  /* =========================================================
     ACCIONES DEL HEADER
  ========================================================= */

  const { setHeaderActions, clearHeaderActions } = useMemberHeaderActions();

  /* =========================================================
     CARGA Y ACTUALIZACIÓN
  ========================================================= */

  const registerSuccessfulUpdate = useCallback((): void => {
    setLastSuccessfulLoadAt(new Date());
  }, []);

  /*
  Carga conjuntamente catálogo y perfil.

  Cada hook mantiene su propio estado,
  manejo de errores y protección frente
  a respuestas antiguas.
  */
  const loadPortalData = useCallback(async (): Promise<void> => {
    const [productsResult, profileResult] = await Promise.all([
      fetchAvailableProducts(),
      fetchMemberProfile(),
    ]);

    if (productsResult && profileResult) {
      registerSuccessfulUpdate();
    }
  }, [fetchAvailableProducts, fetchMemberProfile, registerSuccessfulUpdate]);

  /*
  Ejecuta la carga inicial del módulo.
  */
  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(async () => {
      if (cancelled) {
        return;
      }

      await loadPortalData();
    });

    return () => {
      cancelled = true;
    };
  }, [loadPortalData]);

  /*
  Actualiza únicamente el catálogo.
  */
  const refreshAvailableProducts = useCallback(async (): Promise<void> => {
    const products = await fetchAvailableProducts();

    if (products) {
      registerSuccessfulUpdate();
    }
  }, [fetchAvailableProducts, registerSuccessfulUpdate]);

  /*
  Actualiza únicamente el perfil
  y su resumen legal mensual.
  */
  const refreshMemberProfile = useCallback(async (): Promise<void> => {
    const profile = await fetchMemberProfile();

    if (profile) {
      registerSuccessfulUpdate();
    }
  }, [fetchMemberProfile, registerSuccessfulUpdate]);

  /*
  Refresca las dos fuentes afectadas
  después de procesar una reserva.

  Backend continúa siendo la autoridad
  sobre stock y límite legal.
  */
  const refreshReservationContext = useCallback(async (): Promise<void> => {
    await Promise.all([refreshAvailableProducts(), refreshMemberProfile()]);
  }, [refreshAvailableProducts, refreshMemberProfile]);

  /* =========================================================
     INDICADOR DE ACTUALIZACIÓN
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
     LIMPIEZA DE FEEDBACK
  ========================================================= */

  /*
  Descarta el resultado anterior cuando
  el socio vuelve a editar la selección.
  */
  const clearPreviousCreationFeedback = useCallback((): void => {
    clearCreateMemberReservationError();
    clearCreatedMemberReservation();
  }, [clearCreateMemberReservationError, clearCreatedMemberReservation]);

  /* =========================================================
     HANDLERS DEL BORRADOR
  ========================================================= */

  const handleAddProduct = useCallback(
    (product: MemberAvailableProduct): void => {
      clearPreviousCreationFeedback();
      addProductToDraft(product);
    },
    [addProductToDraft, clearPreviousCreationFeedback],
  );

  const handleIncrementProduct = useCallback(
    (productId: number): void => {
      clearPreviousCreationFeedback();
      incrementDraftProduct(productId);
    },
    [clearPreviousCreationFeedback, incrementDraftProduct],
  );

  const handleDecrementProduct = useCallback(
    (productId: number): void => {
      clearPreviousCreationFeedback();
      decrementDraftProduct(productId);
    },
    [clearPreviousCreationFeedback, decrementDraftProduct],
  );

  const handleRemoveProduct = useCallback(
    (productId: number): void => {
      clearPreviousCreationFeedback();
      removeProductFromDraft(productId);
    },
    [clearPreviousCreationFeedback, removeProductFromDraft],
  );

  const handleObservationsChange = useCallback(
    (value: string): void => {
      clearPreviousCreationFeedback();

      updateReservationObservations(value);
    },
    [clearPreviousCreationFeedback, updateReservationObservations],
  );

  /* =========================================================
     REINTENTOS
  ========================================================= */

  const handleRetryAvailableProducts = useCallback((): void => {
    clearAvailableProductsError();

    void refreshAvailableProducts();
  }, [clearAvailableProductsError, refreshAvailableProducts]);

  const handleRetryMemberProfile = useCallback((): void => {
    clearMemberProfileError();

    void refreshMemberProfile();
  }, [clearMemberProfileError, refreshMemberProfile]);

  /* =========================================================
     CONFIRMACIÓN DE LA RESERVA
  ========================================================= */

  const handleConfirmReservation = useCallback(async (): Promise<void> => {
    if (!canSubmitReservationDraft || isCreatingMemberReservation) {
      return;
    }

    clearReservationDraftError();
    clearCreateMemberReservationError();
    clearCreatedMemberReservation();

    const result = await createMemberReservation(createReservationPayload);

    if (!result) {
      return;
    }

    /*
      CONFIRMADA:
      la reserva quedó creada y el stock
      fue bloqueado.

      PENDIENTE:
      se descarta el borrador para evitar
      una solicitud duplicada.

      RECHAZADA o desconocida:
      se conserva el borrador para permitir
      su revisión o corrección.
      */
    if (
      result.reservation.estado === "CONFIRMADA" ||
      result.reservation.estado === "PENDIENTE"
    ) {
      clearReservationDraft();
    }

    setIsMobileDraftOpen(false);

    await refreshReservationContext();
  }, [
    canSubmitReservationDraft,
    isCreatingMemberReservation,
    clearReservationDraftError,
    clearCreateMemberReservationError,
    clearCreatedMemberReservation,
    createMemberReservation,
    createReservationPayload,
    clearReservationDraft,
    refreshReservationContext,
  ]);

  /* =========================================================
     RESULTADO
  ========================================================= */

  const handleCloseReservationResult = useCallback((): void => {
    clearCreatedMemberReservation();
  }, [clearCreatedMemberReservation]);

  const handleViewReservations = useCallback((): void => {
    clearCreatedMemberReservation();

    router.push("/socio/reservas");
  }, [clearCreatedMemberReservation, router]);

  /* =========================================================
     DRAWER MOBILE
  ========================================================= */

  const handleOpenMobileDraft = useCallback((): void => {
    setIsMobileDraftOpen(true);
  }, []);

  const handleCloseMobileDraft = useCallback((): void => {
    if (isCreatingMemberReservation) {
      return;
    }

    setIsMobileDraftOpen(false);
  }, [isCreatingMemberReservation]);

  /* =========================================================
     ESTADOS DERIVADOS
  ========================================================= */

  const profileIsVerified = Boolean(memberProfile);

  const memberCanReserve = memberProfile?.estado === "ACTIVO";

  /*
  Un socio inactivo puede consultar
  los productos disponibles.

  Solamente se bloquean las acciones
  que preparan o crean una reserva.
  */
  const catalogInteractionsDisabled =
    !profileIsVerified ||
    !memberCanReserve ||
    loadingMemberProfile ||
    isCreatingMemberReservation;

  const visibleOperationError =
    createMemberReservationError ?? reservationDraftError;

  const resultDialogOpen = Boolean(
    createdMemberReservation && memberReservationCreationOutcome,
  );

  /* =========================================================
     PANEL REUTILIZADO DESKTOP / MOBILE
  ========================================================= */

  const reservationDraft = (
    <MemberReservationDraft
      items={reservationDraftItems}
      observations={reservationObservations}
      totalGrams={totalDraftGrams}
      estimatedTotal={estimatedDraftTotal}
      availableLegalGrams={availableLegalGrams}
      validationError={reservationDraftValidationError}
      operationError={visibleOperationError}
      canSubmit={canSubmitReservationDraft}
      isSubmitting={isCreatingMemberReservation}
      disabled={!profileIsVerified || !memberCanReserve}
      onIncrementProduct={handleIncrementProduct}
      onDecrementProduct={handleDecrementProduct}
      onRemoveProduct={handleRemoveProduct}
      onObservationsChange={handleObservationsChange}
      onConfirm={handleConfirmReservation}
    />
  );

  /* =========================================================
   RENDER
========================================================= */

  return (
    <Box sx={styles.root}>
      <Box sx={styles.pageStack}>
        {memberProfile && memberProfile.estado !== "ACTIVO" ? (
          <Alert severity="warning" sx={styles.memberStatusAlert}>
            Tu perfil se encuentra {memberProfile.estado.toLowerCase()}. Podés
            consultar los productos, pero necesitás un perfil activo para
            solicitar una reserva.
          </Alert>
        ) : null}

        {memberProfileError ? (
          <Alert
            severity={memberProfile ? "warning" : "error"}
            sx={styles.nonBlockingAlert}
            action={
              <Button
                type="button"
                color="inherit"
                size="small"
                startIcon={<RefreshRoundedIcon />}
                onClick={handleRetryMemberProfile}
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
            {memberProfile
              ? "No fue posible actualizar tu perfil. Se mantiene la última información disponible."
              : memberProfileError}
          </Alert>
        ) : null}

        {availableProductsError && availableProducts.length > 0 ? (
          <Alert
            severity="warning"
            sx={styles.nonBlockingAlert}
            action={
              <Button
                type="button"
                color="inherit"
                size="small"
                startIcon={<RefreshRoundedIcon />}
                onClick={handleRetryAvailableProducts}
                disabled={loadingAvailableProducts}
                sx={{
                  minWidth: "auto",
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                {loadingAvailableProducts ? "Reintentando..." : "Reintentar"}
              </Button>
            }
          >
            No fue posible actualizar el catálogo. Se mantienen los últimos
            productos disponibles cargados.
          </Alert>
        ) : null}

        <Box sx={styles.contentGrid}>
          <Box sx={styles.catalogColumn}>
            <AvailableProductsCatalog
              products={availableProducts}
              isLoading={loadingAvailableProducts}
              errorMessage={availableProductsError}
              disabled={catalogInteractionsDisabled}
              getSelectedQuantity={getDraftProductQuantity}
              onAddProduct={handleAddProduct}
              onIncrementProduct={handleIncrementProduct}
              onDecrementProduct={handleDecrementProduct}
              onRetry={handleRetryAvailableProducts}
            />
          </Box>

          {isDesktopDraft ? (
            <Box sx={styles.draftColumn}>
              <Box sx={styles.draftStickyWrapper}>{reservationDraft}</Box>
            </Box>
          ) : null}
        </Box>

        {!isDesktopDraft && hasReservationDraftItems ? (
          <>
            <Box aria-hidden="true" sx={styles.mobileDraftBarSpacer} />

            <Box
              role="region"
              aria-label="Resumen de la reserva en preparación"
              sx={styles.mobileDraftBar}
            >
              <Box sx={styles.mobileDraftBarSummary}>
                <Typography component="p" sx={styles.mobileDraftBarPrimary}>
                  {selectedProductsCount === 1
                    ? "1 producto"
                    : `${selectedProductsCount} productos`}{" "}
                  · {formatGrams(totalDraftGrams)}
                </Typography>

                <Typography component="p" sx={styles.mobileDraftBarSecondary}>
                  Total de la reserva: {formatCurrency(estimatedDraftTotal)}
                </Typography>
              </Box>

              <Button
                type="button"
                variant="contained"
                onClick={handleOpenMobileDraft}
                sx={styles.mobileDraftReviewButton}
              >
                Revisar reserva
              </Button>
            </Box>

            <Drawer
              anchor="bottom"
              open={isMobileDraftOpen}
              onClose={handleCloseMobileDraft}
              slotProps={{
                paper: {
                  sx: styles.mobileDraftDrawerPaper,
                },
              }}
            >
              <Box sx={styles.mobileDraftDrawerContent}>
                <Box aria-hidden="true" sx={styles.mobileDrawerHandleWrapper}>
                  <Box sx={styles.mobileDrawerHandle} />
                </Box>

                {reservationDraft}
              </Box>
            </Drawer>
          </>
        ) : null}

        <MemberReservationResult
          open={resultDialogOpen}
          reservation={createdMemberReservation}
          outcome={memberReservationCreationOutcome}
          message={memberReservationCreationMessage}
          onClose={handleCloseReservationResult}
          onViewReservations={handleViewReservations}
        />
      </Box>
    </Box>
  );
}
