import type { ReactNode } from "react";

import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { memberProfileStyles as styles } from "../memberProfile.styles";

/* =========================================================
   TIPOS
========================================================= */

type QuickAccessItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
};

/* =========================================================
   ACCESOS DISPONIBLES
========================================================= */

/*
Accesos funcionales incluidos en el alcance
definitivo del Portal Socio.

Cada elemento apunta a una ruta real
del frontend y representa una funcionalidad
soportada por el MVP.
*/
const quickAccessItems: QuickAccessItem[] = [
  {
    id: "reservations",
    title: "Mis reservas",
    description:
      "Consultá tus reservas activas y tu historial.",
    href: "/socio/reservas",
    icon: <EventAvailableOutlinedIcon />,
  },
  {
    id: "available-products",
    title: "Productos disponibles",
    description:
      "Explorá los productos que podés reservar.",
    href: "/socio/reservar",
    icon: <Inventory2OutlinedIcon />,
  },
  {
    id: "news",
    title: "Novedades",
    description:
      "Mantenete al día con las noticias del club.",
    href: "/socio/novedades",
    icon: <ArticleOutlinedIcon />,
  },
];

/* =========================================================
   COMPONENTE
========================================================= */

/*
Presenta accesos directos hacia las funciones
principales disponibles para el socio.

Responsabilidades:

- reducir pasos de navegación;
- mostrar destinos relevantes;
- mantener consistencia con el menú lateral;
- utilizar rutas internas reales.

No consulta datos.
No administra estado.
No contiene reglas de negocio.
*/
export function MemberQuickAccess() {
  return (
    <Box
      component="section"
      aria-labelledby="member-quick-access-title"
      sx={styles.quickAccessCard}
    >
      <Box sx={styles.sectionHeader}>
        <Box
          aria-hidden="true"
          sx={styles.sectionIcon}
        >
          <BoltOutlinedIcon />
        </Box>

        <Box sx={styles.sectionHeaderCopy}>
          <Typography
            id="member-quick-access-title"
            component="h2"
            sx={styles.sectionTitle}
          >
            Accesos rápidos
          </Typography>

          <Typography
            component="p"
            sx={styles.sectionSubtitle}
          >
            Accedé rápidamente a las principales
            funciones de tu portal.
          </Typography>
        </Box>
      </Box>

      <Box sx={styles.quickAccessGrid}>
        {quickAccessItems.map((item) => (
          <Box
            key={item.id}
            component={Link}
            href={item.href}
            aria-label={`${item.title}. ${item.description}`}
            sx={styles.quickAccessItem}
          >
            <Box
              aria-hidden="true"
              sx={styles.quickAccessIcon}
            >
              {item.icon}
            </Box>

            <Box sx={styles.quickAccessCopy}>
              <Typography
                component="h3"
                sx={styles.quickAccessTitle}
              >
                {item.title}
              </Typography>

              <Typography
                component="p"
                sx={styles.quickAccessDescription}
              >
                {item.description}
              </Typography>
            </Box>

            <KeyboardArrowRightIcon
              aria-hidden="true"
              sx={styles.quickAccessChevron}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}