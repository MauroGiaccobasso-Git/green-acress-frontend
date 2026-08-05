"use client";

import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";

import type { MemberNews } from "@/api/newsApi";

import { MemberNewsCard } from "../MemberNewsCard";
import { memberNewsStyles as styles } from "../memberNews.styles";

/* =========================================================
   TIPOS
========================================================= */

type MemberNewsFeedProps = {
  news: MemberNews[];

  isLoading: boolean;

  errorMessage: string | null;

  onRetry: () => void;
};

/* =========================================================
   CONSTANTES
========================================================= */

const MEMBER_NEWS_SKELETON_COUNT = 4;

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

/*
Construye una etiqueta natural para
la cantidad de novedades activas visibles.
*/
function getNewsCountLabel(
  newsCount: number,
): string {
  if (newsCount === 1) {
    return "1 novedad activa";
  }

  return `${newsCount} novedades activas`;
}

/* =========================================================
   PRESENTACIÓN DEL MÓDULO
========================================================= */

type MemberNewsHeroProps = {
  newsCount: number;
};

/*
Introduce la sección y aporta jerarquía visual
sin agregar funcionalidades ni información
ajena al contrato del backend.
*/
function MemberNewsHero({
  newsCount,
}: MemberNewsHeroProps) {
  return (
    <Paper
      component="section"
      aria-labelledby="member-news-hero-title"
      elevation={0}
      sx={styles.heroCard}
    >
      <Box
        aria-hidden="true"
        sx={styles.heroDecorationPrimary}
      />

      <Box
        aria-hidden="true"
        sx={styles.heroDecorationSecondary}
      />

      <Box
        aria-hidden="true"
        sx={styles.heroIllustration}
      >
        <Box sx={styles.heroIllustrationRing}>
          <NewspaperRoundedIcon />
        </Box>
      </Box>

      <Box sx={styles.heroCopy}>
        <Typography
          id="member-news-hero-title"
          component="h2"
          sx={styles.heroTitle}
        >
          Novedades del club
        </Typography>

        <Typography
          component="p"
          sx={styles.heroDescription}
        >
          Enterate de las últimas noticias,
          comunicados importantes y actualizaciones
          que compartimos para nuestra comunidad.
        </Typography>

        <Chip
          size="small"
          variant="outlined"
          icon={
            <FiberManualRecordRoundedIcon
              aria-hidden="true"
            />
          }
          label={getNewsCountLabel(newsCount)}
          sx={styles.newsCountChip}
        />
      </Box>
    </Paper>
  );
}

/* =========================================================
   ESTADO DE CARGA
========================================================= */

/*
Replica la macroestructura definitiva
para reducir saltos de layout durante
la primera consulta.
*/
function MemberNewsLoadingState() {
  return (
    <Box
      role="status"
      aria-label="Cargando novedades del club"
      aria-busy="true"
      sx={styles.newsFeed}
    >
      <Box
        aria-hidden="true"
        sx={styles.heroSkeletonCard}
      >
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={styles.heroSkeletonIllustration}
        />

        <Box sx={styles.heroSkeletonCopy}>
          <Skeleton
            animation="wave"
            width="48%"
            height={42}
          />

          <Skeleton
            animation="wave"
            width="92%"
            height={24}
          />

          <Skeleton
            animation="wave"
            width="74%"
            height={24}
          />

          <Skeleton
            variant="rounded"
            animation="wave"
            width={150}
            height={36}
          />
        </Box>
      </Box>

      <Box sx={styles.newsList}>
        {Array.from({
          length: MEMBER_NEWS_SKELETON_COUNT,
        }).map((_, index) => (
          <Box
            key={index}
            aria-hidden="true"
            sx={styles.newsSkeletonCard}
          >
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={styles.newsSkeletonIcon}
            />

            <Box sx={styles.newsSkeletonContent}>
              <Skeleton
                animation="wave"
                width={170}
                height={24}
              />

              <Skeleton
                animation="wave"
                width="58%"
                height={32}
              />

              <Box sx={styles.newsSkeletonText}>
                <Skeleton
                  animation="wave"
                  width="100%"
                  height={22}
                />

                <Skeleton
                  animation="wave"
                  width="76%"
                  height={22}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* =========================================================
   ESTADO DE ERROR
========================================================= */

type MemberNewsErrorStateProps = {
  message: string;

  isRetrying: boolean;

  onRetry: () => void;
};

/*
Se utiliza únicamente cuando todavía
no existe información válida para mostrar.
*/
function MemberNewsErrorState({
  message,
  isRetrying,
  onRetry,
}: MemberNewsErrorStateProps) {
  return (
    <Box
      role="alert"
      aria-labelledby="member-news-error-title"
      sx={styles.newsStateCard}
    >
      <Box
        aria-hidden="true"
        sx={[
          styles.newsStateIcon,
          styles.newsErrorIcon,
        ]}
      >
        <ErrorOutlineRoundedIcon />
      </Box>

      <Typography
        id="member-news-error-title"
        component="h2"
        sx={styles.newsStateTitle}
      >
        No pudimos cargar las novedades
      </Typography>

      <Typography
        component="p"
        sx={styles.newsStateDescription}
      >
        {message}
      </Typography>

      <Button
        type="button"
        variant="contained"
        startIcon={<RefreshRoundedIcon />}
        onClick={onRetry}
        disabled={isRetrying}
        sx={styles.retryButton}
      >
        {isRetrying
          ? "Reintentando..."
          : "Reintentar"}
      </Button>
    </Box>
  );
}

/* =========================================================
   ESTADO VACÍO
========================================================= */

/*
Representa una consulta exitosa sin
novedades activas disponibles.
*/
function EmptyMemberNewsState() {
  return (
    <Box
      role="status"
      aria-labelledby="member-news-empty-title"
      sx={styles.newsStateCard}
    >
      <Box
        aria-hidden="true"
        sx={styles.newsStateIcon}
      >
        <ArticleOutlinedIcon />
      </Box>

      <Typography
        id="member-news-empty-title"
        component="h2"
        sx={styles.newsStateTitle}
      >
        No hay novedades por el momento
      </Typography>

      <Typography
        component="p"
        sx={styles.newsStateDescription}
      >
        Cuando el club publique nueva información,
        vas a encontrarla disponible en esta sección.
      </Typography>
    </Box>
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Presenta el feed público de novedades.

Responsabilidades:

- introducir visualmente el módulo;
- informar la cantidad visible;
- resolver carga inicial;
- resolver error bloqueante;
- resolver estado vacío;
- destacar la novedad más reciente;
- mantener el orden recibido del backend.

No realiza solicitudes HTTP.
No filtra ni reordena resultados.
No incorpora paginación ni filtros.
No expone información administrativa.
*/
export function MemberNewsFeed({
  news,
  isLoading,
  errorMessage,
  onRetry,
}: MemberNewsFeedProps) {
  const hasNews = news.length > 0;

  const isInitialLoading =
    isLoading && !hasNews;

  const hasBlockingError =
    Boolean(errorMessage) &&
    !hasNews &&
    !isLoading;

  const showSuccessfulContent =
    !isInitialLoading &&
    !hasBlockingError;

  const showEmptyState =
    showSuccessfulContent &&
    !hasNews;

  return (
    <Box
      component="section"
      aria-label="Novedades activas del club"
      aria-busy={isLoading}
      sx={styles.newsFeed}
    >
      {isInitialLoading ? (
        <MemberNewsLoadingState />
      ) : null}

      {hasBlockingError &&
      errorMessage ? (
        <MemberNewsErrorState
          message={errorMessage}
          isRetrying={isLoading}
          onRetry={onRetry}
        />
      ) : null}

      {showSuccessfulContent ? (
        <MemberNewsHero
          newsCount={news.length}
        />
      ) : null}

      {showEmptyState ? (
        <EmptyMemberNewsState />
      ) : null}

      {hasNews ? (
        <Box sx={styles.newsList}>
          {news.map((newsItem, index) => (
            <MemberNewsCard
              key={`${newsItem.fecha_creacion}-${newsItem.titulo}-${index}`}
              news={newsItem}
              isLatest={index === 0}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}