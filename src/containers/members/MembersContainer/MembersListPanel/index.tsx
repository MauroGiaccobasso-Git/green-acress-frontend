"use client";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  LinearProgress,
  Skeleton,
  Typography,
  type ChipProps,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import type { Socio, SociosPagination, SocioStatus } from "@/api/sociosApi";
import { AppPagination } from "@/components/common/Pagination";
import { colors } from "@/theme/colors";

import { membersStyles } from "../members.styles";

type MembersListPanelProps = {
  socios: Socio[];
  selectedSocioId: number | null;
  pagination: SociosPagination;
  loading: boolean;
  error: string | null;
  hasActiveCriteria: boolean;
  onSelect: (socioId: number) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onResetCriteria: () => void;
};

type SocioStatusVisual = {
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

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

function getInitials(nombre: string, apellido: string) {
  const initials = `${nombre.charAt(0)}${apellido.charAt(0)}`
    .trim()
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
    return "Sin teléfono";
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length !== 9) {
    return value;
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

function getSocioStatusVisual(status: SocioStatus): SocioStatusVisual {
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

function getPaginationRange(page: number, limit: number, total: number) {
  if (total === 0) {
    return {
      from: 0,
      to: 0,
    };
  }

  return {
    from: (page - 1) * limit + 1,
    to: Math.min(page * limit, total),
  };
}

function getTotalLabel(total: number) {
  return `${total} ${total === 1 ? "socio" : "socios"}`;
}

/* =========================================================
   COMPONENTES VISUALES INTERNOS
========================================================= */

function MemberStatusChip({ status }: { status: SocioStatus }) {
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

function ConsentStatus({ accepted }: { accepted: boolean }) {
  const tone = accepted ? colors.state.success : colors.state.warning;

  return (
    <Box
      sx={membersStyles.consentCell}
      aria-label={
        accepted
          ? "Consentimiento informado aceptado"
          : "Consentimiento informado pendiente"
      }
    >
      {accepted ? (
        <CheckCircleOutlineOutlinedIcon
          sx={{
            ...membersStyles.consentIconAccepted,
            color: tone,
          }}
        />
      ) : (
        <PendingActionsOutlinedIcon
          sx={{
            ...membersStyles.consentIconPending,
            color: tone,
          }}
        />
      )}

      <Typography
        component="span"
        sx={{
          ...membersStyles.consentText,
          color: accepted ? colors.brand.primaryDark : colors.state.warning,
        }}
      >
        {accepted ? "Aceptado" : "Pendiente"}
      </Typography>
    </Box>
  );
}

function MembersListSkeleton() {
  return (
    <Box aria-label="Cargando listado de socios">
      {Array.from({ length: 5 }).map((_, index) => (
        <Box key={index} sx={membersStyles.skeletonRow}>
          <Box sx={membersStyles.memberIdentity}>
            <Skeleton variant="circular" width={48} height={48} />

            <Box sx={{ ...membersStyles.memberMainData, flex: 1 }}>
              <Skeleton width="58%" height={23} />
              <Skeleton width="82%" height={19} />
            </Box>
          </Box>

          <Skeleton
            width="76%"
            height={22}
            sx={{ display: { xs: "none", md: "block" } }}
          />

          <Skeleton
            width="68%"
            height={22}
            sx={{ display: { xs: "none", md: "block" } }}
          />

          <Skeleton
            width={78}
            height={28}
            sx={{ display: { xs: "none", md: "block" } }}
          />

          <Skeleton
            width={104}
            height={22}
            sx={{ display: { xs: "none", md: "block" } }}
          />
        </Box>
      ))}
    </Box>
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Panel visual del listado administrativo de socios.

Responsabilidades:
- representar encabezado, tabla responsive y paginación;
- mostrar selección, estados y consentimiento;
- resolver loading, error y ausencia de resultados;
- notificar selección, reintento y cambio de página.

No realiza solicitudes HTTP.
No administra filtros.
No modifica socios.
No implementa reglas de negocio.
*/
export function MembersListPanel({
  socios,
  selectedSocioId,
  pagination,
  loading,
  error,
  hasActiveCriteria,
  onSelect,
  onPageChange,
  onRetry,
  onResetCriteria,
}: MembersListPanelProps) {
  const paginationRange = getPaginationRange(
    pagination.page,
    pagination.limit,
    pagination.total,
  );

  const isInitialLoading = loading && socios.length === 0;

  return (
    <Box
      component="section"
      aria-labelledby="members-list-title"
      aria-busy={loading}
      sx={{
        ...membersStyles.panel,
        ...membersStyles.listPanel,
      }}
    >
      <Box sx={membersStyles.panelHeader}>
        <Box sx={membersStyles.panelHeaderContent}>
          <Typography
            id="members-list-title"
            component="h2"
            sx={membersStyles.panelTitle}
          >
            Listado de socios
          </Typography>

          <Typography aria-live="polite" sx={membersStyles.panelHint}>
            {pagination.total > 0
              ? `Mostrando ${paginationRange.from}–${paginationRange.to} de ${pagination.total}`
              : "Sin socios para mostrar"}
          </Typography>
        </Box>

        <Box sx={membersStyles.panelHeaderActions}>
          <Box
            component="span"
            aria-label={getTotalLabel(pagination.total)}
            sx={membersStyles.panelCount}
          >
            {getTotalLabel(pagination.total)}
          </Box>
        </Box>
      </Box>

      {loading && !isInitialLoading && (
        <LinearProgress
          aria-label="Actualizando listado de socios"
          sx={{
            height: 3,
            backgroundColor: alpha(colors.brand.primary, 0.08),
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
            },
          }}
        />
      )}

      <Box sx={membersStyles.tableViewport}>
        <Box sx={membersStyles.membersTable}>
          <Box aria-hidden="true" sx={membersStyles.tableHeader}>
            <Typography sx={membersStyles.tableHeaderCell}>Socio</Typography>
            <Typography sx={membersStyles.tableHeaderCell}>
              Documento
            </Typography>
            <Typography sx={membersStyles.tableHeaderCell}>Teléfono</Typography>
            <Typography sx={membersStyles.tableHeaderCell}>Estado</Typography>
            <Typography sx={membersStyles.tableHeaderCell}>
              Consentimiento
            </Typography>
          </Box>

          {isInitialLoading && <MembersListSkeleton />}

          {!isInitialLoading && error && (
            <Box sx={membersStyles.stateContainer} role="alert">
              <Alert
                severity="error"
                sx={membersStyles.errorAlert}
                action={
                  <Button color="inherit" size="small" onClick={onRetry}>
                    Reintentar
                  </Button>
                }
              >
                {error}
              </Alert>
            </Box>
          )}

          {!isInitialLoading && !error && socios.length === 0 && (
            <Box sx={membersStyles.stateContainer}>
              <Box sx={membersStyles.stateIconSurface}>
                <GroupOutlinedIcon />
              </Box>

              <Typography component="h3" sx={membersStyles.stateTitle}>
                {hasActiveCriteria
                  ? "No encontramos socios"
                  : "Todavía no hay socios registrados"}
              </Typography>

              <Typography sx={membersStyles.stateDescription}>
                {hasActiveCriteria
                  ? "Revisá la búsqueda o modificá los filtros aplicados."
                  : "Los socios registrados aparecerán en este listado."}
              </Typography>

              {hasActiveCriteria && (
                <Button
                  type="button"
                  variant="outlined"
                  onClick={onResetCriteria}
                  sx={{ ...membersStyles.secondaryButton, mt: 2.25 }}
                >
                  Restablecer criterios
                </Button>
              )}
            </Box>
          )}

          {socios.length > 0 && (
            <Box aria-label="Socios registrados" sx={membersStyles.membersList}>
              {socios.map((socio) => {
                const isSelected = selectedSocioId === socio.id;
                const fullName = `${socio.nombre} ${socio.apellido}`;

                return (
                  <ButtonBase
                    key={socio.id}
                    component="button"
                    disableRipple
                    disabled={loading}
                    aria-pressed={isSelected}
                    aria-current={isSelected ? "true" : undefined}
                    aria-label={`Ver detalle de ${fullName}`}
                    onClick={() => onSelect(socio.id)}
                    sx={membersStyles.memberRow(isSelected)}
                  >
                    <Box sx={membersStyles.memberIdentity}>
                      <Avatar
                        aria-hidden="true"
                        sx={membersStyles.memberAvatar}
                      >
                        {getInitials(socio.nombre, socio.apellido)}
                      </Avatar>

                      <Box sx={membersStyles.memberMainData}>
                        <Typography
                          component="span"
                          title={fullName}
                          sx={membersStyles.memberName}
                        >
                          {fullName}
                        </Typography>

                        <Typography
                          component="span"
                          title={socio.usuario.email}
                          sx={membersStyles.memberEmail}
                        >
                          {socio.usuario.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      component="span"
                      sx={{
                        ...membersStyles.memberDataCell,
                        display: { xs: "none", md: "block" },
                      }}
                    >
                      {formatDocument(socio.documento)}
                    </Typography>

                    <Typography
                      component="span"
                      sx={{
                        ...membersStyles.memberDataCell,
                        display: { xs: "none", md: "block" },
                      }}
                    >
                      {formatPhone(socio.telefono)}
                    </Typography>

                    <Box
                      sx={{
                        ...membersStyles.memberStatusArea,
                        display: { xs: "none", md: "flex" },
                      }}
                    >
                      <MemberStatusChip status={socio.estado} />
                    </Box>

                    <Box
                      sx={{
                        display: { xs: "none", md: "flex" },
                        minWidth: 0,
                      }}
                    >
                      <ConsentStatus accepted={socio.consentimiento_aceptado} />
                    </Box>

                    <Box sx={membersStyles.mobileMemberMeta}>
                      <Box sx={membersStyles.mobileMemberMetaItem}>
                        <Typography sx={membersStyles.mobileMemberMetaLabel}>
                          Documento
                        </Typography>
                        <Typography sx={membersStyles.mobileMemberMetaValue}>
                          {formatDocument(socio.documento)}
                        </Typography>
                      </Box>

                      <Box sx={membersStyles.mobileMemberMetaItem}>
                        <Typography sx={membersStyles.mobileMemberMetaLabel}>
                          Teléfono
                        </Typography>
                        <Typography sx={membersStyles.mobileMemberMetaValue}>
                          {formatPhone(socio.telefono)}
                        </Typography>
                      </Box>

                      <Box sx={membersStyles.mobileMemberMetaItem}>
                        <Typography sx={membersStyles.mobileMemberMetaLabel}>
                          Estado
                        </Typography>

                        <Box sx={{ mt: 0.65 }}>
                          <MemberStatusChip status={socio.estado} />
                        </Box>
                      </Box>

                      <Box sx={membersStyles.mobileMemberMetaItem}>
                        <Typography sx={membersStyles.mobileMemberMetaLabel}>
                          Consentimiento
                        </Typography>

                        <Box sx={{ mt: 0.65 }}>
                          <ConsentStatus
                            accepted={socio.consentimiento_aceptado}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </ButtonBase>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>

      {socios.length > 0 && (
        <Box sx={membersStyles.paginationArea}>
          <AppPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onChange={onPageChange}
          />
        </Box>
      )}
    </Box>
  );
}
