import { httpClient } from "./httpClient";

/*
Represents stock information
associated with a product.

The backend returns stock included
inside the administrative product list.
*/
export type ProductStock = {
  id: number;

  producto_id: number;

  cantidad_total: number;

  cantidad_reservada: number;

  cantidad_disponible: number;

  fecha_actualizacion: string;
};

/*
Represents the product structure
used by the frontend.

Backend field names are preserved
to avoid unnecessary mapping.
*/
export type Product = {
  id: number;

  nombre: string;

  descripcion: string;

  tipo: "FLOR" | "SEMILLA";

  genetica:
    | "INDICA"
    | "SATIVA"
    | "HIBRIDA";

  porcentaje_thc: number | null;

  unidad_medida:
    | "GRAMOS"
    | "UNIDADES";

  precio_venta_actual: number;

  estado:
    | "ACTIVO"
    | "INACTIVO";

  fecha_creacion: string;

  fecha_actualizacion: string;

  stock: ProductStock | null;
};

/*
Centralizes HTTP operations
related to products.

Components must not perform
direct fetch calls.
*/
export const productsApi = {
  async getProducts(
    search?: string
  ): Promise<Product[]> {

    const query =
      search
        ? `?search=${encodeURIComponent(search)}`
        : "";

    return httpClient<Product[]>(
      `/productos${query}`
    );
  },
};