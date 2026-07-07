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

  descripcion: string | null;

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

  precio_venta_actual: number | null;

  estado: "ACTIVO" | "INACTIVO";

  fecha_creacion: string;

  fecha_actualizacion: string;

  stock: ProductStock | null;
};

/*
Representa los campos necesarios
para registrar un nuevo producto.

En el alta el tipo sí se envía porque
define la unidad de medida y las reglas
asociadas al THC.

El stock no se incluye porque debe
gestionarse mediante movimientos
trazables de inventario.
*/
export type CreateProductPayload = {
  nombre: string;

  descripcion?: string | null;

  imagen_url?: string | null;

  tipo: "FLOR" | "SEMILLA";

  genetica: "INDICA" | "SATIVA" | "HIBRIDA";

  porcentaje_thc: number | null;

  precio_venta_actual: number | null;
};

/*
Representa los campos permitidos
para la edición de datos de un producto.

El tipo de producto queda excluido
porque es inmutable según las reglas
de negocio del backend.

El estado también queda excluido porque
la baja lógica se gestiona mediante
un endpoint específico PATCH /estado.
*/
export type UpdateProductPayload = {
  nombre: string;

  descripcion?: string | null;

  imagen_url?: string | null;

  genetica: "INDICA" | "SATIVA" | "HIBRIDA";

  porcentaje_thc: number | null;

  precio_venta_actual: number | null;
};

/*
Representa el payload utilizado para
modificar el estado lógico de un producto.

Se separa de la edición general para
mantener alineado el frontend con
la API real del backend.
*/
export type UpdateProductStatusPayload = {
  estado: "ACTIVO" | "INACTIVO";
};

/*
Representa la paginación administrativa
devuelta por el backend para listados.

Permite que el frontend no calcule
paginación localmente sobre datos parciales.
*/
export type ProductsPagination = {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
};

/*
Representa los parámetros disponibles
para consultar productos desde la API.

La búsqueda, los filtros y la paginación
se delegan al backend para mantener
consistencia con el resto de módulos
administrativos.
*/
export type GetProductsParams = {
  search?: string;

  tipo?: "FLOR" | "SEMILLA";

  estado?: "ACTIVO" | "INACTIVO";

  genetica?: "INDICA" | "SATIVA" | "HIBRIDA";

  page?: number;

  limit?: number;
};

/*
Representa los parámetros disponibles
para consultar productos como opciones
de formularios operativos.

Se reutilizan los mismos filtros del backend,
pero el consumo esperado es una colección
simple para selects y flujos auxiliares.
*/
export type GetProductOptionsParams = Omit<GetProductsParams, "page" | "limit"> & {
  limit?: number;
};

/*
Representa la respuesta paginada del
listado administrativo de productos.
*/
export type GetProductsResponse = {
  data: Product[];

  pagination: ProductsPagination;
};

/*
Representa la respuesta devuelta por backend
al registrar un producto.

El endpoint retorna un mensaje informativo
junto con el producto creado.
*/
type CreateProductResponse = {
  message: string;

  producto: Product;
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
Representa la respuesta devuelta por backend
al actualizar el estado lógico de un producto.
*/
type UpdateProductStatusResponse = {
  message: string;

  producto: Product;
};

/*
Construye query params comunes para consultas
de productos.

Evita duplicar lógica entre listados paginados
y opciones de formularios.
*/
const buildProductsQueryParams = (params: GetProductsParams = {}) => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.tipo) {
    searchParams.set("tipo", params.tipo);
  }

  if (params.estado) {
    searchParams.set("estado", params.estado);
  }

  if (params.genetica) {
    searchParams.set("genetica", params.genetica);
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
Centraliza las operaciones HTTP
relacionadas con productos.

Los componentes no deben realizar
llamadas directas a la API.
*/
export const productsApi = {
  /*
  Obtiene el listado administrativo de productos.

  La búsqueda, los filtros y la paginación
  se envían como query params para que
  el backend aplique la consulta real
  sobre la base de datos antes de paginar.
  */
  async getProducts(
    params: GetProductsParams = {},
  ): Promise<GetProductsResponse> {
    const query = buildProductsQueryParams(params);

    return httpClient<GetProductsResponse>(
      `/productos${query ? `?${query}` : ""}`,
    );
  },

  /*
  Obtiene productos como colección simple
  para formularios operativos.

  Debe usarse en módulos como Compras,
  Ventas o Reservas cuando se necesitan
  opciones para selects y no un listado
  administrativo paginado.
  */
  async getProductOptions(
    params: GetProductOptionsParams = {},
  ): Promise<Product[]> {
    const query = buildProductsQueryParams({
      ...params,
      page: 1,
      limit: params.limit ?? 50,
    });

    const response = await httpClient<GetProductsResponse>(
      `/productos${query ? `?${query}` : ""}`,
    );

    return response.data;
  },

  /*
  Registra un nuevo producto.

  La validación final de reglas de negocio
  continúa siendo responsabilidad del backend.
  */
  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const response = await httpClient<CreateProductResponse>("/productos", {
      method: "POST",
      body: payload,
    });

    return response.producto;
  },

  /*
  Actualiza la información editable
  de un producto existente.

  No modifica el estado lógico.
  La baja lógica se realiza mediante
  updateProductStatus.
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

  /*
  Actualiza el estado lógico de un producto.

  Se utiliza para activar o inactivar
  productos sin eliminarlos físicamente,
  respetando la baja lógica definida
  para el módulo.
  */
  async updateProductStatus(
    productId: number,
    payload: UpdateProductStatusPayload,
  ): Promise<Product> {
    const response = await httpClient<UpdateProductStatusResponse>(
      `/productos/${productId}/estado`,
      {
        method: "PATCH",
        body: payload,
      },
    );

    return response.producto;
  },
};