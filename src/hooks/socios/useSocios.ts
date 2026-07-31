"use client";

import { useCallback, useRef, useState } from "react";

import {
  type CreateSocioPayload,
  type GetSociosParams,
  type Socio,
  type SociosPagination,
  sociosApi,
  type UpdateSocioPayload,
  type UpdateSocioStatusPayload,
} from "@/api/sociosApi";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const DEFAULT_SOCIOS_PAGINATION: SociosPagination = {
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const DEFAULT_SOCIOS_PARAMS: GetSociosParams = {
  page: 1,
  limit: 5,
};

/* =========================================================
   HOOK PRINCIPAL
========================================================= */

/*
Hook principal del módulo administrativo de Socios.

Responsabilidades:
- cargar el listado paginado;
- aplicar búsqueda y filtros backend;
- conservar los últimos parámetros utilizados;
- obtener y mantener el socio seleccionado;
- registrar nuevos socios;
- actualizar datos personales;
- cambiar estados funcionales;
- sincronizar listado y detalle después de cada acción;
- administrar loading, errores y feedback.

No contiene JSX.
No conoce componentes visuales.
No realiza solicitudes HTTP directas.
No implementa reglas críticas de negocio.
*/
export function useSocios() {
  /*
  Listado administrativo correspondiente
  a la página y filtros actuales.
  */
  const [socios, setSocios] = useState<Socio[]>([]);

  /*
  Socio actualmente seleccionado dentro
  del patrón Master / Detail.
  */
  const [selectedSocio, setSelectedSocio] =
    useState<Socio | null>(null);

  /*
  Información de paginación entregada
  directamente por backend.
  */
  const [pagination, setPagination] = useState<SociosPagination>(
    DEFAULT_SOCIOS_PAGINATION,
  );

  /*
  Conserva la última consulta realizada para
  refrescar el listado luego de una acción.
  */
  const lastFetchParamsRef = useRef<GetSociosParams>(
    DEFAULT_SOCIOS_PARAMS,
  );

  /*
  Conserva el identificador seleccionado sin
  convertir selectedSocio en dependencia de
  todas las funciones de carga.
  */
  const selectedSocioIdRef = useRef<number | null>(null);

  /* =========================================================
     ESTADOS DE CARGA
  ========================================================= */

  const [loadingSocios, setLoadingSocios] = useState(false);

  const [loadingDetail, setLoadingDetail] = useState(false);

  const [creatingSocio, setCreatingSocio] = useState(false);

  const [updatingSocio, setUpdatingSocio] = useState(false);

  const [updatingSocioStatus, setUpdatingSocioStatus] =
    useState(false);

  /* =========================================================
     ERRORES Y FEEDBACK
  ========================================================= */

  const [sociosError, setSociosError] = useState<string | null>(
    null,
  );

  const [detailError, setDetailError] = useState<string | null>(
    null,
  );

  const [actionError, setActionError] = useState<string | null>(
    null,
  );

  const [actionSuccess, setActionSuccess] = useState<
    string | null
  >(null);

  /*
  Limpia los mensajes generados por altas,
  ediciones o cambios de estado.
  */
  const clearActionFeedback = useCallback(() => {
    setActionError(null);
    setActionSuccess(null);
  }, []);

  /*
  Limpia únicamente el error asociado
  al listado administrativo.
  */
  const clearSociosError = useCallback(() => {
    setSociosError(null);
  }, []);

  /*
  Limpia únicamente el error del panel
  de detalle.
  */
  const clearDetailError = useCallback(() => {
    setDetailError(null);
  }, []);

  /* =========================================================
     SELECCIÓN Y DETALLE
  ========================================================= */

  /*
  Limpia completamente la selección actual.

  Se utiliza cuando el listado queda vacío
  o cuando el socio seleccionado deja de estar
  visible por los filtros aplicados.
  */
  const clearSelectedSocio = useCallback(() => {
    selectedSocioIdRef.current = null;

    setSelectedSocio(null);
    setDetailError(null);
  }, []);

  /*
  Obtiene el detalle administrativo completo
  de un socio.
  */
  const fetchSocioById = useCallback(
    async (socioId: number): Promise<Socio | null> => {
      try {
        setLoadingDetail(true);
        setDetailError(null);

        const socio = await sociosApi.getSocioById(socioId);

        selectedSocioIdRef.current = socio.id;
        setSelectedSocio(socio);

        return socio;
      } catch (error) {
        selectedSocioIdRef.current = null;
        setSelectedSocio(null);

        setDetailError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar el detalle del socio.",
        );

        return null;
      } finally {
        setLoadingDetail(false);
      }
    },
    [],
  );

  /*
  Selecciona un socio desde el listado.

  Evita repetir la consulta cuando el socio
  ya se encuentra seleccionado y cargado.
  */
  const selectSocio = useCallback(
    async (socioId: number): Promise<Socio | null> => {
      if (
        selectedSocioIdRef.current === socioId &&
        selectedSocio
      ) {
        return selectedSocio;
      }

      return fetchSocioById(socioId);
    },
    [fetchSocioById, selectedSocio],
  );

  /* =========================================================
     LISTADO ADMINISTRATIVO
  ========================================================= */

  /*
  Carga socios utilizando búsqueda, filtros
  y paginación administrada por backend.

  Luego mantiene coherente el panel de detalle:
  - conserva la selección si sigue visible;
  - selecciona el primer resultado disponible;
  - limpia el detalle cuando no hay resultados.
  */
  const fetchSocios = useCallback(
    async (
      params: GetSociosParams = DEFAULT_SOCIOS_PARAMS,
    ): Promise<Socio[] | null> => {
      try {
        setLoadingSocios(true);
        setSociosError(null);

        const normalizedParams: GetSociosParams = {
          search: params.search?.trim() || undefined,
          estado: params.estado,
          estadoUsuario: params.estadoUsuario,
          page: params.page ?? 1,
          limit: params.limit ?? 5,
        };

        lastFetchParamsRef.current = normalizedParams;

        const response =
          await sociosApi.getSocios(normalizedParams);

        setSocios(response.socios);
        setPagination(response.pagination);

        const selectedSocioId =
          selectedSocioIdRef.current;

        const selectedSocioStillVisible =
          selectedSocioId !== null &&
          response.socios.some(
            (socio) => socio.id === selectedSocioId,
          );

        if (selectedSocioStillVisible) {
          await fetchSocioById(selectedSocioId);
        } else if (response.socios.length > 0) {
          await fetchSocioById(response.socios[0].id);
        } else {
          clearSelectedSocio();
        }

        return response.socios;
      } catch (error) {
        setSocios([]);
        setPagination(DEFAULT_SOCIOS_PAGINATION);

        clearSelectedSocio();

        setSociosError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los socios.",
        );

        return null;
      } finally {
        setLoadingSocios(false);
      }
    },
    [clearSelectedSocio, fetchSocioById],
  );

  /*
  Refresca el listado manteniendo los últimos
  filtros y la página actualmente aplicada.
  */
  const refreshSocios = useCallback(async () => {
    return fetchSocios(lastFetchParamsRef.current);
  }, [fetchSocios]);

  /* =========================================================
     ALTA
  ========================================================= */

  /*
  Registra un nuevo socio.

  La contraseña temporal, su vencimiento y el
  envío del correo son responsabilidad backend.
  */
  const createSocio = useCallback(
    async (
      payload: CreateSocioPayload,
    ): Promise<Socio | null> => {
      try {
        setCreatingSocio(true);
        clearActionFeedback();

        const createdSocio =
          await sociosApi.createSocio(payload);

        await fetchSocios({
          ...lastFetchParamsRef.current,
          page: 1,
        });

        setActionSuccess(
          "El socio fue registrado correctamente.",
        );

        return createdSocio;
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "No se pudo registrar el socio.",
        );

        return null;
      } finally {
        setCreatingSocio(false);
      }
    },
    [clearActionFeedback, fetchSocios],
  );

  /* =========================================================
     EDICIÓN
  ========================================================= */

  /*
  Actualiza los datos personales y de acceso
  permitidos para un socio existente.
  */
  const updateSocio = useCallback(
    async (
      socioId: number,
      payload: UpdateSocioPayload,
    ): Promise<Socio | null> => {
      try {
        setUpdatingSocio(true);
        clearActionFeedback();

        const updatedSocio =
          await sociosApi.updateSocio(socioId, payload);

        if (selectedSocioIdRef.current === socioId) {
          setSelectedSocio(updatedSocio);
        }

        await refreshSocios();

        setActionSuccess(
          "Los datos del socio fueron actualizados correctamente.",
        );

        return updatedSocio;
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "No se pudieron actualizar los datos del socio.",
        );

        return null;
      } finally {
        setUpdatingSocio(false);
      }
    },
    [clearActionFeedback, refreshSocios],
  );

  /* =========================================================
     CAMBIO DE ESTADO
  ========================================================= */

  /*
  Cambia el estado funcional de un socio.

  El backend mantiene la responsabilidad sobre:
  - sincronización con Usuario;
  - validación de reservas activas;
  - cancelación y liberación de stock;
  - bloqueo de acceso;
  - invalidación de sesiones;
  - auditoría y notificaciones.
  */
  const updateSocioStatus = useCallback(
    async (
      socioId: number,
      payload: UpdateSocioStatusPayload,
    ): Promise<Socio | null> => {
      try {
        setUpdatingSocioStatus(true);
        clearActionFeedback();

        const updatedSocio =
          await sociosApi.updateSocioStatus(
            socioId,
            payload,
          );

        if (selectedSocioIdRef.current === socioId) {
          setSelectedSocio(updatedSocio);
        }

        await refreshSocios();

        setActionSuccess(
          "El estado del socio fue actualizado correctamente.",
        );

        return updatedSocio;
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el estado del socio.",
        );

        return null;
      } finally {
        setUpdatingSocioStatus(false);
      }
    },
    [clearActionFeedback, refreshSocios],
  );

  return {
    socios,
    selectedSocio,
    pagination,

    loadingSocios,
    loadingDetail,
    creatingSocio,
    updatingSocio,
    updatingSocioStatus,

    sociosError,
    detailError,
    actionError,
    actionSuccess,

    fetchSocios,
    refreshSocios,
    fetchSocioById,
    selectSocio,
    clearSelectedSocio,

    createSocio,
    updateSocio,
    updateSocioStatus,

    clearSociosError,
    clearDetailError,
    clearActionFeedback,
  };
}