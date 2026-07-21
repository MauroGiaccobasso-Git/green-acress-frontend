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
  type PurchaseProductOption,
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

- obtener semillas habilitadas para compras

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
  Productos habilitados para registrar compras.

  El backend aplica las reglas correspondientes
  y devuelve un contrato operativo reducido
  para el formulario de compras.
  */
  const [products, setProducts] = useState<PurchaseProductOption[]>([]);

  const [createdPurchase, setCreatedPurchase] = useState<Purchase | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [creatingSeed, setCreatingSeed] = useState(false);
  const [creatingProvider, setCreatingProvider] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
  Obtiene proveedores y semillas habilitadas
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
        productsApi.getPurchaseProductOptions(),
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

  /*
  Crea una nueva semilla desde el flujo de compras.

  createProduct devuelve el contrato administrativo
  completo del producto creado.

  Después de crearla, se vuelve a consultar el endpoint
  operativo de compras para mantener products alineado
  con PurchaseProductOption y evitar mezclar contratos.
  */
  const createSeedProduct = useCallback(
    async (payload: CreateProductPayload): Promise<Product | null> => {
      try {
        setCreatingSeed(true);
        setError(null);

        const createdProduct = await productsApi.createProduct(payload);
        const purchaseProducts = await productsApi.getPurchaseProductOptions();

        setProducts(purchaseProducts);

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