import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";

import type {
  DashboardRecommendation,
  DashboardRecommendationPriority,
} from "@/api/dashboardApi";

import DashboardProductImage from "../DashboardProductImage";
import { dashboardStyles } from "../dashboard.styles";

/* =========================================================
   CONSTANTES DEL COMPONENTE
========================================================= */

/*
El backend devuelve como máximo cinco recomendaciones.

El límite defensivo evita que una respuesta inesperada
genere una cantidad ilimitada de elementos visuales.
*/
const MAX_VISIBLE_RECOMMENDATIONS = 5;

/* =========================================================
   TIPOS
========================================================= */

type SmartRecommendationsProps = {
  recommendations: DashboardRecommendation[];

  generatedAt: string | null;

  generating: boolean;

  error: string | null;

  unavailable: boolean;

  hasGenerated: boolean;

  onGenerate: () => Promise<boolean>;
};

/* =========================================================
   HELPERS DE FORMATO
========================================================= */

function formatGrams(value: number): string {
  return `${new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)} g`;
}

/*
La fecha se presenta utilizando explícitamente
la zona horaria oficial del sistema.
*/
function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Montevideo",
  }).format(date);
}

function getPriorityLabel(
  priority: DashboardRecommendationPriority,
): string {
  const labels: Record<
    DashboardRecommendationPriority,
    string
  > = {
    ALTA: "Prioridad alta",
    MEDIA: "Prioridad media",
    BAJA: "Prioridad baja",
  };

  return labels[priority];
}

function getPriorityStyles(
  priority: DashboardRecommendationPriority,
) {
  if (priority === "ALTA") {
    return dashboardStyles.recommendationPriorityHigh;
  }

  if (priority === "MEDIA") {
    return dashboardStyles.recommendationPriorityMedium;
  }

  return dashboardStyles.recommendationPriorityLow;
}

/* =========================================================
   TARJETA DE RECOMENDACIÓN
========================================================= */

/*
Presenta una recomendación generada por el backend y
enriquecida por el proveedor de inteligencia artificial.

La composición replica la jerarquía de la referencia Premium:

- imagen del producto;
- nombre;
- prioridad;
- cantidad sugerida;
- justificación.

Las métricas utilizadas para calcular la recomendación no se
repiten visualmente porque ya pertenecen al análisis interno
y agregaban ruido innecesario a la tarjeta.
*/
function RecommendationCard({
  recommendation,
}: {
  recommendation: DashboardRecommendation;
}) {
  return (
    <Box
      component="li"
      sx={dashboardStyles.recommendationCard}
    >
      <Box sx={dashboardStyles.recommendationHeader}>
        <Box
          sx={dashboardStyles.recommendationProductIdentity}
        >
          <DashboardProductImage
            src={recommendation.imagenUrl}
            alt={recommendation.producto}
            variant="recommendation"
          />

          <Box
            sx={dashboardStyles.recommendationProductContent}
          >
            <Typography
              component="h3"
              sx={dashboardStyles.recommendationProductName}
            >
              {recommendation.producto}
            </Typography>

            <Chip
              size="small"
              label={getPriorityLabel(
                recommendation.prioridad,
              )}
              sx={{
                ...dashboardStyles.recommendationPriorityChip,
                ...getPriorityStyles(
                  recommendation.prioridad,
                ),
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={dashboardStyles.recommendationQuantityPanel}
      >
        <Typography
          sx={dashboardStyles.recommendationQuantityLabel}
        >
          Reposición sugerida
        </Typography>

        <Typography
          sx={dashboardStyles.recommendationQuantityValue}
        >
          {formatGrams(recommendation.cantidadSugerida)}
        </Typography>
      </Box>

      <Divider sx={dashboardStyles.recommendationDivider} />

      <Box>
        <Typography
          sx={
            dashboardStyles.recommendationJustificationLabel
          }
        >
          Justificación
        </Typography>

        <Typography
          sx={
            dashboardStyles.recommendationJustificationText
          }
        >
          {recommendation.justificacion}
        </Typography>
      </Box>
    </Box>
  );
}

/* =========================================================
   ESTADO INICIAL
========================================================= */

function InitialState() {
  return (
    <Box
      sx={dashboardStyles.recommendationsInitialState}
    >
      <Box
        aria-hidden="true"
        sx={dashboardStyles.recommendationsInitialIcon}
      >
        <AutoAwesomeRoundedIcon />
      </Box>

      <Box>
        <Typography
          sx={dashboardStyles.recommendationsInitialTitle}
        >
          Análisis disponible
        </Typography>

        <Typography
          sx={dashboardStyles.recommendationsInitialText}
        >
          Generá las recomendaciones para identificar productos
          que podrían necesitar reposición.
        </Typography>
      </Box>
    </Box>
  );
}

/* =========================================================
   ESTADO SIN RECOMENDACIONES
========================================================= */

function EmptyRecommendationsState() {
  return (
    <Box
      sx={dashboardStyles.recommendationsEmptyState}
    >
      <Box
        aria-hidden="true"
        sx={dashboardStyles.recommendationsEmptyIcon}
      >
        <CheckCircleOutlineRoundedIcon />
      </Box>

      <Typography
        sx={dashboardStyles.recommendationsEmptyTitle}
      >
        No se necesita reposición
      </Typography>

      <Typography
        sx={dashboardStyles.recommendationsEmptyText}
      >
        Ningún producto FLOR activo presenta una necesidad de
        reposición según la demanda y el stock actuales.
      </Typography>
    </Box>
  );
}

/* =========================================================
   ESTADO DE CARGA
========================================================= */

function RecommendationsSkeleton() {
  return (
    <Box
      aria-label="Generando recomendaciones inteligentes"
      sx={dashboardStyles.recommendationsLoadingList}
    >
      {Array.from({ length: 2 }).map((_, index) => (
        <Box
          key={index}
          sx={dashboardStyles.recommendationSkeletonCard}
        >
          <Box sx={dashboardStyles.recommendationHeader}>
            <Box
              sx={
                dashboardStyles.recommendationProductIdentity
              }
            >
              <Skeleton
                variant="rounded"
                width={68}
                height={68}
                sx={{
                  borderRadius: "16px",
                  flexShrink: 0,
                }}
              />

              <Box
                sx={
                  dashboardStyles.recommendationProductContent
                }
              >
                <Skeleton width={145} height={27} />

                <Skeleton
                  variant="rounded"
                  width={96}
                  height={25}
                  sx={{ borderRadius: "8px" }}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={dashboardStyles.recommendationQuantityPanel}
          >
            <Skeleton width={150} height={22} />

            <Skeleton width={48} height={36} />
          </Box>

          <Skeleton width="100%" height={1} />

          <Skeleton width={92} height={20} />

          <Skeleton width="94%" height={20} />

          <Skeleton width="76%" height={20} />
        </Box>
      ))}
    </Box>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Presenta y coordina visualmente las recomendaciones
inteligentes de reposición.

Responsabilidades:
- ejecutar la generación únicamente por acción explícita;
- mostrar loading sin bloquear el resto del Dashboard;
- conservar recomendaciones anteriores durante una actualización;
- diferenciar indisponibilidad temporal y errores generales;
- presentar hasta cinco recomendaciones;
- mostrar la fotografía del producto cuando esté disponible;
- utilizar un fallback seguro cuando la imagen falte o falle;
- contemplar el resultado válido sin recomendaciones;
- informar cuándo fue realizado el último análisis;
- permitir que varias recomendaciones se presenten sin romper
  la composición general del Dashboard.

No realiza solicitudes HTTP directamente.
No calcula cantidades sugeridas.
No modifica el stock.
No ejecuta acciones automáticas de compra.
*/
export default function SmartRecommendations({
  recommendations,
  generatedAt,
  generating,
  error,
  unavailable,
  hasGenerated,
  onGenerate,
}: SmartRecommendationsProps) {
  const visibleRecommendations = recommendations.slice(
    0,
    MAX_VISIBLE_RECOMMENDATIONS,
  );

  const hasRecommendations =
    visibleRecommendations.length > 0;

  const buttonLabel = generating
    ? "Generando recomendaciones..."
    : hasGenerated
      ? "Actualizar recomendaciones"
      : "Generar recomendaciones";

  const handleGenerate = () => {
    void onGenerate();
  };

  return (
    <Box
      component="section"
      aria-labelledby="smart-recommendations-title"
      sx={dashboardStyles.recommendationsCard}
    >
      <Box sx={dashboardStyles.recommendationsHeader}>
        <Box sx={dashboardStyles.recommendationsTitleRow}>
          <Box
            aria-hidden="true"
            sx={dashboardStyles.recommendationsTitleIcon}
          >
            <AutoAwesomeRoundedIcon />
          </Box>

          <Typography
            id="smart-recommendations-title"
            component="h2"
            sx={dashboardStyles.cardTitle}
          >
            Recomendaciones inteligentes
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={dashboardStyles.recommendationsDescription}
      >
        Nuestro sistema analiza la demanda reciente, el stock
        disponible y el comportamiento de las reservas para
        ayudarte a tomar mejores decisiones.
      </Typography>

      <Button
        type="button"
        variant="contained"
        disabled={generating}
        onClick={handleGenerate}
        startIcon={
          generating ? (
            <CircularProgress
              size={18}
              thickness={5}
              color="inherit"
            />
          ) : (
            <AutoAwesomeRoundedIcon />
          )
        }
        sx={dashboardStyles.recommendationsButton}
      >
        {buttonLabel}
      </Button>

      {generatedAt ? (
        <Typography
          aria-live="polite"
          sx={dashboardStyles.recommendationsGeneratedAt}
        >
          Último análisis: {formatDateTime(generatedAt)}
        </Typography>
      ) : null}

      {error ? (
        <Alert
          severity={unavailable ? "warning" : "error"}
          sx={dashboardStyles.recommendationsAlert}
        >
          {unavailable
            ? "Las recomendaciones inteligentes no están disponibles temporalmente. El resto del Dashboard continúa funcionando normalmente."
            : error}
        </Alert>
      ) : null}

      <Box
        aria-live="polite"
        aria-busy={generating}
        sx={dashboardStyles.recommendationsResults}
      >
        {!hasGenerated &&
        !generating &&
        !hasRecommendations ? (
          <InitialState />
        ) : null}

        {generating && !hasRecommendations ? (
          <RecommendationsSkeleton />
        ) : null}

        {hasGenerated &&
        !generating &&
        !hasRecommendations ? (
          <EmptyRecommendationsState />
        ) : null}

        {hasRecommendations ? (
          <Box
            component="ol"
            sx={dashboardStyles.recommendationsList}
          >
            {visibleRecommendations.map(
              (recommendation) => (
                <RecommendationCard
                  key={recommendation.productoId}
                  recommendation={recommendation}
                />
              ),
            )}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}