"use client";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ImageNotSupportedRoundedIcon from "@mui/icons-material/ImageNotSupportedRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

import type {
  MemberReservation,
  MemberReservationProduct,
} from "@/api/reservationsApi";

import { MemberReservationStatusBadge } from "../MemberReservationStatusBadge";
import { memberReservationsStyles as styles } from "../memberReservations.styles";

/* =========================================================
   TIPOS
========================================================= */

type MemberReservationDetailProps = {
  open: boolean;

  reservation: MemberReservation | null;

  isLoading: boolean;

  errorMessage: string | null;

  onClose: () => void;

  onRetry: () => void;
};

/* =========================================================
   CONSTANTES
========================================================= */

const MEMBER_PORTAL_TIME_ZONE = "America/Montevideo";

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: MEMBER_PORTAL_TIME_ZONE,
  }).format(date);
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: MEMBER_PORTAL_TIME_ZONE,
  }).format(date);
}

function formatGrams(value: number): string {
  return `${new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)} g`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/* =========================================================
   IMAGEN DEL PRODUCTO
========================================================= */

type ReservationProductImageProps = {
  productName: string;

  imageUrl: string | null;
};

/*
Presenta la imagen pública del producto
con fallback visual controlado.

El error de una imagen no afecta
el resto del detalle.
*/
function ReservationProductImage({
  productName,
  imageUrl,
}: ReservationProductImageProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const showImage = Boolean(imageUrl) && !hasImageError;

  if (!showImage) {
    return (
      <Box
        aria-label={`Imagen no disponible para ${productName}`}
        sx={styles.detailProductImageFallback}
      >
        <ImageNotSupportedRoundedIcon aria-hidden="true" />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={imageUrl ?? undefined}
      alt={productName}
      onError={() => {
        setHasImageError(true);
      }}
      sx={styles.detailProductImage}
    />
  );
}

/* =========================================================
   PRODUCTO DEL DETALLE
========================================================= */

type ReservationProductDetailProps = {
  product: MemberReservationProduct;
};

/*
Presenta un producto incluido en la reserva
sin exponer identificadores técnicos.
*/
function ReservationProductDetail({ product }: ReservationProductDetailProps) {
  return (
    <Box component="li" sx={styles.detailProductCard}>
      <ReservationProductImage
        productName={product.nombre}
        imageUrl={product.imagen}
      />

      <Box sx={styles.detailProductCopy}>
        <Typography component="h4" sx={styles.detailProductName}>
          {product.nombre}
        </Typography>

        <Typography component="span" sx={styles.detailProductQuantity}>
          {formatGrams(product.cantidad)} reservados
        </Typography>

        <Typography component="span" sx={styles.detailProductUnitPrice}>
          {formatCurrency(product.precioUnitario)} por gramo
        </Typography>
      </Box>

      <Typography component="strong" sx={styles.detailProductSubtotal}>
        {formatCurrency(product.subtotal)}
      </Typography>
    </Box>
  );
}

/* =========================================================
   ESTADO DE CARGA
========================================================= */

function ReservationDetailLoadingState() {
  return (
    <Box
      role="status"
      aria-label="Cargando detalle de la reserva"
      aria-busy="true"
      sx={styles.detailLoading}
    >
      <Skeleton variant="rounded" width="46%" height={38} />

      <Skeleton variant="rounded" width={150} height={34} />

      <Divider />

      {Array.from({ length: 2 }).map((_, index) => (
        <Box key={index} aria-hidden="true" sx={styles.detailProductSkeleton}>
          <Skeleton variant="rounded" width={62} height={62} />

          <Box sx={styles.detailProductSkeletonCopy}>
            <Skeleton width="70%" height={25} />
            <Skeleton width="52%" height={21} />
            <Skeleton width="44%" height={21} />
          </Box>

          <Skeleton width={72} height={28} />
        </Box>
      ))}

      <Skeleton variant="rounded" width="100%" height={116} />
    </Box>
  );
}

/* =========================================================
   ESTADO DE ERROR
========================================================= */

type ReservationDetailErrorStateProps = {
  message: string;

  isRetrying: boolean;

  onRetry: () => void;
};

function ReservationDetailErrorState({
  message,
  isRetrying,
  onRetry,
}: ReservationDetailErrorStateProps) {
  return (
    <Box role="alert" sx={styles.detailErrorState}>
      <Alert severity="error" sx={styles.detailErrorAlert}>
        {message}
      </Alert>

      <Button
        type="button"
        variant="contained"
        startIcon={<RefreshRoundedIcon />}
        onClick={onRetry}
        disabled={isRetrying}
        sx={styles.detailRetryButton}
      >
        {isRetrying ? "Reintentando..." : "Reintentar"}
      </Button>
    </Box>
  );
}

/* =========================================================
   INFORMACIÓN FUNCIONAL
========================================================= */

type ReservationDetailNoticeProps = {
  reservation: MemberReservation;
};

function ReservationDetailNotice({
  reservation,
}: ReservationDetailNoticeProps) {
  if (reservation.estado === "CONFIRMADA" && reservation.fechaLimiteRetiro) {
    return (
      <Box sx={styles.detailWithdrawalNotice}>
        <EventAvailableRoundedIcon aria-hidden="true" />

        <Box>
          <Typography component="span" sx={styles.detailNoticeLabel}>
            Disponible para retirar hasta
          </Typography>

          <Typography component="strong" sx={styles.detailNoticeValue}>
            {formatDateTime(reservation.fechaLimiteRetiro)}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (reservation.motivo?.trim()) {
    return (
      <Box sx={styles.detailReasonNotice}>
        <InfoOutlinedIcon aria-hidden="true" />

        <Box>
          <Typography component="span" sx={styles.detailNoticeLabel}>
            Información de la reserva
          </Typography>

          <Typography component="p" sx={styles.detailReasonText}>
            {reservation.motivo}
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
}

/* =========================================================
   CONTENIDO DEL DETALLE
========================================================= */

type ReservationDetailContentProps = {
  reservation: MemberReservation;
};

function ReservationDetailContent({
  reservation,
}: ReservationDetailContentProps) {
  return (
    <Box sx={styles.detailContent}>
      <Box sx={styles.detailHeading}>
        <Box sx={styles.detailReservationIdentity}>
          <Box aria-hidden="true" sx={styles.detailReservationIcon}>
            <Inventory2RoundedIcon />
          </Box>

          <Box>
            <Typography component="h2" sx={styles.detailTitle}>
              Reserva #{reservation.id}
            </Typography>

            <Typography
              component="time"
              dateTime={reservation.fechaSolicitud}
              sx={styles.detailRequestDate}
            >
              Solicitada el {formatDate(reservation.fechaSolicitud)}
            </Typography>
          </Box>
        </Box>

        <MemberReservationStatusBadge
          status={reservation.estado}
          label={reservation.estadoDescripcion}
        />
      </Box>

      <ReservationDetailNotice reservation={reservation} />

      <Divider sx={styles.detailDivider} />

      <Box
        component="section"
        aria-labelledby="reservation-products-title"
        sx={styles.detailSection}
      >
        <Typography
          id="reservation-products-title"
          component="h3"
          sx={styles.detailSectionTitle}
        >
          Productos reservados
        </Typography>

        <Box component="ul" sx={styles.detailProductsList}>
          {reservation.productos.map((product, index) => (
            <ReservationProductDetail
              key={`${product.nombre}-${product.cantidad}-${index}`}
              product={product}
            />
          ))}
        </Box>
      </Box>

      <Box
        component="section"
        aria-label="Resumen económico de la reserva"
        sx={styles.detailSummary}
      >
        <Box sx={styles.detailSummaryRow}>
          <Box sx={styles.detailSummaryLabel}>
            <ScaleRoundedIcon aria-hidden="true" />

            <Typography component="span">Total reservado</Typography>
          </Box>

          <Typography component="strong" sx={styles.detailSummaryValue}>
            {formatGrams(reservation.totalGramos)}
          </Typography>
        </Box>

        <Box sx={styles.detailSummaryRow}>
          <Box sx={styles.detailSummaryLabel}>
            <PaymentsOutlinedIcon aria-hidden="true" />

            <Typography component="span">Total de la reserva</Typography>
          </Box>

          <Typography component="strong" sx={styles.detailSummaryTotal}>
            {formatCurrency(reservation.total)}
          </Typography>
        </Box>
      </Box>

      <Box
        component="section"
        aria-label="Fechas de la reserva"
        sx={styles.detailDates}
      >
        <Box sx={styles.detailDateItem}>
          <CalendarMonthRoundedIcon aria-hidden="true" />

          <Box>
            <Typography component="span" sx={styles.detailDateLabel}>
              Fecha de solicitud
            </Typography>

            <Typography component="strong" sx={styles.detailDateValue}>
              {formatDateTime(reservation.fechaSolicitud)}
            </Typography>
          </Box>
        </Box>

        {reservation.fechaLimiteRetiro ? (
          <Box sx={styles.detailDateItem}>
            <EventAvailableRoundedIcon aria-hidden="true" />

            <Box>
              <Typography component="span" sx={styles.detailDateLabel}>
                Fecha límite de retiro
              </Typography>

              <Typography component="strong" sx={styles.detailDateValue}>
                {formatDateTime(reservation.fechaLimiteRetiro)}
              </Typography>
            </Box>
          </Box>
        ) : null}
      </Box>

      {reservation.estado === "CONFIRMADA" ? (
        <Alert
          severity="info"
          icon={<InfoOutlinedIcon />}
          sx={styles.detailCancellationNotice}
        >
          Para solicitar la cancelación de esta reserva, comunicate directamente
          con el club.
        </Alert>
      ) : null}
    </Box>
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Presenta el detalle público de una reserva.

Desktop:
drawer lateral.

Mobile:
bottom sheet.

No modifica ni cancela reservas.
No expone auditorías ni responsables internos.
*/
export function MemberReservationDetail({
  open,
  reservation,
  isLoading,
  errorMessage,
  onClose,
  onRetry,
}: MemberReservationDetailProps) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerTitle = reservation
    ? `Detalle de la reserva ${reservation.id}`
    : "Detalle de la reserva";

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      slotProps={{
        paper: {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": drawerTitle,
          sx: isMobile
            ? styles.detailDrawerPaperMobile
            : styles.detailDrawerPaper,
        },
      }}
    >
      <Box sx={styles.detailDrawerHeader}>
        <Box>
          <Typography component="span" sx={styles.detailEyebrow}>
            Mis reservas
          </Typography>

          <Typography component="strong" sx={styles.detailDrawerTitle}>
            Detalle de la reserva
          </Typography>
        </Box>

        <IconButton
          type="button"
          aria-label="Cerrar detalle de la reserva"
          onClick={onClose}
          sx={styles.detailCloseButton}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={styles.detailDrawerBody}>
        {isLoading && !reservation ? <ReservationDetailLoadingState /> : null}

        {errorMessage && !reservation ? (
          <ReservationDetailErrorState
            message={errorMessage}
            isRetrying={isLoading}
            onRetry={onRetry}
          />
        ) : null}

        {reservation ? (
          <ReservationDetailContent reservation={reservation} />
        ) : null}
      </Box>
    </Drawer>
  );
}
