"use client";

import { useCallback, useState } from "react";

import {
  type CreateProductPayload,
  type Product,
  productsApi,
  type UpdateProductPayload,
  type UpdateProductStatusPayload,
} from "@/api/productsApi";

/*
Hook especializado encargado de administrar
la lógica relacionada al listado administrativo
de productos.

Su responsabilidad es:

- solicitar productos al backend

- almacenar productos cargados

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
  */
  const fetchProducts = useCallback(async (search?: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const data = await productsApi.getProducts(search);

      setProducts(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al cargar productos",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
  Función reutilizable encargada
  de registrar un nuevo producto.

  El hook delega la comunicación
  HTTP en productsApi y luego
  agrega el producto creado al
  estado local del listado.

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

        setProducts((currentProducts) => [createdProduct, ...currentProducts]);

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
    [],
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

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === productId ? updatedProduct : product,
          ),
        );

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
    [],
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

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === productId ? updatedProduct : product,
          ),
        );

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
    [],
  );

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    updateProductStatus,
  };
}
