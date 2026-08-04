"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  type DashboardData,
  type DashboardRecommendation,
  dashboardApi,
} from "@/api/dashboardApi";
import { HttpError } from "@/api/httpClient";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const DASHBOARD_LOAD_ERROR_MESSAGE =
  "No fue posible cargar el resumen administrativo.";

const RECOMMENDATIONS_ERROR_MESSAGE =
  "No fue posible generar las recomendaciones inteligentes.";

const AI_SERVICE_UNAVAILABLE_CODE =
  "AI_SERVICE_UNAVAILABLE";

/* =========================================================
   HELPERS
========================================================= */

/*
Obtiene un mensaje seguro para mostrar en la interfaz.

Prioriza el mensaje controlado enviado por backend y utiliza
un texto genérico cuando el error recibido no es reconocible.
*/
function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (
    error instanceof Error &&
    error.message.trim().length > 0
  ) {
    return error.message;
  }

  return fallbackMessage;
}

/* =========================================================
   HOOK PRINCIPAL
========================================================= */

/*
Hook principal del Dashboard administrativo.

Responsabilidades:
- cargar los indicadores y alertas operativas;
- conservar la respuesta consolidada del backend;
- generar recomendaciones mediante una acción explícita;
- manejar cargas independientes para Dashboard y Gemini;
- aislar los errores del proveedor de inteligencia artificial;
- evitar que respuestas antiguas sobrescriban datos recientes;
- exponer estados claros para loading, error y empty state.

No contiene JSX.
No conoce detalles visuales.
No ejecuta fetch directamente.
No calcula métricas ni cantidades recomendadas.
*/
export function useDashboard() {
  /* =========================================================
     DATOS DEL DASHBOARD
  ========================================================= */

  /*
  Información consolidada del panel administrativo.

  Se mantiene como null hasta completar correctamente
  la primera consulta.
  */
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  /*
  Recomendaciones generadas mediante Gemini.

  Se administran de forma independiente para que una falla
  del proveedor externo no afecte el Dashboard principal.
  */
  const [recommendations, setRecommendations] = useState<
    DashboardRecommendation[]
  >([]);

  /*
  Fecha correspondiente a la última generación exitosa.

  También permite distinguir entre:

  - recomendaciones todavía no solicitadas;
  - generación ejecutada sin resultados;
  - generación ejecutada con recomendaciones.
  */
  const [
    recommendationsGeneratedAt,
    setRecommendationsGeneratedAt,
  ] = useState<string | null>(null);

  /* =========================================================
     ESTADOS DE CARGA
  ========================================================= */

  /*
  Carga exclusiva de la información principal.

  No se comparte con Gemini porque ambas operaciones
  deben funcionar de forma independiente.
  */
  const [loadingDashboard, setLoadingDashboard] =
    useState(false);

  /*
  Carga exclusiva del proceso de recomendaciones.

  Permite deshabilitar únicamente el botón de IA mientras
  el resto de la pantalla permanece disponible.
  */
  const [
    generatingRecommendations,
    setGeneratingRecommendations,
  ] = useState(false);

  /* =========================================================
     ERRORES
  ========================================================= */

  /*
  Error correspondiente a la carga principal.

  Si existe información previa, puede conservarse visible
  mientras se informa que la actualización falló.
  */
  const [dashboardError, setDashboardError] = useState<
    string | null
  >(null);

  /*
  Error exclusivo del proceso de inteligencia artificial.

  Nunca debe reemplazar ni ocultar los indicadores,
  alertas o productos más demandados.
  */
  const [
    recommendationsError,
    setRecommendationsError,
  ] = useState<string | null>(null);

  /*
  Código funcional devuelto por backend.

  Permite diferenciar una indisponibilidad temporal de Gemini
  sin depender del texto visible del mensaje.
  */
  const [
    recommendationsErrorCode,
    setRecommendationsErrorCode,
  ] = useState<string | null>(null);

  /* =========================================================
     CONTROL DE SOLICITUDES
  ========================================================= */

  /*
  Identificadores incrementales utilizados para evitar
  que una respuesta antigua sobrescriba el resultado
  de una solicitud más reciente.
  */
  const latestDashboardRequestIdRef = useRef(0);

  const latestRecommendationsRequestIdRef = useRef(0);

  /* =========================================================
     CARGA DEL DASHBOARD
  ========================================================= */

  /*
  Obtiene la información consolidada del Dashboard.

  La función conserva datos anteriores durante una recarga.
  De esta manera, un fallo temporal no deja la pantalla vacía
  cuando ya existía información válida.
  */
  const fetchDashboard =
    useCallback(async (): Promise<boolean> => {
      const requestId =
        latestDashboardRequestIdRef.current + 1;

      latestDashboardRequestIdRef.current = requestId;

      try {
        setLoadingDashboard(true);
        setDashboardError(null);

        const result =
          await dashboardApi.getDashboard();

        if (
          latestDashboardRequestIdRef.current !== requestId
        ) {
          return false;
        }

        setDashboard(result);

        return true;
      } catch (error) {
        if (
          latestDashboardRequestIdRef.current !== requestId
        ) {
          return false;
        }

        setDashboardError(
          getErrorMessage(
            error,
            DASHBOARD_LOAD_ERROR_MESSAGE,
          ),
        );

        return false;
      } finally {
        if (
          latestDashboardRequestIdRef.current === requestId
        ) {
          setLoadingDashboard(false);
        }
      }
    }, []);

  /* =========================================================
     GENERACIÓN DE RECOMENDACIONES
  ========================================================= */

  /*
  Solicita recomendaciones únicamente cuando el administrador
  ejecuta la acción correspondiente.

  El backend:
  - analiza los productos FLOR activos;
  - calcula la cantidad sugerida;
  - limita los resultados;
  - valida la respuesta de Gemini.

  El hook solamente coordina la operación y almacena
  el resultado recibido.
  */
  const generateRecommendations =
    useCallback(async (): Promise<boolean> => {
      const requestId =
        latestRecommendationsRequestIdRef.current + 1;

      latestRecommendationsRequestIdRef.current =
        requestId;

      try {
        setGeneratingRecommendations(true);
        setRecommendationsError(null);
        setRecommendationsErrorCode(null);

        const result =
          await dashboardApi.generateRecommendations();

        if (
          latestRecommendationsRequestIdRef.current !==
          requestId
        ) {
          return false;
        }

        setRecommendations(result.recomendaciones);
        setRecommendationsGeneratedAt(
          result.generatedAt,
        );

        return true;
      } catch (error) {
        if (
          latestRecommendationsRequestIdRef.current !==
          requestId
        ) {
          return false;
        }

        setRecommendationsError(
          getErrorMessage(
            error,
            RECOMMENDATIONS_ERROR_MESSAGE,
          ),
        );

        setRecommendationsErrorCode(
          error instanceof HttpError
            ? (error.code ?? null)
            : null,
        );

        /*
        No se eliminan recomendaciones anteriores.

        Si el administrador intenta actualizarlas y Gemini
        falla temporalmente, la última respuesta válida
        continúa disponible.
        */
        return false;
      } finally {
        if (
          latestRecommendationsRequestIdRef.current ===
          requestId
        ) {
          setGeneratingRecommendations(false);
        }
      }
    }, []);

  /* =========================================================
     LIMPIEZA DE ERRORES
  ========================================================= */

  const clearDashboardError = useCallback(() => {
    setDashboardError(null);
  }, []);

  const clearRecommendationsError = useCallback(() => {
    setRecommendationsError(null);
    setRecommendationsErrorCode(null);
  }, []);

  /* =========================================================
     VALORES DERIVADOS
  ========================================================= */

  /*
  Indica que el proceso ya fue ejecutado al menos una vez,
  aunque el backend haya devuelto una colección vacía.
  */
  const hasGeneratedRecommendations = useMemo(
    () => recommendationsGeneratedAt !== null,
    [recommendationsGeneratedAt],
  );

  const hasRecommendations = useMemo(
    () => recommendations.length > 0,
    [recommendations.length],
  );

  /*
  Permite mostrar un mensaje específico cuando Gemini
  se encuentra temporalmente fuera de servicio.
  */
  const recommendationsUnavailable = useMemo(
    () =>
      recommendationsErrorCode ===
      AI_SERVICE_UNAVAILABLE_CODE,
    [recommendationsErrorCode],
  );

  return {
    dashboard,

    recommendations,
    recommendationsGeneratedAt,

    loadingDashboard,
    generatingRecommendations,

    dashboardError,
    recommendationsError,
    recommendationsErrorCode,

    hasGeneratedRecommendations,
    hasRecommendations,
    recommendationsUnavailable,

    fetchDashboard,
    generateRecommendations,

    clearDashboardError,
    clearRecommendationsError,
  };
}