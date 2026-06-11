import { httpClient } from "./httpClient";

/*
Representa la información de stock
asociada a un producto.

El backend devuelve el stock incluido
dentro del listado administrativo.
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
Representa la estructura del producto
utilizada por el frontend.

Se mantienen los nombres del backend
para evitar mapeos innecesarios.
*/
export type Product = {
  id: number;

  nombre: string;

  descripcion: string;

  /*
  URL opcional de la imagen del producto.

  Permite mantener alineado el contrato
  del frontend con el modelo expuesto
  por la API.
  */
  imagen_url?: string | null;

  tipo: "FLOR" | "SEMILLA";

  genetica: "INDICA" | "SATIVA" | "HIBRIDA";

  porcentaje_thc: number | null;

  unidad_medida: "GRAMOS" | "UNIDADES";

  precio_venta_actual: number;

  estado: "ACTIVO" | "INACTIVO";

  fecha_creacion: string;

  fecha_actualizacion: string;

  stock: ProductStock | null;
};

/*
Representa los campos permitidos
para la edición de un producto.

El tipo de producto queda excluido
porque es inmutable según las reglas
de negocio del backend.
*/
export type UpdateProductPayload = {
  nombre: string;

  descripcion: string;

  imagen_url?: string | null;

  genetica: "INDICA" | "SATIVA" | "HIBRIDA";

  porcentaje_thc: number | null;

  precio_venta_actual: number;

  estado: "ACTIVO" | "INACTIVO";
};

/*
Representa la respuesta devuelta por backend
al actualizar un producto.

El endpoint retorna un mensaje informativo
junto con el producto actualizado.

Se tipa explícitamente para mantener alineado
el contrato frontend-backend y evitar asumir
que la respuesta contiene directamente
la entidad Product.
*/
type UpdateProductResponse = {
  message: string;

  producto: Product;
};
/*
Centraliza las operaciones HTTP
relacionadas con productos.

Los componentes no deben realizar
llamadas directas a la API.
*/
export const productsApi = {
  async getProducts(search?: string): Promise<Product[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";

    return httpClient<Product[]>(`/productos${query}`);
  },

  /*
  Actualiza la información editable
  de un producto existente.

  La validación de reglas de negocio
  continúa siendo responsabilidad
  del backend.
  */

  async updateProduct(
    productId: number,
    payload: UpdateProductPayload,
  ): Promise<Product> {
    const response = await httpClient<UpdateProductResponse>(
      `/productos/${productId}`,
      {
        method: "PUT",
        body: payload,
      },
    );

    return response.producto;
  },
};
