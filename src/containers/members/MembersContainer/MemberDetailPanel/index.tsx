import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import type { ReactNode } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Skeleton,
  Typography,
  type ChipProps,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import type {
  Socio,
  SocioStatus,
  SocioUserStatus,
} from "@/api/sociosApi";
import { colors } from "@/theme/colors";

import { membersStyles } from "../members.styles";

type MemberDetailPanelProps = {
  socio: Socio | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  onEdit?: (socio: Socio) => void;
  onChangeStatus?: (socio: Socio) => void;
  actionsDisabled?: boolean;
};

type StatusVisual = {
  muiColor: ChipProps["color"];
  foreground: string;
  background: string;
  border: string;
};

/* =========================================================
   ETIQUETAS DEL DOMINIO
========================================================= */

const socioStatusLabels: Record<SocioStatus, string> = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
  SUSPENDIDO: "Suspendido",
};

const userStatusLabels: Record<SocioUserStatus, string> = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
  BLOQUEADO: "Bloqueado",
};

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

function getInitials(nombre: string, apellido: string) {
  const initials = [nombre, apellido]
    .map((value) => value.trim().charAt(0))
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return initials || "S";
}

function formatDocument(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 8) {
    return value;
  }

  return `${digits[0]}.${digits.slice(1, 4)}.${digits.slice(
    4,
    7,
  )}-${digits[7]}`;
}

function formatPhone(value: string | null) {
  if (!value) {
    return "No registrado";
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length !== 9) {
    return value;
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
    6,
  )}`;
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "No registrada";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Dato no disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getSocioStatusVisual(status: SocioStatus): StatusVisual {
  if (status === "ACTIVO") {
    return {
      muiColor: "success",
      foreground: colors.state.success,
      background: alpha(colors.state.success, 0.09),
      border: alpha(colors.state.success, 0.24),
    };
  }

  if (status === "INACTIVO") {
    return {
      muiColor: "warning",
      foreground: colors.state.warning,
      background: alpha(colors.state.warning, 0.1),
      border: alpha(colors.state.warning, 0.26),
    };
  }

  return {
    muiColor: "error",
    foreground: colors.state.error,
    background: alpha(colors.state.error, 0.09),
    border: alpha(colors.state.error, 0.24),
  };
}

function getUserStatusToken(status: SocioUserStatus) {
  if (status === "ACTIVO") {
    return colors.state.success;
  }

  if (status === "INACTIVO") {
    return colors.state.warning;
  }

  return colors.state.error;
}

function getConsentVisual(accepted: boolean): StatusVisual {
  if (accepted) {
    return {
      muiColor: "success",
      foreground: colors.state.success,
      background: alpha(colors.state.success, 0.075),
      border: alpha(colors.state.success, 0.24),
    };
  }

  return {
    muiColor: "warning",
    foreground: colors.state.warning,
    background: alpha(colors.state.warning, 0.08),
    border: alpha(colors.state.warning, 0.26),
  };
}

/* =========================================================
   BLOQUES DE PRESENTACIÓN
========================================================= */

type DetailValueProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

function DetailValue({ label, value, icon }: DetailValueProps) {
  return (
    <Box
      sx={{
        ...membersStyles.detailItem,
        minHeight: 58,
      }}
    >
      <Typography
        component="p"
        sx={{
          ...membersStyles.detailLabel,
          fontSize: {
            xs: 11.25,
            sm: 11.5,
          },
          fontWeight: 650,
          color: alpha(colors.text.primary, 0.72),
          letterSpacing: "0.035em",
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          ...membersStyles.detailValueRow,
          gap: 0.8,
          mt: 0.7,
        }}
      >
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            ...membersStyles.detailValueIcon,
            fontSize: 17,
            color: alpha(colors.text.primary, 0.56),
          }}
        >
          {icon}
        </Box>

        <Typography
          component="p"
          sx={{
            ...membersStyles.detailValueInline,
            fontSize: {
              xs: 13.5,
              sm: 13.75,
            },
            fontWeight: 500,
            color: alpha(colors.text.primary, 0.88),
            lineHeight: 1.45,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

type DetailSectionHeaderProps = {
  title: string;
  icon: ReactNode;
};

function DetailSectionHeader({
  title,
  icon,
}: DetailSectionHeaderProps) {
  return (
    <Box
      sx={{
        ...membersStyles.detailSectionHeader,
        gap: 1,
        mb: 2.25,
        pb: 1.35,
        borderBottom: `1px solid ${alpha(colors.text.primary, 0.085)}`,
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          ...membersStyles.detailSectionIcon,
          width: 34,
          height: 34,
          borderRadius: "10px",
          color: colors.brand.primaryDark,
          backgroundColor: alpha(colors.brand.primary, 0.085),
          border: `1px solid ${alpha(colors.brand.primary, 0.12)}`,

          "& svg": {
            fontSize: 18,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        component="h3"
        sx={{
          ...membersStyles.detailSectionTitleInline,
          fontSize: {
            xs: 12.25,
            sm: 12.75,
          },
          fontWeight: 750,
          color: colors.brand.primaryDark,
          letterSpacing: "0.055em",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

function SocioStatusChip({ status }: { status: SocioStatus }) {
  const visual = getSocioStatusVisual(status);

  return (
    <Chip
      size="small"
      variant="outlined"
      color={visual.muiColor}
      label={socioStatusLabels[status]}
      sx={{
        ...membersStyles.statusChip,
        color: visual.foreground,
        backgroundColor: visual.background,
        borderColor: visual.border,
      }}
    />
  );
}

function ConsentChip({ accepted }: { accepted: boolean }) {
  const visual = getConsentVisual(accepted);

  return (
    <Chip
      size="small"
      variant="outlined"
      color={visual.muiColor}
      icon={
        accepted ? (
          <CheckCircleOutlineOutlinedIcon />
        ) : (
          <PendingActionsOutlinedIcon />
        )
      }
      label={
        accepted
          ? "Consentimiento aceptado"
          : "Consentimiento pendiente"
      }
      sx={{
        ...membersStyles.accessStatusChip,
        color: visual.foreground,
        backgroundColor: visual.background,
        borderColor: visual.border,

        "& .MuiChip-icon": {
          color: visual.foreground,
          fontSize: 16,
        },
      }}
    />
  );
}

/* =========================================================
   ESTADOS VISUALES
========================================================= */

function DetailSkeleton() {
  return (
    <Box
      sx={membersStyles.detailContent}
      aria-label="Cargando detalle del socio"
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "minmax(0, 1fr) auto",
          },
          alignItems: "start",
          gap: 2,
          borderBottom: `1px solid ${colors.border.default}`,
          background: `linear-gradient(135deg, ${
            colors.background.surface
          } 0%, ${alpha(colors.background.soft, 0.72)} 100%)`,
        }}
      >
        <Box
          sx={{
            ...membersStyles.detailHero,
            background: "transparent",
          }}
        >
          <Skeleton variant="circular" width={68} height={68} />

          <Box sx={membersStyles.detailIdentity}>
            <Skeleton width="58%" height={31} />
            <Skeleton width="82%" height={22} />

            <Box sx={membersStyles.detailStatusRow}>
              <Skeleton width={78} height={27} />
              <Skeleton width={156} height={27} />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: {
              xs: "none",
              sm: "grid",
            },
            gridTemplateColumns: "repeat(2, minmax(136px, auto))",
            gap: 1,
            pt: 2.5,
            pr: 2.5,
          }}
        >
          <Skeleton width={136} height={42} />
          <Skeleton width={154} height={42} />
        </Box>
      </Box>

      {[
        { width: 168, items: 4 },
        { width: 150, items: 3 },
        { width: 190, items: 2 },
      ].map((section, sectionIndex) => (
        <Box
          key={sectionIndex}
          sx={membersStyles.detailSection}
        >
          <Skeleton width={section.width} height={28} />

          <Box
          sx={{
            ...membersStyles.detailGrid,
            columnGap: {
              xs: 1.75,
              sm: 2.5,
            },
            rowGap: {
              xs: 2,
              sm: 2.35,
            },
          }}
        >
            {Array.from({ length: section.items }).map(
              (_, index) => (
                <Box key={index} sx={membersStyles.detailItem}>
                  <Skeleton width="42%" height={17} />
                  <Skeleton width="78%" height={23} />
                </Box>
              ),
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Panel reutilizable con el detalle administrativo completo de un socio.

Responsabilidades:
- representar identidad y estado funcional;
- mostrar información personal y trazabilidad temporal;
- mostrar acceso al sistema y consentimiento informado;
- exponer acciones administrativas al container;
- resolver loading, error y ausencia de selección.

No realiza solicitudes HTTP.
No abre modales directamente.
No modifica datos.
*/
export function MemberDetailPanel({
  socio,
  loading,
  error,
  onRetry,
  onEdit,
  onChangeStatus,
  actionsDisabled = false,
}: MemberDetailPanelProps) {
  if (loading) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <Box sx={membersStyles.stateContainer} role="alert">
        <Alert
          severity="error"
          sx={membersStyles.errorAlert}
          action={
            onRetry ? (
              <Button color="inherit" size="small" onClick={onRetry}>
                Reintentar
              </Button>
            ) : undefined
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!socio) {
    return (
      <Box sx={membersStyles.stateContainer}>
        <Box sx={membersStyles.stateIconSurface}>
          <PersonSearchOutlinedIcon />
        </Box>

        <Typography component="h3" sx={membersStyles.stateTitle}>
          Seleccioná un socio
        </Typography>

        <Typography sx={membersStyles.stateDescription}>
          Elegí un socio del listado para consultar sus datos, su acceso y el
          estado del consentimiento informado.
        </Typography>
      </Box>
    );
  }

  const hasActions = Boolean(onEdit || onChangeStatus);
  const userStatusToken = getUserStatusToken(socio.usuario.estado);
  const userRoleLabel =
    socio.usuario.rol === "ADMIN" ? "Administrador" : "Socio";

  return (
    <Box sx={membersStyles.detailContent}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "minmax(0, 1fr) auto",
            lg: "minmax(0, 1fr)",
            xl: "minmax(0, 1fr) auto",
          },
          alignItems: "start",
          gap: {
            xs: 0,
            sm: 1.5,
            lg: 0,
            xl: 1.5,
          },
          borderBottom: `1px solid ${colors.border.default}`,
          background: `linear-gradient(135deg, ${
            colors.background.surface
          } 0%, ${alpha(colors.background.soft, 0.72)} 100%)`,
        }}
      >
        <Box
          sx={{
            ...membersStyles.detailHero,
            background: "transparent",
            pb: {
              xs: hasActions ? 1.5 : 2.75,
              sm: 2.75,
            },
          }}
        >
          <Avatar
            aria-hidden="true"
            sx={{
              ...membersStyles.detailAvatar,
              width: {
                xs: 62,
                sm: 68,
              },
              height: {
                xs: 62,
                sm: 68,
              },
              fontSize: {
                xs: 18,
                sm: 20,
              },
            }}
          >
            {getInitials(socio.nombre, socio.apellido)}
          </Avatar>

          <Box sx={membersStyles.detailIdentity}>
            <Typography component="h2" sx={membersStyles.detailName}>
              {socio.nombre} {socio.apellido}
            </Typography>

            <Typography
              title={socio.usuario.email}
              sx={membersStyles.detailEmail}
            >
              {socio.usuario.email}
            </Typography>

            <Box sx={membersStyles.detailStatusRow}>
              <SocioStatusChip status={socio.estado} />

              <ConsentChip
                accepted={socio.consentimiento_aceptado}
              />
            </Box>
          </Box>
        </Box>

        {hasActions && (
          <Box
            sx={{
              ...membersStyles.detailActions,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(136px, auto))",
                lg: "1fr",
                xl: "repeat(2, minmax(136px, auto))",
              },
              alignSelf: "start",
              px: {
                xs: 2,
                sm: 0,
                lg: 2.5,
                xl: 0,
              },
              pt: {
                xs: 0,
                sm: 2.5,
                lg: 0,
                xl: 2.5,
              },
              pr: {
                sm: 2.5,
                lg: 2.5,
                xl: 2.5,
              },
              pb: {
                xs: 2.25,
                sm: 2.5,
                lg: 2.25,
                xl: 2.5,
              },
              backgroundColor: "transparent",
              borderBottom: 0,
            }}
          >
            {onEdit && (
              <Button
                type="button"
                variant="outlined"
                startIcon={<EditOutlinedIcon />}
                disabled={actionsDisabled}
                onClick={() => onEdit(socio)}
                sx={{
                  ...membersStyles.secondaryButton,
                  minHeight: 44,
                  whiteSpace: "nowrap",
                }}
              >
                Editar datos
              </Button>
            )}

            {onChangeStatus && (
              <Button
                type="button"
                variant="outlined"
                startIcon={<ManageAccountsOutlinedIcon />}
                disabled={actionsDisabled}
                onClick={() => onChangeStatus(socio)}
                sx={{
                  ...membersStyles.secondaryButton,
                  minHeight: 44,
                  whiteSpace: "nowrap",
                }}
              >
                Cambiar estado
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Box
        component="section"
        sx={{
          ...membersStyles.detailSection,
          py: {
            xs: 2.75,
            sm: 3.1,
          },
          backgroundColor: colors.background.surface,
        }}
      >
        <DetailSectionHeader
          title="Información personal"
          icon={<PersonOutlineOutlinedIcon />}
        />

        <Box
          sx={{
            ...membersStyles.detailGrid,
            columnGap: {
              xs: 1.75,
              sm: 2.5,
            },
            rowGap: {
              xs: 2,
              sm: 2.35,
            },
          }}
        >
          <DetailValue
            label="Documento"
            value={formatDocument(socio.documento)}
            icon={<BadgeOutlinedIcon fontSize="inherit" />}
          />

          <DetailValue
            label="Teléfono"
            value={formatPhone(socio.telefono)}
            icon={<PhoneOutlinedIcon fontSize="inherit" />}
          />

          <DetailValue
            label="Fecha de alta"
            value={formatDateTime(socio.fecha_alta)}
            icon={<CalendarMonthOutlinedIcon fontSize="inherit" />}
          />

          <DetailValue
            label="Última actualización"
            value={formatDateTime(socio.fecha_actualizacion)}
            icon={<UpdateOutlinedIcon fontSize="inherit" />}
          />
        </Box>
      </Box>

      <Box
        component="section"
        sx={{
          ...membersStyles.detailSection,
          py: {
            xs: 2.75,
            sm: 3.1,
          },
          backgroundColor: alpha(colors.background.soft, 0.24),
        }}
      >
        <DetailSectionHeader
          title="Acceso al sistema"
          icon={<SecurityOutlinedIcon />}
        />

        <Box
          sx={{
            ...membersStyles.detailGrid,
            columnGap: {
              xs: 1.75,
              sm: 2.5,
            },
            rowGap: {
              xs: 2,
              sm: 2.35,
            },
          }}
        >
          <Box
            sx={{
              ...membersStyles.detailItem,
              minHeight: 58,
            }}
          >
            <Typography
              component="p"
              sx={{
                ...membersStyles.detailLabel,
                fontSize: {
                  xs: 11.25,
                  sm: 11.5,
                },
                fontWeight: 650,
                color: alpha(colors.text.primary, 0.72),
                letterSpacing: "0.035em",
              }}
            >
              Estado del usuario
            </Typography>

            <Box
              sx={{
                ...membersStyles.detailStatusValue,
                mt: 0.75,
                fontSize: {
                  xs: 13.5,
                  sm: 13.75,
                },
                fontWeight: 550,
                color: alpha(colors.text.primary, 0.88),
              }}
            >
              <Box
                component="span"
                aria-hidden="true"
                sx={membersStyles.detailStatusDot(userStatusToken)}
              />

              <Typography
                component="span"
                sx={{
                  fontSize: "inherit",
                  fontWeight: "inherit",
                  color: "inherit",
                }}
              >
                {userStatusLabels[socio.usuario.estado]}
              </Typography>
            </Box>
          </Box>

          <DetailValue
            label="Rol"
            value={userRoleLabel}
            icon={<SecurityOutlinedIcon fontSize="inherit" />}
          />

          <DetailValue
            label="Correo electrónico"
            value={socio.usuario.email}
            icon={<MailOutlineOutlinedIcon fontSize="inherit" />}
          />
        </Box>
      </Box>

      <Box
        component="section"
        sx={{
          ...membersStyles.detailSection,
          flex: 1,
          py: {
            xs: 2.75,
            sm: 3.1,
          },
          backgroundColor: colors.background.surface,
        }}
      >
        <DetailSectionHeader
          title="Consentimiento informado"
          icon={<FactCheckOutlinedIcon />}
        />

        <Box sx={membersStyles.detailGrid}>
          <Box
            sx={{
              ...membersStyles.detailItem,
              minHeight: 58,
            }}
          >
            <Typography
              component="p"
              sx={{
                ...membersStyles.detailLabel,
                fontSize: {
                  xs: 11.25,
                  sm: 11.5,
                },
                fontWeight: 650,
                color: alpha(colors.text.primary, 0.72),
                letterSpacing: "0.035em",
              }}
            >
              Estado
            </Typography>

            <Box sx={{ mt: 0.85 }}>
              <ConsentChip
                accepted={socio.consentimiento_aceptado}
              />
            </Box>
          </Box>

          <DetailValue
            label="Fecha de aceptación"
            value={
              socio.consentimiento_aceptado
                ? formatDateTime(socio.fecha_consentimiento)
                : "Pendiente de aceptación"
            }
            icon={
              socio.consentimiento_aceptado ? (
                <CheckCircleOutlineOutlinedIcon fontSize="inherit" />
              ) : (
                <PendingActionsOutlinedIcon fontSize="inherit" />
              )
            }
          />
        </Box>
      </Box>
    </Box>
  );
}