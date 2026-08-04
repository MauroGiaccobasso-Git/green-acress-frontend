import { httpClient } from "./httpClient";

/* =========================================================
   INDICADORES PRINCIPALES
========================================================= */

/*
Representa las cuatro métricas principales
del Dashboard administrativo.

Los valores son calculados por el backend
utilizando datos globales y no colecciones
parciales del frontend.
*/
export type DashboardSummary = {
  ventasMes: number;

  importeVentasMes: number;

  gramosVendidosMes: number;

  sociosActivos: number;
};

/* =========================================================
   ALERTAS OPERATIVAS
========================================================= */

/*
Representa una reserva confirmada cuyo plazo
de retiro vence durante las próximas 24 horas.
*/
export type DashboardReservationAlert = {
  reservaId: number;

  socio: {
    id: number;

    nombreCompleto: string;
  };

  fechaLimiteRetiro: string;

  gramosReservados: number;
};

/*
Motivos utilizados para explicar por qué
un producto FLOR no posee stock disponible.

SIN_EXISTENCIAS:
No existe stock físico del producto.

TODO_RESERVADO:
Existe stock físico, pero está completamente
comprometido por reservas confirmadas.
*/
export type DashboardStockAlertReason =
  | "SIN_EXISTENCIAS"
  | "TODO_RESERVADO";

/*
Representa un producto FLOR activo
sin disponibilidad para nuevas operaciones.
*/
export type DashboardStockAlert = {
  productoId: number;

  nombre: string;

  cantidadTotal: number;

  cantidadReservada: number;

  cantidadDisponible: number;

  motivo: DashboardStockAlertReason;
};

/*
Tipos de origen admitidos por una entrega
de notificación mostrada en el Dashboard.
*/
export type DashboardDeliveryOriginType =
  | "RESERVA"
  | "NOVEDAD"
  | "SISTEMA";

/*
Referencia funcional utilizada para dirigir
al administrador hacia el módulo relacionado
con una entrega fallida.
*/
export type DashboardDeliveryOrigin = {
  tipo: DashboardDeliveryOriginType;

  id: number | null;

  etiqueta: string;
};

/*
Representa una entrega de notificación
registrada en estado ERROR durante
los últimos 30 días.

No contiene nombres, correos ni otros
datos personales de los destinatarios.
*/
export type DashboardDeliveryAlert = {
  entregaId: number;

  notificacionId: number;

  tipoNotificacion: string;

  canal: string;

  intentos: number;

  fechaUltimoIntento: string;

  error: string;

  origen: DashboardDeliveryOrigin;
};

/*
Estructura reutilizable para las alertas
operativas del Dashboard.

"total" representa todos los registros
coincidentes.

"items" contiene como máximo los registros
más relevantes devueltos por el backend.
*/
export type DashboardAlertCollection<T> = {
  total: number;

  items: T[];
};

/*
Agrupa las tres situaciones operativas
que requieren atención administrativa.
*/
export type DashboardAttentionRequired = {
  reservasProximasVencer: DashboardAlertCollection<DashboardReservationAlert>;

  floresSinStock: DashboardAlertCollection<DashboardStockAlert>;

  entregasConError: DashboardAlertCollection<DashboardDeliveryAlert>;
};

/* =========================================================
   DEMANDA RECIENTE
========================================================= */

/*
Período utilizado por el backend para analizar
las ventas y reservas recientes.

Las fechas se calculan utilizando
America/Montevideo.
*/
export type DashboardDemandPeriod = {
  desde: string;

  hasta: string;

  dias: number;
};

/*
Representa la demanda registrada durante
un día del período analizado.

Aunque el Dashboard MVP no muestra una gráfica,
el contrato se conserva completo porque forma
parte de la respuesta oficial del backend.
*/
export type DashboardDailyDemand = {
  fecha: string;

  gramosVendidos: number;

  gramosReservados: number;
};

/*
Representa uno de los productos FLOR
con mayor demanda durante los últimos 30 días.

La imagen puede ser null. El componente visual
debe mostrar un fallback cuando no exista una URL
o cuando la imagen no pueda cargarse.
*/
export type DashboardTopProduct = {
  productoId: number;

  nombre: string;

  imagenUrl: string | null;

  estado: "ACTIVO" | "INACTIVO";

  gramosVendidos: number;

  gramosReservados: number;

  demandaTotal: number;

  cantidadTotal: number;

  cantidadReservada: number;

  cantidadDisponible: number;
};

/*
Agrupa el período, la evolución diaria
y los productos más demandados.
*/
export type DashboardDemand = {
  periodo: DashboardDemandPeriod;

  evolucionDiaria: DashboardDailyDemand[];

  productosMasDemandados: DashboardTopProduct[];
};

/* =========================================================
   DASHBOARD ADMINISTRATIVO
========================================================= */

/*
Contrato principal del Dashboard.

Contiene únicamente información agregada
y operativa necesaria para la pantalla inicial
del administrador.
*/
export type DashboardData = {
  resumen: DashboardSummary;

  atencionRequerida: DashboardAttentionRequired;

  demanda: DashboardDemand;

  generatedAt: string;

  timeZone: string;
};

/* =========================================================
   RECOMENDACIONES INTELIGENTES
========================================================= */

/*
Prioridades admitidas para ordenar
las recomendaciones de reposición.
*/
export type DashboardRecommendationPriority =
  | "ALTA"
  | "MEDIA"
  | "BAJA";

/*
Representa una recomendación de reposición.

La cantidad sugerida es calculada por el backend.
La inteligencia artificial solamente genera
la prioridad y la justificación contextual.

La imagen pertenece a la presentación del producto
y no forma parte de los datos enviados a Gemini.
*/
export type DashboardRecommendation = {
  productoId: number;

  producto: string;

  imagenUrl: string | null;

  gramosVendidos30Dias: number;

  gramosReservados: number;

  stockDisponible: number;

  cantidadSugerida: number;

  prioridad: DashboardRecommendationPriority;

  justificacion: string;
};

/*
Resultado completo de la generación
de recomendaciones inteligentes.
*/
export type DashboardRecommendationsResult = {
  recomendaciones: DashboardRecommendation[];

  generatedAt: string;
};

/* =========================================================
   RESPUESTAS HTTP
========================================================= */

type DashboardResponse = {
  message: string;

  dashboard: DashboardData;
};

type DashboardRecommendationsResponse = {
  message: string;

  recomendaciones: DashboardRecommendation[];

  generatedAt: string;
};

/* =========================================================
   API DEL MÓDULO
========================================================= */

/*
Centraliza todas las comunicaciones HTTP
del Dashboard administrativo.

Arquitectura:

Container → Hook → API → httpClient → Backend

Los hooks y componentes no deben realizar
solicitudes directas mediante fetch.
*/
export const dashboardApi = {
  /*
  Obtiene los indicadores, alertas operativas
  y productos más demandados del Dashboard.
  */
  async getDashboard(): Promise<DashboardData> {
    const response =
      await httpClient<DashboardResponse>("/dashboard");

    return response.dashboard;
  },

  /*
  Solicita la generación de recomendaciones
  inteligentes para productos FLOR.

  El endpoint se ejecuta solamente mediante
  una acción explícita del administrador.
  */
  async generateRecommendations(): Promise<DashboardRecommendationsResult> {
    const response =
      await httpClient<DashboardRecommendationsResponse>(
        "/dashboard/recommendations",
        {
          method: "POST",
        },
      );

    return {
      recomendaciones: response.recomendaciones,
      generatedAt: response.generatedAt,
    };
  },
};