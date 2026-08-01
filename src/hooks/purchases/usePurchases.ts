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
la lógica operativa del módulo de Compras.

Responsabilidades:
- obtener proveedores activos disponibles para nuevas compras;
- obtener semillas habilitadas para compras;
- registrar compras;
- crear semillas desde el flujo de compras;
- crear proveedores desde el flujo de compras;
- administrar estados de carga y errores.

Este hook:
- no renderiza componentes;
- no construye interfaz;
- no realiza solicitudes HTTP directas;
- no contiene la gestión administrativa completa de proveedores.

Toda comunicación ocurre mediante las capas API.
*/
export function usePurchases() {
  /*
  Compras solamente necesita proveedores activos.

  La gestión completa de proveedores, incluyendo
  inactivos, edición y cambios de estado, pertenece
  exclusivamente al módulo administrativo.
  */
  const [providers, setProviders] = useState<Provider[]>([]);

  /*
  Productos habilitados para registrar compras.

  Backend devuelve un contrato operativo reducido
  específico para este flujo.
  */
  const [products, setProducts] = useState<PurchaseProductOption[]>([]);

  const [createdPurchase, setCreatedPurchase] =
    useState<Purchase | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [creatingSeed, setCreatingSeed] = useState(false);
  const [creatingProvider, setCreatingProvider] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
  Obtiene las opciones necesarias para construir
  el formulario de compra.

  Ambas solicitudes se ejecutan en paralelo.

  Los proveedores se solicitan ya filtrados como
  ACTIVO para no duplicar reglas ni filtros en la UI.
  */
  const fetchPurchaseOptions = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const [providersData, productsData] = await Promise.all([
        providersApi.getProviders({
          estado: "ACTIVO",
        }),
        productsApi.getPurchaseProductOptions(),
      ]);

      setProviders(providersData);
      setProducts(productsData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al cargar los datos necesarios para la compra.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
  Registra una nueva compra.
  */
  const createPurchase = useCallback(
    async (
      payload: CreatePurchasePayload,
    ): Promise<Purchase | null> => {
      try {
        setSubmitting(true);
        setError(null);

        const purchase =
          await purchasesApi.createPurchase(payload);

        setCreatedPurchase(purchase);

        return purchase;
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error al registrar la compra.",
        );

        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  /*
  Crea una nueva semilla desde el flujo de Compras.

  Después del alta se vuelve a consultar el endpoint
  operativo para conservar el contrato
  PurchaseProductOption y evitar mezclar modelos.
  */
  const createSeedProduct = useCallback(
    async (
      payload: CreateProductPayload,
    ): Promise<Product | null> => {
      try {
        setCreatingSeed(true);
        setError(null);

        const createdProduct =
          await productsApi.createProduct(payload);

        const purchaseProducts =
          await productsApi.getPurchaseProductOptions();

        setProducts(purchaseProducts);

        return createdProduct;
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error al crear la semilla.",
        );

        return null;
      } finally {
        setCreatingSeed(false);
      }
    },
    [],
  );

  /*
  Crea un proveedor completo desde el flujo de Compras.

  Backend asigna el estado inicial ACTIVO.
  El proveedor se incorpora localmente al listado y se
  mantiene el orden alfabético utilizado por la pantalla.

  La edición y el cambio de estado permanecen bajo
  responsabilidad del módulo administrativo de Proveedores.
  */
  const createProvider = useCallback(
    async (
      payload: CreateProviderPayload,
    ): Promise<Provider | null> => {
      try {
        setCreatingProvider(true);
        setError(null);

        const createdProvider =
          await providersApi.createProvider(payload);

        setProviders((currentProviders) =>
          [...currentProviders, createdProvider].sort(
            (firstProvider, secondProvider) =>
              firstProvider.nombre.localeCompare(
                secondProvider.nombre,
                "es",
                {
                  sensitivity: "base",
                },
              ),
          ),
        );

        return createdProvider;
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error al crear el proveedor.",
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