"use client";

import { useCallback, useState } from "react";

import {
  CreatePurchasePayload,
  Purchase,
  purchasesApi,
} from "@/api/purchasesApi";
import { CreateProductPayload, Product, productsApi } from "@/api/productsApi";
import {
  CreateProviderPayload,
  Provider,
  providersApi,
} from "@/api/providersApi";

/*
Hook especializado encargado de administrar
la lógica relacionada al módulo de compras.

Su responsabilidad es:

- obtener proveedores

- obtener productos

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
  /*
  Proveedores disponibles para registrar
  compras.

  El container utilizará esta colección
  para construir el selector de proveedor.
  */
  const [providers, setProviders] = useState<Provider[]>([]);

  /*
  Productos obtenidos desde backend.

  Posteriormente el container filtrará
  únicamente semillas para respetar
  las reglas del módulo.
  */
  const [products, setProducts] = useState<Product[]>([]);

  /*
  Almacena la última compra registrada.

  Permite mostrar feedback visual
  luego de una operación exitosa.
  */
  const [createdPurchase, setCreatedPurchase] = useState<Purchase | null>(null);

  /*
  Indica cuándo existe una solicitud
  de carga en ejecución.
  */
  const [loading, setLoading] = useState(false);

  /*
  Indica cuándo se está registrando
  una compra.
  */
  const [submitting, setSubmitting] = useState(false);

  /*
  Indica cuándo se está creando una
  semilla desde el flujo de compras.
  */
  const [creatingSeed, setCreatingSeed] = useState(false);

  /*
  Indica cuándo se está creando un
  proveedor desde el flujo de compras.
  */
  const [creatingProvider, setCreatingProvider] = useState(false);

  /*
  Guarda errores producidos durante
  operaciones del módulo.
  */
  const [error, setError] = useState<string | null>(null);

  /*
  Obtiene proveedores y productos
  necesarios para construir el formulario.

  Ambas consultas se ejecutan en paralelo
  para reducir tiempos de espera.
  */
  const fetchPurchaseOptions = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const [providersData, productsData] = await Promise.all([
        providersApi.getProviders(),
        productsApi.getProducts(),
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

  /*
  Registra una nueva compra.

  El backend se encarga de:

  - incrementar stock

  - generar movimientos

  - registrar auditoría

  - validar reglas de negocio
  */
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
  Crea una nueva semilla desde el flujo
  de compras.

  La creación continúa usando el módulo
  de productos, pero se expone desde este
  hook para mantener el container sin
  llamadas HTTP directas.

  Luego de crearla, se agrega al estado
  local para que el selector la muestre
  inmediatamente sin recargar la pantalla.
  */
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

  /*
  Crea un nuevo proveedor desde el flujo
  de compras.

  La creación continúa usando la API de
  proveedores, pero se expone desde este
  hook para mantener el container sin
  llamadas HTTP directas.

  Luego de crearlo, se agrega al estado
  local para que el selector lo muestre
  inmediatamente sin recargar la pantalla.
  */
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

  /*
  Permite limpiar errores desde
  la interfaz.
  */
  const clearError = () => {
    setError(null);
  };

  /*
  Permite limpiar la compra registrada
  luego de mostrar feedback al usuario.
  */
  const clearCreatedPurchase = () => {
    setCreatedPurchase(null);
  };

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