import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BalanceRoundedIcon from "@mui/icons-material/BalanceRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import type {
  MemberReservation,
  MemberReservationProduct,
} from "@/api/reservationsApi";

import { MemberReservationStatusBadge } from "../MemberReservationStatusBadge";
import { memberReservationsStyles as styles } from "../memberReservations.styles";

/* =========================================================
   TIPOS
========================================================= */

type MemberReservationCardProps = {
  reservation: MemberReservation;

  onViewDetail: (
    reservationId: number,
  ) => void;
};

/* =========================================================
   CONSTANTES
========================================================= */

const MEMBER_PORTAL_TIME_ZONE =
  "America/Montevideo";

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
    maximumFractionDigits: 0,
  }).format(value);
}

function getProductsCountLabel(
  count: number,
): string {
  if (count === 1) {
    return "1 producto incluido";
  }

  return `${count} productos incluidos`;
}

/*
Construye un título representativo sin asumir
que la reserva contiene un único producto.
*/
function getReservationTitle(
  products: MemberReservationProduct[],
): string {
  if (products.length === 0) {
    return "Reserva sin productos";
  }

  if (products.length === 1) {
    return products[0].nombre;
  }

  return `${products.length} productos reservados`;
}

/*
Resume los productos sin hacer crecer
excesivamente la tarjeta.

El detalle completo permanece disponible
al abrir la reserva.
*/
function getProductsPreview(
  products: MemberReservationProduct[],
): string {
  if (products.length === 0) {
    return "No hay productos disponibles para mostrar.";
  }

  const visibleProducts = products
    .slice(0, 2)
    .map(
      (product) =>
        `${product.nombre} · ${formatGrams(
          product.cantidad,
        )}`,
    );

  const remainingProducts =
    products.length - visibleProducts.length;

  if (remainingProducts <= 0) {
    return visibleProducts.join("  •  ");
  }

  return `${visibleProducts.join(
    "  •  ",
  )}  •  +${remainingProducts} más`;
}

/*
Selecciona la primera imagen válida
como representación visual de la reserva.
*/
function getReservationImage(
  products: MemberReservationProduct[],
): string | undefined {
  return products.find(
    (product) =>
      Boolean(product.imagen?.trim()),
  )?.imagen ?? undefined;
}

/* =========================================================
   INFORMACIÓN FUNCIONAL
========================================================= */

type ReservationFunctionalNoticeProps = {
  reservation: MemberReservation;
};

function ReservationFunctionalNotice({
  reservation,
}: ReservationFunctionalNoticeProps) {
  if (
    reservation.estado === "CONFIRMADA" &&
    reservation.fechaLimiteRetiro
  ) {
    return (
      <Box sx={styles.withdrawalNotice}>
        <Box
          aria-hidden="true"
          sx={styles.withdrawalNoticeIcon}
        >
          <EventAvailableRoundedIcon />
        </Box>

        <Box sx={styles.functionalNoticeCopy}>
          <Typography
            component="span"
            sx={styles.functionalNoticeLabel}
          >
            Disponible para retirar hasta
          </Typography>

          <Typography
            component="strong"
            sx={styles.withdrawalNoticeValue}
          >
            {formatDateTime(
              reservation.fechaLimiteRetiro,
            )}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (reservation.estado === "PENDIENTE") {
    return (
      <Box sx={styles.processingNotice}>
        <Box
          aria-hidden="true"
          sx={styles.processingNoticeIcon}
        >
          <HourglassTopRoundedIcon />
        </Box>

        <Box sx={styles.functionalNoticeCopy}>
          <Typography
            component="span"
            sx={styles.functionalNoticeLabel}
          >
            Procesamiento automático
          </Typography>

          <Typography
            component="strong"
            sx={styles.processingNoticeValue}
          >
            Estamos resolviendo tu solicitud.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (reservation.motivo?.trim()) {
    return (
      <Box sx={styles.reservationReason}>
        <InfoOutlinedIcon
          aria-hidden="true"
          sx={styles.reservationReasonIcon}
        />

        <Box sx={styles.functionalNoticeCopy}>
          <Typography
            component="span"
            sx={styles.functionalNoticeLabel}
          >
            Información de la reserva
          </Typography>

          <Typography
            component="p"
            sx={styles.reservationReasonText}
          >
            {reservation.motivo}
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
}

/* =========================================================
   COMPONENTE
========================================================= */

export function MemberReservationCard({
  reservation,
  onViewDetail,
}: MemberReservationCardProps) {
  const reservationTitle =
    getReservationTitle(
      reservation.productos,
    );

  const reservationImage =
    getReservationImage(
      reservation.productos,
    );

  const handleViewDetail = (): void => {
    onViewDetail(reservation.id);
  };

  return (
    <Paper
      component="article"
      elevation={0}
      data-status={reservation.estado}
      sx={styles.reservationCard}
    >
      <Box sx={styles.reservationCardHeader}>
        <Box sx={styles.reservationIdentity}>
          <Avatar
            variant="rounded"
            src={reservationImage}
            alt={
              reservationImage
                ? reservationTitle
                : ""
            }
            sx={styles.reservationIdentityIcon}
          >
            <Inventory2RoundedIcon
              aria-hidden="true"
            />
          </Avatar>

          <Box sx={styles.reservationIdentityCopy}>
            <Typography
              component="h3"
              sx={styles.reservationNumber}
            >
              {reservationTitle}
            </Typography>

            <Typography
              component="p"
              sx={styles.reservationRequestDate}
            >
              Reserva #{reservation.id} · Solicitada el{" "}
              {formatDate(
                reservation.fechaSolicitud,
              )}
            </Typography>
          </Box>
        </Box>

        <MemberReservationStatusBadge
          status={reservation.estado}
          label={reservation.estadoDescripcion}
        />
      </Box>

      <Box sx={styles.reservationCardBody}>
        <Box sx={styles.productsSummary}>
          <Typography
            component="span"
            sx={styles.productsCount}
          >
            {getProductsCountLabel(
              reservation.productos.length,
            )}
          </Typography>

          <Typography
            component="p"
            sx={styles.productsPreview}
          >
            {getProductsPreview(
              reservation.productos,
            )}
          </Typography>
        </Box>

        <Box
          aria-label="Resumen de la reserva"
          sx={styles.reservationMetrics}
        >
          <Box sx={styles.reservationMetric}>
            <BalanceRoundedIcon
              aria-hidden="true"
            />

            <Box>
              <Typography
                component="span"
                sx={styles.reservationMetricLabel}
              >
                Total reservado
              </Typography>

              <Typography
                component="strong"
                sx={styles.reservationMetricValue}
              >
                {formatGrams(
                  reservation.totalGramos,
                )}
              </Typography>
            </Box>
          </Box>

          <Box sx={styles.reservationMetric}>
            <PaymentsOutlinedIcon
              aria-hidden="true"
            />

            <Box>
              <Typography
                component="span"
                sx={styles.reservationMetricLabel}
              >
                Importe
              </Typography>

              <Typography
                component="strong"
                sx={styles.reservationMetricValue}
              >
                {formatCurrency(
                  reservation.total,
                )}
              </Typography>
            </Box>
          </Box>
        </Box>

        <ReservationFunctionalNotice
          reservation={reservation}
        />
      </Box>

      <Box sx={styles.reservationCardFooter}>
        <Button
          type="button"
          variant="outlined"
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={handleViewDetail}
          sx={styles.viewDetailButton}
        >
          Ver detalle
        </Button>
      </Box>
    </Paper>
  );
}