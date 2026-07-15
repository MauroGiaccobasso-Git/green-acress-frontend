import { useCallback, useMemo, useRef, useState } from "react";

import {
  type CancelReservationPayload,
  type Reservation,
  type ReservationsFilters,
  type ReservationSummary,
  reservationsApi,
} from "@/api/reservationsApi";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

/*
Cantidad de reservas mostradas por página.

El backend actual devuelve el listado completo filtrado,
por lo que la paginación se administra en frontend.

Esta decisión es adecuada para el volumen operativo
previsto para el MVP del club y mantiene el comportamiento
visual utilizado en el módulo Stock.
*/
const RESERVATIONS_PAGE_SIZE = 5;

/*
Cantidad de horas utilizadas para identificar
reservas próximas a vencer.

El KPI operativo debe considerar exclusivamente
reservas CONFIRMADAS cuya fecha límite se encuentre
dentro de las próximas 24 horas.
*/
const EXPIRING_SOON_HOURS = 24;

/* =========================================================
   ESTADOS INICIALES
========================================================= */

/*
Estado inicial de filtros administrativos.

Se mantiene fuera del hook para reutilizarlo al aplicar
la limpieza completa del módulo sin reconstruir
manualmente el objeto.
*/
const initialReservationsFilters: ReservationsFilters = {
  search: "",
  estado: undefined,
  socioId: undefined,
  productoId: undefined,
  fechaDesde: undefined,
  fechaHasta: undefined,
};

/*
Estado inicial de los KPI administrativos.

Se utiliza antes de cargar datos y cuando la consulta
global no puede completarse correctamente.
*/
const initialReservationKpis = {
  confirmed: 0,
  expiringSoon: 0,
  completedThisMonth: 0,
  cancelledThisMonth: 0,
  expiredThisMonth: 0,
};

/* =========================================================
   TIPOS DERIVADOS PARA LA INTERFAZ
========================================================= */

/*
Representa los cinco indicadores operativos
definidos para la pantalla administrativa.
*/
export type ReservationKpis = {
  confirmed: number;

  expiringSoon: number;

  completedThisMonth: number;

  cancelledThisMonth: number;

  expiredThisMonth: number;
};

/*
Opción resumida de socio utilizada dentro
del panel avanzado de filtros.
*/
export type ReservationMemberOption = {
  id: number;

  fullName: string;

  document: string;
};

/*
Opción resumida de producto utilizada dentro
del panel avanzado de filtros.
*/
export type ReservationProductOption = {
  id: number;

  name: string;
};

/* =========================================================
   HELPERS DEL MÓDULO
========================================================= */

/*
El estado PENDIENTE forma parte del contrato backend,
pero no representa un estado operativo visible para
el administrador.

Se excluye defensivamente desde el hook para evitar
que una transición interna de microsegundos aparezca
accidentalmente en la interfaz.
*/
function removeTransientReservations(
  reservations: ReservationSummary[],
): ReservationSummary[] {
  return reservations.filter(
    (reservation) => reservation.estado !== "PENDIENTE",
  );
}

/*
Determina si una fecha pertenece al mes calendario
de referencia.

Los KPI mensuales utilizan fecha_actualizacion porque
representa el momento en que la reserva alcanzó
su estado operativo actual.
*/
function isDateWithinCurrentMonth(value: string, referenceDate: Date): boolean {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth()
  );
}

/*
Determina si una reserva confirmada vencerá
dentro de las próximas 24 horas.

No considera reservas cuya fecha límite ya pasó,
porque esas reservas deben ser procesadas por
el job automático de vencimientos.
*/
function isReservationExpiringSoon(
  reservation: ReservationSummary,
  referenceDate: Date,
): boolean {
  if (reservation.estado !== "CONFIRMADA" || !reservation.fecha_limite_retiro) {
    return false;
  }

  const expirationDate = new Date(reservation.fecha_limite_retiro);

  if (Number.isNaN(expirationDate.getTime())) {
    return false;
  }

  const expirationTime = expirationDate.getTime();
  const currentTime = referenceDate.getTime();

  const expirationThreshold =
    currentTime + EXPIRING_SOON_HOURS * 60 * 60 * 1000;

  return expirationTime > currentTime && expirationTime <= expirationThreshold;
}

/*
Calcula los KPI globales del módulo.

Los indicadores se obtienen desde la colección global
sin filtros para evitar que cambien al buscar, filtrar
o paginar la tabla administrativa.
*/
function calculateReservationKpis(
  reservations: ReservationSummary[],
  referenceDate: Date,
): ReservationKpis {
  return reservations.reduce<ReservationKpis>(
    (kpis, reservation) => {
      if (reservation.estado === "CONFIRMADA") {
        kpis.confirmed += 1;
      }

      if (isReservationExpiringSoon(reservation, referenceDate)) {
        kpis.expiringSoon += 1;
      }

      if (
        reservation.estado === "FINALIZADA" &&
        isDateWithinCurrentMonth(reservation.fecha_actualizacion, referenceDate)
      ) {
        kpis.completedThisMonth += 1;
      }

      if (
        reservation.estado === "CANCELADA" &&
        isDateWithinCurrentMonth(reservation.fecha_actualizacion, referenceDate)
      ) {
        kpis.cancelledThisMonth += 1;
      }

      if (
        reservation.estado === "VENCIDA" &&
        isDateWithinCurrentMonth(reservation.fecha_actualizacion, referenceDate)
      ) {
        kpis.expiredThisMonth += 1;
      }

      return kpis;
    },
    {
      ...initialReservationKpis,
    },
  );
}

/* =========================================================
   HOOK PRINCIPAL
========================================================= */

/*
Hook principal del módulo administrativo de Reservas.

Responsabilidades:
- cargar el listado administrativo;
- cargar la colección global utilizada por los KPI;
- aplicar y limpiar filtros;
- manejar paginación frontend;
- obtener el detalle completo de una reserva;
- mantener la selección Master / Detail;
- cancelar reservas confirmadas;
- registrar retiros presenciales;
- sincronizar listado, detalle y KPI luego de cada acción;
- exponer estados de carga, error y feedback a la UI.

No contiene JSX.
No conoce detalles visuales.
No llama a httpClient directamente.
No implementa reglas críticas de negocio.

El hook actúa como orquestador completo del módulo,
evitando que el container coordine APIs o mantenga
lógica funcional dispersa.
*/
export function useReservations() {
  /*
  Colección global sin filtros.

  Se utiliza exclusivamente para:

  - calcular KPI globales;
  - construir opciones de socios;
  - construir opciones de productos;
  - diferenciar Empty de No Results.
  */
  const [reservationCatalog, setReservationCatalog] = useState<
    ReservationSummary[]
  >([]);

  /*
  Colección administrativa resultante
  de los filtros activos.
  */
  const [reservations, setReservations] = useState<ReservationSummary[]>([]);

  /*
  Reserva completa seleccionada dentro
  del patrón Master / Detail.
  */
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  /*
  Filtros actualmente aplicados sobre
  el listado administrativo.
  */
  const [reservationFilters, setReservationFilters] =
    useState<ReservationsFilters>(initialReservationsFilters);

  /*
  Página actual de la tabla.

  La colección ya fue filtrada por backend y luego
  se pagina localmente para el volumen del MVP.
  */
  const [currentPage, setCurrentPage] = useState(1);

  /*
  Momento de referencia utilizado para calcular
  KPI temporales de manera consistente.

  Se actualiza cada vez que se recarga la colección
  global del módulo.
  */
  const [metricsReferenceDate, setMetricsReferenceDate] = useState<Date>(
    new Date(),
  );

  const [loadingCatalog, setLoadingCatalog] = useState(false);

  const [loadingReservations, setLoadingReservations] = useState(false);

  const [loadingDetail, setLoadingDetail] = useState(false);

  const [cancellingReservation, setCancellingReservation] = useState(false);

  const [confirmingWithdrawal, setConfirmingWithdrawal] = useState(false);

  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [reservationsError, setReservationsError] = useState<string | null>(
    null,
  );

  const [detailError, setDetailError] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  /*
  Mantiene disponible el identificador seleccionado
  sin agregar selectedReservation como dependencia
  de los callbacks de carga.

  Esto permite conservar funciones estables y evita
  ejecutar efectos innecesarios desde el container.
  */
  const selectedReservationIdRef = useRef<number | null>(null);

  /* =========================================================
     VALORES DERIVADOS
  ========================================================= */

  /*
  Indica si existen filtros administrativos activos.

  Se utiliza para:

  - mostrar feedback visual;
  - habilitar la acción Limpiar filtros;
  - diferenciar Empty de No Results.
  */
  const hasFiltersApplied = useMemo(() => {
    return Boolean(
      reservationFilters.search ||
      reservationFilters.estado ||
      reservationFilters.socioId ||
      reservationFilters.productoId ||
      reservationFilters.fechaDesde ||
      reservationFilters.fechaHasta,
    );
  }, [reservationFilters]);

  /*
  KPI globales del módulo.

  No dependen de filtros ni de la página visible.
  */
  const reservationKpis = useMemo(() => {
    return calculateReservationKpis(reservationCatalog, metricsReferenceDate);
  }, [reservationCatalog, metricsReferenceDate]);

  /*
  Opciones únicas de socios obtenidas desde
  la colección global de reservas.

  No se realiza una llamada adicional a Socios porque
  el filtro solamente necesita socios que realmente
  tengan reservas registradas.
  */
  const memberOptions = useMemo<ReservationMemberOption[]>(() => {
    const options = new Map<number, ReservationMemberOption>();

    reservationCatalog.forEach((reservation) => {
      const member = reservation.socio;

      if (!options.has(member.id)) {
        options.set(member.id, {
          id: member.id,
          fullName: `${member.nombre} ${member.apellido}`,
          document: member.documento,
        });
      }
    });

    return Array.from(options.values()).sort((firstMember, secondMember) =>
      firstMember.fullName.localeCompare(secondMember.fullName, "es"),
    );
  }, [reservationCatalog]);

  /*
  Opciones únicas de productos obtenidas desde
  las reservas existentes.

  El filtro no necesita mostrar productos que jamás
  participaron en una reserva administrativa.
  */
  const productOptions = useMemo<ReservationProductOption[]>(() => {
    const options = new Map<number, ReservationProductOption>();

    reservationCatalog.forEach((reservation) => {
      reservation.detalles.forEach((detail) => {
        if (!options.has(detail.producto.id)) {
          options.set(detail.producto.id, {
            id: detail.producto.id,
            name: detail.producto.nombre,
          });
        }
      });
    });

    return Array.from(options.values()).sort((firstProduct, secondProduct) =>
      firstProduct.name.localeCompare(secondProduct.name, "es"),
    );
  }, [reservationCatalog]);

  /*
  Metadata de paginación frontend.

  La tabla recibe únicamente los registros
  correspondientes a la página actual.
  */
  const totalReservations = reservations.length;

  const totalPages = Math.ceil(totalReservations / RESERVATIONS_PAGE_SIZE);

  const paginatedReservations = useMemo(() => {
    const startIndex = (currentPage - 1) * RESERVATIONS_PAGE_SIZE;

    return reservations.slice(startIndex, startIndex + RESERVATIONS_PAGE_SIZE);
  }, [currentPage, reservations]);

  /*
  Permite distinguir los estados UX:

  Empty:
  nunca existieron reservas.

  No Results:
  existen reservas globales, pero ninguna coincide
  con los filtros actualmente aplicados.
  */
  const hasRegisteredReservations = reservationCatalog.length > 0;

  const hasResults = reservations.length > 0;

  /* =========================================================
     FEEDBACK
  ========================================================= */

  /*
  Limpia mensajes relacionados con acciones
  administrativas.

  Se utiliza al cerrar alerts, diálogos o iniciar
  una nueva operación.
  */
  const clearActionFeedback = useCallback(() => {
    setActionError(null);
    setActionSuccess(null);
  }, []);

  /*
  Limpia errores específicos del panel de detalle.

  Permite seleccionar otra reserva sin conservar
  feedback perteneciente a una consulta anterior.
  */
  const clearDetailError = useCallback(() => {
    setDetailError(null);
  }, []);

  /* =========================================================
     DETALLE MASTER / DETAIL
  ========================================================= */

  /*
  Obtiene el detalle completo de una reserva.

  Esta consulta alimenta el panel lateral y mantiene
  separada la respuesta resumida de la tabla respecto
  al DTO completo del backend.
  */
  const fetchReservationById = useCallback(
    async (reservationId: number): Promise<Reservation | null> => {
      try {
        setLoadingDetail(true);
        setDetailError(null);

        const reservation =
          await reservationsApi.getReservationById(reservationId);

        selectedReservationIdRef.current = reservation.id;

        setSelectedReservation(reservation);

        return reservation;
      } catch (err) {
        selectedReservationIdRef.current = null;

        setSelectedReservation(null);

        setDetailError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar el detalle de la reserva.",
        );

        return null;
      } finally {
        setLoadingDetail(false);
      }
    },
    [],
  );

  /*
  Selecciona una reserva desde la tabla.

  Toda la fila será clickeable y esta función actualizará
  el panel derecho sin abrir modales ni cambiar de ruta.
  */
  const selectReservation = useCallback(
    async (reservationId: number) => {
      if (
        selectedReservationIdRef.current === reservationId &&
        selectedReservation
      ) {
        return selectedReservation;
      }

      return fetchReservationById(reservationId);
    },
    [fetchReservationById, selectedReservation],
  );

  /*
  Limpia completamente la selección actual.

  Se utiliza cuando una búsqueda no devuelve resultados
  o cuando la colección queda vacía.
  */
  const clearSelectedReservation = useCallback(() => {
    selectedReservationIdRef.current = null;

    setSelectedReservation(null);
    setDetailError(null);
  }, []);

  /* =========================================================
     CARGA DE DATOS
  ========================================================= */

  /*
  Carga la colección global del módulo.

  Esta consulta no utiliza filtros y alimenta:

  - KPI;
  - opciones avanzadas;
  - estado Empty;
  - referencias globales del módulo.

  No reemplaza el listado filtrado visible.
  */
  const fetchReservationCatalog = useCallback(async (): Promise<
    ReservationSummary[] | null
  > => {
    try {
      setLoadingCatalog(true);
      setCatalogError(null);

      const data = await reservationsApi.getReservations();

      const visibleReservations = removeTransientReservations(data);

      setReservationCatalog(visibleReservations);
      setMetricsReferenceDate(new Date());

      return visibleReservations;
    } catch (err) {
      setReservationCatalog([]);

      setCatalogError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar el resumen de reservas.",
      );

      return null;
    } finally {
      setLoadingCatalog(false);
    }
  }, []);

  /*
  Carga el listado administrativo según los filtros
  recibidos desde el container.

  Después de actualizar la colección:

  - conserva la selección actual si continúa visible;
  - selecciona automáticamente la primera reserva;
  - limpia el panel cuando no existen resultados.

  Esto mantiene coherente el patrón Master / Detail.
  */
  const fetchReservations = useCallback(
    async (
      filters: ReservationsFilters = initialReservationsFilters,
    ): Promise<ReservationSummary[] | null> => {
      try {
        setLoadingReservations(true);
        setReservationsError(null);

        const data = await reservationsApi.getReservations(filters);

        const visibleReservations = removeTransientReservations(data);

        setReservations(visibleReservations);

        const selectedReservationId = selectedReservationIdRef.current;

        const selectedReservationStillVisible =
          selectedReservationId !== null &&
          visibleReservations.some(
            (reservation) => reservation.id === selectedReservationId,
          );

        if (selectedReservationStillVisible) {
          await fetchReservationById(selectedReservationId);
        } else if (visibleReservations.length > 0) {
          await fetchReservationById(visibleReservations[0].id);
        } else {
          clearSelectedReservation();
        }

        return visibleReservations;
      } catch (err) {
        setReservations([]);
        clearSelectedReservation();

        setReservationsError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las reservas.",
        );

        return null;
      } finally {
        setLoadingReservations(false);
      }
    },
    [clearSelectedReservation, fetchReservationById],
  );

  /*
  Ejecuta la carga inicial completa del módulo.

  La consulta global se realiza una única vez y se reutiliza
  para alimentar tanto el catálogo como el listado inicial,
  evitando dos solicitudes idénticas al abrir la pantalla.

  Luego selecciona automáticamente la primera reserva
  disponible para completar el panel Master / Detail.
  */
  const fetchInitialReservations = useCallback(async () => {
    try {
      setLoadingCatalog(true);
      setLoadingReservations(true);

      setCatalogError(null);
      setReservationsError(null);

      const data = await reservationsApi.getReservations();

      const visibleReservations = removeTransientReservations(data);

      setReservationCatalog(visibleReservations);
      setReservations(visibleReservations);

      setReservationFilters(initialReservationsFilters);

      setCurrentPage(1);
      setMetricsReferenceDate(new Date());

      if (visibleReservations.length > 0) {
        await fetchReservationById(visibleReservations[0].id);
      } else {
        clearSelectedReservation();
      }

      return visibleReservations;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las reservas.";

      setReservationCatalog([]);
      setReservations([]);

      clearSelectedReservation();

      setCatalogError(message);
      setReservationsError(message);

      return null;
    } finally {
      setLoadingCatalog(false);
      setLoadingReservations(false);
    }
  }, [clearSelectedReservation, fetchReservationById]);

  /* =========================================================
     FILTROS
  ========================================================= */

  /*
  Aplica filtros administrativos.

  Toda nueva búsqueda vuelve a la primera página para evitar
  mostrar una página inexistente dentro del nuevo resultado.
  */
  const applyReservationFilters = useCallback(
    async (filters: ReservationsFilters) => {
      const nextFilters: ReservationsFilters = {
        search: filters.search?.trim() || "",
        estado: filters.estado,
        socioId: filters.socioId,
        productoId: filters.productoId,
        fechaDesde: filters.fechaDesde,
        fechaHasta: filters.fechaHasta,
      };

      setReservationFilters(nextFilters);
      setCurrentPage(1);

      return fetchReservations(nextFilters);
    },
    [fetchReservations],
  );

  /*
  Limpia todos los filtros y restaura
  el listado administrativo completo.
  */
  const clearReservationFilters = useCallback(async () => {
    setReservationFilters(initialReservationsFilters);

    setCurrentPage(1);

    return fetchReservations(initialReservationsFilters);
  }, [fetchReservations]);

  /* =========================================================
     PAGINACIÓN
  ========================================================= */

  /*
  Cambia la página visible de la tabla.

  No realiza una nueva solicitud porque el backend actual
  ya devolvió la colección completa correspondiente
  a los filtros activos.
  */
  const changeReservationPage = useCallback(
    (page: number) => {
      const maximumPage = Math.max(totalPages, 1);

      const safePage = Math.min(Math.max(page, 1), maximumPage);

      setCurrentPage(safePage);
    },
    [totalPages],
  );

  /* =========================================================
     SINCRONIZACIÓN POSTERIOR A ACCIONES
  ========================================================= */

  /*
  Recarga catálogo y listado después de una operación
  que modifica el ciclo de vida de una reserva.

  Las consultas se ejecutan en paralelo para reducir
  el tiempo de espera.

  El listado conserva los filtros actualmente aplicados.
  */
  const refreshReservationsAfterAction = useCallback(async () => {
    await Promise.all([
      fetchReservationCatalog(),
      fetchReservations(reservationFilters),
    ]);
  }, [fetchReservationCatalog, fetchReservations, reservationFilters]);

  /* =========================================================
     ACCIONES ADMINISTRATIVAS
  ========================================================= */

  /*
  Cancela una reserva confirmada.

  El backend conserva la responsabilidad exclusiva de:

  - validar estado;
  - liberar stock reservado;
  - registrar movimiento de inventario;
  - actualizar la reserva;
  - registrar historial;
  - generar auditoría.
  */
  const cancelReservation = useCallback(
    async (
      reservationId: number,
      payload: CancelReservationPayload = {},
    ): Promise<Reservation | null> => {
      try {
        setCancellingReservation(true);
        setActionError(null);
        setActionSuccess(null);

        const cancelledReservation = await reservationsApi.cancelReservation(
          reservationId,
          payload,
        );

        selectedReservationIdRef.current = cancelledReservation.id;

        setSelectedReservation(cancelledReservation);

        await refreshReservationsAfterAction();

        setActionSuccess("La reserva fue cancelada correctamente.");

        return cancelledReservation;
      } catch (err) {
        setActionError(
          err instanceof Error
            ? err.message
            : "No se pudo cancelar la reserva.",
        );

        return null;
      } finally {
        setCancellingReservation(false);
      }
    },
    [refreshReservationsAfterAction],
  );

  /*
  Registra el retiro presencial de una reserva.

  El backend convierte la reserva en venta,
  consume el stock previamente reservado y
  actualiza su estado a FINALIZADA dentro
  de una única transacción.
  */
  const confirmReservationWithdrawal = useCallback(
    async (reservationId: number): Promise<Reservation | null> => {
      try {
        setConfirmingWithdrawal(true);
        setActionError(null);
        setActionSuccess(null);

        const completedReservation =
          await reservationsApi.confirmReservationWithdrawal(reservationId);

        selectedReservationIdRef.current = completedReservation.id;

        setSelectedReservation(completedReservation);

        await refreshReservationsAfterAction();

        setActionSuccess(
          "El retiro fue registrado y la reserva se convirtió en venta.",
        );

        return completedReservation;
      } catch (err) {
        setActionError(
          err instanceof Error
            ? err.message
            : "No se pudo registrar el retiro de la reserva.",
        );

        return null;
      } finally {
        setConfirmingWithdrawal(false);
      }
    },
    [refreshReservationsAfterAction],
  );

  /* =========================================================
     RETORNO PÚBLICO DEL HOOK
  ========================================================= */

  return {
    reservationCatalog,
    reservations,
    paginatedReservations,
    selectedReservation,

    reservationFilters,
    reservationKpis,

    memberOptions,
    productOptions,

    currentPage,
    pageSize: RESERVATIONS_PAGE_SIZE,
    totalReservations,
    totalPages,

    hasFiltersApplied,
    hasRegisteredReservations,
    hasResults,

    loadingCatalog,
    loadingReservations,
    loadingDetail,
    cancellingReservation,
    confirmingWithdrawal,

    catalogError,
    reservationsError,
    detailError,
    actionError,
    actionSuccess,

    fetchInitialReservations,
    fetchReservationCatalog,
    fetchReservations,
    fetchReservationById,

    applyReservationFilters,
    clearReservationFilters,

    selectReservation,
    clearSelectedReservation,

    changeReservationPage,

    cancelReservation,
    confirmReservationWithdrawal,

    clearActionFeedback,
    clearDetailError,
  };
}
