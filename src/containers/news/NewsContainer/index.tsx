"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { type ReactNode, useEffect, useState } from "react";

import type {
  News,
  NewsDetail,
  NewsStatus,
  PublishNewsPayload,
} from "@/api/newsApi";
import { useNews } from "@/hooks/news/useNews";

import { NewsDetailPanel } from "./NewsDetailPanel";
import { NewsFiltersModal } from "./NewsFiltersModal";
import { NewsFormModal } from "./NewsFormModal";
import { NewsListPanel } from "./NewsListPanel";
import { NewsStatusModal } from "./NewsStatusModal";
import { newsStyles } from "./news.styles";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const SEARCH_DEBOUNCE_DELAY = 350;
const NEWS_PAGE_SIZE = 5;

type NewsStatusFilter = NewsStatus | null;

type SummaryCardTone = "active" | "inactive" | "published" | "notifications";

/* =========================================================
   COMPONENTES INTERNOS
========================================================= */

type SummaryCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  hint: string;
  tone: SummaryCardTone;
  loading: boolean;
};

function SummaryCard({
  icon,
  label,
  value,
  hint,
  tone,
  loading,
}: SummaryCardProps) {
  return (
    <Box sx={newsStyles.summaryCard}>
      <Box aria-hidden="true" sx={newsStyles.summaryIcon(tone)}>
        {icon}
      </Box>

      <Box sx={newsStyles.summaryContent}>
        <Typography sx={newsStyles.summaryLabel}>{label}</Typography>

        <Typography aria-live="polite" sx={newsStyles.summaryValue}>
          {loading ? "—" : value}
        </Typography>

        <Typography sx={newsStyles.summaryHint}>{hint}</Typography>
      </Box>
    </Box>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Container principal del módulo administrativo de Novedades.

Arquitectura:
Page → Container → Hook → API → httpClient → Backend.

Responsabilidades:
- coordinar búsqueda, filtros y paginación visual;
- mantener la selección Master / Detail sincronizada;
- adaptar el detalle para desktop, tablet y mobile;
- coordinar publicación y cambios de estado;
- presentar métricas, errores y feedback.

No realiza solicitudes HTTP directas.
No contiene reglas críticas de negocio.
*/
export default function NewsContainer() {
  const theme = useTheme();

  const isCompactLayout = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    news,
    overviewNews,
    selectedNews,
    metrics,

    loadingNews,
    loadingOverview,
    loadingDetail,
    publishingNews,
    updatingNewsStatus,

    newsError,
    overviewError,
    detailError,
    actionError,
    actionSuccess,

    fetchNews,
    selectNews,
    publishNews,
    updateNewsStatus,

    clearNewsError,
    clearOverviewError,
    clearActionFeedback,
  } = useNews();

  /* =========================================================
     PAGINACIÓN
  ========================================================= */

  const [currentPage, setCurrentPage] = useState(1);

  /* =========================================================
     BÚSQUEDA
  ========================================================= */

  const [searchValue, setSearchValue] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, SEARCH_DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue]);

  /* =========================================================
     FILTROS
  ========================================================= */

  const [statusFilter, setStatusFilter] = useState<NewsStatusFilter>(null);

  const [draftStatusFilter, setDraftStatusFilter] =
    useState<NewsStatusFilter>(null);

  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  useEffect(() => {
    void fetchNews({
      search: debouncedSearch || undefined,
      estado: statusFilter ?? undefined,
    });
  }, [debouncedSearch, fetchNews, statusFilter]);

  /* =========================================================
     MODALES
  ========================================================= */

  const [formModalOpen, setFormModalOpen] = useState(false);

  const [statusModalNews, setStatusModalNews] = useState<News | null>(null);

  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  /* =========================================================
     PAGINACIÓN DERIVADA
  ========================================================= */

  const totalNews = news.length;

  const totalPages = Math.max(1, Math.ceil(totalNews / NEWS_PAGE_SIZE));

  const visiblePage = Math.min(currentPage, totalPages);

  const pageStartIndex = (visiblePage - 1) * NEWS_PAGE_SIZE;

  const paginatedNews = news.slice(
    pageStartIndex,
    pageStartIndex + NEWS_PAGE_SIZE,
  );

  /*
  La selección debe pertenecer siempre a la página visible.

  Esto evita mostrar un detalle antiguo que no corresponde
  con ninguna fila resaltada del listado.
  */
  const visibleIdsKey = paginatedNews.map((item) => item.id).join(",");

  useEffect(() => {
    const firstVisibleNews = paginatedNews[0];

    if (!firstVisibleNews) {
      return;
    }

    const selectedIsVisible = paginatedNews.some(
      (item) => item.id === selectedNews?.id,
    );

    if (!selectedIsVisible) {
      void selectNews(firstVisibleNews.id);
    }
  }, [paginatedNews, selectNews, selectedNews?.id, visibleIdsKey]);

  /* =========================================================
     ESTADOS DERIVADOS
  ========================================================= */

  const activeFiltersCount = statusFilter ? 1 : 0;

  const hasActiveCriteria = debouncedSearch.length > 0 || statusFilter !== null;

  const metricsLoading = loadingOverview && overviewNews.length === 0;

  const combinedListError =
    newsError ?? (overviewNews.length === 0 ? overviewError : null);

  const showIndependentOverviewError =
    Boolean(overviewError) &&
    overviewNews.length > 0 &&
    overviewError !== newsError;

  const showGlobalActionError =
    Boolean(actionError) && !formModalOpen && !statusModalNews;

  /* =========================================================
     HANDLERS DE BÚSQUEDA Y FILTROS
  ========================================================= */

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleOpenFilters = () => {
    setDraftStatusFilter(statusFilter);
    setFiltersModalOpen(true);
  };

  const handleCloseFilters = () => {
    setDraftStatusFilter(statusFilter);
    setFiltersModalOpen(false);
  };

  const handleApplyFilters = () => {
    setStatusFilter(draftStatusFilter);
    setCurrentPage(1);
    setFiltersModalOpen(false);
  };

  const handleClearFilters = () => {
    setDraftStatusFilter(null);
    setStatusFilter(null);
    setCurrentPage(1);
    setFiltersModalOpen(false);
  };

  /* =========================================================
     HANDLERS DE MODALES
  ========================================================= */

  const handleOpenFormModal = () => {
    clearActionFeedback();
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    if (!publishingNews) {
      setFormModalOpen(false);
    }
  };

  const handleOpenStatusModal = (targetNews: NewsDetail) => {
    clearActionFeedback();
    setStatusModalNews(targetNews);
  };

  const handleCloseStatusModal = () => {
    if (!updatingNewsStatus) {
      setStatusModalNews(null);
    }
  };

  const handleClearActionError = () => {
    if (actionError) {
      clearActionFeedback();
    }
  };

  /* =========================================================
     SELECCIÓN Y DETALLE RESPONSIVE
  ========================================================= */

  const handleSelectNews = (newsId: number) => {
    void (async () => {
      const detail = await selectNews(newsId);

      if (detail && isCompactLayout) {
        setMobileDetailOpen(true);
      }
    })();
  };

  /* =========================================================
     PUBLICACIÓN
  ========================================================= */

  const handlePublishNews = async (
    payload: PublishNewsPayload,
  ): Promise<boolean> => {
    const result = await publishNews(payload);

    if (!result) {
      return false;
    }

    setCurrentPage(1);

    return true;
  };

  /* =========================================================
     CAMBIO DE ESTADO
  ========================================================= */

  const handleUpdateNewsStatus = async (
    newsId: number,
    targetStatus: NewsStatus,
  ): Promise<boolean> => {
    const updatedNews = await updateNewsStatus(newsId, {
      estado: targetStatus,
    });

    return Boolean(updatedNews);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Box sx={newsStyles.page}>
      {/* =====================================================
          MÉTRICAS
      ====================================================== */}

      <Box
        component="section"
        aria-label="Resumen de novedades"
        sx={newsStyles.summaryGrid}
      >
        <SummaryCard
          icon={<ArticleOutlinedIcon />}
          label="Novedades activas"
          value={metrics.active}
          hint="Actualmente publicadas"
          tone="active"
          loading={metricsLoading}
        />

        <SummaryCard
          icon={<VisibilityOffOutlinedIcon />}
          label="Novedades inactivas"
          value={metrics.inactive}
          hint="Sin publicar"
          tone="inactive"
          loading={metricsLoading}
        />

        <SummaryCard
          icon={<CalendarMonthOutlinedIcon />}
          label="Publicadas este mes"
          value={metrics.publishedThisMonth}
          hint="En el mes actual"
          tone="published"
          loading={metricsLoading}
        />

        <SummaryCard
          icon={<SendOutlinedIcon />}
          label="Notificaciones generadas"
          value={metrics.generatedNotifications}
          hint="Destinatarios registrados"
          tone="notifications"
          loading={metricsLoading}
        />
      </Box>

      {/* =====================================================
          ERRORES DE CONSULTA
      ====================================================== */}

      {combinedListError && (
        <Alert
          severity="error"
          onClose={() => {
            clearNewsError();
            clearOverviewError();
          }}
          sx={newsStyles.alert}
        >
          {combinedListError}
        </Alert>
      )}

      {showIndependentOverviewError && (
        <Alert
          severity="warning"
          onClose={clearOverviewError}
          sx={newsStyles.alert}
        >
          {overviewError}
        </Alert>
      )}

      {/* =====================================================
          MASTER / DETAIL
      ====================================================== */}

      <Box sx={newsStyles.contentGrid}>
        <NewsListPanel
          news={paginatedNews}
          totalNews={totalNews}
          selectedNewsId={selectedNews?.id ?? null}
          loading={loadingNews}
          publishing={publishingNews}
          hasActiveCriteria={hasActiveCriteria}
          searchValue={searchValue}
          activeFiltersCount={activeFiltersCount}
          page={visiblePage}
          pageSize={NEWS_PAGE_SIZE}
          totalPages={totalPages}
          onSearchChange={handleSearchChange}
          onOpenFilters={handleOpenFilters}
          onCreateNews={handleOpenFormModal}
          onSelectNews={handleSelectNews}
          onPageChange={setCurrentPage}
        />

        {!isCompactLayout && (
          <NewsDetailPanel
            news={selectedNews}
            loading={loadingDetail}
            error={detailError}
            updatingStatus={updatingNewsStatus}
            onChangeStatus={handleOpenStatusModal}
          />
        )}
      </Box>

      {/* =====================================================
          DETALLE MOBILE / TABLET
      ====================================================== */}

      <Dialog
        fullScreen
        open={isCompactLayout && mobileDetailOpen && Boolean(selectedNews)}
        onClose={() => setMobileDetailOpen(false)}
        aria-label="Detalle de la novedad seleccionada"
      >
        <Box sx={newsStyles.mobileDetailHeader}>
          <IconButton
            type="button"
            aria-label="Volver al listado de novedades"
            onClick={() => setMobileDetailOpen(false)}
            sx={newsStyles.closeButton}
          >
            <ArrowBackRoundedIcon />
          </IconButton>

          <Typography sx={newsStyles.mobileDetailTitle}>
            Detalle de la novedad
          </Typography>

          <Box aria-hidden="true" />
        </Box>

        <DialogContent sx={newsStyles.mobileDialogContent}>
          <Box sx={{ p: 1.5 }}>
            <NewsDetailPanel
              news={selectedNews}
              loading={loadingDetail}
              error={detailError}
              updatingStatus={updatingNewsStatus}
              onChangeStatus={handleOpenStatusModal}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* =====================================================
          MODAL DE PUBLICACIÓN
      ====================================================== */}

      <NewsFormModal
        key={formModalOpen ? "news-form-open" : "news-form-closed"}
        open={formModalOpen}
        publishing={publishingNews}
        error={formModalOpen ? actionError : null}
        onSubmit={handlePublishNews}
        onClose={handleCloseFormModal}
        onClearError={handleClearActionError}
      />

      {/* =====================================================
          MODAL DE FILTROS
      ====================================================== */}

      <NewsFiltersModal
        open={filtersModalOpen}
        selectedStatus={draftStatusFilter}
        onSelectStatus={setDraftStatusFilter}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onClose={handleCloseFilters}
      />

      {/* =====================================================
          MODAL DE CAMBIO DE ESTADO
      ====================================================== */}

      <NewsStatusModal
        open={Boolean(statusModalNews)}
        news={statusModalNews}
        updating={updatingNewsStatus}
        error={statusModalNews ? actionError : null}
        onSubmit={handleUpdateNewsStatus}
        onClose={handleCloseStatusModal}
        onClearError={handleClearActionError}
      />

      {/* =====================================================
          FEEDBACK GLOBAL
      ====================================================== */}

      <Snackbar
        open={Boolean(actionSuccess)}
        autoHideDuration={4500}
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
          sx={newsStyles.feedbackAlert}
        >
          {actionSuccess}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showGlobalActionError}
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
          sx={newsStyles.feedbackAlert}
        >
          {actionError}
        </Alert>
      </Snackbar>
    </Box>
  );
}
