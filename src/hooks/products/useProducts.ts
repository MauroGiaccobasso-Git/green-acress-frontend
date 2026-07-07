"use client";

import { useCallback, useRef, useState } from "react";

import {
  type CreateProductPayload,
  type GetProductsParams,
  type Product,
  type ProductsPagination,
  productsApi,
  type UpdateProductPayload,
  type UpdateProductStatusPayload,
} from "@/api/productsApi";

const DEFAULT_PRODUCTS_PAGINATION: ProductsPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

/*
Hook especializado encargado de administrar
la lógica relacionada al listado administrativo
de productos.

Su responsabilidad es:

- solicitar productos al backend

- almacenar productos cargados

- administrar filtros y paginación backend

- administrar loading

- administrar errores

- exponer funciones reutilizables
  para consumir desde containers

Este hook NO renderiza componentes.

Este hook NO construye interfaz.

Este hook NO realiza fetch directo.

Toda comunicación ocurre mediante
productsApi.
*/
export function useProducts() {
  /*
  Almacena productos obtenidos
  desde backend.

  El container consumirá este estado
  para renderizar cards, tablas
  o cualquier representación visual.
  */
  const [products, setProducts] = useState<Product[]>([]);

  /*
  Almacena información de paginación
  devuelta por backend.

  La paginación no se calcula en frontend
  para evitar trabajar sobre listados
  incompletos o inconsistentes.
  */
  const [pagination, setPagination] = useState<ProductsPagination>(
    DEFAULT_PRODUCTS_PAGINATION,
  );

  /*
  Conserva los últimos parámetros utilizados
  para poder refrescar el listado luego de
  altas, ediciones o cambios de estado.
  */
  const lastFetchParamsRef = useRef<GetProductsParams>({
    page: 1,
    limit: 10,
  });

  /*
  Indica cuándo existe una solicitud
  en ejecución.

  Permite que la interfaz pueda:

  - mostrar spinner

  - bloquear acciones

  - mostrar mensajes de carga
  */
  const [loading, setLoading] = useState(false);

  /*
  Guarda mensajes de error producidos
  durante solicitudes.

  El container puede utilizar esto
  para renderizar mensajes amigables
  para el usuario.
  */
  const [error, setError] = useState<string | null>(null);

  /*
  Función reutilizable encargada
  de consultar productos.

  Recibe búsqueda, filtros y paginación
  para delegar la consulta real al backend.
  */
  const fetchProducts = useCallback(
    async (params: GetProductsParams = {}): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const normalizedParams: GetProductsParams = {
          search: params.search,
          tipo: params.tipo,
          estado: params.estado,
          genetica: params.genetica,
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        };

        lastFetchParamsRef.current = normalizedParams;

        const response = await productsApi.getProducts(normalizedParams);

        setProducts(response.data);
        setPagination(response.pagination);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error al cargar productos",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /*
  Refresca el listado utilizando los últimos
  filtros y parámetros de paginación aplicados.
  */
  const refreshProducts = useCallback(async (): Promise<void> => {
    await fetchProducts(lastFetchParamsRef.current);
  }, [fetchProducts]);

  /*
  Función reutilizable encargada
  de registrar un nuevo producto.

  El hook delega la comunicación
  HTTP en productsApi y luego
  refresca el listado desde backend.

  No contiene reglas de negocio.
  Las validaciones definitivas
  permanecen en el backend.
  */
  const createProduct = useCallback(
    async (payload: CreateProductPayload): Promise<Product | null> => {
      try {
        setLoading(true);
        setError(null);

        const createdProduct = await productsApi.createProduct(payload);

        await fetchProducts({
          ...lastFetchParamsRef.current,
          page: 1,
        });

        return createdProduct;
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error al registrar producto",
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts],
  );

  /*
  Función reutilizable encargada
  de actualizar los datos editables
  de un producto existente.

  No modifica el estado lógico.
  La activación o inactivación se
  gestiona mediante updateProductStatus.
  */
  const updateProduct = useCallback(
    async (
      productId: number,
      payload: UpdateProductPayload,
    ): Promise<Product | null> => {
      try {
        setLoading(true);
        setError(null);

        const updatedProduct = await productsApi.updateProduct(
          productId,
          payload,
        );

        await refreshProducts();

        return updatedProduct;
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error al actualizar producto",
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    [refreshProducts],
  );

  /*
  Función reutilizable encargada
  de actualizar el estado lógico
  de un producto.

  Se utiliza para activar o inactivar
  productos sin eliminarlos físicamente,
  respetando la baja lógica definida
  para el módulo.
  */
  const updateProductStatus = useCallback(
    async (
      productId: number,
      payload: UpdateProductStatusPayload,
    ): Promise<Product | null> => {
      try {
        setLoading(true);
        setError(null);

        const updatedProduct = await productsApi.updateProductStatus(
          productId,
          payload,
        );

        await refreshProducts();

        return updatedProduct;
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error al actualizar estado del producto",
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    [refreshProducts],
  );

  return {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
    refreshProducts,
    createProduct,
    updateProduct,
    updateProductStatus,
  };
}