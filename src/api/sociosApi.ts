import { httpClient } from "./httpClient";

export type SocioUser = {
  id: number;
  email: string;
  rol: "ADMIN" | "SOCIO";
  estado: "ACTIVO" | "INACTIVO" | "BLOQUEADO";
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
  fecha_alta: string;
  consentimiento_aceptado: boolean;
  fecha_consentimiento: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  estado: "ACTIVO" | "INACTIVO" | "SUSPENDIDO";
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

export const sociosApi = {
  async getSocios(search?: string): Promise<GetSociosResponse> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";

    return httpClient<GetSociosResponse>(`/socios${query}`);
  },

  async getSociosOpcionesVenta(): Promise<GetSociosOpcionesVentaResponse> {
    return httpClient<GetSociosOpcionesVentaResponse>(
      "/socios/opciones-venta",
    );
  },
};