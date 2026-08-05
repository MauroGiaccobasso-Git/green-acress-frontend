"use client";

import { useCallback, useRef, useState } from "react";

import {
  type CreateProductPayload,
  type GetProductsParams,
  type Product,
  type ProductImageFile,
  type ProductsPagination,
  productsApi,
  type UpdateProductPayload,
  type UpdateProductStatusPayload,
} from "@/api/productsApi";

/* =========================================================
   ESTADOS INICIALES
========================================================= */

const DEFAULT_PRODUCTS_PAGINATION: ProductsPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

/* =========================================================
   HELPERS
========================================================= */

// Obtiene un mensaje seguro y consistente para los errores
// producidos durante las operaciones del módulo.
const getErrorMessage = (error: unknown, fallbackMessage: string): string =>
  error instanceof Error ? error.message : fallbackMessage;

/*
Normaliza los parámetros utilizados por el listado administrativo.

La paginación siempre dispone de valores válidos aunque el container
no los envíe explícitamente.
*/
const normalizeProductsParams = (
  params: GetProductsParams = {},
): GetProductsParams => ({
  search: params.search,
  tipo: params.tipo,
  estado: params.estado,
  genetica: params.genetica,
  page: params.page ?? 1,
  limit: params.limit ?? 10,
});

/* =========================================================
   HOOK PRINCIPAL
========================================================= */

/*
Hook especializado encargado de administrar
la lógica del módulo administrativo de Productos.

Responsabilidades:

- solicitar productos al backend;
- almacenar el listado y su paginación;
- conservar los últimos filtros aplicados;
- registrar productos con imagen opcional;
- actualizar productos con imagen opcional;
- modificar el estado lógico;
- separar la carga del listado de las operaciones de guardado;
- evitar que respuestas antiguas sobrescriban búsquedas recientes;
- exponer errores de consulta y de acciones por separado.

Este hook:

- no renderiza componentes;
- no construye interfaz;
- no realiza fetch directo;
- no contiene reglas críticas de negocio.

Toda comunicación ocurre mediante productsApi.
*/
export function useProducts() {
  /* =========================================================
     ESTADO DEL LISTADO
  ========================================================= */

  const [products, setProducts] = useState<Product[]>([]);

  const [pagination, setPagination] = useState<ProductsPagination>(
    DEFAULT_PRODUCTS_PAGINATION,
  );

  /*
  Conserva los últimos parámetros utilizados para refrescar
  el listado después de altas, ediciones o cambios de estado.
  */
  const lastFetchParamsRef = useRef<GetProductsParams>({
    page: 1,
    limit: 10,
  });

  /*
  Identifica la solicitud de listado más reciente.

  Si una búsqueda anterior termina después de una nueva,
  su respuesta se descarta para evitar mostrar resultados obsoletos.
  */
  const latestFetchRequestRef = useRef(0);

  /* =========================================================
     ESTADOS DE CARGA
  ========================================================= */

  // Se utiliza únicamente para la carga del listado.
  const [loading, setLoading] = useState(false);

  // Se utiliza durante el alta o la edición de un producto.
  const [submitting, setSubmitting] = useState(false);

  // Se utiliza exclusivamente durante el cambio de estado lógico.
  const [updatingStatus, setUpdatingStatus] = useState(false);

  /* =========================================================
     ESTADOS DE ERROR
  ========================================================= */

  // Error asociado a la consulta del listado.
  const [error, setError] = useState<string | null>(null);

  // Error asociado a crear, editar o cambiar el estado.
  const [actionError, setActionError] = useState<string | null>(null);

  /* =========================================================
     CONSULTAS INTERNAS
  ========================================================= */

  /*
  Ejecuta la consulta real del listado.

  showLoading permite refrescar silenciosamente después de una
  operación sin reemplazar toda la pantalla por un spinner.
  */
  const loadProducts = useCallback(
    async (
      params: GetProductsParams = {},
      showLoading = true,
    ): Promise<boolean> => {
      const normalizedParams = normalizeProductsParams(params);
      const requestId = latestFetchRequestRef.current + 1;

      latestFetchRequestRef.current = requestId;
      lastFetchParamsRef.current = normalizedParams;

      if (showLoading) {
        setLoading(true);
      }

      setError(null);

      try {
        const response = await productsApi.getProducts(normalizedParams);

        /*
        Solo la solicitud más reciente puede actualizar la pantalla.
        */
        if (requestId === latestFetchRequestRef.current) {
          setProducts(response.data);
          setPagination(response.pagination);
        }

        return true;
      } catch (error) {
        if (requestId === latestFetchRequestRef.current) {
          setError(
            getErrorMessage(error, "Error al cargar productos."),
          );
        }

        return false;
      } finally {
        /*
        La solicitud más reciente es también la responsable
        de cerrar cualquier estado de carga pendiente.
        */
        if (requestId === latestFetchRequestRef.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  /* =========================================================
     CONSULTAS PÚBLICAS
  ========================================================= */

  /*
  Consulta productos aplicando búsqueda, filtros y paginación.

  El container utiliza esta función para las cargas visibles
  iniciadas por navegación, búsqueda o filtros.
  */
  const fetchProducts = useCallback(
    async (params: GetProductsParams = {}): Promise<void> => {
      await loadProducts(params, true);
    },
    [loadProducts],
  );

  /*
  Refresca silenciosamente el listado utilizando los últimos
  parámetros aplicados.

  Se utiliza después de operaciones exitosas para conservar
  búsqueda, filtros y página actual.
  */
  const refreshProducts = useCallback(async (): Promise<void> => {
    await loadProducts(lastFetchParamsRef.current, false);
  }, [loadProducts]);

  /* =========================================================
     OPERACIONES ADMINISTRATIVAS
  ========================================================= */

  /*
  Registra un nuevo producto.

  La imagen es opcional y se mantiene separada del payload
  de negocio para que productsApi construya FormData.
  */
  const createProduct = useCallback(
    async (
      payload: CreateProductPayload,
      imageFile: ProductImageFile = null,
    ): Promise<Product | null> => {
      try {
        setSubmitting(true);
        setActionError(null);

        const createdProduct = await productsApi.createProduct(
          payload,
          imageFile,
        );

        await loadProducts(lastFetchParamsRef.current, false);

        return createdProduct;
      } catch (error) {
        setActionError(
          getErrorMessage(error, "Error al registrar producto."),
        );

        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [loadProducts],
  );

  /*
  Actualiza los datos editables de un producto existente.

  Si se recibe una imagen nueva, productsApi la adjunta al
  formulario multipart para reemplazar la imagen anterior.
  */
  const updateProduct = useCallback(
    async (
      productId: number,
      payload: UpdateProductPayload,
      imageFile: ProductImageFile = null,
    ): Promise<Product | null> => {
      try {
        setSubmitting(true);
        setActionError(null);

        const updatedProduct = await productsApi.updateProduct(
          productId,
          payload,
          imageFile,
        );

        await loadProducts(lastFetchParamsRef.current, false);

        return updatedProduct;
      } catch (error) {
        setActionError(
          getErrorMessage(error, "Error al actualizar producto."),
        );

        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [loadProducts],
  );

  /*
  Actualiza el estado lógico de un producto.

  La activación o inactivación permanece separada de la edición
  general porque utiliza un endpoint específico del backend.
  */
  const updateProductStatus = useCallback(
    async (
      productId: number,
      payload: UpdateProductStatusPayload,
    ): Promise<Product | null> => {
      try {
        setUpdatingStatus(true);
        setActionError(null);

        const updatedProduct = await productsApi.updateProductStatus(
          productId,
          payload,
        );

        await loadProducts(lastFetchParamsRef.current, false);

        return updatedProduct;
      } catch (error) {
        setActionError(
          getErrorMessage(
            error,
            "Error al actualizar el estado del producto.",
          ),
        );

        return null;
      } finally {
        setUpdatingStatus(false);
      }
    },
    [loadProducts],
  );

  /* =========================================================
     LIMPIEZA DE FEEDBACK
  ========================================================= */

  const clearActionError = useCallback(() => {
    setActionError(null);
  }, []);

  return {
    products,
    pagination,

    loading,
    submitting,
    updatingStatus,

    error,
    actionError,

    fetchProducts,
    refreshProducts,
    createProduct,
    updateProduct,
    updateProductStatus,

    clearActionError,
  };
}