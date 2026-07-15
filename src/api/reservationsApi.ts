import { httpClient } from "./httpClient";

/* =========================================================
   ESTADOS Y TIPOS BASE
========================================================= */

/*
Estados soportados por el ciclo de vida
completo de una reserva.

PENDIENTE existe dentro del backend como
estado transitorio durante el procesamiento
automático de la solicitud.

Aunque no será expuesto como estado operativo
principal al administrador, forma parte del
contrato real del módulo.
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
con una reserva.
*/
export type ReservationUserStatus =
  | "ACTIVO"
  | "INACTIVO"
  | "BLOQUEADO";

/*
Estados posibles del socio asociado
a una reserva.
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
Genéticas soportadas por productos
de tipo FLOR.
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
   USUARIO Y SOCIO
========================================================= */

/*
Representa la información segura de usuario
devuelta por el backend dentro del módulo.

No expone información interna relacionada
con credenciales, intentos fallidos o bloqueos.
*/
export type ReservationUser = {
  id: number;

  email: string;

  rol: "ADMIN" | "SOCIO";

  estado: ReservationUserStatus;
};

/*
Representa el socio asociado a una reserva.

Incluye toda la información requerida por
el panel administrativo de detalle.
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
   PRODUCTOS Y DETALLES
========================================================= */

/*
Representa el producto reducido devuelto
dentro del listado administrativo.

La grilla no necesita cargar la información
completa del producto.

Esto mantiene desacoplado el listado del
modelo interno de Producto y evita transportar
información innecesaria.
*/
export type ReservationSummaryProduct = {
  id: number;

  nombre: string;

  tipo: "FLOR";

  unidad_medida: "GRAMOS";

  imagen_url: string | null;
};

/*
Representa el producto completo devuelto
dentro del detalle individual de una reserva.

Este contrato alimenta el panel lateral
Master / Detail.
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
de la consulta individual de una reserva.
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
   HISTORIAL Y VENTA ASOCIADA
========================================================= */

/*
Representa un cambio de estado registrado
dentro del historial funcional de la reserva.

El usuario puede ser null cuando el cambio
fue ejecutado automáticamente por el sistema.
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
Representa la venta generada cuando
el administrador confirma el retiro presencial
de una reserva.

La relación solamente existirá cuando
la reserva se encuentre FINALIZADA.
*/
export type ReservationSale = {
  id: number;

  fecha: string;

  estado: ReservationSaleStatus;

  total: number;
};

/* =========================================================
   RESERVA RESUMIDA Y COMPLETA
========================================================= */

/*
Representa una fila dentro del listado
administrativo principal.

Utiliza el DTO resumido expuesto por
reservaResumenSelect en backend.

No incluye historial, usuario responsable
ni venta completa porque esa información
pertenece al detalle individual.
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
Representa el detalle administrativo completo
de una reserva.

Este contrato alimenta:

- información del socio;
- fechas;
- productos;
- totales;
- historial;
- venta asociada;
- acciones contextuales.
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
   FILTROS ADMINISTRATIVOS
========================================================= */

/*
Filtros administrativos soportados por
el endpoint real del backend.

El backend devuelve los registros ordenados
por fecha_solicitud descendente.

Por este motivo no se incorpora ordenamiento
adicional dentro del contrato del frontend.
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
   PAYLOADS DE ACCIONES
========================================================= */

/*
Payload utilizado para cancelar manualmente
una reserva confirmada.

La observación permite dejar contexto funcional
dentro de HistorialReserva.

El backend continúa siendo responsable de:

- validar el estado;
- liberar stock;
- registrar movimiento;
- actualizar la reserva;
- registrar historial;
- generar auditoría.
*/
export type CancelReservationPayload = {
  observaciones?: string;
};

/* =========================================================
   RESPUESTAS DEL BACKEND
========================================================= */

/*
Respuesta devuelta por el backend al consultar
el listado administrativo de reservas.

El backend expone la colección bajo
la propiedad "data".
*/
type ReservationsResponse = {
  success: boolean;

  data: ReservationSummary[];
};

/*
Respuesta devuelta por el backend al consultar
el detalle individual de una reserva.
*/
type ReservationResponse = {
  success: boolean;

  message?: string;

  data: Reservation;
};

/* =========================================================
   API DEL MÓDULO
========================================================= */

/*
Centraliza las operaciones HTTP del módulo Reservas.

Arquitectura:

Container → Hook → API → httpClient → Backend

Los componentes nunca realizan llamadas HTTP
directamente.

Toda la comunicación con el backend pasa
por esta capa.
*/
export const reservationsApi = {
  /*
  Obtiene el listado administrativo de reservas.

  Los filtros son procesados por backend y
  los registros se devuelven ordenados por
  fecha de solicitud descendente.
  */
  async getReservations(
    filters: ReservationsFilters = {},
  ): Promise<ReservationSummary[]> {
    const params = new URLSearchParams();

    if (filters.search) {
      params.append("search", filters.search);
    }

    if (filters.estado) {
      params.append("estado", filters.estado);
    }

    if (filters.socioId) {
      params.append("socioId", String(filters.socioId));
    }

    if (filters.productoId) {
      params.append("productoId", String(filters.productoId));
    }

    if (filters.fechaDesde) {
      params.append("fechaDesde", filters.fechaDesde);
    }

    if (filters.fechaHasta) {
      params.append("fechaHasta", filters.fechaHasta);
    }

    const query = params.toString();

    const response = await httpClient<ReservationsResponse>(
      `/reservas${query ? `?${query}` : ""}`,
    );

    return response.data;
  },

  /*
  Obtiene el detalle administrativo completo
  de una reserva.

  Esta solicitud alimenta el panel lateral
  Master / Detail y evita sobrecargar la tabla
  principal con información innecesaria.
  */
  async getReservationById(
    reservationId: number,
  ): Promise<Reservation> {
    const response = await httpClient<ReservationResponse>(
      `/reservas/${reservationId}`,
    );

    return response.data;
  },

  /*
  Cancela manualmente una reserva confirmada.

  La validación del estado, liberación del stock,
  historial y auditoría son responsabilidad
  exclusiva del backend.
  */
  async cancelReservation(
    reservationId: number,
    payload: CancelReservationPayload = {},
  ): Promise<Reservation> {
    const response = await httpClient<ReservationResponse>(
      `/reservas/${reservationId}/cancelar`,
      {
        method: "PATCH",
        body: {
          observaciones: payload.observaciones,
        },
      },
    );

    return response.data;
  },

  /*
  Registra el retiro presencial de una reserva.

  El backend:

  - crea la venta asociada;
  - consume el stock reservado;
  - actualiza la reserva a FINALIZADA;
  - registra historial;
  - genera auditoría;

  todo dentro de una única transacción.
  */
  async confirmReservationWithdrawal(
    reservationId: number,
  ): Promise<Reservation> {
    const response = await httpClient<ReservationResponse>(
      `/reservas/${reservationId}/confirmar-retiro`,
      {
        method: "PATCH",
      },
    );

    return response.data;
  },
};