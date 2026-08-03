"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import type { News, NewsStatus } from "@/api/newsApi";
import { AppPagination } from "@/components/common/Pagination";
import { colors } from "@/theme/colors";

import { newsStyles } from "../news.styles";

type NewsListPanelProps = {
  news: News[];
  totalNews: number;
  selectedNewsId: number | null;
  loading: boolean;
  publishing: boolean;
  hasActiveCriteria: boolean;
  searchValue: string;
  activeFiltersCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  onCreateNews: () => void;
  onSelectNews: (newsId: number) => void;
  onPageChange: (page: number) => void;
};

/* =========================================================
   FORMATEADORES
========================================================= */

const publicationDateFormatter = new Intl.DateTimeFormat("es-UY", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "America/Montevideo",
});

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

function getNewsInitials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "NV";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0].charAt(0)}${words.at(-1)?.charAt(0) ?? ""}`.toUpperCase();
}

function getNewsCountLabel(total: number): string {
  return `${total} ${total === 1 ? "novedad" : "novedades"}`;
}

function getPaginationRange(page: number, pageSize: number, total: number) {
  if (total === 0) {
    return {
      from: 0,
      to: 0,
    };
  }

  return {
    from: (page - 1) * pageSize + 1,
    to: Math.min(page * pageSize, total),
  };
}

function formatPublicationDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return publicationDateFormatter.format(date);
}

function formatAuthorLabel(email: string): string {
  const localPart = email.split("@")[0]?.trim();

  if (!localPart) {
    return email;
  }

  const normalizedWords = localPart
    .split(/[._-]+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (normalizedWords.length === 0) {
    return email;
  }

  return normalizedWords
    .map(
      (word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(" ");
}

/* =========================================================
   COMPONENTES INTERNOS
========================================================= */

function NewsStatusChip({ status }: { status: NewsStatus }) {
  return (
    <Chip
      size="small"
      label={status === "ACTIVA" ? "Activa" : "Inactiva"}
      sx={newsStyles.statusChip(status)}
    />
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Panel Master del módulo administrativo de Novedades.

Responsabilidades:
- presentar el encabezado operativo del listado;
- administrar visualmente búsqueda, filtros y publicación;
- representar el listado paginado;
- comunicar selección y cambios de página;
- resolver cargas y estados vacíos;
- mantener una semántica accesible.

No realiza solicitudes HTTP.
No modifica novedades.
No contiene reglas críticas de negocio.
*/
export function NewsListPanel({
  news,
  totalNews,
  selectedNewsId,
  loading,
  publishing,
  hasActiveCriteria,
  searchValue,
  activeFiltersCount,
  page,
  pageSize,
  totalPages,
  onSearchChange,
  onOpenFilters,
  onCreateNews,
  onSelectNews,
  onPageChange,
}: NewsListPanelProps) {
  const paginationRange = getPaginationRange(page, pageSize, totalNews);

  const totalLabel = getNewsCountLabel(totalNews);

  const rangeLabel =
    totalNews > 0
      ? `Mostrando ${paginationRange.from}–${paginationRange.to} de ${totalLabel}`
      : "Sin novedades para mostrar";

  const showInitialLoading = loading && news.length === 0;

  const showEmptyState = !loading && news.length === 0;

  return (
    <Box
      component="section"
      aria-labelledby="news-list-title"
      aria-busy={loading}
      sx={{
        ...newsStyles.panel,
        ...newsStyles.listPanel,
      }}
    >
      {/* =====================================================
          ENCABEZADO Y ACCIONES
      ====================================================== */}

      <Box sx={newsStyles.listPanelHeader}>
        <Box sx={newsStyles.panelHeaderContent}>
          <Typography
            id="news-list-title"
            component="h2"
            sx={newsStyles.panelTitle}
          >
            Listado de novedades
          </Typography>

          <Typography aria-live="polite" sx={newsStyles.panelHint}>
            {rangeLabel}
          </Typography>
        </Box>

        <Box sx={newsStyles.toolbar}>
          <TextField
            fullWidth
            size="small"
            value={searchValue}
            placeholder="Buscar por título..."
            aria-label="Buscar novedades por título"
            onChange={(event) => onSearchChange(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={newsStyles.searchField}
          />

          <Button
            type="button"
            variant="outlined"
            startIcon={<TuneRoundedIcon />}
            onClick={onOpenFilters}
            sx={newsStyles.filterButton}
          >
            Filtros
            {activeFiltersCount > 0 && (
              <Box
                component="span"
                aria-label={`${activeFiltersCount} filtro activo`}
                sx={newsStyles.filterCounter}
              >
                {activeFiltersCount}
              </Box>
            )}
          </Button>

          <Button
            type="button"
            variant="contained"
            startIcon={<AddRoundedIcon />}
            disabled={publishing}
            onClick={onCreateNews}
            sx={newsStyles.createButton}
          >
            Nueva novedad
          </Button>
        </Box>
      </Box>

      {/* =====================================================
          ACTUALIZACIÓN DEL LISTADO
      ====================================================== */}

      {loading && news.length > 0 && (
        <LinearProgress
          aria-label="Actualizando listado de novedades"
          sx={{
            height: 3,
            backgroundColor: alpha(colors.brand.primary, 0.08),

            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
            },
          }}
        />
      )}

      {/* =====================================================
          TABLA
      ====================================================== */}

      <Box sx={newsStyles.tableViewport}>
        <Box sx={newsStyles.tableContent}>
          <Box aria-hidden="true" sx={newsStyles.tableHeader}>
            <Typography sx={newsStyles.tableHeaderCell}>Título</Typography>

            <Typography sx={newsStyles.tableHeaderCell}>Estado</Typography>

            <Typography sx={newsStyles.tableHeaderCell}>Publicación</Typography>

            <Typography sx={newsStyles.tableHeaderCell}>Autor</Typography>

            <Typography sx={newsStyles.tableHeaderCell}>
              Destinatarios
            </Typography>

            <Box />
          </Box>

          {showInitialLoading && (
            <Box
              role="status"
              aria-label="Cargando novedades"
              sx={newsStyles.stateContainer}
            >
              <CircularProgress size={32} thickness={4} aria-hidden="true" />

              <Typography sx={newsStyles.loadingText}>
                Cargando novedades...
              </Typography>
            </Box>
          )}

          {showEmptyState && (
            <Box sx={newsStyles.stateContainer}>
              <Box sx={newsStyles.stateIconSurface}>
                <CampaignOutlinedIcon />
              </Box>

              <Typography component="h3" sx={newsStyles.stateTitle}>
                {hasActiveCriteria
                  ? "No encontramos novedades"
                  : "Todavía no hay novedades publicadas"}
              </Typography>

              <Typography sx={newsStyles.stateDescription}>
                {hasActiveCriteria
                  ? "Revisá la búsqueda o modificá el filtro de estado aplicado."
                  : "Las novedades que publique el administrador aparecerán en este listado."}
              </Typography>
            </Box>
          )}

          {news.length > 0 && (
            <Box
              role="group"
              aria-label="Novedades registradas"
              sx={newsStyles.listBody}
            >
              {news.map((item) => {
                const isSelected = selectedNewsId === item.id;

                const isInactive = item.estado === "INACTIVA";

                const authorLabel = formatAuthorLabel(item.usuario.email);

                return (
                  <ButtonBase
                    key={item.id}
                    component="button"
                    type="button"
                    disableRipple
                    disabled={loading}
                    aria-pressed={isSelected}
                    aria-label={`Ver detalle de la novedad ${item.titulo}`}
                    onClick={() => onSelectNews(item.id)}
                    sx={{
                      ...newsStyles.tableRow,
                      ...(isSelected ? newsStyles.tableRowSelected : {}),
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    {/* TÍTULO Y CONTENIDO */}

                    <Box sx={newsStyles.titleCell}>
                      <Avatar
                        aria-hidden="true"
                        sx={newsStyles.newsAvatar(isInactive)}
                      >
                        {getNewsInitials(item.titulo)}
                      </Avatar>

                      <Box sx={newsStyles.titleTextContainer}>
                        <Typography
                          component="span"
                          title={item.titulo}
                          sx={newsStyles.newsTitle}
                        >
                          {item.titulo}
                        </Typography>

                        <Typography
                          component="span"
                          title={item.contenido}
                          sx={newsStyles.newsPreview}
                        >
                          {item.contenido}
                        </Typography>
                      </Box>
                    </Box>

                    {/* ESTADO */}

                    <Box sx={newsStyles.statusCell}>
                      <NewsStatusChip status={item.estado} />
                    </Box>

                    {/* PUBLICACIÓN */}

                    <Typography component="span" sx={newsStyles.tableValue}>
                      {formatPublicationDate(item.fecha_creacion)}
                    </Typography>

                    {/* AUTOR */}

                    <Typography
                      component="span"
                      title={item.usuario.email}
                      sx={newsStyles.tableValue}
                    >
                      {authorLabel}
                    </Typography>

                    {/* DESTINATARIOS */}

                    <Typography
                      component="span"
                      aria-label={`${item.cantidadNotificaciones} destinatarios`}
                      sx={newsStyles.notificationCount}
                    >
                      {item.cantidadNotificaciones}
                    </Typography>

                    {/* ACCIÓN */}

                    <Box aria-hidden="true" sx={newsStyles.rowAction}>
                      <ChevronRightRoundedIcon />
                    </Box>
                  </ButtonBase>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>

      {/* =====================================================
          PAGINACIÓN
      ====================================================== */}

      {totalNews > 0 && (
        <Box sx={newsStyles.listFooter}>
          <Box sx={newsStyles.paginationWrapper}>
            <AppPagination
              page={page}
              totalPages={totalPages}
              onChange={onPageChange}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
