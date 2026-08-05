import { httpClient } from "./httpClient";

/* =========================================================
   ESTADOS Y TIPOS BASE
========================================================= */

/*
Estados soportados por el ciclo de vida
completo de una reserva.

PENDIENTE existe como estado transitorio
durante el procesamiento automático.
*/
export type ReservationStatus =
  | "PENDIENTE"
  | "CONFIRMADA"
  | "RECHAZADA"
  | "CANCELADA"
  | "VENCIDA"
  | "FINALIZADA";

/*
Estados posibles del usuario relacionado
con una reserva administrativa.
*/
export type ReservationUserStatus =
  | "ACTIVO"
  | "INACTIVO"
  | "BLOQUEADO";

/*
Estados posibles del socio asociado
a una reserva administrativa.
*/
export type ReservationMemberStatus =
  | "ACTIVO"
  | "INACTIVO"
  | "SUSPENDIDO";

/*
Estados posibles del producto incluido
dentro de una reserva.
*/
export type ReservationProductStatus =
  | "ACTIVO"
  | "INACTIVO";

/*
Genéticas soportadas por productos FLOR.
*/
export type ReservationProductGenetics =
  | "INDICA"
  | "SATIVA"
  | "HIBRIDA";

/*
Estados posibles de la venta asociada
a una reserva finalizada.
*/
export type ReservationSaleStatus =
  | "REGISTRADA"
  | "ANULADA";

/* =========================================================
   CONTRATOS ADMINISTRATIVOS — USUARIO Y SOCIO
========================================================= */

/*
Representa la información segura de usuario
devuelta dentro del módulo administrativo.
*/
export type ReservationUser = {
  id: number;

  email: string;

  rol: "ADMIN" | "SOCIO";

  estado: ReservationUserStatus;
};

/*
Representa el socio asociado a una reserva
dentro del panel administrativo.
*/
export type ReservationMember = {
  id: number;

  usuario_id: number;

  documento: string;

  nombre: string;

  apellido: string;

  telefono: string | null;

  estado: ReservationMemberStatus;

  fecha_alta: string;

  consentimiento_aceptado: boolean;

  fecha_consentimiento: string | null;

  usuario: ReservationUser;
};

/* =========================================================
   CONTRATOS ADMINISTRATIVOS — PRODUCTOS Y DETALLES
========================================================= */

/*
Representa el producto reducido utilizado
por el listado administrativo.
*/
export type ReservationSummaryProduct = {
  id: number;

  nombre: string;

  tipo: "FLOR";

  unidad_medida: "GRAMOS";

  imagen_url: string | null;
};

/*
Representa el producto completo utilizado
por el detalle administrativo.
*/
export type ReservationProduct = {
  id: number;

  nombre: string;

  descripcion: string | null;

  precio_venta_actual: number | null;

  estado: ReservationProductStatus;

  genetica: ReservationProductGenetics | null;

  porcentaje_thc: number | null;

  tipo: "FLOR";

  unidad_medida: "GRAMOS";

  imagen_url: string | null;
};

/*
Representa un detalle reducido dentro
del listado administrativo de reservas.
*/
export type ReservationSummaryDetail = {
  id: number;

  reserva_id: number;

  producto_id: number;

  cantidad: number;

  precio_unitario: number;

  subtotal: number;

  producto: ReservationSummaryProduct;
};

/*
Representa un detalle completo dentro
de la consulta administrativa individual.
*/
export type ReservationDetail = {
  id: number;

  reserva_id: number;

  producto_id: number;

  cantidad: number;

  precio_unitario: number;

  subtotal: number;

  producto: ReservationProduct;
};

/* =========================================================
   CONTRATOS ADMINISTRATIVOS — HISTORIAL Y VENTA
========================================================= */

/*
Representa un cambio de estado registrado
dentro del historial funcional.
*/
export type ReservationHistoryItem = {
  id: number;

  reserva_id: number;

  usuario_id: number | null;

  estado: ReservationStatus;

  fecha: string;

  observaciones: string | null;

  usuario: ReservationUser | null;
};

/*
Representa la venta generada al confirmar
el retiro presencial de una reserva.
*/
export type ReservationSale = {
  id: number;

  fecha: string;

  estado: ReservationSaleStatus;

  total: number;
};

/* =========================================================
   CONTRATOS ADMINISTRATIVOS — RESERVAS
========================================================= */

/*
Representa una fila del listado administrativo.
*/
export type ReservationSummary = {
  id: number;

  socio_id: number;

  usuario_id: number;

  fecha_solicitud: string;

  fecha_limite_retiro: string | null;

  estado: ReservationStatus;

  total: number;

  venta_id: number | null;

  observaciones: string | null;

  fecha_actualizacion: string;

  socio: ReservationMember;

  detalles: ReservationSummaryDetail[];
};

/*
Representa el detalle administrativo completo.
*/
export type Reservation = {
  id: number;

  socio_id: number;

  usuario_id: number;

  fecha_solicitud: string;

  fecha_limite_retiro: string | null;

  estado: ReservationStatus;

  total: number;

  venta_id: number | null;

  observaciones: string | null;

  fecha_actualizacion: string;

  socio: ReservationMember;

  usuario: ReservationUser;

  venta: ReservationSale | null;

  detalles: ReservationDetail[];

  historial: ReservationHistoryItem[];
};

/* =========================================================
   CONTRATOS DEL PORTAL DE SOCIOS
========================================================= */

/*
Representa un producto incluido dentro
de una reserva visible por el socio.

Los importes corresponden a los valores
históricos congelados al crear la reserva,
no al precio actual del producto.
*/
export type MemberReservationProduct = {
  nombre: string;

  imagen: string | null;

  cantidad: number;

  precioUnitario: number;

  subtotal: number;
};

/*
Representa el contrato público de una reserva
perteneciente al socio autenticado.

No expone:

- socio relacionado;
- usuario responsable;
- identificadores internos de detalles;
- identificadores internos de productos;
- auditorías;
- venta administrativa asociada;
- historial técnico completo.
*/
export type MemberReservation = {
  id: number;

  fechaSolicitud: string;

  fechaLimiteRetiro: string | null;

  estado: ReservationStatus;

  estadoDescripcion: string;

  motivo: string | null;

  totalGramos: number;

  total: number;

  productos: MemberReservationProduct[];
};

/*
Representa la separación realizada por backend
entre reservas vigentes e historial personal.
*/
export type MemberReservationsCollection = {
  activas: MemberReservation[];

  historial: MemberReservation[];
};

/* =========================================================
   FILTROS ADMINISTRATIVOS
========================================================= */

/*
Filtros soportados por el listado administrativo.

El backend devuelve los registros ordenados
por fecha de solicitud descendente.
*/
export type ReservationsFilters = {
  search?: string;

  estado?: ReservationStatus;

  socioId?: number;

  productoId?: number;

  fechaDesde?: string;

  fechaHasta?: string;
};

/* =========================================================
   PAYLOADS ADMINISTRATIVOS
========================================================= */

/*
Payload utilizado para cancelar manualmente
una reserva confirmada.
*/
export type CancelReservationPayload = {
  observaciones?: string;
};

/* =========================================================
   PAYLOADS DEL PORTAL DE SOCIOS
========================================================= */

/*
Representa un producto y su cantidad dentro
de una nueva solicitud de reserva.

El nombre producto_id coincide exactamente
con el contrato recibido por backend.

La cantidad debe ser mayor a cero y expresarse
en múltiplos de 0,5 gramos.
*/
export type CreateMemberReservationDetailPayload = {
  producto_id: number;

  cantidad: number;
};

/*
Representa la solicitud completa enviada
por el socio autenticado.

Una reserva puede contener múltiples productos,
pero el mismo producto no puede repetirse.
*/
export type CreateMemberReservationPayload = {
  detalles: CreateMemberReservationDetailPayload[];

  observaciones?: string | null;
};

/*
Resultado utilizado por el frontend después
de crear y procesar una solicitud.

El mensaje y el estado de la reserva deben
interpretarse conjuntamente porque una respuesta
HTTP 201 también puede contener una reserva
funcionalmente RECHAZADA.
*/
export type CreateMemberReservationResult = {
  message: string;

  reservation: MemberReservation;
};

/* =========================================================
   RESPUESTAS ADMINISTRATIVAS
========================================================= */

/*
Respuesta del listado administrativo.
*/
type ReservationsResponse = {
  success: boolean;

  data: ReservationSummary[];
};

/*
Respuesta de operaciones y detalle administrativo.
*/
type ReservationResponse = {
  success: boolean;

  message?: string;

  data: Reservation;
};

/* =========================================================
   RESPUESTAS DEL PORTAL DE SOCIOS
========================================================= */

/*
Respuesta del listado personal de reservas.
*/
type MemberReservationsResponse = {
  success: boolean;

  data: MemberReservationsCollection;
};

/*
Respuesta del detalle personal de una reserva.
*/
type MemberReservationResponse = {
  success: boolean;

  data: MemberReservation;
};

/*
Respuesta devuelta al crear y procesar
automáticamente una solicitud.
*/
type CreateMemberReservationResponse = {
  success: boolean;

  message: string;

  data: MemberReservation;
};

/* =========================================================
   HELPERS
========================================================= */

/*
Construye los query params utilizados
exclusivamente por el listado administrativo.
*/
const buildReservationsQueryParams = (
  filters: ReservationsFilters = {},
): string => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.estado) {
    params.set("estado", filters.estado);
  }

  if (filters.socioId) {
    params.set(
      "socioId",
      String(filters.socioId),
    );
  }

  if (filters.productoId) {
    params.set(
      "productoId",
      String(filters.productoId),
    );
  }

  if (filters.fechaDesde) {
    params.set(
      "fechaDesde",
      filters.fechaDesde,
    );
  }

  if (filters.fechaHasta) {
    params.set(
      "fechaHasta",
      filters.fechaHasta,
    );
  }

  return params.toString();
};

/* =========================================================
   API DEL MÓDULO
========================================================= */

/*
Centraliza las operaciones HTTP del módulo Reservas.

Arquitectura:

Container → Hook → API → httpClient → Backend

Los componentes nunca realizan solicitudes
directamente.
*/
export const reservationsApi = {
  /* =========================================================
     CONSULTAS ADMINISTRATIVAS
  ========================================================= */

  /*
  Obtiene el listado administrativo de reservas.
  */
  async getReservations(
    filters: ReservationsFilters = {},
  ): Promise<ReservationSummary[]> {
    const query =
      buildReservationsQueryParams(filters);

    const response =
      await httpClient<ReservationsResponse>(
        `/reservas${query ? `?${query}` : ""}`,
      );

    return response.data;
  },

  /*
  Obtiene el detalle administrativo completo
  de una reserva.
  */
  async getReservationById(
    reservationId: number,
  ): Promise<Reservation> {
    const response =
      await httpClient<ReservationResponse>(
        `/reservas/${reservationId}`,
      );

    return response.data;
  },

  /* =========================================================
     CONSULTAS DEL PORTAL DE SOCIOS
  ========================================================= */

  /*
  Obtiene las reservas pertenecientes
  al socio autenticado.

  Backend separa automáticamente:

  - reservas activas;
  - historial personal.
  */
  async getMyReservations(): Promise<
    MemberReservationsCollection
  > {
    const response =
      await httpClient<MemberReservationsResponse>(
        "/reservas/mis-reservas",
      );

    return response.data;
  },

  /*
  Obtiene una reserva específica verificando
  en backend que pertenezca al socio autenticado.
  */
  async getMyReservationById(
    reservationId: number,
  ): Promise<MemberReservation> {
    const response =
      await httpClient<MemberReservationResponse>(
        `/reservas/mis-reservas/${reservationId}`,
      );

    return response.data;
  },

  /* =========================================================
     OPERACIONES DEL PORTAL DE SOCIOS
  ========================================================= */

  /*
  Crea y procesa automáticamente una solicitud
  de reserva con uno o varios productos.

  El backend:

  - valida socio activo;
  - valida productos y cantidades;
  - calcula precios y subtotales;
  - calcula gramos totales;
  - registra inicialmente PENDIENTE;
  - valida stock;
  - valida límite legal mensual;
  - confirma y bloquea stock;
  - o rechaza conservando trazabilidad.

  El frontend debe interpretar el estado
  funcional de la reserva devuelta.
  */
  async createMemberReservation(
    payload: CreateMemberReservationPayload,
  ): Promise<CreateMemberReservationResult> {
    const response =
      await httpClient<CreateMemberReservationResponse>(
        "/reservas",
        {
          method: "POST",
          body: {
            detalles: payload.detalles,
            observaciones:
              payload.observaciones ?? null,
          },
        },
      );

    return {
      message: response.message,
      reservation: response.data,
    };
  },

  /* =========================================================
     OPERACIONES ADMINISTRATIVAS
  ========================================================= */

  /*
  Cancela manualmente una reserva confirmada.

  La validación del estado, liberación del stock,
  historial y auditoría corresponden al backend.
  */
  async cancelReservation(
    reservationId: number,
    payload: CancelReservationPayload = {},
  ): Promise<Reservation> {
    const response =
      await httpClient<ReservationResponse>(
        `/reservas/${reservationId}/cancelar`,
        {
          method: "PATCH",
          body: {
            observaciones:
              payload.observaciones,
          },
        },
      );

    return response.data;
  },

  /*
  Registra el retiro presencial de una reserva.

  El backend crea la venta, consume el stock
  reservado y finaliza el ciclo de vida dentro
  de una única transacción.
  */
  async confirmReservationWithdrawal(
    reservationId: number,
  ): Promise<Reservation> {
    const response =
      await httpClient<ReservationResponse>(
        `/reservas/${reservationId}/confirmar-retiro`,
        {
          method: "PATCH",
        },
      );

    return response.data;
  },
};