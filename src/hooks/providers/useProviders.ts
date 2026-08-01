"use client";

import { useCallback, useRef, useState } from "react";

import {
  type CreateProviderPayload,
  type GetProvidersParams,
  type Provider,
  providersApi,
  type UpdateProviderPayload,
  type UpdateProviderStatusPayload,
} from "@/api/providersApi";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const DEFAULT_PROVIDERS_PARAMS: GetProvidersParams = {};

/* =========================================================
   HOOK PRINCIPAL
========================================================= */

/*
Hook principal del módulo administrativo de Proveedores.

Responsabilidades:
- cargar proveedores;
- aplicar búsqueda y filtro de estado;
- conservar los últimos parámetros utilizados;
- administrar la selección del patrón Master / Detail;
- registrar proveedores;
- actualizar sus datos;
- cambiar su estado lógico;
- sincronizar listado y detalle;
- administrar cargas, errores y feedback.

No contiene JSX.
No conoce componentes visuales.
No realiza solicitudes HTTP directas.
No implementa reglas críticas de negocio.
*/
export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);

  const [selectedProvider, setSelectedProvider] =
    useState<Provider | null>(null);

  /*
  Conserva la última consulta realizada para
  refrescar el listado después de una operación.
  */
  const lastFetchParamsRef = useRef<GetProvidersParams>(
    DEFAULT_PROVIDERS_PARAMS,
  );

  /*
  Conserva la selección sin convertirla
  en dependencia de todas las funciones.
  */
  const selectedProviderIdRef = useRef<number | null>(null);

  /*
  Permite ignorar respuestas antiguas cuando
  existen búsquedas consecutivas.
  */
  const latestRequestIdRef = useRef(0);

  /* =========================================================
     ESTADOS DE CARGA
  ========================================================= */

  const [loadingProviders, setLoadingProviders] = useState(false);

  const [creatingProvider, setCreatingProvider] = useState(false);

  const [updatingProvider, setUpdatingProvider] = useState(false);

  const [updatingProviderStatus, setUpdatingProviderStatus] =
    useState(false);

  /* =========================================================
     ERRORES Y FEEDBACK
  ========================================================= */

  const [providersError, setProvidersError] = useState<
    string | null
  >(null);

  const [actionError, setActionError] = useState<string | null>(
    null,
  );

  const [actionSuccess, setActionSuccess] = useState<
    string | null
  >(null);

  const clearProvidersError = useCallback(() => {
    setProvidersError(null);
  }, []);

  const clearActionFeedback = useCallback(() => {
    setActionError(null);
    setActionSuccess(null);
  }, []);

  /* =========================================================
     SELECCIÓN
  ========================================================= */

  const clearSelectedProvider = useCallback(() => {
    selectedProviderIdRef.current = null;
    setSelectedProvider(null);
  }, []);

  /*
  Selecciona un proveedor utilizando los datos
  completos ya disponibles en el listado.

  No se realiza una solicitud adicional porque
  backend no expone un endpoint de detalle.
  */
  const selectProvider = useCallback(
    (providerId: number): Provider | null => {
      const provider =
        providers.find((item) => item.id === providerId) ?? null;

      selectedProviderIdRef.current = provider?.id ?? null;
      setSelectedProvider(provider);

      return provider;
    },
    [providers],
  );

  /* =========================================================
     LISTADO ADMINISTRATIVO
  ========================================================= */

  /*
  Carga proveedores aplicando búsqueda y estado.

  Mantiene coherente la selección:
  - prioriza un identificador solicitado;
  - conserva la selección actual si sigue visible;
  - selecciona el primer resultado;
  - limpia el detalle cuando no hay resultados.
  */
  const fetchProviders = useCallback(
    async (
      params: GetProvidersParams = DEFAULT_PROVIDERS_PARAMS,
      preferredProviderId?: number,
    ): Promise<Provider[] | null> => {
      const requestId = ++latestRequestIdRef.current;

      try {
        setLoadingProviders(true);
        setProvidersError(null);

        const normalizedParams: GetProvidersParams = {
          search: params.search?.trim() || undefined,
          estado: params.estado,
        };

        lastFetchParamsRef.current = normalizedParams;

        const response =
          await providersApi.getProviders(normalizedParams);

        /*
        Una respuesta anterior no debe sobrescribir
        una búsqueda más reciente.
        */
        if (requestId !== latestRequestIdRef.current) {
          return response;
        }

        setProviders(response);

        const providerIdToPreserve =
          preferredProviderId ??
          selectedProviderIdRef.current;

        const providerToSelect =
          response.find(
            (provider) => provider.id === providerIdToPreserve,
          ) ??
          response[0] ??
          null;

        selectedProviderIdRef.current =
          providerToSelect?.id ?? null;

        setSelectedProvider(providerToSelect);

        return response;
      } catch (error) {
        if (requestId !== latestRequestIdRef.current) {
          return null;
        }

        setProviders([]);
        clearSelectedProvider();

        setProvidersError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los proveedores.",
        );

        return null;
      } finally {
        if (requestId === latestRequestIdRef.current) {
          setLoadingProviders(false);
        }
      }
    },
    [clearSelectedProvider],
  );

  /*
  Refresca el listado conservando búsqueda,
  filtro y selección actuales.
  */
  const refreshProviders = useCallback(
    async (preferredProviderId?: number) => {
      return fetchProviders(
        lastFetchParamsRef.current,
        preferredProviderId,
      );
    },
    [fetchProviders],
  );

  /* =========================================================
     ALTA
  ========================================================= */

  const createProvider = useCallback(
    async (
      payload: CreateProviderPayload,
    ): Promise<Provider | null> => {
      try {
        setCreatingProvider(true);
        clearActionFeedback();

        const createdProvider =
          await providersApi.createProvider(payload);

        await refreshProviders(createdProvider.id);

        setActionSuccess(
          "El proveedor fue registrado correctamente.",
        );

        return createdProvider;
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "No se pudo registrar el proveedor.",
        );

        return null;
      } finally {
        setCreatingProvider(false);
      }
    },
    [clearActionFeedback, refreshProviders],
  );

  /* =========================================================
     EDICIÓN
  ========================================================= */

  const updateProvider = useCallback(
    async (
      providerId: number,
      payload: UpdateProviderPayload,
    ): Promise<Provider | null> => {
      try {
        setUpdatingProvider(true);
        clearActionFeedback();

        const updatedProvider =
          await providersApi.updateProvider(
            providerId,
            payload,
          );

        await refreshProviders(updatedProvider.id);

        setActionSuccess(
          "Los datos del proveedor fueron actualizados correctamente.",
        );

        return updatedProvider;
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "No se pudieron actualizar los datos del proveedor.",
        );

        return null;
      } finally {
        setUpdatingProvider(false);
      }
    },
    [clearActionFeedback, refreshProviders],
  );

  /* =========================================================
     CAMBIO DE ESTADO
  ========================================================= */

  /*
  Cambia el estado lógico del proveedor.

  Backend conserva la responsabilidad sobre:
  - validación del estado;
  - rechazo de cambios redundantes;
  - preservación de compras históricas;
  - auditoría administrativa.
  */
  const updateProviderStatus = useCallback(
    async (
      providerId: number,
      payload: UpdateProviderStatusPayload,
    ): Promise<Provider | null> => {
      try {
        setUpdatingProviderStatus(true);
        clearActionFeedback();

        const updatedProvider =
          await providersApi.updateProviderStatus(
            providerId,
            payload,
          );

        await refreshProviders(updatedProvider.id);

        setActionSuccess(
          "El estado del proveedor fue actualizado correctamente.",
        );

        return updatedProvider;
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el estado del proveedor.",
        );

        return null;
      } finally {
        setUpdatingProviderStatus(false);
      }
    },
    [clearActionFeedback, refreshProviders],
  );

  return {
    providers,
    selectedProvider,

    loadingProviders,
    creatingProvider,
    updatingProvider,
    updatingProviderStatus,

    providersError,
    actionError,
    actionSuccess,

    fetchProviders,
    refreshProviders,
    selectProvider,
    clearSelectedProvider,

    createProvider,
    updateProvider,
    updateProviderStatus,

    clearProvidersError,
    clearActionFeedback,
  };
}