import type { Product } from "./productsApi";
import type { Provider } from "./providersApi";
import { httpClient } from "./httpClient";

/*
Representa cada producto incluido
dentro de una compra.

Se mantienen los nombres utilizados
por backend para evitar mapeos
innecesarios entre capas.
*/
export type PurchaseDetailPayload = {
  producto_id: number;

  cantidad: number;

  precio_unitario: number;
};

/*
Representa la información necesaria
para registrar una compra.

La compra debe estar asociada a un
proveedor y contener al menos un
detalle de producto.
*/
export type CreatePurchasePayload = {
  proveedor_id: number;

  observaciones?: string;

  detalles: PurchaseDetailPayload[];
};

/*
Representa el usuario administrador
que registró la compra.

Backend devuelve esta información
para trazabilidad administrativa.
*/
export type PurchaseUser = {
  id: number;

  email: string;

  rol: "ADMIN" | "SOCIO";
};

/*
Representa un detalle de compra
devuelto por backend.

Incluye el producto asociado porque
backend retorna detalles con include
de producto.
*/
export type PurchaseDetail = {
  id: number;

  compra_id: number;

  producto_id: number;

  cantidad: number;

  precio_unitario: number;

  subtotal: number;

  producto: Product;
};

/*
Representa la compra registrada
devuelta por backend.
*/
export type Purchase = {
  id: number;

  proveedor_id: number;

  usuario_id: number;

  observaciones: string | null;

  estado: string;

  fecha_creacion: string;

  fecha_actualizacion: string;

  proveedor: Provider;

  usuario: PurchaseUser;

  detalles: PurchaseDetail[];
};

/*
Representa la respuesta devuelta
por backend al registrar una compra.
*/
type CreatePurchaseResponse = {
  mensaje: string;

  datos: Purchase;
};

/*
Centraliza las operaciones HTTP
relacionadas con compras.

Los componentes no deben comunicarse
directamente con backend.
*/
export const purchasesApi = {
  /*
  Registra una nueva compra.

  El incremento de stock, los movimientos
  de inventario y la auditoría se resuelven
  desde backend de forma transaccional.
  */
  async createPurchase(payload: CreatePurchasePayload): Promise<Purchase> {
    const response = await httpClient<CreatePurchaseResponse>("/compras", {
      method: "POST",
      body: payload,
    });

    return response.datos;
  },
};
