import { useCallback, useMemo, useState } from "react";

import {
  AdjustStockPayload,
  Pagination,
  StockFilters,
  StockItem,
  StockMovement,
  StockMovementFilters,
  StockSummary,
  stockApi,
} from "@/api/stockApi";

/*
Cantidad de registros por página para el inventario.

Se define en el hook porque forma parte del comportamiento
del módulo y debe viajar hacia el backend como parámetro
de paginación real.
*/
const STOCK_PAGE_SIZE = 5;

/*
Cantidad de movimientos mostrados por página.

En el panel lateral se utilizará para mostrar los últimos
5 movimientos recientes. En el modal de historial completo
se reutilizará como paginación real contra backend.
*/
const MOVEMENTS_PAGE_SIZE = 5;

/*
Estado inicial del resumen global de inventario.

Se utiliza para inicializar las KPI y para limpiar valores
cuando la consulta del resumen falla.
*/
const initialStockSummary: StockSummary = {
  productosInventario: 0,
  stockFloresDisponible: 0,
  stockSemillasDisponible: 0,
  productosSinStock: 0,
};

/*
Estado inicial de paginación.

Se reutiliza cuando una consulta falla o cuando todavía
no existe metadata devuelta por el backend.
*/
const initialPagination: Pagination = {
  page: 1,
  limit: 5,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

/*
Estado inicial de filtros del inventario.

Se mantiene fuera del hook para poder reutilizarlo
al limpiar filtros sin recrear objetos manualmente.
*/
const initialStockFilters: StockFilters = {
  search: "",
  tipo: undefined,
  estado: undefined,
  page: 1,
  limit: STOCK_PAGE_SIZE,
};

/*
Estado inicial de filtros del historial específico
de movimientos de inventario.
*/
const initialMovementFilters: StockMovementFilters = {
  search: "",
  tipo: undefined,
  referenciaTipo: undefined,
  fechaDesde: undefined,
  fechaHasta: undefined,
  page: 1,
  limit: MOVEMENTS_PAGE_SIZE,
};

/*
Hook principal del módulo Stock.

Responsabilidades:
- cargar resumen global para KPI administrativas;
- cargar inventario operativo;
- consultar historial específico de movimientos de stock;
- aplicar y limpiar filtros;
- manejar paginación real contra backend;
- acumular páginas del historial mediante "Cargar más";
- realizar ajustes manuales de stock;
- exponer estados de carga/error a la UI.

No contiene JSX.
No conoce detalles visuales.
No llama a httpClient directamente.
No decide cuándo se carga la información inicial:
esa responsabilidad queda en el container.
*/
export function useStock() {
  const [stockSummary, setStockSummary] =
    useState<StockSummary>(initialStockSummary);

  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  const [stockPagination, setStockPagination] =
    useState<Pagination>(initialPagination);

  const [movementPagination, setMovementPagination] =
    useState<Pagination>(initialPagination);

  const [stockFilters, setStockFilters] =
    useState<StockFilters>(initialStockFilters);

  const [movementFilters, setMovementFilters] = useState<StockMovementFilters>(
    initialMovementFilters,
  );

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingStock, setLoadingStock] = useState(false);
  const [loadingMovements, setLoadingMovements] = useState(false);
  const [loadingMoreMovements, setLoadingMoreMovements] = useState(false);
  const [adjustingStock, setAdjustingStock] = useState(false);

  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);
  const [movementError, setMovementError] = useState<string | null>(null);
  const [adjustmentError, setAdjustmentError] = useState<string | null>(null);
  const [adjustmentSuccess, setAdjustmentSuccess] = useState<string | null>(
    null,
  );

  /*
  Indica si existen filtros activos sobre el inventario.

  Se utiliza para mostrar feedback visual y habilitar
  la acción externa de limpiar filtros.
  */
  const hasStockFiltersApplied = useMemo(() => {
    return Boolean(
      stockFilters.search || stockFilters.tipo || stockFilters.estado,
    );
  }, [stockFilters]);

  /*
  Indica si existen filtros activos sobre el historial
  específico de movimientos de inventario.
  */
  const hasMovementFiltersApplied = useMemo(() => {
    return Boolean(
      movementFilters.search ||
        movementFilters.tipo ||
        movementFilters.referenciaTipo ||
        movementFilters.fechaDesde ||
        movementFilters.fechaHasta,
    );
  }, [movementFilters]);

  /*
  Limpia los mensajes del ajuste manual.

  Útil al cerrar el modal o iniciar una nueva operación.
  */
  const clearAdjustmentFeedback = useCallback(() => {
    setAdjustmentError(null);
    setAdjustmentSuccess(null);
  }, []);

  /*
  Carga el resumen global del inventario.

  Este resumen alimenta las KPI administrativas y no depende
  de la página actual del inventario, evitando métricas
  parciales calculadas desde datos paginados.
  */
  const fetchStockSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      setSummaryError(null);

      const summary = await stockApi.getStockSummary();

      setStockSummary(summary);
    } catch (err) {
      setStockSummary(initialStockSummary);

      setSummaryError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar el resumen de stock.",
      );
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  /*
  Carga el inventario operativo.

  Los criterios de búsqueda, filtrado y paginación son
  definidos por el container y enviados mediante un
  objeto de filtros hacia la capa API.

  Se mantiene estable para evitar renders o efectos
  innecesarios cuando cambian los filtros del módulo.
  */
  const fetchStock = useCallback(
    async (filters: StockFilters = initialStockFilters) => {
      try {
        setLoadingStock(true);
        setStockError(null);

        const result = await stockApi.getStock({
          ...filters,
          page: filters.page ?? 1,
          limit: filters.limit ?? STOCK_PAGE_SIZE,
        });

        setStockItems(result.data);
        setStockPagination(result.pagination);
      } catch (err) {
        setStockItems([]);
        setStockPagination(initialPagination);

        setStockError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar el inventario.",
        );
      } finally {
        setLoadingStock(false);
      }
    },
    [],
  );

  /*
  Carga el historial específico de movimientos de inventario.

  Este historial pertenece al módulo Stock y no reemplaza
  al futuro módulo global de Historial y Trazabilidad.

  La consulta reemplaza los resultados visibles cuando cambian
  los filtros o cuando se abre nuevamente el historial.

  Se mantiene estable para evitar ciclos de renderizado en
  componentes que aplican búsquedas con debounce.
  */
  const fetchMovements = useCallback(
    async (filters: StockMovementFilters = initialMovementFilters) => {
      try {
        setLoadingMovements(true);
        setMovementError(null);

        const result = await stockApi.getStockMovements({
          ...filters,
          page: filters.page ?? 1,
          limit: filters.limit ?? MOVEMENTS_PAGE_SIZE,
        });

        setMovements(result.data);
        setMovementPagination(result.pagination);
      } catch (err) {
        setMovements([]);
        setMovementPagination(initialPagination);

        setMovementError(
          err instanceof Error
            ? err.message
            : "No se pudo cargar el historial de movimientos.",
        );
      } finally {
        setLoadingMovements(false);
      }
    },
    [],
  );

  /*
  Aplica filtros sobre el inventario.

  Al aplicar nuevos filtros se vuelve a la primera página,
  evitando solicitar una página que quizá ya no exista para
  el nuevo resultado filtrado.
  */
  const applyStockFilters = useCallback(
    async (filters: StockFilters) => {
      const nextFilters: StockFilters = {
        ...filters,
        page: 1,
        limit: STOCK_PAGE_SIZE,
      };

      setStockFilters(nextFilters);

      await fetchStock(nextFilters);
    },
    [fetchStock],
  );

  /*
  Limpia los filtros del inventario y recarga
  el listado completo desde la primera página.
  */
  const clearStockFilters = useCallback(async () => {
    setStockFilters(initialStockFilters);

    await fetchStock(initialStockFilters);
  }, [fetchStock]);

  /*
  Cambia la página actual del inventario.

  La paginación se ejecuta contra backend para mantener
  la separación correcta de responsabilidades.
  */
  const changeStockPage = useCallback(
    async (page: number) => {
      const nextFilters: StockFilters = {
        ...stockFilters,
        page,
        limit: STOCK_PAGE_SIZE,
      };

      setStockFilters(nextFilters);

      await fetchStock(nextFilters);
    },
    [fetchStock, stockFilters],
  );

  /*
  Aplica filtros sobre el historial específico
  de movimientos de inventario.

  Toda nueva búsqueda del historial reinicia la página
  y reemplaza los resultados acumulados para mantener
  consistencia entre filtros y datos visibles.
  */
  const applyMovementFilters = useCallback(
    async (filters: StockMovementFilters) => {
      const nextFilters: StockMovementFilters = {
        ...filters,
        page: 1,
        limit: MOVEMENTS_PAGE_SIZE,
      };

      setMovementFilters(nextFilters);

      await fetchMovements(nextFilters);
    },
    [fetchMovements],
  );

  /*
  Limpia los filtros del historial específico
  de movimientos y recarga el listado completo.
  */
  const clearMovementFilters = useCallback(async () => {
    setMovementFilters(initialMovementFilters);

    await fetchMovements(initialMovementFilters);
  }, [fetchMovements]);

  /*
  Cambia la página actual del historial de movimientos.

  Se mantiene disponible para casos donde el módulo requiera
  navegación paginada explícita, aunque el modal principal
  utilizará el patrón "Cargar más".
  */
  const changeMovementPage = useCallback(
    async (page: number) => {
      const nextFilters: StockMovementFilters = {
        ...movementFilters,
        page,
        limit: MOVEMENTS_PAGE_SIZE,
      };

      setMovementFilters(nextFilters);

      await fetchMovements(nextFilters);
    },
    [fetchMovements, movementFilters],
  );

  /*
  Carga la siguiente página del historial y la acumula
  sobre los movimientos ya visibles.

  Esta operación permite reemplazar el paginador numérico
  del modal por un flujo más natural de "Cargar más",
  manteniendo la paginación real en backend y evitando
  cargar todo el historial de una sola vez.
  */
  const loadMoreMovements = useCallback(async () => {
    if (!movementPagination.hasNextPage || loadingMoreMovements) {
      return;
    }

    try {
      setLoadingMoreMovements(true);
      setMovementError(null);

      const nextPage = movementPagination.page + 1;

      const nextFilters: StockMovementFilters = {
        ...movementFilters,
        page: nextPage,
        limit: MOVEMENTS_PAGE_SIZE,
      };

      const result = await stockApi.getStockMovements(nextFilters);

      setMovements((currentMovements) => [...currentMovements, ...result.data]);

      setMovementFilters(nextFilters);
      setMovementPagination(result.pagination);
    } catch (err) {
      setMovementError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar más movimientos.",
      );
    } finally {
      setLoadingMoreMovements(false);
    }
  }, [movementFilters, movementPagination, loadingMoreMovements]);

  /*
  Realiza un ajuste manual de stock.

  El backend valida:
  - producto existente;
  - variación numérica;
  - variación distinta de cero;
  - compatibilidad de la variación con la unidad operativa del producto;
  - stock total resultante no negativo;
  - stock total resultante no menor al stock reservado;
  - observación obligatoria;
  - permisos de administrador.
  */
  const adjustStock = useCallback(
    async (productId: number, payload: AdjustStockPayload) => {
      try {
        setAdjustingStock(true);
        setAdjustmentError(null);
        setAdjustmentSuccess(null);

        await stockApi.adjustStock(productId, payload);

        setAdjustmentSuccess("Stock ajustado correctamente.");

        await Promise.all([
          fetchStockSummary(),
          fetchStock(stockFilters),
          fetchMovements({
            ...movementFilters,
            page: 1,
            limit: MOVEMENTS_PAGE_SIZE,
          }),
        ]);

        return true;
      } catch (err) {
        setAdjustmentError(
          err instanceof Error ? err.message : "No se pudo ajustar el stock.",
        );

        return false;
      } finally {
        setAdjustingStock(false);
      }
    },
    [
      fetchStockSummary,
      fetchStock,
      fetchMovements,
      stockFilters,
      movementFilters,
    ],
  );

  return {
    stockSummary,
    stockItems,
    movements,

    stockPagination,
    movementPagination,

    stockFilters,
    movementFilters,

    loadingSummary,
    loadingStock,
    loadingMovements,
    loadingMoreMovements,
    adjustingStock,

    summaryError,
    stockError,
    movementError,
    adjustmentError,
    adjustmentSuccess,

    hasStockFiltersApplied,
    hasMovementFiltersApplied,

    fetchStockSummary,
    fetchStock,
    fetchMovements,

    applyStockFilters,
    clearStockFilters,
    changeStockPage,

    applyMovementFilters,
    clearMovementFilters,
    changeMovementPage,
    loadMoreMovements,

    adjustStock,
    clearAdjustmentFeedback,
  };
}