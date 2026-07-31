"use client";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useTheme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  CreateSocioPayload,
  Socio,
  SocioStatus,
  UpdateSocioPayload,
  UpdateSocioStatusPayload,
} from "@/api/sociosApi";
import { useSocios } from "@/hooks/socios/useSocios";

import { MemberDetailPanel } from "./MemberDetailPanel";
import {
  MemberFormModal,
  type MemberFormMode,
  type MemberFormSubmitPayload,
} from "./MemberFormModal";
import { MemberStatusModal } from "./MemberStatusModal";
import {
  MembersFiltersModal,
  type MembersFilters,
} from "./MembersFiltersModal";
import { MembersListPanel } from "./MembersListPanel";
import { membersStyles } from "./members.styles";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const SEARCH_DEBOUNCE_MS = 400;
const DEFAULT_PAGE_SIZE = 5;

const socioStatusLabels: Record<SocioStatus, string> = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
  SUSPENDIDO: "Suspendido",
};

/* =========================================================
   HELPERS
========================================================= */

function getActiveFiltersCount(filters: MembersFilters) {
  return Number(Boolean(filters.estado));
}

/* =========================================================
   CONTAINER PRINCIPAL
========================================================= */

/*
Container administrativo del módulo Socios.

Responsabilidades:
- inicializar y coordinar el listado paginado;
- manejar búsqueda con debounce y filtros backend;
- controlar la selección Master / Detail;
- coordinar alta, edición y cambio de estado;
- presentar feedback y estados de interfaz;
- adaptar el detalle a desktop, tablet y mobile;
- delegar HTTP y mutaciones al hook useSocios.

No realiza solicitudes HTTP directas.
No construye URLs.
No implementa reglas críticas de negocio.
*/
export default function MembersContainer() {
  const theme = useTheme();
  const isCompactLayout = useMediaQuery(
    theme.breakpoints.down("lg"),
  );

  const {
    socios,
    selectedSocio,
    pagination,

    loadingSocios,
    loadingDetail,
    creatingSocio,
    updatingSocio,
    updatingSocioStatus,

    sociosError,
    detailError,
    actionError,
    actionSuccess,

    fetchSocios,
    fetchSocioById,
    selectSocio,

    createSocio,
    updateSocio,
    updateSocioStatus,

    clearSociosError,
    clearActionFeedback,
  } = useSocios();

  /* =========================================================
     ESTADO LOCAL DE INTERFAZ
  ========================================================= */

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<MembersFilters>({});
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [memberFormMode, setMemberFormMode] =
    useState<MemberFormMode>("create");
  const [memberFormSocio, setMemberFormSocio] =
    useState<Socio | null>(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalSocio, setStatusModalSocio] =
    useState<Socio | null>(null);

  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const isInitialSearchRenderRef = useRef(true);
  const skipNextSearchEffectRef = useRef(false);
  const filtersRef = useRef<MembersFilters>({});
  const lastSelectedSocioIdRef = useRef<number | null>(null);

  /* =========================================================
     CARGA INICIAL Y BÚSQUEDA
  ========================================================= */

  useEffect(() => {
    void fetchSocios({
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
    });
  }, [fetchSocios]);

  /*
  Conserva el último identificador seleccionado para permitir
  reintentar la carga del detalle aun cuando el hook lo limpie
  después de un error.
  */
  useEffect(() => {
    if (selectedSocio) {
      lastSelectedSocioIdRef.current = selectedSocio.id;
    }
  }, [selectedSocio]);

  /*
  Ejecuta la búsqueda contra backend luego de que el usuario
  deja de escribir. Los cambios programáticos que ya ejecutan
  una consulta inmediata omiten únicamente el siguiente ciclo.
  */
  useEffect(() => {
    if (isInitialSearchRenderRef.current) {
      isInitialSearchRenderRef.current = false;
      return;
    }

    if (skipNextSearchEffectRef.current) {
      skipNextSearchEffectRef.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void fetchSocios({
        search: searchTerm.trim() || undefined,
        ...filtersRef.current,
        page: 1,
        limit: pagination.limit || DEFAULT_PAGE_SIZE,
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm, pagination.limit, fetchSocios]);

  /* =========================================================
     VALORES DERIVADOS
  ========================================================= */

  const activeFiltersCount = useMemo(
    () => getActiveFiltersCount(filters),
    [filters],
  );

  const isActionLoading =
    creatingSocio || updatingSocio || updatingSocioStatus;

  const hasSearchApplied = searchTerm.trim().length > 0;
  const hasFiltersApplied = activeFiltersCount > 0;
  const hasActiveCriteria = hasSearchApplied || hasFiltersApplied;

  /* =========================================================
     HELPERS DE CONSULTA
  ========================================================= */

  const fetchCurrentList = async (page: number) => {
    await fetchSocios({
      search: searchTerm.trim() || undefined,
      ...filtersRef.current,
      page,
      limit: pagination.limit || DEFAULT_PAGE_SIZE,
    });
  };

  const applyFilters = async (nextFilters: MembersFilters) => {
    filtersRef.current = nextFilters;
    setFilters(nextFilters);

    await fetchSocios({
      search: searchTerm.trim() || undefined,
      ...nextFilters,
      page: 1,
      limit: pagination.limit || DEFAULT_PAGE_SIZE,
    });
  };

  /* =========================================================
     HANDLERS DE LISTADO Y BÚSQUEDA
  ========================================================= */

  const handleSelectSocio = async (socioId: number) => {
    lastSelectedSocioIdRef.current = socioId;

    const socio = await selectSocio(socioId);

    if (socio && isCompactLayout) {
      setMobileDetailOpen(true);
    }
  };

  const handlePageChange = async (nextPage: number) => {
    await fetchCurrentList(nextPage);
  };

  const handleRetryList = async () => {
    clearSociosError();
    await fetchCurrentList(pagination.page || 1);
  };

  const handleRetryDetail = async () => {
    const socioId = lastSelectedSocioIdRef.current;

    if (!socioId) {
      return;
    }

    await fetchSocioById(socioId);
  };

  const handleClearSearch = async () => {
    if (!hasSearchApplied) {
      return;
    }

    skipNextSearchEffectRef.current = true;
    setSearchTerm("");

    await fetchSocios({
      ...filtersRef.current,
      page: 1,
      limit: pagination.limit || DEFAULT_PAGE_SIZE,
    });
  };

  const handleResetCriteria = async () => {
    filtersRef.current = {};
    setFilters({});

    if (hasSearchApplied) {
      skipNextSearchEffectRef.current = true;
      setSearchTerm("");
    }

    await fetchSocios({
      page: 1,
      limit: pagination.limit || DEFAULT_PAGE_SIZE,
    });
  };

  /* =========================================================
     HANDLERS DE FILTROS
  ========================================================= */

  const handleApplyFilters = async (nextFilters: MembersFilters) => {
    setFiltersModalOpen(false);
    await applyFilters(nextFilters);
  };

  const handleClearAllFilters = async () => {
    await applyFilters({});
  };

  const handleRemoveSocioStatusFilter = async () => {
    await applyFilters({});
  };

  /* =========================================================
     HANDLERS DE ALTA Y EDICIÓN
  ========================================================= */

  const handleOpenCreate = () => {
    clearActionFeedback();
    setMemberFormMode("create");
    setMemberFormSocio(null);
    setMemberFormOpen(true);
  };

  const handleOpenEdit = (socio: Socio) => {
    clearActionFeedback();
    setMemberFormMode("edit");
    setMemberFormSocio(socio);
    setMemberFormOpen(true);
  };

  const handleCloseMemberForm = () => {
    setMemberFormOpen(false);
    setMemberFormSocio(null);
    clearActionFeedback();
  };

  const handleSubmitMemberForm = async (
    payload: MemberFormSubmitPayload,
  ) => {
    if (memberFormMode === "create") {
      const createdSocio = await createSocio(
        payload as CreateSocioPayload,
      );

      if (!createdSocio) {
        return;
      }

      setMemberFormOpen(false);
      setMemberFormSocio(null);
      return;
    }

    if (!memberFormSocio) {
      return;
    }

    const updatedSocio = await updateSocio(
      memberFormSocio.id,
      payload as UpdateSocioPayload,
    );

    if (!updatedSocio) {
      return;
    }

    setMemberFormOpen(false);
    setMemberFormSocio(null);

    if (isCompactLayout) {
      setMobileDetailOpen(false);
    }
  };

  /* =========================================================
     HANDLERS DE CAMBIO DE ESTADO
  ========================================================= */

  const handleOpenStatus = (socio: Socio) => {
    clearActionFeedback();
    setStatusModalSocio(socio);
    setStatusModalOpen(true);
  };

  const handleCloseStatus = () => {
    setStatusModalOpen(false);
    setStatusModalSocio(null);
    clearActionFeedback();
  };

  const handleSubmitStatus = async (
    payload: UpdateSocioStatusPayload,
  ) => {
    if (!statusModalSocio) {
      return;
    }

    const updatedSocio = await updateSocioStatus(
      statusModalSocio.id,
      payload,
    );

    if (!updatedSocio) {
      return;
    }

    setStatusModalOpen(false);
    setStatusModalSocio(null);

    if (isCompactLayout) {
      setMobileDetailOpen(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Box sx={membersStyles.root}>
      <Box sx={membersStyles.pageContent}>
        {/* ===================================================
            TOOLBAR OPERATIVA
        =================================================== */}

        <Box sx={membersStyles.toolbar}>
          <Box sx={membersStyles.toolbarCopy}>
            <Typography
              component="h2"
              sx={membersStyles.sectionTitle}
            >
              Socios registrados
            </Typography>

            <Typography sx={membersStyles.sectionSubtitle}>
              Administrá datos personales, estados, accesos y
              consentimiento informado.
            </Typography>
          </Box>

          <Box sx={membersStyles.toolbarActions}>
            <TextField
              value={searchTerm}
              placeholder="Buscar por nombre, documento o email..."
              aria-label="Buscar socios"
              onChange={(event) => setSearchTerm(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: hasSearchApplied ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="Limpiar búsqueda"
                        onClick={() => void handleClearSearch()}
                      >
                        <CloseOutlinedIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                },
              }}
              sx={membersStyles.searchField}
            />

            <Button
              type="button"
              variant="outlined"
              startIcon={<FilterAltOutlinedIcon />}
              disabled={loadingSocios}
              onClick={() => setFiltersModalOpen(true)}
              sx={membersStyles.filterButton}
            >
              Filtros

              {activeFiltersCount > 0 && (
                <Box
                  component="span"
                  sx={{ ...membersStyles.panelCount, ml: 1 }}
                >
                  {activeFiltersCount}
                </Box>
              )}
            </Button>

            <Button
              type="button"
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              disabled={isActionLoading}
              onClick={handleOpenCreate}
              sx={membersStyles.primaryButton}
            >
              Nuevo socio
            </Button>
          </Box>
        </Box>

        {/* ===================================================
            FILTROS ACTIVOS Y FEEDBACK
        =================================================== */}

        {hasFiltersApplied && (
          <Box sx={membersStyles.activeFiltersRow}>
            {filters.estado && (
              <Chip
                variant="outlined"
                label={`Estado: ${socioStatusLabels[filters.estado]}`}
                onDelete={() =>
                  void handleRemoveSocioStatusFilter()
                }
                sx={membersStyles.activeFilterChip}
              />
            )}

            <Button
              type="button"
              variant="outlined"
              startIcon={<RestartAltOutlinedIcon />}
              onClick={() => void handleClearAllFilters()}
              sx={membersStyles.clearFiltersButton}
            >
              Limpiar filtro
            </Button>
          </Box>
        )}

        {actionSuccess && (
          <Alert
            severity="success"
            onClose={clearActionFeedback}
            sx={membersStyles.feedbackAlert}
          >
            {actionSuccess}
          </Alert>
        )}

        {/* ===================================================
            MASTER / DETAIL
        =================================================== */}

        <Box sx={membersStyles.contentGrid}>
          <MembersListPanel
            socios={socios}
            selectedSocioId={selectedSocio?.id ?? null}
            pagination={pagination}
            loading={loadingSocios}
            error={sociosError}
            hasActiveCriteria={hasActiveCriteria}
            onSelect={(socioId) => void handleSelectSocio(socioId)}
            onPageChange={(page) => void handlePageChange(page)}
            onRetry={() => void handleRetryList()}
            onResetCriteria={() => void handleResetCriteria()}
          />

          <Box
            component="aside"
            aria-labelledby="member-detail-title"
            sx={{
              ...membersStyles.panel,
              ...membersStyles.detailPanel,
              display: { xs: "none", lg: "block" },
            }}
          >
            <Box sx={membersStyles.panelHeader}>
              <Box sx={membersStyles.panelHeaderContent}>
                <Typography
                  id="member-detail-title"
                  sx={membersStyles.panelTitle}
                >
                  Detalle del socio
                </Typography>

                <Typography sx={membersStyles.panelHint}>
                  Información personal, acceso y consentimiento
                </Typography>
              </Box>
            </Box>

            <MemberDetailPanel
              socio={selectedSocio}
              loading={loadingDetail}
              error={detailError}
              actionsDisabled={isActionLoading}
              onRetry={() => void handleRetryDetail()}
              onEdit={handleOpenEdit}
              onChangeStatus={handleOpenStatus}
            />
          </Box>
        </Box>
      </Box>

      {/* =====================================================
          DETALLE MOBILE / TABLET
      ===================================================== */}

      <Dialog
        open={mobileDetailOpen && isCompactLayout}
        fullScreen
        aria-labelledby="mobile-member-detail-title"
        onClose={() => {
          if (!isActionLoading) {
            setMobileDetailOpen(false);
          }
        }}
        sx={membersStyles.mobileDetailDialog}
      >
        <Box sx={membersStyles.mobileDetailHeader}>
          <IconButton
            aria-label="Volver al listado de socios"
            disabled={isActionLoading}
            onClick={() => setMobileDetailOpen(false)}
            sx={membersStyles.mobileDetailBackButton}
          >
            <ArrowBackOutlinedIcon />
          </IconButton>

          <Box>
            <Typography
              id="mobile-member-detail-title"
              sx={membersStyles.panelTitle}
            >
              Detalle del socio
            </Typography>

            <Typography sx={membersStyles.panelHint}>
              Datos, acceso y consentimiento
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={membersStyles.mobileDetailBody}>
          <Box sx={membersStyles.panel}>
            <MemberDetailPanel
              socio={selectedSocio}
              loading={loadingDetail}
              error={detailError}
              actionsDisabled={isActionLoading}
              onRetry={() => void handleRetryDetail()}
              onEdit={handleOpenEdit}
              onChangeStatus={handleOpenStatus}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* =====================================================
          MODALES OPERATIVOS
      ===================================================== */}

      <MemberFormModal
        open={memberFormOpen}
        mode={memberFormMode}
        socio={memberFormSocio}
        loading={
          memberFormMode === "create"
            ? creatingSocio
            : updatingSocio
        }
        error={actionError}
        onClose={handleCloseMemberForm}
        onClearError={clearActionFeedback}
        onSubmit={handleSubmitMemberForm}
      />

      <MemberStatusModal
        open={statusModalOpen}
        socio={statusModalSocio}
        loading={updatingSocioStatus}
        error={actionError}
        onClose={handleCloseStatus}
        onClearError={clearActionFeedback}
        onSubmit={handleSubmitStatus}
      />

      <MembersFiltersModal
        open={filtersModalOpen}
        filters={filters}
        onClose={() => setFiltersModalOpen(false)}
        onApply={(nextFilters) =>
          void handleApplyFilters(nextFilters)
        }
      />
    </Box>
  );
}