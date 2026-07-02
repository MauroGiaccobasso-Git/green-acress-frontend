import { httpClient } from "./httpClient";

/*
Representa el producto reducido devuelto
por el backend dentro del módulo Stock.

Se utiliza un DTO específico porque el
inventario no necesita exponer el modelo
completo de Producto.

Esto mantiene desacoplado el frontend
del modelo interno del backend y evita
transportar información innecesaria.
*/
export type StockProduct = {
  id: number;

  nombre: string;

  tipo: "FLOR" | "SEMILLA";

  genetica?: "INDICA" | "SATIVA" | "HIBRIDA";

  unidad_medida: "GRAMOS" | "UNIDADES";

  estado: "ACTIVO" | "INACTIVO";

  imagen_url?: string | null;
};

/*
Representa una fila del inventario operativo.

Cada registro corresponde al stock actual
de un producto administrable.
*/
export type StockItem = {
  producto_id: number;

  producto: StockProduct;

  cantidad_total: number;

  cantidad_reservada: number;

  cantidad_disponible: number;

  fecha_actualizacion: string;
};

/*
Representa las métricas globales del inventario
utilizadas por las KPI del panel administrativo.

Estos valores no se calculan desde la tabla paginada,
sino desde un endpoint específico del backend para
asegurar que siempre representen el estado global
del inventario.
*/
export type StockSummary = {
  productosInventario: number;

  stockFloresDisponible: number;

  stockSemillasDisponible: number;

  productosSinStock: number;
};

/*
Representa la metadata de paginación devuelta
por el backend en consultas administrativas.

La paginación se resuelve en backend para evitar
que el frontend simule páginas con datos parciales
o cargue más información de la necesaria.
*/
export type Pagination = {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
};

/*
Respuesta paginada reutilizable para las consultas
del módulo Stock.
*/
export type PaginatedResult<T> = {
  data: T[];

  pagination: Pagination;
};

/*
Filtros administrativos disponibles para
consultar el inventario actual.
*/
export type StockFilters = {
  search?: string;

  tipo?: "FLOR" | "SEMILLA";

  estado?: "ACTIVO" | "INACTIVO";

  page?: number;

  limit?: number;
};

/*
Filtros administrativos disponibles para
consultar el historial específico de
movimientos de inventario.

El rango de fechas permite acotar búsquedas
históricas sin cargar registros innecesarios
ni obligar al administrador a recorrer grandes
volúmenes de movimientos manualmente.
*/
export type StockMovementFilters = {
  search?: string;

  tipo?: "INGRESO" | "EGRESO" | "AJUSTE";

  referenciaTipo?: "COMPRA" | "VENTA" | "ANULACION_VENTA" | "AJUSTE_MANUAL";

  fechaDesde?: string;

  fechaHasta?: string;

  page?: number;

  limit?: number;
};

/*
Representa un movimiento de stock devuelto
por el historial específico de inventario.
*/
export type StockMovement = {
  producto_id: number;

  producto: StockProduct;

  tipo: "INGRESO" | "EGRESO" | "AJUSTE";

  cantidad: number;

  referencia_tipo:
    | "COMPRA"
    | "VENTA"
    | "ANULACION_VENTA"
    | "AJUSTE_MANUAL"
    | null;

  referencia_id: number | null;

  observaciones: string | null;

  fecha_creacion: string;
};

/*
Payload utilizado para realizar un ajuste
manual de stock.

La variación representa la cantidad que
se desea sumar o restar sobre el stock
actual del producto.

La observación es obligatoria según las
reglas de negocio del backend para mantener
la trazabilidad del inventario.
*/
export type AdjustStockPayload = {
  variacion: number;

  observaciones: string;
};

/*
Respuesta devuelta por el backend al consultar
el resumen global del inventario.
*/
type StockSummaryResponse = {
  message: string;

  resumen: StockSummary;
};

/*
Respuesta devuelta por el backend al consultar
el inventario operativo.

El backend expone la colección bajo la
propiedad "inventario" y agrega metadata
de paginación para navegación real.
*/
type StockResponse = {
  message: string;

  inventario: StockItem[];

  pagination: Pagination;
};

/*
Respuesta devuelta por el backend al consultar
el historial específico de movimientos
de inventario.
*/
type StockMovementsResponse = {
  message: string;

  movimientos: StockMovement[];

  pagination: Pagination;
};

/*
Respuesta devuelta por el backend al realizar
un ajuste manual de stock.
*/
type AdjustStockResponse = {
  message: string;

  stock: StockItem;
};

/*
Centraliza las operaciones HTTP del módulo Stock.

Arquitectura:

Container → Hook → API → httpClient → Backend

Los componentes nunca realizan llamadas HTTP
directamente. Toda la comunicación con el
backend pasa por esta capa.
*/
export const stockApi = {
  /*
  Obtiene el resumen global del inventario.

  Este endpoint alimenta las KPI administrativas
  y evita calcular métricas desde datos paginados.
  */
  async getStockSummary(): Promise<StockSummary> {
    const response = await httpClient<StockSummaryResponse>("/stock/resumen");

    return response.resumen;
  },

  /*
  Obtiene el inventario operativo.

  Si existen filtros administrativos o parámetros
  de paginación, se envían mediante query params
  para que el backend aplique el filtrado y entregue
  un conjunto acotado de registros.
  */
  async getStock(
    filters: StockFilters = {},
  ): Promise<PaginatedResult<StockItem>> {
    const params = new URLSearchParams();

    if (filters.search) {
      params.append("search", filters.search);
    }

    if (filters.tipo) {
      params.append("tipo", filters.tipo);
    }

    if (filters.estado) {
      params.append("estado", filters.estado);
    }

    if (filters.page) {
      params.append("page", String(filters.page));
    }

    if (filters.limit) {
      params.append("limit", String(filters.limit));
    }

    const query = params.toString();

    const response = await httpClient<StockResponse>(
      `/stock${query ? `?${query}` : ""}`,
    );

    return {
      data: response.inventario,
      pagination: response.pagination,
    };
  },

  /*
  Obtiene el historial específico de
  movimientos de inventario.

  Este endpoint pertenece exclusivamente
  al módulo Stock y no representa el futuro
  módulo global de Historial y Trazabilidad.
  */
  async getStockMovements(
    filters: StockMovementFilters = {},
  ): Promise<PaginatedResult<StockMovement>> {
    const params = new URLSearchParams();

    if (filters.search) {
      params.append("search", filters.search);
    }

    if (filters.tipo) {
      params.append("tipo", filters.tipo);
    }

    if (filters.referenciaTipo) {
      params.append("referencia_tipo", filters.referenciaTipo);
    }

    if (filters.fechaDesde) {
      params.append("fecha_desde", filters.fechaDesde);
    }

    if (filters.fechaHasta) {
      params.append("fecha_hasta", filters.fechaHasta);
    }

    if (filters.page) {
      params.append("page", String(filters.page));
    }

    if (filters.limit) {
      params.append("limit", String(filters.limit));
    }

    const query = params.toString();

    const response = await httpClient<StockMovementsResponse>(
      `/stock/movimientos${query ? `?${query}` : ""}`,
    );

    return {
      data: response.movimientos,
      pagination: response.pagination,
    };
  },

  /*
  Realiza un ajuste manual de stock.

  La validación de reglas de negocio
  continúa siendo responsabilidad del backend.
  */
  /*
Realiza un ajuste manual de stock.

La validación de reglas de negocio
continúa siendo responsabilidad del backend.
*/
  async adjustStock(
    productId: number,
    payload: AdjustStockPayload,
  ): Promise<StockItem> {
    const response = await httpClient<AdjustStockResponse>(
      `/stock/${productId}/ajuste`,
      {
        method: "PATCH",
        body: {
          variacion: payload.variacion,
          observaciones: payload.observaciones,
        },
      },
    );

    return response.stock;
  },
};
