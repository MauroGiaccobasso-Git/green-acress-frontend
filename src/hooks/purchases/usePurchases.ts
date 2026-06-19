"use client";

import { useCallback, useState } from "react";

import {
  CreatePurchasePayload,
  Purchase,
  purchasesApi,
} from "@/api/purchasesApi";
import { Product, productsApi } from "@/api/productsApi";
import { Provider, providersApi } from "@/api/providersApi";

/*
Hook especializado encargado de administrar
la lógica relacionada al módulo de compras.

Su responsabilidad es:

- obtener proveedores

- obtener productos

- registrar compras

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
  const [providers, setProviders] =
    useState<Provider[]>([]);

  /*
  Productos obtenidos desde backend.

  Posteriormente el container filtrará
  únicamente semillas para respetar
  las reglas del módulo.
  */
  const [products, setProducts] =
    useState<Product[]>([]);

  /*
  Almacena la última compra registrada.

  Permite mostrar feedback visual
  luego de una operación exitosa.
  */
  const [createdPurchase, setCreatedPurchase] =
    useState<Purchase | null>(null);

  /*
  Indica cuándo existe una solicitud
  de carga en ejecución.
  */
  const [loading, setLoading] =
    useState(false);

  /*
  Indica cuándo se está registrando
  una compra.
  */
  const [submitting, setSubmitting] =
    useState(false);

  /*
  Guarda errores producidos durante
  operaciones del módulo.
  */
  const [error, setError] =
    useState<string | null>(null);

  /*
  Obtiene proveedores y productos
  necesarios para construir el formulario.

  Ambas consultas se ejecutan en paralelo
  para reducir tiempos de espera.
  */
  const fetchPurchaseOptions =
    useCallback(
      async (): Promise<void> => {
        try {
          setLoading(true);
          setError(null);

          const [
            providersData,
            productsData,
          ] = await Promise.all([
            providersApi.getProviders(),
            productsApi.getProducts(),
          ]);

          setProviders(providersData);
          setProducts(productsData);
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Error al cargar datos para compras"
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  /*
  Registra una nueva compra.

  El backend se encarga de:

  - incrementar stock

  - generar movimientos

  - registrar auditoría

  - validar reglas de negocio
  */
  const createPurchase =
    useCallback(
      async (
        payload: CreatePurchasePayload
      ): Promise<Purchase | null> => {
        try {
          setSubmitting(true);
          setError(null);

          const purchase =
            await purchasesApi
              .createPurchase(payload);

          setCreatedPurchase(purchase);

          return purchase;
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Error al registrar compra"
          );

          return null;
        } finally {
          setSubmitting(false);
        }
      },
      []
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
    error,
    fetchPurchaseOptions,
    createPurchase,
    clearError,
    clearCreatedPurchase,
  };
}