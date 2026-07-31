import { httpClient } from "./httpClient";

export type SocioStatus = "ACTIVO" | "INACTIVO" | "SUSPENDIDO";

export type SocioUserStatus = "ACTIVO" | "INACTIVO" | "BLOQUEADO";

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

/*
Construye los query params utilizados
por el listado administrativo.
*/
const buildSociosQueryParams = (
  params: GetSociosParams = {},
): string => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.estado) {
    searchParams.set("estado", params.estado);
  }

  if (params.estadoUsuario) {
    searchParams.set("estadoUsuario", params.estadoUsuario);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  return searchParams.toString();
};

/*
Centraliza todas las operaciones HTTP
relacionadas con socios.

Los hooks y containers no deben realizar
solicitudes directas al backend.
*/
export const sociosApi = {
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
  async getSocioById(socioId: number): Promise<Socio> {
    const response = await httpClient<GetSocioResponse>(
      `/socios/${socioId}`,
    );

    return response.socio;
  },

  /*
  Obtiene las opciones mínimas de socios
  habilitados para registrar ventas.

  Se mantiene el contrato existente porque
  también es utilizado por el módulo Ventas.
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
    const response = await httpClient<CreateSocioResponse>(
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
    const response = await httpClient<UpdateSocioResponse>(
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

  El backend sincroniza también el estado
  del usuario y ejecuta las reglas asociadas
  a reservas, stock y sesiones.
  */
  async updateSocioStatus(
    socioId: number,
    payload: UpdateSocioStatusPayload,
  ): Promise<Socio> {
    const response = await httpClient<UpdateSocioStatusResponse>(
      `/socios/${socioId}/estado`,
      {
        method: "PATCH",
        body: payload,
      },
    );

    return response.socio;
  },
};