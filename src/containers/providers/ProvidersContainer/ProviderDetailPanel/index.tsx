"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";

import type {
  Provider,
  ProviderStatus,
} from "@/api/providersApi";

import { providersStyles } from "../providers.styles";

type ProviderDetailPanelProps = {
  provider: Provider | null;
  mobile?: boolean;
  onClose?: () => void;
  onEdit: () => void;
  onChangeStatus: () => void;
};

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

function getProviderInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "PR";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0].charAt(0)}${words.at(-1)?.charAt(0) ?? ""}`
    .toUpperCase();
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  if (digits.length === 8) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }

  return value;
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin información";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/* =========================================================
   COMPONENTES INTERNOS
========================================================= */

function ProviderStatusChip({
  status,
}: {
  status: ProviderStatus;
}) {
  return (
    <Chip
      size="small"
      label={status === "ACTIVO" ? "Activo" : "Inactivo"}
      sx={providersStyles.statusChip(status)}
    />
  );
}

type DetailItemProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

function DetailItem({
  label,
  value,
  icon,
}: DetailItemProps) {
  return (
    <Box sx={providersStyles.detailItem}>
      <Typography sx={providersStyles.detailLabel}>
        {label}
      </Typography>

      <Box sx={providersStyles.detailValueRow}>
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            display: "inline-flex",
            alignItems: "center",

            "& svg": providersStyles.detailValueIcon,
          }}
        >
          {icon}
        </Box>

        <Typography sx={providersStyles.detailValue}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Panel Detail del módulo administrativo de Proveedores.

Responsabilidades:
- mostrar la información completa disponible;
- reflejar el estado operativo;
- exponer acciones de edición y cambio de estado;
- adaptarse al detalle de escritorio y pantalla mobile.

No consulta endpoints adicionales porque backend entrega
el proveedor completo dentro del listado administrativo.
*/
export function ProviderDetailPanel({
  provider,
  mobile = false,
  onClose,
  onEdit,
  onChangeStatus,
}: ProviderDetailPanelProps) {
  if (!provider) {
    return (
      <Box
        component="section"
        aria-labelledby="provider-detail-title"
        sx={{
          ...providersStyles.panel,
          ...providersStyles.detailPanel,
        }}
      >
        <Box sx={providersStyles.panelHeader}>
          <Box sx={providersStyles.panelHeaderContent}>
            <Typography
              id="provider-detail-title"
              component="h2"
              sx={providersStyles.panelTitle}
            >
              Detalle del proveedor
            </Typography>

            <Typography sx={providersStyles.panelHint}>
              Información general y de contacto
            </Typography>
          </Box>
        </Box>

        <Box sx={providersStyles.stateContainer}>
          <Box sx={providersStyles.stateIconSurface}>
            <LocalShippingOutlinedIcon />
          </Box>

          <Typography
            component="h3"
            sx={providersStyles.stateTitle}
          >
            Sin proveedor seleccionado
          </Typography>

          <Typography sx={providersStyles.stateDescription}>
            Seleccioná un proveedor del listado para consultar sus
            datos y acciones disponibles.
          </Typography>
        </Box>
      </Box>
    );
  }

  const isInactive = provider.estado === "INACTIVO";

  const statusActionLabel = isInactive
    ? "Activar proveedor"
    : "Inactivar proveedor";

  return (
    <Box
      component="section"
      aria-labelledby="provider-detail-title"
      sx={{
        ...providersStyles.panel,
        ...providersStyles.detailPanel,
      }}
    >
      <Box sx={providersStyles.detailContent}>
        {mobile ? (
          <Box sx={providersStyles.mobileDetailHeader}>
            <IconButton
              aria-label="Volver al listado de proveedores"
              onClick={onClose}
              sx={providersStyles.closeButton}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography
              id="provider-detail-title"
              component="h2"
              sx={providersStyles.mobileDetailTitle}
            >
              Detalle del proveedor
            </Typography>

            <Box
              aria-hidden="true"
              sx={{
                width: 38,
                height: 38,
              }}
            />
          </Box>
        ) : (
          <Box sx={providersStyles.panelHeader}>
            <Box sx={providersStyles.panelHeaderContent}>
              <Typography
                id="provider-detail-title"
                component="h2"
                sx={providersStyles.panelTitle}
              >
                Detalle del proveedor
              </Typography>

              <Typography sx={providersStyles.panelHint}>
                Información general y de contacto
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={providersStyles.detailHero}>
          <Box sx={providersStyles.detailIdentityWrapper}>
            <Avatar
              aria-hidden="true"
              sx={{
                ...providersStyles.detailAvatar,
                ...(isInactive
                  ? providersStyles.detailInactiveAvatar
                  : {}),
              }}
            >
              {getProviderInitials(provider.nombre)}
            </Avatar>

            <Box sx={providersStyles.detailIdentity}>
              <Typography
                component="h3"
                sx={providersStyles.detailName}
              >
                {provider.nombre}
              </Typography>

              <Typography sx={providersStyles.detailIdentifier}>
                ID: {provider.id}
              </Typography>

              <Box sx={providersStyles.detailStatusRow}>
                <ProviderStatusChip status={provider.estado} />
              </Box>
            </Box>
          </Box>

          <Box sx={providersStyles.detailActions}>
            <Button
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={onEdit}
              sx={providersStyles.detailActionButton}
            >
              Editar datos
            </Button>

            <Button
              variant="outlined"
              startIcon={
                <PublishedWithChangesOutlinedIcon />
              }
              onClick={onChangeStatus}
              sx={providersStyles.detailActionButton}
            >
              {statusActionLabel}
            </Button>
          </Box>
        </Box>

        <Box sx={providersStyles.detailSection}>
          <Box sx={providersStyles.detailSectionHeader}>
            <Box sx={providersStyles.detailSectionIcon}>
              <PersonOutlineOutlinedIcon />
            </Box>

            <Typography
              component="h4"
              sx={providersStyles.detailSectionTitle}
            >
              Información de contacto
            </Typography>
          </Box>

          <Box sx={providersStyles.detailGrid}>
            <DetailItem
              label="Contacto"
              value={provider.contacto}
              icon={<PersonOutlineOutlinedIcon />}
            />

            <DetailItem
              label="Teléfono"
              value={formatPhone(provider.telefono)}
              icon={<PhoneOutlinedIcon />}
            />

            <DetailItem
              label="Correo electrónico"
              value={provider.email}
              icon={<EmailOutlinedIcon />}
            />
          </Box>
        </Box>

        <Box sx={providersStyles.detailSection}>
          <Box sx={providersStyles.detailSectionHeader}>
            <Box sx={providersStyles.detailSectionIcon}>
              <InfoOutlinedIcon />
            </Box>

            <Typography
              component="h4"
              sx={providersStyles.detailSectionTitle}
            >
              Información general
            </Typography>
          </Box>

          <Box sx={providersStyles.detailGrid}>
            <Box sx={providersStyles.detailItem}>
              <Typography sx={providersStyles.detailLabel}>
                Estado
              </Typography>

              <Box sx={providersStyles.detailValueRow}>
                <ProviderStatusChip status={provider.estado} />
              </Box>
            </Box>

            <DetailItem
              label="Fecha de alta"
              value={formatDateTime(provider.fecha_creacion)}
              icon={<CalendarMonthOutlinedIcon />}
            />

            <DetailItem
              label="Última actualización"
              value={formatDateTime(
                provider.fecha_actualizacion,
              )}
              icon={<UpdateOutlinedIcon />}
            />
          </Box>
        </Box>

        <Box sx={providersStyles.detailSection}>
          <Box sx={providersStyles.statusInformationBox}>
            <InfoOutlinedIcon
              sx={providersStyles.statusInformationIcon}
            />

            <Typography
              sx={providersStyles.statusInformationText}
            >
              {provider.estado === "ACTIVO"
                ? "Este proveedor se encuentra disponible para registrar nuevas compras."
                : "Este proveedor se conserva por trazabilidad, pero no puede utilizarse para registrar nuevas compras mientras permanezca inactivo."}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}