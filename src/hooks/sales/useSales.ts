import { useCallback, useState } from "react";

import {
  CreateSalePayload,
  Sale,
  SalesFilters,
  salesApi,
} from "@/api/salesApi";

/*
Hook principal del módulo de ventas.

Responsabilidades:
- cargar historial de ventas;
- consultar detalle de venta;
- registrar venta directa presencial;
- anular venta registrada;
- exponer estados de carga/error a la UI.

No contiene JSX.
No conoce detalles visuales.
No llama a httpClient directamente.
No decide cuándo se carga la información inicial:
esa responsabilidad queda en el container.
*/
export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const [loadingSales, setLoadingSales] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [savingSale, setSavingSale] = useState(false);
  const [cancellingSale, setCancellingSale] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
  Limpia el error actual.

  Útil para cerrar alerts desde la interfaz.
  */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /*
  Carga el historial de ventas.

  Los criterios de búsqueda y filtrado son
  definidos por el container y enviados
  mediante un objeto de filtros.
  */
  const fetchSales = useCallback(async (filters: SalesFilters = {}) => {
    try {
      setLoadingSales(true);
      setError(null);

      const salesData = await salesApi.getSales(filters);

      setSales(salesData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las ventas.",
      );
    } finally {
      setLoadingSales(false);
    }
  }, []);

  /*
  Obtiene el detalle completo de una venta.
  */
  const fetchSaleById = useCallback(async (saleId: number) => {
    try {
      setLoadingDetail(true);
      setError(null);

      const saleData = await salesApi.getSaleById(saleId);

      setSelectedSale(saleData);

      return saleData;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar el detalle de la venta.",
      );

      return null;
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  /*
  Registra una nueva venta directa presencial.

  El backend valida socio, stock, producto FLOR,
  límite legal, auditoría y movimiento de stock.
  */
  const createSale = useCallback(
    async (payload: CreateSalePayload) => {
      try {
        setSavingSale(true);
        setError(null);

        const createdSale = await salesApi.createSale(payload);

        await fetchSales();

        return createdSale;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo registrar la venta.",
        );

        return null;
      } finally {
        setSavingSale(false);
      }
    },
    [fetchSales],
  );

  /*
  Anula una venta registrada.

  La restitución de stock, movimiento de stock
  y auditoría quedan bajo responsabilidad backend.
  */
  const cancelSale = useCallback(
    async (saleId: number) => {
      try {
        setCancellingSale(true);
        setError(null);

        const cancelledSale = await salesApi.cancelSale(saleId);

        await fetchSales();

        setSelectedSale((currentSale) =>
          currentSale?.id === saleId ? cancelledSale : currentSale,
        );

        return cancelledSale;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo anular la venta.",
        );

        return null;
      } finally {
        setCancellingSale(false);
      }
    },
    [fetchSales],
  );

  return {
    sales,
    selectedSale,

    loadingSales,
    loadingDetail,
    savingSale,
    cancellingSale,

    error,

    fetchSales,
    fetchSaleById,
    createSale,
    cancelSale,
    setSelectedSale,
    clearError,
  };
}