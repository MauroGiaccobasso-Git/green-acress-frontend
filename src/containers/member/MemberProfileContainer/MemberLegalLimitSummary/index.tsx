import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import {
  Box,
  Chip,
  Typography,
} from "@mui/material";

import type {
  MemberLegalLimitSummary as MemberLegalLimitSummaryData,
} from "@/api/sociosApi";

import {
  memberProfileLegalColors,
  memberProfileStyles as styles,
} from "../memberProfile.styles";

/* =========================================================
   TIPOS
========================================================= */

type MemberLegalLimitSummaryProps = {
  summary: MemberLegalLimitSummaryData;
};

type LegalMetricTone =
  | "total"
  | "withdrawn"
  | "reserved"
  | "available";

type LegalMetricProps = {
  label: string;
  value: number;
  tone: LegalMetricTone;
};

/* =========================================================
   CONSTANTES
========================================================= */

const metricValueStyles = {
  total: styles.limitTotalValue,
  withdrawn: styles.withdrawnValue,
  reserved: styles.reservedValue,
  available: styles.availableValue,
} as const;

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

/*
Mantiene un valor dentro del rango indicado.

Se utiliza únicamente para proteger
la representación visual de porcentajes.
*/
function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    Math.max(value, minimum),
    maximum,
  );
}

/*
Normaliza valores numéricos para evitar
que un dato no finito rompa la interfaz.

No reemplaza validaciones del backend
ni modifica las reglas del dominio.
*/
function normalizeGrams(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(value, 0);
}

/*
Formatea cantidades en gramos según
la configuración regional uruguaya.

Mantiene hasta dos decimales cuando
la cantidad recibida es fraccionada.
*/
function formatGrams(value: number): string {
  const normalizedValue =
    normalizeGrams(value);

  const formattedValue =
    new Intl.NumberFormat("es-UY", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(normalizedValue);

  return `${formattedValue} g`;
}

/*
Formatea porcentajes sin agregar
precisión visual innecesaria.
*/
function formatPercentage(
  value: number,
): string {
  return new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

/* =========================================================
   MÉTRICA INDIVIDUAL
========================================================= */

/*
Representa una métrica del resumen legal.

La variante visual se determina mediante
un tono semántico conocido por el módulo.
*/
function LegalMetric({
  label,
  value,
  tone,
}: LegalMetricProps) {
  return (
    <Box sx={styles.legalMetricCard}>
      <Typography
        component="span"
        sx={styles.legalMetricLabel}
      >
        {label}
      </Typography>

      <Typography
        component="strong"
        sx={{
          ...styles.legalMetricValue(
            "inherit",
          ),
          ...metricValueStyles[tone],
        }}
      >
        {formatGrams(value)}
      </Typography>
    </Box>
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Presenta el resumen mensual calculado
por backend para el socio autenticado.

Responsabilidades:

- mostrar el límite total;
- mostrar gramos retirados;
- mostrar gramos reservados;
- mostrar gramos disponibles;
- representar visualmente la distribución;
- informar el porcentaje utilizado.

No recalcula el límite disponible.
No consulta ventas ni reservas.
No aplica reglas legales en frontend.
*/
export function MemberLegalLimitSummary({
  summary,
}: MemberLegalLimitSummaryProps) {
  /*
  Los cuatro valores visibles provienen
  directamente del contrato del backend.
  */
  const legalLimit = normalizeGrams(
    summary.limite_gramos,
  );

  const withdrawnGrams = normalizeGrams(
    summary.gramos_retirados,
  );

  const reservedGrams = normalizeGrams(
    summary.gramos_reservados,
  );

  const availableGrams = normalizeGrams(
    summary.gramos_disponibles,
  );

  /*
  Esta suma se utiliza únicamente para
  construir el indicador visual.

  El valor disponible continúa siendo
  exclusivamente el informado por backend.
  */
  const usedGrams =
    withdrawnGrams + reservedGrams;

  const withdrawnPercentage =
    legalLimit > 0
      ? clamp(
          (withdrawnGrams / legalLimit) *
            100,
          0,
          100,
        )
      : 0;

  const reservedPercentage =
    legalLimit > 0
      ? clamp(
          (reservedGrams / legalLimit) *
            100,
          0,
          100 - withdrawnPercentage,
        )
      : 0;

  const usedPercentage =
    legalLimit > 0
      ? clamp(
          (usedGrams / legalLimit) * 100,
          0,
          100,
        )
      : 0;

  return (
    <Box
      component="section"
      aria-labelledby="member-legal-limit-title"
      sx={styles.sectionCard}
    >
      <Box sx={styles.sectionHeader}>
        <Box
          aria-hidden="true"
          sx={styles.sectionIcon}
        >
          <BalanceOutlinedIcon />
        </Box>

        <Box sx={styles.sectionHeaderCopy}>
          <Typography
            id="member-legal-limit-title"
            component="h2"
            sx={styles.sectionTitle}
          >
            Límite legal mensual
          </Typography>

          <Typography
            component="p"
            sx={styles.sectionSubtitle}
          >
            Resumen vigente del mes según la zona
            horaria de Uruguay.
          </Typography>
        </Box>
      </Box>

      <Box sx={styles.legalMetricsGrid}>
        <LegalMetric
          label="Límite total"
          value={legalLimit}
          tone="total"
        />

        <LegalMetric
          label="Gramos retirados"
          value={withdrawnGrams}
          tone="withdrawn"
        />

        <LegalMetric
          label="Gramos reservados"
          value={reservedGrams}
          tone="reserved"
        />

        <LegalMetric
          label="Gramos disponibles"
          value={availableGrams}
          tone="available"
        />
      </Box>

      <Box sx={styles.usageSection}>
        <Box sx={styles.usageHeader}>
          <Box sx={styles.usageCopy}>
            <Typography
              component="h3"
              sx={styles.usageTitle}
            >
              Uso de tu límite mensual
            </Typography>

            <Typography
              component="p"
              sx={styles.usageDescription}
            >
              Distribución actual de tu límite legal
              de {formatGrams(legalLimit)}.
            </Typography>
          </Box>

          <Chip
            size="small"
            label={`${formatPercentage(
              usedPercentage,
            )}% utilizado`}
            sx={styles.usagePercentageChip}
          />
        </Box>

        <Box sx={styles.progressWrapper}>
          <Box
            role="progressbar"
            aria-label="Uso del límite legal mensual"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={usedPercentage}
            aria-valuetext={`${formatGrams(
              usedGrams,
            )} utilizados de ${formatGrams(
              legalLimit,
            )}`}
            sx={styles.progressTrack}
          >
            <Box
              aria-hidden="true"
              sx={styles.progressSegment(
                withdrawnPercentage,
                memberProfileLegalColors.withdrawn,
              )}
            />

            <Box
              aria-hidden="true"
              sx={styles.progressSegment(
                reservedPercentage,
                memberProfileLegalColors.reserved,
              )}
            />

            <Box
              aria-hidden="true"
              sx={
                styles.progressAvailableSegment
              }
            />
          </Box>

          <Box sx={styles.progressScale}>
            <Typography
              component="span"
              sx={styles.progressScaleText}
            >
              0 g
            </Typography>

            <Typography
              component="span"
              sx={styles.progressScaleText}
            >
              {formatGrams(legalLimit)}
            </Typography>
          </Box>
        </Box>

        <Box sx={styles.progressLegend}>
          <Box sx={styles.progressLegendItem}>
            <Box
              aria-hidden="true"
              sx={
                styles.withdrawnLegendDot
              }
            />

            <Typography
              component="span"
              sx={{
                color: "inherit",
                fontSize: "inherit",
                fontWeight: "inherit",
                lineHeight: "inherit",
              }}
            >
              Retirados:{" "}
              {formatGrams(
                withdrawnGrams,
              )}
            </Typography>
          </Box>

          <Box sx={styles.progressLegendItem}>
            <Box
              aria-hidden="true"
              sx={
                styles.reservedLegendDot
              }
            />

            <Typography
              component="span"
              sx={{
                color: "inherit",
                fontSize: "inherit",
                fontWeight: "inherit",
                lineHeight: "inherit",
              }}
            >
              Reservados:{" "}
              {formatGrams(
                reservedGrams,
              )}
            </Typography>
          </Box>

          <Box sx={styles.progressLegendItem}>
            <Box
              aria-hidden="true"
              sx={
                styles.availableLegendDot
              }
            />

            <Typography
              component="span"
              sx={{
                color: "inherit",
                fontSize: "inherit",
                fontWeight: "inherit",
                lineHeight: "inherit",
              }}
            >
              Disponibles:{" "}
              {formatGrams(
                availableGrams,
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}