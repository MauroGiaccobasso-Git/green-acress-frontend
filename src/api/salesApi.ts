import { Product } from "./productsApi";
import { httpClient } from "./httpClient";

/*
Detalle enviado al backend para registrar
una venta presencial.

El backend calcula precio_unitario y subtotal
según el precio vigente del producto FLOR.
*/
export type SaleDetailPayload = {
  producto_id: number;

  cantidad: number;
};

/*
Payload utilizado para registrar una venta
directa presencial a un socio activo.
*/
export type CreateSalePayload = {
  socio_id: number;

  observaciones?: string;

  detalles: SaleDetailPayload[];
};

/*
Filtros administrativos disponibles para
consultar el historial de ventas.
*/
export type SalesFilters = {
  search?: string;

  estado?: "REGISTRADA" | "ANULADA";

  fechaDesde?: string;

  fechaHasta?: string;
};

export type SaleUser = {
  id: number;

  email: string;

  rol: "ADMIN" | "SOCIO";

  estado: string;
};

export type SaleMember = {
  id: number;

  usuario_id: number;

  documento: string;

  nombre: string;

  apellido: string;

  telefono: string | null;

  estado: "ACTIVO" | "INACTIVO" | "SUSPENDIDO";
};

export type SaleDetail = {
  id: number;

  venta_id: number;

  producto_id: number;

  cantidad: number;

  precio_unitario: number;

  subtotal: number;

  producto: Product;
};

export type Sale = {
  id: number;

  socio_id: number;

  usuario_id: number;

  fecha: string;

  estado: "REGISTRADA" | "ANULADA";

  total: number;

  observaciones: string | null;

  socio: SaleMember;

  usuario: SaleUser;

  detalles: SaleDetail[];
};

type SalesResponse = {
  message: string;

  ventas: Sale[];
};

type SaleResponse = {
  message: string;

  venta: Sale;
};

/*
Centraliza las operaciones HTTP del módulo Ventas.

Arquitectura:

Container → Hook → API → httpClient → Backend
*/
export const salesApi = {
  async getSales(filters: SalesFilters = {}): Promise<Sale[]> {
    const params = new URLSearchParams();

    if (filters.search) {
      params.append("search", filters.search);
    }

    if (filters.estado) {
      params.append("estado", filters.estado);
    }

    if (filters.fechaDesde) {
      params.append("fecha_desde", filters.fechaDesde);
    }

    if (filters.fechaHasta) {
      params.append("fecha_hasta", filters.fechaHasta);
    }

    const query = params.toString();

    const response = await httpClient<SalesResponse>(
      `/ventas${query ? `?${query}` : ""}`,
    );

    return response.ventas;
  },

  async getSaleById(saleId: number): Promise<Sale> {
    const response = await httpClient<SaleResponse>(`/ventas/${saleId}`);

    return response.venta;
  },

  async createSale(payload: CreateSalePayload): Promise<Sale> {
    const response = await httpClient<SaleResponse>("/ventas", {
      method: "POST",
      body: payload,
    });

    return response.venta;
  },

  async cancelSale(saleId: number): Promise<Sale> {
    const response = await httpClient<SaleResponse>(
      `/ventas/${saleId}/anular`,
      {
        method: "PATCH",
      },
    );

    return response.venta;
  },
};