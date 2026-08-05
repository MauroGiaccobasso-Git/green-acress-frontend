import { httpClient } from "./httpClient";

/* =========================================================
   CONTRATOS ADMINISTRATIVOS
========================================================= */

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
Representa la estructura administrativa
de un producto utilizada por el frontend.

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

/* =========================================================
   CONTRATOS DEL PORTAL DE SOCIOS
========================================================= */

/*
Representa una flor disponible para reserva
dentro del Portal de Socios.

El contrato coincide exactamente con la
respuesta pública reducida del backend.

No expone:

- estado administrativo;
- fechas internas;
- estructura completa de stock;
- unidad de medida;
- identificadores de relaciones.

El identificador se utiliza exclusivamente
para construir la solicitud de reserva y
no debe presentarse visualmente.
*/
export type MemberAvailableProduct = {
  id: number;

  nombre: string;

  genetica: "INDICA" | "SATIVA" | "HIBRIDA";

  porcentajeThc: number;

  descripcion: string | null;

  precioPorGramo: number;

  imagen: string | null;

  cantidadDisponible: number;
};

/*
Representa la respuesta del endpoint público
de productos disponibles para el socio.
*/
type MemberAvailableProductsResponse = {
  message: string;

  productos: MemberAvailableProduct[];
};

/* =========================================================
   CONTRATOS OPERATIVOS
========================================================= */

/*
Representa una opción de producto
disponible para registrar ventas.

El contrato contiene únicamente los
datos necesarios para el flujo operativo.

Las reglas de elegibilidad del producto
son aplicadas por el backend.
*/
export type SaleProductOption = {
  id: number;

  nombre: string;

  porcentaje_thc: number;

  precio: number;

  stockDisponible: number;
};

/*
Representa una opción de producto
disponible para registrar compras.

El backend devuelve semillas activas
e inactivas porque ambas pueden utilizarse
para registrar ingresos de stock.

El estado se expone para que la interfaz
pueda diferenciarlas visualmente sin
impedir su selección.
*/
export type PurchaseProductOption = {
  id: number;

  nombre: string;

  estado: "ACTIVO" | "INACTIVO";

  genetica: "INDICA" | "SATIVA" | "HIBRIDA";

  imagen: string | null;

  stock: number;
};

/* =========================================================
   PAYLOADS ADMINISTRATIVOS
========================================================= */

/*
Representa los campos necesarios
para registrar un nuevo producto.

En el alta el tipo sí se envía porque
define la unidad de medida y las reglas
asociadas al THC.

El stock no se incluye porque debe
gestionarse mediante movimientos
trazables de inventario.

La imagen tampoco se incluye aquí:
se envía como archivo independiente
mediante multipart/form-data.
*/
export type CreateProductPayload = {
  nombre: string;

  descripcion?: string | null;

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

La nueva imagen, cuando existe, se recibe
como archivo independiente.
*/
export type UpdateProductPayload = {
  nombre: string;

  descripcion?: string | null;

  genetica: "INDICA" | "SATIVA" | "HIBRIDA";

  porcentaje_thc: number | null;

  precio_venta_actual: number | null;
};

/*
Representa el archivo opcional seleccionado
para crear o reemplazar la imagen de un producto.

La imagen se mantiene fuera del payload de negocio
porque debe enviarse como multipart/form-data
y no forma parte del contrato JSON tradicional.
*/
export type ProductImageFile = File | null;

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

/* =========================================================
   LISTADO ADMINISTRATIVO
========================================================= */

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
Representa la respuesta paginada del
listado administrativo de productos.
*/
export type GetProductsResponse = {
  data: Product[];

  pagination: ProductsPagination;
};

/* =========================================================
   RESPUESTAS OPERATIVAS
========================================================= */

/*
Representa la respuesta devuelta por backend
al consultar productos disponibles para Ventas.
*/
type SaleProductOptionsResponse = {
  message: string;

  productos: SaleProductOption[];
};

/*
Representa la respuesta devuelta por backend
al consultar productos disponibles para Compras.
*/
type PurchaseProductOptionsResponse = {
  message: string;

  productos: PurchaseProductOption[];
};

/* =========================================================
   RESPUESTAS ADMINISTRATIVAS
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

/*
Construye query params para el listado
administrativo de productos.

La búsqueda, los filtros y la paginación
se mantienen exclusivamente dentro
del caso de uso administrativo.
*/
const buildProductsQueryParams = (
  params: GetProductsParams = {},
): string => {
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
    searchParams.set(
      "genetica",
      params.genetica,
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

/*
Convierte un valor numérico opcional
al formato textual requerido por FormData.

Los valores null se envían como texto vacío
para que backend los normalice correctamente.
*/
const serializeNullableNumber = (value: number | null): string =>
  value === null ? "" : String(value);

/*
Construye el formulario multipart utilizado
para crear y actualizar productos.

Responsabilidades:

- serializar campos de negocio;
- conservar valores opcionales;
- adjuntar una única imagen bajo el nombre "imagen";
- delegar al navegador la construcción del boundary.

El nombre del campo debe coincidir con
upload.single("imagen") configurado en backend.
*/
const buildProductFormData = (
  payload: CreateProductPayload | UpdateProductPayload,
  imageFile: ProductImageFile = null,
): FormData => {
  const formData = new FormData();

  formData.append("nombre", payload.nombre.trim());
  formData.append("descripcion", payload.descripcion?.trim() ?? "");
  formData.append("genetica", payload.genetica);
  formData.append(
    "porcentaje_thc",
    serializeNullableNumber(payload.porcentaje_thc),
  );
  formData.append(
    "precio_venta_actual",
    serializeNullableNumber(payload.precio_venta_actual),
  );

  if ("tipo" in payload) {
    formData.append("tipo", payload.tipo);
  }

  if (imageFile) {
    formData.append("imagen", imageFile, imageFile.name);
  }

  return formData;
};

/* =========================================================
   API DE PRODUCTOS
========================================================= */

/*
Centraliza las operaciones HTTP
relacionadas con productos.

Los componentes no deben realizar
llamadas directas a la API.
*/
export const productsApi = {
  /* =========================================================
     CONSULTAS ADMINISTRATIVAS
  ========================================================= */

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
    const query =
      buildProductsQueryParams(params);

    return httpClient<GetProductsResponse>(
      `/productos${query ? `?${query}` : ""}`,
    );
  },

  /* =========================================================
     CONSULTAS DEL PORTAL DE SOCIOS
  ========================================================= */

  /*
  Obtiene el catálogo de flores disponibles
  para reserva dentro del Portal de Socios.

  El backend aplica las reglas de elegibilidad:

  - producto de tipo FLOR;
  - producto ACTIVO;
  - precio de venta válido;
  - stock disponible mayor a cero.

  El frontend recibe un contrato público
  reducido y no replica dichos filtros.
  */
  async getAvailableProducts(): Promise<
    MemberAvailableProduct[]
  > {
    const response =
      await httpClient<MemberAvailableProductsResponse>(
        "/productos/disponibles",
      );

    return response.productos;
  },

  /* =========================================================
     CONSULTAS OPERATIVAS
  ========================================================= */

  /*
  Obtiene los productos habilitados
  para registrar ventas.

  El backend aplica las reglas de negocio
  y devuelve un contrato operativo reducido,
  sin depender del listado administrativo.
  */
  async getSaleProductOptions(): Promise<
    SaleProductOption[]
  > {
    const response =
      await httpClient<SaleProductOptionsResponse>(
        "/productos/opciones-venta",
      );

    return response.productos;
  },

  /*
  Obtiene todas las semillas disponibles
  como opciones para registrar compras.

  El backend devuelve semillas activas
  e inactivas junto con su estado para
  permitir su diferenciación visual.
  */
  async getPurchaseProductOptions(): Promise<
    PurchaseProductOption[]
  > {
    const response =
      await httpClient<PurchaseProductOptionsResponse>(
        "/productos/opciones-compra",
      );

    return response.productos;
  },

  /* =========================================================
     OPERACIONES ADMINISTRATIVAS
  ========================================================= */

  /*
  Registra un nuevo producto.

  Los datos y la imagen opcional se envían
  mediante multipart/form-data.

  La validación final de reglas de negocio
  continúa siendo responsabilidad del backend.
  */
  async createProduct(
    payload: CreateProductPayload,
    imageFile: ProductImageFile = null,
  ): Promise<Product> {
    const response =
      await httpClient<CreateProductResponse>(
        "/productos",
        {
          method: "POST",
          body: buildProductFormData(
            payload,
            imageFile,
          ),
        },
      );

    return response.producto;
  },

  /*
  Actualiza la información editable
  de un producto existente.

  Permite reemplazar opcionalmente la imagen
  enviando un archivo multipart.

  No modifica el estado lógico.
  La baja lógica se realiza mediante
  updateProductStatus.
  */
  async updateProduct(
    productId: number,
    payload: UpdateProductPayload,
    imageFile: ProductImageFile = null,
  ): Promise<Product> {
    const response =
      await httpClient<UpdateProductResponse>(
        `/productos/${productId}`,
        {
          method: "PUT",
          body: buildProductFormData(
            payload,
            imageFile,
          ),
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
    const response =
      await httpClient<UpdateProductStatusResponse>(
        `/productos/${productId}/estado`,
        {
          method: "PATCH",
          body: payload,
        },
      );

    return response.producto;
  },
};