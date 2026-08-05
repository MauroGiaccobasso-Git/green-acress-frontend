import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import type { MemberNews } from "@/api/newsApi";

import { memberNewsStyles as styles } from "../memberNews.styles";

/* =========================================================
   TIPOS
========================================================= */

type MemberNewsCardProps = {
  news: MemberNews;

  /*
  Identifica exclusivamente la primera novedad
  del listado ordenado por backend.
  */
  isLatest?: boolean;
};

/* =========================================================
   CONSTANTES
========================================================= */

const MEMBER_PORTAL_TIME_ZONE =
  "America/Montevideo";

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

/*
Convierte el valor recibido desde backend
en una fecha válida para presentación.

Centralizar esta operación evita repetir
validaciones entre los distintos formatos.
*/
function parsePublicationDate(
  value: string,
): Date | null {
  const publicationDate = new Date(value);

  if (Number.isNaN(publicationDate.getTime())) {
    return null;
  }

  return publicationDate;
}

/*
Presenta la fecha completa utilizada
como información principal de la novedad.
*/
function formatLongPublicationDate(
  value: string,
): string {
  const publicationDate =
    parsePublicationDate(value);

  if (!publicationDate) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: MEMBER_PORTAL_TIME_ZONE,
  }).format(publicationDate);
}

/*
Presenta la fecha compacta utilizada
dentro del badge visual complementario.
*/
function formatShortPublicationDate(
  value: string,
): string {
  const publicationDate =
    parsePublicationDate(value);

  if (!publicationDate) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: MEMBER_PORTAL_TIME_ZONE,
  }).format(publicationDate);
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Representa una novedad activa dentro
del Portal Socio.

Responsabilidades:

- presentar la fecha de publicación;
- presentar el título y contenido;
- identificar visualmente la última novedad;
- preservar saltos de línea;
- mantener una estructura accesible;
- aplicar el diseño Premium aprobado.

No realiza solicitudes HTTP.
No filtra ni ordena novedades.
No interpreta categorías inexistentes.
No expone información administrativa.
*/
export function MemberNewsCard({
  news,
  isLatest = false,
}: MemberNewsCardProps) {
  const longPublicationDate =
    formatLongPublicationDate(
      news.fecha_creacion,
    );

  const shortPublicationDate =
    formatShortPublicationDate(
      news.fecha_creacion,
    );

  return (
    <Paper
      component="article"
      elevation={0}
      data-latest={isLatest ? "true" : "false"}
      sx={styles.newsCard}
    >
      {isLatest ? (
        <Box
          aria-label="Última novedad publicada"
          sx={styles.latestBadge}
        >
          <StarRoundedIcon aria-hidden="true" />

          <Typography
            component="span"
            sx={styles.latestBadgeText}
          >
            Última novedad
          </Typography>
        </Box>
      ) : null}

      <Box
        aria-hidden="true"
        sx={styles.newsIconWrapper}
      >
        <ArticleOutlinedIcon />
      </Box>

      <Box sx={styles.newsCardContent}>
        <Box sx={styles.newsMetaRow}>
          <Box sx={styles.newsDateRow}>
            <CalendarMonthRoundedIcon
              aria-hidden="true"
              sx={styles.newsDateIcon}
            />

            <Typography
              component="time"
              dateTime={news.fecha_creacion}
              sx={styles.newsDate}
            >
              {longPublicationDate}
            </Typography>
          </Box>

          <Chip
            size="small"
            icon={
              <CalendarMonthRoundedIcon
                aria-hidden="true"
              />
            }
            label={shortPublicationDate}
            aria-label={`Fecha de publicación: ${longPublicationDate}`}
            sx={styles.newsDateBadge}
          />
        </Box>

        <Typography
          component="h2"
          sx={styles.newsTitle}
        >
          {news.titulo}
        </Typography>

        <Typography
          component="p"
          sx={styles.newsContent}
        >
          {news.contenido}
        </Typography>
      </Box>
    </Paper>
  );
}