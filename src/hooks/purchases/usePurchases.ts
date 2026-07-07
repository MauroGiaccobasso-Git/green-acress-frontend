"use client";

import { useCallback, useState } from "react";

import {
  type CreatePurchasePayload,
  type Purchase,
  purchasesApi,
} from "@/api/purchasesApi";
import {
  type CreateProductPayload,
  type Product,
  productsApi,
} from "@/api/productsApi";
import {
  type CreateProviderPayload,
  type Provider,
  providersApi,
} from "@/api/providersApi";

/*
Hook especializado encargado de administrar
la lógica relacionada al módulo de compras.

Su responsabilidad es:

- obtener proveedores

- obtener semillas activas

- registrar compras

- crear semillas desde el flujo de compras

- crear proveedores desde el flujo de compras

- administrar loading

- administrar errores

- exponer funciones reutilizables
  para consumir desde containers

Este hook NO renderiza componentes.

Este hook NO construye interfaz.

Este hook NO realiza fetch directo.

Toda comunicación ocurre mediante
las capas API.
*/
export function usePurchases() {
  const [providers, setProviders] = useState<Provider[]>([]);

  /*
  Productos tipo SEMILLA obtenidos desde backend.

  El módulo de compras solo opera con semillas,
  por lo que la consulta se realiza mediante
  getProductOptions: una colección simple para
  selects y no un listado administrativo paginado.
  */
  const [products, setProducts] = useState<Product[]>([]);

  const [createdPurchase, setCreatedPurchase] = useState<Purchase | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [creatingSeed, setCreatingSeed] = useState(false);
  const [creatingProvider, setCreatingProvider] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
  Obtiene proveedores y semillas activas
  necesarias para construir el formulario.

  Ambas consultas se ejecutan en paralelo
  para reducir tiempos de espera.
  */
  const fetchPurchaseOptions = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const [providersData, productsData] = await Promise.all([
        providersApi.getProviders(),
        productsApi.getProductOptions({
          tipo: "SEMILLA",
          estado: "ACTIVO",
          limit: 50,
        }),
      ]);

      setProviders(providersData);
      setProducts(productsData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al cargar datos para compras",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createPurchase = useCallback(
    async (payload: CreatePurchasePayload): Promise<Purchase | null> => {
      try {
        setSubmitting(true);
        setError(null);

        const purchase = await purchasesApi.createPurchase(payload);

        setCreatedPurchase(purchase);

        return purchase;
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error al registrar compra",
        );

        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  const createSeedProduct = useCallback(
    async (payload: CreateProductPayload): Promise<Product | null> => {
      try {
        setCreatingSeed(true);
        setError(null);

        const createdProduct = await productsApi.createProduct(payload);

        setProducts((currentProducts) => [createdProduct, ...currentProducts]);

        return createdProduct;
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error al crear la semilla",
        );

        return null;
      } finally {
        setCreatingSeed(false);
      }
    },
    [],
  );

  const createProvider = useCallback(
    async (payload: CreateProviderPayload): Promise<Provider | null> => {
      try {
        setCreatingProvider(true);
        setError(null);

        const createdProvider = await providersApi.createProvider(payload);

        setProviders((currentProviders) => [
          createdProvider,
          ...currentProviders,
        ]);

        return createdProvider;
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error al crear el proveedor",
        );

        return null;
      } finally {
        setCreatingProvider(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCreatedPurchase = useCallback(() => {
    setCreatedPurchase(null);
  }, []);

  return {
    providers,
    products,
    createdPurchase,
    loading,
    submitting,
    creatingSeed,
    creatingProvider,
    error,
    fetchPurchaseOptions,
    createPurchase,
    createSeedProduct,
    createProvider,
    clearError,
    clearCreatedPurchase,
  };
}