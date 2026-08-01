"use client";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import {
  Avatar,
  Box,
  ButtonBase,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import type {
  Provider,
  ProviderStatus,
} from "@/api/providersApi";
import { colors } from "@/theme/colors";

import { providersStyles } from "../providers.styles";

type ProviderStatusFilter = ProviderStatus | "TODOS";

type ProviderListPanelProps = {
  providers: Provider[];
  selectedProviderId: number | null;
  loading: boolean;
  searchValue: string;
  statusFilter: ProviderStatusFilter;
  onSelectProvider: (providerId: number) => void;
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

function getProviderCountLabel(total: number): string {
  return `${total} ${total === 1 ? "proveedor" : "proveedores"}`;
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

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Panel Master del módulo de Proveedores.

Responsabilidades:
- presentar el listado obtenido por el hook;
- representar selección y estado operativo;
- mostrar información responsive;
- comunicar la selección al Container;
- resolver actualización y ausencia de resultados.

No realiza solicitudes HTTP.
No modifica proveedores.
No administra búsqueda ni filtros.
No implementa paginación inexistente en backend.
*/
export function ProviderListPanel({
  providers,
  selectedProviderId,
  loading,
  searchValue,
  statusFilter,
  onSelectProvider,
}: ProviderListPanelProps) {
  const hasActiveCriteria =
    Boolean(searchValue) || statusFilter !== "TODOS";

  return (
    <Box
      component="section"
      aria-labelledby="providers-list-title"
      aria-busy={loading}
      sx={{
        ...providersStyles.panel,
        ...providersStyles.listPanel,
      }}
    >
      <Box sx={providersStyles.panelHeader}>
        <Box sx={providersStyles.panelHeaderContent}>
          <Typography
            id="providers-list-title"
            component="h2"
            sx={providersStyles.panelTitle}
          >
            Listado de proveedores
          </Typography>

          <Typography
            aria-live="polite"
            sx={providersStyles.panelHint}
          >
            {providers.length > 0
              ? `Mostrando ${getProviderCountLabel(providers.length)}`
              : "Sin proveedores para mostrar"}
          </Typography>
        </Box>

        <Box
          component="span"
          aria-label={getProviderCountLabel(providers.length)}
          sx={providersStyles.panelCount}
        >
          {getProviderCountLabel(providers.length)}
        </Box>
      </Box>

      {loading && providers.length > 0 && (
        <LinearProgress
          aria-label="Actualizando listado de proveedores"
          sx={{
            height: 3,
            backgroundColor: alpha(
              colors.brand.primary,
              0.08,
            ),

            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
            },
          }}
        />
      )}

      <Box sx={providersStyles.tableViewport}>
        <Box sx={providersStyles.providersTable}>
          <Box
            aria-hidden="true"
            sx={providersStyles.tableHeader}
          >
            <Typography sx={providersStyles.tableHeaderCell}>
              Proveedor
            </Typography>

            <Typography sx={providersStyles.tableHeaderCell}>
              Contacto
            </Typography>

            <Typography sx={providersStyles.tableHeaderCell}>
              Teléfono
            </Typography>

            <Typography sx={providersStyles.tableHeaderCell}>
              Email
            </Typography>

            <Typography sx={providersStyles.tableHeaderCell}>
              Estado
            </Typography>
          </Box>

          {!loading && providers.length === 0 && (
            <Box sx={providersStyles.stateContainer}>
              <Box sx={providersStyles.stateIconSurface}>
                <LocalShippingOutlinedIcon />
              </Box>

              <Typography
                component="h3"
                sx={providersStyles.stateTitle}
              >
                {hasActiveCriteria
                  ? "No encontramos proveedores"
                  : "Todavía no hay proveedores registrados"}
              </Typography>

              <Typography
                sx={providersStyles.stateDescription}
              >
                {hasActiveCriteria
                  ? "Revisá la búsqueda o modificá el filtro de estado aplicado."
                  : "Los proveedores registrados aparecerán en este listado."}
              </Typography>
            </Box>
          )}

          {providers.length > 0 && (
            <Box
              aria-label="Proveedores registrados"
              sx={providersStyles.providersList}
            >
              {providers.map((provider) => {
                const isSelected =
                  selectedProviderId === provider.id;

                const isInactive =
                  provider.estado === "INACTIVO";

                return (
                  <ButtonBase
                    key={provider.id}
                    component="button"
                    type="button"
                    disableRipple
                    disabled={loading}
                    aria-pressed={isSelected}
                    aria-current={
                      isSelected ? "true" : undefined
                    }
                    aria-label={`Ver detalle de ${provider.nombre}`}
                    onClick={() =>
                      onSelectProvider(provider.id)
                    }
                    sx={providersStyles.providerRow(
                      isSelected,
                    )}
                  >
                    <Box
                      sx={providersStyles.providerIdentity}
                    >
                      <Avatar
                        aria-hidden="true"
                        sx={{
                          ...providersStyles.providerAvatar,
                          ...(isInactive
                            ? providersStyles.inactiveProviderAvatar
                            : {}),
                        }}
                      >
                        {getProviderInitials(provider.nombre)}
                      </Avatar>

                      <Box
                        sx={providersStyles.providerMainData}
                      >
                        <Typography
                          component="span"
                          title={provider.nombre}
                          sx={providersStyles.providerName}
                        >
                          {provider.nombre}
                        </Typography>

                        <Typography
                          component="span"
                          sx={providersStyles.providerId}
                        >
                          ID: {provider.id}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      component="span"
                      title={provider.contacto}
                      sx={{
                        ...providersStyles.providerCell,
                        display: {
                          xs: "none",
                          md: "block",
                        },
                      }}
                    >
                      {provider.contacto}
                    </Typography>

                    <Typography
                      component="span"
                      title={provider.telefono}
                      sx={{
                        ...providersStyles.providerCell,
                        display: {
                          xs: "none",
                          md: "block",
                        },
                      }}
                    >
                      {formatPhone(provider.telefono)}
                    </Typography>

                    <Typography
                      component="span"
                      title={provider.email}
                      sx={{
                        ...providersStyles.providerEmailCell,
                        display: {
                          xs: "none",
                          md: "block",
                        },
                      }}
                    >
                      {provider.email}
                    </Typography>

                    <Box
                      sx={{
                        display: {
                          xs: "none",
                          md: "flex",
                        },
                        alignItems: "center",
                        minWidth: 0,
                      }}
                    >
                      <ProviderStatusChip
                        status={provider.estado}
                      />
                    </Box>

                    <Box
                      sx={providersStyles.mobileProviderMeta}
                    >
                      <Box
                        sx={
                          providersStyles.mobileProviderMetaItem
                        }
                      >
                        <Typography
                          sx={
                            providersStyles.mobileProviderMetaLabel
                          }
                        >
                          Contacto
                        </Typography>

                        <Typography
                          sx={
                            providersStyles.mobileProviderMetaValue
                          }
                        >
                          {provider.contacto}
                        </Typography>
                      </Box>

                      <Box
                        sx={
                          providersStyles.mobileProviderMetaItem
                        }
                      >
                        <Typography
                          sx={
                            providersStyles.mobileProviderMetaLabel
                          }
                        >
                          Teléfono
                        </Typography>

                        <Typography
                          sx={
                            providersStyles.mobileProviderMetaValue
                          }
                        >
                          {formatPhone(provider.telefono)}
                        </Typography>
                      </Box>

                      <Box
                        sx={
                          providersStyles.mobileProviderMetaItem
                        }
                      >
                        <Typography
                          sx={
                            providersStyles.mobileProviderMetaLabel
                          }
                        >
                          Email
                        </Typography>

                        <Typography
                          title={provider.email}
                          sx={
                            providersStyles.mobileProviderMetaValue
                          }
                        >
                          {provider.email}
                        </Typography>
                      </Box>

                      <Box
                        sx={
                          providersStyles.mobileProviderMetaItem
                        }
                      >
                        <Typography
                          sx={
                            providersStyles.mobileProviderMetaLabel
                          }
                        >
                          Estado
                        </Typography>

                        <Box sx={{ mt: 0.65 }}>
                          <ProviderStatusChip
                            status={provider.estado}
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

      {providers.length > 0 && (
        <Box sx={providersStyles.listFooter}>
          <Typography sx={providersStyles.listFooterText}>
            {getProviderCountLabel(providers.length)} en el
            resultado actual
          </Typography>
        </Box>
      )}
    </Box>
  );
}