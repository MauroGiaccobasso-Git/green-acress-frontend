"use client";

import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import {
  Box,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import type { SyntheticEvent } from "react";

import { memberReservationsStyles as styles } from "../memberReservations.styles";

/* =========================================================
   TIPOS
========================================================= */

export type MemberReservationsTab =
  | "active"
  | "history";

type MemberReservationsTabsProps = {
  activeTab: MemberReservationsTab;

  activeCount: number;

  historyCount: number;

  onChange: (
    tab: MemberReservationsTab,
  ) => void;
};

/* =========================================================
   COMPONENTES INTERNOS
========================================================= */

type ReservationTabLabelProps = {
  label: string;

  count: number;

  icon: React.ReactNode;
};

/*
Construye el contenido visual de cada pestaña
sin duplicar su estructura.
*/
function ReservationTabLabel({
  label,
  count,
  icon,
}: ReservationTabLabelProps) {
  return (
    <Box sx={styles.tabLabel}>
      <Box
        aria-hidden="true"
        sx={styles.tabIcon}
      >
        {icon}
      </Box>

      <Typography
        component="span"
        sx={styles.tabText}
      >
        {label}
      </Typography>

      <Box
        component="span"
        data-role="tab-count"
        sx={styles.tabCount}
      >
        {count}
      </Box>
    </Box>
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Permite alternar entre las reservas activas
y el historial personal del socio.

Responsabilidades:

- presentar ambas categorías funcionales;
- informar la cantidad disponible;
- comunicar el cambio al container;
- mantener semántica accesible de pestañas.

No filtra reservas.
No modifica estados.
No realiza solicitudes HTTP.
No incorpora PENDIENTE como sección independiente.
*/
export function MemberReservationsTabs({
  activeTab,
  activeCount,
  historyCount,
  onChange,
}: MemberReservationsTabsProps) {
  const handleChange = (
    _event: SyntheticEvent,
    nextTab: MemberReservationsTab,
  ): void => {
    onChange(nextTab);
  };

  return (
    <Box
      component="nav"
      aria-label="Categorías de reservas"
      sx={styles.tabsCard}
    >
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="Reservas activas e historial"
        variant="fullWidth"
        sx={styles.tabs}
      >
        <Tab
          value="active"
          disableRipple
          aria-controls="member-active-reservations-panel"
          label={
            <ReservationTabLabel
              label="Activas"
              count={activeCount}
              icon={<Inventory2RoundedIcon />}
            />
          }
          sx={styles.tab}
        />

        <Tab
          value="history"
          disableRipple
          aria-controls="member-reservations-history-panel"
          label={
            <ReservationTabLabel
              label="Historial"
              count={historyCount}
              icon={<HistoryRoundedIcon />}
            />
          }
          sx={styles.tab}
        />
      </Tabs>
    </Box>
  );
}