import type { ReactNode } from "react";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LocalFloristRoundedIcon from "@mui/icons-material/LocalFloristRounded";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { Box, Skeleton, Typography } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";

import type { DashboardSummary as DashboardSummaryData } from "@/api/dashboardApi";

import { dashboardStyles } from "../dashboard.styles";

/* =========================================================
   TIPOS
========================================================= */

type DashboardSummaryProps = {
  summary: DashboardSummaryData | null;

  loading: boolean;
};

type SummaryCardProps = {
  icon: ReactNode;

  label: string;

  value: string;

  hint: string;

  iconStyles: SystemStyleObject<Theme>;
};

/* =========================================================
   FORMATEADORES
========================================================= */

/*
Presenta importes con el formato visual utilizado
por el sistema, evitando decimales innecesarios.

Ejemplos:
$0
$1.250
$18.500
*/
function formatCurrency(value: number): string {
  const formattedValue = new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return `$${formattedValue}`;
}

/*
Presenta gramos con un máximo de un decimal.

Ejemplos:
0 g
4,5 g
25 g
*/
function formatGrams(value: number): string {
  const formattedValue = new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);

  return `${formattedValue} g`;
}

/*
Presenta cantidades enteras respetando
la configuración regional del sistema.
*/
function formatInteger(value: number): string {
  return new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/* =========================================================
   TARJETA KPI
========================================================= */

function SummaryCard({
  icon,
  label,
  value,
  hint,
  iconStyles,
}: SummaryCardProps) {
  return (
    <Box
      role="group"
      aria-label={`${label}: ${value}. ${hint}`}
      sx={dashboardStyles.summaryCard}
    >
      <Box aria-hidden="true" sx={[dashboardStyles.summaryIcon, iconStyles]}>
        {icon}
      </Box>

      <Box sx={dashboardStyles.summaryContent}>
        <Typography component="p" sx={dashboardStyles.summaryLabel}>
          {label}
        </Typography>

        <Typography component="p" sx={dashboardStyles.summaryValue}>
          {value}
        </Typography>

        <Typography component="p" sx={dashboardStyles.summaryHint}>
          {hint}
        </Typography>
      </Box>
    </Box>
  );
}

/* =========================================================
   ESTADO DE CARGA
========================================================= */

/*
Replica las dimensiones definitivas de las KPI.

Los tamaños responsive coinciden con las tarjetas reales,
evitando movimientos del contenido cuando llega la respuesta.
*/
function SummarySkeletons() {
  return (
    <Box
      component="section"
      aria-label="Cargando indicadores administrativos"
      aria-busy="true"
      sx={dashboardStyles.summaryGrid}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <Box key={index} sx={dashboardStyles.summarySkeletonCard}>
          <Skeleton
            variant="rounded"
            sx={{
              width: {
                xs: 56,
                sm: 62,
                xl: 66,
              },
              height: {
                xs: 56,
                sm: 62,
                xl: 66,
              },
              flexShrink: 0,
              borderRadius: {
                xs: "16px",
                sm: "17px",
                xl: "18px",
              },
            }}
          />

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Skeleton
              width="68%"
              sx={{
                height: {
                  xs: 19,
                  sm: 20,
                },
              }}
            />

            <Skeleton
              width="42%"
              sx={{
                mt: 0.15,
                height: {
                  xs: 38,
                  sm: 42,
                  xl: 44,
                },
              }}
            />

            <Skeleton
              width="78%"
              sx={{
                mt: 0.1,
                height: {
                  xs: 17,
                  sm: 18,
                },
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

/*
Presenta los cuatro indicadores principales.

Responsabilidades:
- renderizar datos agregados por backend;
- formatear moneda, gramos y cantidades;
- mantener una escala visual coherente con la referencia;
- conservar el layout durante la carga;
- adaptarse correctamente a desktop, tablet y mobile.

No consulta endpoints.
No calcula métricas de negocio.
No inventa valores cuando no existe información.
*/
export default function DashboardSummary({
  summary,
  loading,
}: DashboardSummaryProps) {
  if (loading && !summary) {
    return <SummarySkeletons />;
  }

  if (!summary) {
    return null;
  }

  return (
    <Box
      component="section"
      aria-label="Indicadores principales del Dashboard"
      sx={dashboardStyles.summaryGrid}
    >
      <SummaryCard
        icon={<ShoppingCartRoundedIcon />}
        label="Ventas del mes"
        value={formatInteger(summary.ventasMes)}
        hint="Operaciones registradas"
        iconStyles={dashboardStyles.summaryIconSales}
      />

      <SummaryCard
        icon={<PaymentsOutlinedIcon />}
        label="Importe vendido"
        value={formatCurrency(summary.importeVentasMes)}
        hint="Total registrado"
        iconStyles={dashboardStyles.summaryIconRevenue}
      />

      <SummaryCard
        icon={<LocalFloristRoundedIcon />}
        label="Gramos vendidos"
        value={formatGrams(summary.gramosVendidosMes)}
        hint="Durante el mes"
        iconStyles={dashboardStyles.summaryIconGrams}
      />

      <SummaryCard
        icon={<GroupsRoundedIcon />}
        label="Socios activos"
        value={formatInteger(summary.sociosActivos)}
        hint="Estado ACTIVO"
        iconStyles={dashboardStyles.summaryIconMembers}
      />
    </Box>
  );
}
