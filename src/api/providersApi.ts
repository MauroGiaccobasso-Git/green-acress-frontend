import { httpClient } from "./httpClient";

/*
Representa un proveedor dentro
del sistema.

Se mantienen los nombres del backend
para evitar mapeos innecesarios entre
frontend y API.
*/
export type Provider = {
  id: number;

  nombre: string;

  contacto?: string | null;

  telefono?: string | null;

  email?: string | null;

  estado: "ACTIVO" | "INACTIVO";

  fecha_creacion?: string;

  fecha_actualizacion?: string;
};

/*
Payload utilizado para registrar
un nuevo proveedor desde frontend.

El estado no se envía desde la UI:
la regla de creación queda centralizada
en backend.
*/
export type CreateProviderPayload = {
  nombre: string;

  contacto?: string | null;

  telefono?: string | null;

  email?: string | null;
};

/*
Centraliza las operaciones HTTP
relacionadas con proveedores.

Los componentes no deben realizar
llamadas directas a backend.
*/
export const providersApi = {
  /*
  Obtiene proveedores desde backend.

  El parámetro search permite reutilizar
  la búsqueda administrativa ya expuesta
  por el endpoint de proveedores.
  */
  async getProviders(search?: string): Promise<Provider[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";

    return httpClient<Provider[]>(`/proveedores${query}`);
  },

  /*
  Registra un proveedor.

  Se reutiliza desde el módulo de Proveedores
  y desde el flujo de alta rápida en Compras.
  */
  async createProvider(payload: CreateProviderPayload): Promise<Provider> {
    const response = await httpClient<{
      message: string;
      proveedor: Provider;
    }>("/proveedores", {
      method: "POST",
      body: payload,
    });

    return response.proveedor;
  },
};
