"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  type MemberNews,
  newsApi,
} from "@/api/newsApi";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const MEMBER_NEWS_LOAD_ERROR_MESSAGE =
  "No fue posible cargar las novedades del club.";

/* =========================================================
   HELPERS
========================================================= */

/*
Obtiene un mensaje seguro para mostrar
dentro del Portal Socio.

Prioriza los mensajes controlados provenientes
del backend y utiliza un fallback cuando
el error no contiene información válida.
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
   HOOK DE NOVEDADES DEL SOCIO
========================================================= */

/*
Administra las novedades visibles dentro
del Portal Socio.

Responsabilidades:

- consultar las novedades activas;
- almacenar el listado público;
- administrar el estado de carga;
- manejar errores controlados;
- permitir actualizaciones posteriores;
- evitar que respuestas antiguas sobrescriban
  una consulta más reciente.

No contiene JSX.
No construye interfaz.
No realiza solicitudes HTTP directas.
No filtra ni ordena novedades en frontend.
No expone información administrativa.
*/
export function useMemberNews() {
  /*
  Novedades activas visibles
  para el socio autenticado.
  */
  const [memberNews, setMemberNews] =
    useState<MemberNews[]>([]);

  /*
  Indica si la consulta de novedades
  se encuentra en ejecución.
  */
  const [loadingMemberNews, setLoadingMemberNews] =
    useState(false);

  /*
  Error asociado exclusivamente
  a la consulta de novedades.
  */
  const [memberNewsError, setMemberNewsError] =
    useState<string | null>(null);

  /*
  Identificador incremental que evita
  que una respuesta antigua sobrescriba
  el resultado de una consulta posterior.
  */
  const latestRequestIdRef = useRef(0);

  /* =========================================================
     CARGA DE NOVEDADES
  ========================================================= */

  /*
  Obtiene las novedades actualmente visibles.

  Backend aplica el filtro de estado ACTIVA,
  el orden desde la más reciente y el contrato
  público permitido para el Portal Socio.
  */
  const fetchMemberNews =
    useCallback(async (): Promise<
      MemberNews[] | null
    > => {
      const requestId =
        latestRequestIdRef.current + 1;

      latestRequestIdRef.current = requestId;

      try {
        setLoadingMemberNews(true);
        setMemberNewsError(null);

        const news = await newsApi.getActiveNews();

        if (
          latestRequestIdRef.current !== requestId
        ) {
          return null;
        }

        setMemberNews(news);

        return news;
      } catch (error) {
        if (
          latestRequestIdRef.current !== requestId
        ) {
          return null;
        }

        /*
        Ante un fallo posterior se conserva
        el último listado válido disponible.

        El container podrá mostrar el error
        sin eliminar datos previamente cargados.
        */
        setMemberNewsError(
          getErrorMessage(
            error,
            MEMBER_NEWS_LOAD_ERROR_MESSAGE,
          ),
        );

        return null;
      } finally {
        if (
          latestRequestIdRef.current === requestId
        ) {
          setLoadingMemberNews(false);
        }
      }
    }, []);

  /* =========================================================
     LIMPIEZA
  ========================================================= */

  /*
  Limpia únicamente el error actual
  asociado a la consulta de novedades.
  */
  const clearMemberNewsError = useCallback(() => {
    setMemberNewsError(null);
  }, []);

  /*
  Limpia el estado completo del listado
  e invalida cualquier solicitud pendiente.
  */
  const clearMemberNews = useCallback(() => {
    latestRequestIdRef.current += 1;

    setMemberNews([]);
    setMemberNewsError(null);
    setLoadingMemberNews(false);
  }, []);

  /* =========================================================
     API PÚBLICA DEL HOOK
  ========================================================= */

  return {
    memberNews,

    loadingMemberNews,

    memberNewsError,

    fetchMemberNews,

    clearMemberNewsError,

    clearMemberNews,
  };
}