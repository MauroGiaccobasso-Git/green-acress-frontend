"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  type GetNewsParams,
  type News,
  type NewsDeliveryProcessingResult,
  type NewsDetail,
  newsApi,  
  type PublishNewsPayload,
  type PublishNewsResult,
  type UpdateNewsStatusPayload,
} from "@/api/newsApi";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const DEFAULT_NEWS_PARAMS: GetNewsParams = {};

/* =========================================================
   TIPOS DEL HOOK
========================================================= */

/*
Métricas generales utilizadas por las tarjetas
superiores del módulo administrativo.

Se calculan sobre el listado completo, por lo
que no cambian al aplicar búsqueda o filtros.
*/
export type NewsMetrics = {
  active: number;
  inactive: number;
  publishedThisMonth: number;
  generatedNotifications: number;
};

/* =========================================================
   HELPERS
========================================================= */

const hasNewsFilters = (params: GetNewsParams): boolean =>
  Boolean(params.search?.trim() || params.estado);

const isCurrentMonth = (dateValue: string): boolean => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const currentDate = new Date();

  return (
    date.getFullYear() === currentDate.getFullYear() &&
    date.getMonth() === currentDate.getMonth()
  );
};

const getPublishSuccessMessage = (
  result: NewsDeliveryProcessingResult,
): string => {
  if (result.total === 0) {
    return "La novedad fue publicada correctamente, sin destinatarios habilitados.";
  }

  if (
    result.errores === 0 &&
    result.estadosNoRegistrados === 0
  ) {
    return `La novedad fue publicada y se procesaron correctamente ${result.enviadas} notificaciones.`;
  }

  return `La novedad fue publicada. Se enviaron ${result.enviadas} notificaciones y ${result.errores} registraron error.`;
};

/* =========================================================
   HOOK PRINCIPAL
========================================================= */

/*
Hook principal del módulo administrativo de Novedades.

Responsabilidades:
- cargar el listado administrativo;
- aplicar búsqueda y filtro de estado;
- conservar los últimos parámetros utilizados;
- mantener datos globales para las métricas;
- administrar la selección Master / Detail;
- consultar el detalle y las entregas;
- publicar novedades;
- cambiar su estado lógico;
- sincronizar listado, detalle y métricas;
- evitar respuestas obsoletas;
- administrar cargas, errores y feedback.

No contiene JSX.
No conoce componentes visuales.
No realiza solicitudes HTTP directas.
No implementa reglas críticas de negocio.
*/
export function useNews() {
  /*
  Listado correspondiente a la búsqueda
  y filtro actualmente aplicados.
  */
  const [news, setNews] = useState<News[]>([]);

  /*
  Listado completo utilizado exclusivamente
  para calcular las métricas superiores.

  No debe reemplazarse por resultados filtrados.
  */
  const [overviewNews, setOverviewNews] = useState<News[]>([]);

  /*
  Novedad actualmente seleccionada dentro
  del patrón Master / Detail.

  Incluye el resumen de entregas obtenido
  mediante el endpoint de detalle.
  */
  const [selectedNews, setSelectedNews] =
    useState<NewsDetail | null>(null);

  /*
  Resultado del procesamiento de correos
  correspondiente a la última publicación.

  Permite mostrar feedback preciso después
  de completar el formulario.
  */
  const [lastPublishResult, setLastPublishResult] =
    useState<NewsDeliveryProcessingResult | null>(null);

  /*
  Conserva la última consulta aplicada para
  refrescar el listado luego de una operación.
  */
  const lastFetchParamsRef = useRef<GetNewsParams>(
    DEFAULT_NEWS_PARAMS,
  );

  /*
  Conserva la selección sin convertirla
  en dependencia de todas las funciones.
  */
  const selectedNewsIdRef = useRef<number | null>(null);

  /*
  Identificadores incrementales para impedir
  que respuestas antiguas sobrescriban datos
  pertenecientes a solicitudes más recientes.
  */
  const latestListRequestIdRef = useRef(0);

  const latestDetailRequestIdRef = useRef(0);

  const latestOverviewRequestIdRef = useRef(0);

  /* =========================================================
     ESTADOS DE CARGA
  ========================================================= */

  const [loadingNews, setLoadingNews] = useState(false);

  const [loadingOverview, setLoadingOverview] =
    useState(false);

  const [loadingDetail, setLoadingDetail] = useState(false);

  const [publishingNews, setPublishingNews] = useState(false);

  const [updatingNewsStatus, setUpdatingNewsStatus] =
    useState(false);

  /* =========================================================
     ERRORES Y FEEDBACK
  ========================================================= */

  const [newsError, setNewsError] = useState<string | null>(
    null,
  );

  const [overviewError, setOverviewError] = useState<
    string | null
  >(null);

  const [detailError, setDetailError] = useState<string | null>(
    null,
  );

  const [actionError, setActionError] = useState<string | null>(
    null,
  );

  const [actionSuccess, setActionSuccess] = useState<
    string | null
  >(null);

  const clearNewsError = useCallback(() => {
    setNewsError(null);
  }, []);

  const clearOverviewError = useCallback(() => {
    setOverviewError(null);
  }, []);

  const clearDetailError = useCallback(() => {
    setDetailError(null);
  }, []);

  const clearActionFeedback = useCallback(() => {
    setActionError(null);
    setActionSuccess(null);
    setLastPublishResult(null);
  }, []);

  /* =========================================================
     MÉTRICAS
  ========================================================= */

  /*
  Calcula las tarjetas superiores de la referencia
  visual utilizando siempre el listado completo.

  "generatedNotifications" representa notificaciones
  generadas, no entregas efectivamente enviadas, porque
  ese es el dato disponible en el listado backend.
  */
  const metrics = useMemo<NewsMetrics>(() => {
    return overviewNews.reduce<NewsMetrics>(
      (summary, item) => {
        if (item.estado === "ACTIVA") {
          summary.active += 1;
        }

        if (item.estado === "INACTIVA") {
          summary.inactive += 1;
        }

        if (isCurrentMonth(item.fecha_creacion)) {
          summary.publishedThisMonth += 1;
        }

        summary.generatedNotifications +=
          item.cantidadNotificaciones;

        return summary;
      },
      {
        active: 0,
        inactive: 0,
        publishedThisMonth: 0,
        generatedNotifications: 0,
      },
    );
  }, [overviewNews]);

  /* =========================================================
     SELECCIÓN Y DETALLE
  ========================================================= */

  /*
  Limpia la selección actual e invalida cualquier
  consulta de detalle que todavía esté en curso.
  */
  const clearSelectedNews = useCallback(() => {
    latestDetailRequestIdRef.current += 1;
    selectedNewsIdRef.current = null;

    setSelectedNews(null);
    setDetailError(null);
    setLoadingDetail(false);
  }, []);

  /*
  Obtiene el detalle completo de una novedad,
  incluyendo su resumen de entregas.
  */
  const fetchNewsById = useCallback(
    async (newsId: number): Promise<NewsDetail | null> => {
      const requestId = ++latestDetailRequestIdRef.current;

      try {
        setLoadingDetail(true);
        setDetailError(null);

        const detail = await newsApi.getNewsById(newsId);

        if (requestId !== latestDetailRequestIdRef.current) {
          return detail;
        }

        selectedNewsIdRef.current = detail.id;
        setSelectedNews(detail);

        return detail;
      } catch (error) {
        if (requestId !== latestDetailRequestIdRef.current) {
          return null;
        }

        selectedNewsIdRef.current = null;
        setSelectedNews(null);

        setDetailError(
          error instanceof Error
            ? error.message
            : "No se pudo cargar el detalle de la novedad.",
        );

        return null;
      } finally {
        if (requestId === latestDetailRequestIdRef.current) {
          setLoadingDetail(false);
        }
      }
    },
    [],
  );

  /*
  Selecciona una novedad desde el listado.

  Evita repetir la consulta cuando el detalle
  de esa novedad ya se encuentra cargado.
  */
  const selectNews = useCallback(
    async (newsId: number): Promise<NewsDetail | null> => {
      if (
        selectedNewsIdRef.current === newsId &&
        selectedNews
      ) {
        return selectedNews;
      }

      return fetchNewsById(newsId);
    },
    [fetchNewsById, selectedNews],
  );

  /* =========================================================
     MÉTRICAS GENERALES
  ========================================================= */

  /*
  Recupera el listado completo utilizado por
  las tarjetas superiores.

  Se ejecuta independientemente del listado
  filtrado para que las métricas no cambien
  durante búsquedas o filtros.
  */
  const fetchNewsOverview = useCallback(
    async (): Promise<News[] | null> => {
      const requestId = ++latestOverviewRequestIdRef.current;

      try {
        setLoadingOverview(true);
        setOverviewError(null);

        const response = await newsApi.getNews();

        if (
          requestId !== latestOverviewRequestIdRef.current
        ) {
          return response;
        }

        setOverviewNews(response);

        return response;
      } catch (error) {
        if (
          requestId !== latestOverviewRequestIdRef.current
        ) {
          return null;
        }

        setOverviewNews([]);

        setOverviewError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las métricas de novedades.",
        );

        return null;
      } finally {
        if (
          requestId === latestOverviewRequestIdRef.current
        ) {
          setLoadingOverview(false);
        }
      }
    },
    [],
  );

  /* =========================================================
     LISTADO ADMINISTRATIVO
  ========================================================= */

  /*
  Carga novedades aplicando búsqueda y estado.

  Mantiene coherente el panel de detalle:
  - prioriza un identificador solicitado;
  - conserva la selección si continúa visible;
  - selecciona el primer resultado;
  - limpia el detalle cuando no hay resultados.

  Cuando la consulta no posee filtros, el mismo
  resultado también actualiza las métricas y evita
  una segunda solicitud HTTP innecesaria.
  */
  const fetchNews = useCallback(
    async (
      params: GetNewsParams = DEFAULT_NEWS_PARAMS,
      preferredNewsId?: number,
    ): Promise<News[] | null> => {
      const requestId = ++latestListRequestIdRef.current;

      const normalizedParams: GetNewsParams = {
        search: params.search?.trim() || undefined,
        estado: params.estado,
      };

      const isUnfilteredRequest =
        !hasNewsFilters(normalizedParams);

      /*
      Una carga completa también representa una
      nueva solicitud válida para las métricas.
      */
      const overviewRequestId = isUnfilteredRequest
        ? ++latestOverviewRequestIdRef.current
        : null;

      try {
        setLoadingNews(true);
        setNewsError(null);

        if (isUnfilteredRequest) {
          setLoadingOverview(true);
          setOverviewError(null);
        }

        lastFetchParamsRef.current = normalizedParams;

        const response =
          await newsApi.getNews(normalizedParams);

        if (requestId !== latestListRequestIdRef.current) {
          return response;
        }

        setNews(response);

        if (
          overviewRequestId !== null &&
          overviewRequestId ===
            latestOverviewRequestIdRef.current
        ) {
          setOverviewNews(response);
        }

        const newsIdToPreserve =
          preferredNewsId ?? selectedNewsIdRef.current;

        const newsToSelect =
          response.find(
            (item) => item.id === newsIdToPreserve,
          ) ??
          response[0] ??
          null;

        if (newsToSelect) {
          await fetchNewsById(newsToSelect.id);
        } else {
          clearSelectedNews();
        }

        return response;
      } catch (error) {
        if (requestId !== latestListRequestIdRef.current) {
          return null;
        }

        setNews([]);
        clearSelectedNews();

        const message =
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las novedades.";

        setNewsError(message);

        if (
          overviewRequestId !== null &&
          overviewRequestId ===
            latestOverviewRequestIdRef.current
        ) {
          setOverviewNews([]);
          setOverviewError(message);
        }

        return null;
      } finally {
        if (requestId === latestListRequestIdRef.current) {
          setLoadingNews(false);
        }

        if (
          overviewRequestId !== null &&
          overviewRequestId ===
            latestOverviewRequestIdRef.current
        ) {
          setLoadingOverview(false);
        }
      }
    },
    [clearSelectedNews, fetchNewsById],
  );

  /*
  Refresca el módulo conservando búsqueda,
  filtro y selección actuales.

  Si existen filtros:
  - refresca el listado visible;
  - actualiza por separado las métricas globales.

  Sin filtros utiliza una sola solicitud.
  */
  const refreshNews = useCallback(
    async (preferredNewsId?: number) => {
      const currentParams = lastFetchParamsRef.current;

      if (!hasNewsFilters(currentParams)) {
        return fetchNews(currentParams, preferredNewsId);
      }

      const [listResult] = await Promise.all([
        fetchNews(currentParams, preferredNewsId),
        fetchNewsOverview(),
      ]);

      return listResult;
    },
    [fetchNews, fetchNewsOverview],
  );

  /* =========================================================
     PUBLICACIÓN
  ========================================================= */

  /*
  Publica una nueva novedad.

  Backend conserva la responsabilidad sobre:
  - estado inicial ACTIVA;
  - persistencia transaccional;
  - generación de notificaciones;
  - creación de entregas;
  - auditoría;
  - procesamiento independiente de correos.
  */
  const publishNews = useCallback(
    async (
      payload: PublishNewsPayload,
    ): Promise<PublishNewsResult | null> => {
      try {
        setPublishingNews(true);
        clearActionFeedback();

        const result = await newsApi.publishNews(payload);

        setLastPublishResult(result.deliveryResult);

        await refreshNews(result.news.id);

        setActionSuccess(
          getPublishSuccessMessage(result.deliveryResult),
        );

        return result;
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "No se pudo publicar la novedad.",
        );

        return null;
      } finally {
        setPublishingNews(false);
      }
    },
    [clearActionFeedback, refreshNews],
  );

  /* =========================================================
     CAMBIO DE ESTADO
  ========================================================= */

  /*
  Cambia el estado lógico de una novedad.

  Backend conserva la responsabilidad sobre:
  - validación ACTIVA / INACTIVA;
  - rechazo de cambios redundantes;
  - preservación del historial;
  - auditoría administrativa;
  - prevención de reenvíos al reactivar.
  */
  const updateNewsStatus = useCallback(
    async (
      newsId: number,
      payload: UpdateNewsStatusPayload,
    ): Promise<News | null> => {
      try {
        setUpdatingNewsStatus(true);
        clearActionFeedback();

        const updatedNews = await newsApi.updateNewsStatus(
          newsId,
          payload,
        );

        await refreshNews(updatedNews.id);

        setActionSuccess(
          payload.estado === "ACTIVA"
            ? "La novedad fue reactivada correctamente."
            : "La novedad fue inactivada correctamente.",
        );

        return updatedNews;
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el estado de la novedad.",
        );

        return null;
      } finally {
        setUpdatingNewsStatus(false);
      }
    },
    [clearActionFeedback, refreshNews],
  );

  return {
    news,
    overviewNews,
    selectedNews,
    metrics,
    lastPublishResult,

    loadingNews,
    loadingOverview,
    loadingDetail,
    publishingNews,
    updatingNewsStatus,

    newsError,
    overviewError,
    detailError,
    actionError,
    actionSuccess,

    fetchNews,
    refreshNews,
    fetchNewsOverview,
    fetchNewsById,
    selectNews,
    clearSelectedNews,

    publishNews,
    updateNewsStatus,

    clearNewsError,
    clearOverviewError,
    clearDetailError,
    clearActionFeedback,
  };
}