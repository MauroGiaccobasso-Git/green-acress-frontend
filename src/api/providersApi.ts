import { httpClient } from "./httpClient";

/* =========================================================
   TIPOS DEL MÓDULO
========================================================= */

export type ProviderStatus = "ACTIVO" | "INACTIVO";

/*
Representa el contrato real de un proveedor
devuelto por el backend.
*/
export type Provider = {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  estado: ProviderStatus;
  fecha_creacion: string;
  fecha_actualizacion: string;
};

/*
Parámetros soportados por la consulta
administrativa de proveedores.
*/
export type GetProvidersParams = {
  search?: string;
  estado?: ProviderStatus;
};

/*
Datos obligatorios para registrar
un nuevo proveedor.

El estado inicial ACTIVO es asignado
exclusivamente por el backend.
*/
export type CreateProviderPayload = {
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
};

/*
El endpoint de actualización utiliza PUT,
por lo que requiere el conjunto completo
de datos editables del proveedor.
*/
export type UpdateProviderPayload = {
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
};

/*
Payload exclusivo para el cambio
de estado lógico del proveedor.
*/
export type UpdateProviderStatusPayload = {
  estado: ProviderStatus;
};

type ProviderMutationResponse = {
  message: string;
  proveedor: Provider;
};

/* =========================================================
   HELPERS
========================================================= */

/*
Construye de forma segura los parámetros
de búsqueda y filtrado soportados
por el backend.
*/
const buildProvidersQueryParams = (
  params: GetProvidersParams = {},
): string => {
  const searchParams = new URLSearchParams();

  const normalizedSearch = params.search?.trim();

  if (normalizedSearch) {
    searchParams.set("search", normalizedSearch);
  }

  if (params.estado) {
    searchParams.set("estado", params.estado);
  }

  return searchParams.toString();
};

/* =========================================================
   API DEL MÓDULO
========================================================= */

/*
Centraliza todas las operaciones HTTP
relacionadas con proveedores.

Los hooks, containers y componentes
no deben comunicarse directamente
con el backend.
*/
export const providersApi = {
  /*
  Obtiene el listado completo de proveedores
  aplicando búsqueda y filtro por estado.

  El backend devuelve directamente un array.
  */
  async getProviders(
    params: GetProvidersParams = {},
  ): Promise<Provider[]> {
    const query = buildProvidersQueryParams(params);

    return httpClient<Provider[]>(
      `/proveedores${query ? `?${query}` : ""}`,
    );
  },

  /*
  Registra un proveedor.

  También continúa siendo reutilizable
  desde el alta rápida del módulo Compras.
  */
  async createProvider(
    payload: CreateProviderPayload,
  ): Promise<Provider> {
    const response = await httpClient<ProviderMutationResponse>(
      "/proveedores",
      {
        method: "POST",
        body: payload,
      },
    );

    return response.proveedor;
  },

  /*
  Actualiza todos los datos editables
  de un proveedor existente.
  */
  async updateProvider(
    providerId: number,
    payload: UpdateProviderPayload,
  ): Promise<Provider> {
    const response = await httpClient<ProviderMutationResponse>(
      `/proveedores/${providerId}`,
      {
        method: "PUT",
        body: payload,
      },
    );

    return response.proveedor;
  },

  /*
  Cambia el estado lógico entre
  ACTIVO e INACTIVO.
  */
  async updateProviderStatus(
    providerId: number,
    payload: UpdateProviderStatusPayload,
  ): Promise<Provider> {
    const response = await httpClient<ProviderMutationResponse>(
      `/proveedores/${providerId}/estado`,
      {
        method: "PATCH",
        body: payload,
      },
    );

    return response.proveedor;
  },
};