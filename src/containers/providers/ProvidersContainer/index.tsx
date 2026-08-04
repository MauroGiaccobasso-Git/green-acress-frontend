"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";

import type {
  CreateProviderPayload,
  Provider,
  ProviderStatus,
  UpdateProviderPayload,
} from "@/api/providersApi";
import { useProviders } from "@/hooks/providers/useProviders";

import { ProviderDetailPanel } from "./ProviderDetailPanel";
import { ProviderFiltersModal } from "./ProviderFiltersModal";
import { ProviderFormModal } from "./ProviderFormModal";
import { ProviderListPanel } from "./ProviderListPanel";
import { ProviderStatusModal } from "./ProviderStatusModal";
import { providersStyles } from "./providers.styles";

type ProviderFormMode = "create" | "edit";

type ProviderStatusFilter = ProviderStatus | "TODOS";

const SEARCH_DEBOUNCE_DELAY = 350;
const PROVIDERS_PAGE_SIZE = 5;

/*
Container principal del módulo administrativo de Proveedores.

Responsabilidades:
- coordinar búsqueda y filtro;
- administrar la selección Master / Detail;
- controlar alta, edición y cambio de estado;
- adaptar el detalle para escritorio y mobile;
- presentar cargas, errores y feedback;
- delegar las operaciones al hook del módulo.

Arquitectura:
Page → Container → Hook → API → httpClient → Backend.
*/
export default function ProvidersContainer() {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md"),
  );

  const {
    providers,
    selectedProvider,

    loadingProviders,
    creatingProvider,
    updatingProvider,
    updatingProviderStatus,

    providersError,
    actionError,
    actionSuccess,

    fetchProviders,
    selectProvider,

    createProvider,
    updateProvider,
    updateProviderStatus,

    clearProvidersError,
    clearSelectedProvider,
    clearActionFeedback,
  } = useProviders();

  /* =========================================================
     BÚSQUEDA Y FILTROS
  ========================================================= */

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<ProviderStatusFilter>("TODOS");

  const [isFiltersModalOpen, setIsFiltersModalOpen] =
    useState(false);

  /* =========================================================
     PAGINACIÓN Y CONSULTA
  ========================================================= */

  /*
  Evita ejecutar una consulta por cada tecla ingresada.
  La selección se limpia desde el evento de escritura para que
  la página visible vuelva naturalmente al primer resultado.
  */
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, SEARCH_DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue]);

  /*
  Consulta proveedores cuando cambia la búsqueda o el filtro.
  El hook conserva la responsabilidad de seleccionar el primer
  resultado disponible cuando no existe una selección vigente.
  */
  useEffect(() => {
    void fetchProviders({
      search: debouncedSearch || undefined,
      estado:
        statusFilter === "TODOS"
          ? undefined
          : statusFilter,
    });
  }, [debouncedSearch, fetchProviders, statusFilter]);

  const totalProviders = providers.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalProviders / PROVIDERS_PAGE_SIZE),
  );

  /*
  La página visible se deriva del proveedor seleccionado.

  Esto mantiene una única fuente de verdad para el patrón
  Master / Detail y evita sincronizar página y selección
  mediante efectos secundarios.
  */
  const selectedProviderIndex = selectedProvider
    ? providers.findIndex(
        (provider) => provider.id === selectedProvider.id,
      )
    : -1;

  const visiblePage =
    selectedProviderIndex >= 0
      ? Math.floor(
          selectedProviderIndex / PROVIDERS_PAGE_SIZE,
        ) + 1
      : 1;

  const paginatedProviders = useMemo(() => {
    const startIndex =
      (visiblePage - 1) * PROVIDERS_PAGE_SIZE;

    return providers.slice(
      startIndex,
      startIndex + PROVIDERS_PAGE_SIZE,
    );
  }, [providers, visiblePage]);

  const activeFiltersCount = useMemo(
    () => (statusFilter === "TODOS" ? 0 : 1),
    [statusFilter],
  );

  /* =========================================================
     MODALES Y DETALLE RESPONSIVE
  ========================================================= */

  const [providerFormMode, setProviderFormMode] =
    useState<ProviderFormMode | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] =
    useState(false);

  const [isMobileDetailOpen, setIsMobileDetailOpen] =
    useState(false);

  const handleOpenCreateProvider = useCallback(() => {
    clearActionFeedback();
    setProviderFormMode("create");
  }, [clearActionFeedback]);

  const handleOpenEditProvider = useCallback(() => {
    if (!selectedProvider) {
      return;
    }

    clearActionFeedback();
    setProviderFormMode("edit");
  }, [clearActionFeedback, selectedProvider]);

  const handleCloseProviderForm = useCallback(() => {
    if (creatingProvider || updatingProvider) {
      return;
    }

    setProviderFormMode(null);
  }, [creatingProvider, updatingProvider]);

  const handleOpenStatusModal = useCallback(() => {
    if (!selectedProvider) {
      return;
    }

    clearActionFeedback();
    setIsStatusModalOpen(true);
  }, [clearActionFeedback, selectedProvider]);

  const handleCloseStatusModal = useCallback(() => {
    if (updatingProviderStatus) {
      return;
    }

    setIsStatusModalOpen(false);
  }, [updatingProviderStatus]);

  const handleSelectProvider = useCallback(
    (providerId: number) => {
      const provider = selectProvider(providerId);

      if (provider && isMobile) {
        setIsMobileDetailOpen(true);
      }
    },
    [isMobile, selectProvider],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      const safePage = Math.min(
        Math.max(nextPage, 1),
        totalPages,
      );

      const firstProviderIndex =
        (safePage - 1) * PROVIDERS_PAGE_SIZE;

      const firstProviderOnPage =
        providers[firstProviderIndex];

      if (firstProviderOnPage) {
        selectProvider(firstProviderOnPage.id);
      }
    },
    [providers, selectProvider, totalPages],
  );

  const handleCloseMobileDetail = useCallback(() => {
    setIsMobileDetailOpen(false);
  }, []);

  /* =========================================================
     OPERACIONES DEL FORMULARIO
  ========================================================= */

  const handleSubmitProviderForm = useCallback(
    async (
      payload:
        | CreateProviderPayload
        | UpdateProviderPayload,
    ): Promise<Provider | null> => {
      if (providerFormMode === "create") {
        return createProvider(payload);
      }

      if (
        providerFormMode === "edit" &&
        selectedProvider
      ) {
        return updateProvider(
          selectedProvider.id,
          payload,
        );
      }

      return null;
    },
    [
      createProvider,
      providerFormMode,
      selectedProvider,
      updateProvider,
    ],
  );

  const handleConfirmStatusChange =
    useCallback(async (): Promise<Provider | null> => {
      if (!selectedProvider) {
        return null;
      }

      const nextStatus: ProviderStatus =
        selectedProvider.estado === "ACTIVO"
          ? "INACTIVO"
          : "ACTIVO";

      return updateProviderStatus(selectedProvider.id, {
        estado: nextStatus,
      });
    }, [selectedProvider, updateProviderStatus]);

  /* =========================================================
     FILTROS
  ========================================================= */

  const handleOpenFilters = useCallback(() => {
    setIsFiltersModalOpen(true);
  }, []);

  const handleCloseFilters = useCallback(() => {
    setIsFiltersModalOpen(false);
  }, []);

  const handleApplyFilters = useCallback(
    (nextStatus: ProviderStatusFilter) => {
      clearSelectedProvider();
      setStatusFilter(nextStatus);
      setIsFiltersModalOpen(false);
    },
    [clearSelectedProvider],
  );

  /* =========================================================
     RENDER
  ========================================================= */

  const isInitialLoading =
    loadingProviders && providers.length === 0;

  return (
    <Box sx={providersStyles.page}>
      <Box sx={providersStyles.headingRow}>
        <Box sx={providersStyles.headingContent}>
          <Typography
            component="h1"
            sx={providersStyles.pageTitle}
          >
            Proveedores registrados
          </Typography>

          <Typography sx={providersStyles.pageSubtitle}>
            Administrá los datos de contacto y el estado
            operativo de los proveedores del club.
          </Typography>
        </Box>

        <Box sx={providersStyles.toolbar}>
          <TextField
            value={searchValue}
            onChange={(event) => {
              clearSelectedProvider();
              setSearchValue(event.target.value);
            }}
            placeholder="Buscar por nombre, contacto o email..."
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={providersStyles.searchField}
          />

          <Button
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={handleOpenFilters}
            sx={providersStyles.filterButton}
          >
            Filtros
            {activeFiltersCount > 0 && (
              <Box
                component="span"
                sx={providersStyles.filterCounter}
              >
                {activeFiltersCount}
              </Box>
            )}
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateProvider}
            sx={providersStyles.createButton}
          >
            Nuevo proveedor
          </Button>
        </Box>
      </Box>

      {providersError && (
        <Alert
          severity="error"
          onClose={clearProvidersError}
          sx={providersStyles.alert}
        >
          {providersError}
        </Alert>
      )}

      {isInitialLoading ? (
        <Box sx={providersStyles.loadingState}>
          <CircularProgress size={28} />

          <Typography sx={providersStyles.loadingText}>
            Cargando proveedores...
          </Typography>
        </Box>
      ) : (
        <Box sx={providersStyles.contentGrid}>
          <ProviderListPanel
            providers={paginatedProviders}
            selectedProviderId={
              selectedProvider?.id ?? null
            }
            pagination={{
              page: visiblePage,
              pageSize: PROVIDERS_PAGE_SIZE,
              total: totalProviders,
              totalPages,
            }}
            loading={loadingProviders}
            searchValue={debouncedSearch}
            statusFilter={statusFilter}
            onSelectProvider={handleSelectProvider}
            onPageChange={handlePageChange}
          />

          {!isMobile && (
            <ProviderDetailPanel
              provider={selectedProvider}
              onEdit={handleOpenEditProvider}
              onChangeStatus={handleOpenStatusModal}
            />
          )}
        </Box>
      )}

      <Dialog
        open={
          isMobile &&
          isMobileDetailOpen &&
          Boolean(selectedProvider)
        }
        onClose={handleCloseMobileDetail}
        fullScreen
      >
        <DialogContent sx={providersStyles.mobileDialogContent}>
          <ProviderDetailPanel
            provider={selectedProvider}
            mobile
            onClose={handleCloseMobileDetail}
            onEdit={handleOpenEditProvider}
            onChangeStatus={handleOpenStatusModal}
          />
        </DialogContent>
      </Dialog>

      <ProviderFormModal
        open={providerFormMode !== null}
        mode={providerFormMode ?? "create"}
        provider={
          providerFormMode === "edit"
            ? selectedProvider
            : null
        }
        submitting={
          providerFormMode === "create"
            ? creatingProvider
            : updatingProvider
        }
        onClose={handleCloseProviderForm}
        onSubmit={handleSubmitProviderForm}
      />

      <ProviderStatusModal
        open={isStatusModalOpen}
        provider={selectedProvider}
        submitting={updatingProviderStatus}
        onClose={handleCloseStatusModal}
        onConfirm={handleConfirmStatusChange}
      />

      <ProviderFiltersModal
        open={isFiltersModalOpen}
        value={statusFilter}
        onClose={handleCloseFilters}
        onApply={handleApplyFilters}
      />

      <Snackbar
        open={Boolean(actionSuccess)}
        autoHideDuration={3500}
        onClose={clearActionFeedback}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={clearActionFeedback}
          sx={providersStyles.feedbackAlert}
        >
          {actionSuccess}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(actionError)}
        autoHideDuration={5000}
        onClose={clearActionFeedback}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={clearActionFeedback}
          sx={providersStyles.feedbackAlert}
        >
          {actionError}
        </Alert>
      </Snackbar>
    </Box>
  );
}