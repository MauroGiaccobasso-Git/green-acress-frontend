import { httpClient } from "./httpClient";

/* =========================================================
   TIPOS COMPARTIDOS DEL DOMINIO SOCIOS
========================================================= */

export type SocioStatus =
  | "ACTIVO"
  | "INACTIVO"
  | "SUSPENDIDO";

export type SocioUserStatus =
  | "ACTIVO"
  | "INACTIVO"
  | "BLOQUEADO";

/* =========================================================
   CONTRATOS ADMINISTRATIVOS
========================================================= */

export type SocioUser = {
  id: number;

  email: string;

  rol: "ADMIN" | "SOCIO";

  estado: SocioUserStatus;

  fecha_creacion: string;

  fecha_actualizacion: string;
};

export type Socio = {
  id: number;

  usuario_id: number;

  documento: string;

  nombre: string;

  apellido: string;

  telefono: string | null;

  estado: SocioStatus;

  fecha_alta: string;

  consentimiento_aceptado: boolean;

  fecha_consentimiento: string | null;

  fecha_creacion: string;

  fecha_actualizacion: string;

  usuario: SocioUser;
};

export type SociosPagination = {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
};

/*
Parámetros soportados por el listado
administrativo de socios.

La búsqueda, los filtros y la paginación
son aplicados por el backend.
*/
export type GetSociosParams = {
  search?: string;

  estado?: SocioStatus;

  estadoUsuario?: SocioUserStatus;

  page?: number;

  limit?: number;
};

export type GetSociosResponse = {
  message: string;

  socios: Socio[];

  pagination: SociosPagination;
};

export type SocioVentaOption = {
  id: number;

  documento: string;

  nombre: string;

  apellido: string;
};

export type GetSociosOpcionesVentaResponse = {
  message: string;

  socios: SocioVentaOption[];
};

/*
Datos requeridos para registrar
un nuevo socio.

La contraseña temporal es generada
por el backend y nunca es ingresada
por el administrador.
*/
export type CreateSocioPayload = {
  email: string;

  documento: string;

  nombre: string;

  apellido: string;

  telefono: string;
};

/*
Campos permitidos para actualizar
los datos de un socio.

Todos son opcionales porque el backend
acepta actualizaciones parciales.
*/
export type UpdateSocioPayload = {
  email?: string;

  documento?: string;

  nombre?: string;

  apellido?: string;

  telefono?: string;
};

/*
Payload exclusivo para cambios de estado.

El motivo es obligatorio para preservar
la trazabilidad administrativa.
*/
export type UpdateSocioStatusPayload = {
  estado: SocioStatus;

  motivo: string;
};

/* =========================================================
   CONTRATOS DEL PORTAL SOCIO
========================================================= */

/*
Resumen legal correspondiente al mes vigente.

Los valores son calculados exclusivamente
por backend según la zona horaria
America/Montevideo.
*/
export type MemberLegalLimitSummary = {
  limite_gramos: number;

  gramos_retirados: number;

  gramos_reservados: number;

  gramos_disponibles: number;
};

/*
Contrato público del perfil autenticado.

No incluye:

- identificadores internos;
- información administrativa;
- datos de auditoría;
- credenciales;
- estado interno del usuario.
*/
export type MemberProfile = {
  documento: string;

  nombre: string;

  apellido: string;

  telefono: string | null;

  email: string;

  estado: SocioStatus;

  fecha_alta: string;

  limite_legal_mensual: MemberLegalLimitSummary;
};

/* =========================================================
   RESPUESTAS DEL BACKEND
========================================================= */

type GetSocioResponse = {
  message: string;

  socio: Socio;
};

type CreateSocioResponse = {
  message: string;

  socio: Socio;
};

type UpdateSocioResponse = {
  message: string;

  socio: Socio;
};

type UpdateSocioStatusResponse = {
  message: string;

  socio: Socio;
};

type GetMemberProfileResponse = {
  message: string;

  perfil: MemberProfile;
};

/* =========================================================
   HELPERS
========================================================= */

/*
Construye los query params utilizados
por el listado administrativo.
*/
const buildSociosQueryParams = (
  params: GetSociosParams = {},
): string => {
  const searchParams = new URLSearchParams();

  const normalizedSearch = params.search?.trim();

  if (normalizedSearch) {
    searchParams.set("search", normalizedSearch);
  }

  if (params.estado) {
    searchParams.set("estado", params.estado);
  }

  if (params.estadoUsuario) {
    searchParams.set(
      "estadoUsuario",
      params.estadoUsuario,
    );
  }

  if (params.page) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  if (params.limit) {
    searchParams.set(
      "limit",
      String(params.limit),
    );
  }

  return searchParams.toString();
};

/* =========================================================
   API DEL DOMINIO SOCIOS
========================================================= */

/*
Centraliza todas las operaciones HTTP
relacionadas con socios.

Los hooks y containers no deben realizar
solicitudes directas al backend.
*/
export const sociosApi = {
  /* =======================================================
     OPERACIONES ADMINISTRATIVAS
  ======================================================= */

  /*
  Obtiene el listado administrativo
  con búsqueda, filtros y paginación.
  */
  async getSocios(
    params: GetSociosParams = {},
  ): Promise<GetSociosResponse> {
    const query = buildSociosQueryParams(params);

    return httpClient<GetSociosResponse>(
      `/socios${query ? `?${query}` : ""}`,
    );
  },

  /*
  Obtiene el detalle administrativo
  de un socio específico.
  */
  async getSocioById(
    socioId: number,
  ): Promise<Socio> {
    const response =
      await httpClient<GetSocioResponse>(
        `/socios/${socioId}`,
      );

    return response.socio;
  },

  /*
  Obtiene las opciones mínimas de socios
  habilitados para registrar ventas.
  */
  async getSociosOpcionesVenta(): Promise<GetSociosOpcionesVentaResponse> {
    return httpClient<GetSociosOpcionesVentaResponse>(
      "/socios/opciones-venta",
    );
  },

  /*
  Registra un socio y su usuario asociado.

  La generación y el envío de la contraseña
  temporal son responsabilidad del backend.
  */
  async createSocio(
    payload: CreateSocioPayload,
  ): Promise<Socio> {
    const response =
      await httpClient<CreateSocioResponse>(
        "/socios",
        {
          method: "POST",
          body: payload,
        },
      );

    return response.socio;
  },

  /*
  Actualiza los datos personales y de acceso
  permitidos para un socio.
  */
  async updateSocio(
    socioId: number,
    payload: UpdateSocioPayload,
  ): Promise<Socio> {
    const response =
      await httpClient<UpdateSocioResponse>(
        `/socios/${socioId}`,
        {
          method: "PUT",
          body: payload,
        },
      );

    return response.socio;
  },

  /*
  Actualiza el estado funcional del socio.

  Backend sincroniza también el estado
  del usuario y ejecuta las reglas asociadas
  a reservas, stock y sesiones.
  */
  async updateSocioStatus(
    socioId: number,
    payload: UpdateSocioStatusPayload,
  ): Promise<Socio> {
    const response =
      await httpClient<UpdateSocioStatusResponse>(
        `/socios/${socioId}/estado`,
        {
          method: "PATCH",
          body: payload,
        },
      );

    return response.socio;
  },

  /* =======================================================
     OPERACIONES DEL PORTAL SOCIO
  ======================================================= */

  /*
  Obtiene el perfil público del socio
  correspondiente a la sesión autenticada.

  Backend determina la identidad mediante
  el JWT y calcula el resumen legal mensual.
  */
  async getMyProfile(): Promise<MemberProfile> {
    const response =
      await httpClient<GetMemberProfileResponse>(
        "/socios/perfil",
      );

    return response.perfil;
  },
};