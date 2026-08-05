import type { ReactNode } from "react";

import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import {
  Box,
  Chip,
  Typography,
} from "@mui/material";

import type { MemberProfile } from "@/api/sociosApi";

import { memberProfileStyles as styles } from "../memberProfile.styles";

/* =========================================================
   TIPOS
========================================================= */

type MemberPersonalInformationProps = {
  profile: MemberProfile;
};

type PersonalInformationRowProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
};

/* =========================================================
   CONSTANTES
========================================================= */

const MEMBER_PORTAL_TIME_ZONE =
  "America/Montevideo";

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
Formatea una cédula uruguaya para mejorar
su lectura sin modificar el valor original.
*/
function formatDocument(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 8) {
    return `${digits[0]}.${digits.slice(
      1,
      4,
    )}.${digits.slice(4, 7)}-${digits[7]}`;
  }

  if (digits.length === 7) {
    return `${digits.slice(
      0,
      3,
    )}.${digits.slice(3, 6)}-${digits[6]}`;
  }

  return value;
}

/*
Formatea teléfonos uruguayos de nueve dígitos.

Cuando no existe un teléfono registrado,
muestra un estado vacío explícito.
*/
function formatPhone(
  value: string | null,
): string {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return "No registrado";
  }

  const digits =
    normalizedValue.replace(/\D/g, "");

  if (digits.length !== 9) {
    return normalizedValue;
  }

  return `${digits.slice(
    0,
    3,
  )} ${digits.slice(
    3,
    6,
  )} ${digits.slice(6)}`;
}

/*
Formatea la fecha de alta utilizando la zona
horaria oficial del sistema.

Las fechas recibidas sin componente horario
se formatean directamente para evitar que
la conversión UTC cambie accidentalmente el día.
*/
function formatMemberDate(
  value: string,
): string {
  const normalizedValue = value.trim();

  const dateOnlyMatch =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      normalizedValue,
    );

  if (dateOnlyMatch) {
    const [, year, month, day] =
      dateOnlyMatch;

    return `${day}/${month}/${year}`;
  }

  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return "Dato no disponible";
  }

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: MEMBER_PORTAL_TIME_ZONE,
  }).format(date);
}

/* =========================================================
   FILA DE INFORMACIÓN
========================================================= */

/*
Representa una fila individual del bloque
de información personal.

Mantiene uniformes:

- etiqueta de metadato;
- valor;
- icono contextual;
- comportamiento responsive.
*/
function PersonalInformationRow({
  label,
  value,
  icon,
}: PersonalInformationRowProps) {
  return (
    <Box
      component="div"
      sx={styles.personalInformationRow}
    >
      <Typography
        component="dt"
        sx={styles.personalInformationLabel}
      >
        {label}
      </Typography>

      <Box
        component="dd"
        sx={{
          ...styles.personalInformationValue,
          m: 0,
        }}
      >
        {icon ? (
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
        ) : null}

        {typeof value === "string" ? (
          <Typography
            component="span"
            sx={{
              minWidth: 0,
              color: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              lineHeight: "inherit",
              overflowWrap: "anywhere",
            }}
          >
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Presenta la información personal permitida
para el socio autenticado.

No permite editar datos.
No muestra identificadores internos.
No expone información administrativa.
*/
export function MemberPersonalInformation({
  profile,
}: MemberPersonalInformationProps) {
  const isActive =
    profile.estado === "ACTIVO";

  return (
    <Box
      component="section"
      aria-labelledby="member-personal-information-title"
      sx={styles.sectionCard}
    >
      <Box sx={styles.sectionHeader}>
        <Box
          aria-hidden="true"
          sx={styles.sectionIcon}
        >
          <PersonOutlineOutlinedIcon />
        </Box>

        <Box sx={styles.sectionHeaderCopy}>
          <Typography
            id="member-personal-information-title"
            component="h2"
            sx={styles.sectionTitle}
          >
            Información personal
          </Typography>

          <Typography
            component="p"
            sx={styles.sectionSubtitle}
          >
            Datos asociados a tu cuenta de socio.
          </Typography>
        </Box>
      </Box>

      <Box
        component="dl"
        sx={styles.personalInformationList}
      >
        <PersonalInformationRow
          label="Documento"
          value={formatDocument(
            profile.documento,
          )}
          icon={<BadgeOutlinedIcon />}
        />

        <PersonalInformationRow
          label="Nombre"
          value={profile.nombre}
        />

        <PersonalInformationRow
          label="Apellido"
          value={profile.apellido}
        />

        <PersonalInformationRow
          label="Teléfono"
          value={formatPhone(
            profile.telefono,
          )}
          icon={<PhoneOutlinedIcon />}
        />

        <PersonalInformationRow
          label="Correo electrónico"
          value={profile.email}
          icon={
            <MailOutlineOutlinedIcon />
          }
        />

        <PersonalInformationRow
          label="Estado"
          value={
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
          }
        />

        <PersonalInformationRow
          label="Fecha de alta"
          value={formatMemberDate(
            profile.fecha_alta,
          )}
          icon={
            <CalendarMonthOutlinedIcon />
          }
        />
      </Box>
    </Box>
  );
}