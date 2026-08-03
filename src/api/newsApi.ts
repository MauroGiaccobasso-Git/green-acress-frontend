import { httpClient } from "./httpClient";

/* =========================================================
   TIPOS DEL MÓDULO
========================================================= */

export type NewsStatus = "ACTIVA" | "INACTIVA";

/*
Representa al usuario administrador
responsable de publicar la novedad.
*/
export type NewsAuthor = {
  id: number;
  email: string;
};

/*
Representa el contrato real de una novedad
devuelta por el backend.

Se conservan los nombres de propiedades
del backend para evitar mapeos innecesarios
entre capas.
*/
export type News = {
  id: number;
  titulo: string;
  contenido: string;
  estado: NewsStatus;
  fecha_creacion: string;
  fecha_actualizacion: string;
  usuario: NewsAuthor;
  cantidadNotificaciones: number;
};

/*
Resumen del estado actual de las entregas
asociadas a una novedad.

Este contrato alimenta las métricas
del panel administrativo de detalle.
*/
export type NewsDeliverySummary = {
  total: number;
  enviadas: number;
  pendientes: number;
  errores: number;
};

/*
Detalle administrativo completo
de una novedad seleccionada.

El backend devuelve resumenEntregas
dentro del objeto novedad.
*/
export type NewsDetail = News & {
  resumenEntregas: NewsDeliverySummary;
};

/*
Resultado del procesamiento inicial
de correos ejecutado luego de publicar
una novedad.

El envío ocurre después de confirmar
la transacción de publicación.
*/
export type NewsDeliveryProcessingResult = {
  total: number;
  enviadas: number;
  errores: number;
  estadosNoRegistrados: number;
  procesamientoCompleto: boolean;
};

/*
Resultado normalizado utilizado por
el hook después de publicar una novedad.
*/
export type PublishNewsResult = {
  news: News;
  deliveryResult: NewsDeliveryProcessingResult;
};

/*
Parámetros soportados por el listado
administrativo de novedades.

La búsqueda y el filtro son procesados
por el backend.
*/
export type GetNewsParams = {
  search?: string;
  estado?: NewsStatus;
};

/*
Únicos datos permitidos al publicar
una nueva novedad.

No se permite enviar estado porque
toda novedad se publica directamente
en estado ACTIVA.
*/
export type PublishNewsPayload = {
  titulo: string;
  contenido: string;
};

/*
Payload exclusivo para cambiar
el estado lógico de una novedad.
*/
export type UpdateNewsStatusPayload = {
  estado: NewsStatus;
};

/* =========================================================
   RESPUESTAS DEL BACKEND
========================================================= */

type GetNewsResponse = {
  message: string;
  novedades: News[];
};

/*
El resumen de entregas forma parte
del objeto novedad devuelto por backend.
*/
type GetNewsDetailResponse = {
  message: string;
  novedad: NewsDetail;
};

type PublishedNewsResponse = News & {
  resultadoEnvios: NewsDeliveryProcessingResult;
};

type PublishNewsResponse = {
  message: string;
  novedad: PublishedNewsResponse;
};

type UpdateNewsStatusResponse = {
  message: string;
  novedad: News;
};

/* =========================================================
   HELPERS
========================================================= */

/*
Construye de forma segura los parámetros
de búsqueda y filtrado soportados
por el backend.
*/
const buildNewsQueryParams = (params: GetNewsParams = {}): string => {
  const searchParams = new URLSearchParams();

  const normalizedSearch = params.search?.trim();

  if (normalizedSearch) {
    searchParams.set("search", normalizedSearch);
  }

  if (params.estado) {
    searchParams.set("estado", params.estado);
  }

  return searchParams.toString();
};

/* =========================================================
   API DEL MÓDULO
========================================================= */

/*
Centraliza todas las operaciones HTTP
relacionadas con novedades.

Los hooks, containers y componentes
no deben comunicarse directamente
con el backend.
*/
export const newsApi = {
  /*
  Obtiene el listado administrativo
  de novedades.

  Permite aplicar búsqueda por texto
  y filtro por estado.
  */
  async getNews(params: GetNewsParams = {}): Promise<News[]> {
    const query = buildNewsQueryParams(params);

    const response = await httpClient<GetNewsResponse>(
      `/novedades${query ? `?${query}` : ""}`,
    );

    return response.novedades;
  },

  /*
  Obtiene el detalle administrativo
  de una novedad junto con el resumen
  de sus entregas.

  El backend devuelve ambos datos dentro
  de la propiedad novedad.
  */
  async getNewsById(newsId: number): Promise<NewsDetail> {
    const response = await httpClient<GetNewsDetailResponse>(
      `/novedades/${newsId}`,
    );

    return response.novedad;
  },

  /*
  Publica inmediatamente una novedad.

  El backend:
  - asigna el estado ACTIVA;
  - registra la novedad;
  - genera notificaciones;
  - crea los registros de entrega;
  - registra la auditoría;
  - procesa los correos después del commit.
  */
  async publishNews(payload: PublishNewsPayload): Promise<PublishNewsResult> {
    const response = await httpClient<PublishNewsResponse>("/novedades", {
      method: "POST",
      body: payload,
    });

    const { resultadoEnvios, ...news } = response.novedad;

    return {
      news,
      deliveryResult: resultadoEnvios,
    };
  },

  /*
  Cambia el estado lógico entre
  ACTIVA e INACTIVA.

  Reactivar una novedad no genera
  nuevas notificaciones ni reenvía correos.
  */
  async updateNewsStatus(
    newsId: number,
    payload: UpdateNewsStatusPayload,
  ): Promise<News> {
    const response = await httpClient<UpdateNewsStatusResponse>(
      `/novedades/${newsId}/estado`,
      {
        method: "PATCH",
        body: payload,
      },
    );

    return response.novedad;
  },
};
