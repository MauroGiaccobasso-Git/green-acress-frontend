import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {
  Avatar,
  Box,
  Chip,
  Typography,
} from "@mui/material";

import type { MemberProfile } from "@/api/sociosApi";

import { memberProfileStyles as styles } from "../memberProfile.styles";

/* =========================================================
   TIPOS
========================================================= */

type MemberProfileHeaderProps = {
  profile: MemberProfile;
};

/* =========================================================
   CONSTANTES
========================================================= */

const memberStatusLabels: Record<
  MemberProfile["estado"],
  string
> = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
  SUSPENDIDO: "Suspendido",
};

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

/*
Genera las iniciales visibles en el avatar.

La normalización evita espacios accidentales
y mantiene una alternativa defensiva cuando
alguno de los valores no está disponible.
*/
function getMemberInitials(
  firstName: string,
  lastName: string,
): string {
  const normalizedFirstName =
    firstName.trim();

  const normalizedLastName =
    lastName.trim();

  const initials = [
    normalizedFirstName.charAt(0),
    normalizedLastName.charAt(0),
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return initials || "S";
}

/*
Construye el nombre completo visible
sin generar espacios duplicados.
*/
function getMemberFullName(
  firstName: string,
  lastName: string,
): string {
  const fullName = [
    firstName.trim(),
    lastName.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  return fullName || "Socio";
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Cabecera principal del perfil.

Responsabilidades:

- presentar la identidad del socio;
- mostrar correo electrónico;
- informar el estado funcional;
- identificar el contenido como perfil del socio.

No ejecuta operaciones.
No modifica información.
No contiene reglas del límite legal.
*/
export function MemberProfileHeader({
  profile,
}: MemberProfileHeaderProps) {
  const fullName = getMemberFullName(
    profile.nombre,
    profile.apellido,
  );

  const initials = getMemberInitials(
    profile.nombre,
    profile.apellido,
  );

  const isActive =
    profile.estado === "ACTIVO";

  return (
    <Box
      component="section"
      aria-labelledby="member-profile-name"
      sx={styles.profileCard}
    >
      <Box sx={styles.profileIdentity}>
        <Avatar
          aria-hidden="true"
          sx={styles.profileAvatar}
        >
          {initials}
        </Avatar>

        <Box sx={styles.profileCopy}>
          <Typography
            id="member-profile-name"
            component="h2"
            sx={styles.profileName}
          >
            {fullName}
          </Typography>

          <Box sx={styles.profileEmailRow}>
            <MailOutlineOutlinedIcon
              aria-hidden="true"
            />

            <Typography
              component="span"
              title={profile.email}
              sx={styles.profileEmail}
            >
              {profile.email}
            </Typography>
          </Box>

          <Box sx={styles.profileStatusRow}>
            <Chip
              size="small"
              label={
                memberStatusLabels[
                  profile.estado
                ]
              }
              icon={
                isActive ? (
                  <FiberManualRecordIcon />
                ) : undefined
              }
              sx={
                isActive
                  ? styles.activeStatusChip
                  : styles.inactiveStatusChip
              }
            />
          </Box>
        </Box>
      </Box>

      <Chip
        label="Perfil del socio"
        icon={
          <PersonOutlineOutlinedIcon />
        }
        sx={styles.profileTypeChip}
      />
    </Box>
  );
}