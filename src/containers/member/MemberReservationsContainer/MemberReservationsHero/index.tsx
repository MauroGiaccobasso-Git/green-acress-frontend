import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import {
  Box,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import { memberReservationsStyles as styles } from "../memberReservations.styles";

/* =========================================================
   TIPOS
========================================================= */

type MemberReservationsHeroProps = {
  readyToCollectCount: number;
};

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

/*
Construye una etiqueta natural para
las reservas confirmadas disponibles
para retirar.
*/
function getReadyToCollectLabel(
  count: number,
): string {
  if (count === 1) {
    return "1 reserva lista para retirar";
  }

  return `${count} reservas listas para retirar`;
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Introduce visualmente el módulo Mis reservas.

Responsabilidades:

- explicar el propósito de la sección;
- destacar las reservas listas para retirar;
- mantener continuidad con el Portal Socio;
- aplicar el lenguaje visual Premium aprobado.

PENDIENTE no se utiliza como métrica principal
porque corresponde a un estado técnico transitorio.

No realiza solicitudes HTTP.
No modifica reservas.
No incorpora acciones administrativas.
*/
export function MemberReservationsHero({
  readyToCollectCount,
}: MemberReservationsHeroProps) {
  return (
    <Paper
      component="section"
      aria-labelledby="member-reservations-hero-title"
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
        sx={styles.heroIcon}
      >
        <Box sx={styles.heroIconRing}>
          <EventAvailableRoundedIcon />
        </Box>
      </Box>

      <Box sx={styles.heroCopy}>
        <Typography
          id="member-reservations-hero-title"
          component="h2"
          sx={styles.heroTitle}
        >
          Mis reservas
        </Typography>

        <Typography
          component="p"
          sx={styles.heroDescription}
        >
          Consultá tus reservas, seguí su estado
          y conocé los detalles de cada solicitud
          desde el Portal Socio.
        </Typography>

        <Chip
          size="small"
          variant="outlined"
          icon={
            <FiberManualRecordRoundedIcon
              aria-hidden="true"
            />
          }
          label={getReadyToCollectLabel(
            readyToCollectCount,
          )}
          sx={styles.heroCountChip}
        />
      </Box>
    </Paper>
  );
}