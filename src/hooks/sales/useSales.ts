import { useCallback, useState } from "react";

import {
  type Product,
  productsApi,
} from "@/api/productsApi";
import {
  type CreateSalePayload,
  type Sale,
  type SalesFilters,
  salesApi,
} from "@/api/salesApi";
import {
  type SocioVentaOption,
  sociosApi,
} from "@/api/sociosApi";

/*
Hook principal del módulo de ventas.

Responsabilidades:
- cargar historial de ventas;
- cargar socios y flores activas para el formulario;
- consultar detalle de venta;
- registrar venta directa presencial;
- anular venta registrada;
- exponer estados de carga/error a la UI.

No contiene JSX.
No conoce detalles visuales.
No llama a httpClient directamente.

El hook actúa como orquestador del módulo:
centraliza las APIs necesarias para que el
container no coordine dependencias cruzadas.
*/
export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  /*
  Socios disponibles para registrar ventas.

  El backend devuelve únicamente los socios
  habilitados para participar en una venta.
  */
  const [socios, setSocios] = useState<SocioVentaOption[]>([]);

  /*
  Productos tipo FLOR obtenidos desde backend.

  Ventas solo opera con flores activas.
  La consulta utiliza getProductOptions porque
  el formulario necesita una colección simple
  para selects, no un listado administrativo
  paginado.
  */
  const [products, setProducts] = useState<Product[]>([]);

  const [loadingSales, setLoadingSales] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
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
  Carga socios y flores activas necesarios
  para construir el formulario de venta.

  Ambas consultas se ejecutan en paralelo
  para reducir tiempos de espera.
  */
  const fetchSaleOptions = useCallback(async (): Promise<void> => {
    try {
      setLoadingOptions(true);
      setError(null);

      const [sociosData, productsData] = await Promise.all([
        sociosApi.getSociosOpcionesVenta(),
        productsApi.getProductOptions({
          tipo: "FLOR",
          estado: "ACTIVO",
          limit: 50,
        }),
      ]);

      setSocios(sociosData.socios);

      setProducts(productsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los datos para ventas.",
      );
    } finally {
      setLoadingOptions(false);
    }
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
        await fetchSaleOptions();

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
    [fetchSales, fetchSaleOptions],
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
        await fetchSaleOptions();

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
    [fetchSales, fetchSaleOptions],
  );

  return {
    sales,
    selectedSale,

    socios,
    products,

    loadingSales,
    loadingOptions,
    loadingDetail,
    savingSale,
    cancellingSale,

    error,

    fetchSales,
    fetchSaleOptions,
    fetchSaleById,
    createSale,
    cancelSale,
    setSelectedSale,
    clearError,
  };
}