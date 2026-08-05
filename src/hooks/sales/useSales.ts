import { useCallback, useRef, useState } from "react";

import {
  type SaleProductOption,
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
- cargar socios y flores habilitadas para el formulario;
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
  Productos habilitados para registrar ventas.

  El backend aplica las reglas de negocio
  correspondientes y devuelve un contrato
  operativo reducido para el formulario.
  */
  const [products, setProducts] = useState<SaleProductOption[]>([]);

  const [loadingSales, setLoadingSales] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [savingSale, setSavingSale] = useState(false);
  const [cancellingSale, setCancellingSale] = useState(false);

  /* =========================================================
     PROTECCIÓN SINCRÓNICA CONTRA ENVÍOS DUPLICADOS
  ========================================================= */

  /*
  Los estados de React actualizan la interfaz, pero su cambio
  no es inmediato dentro del mismo ciclo de eventos.

  Por eso, dos clics extremadamente rápidos podrían ejecutar
  createSale antes de que savingSale llegue a true.

  Este ref funciona como un cierre sincrónico:

  primer clic  → obtiene el cierre;
  segundo clic → se descarta inmediatamente;
  finally      → libera el cierre.

  El backend mantiene la seguridad real mediante transacciones
  y bloqueos de PostgreSQL. Esta protección frontend evita
  solicitudes duplicadas accidentales y mejora la UX.
  */
  const savingSaleGuardRef = useRef(false);

  /*
  Aplica la misma protección a la anulación de ventas.

  Evita que un doble clic envíe dos solicitudes de anulación
  antes de que el botón alcance a quedar deshabilitado.
  */
  const cancellingSaleGuardRef = useRef(false);

  const [error, setError] = useState<string | null>(null);

  /*
  Limpia el error actual.

  Útil para cerrar alerts desde la interfaz.
  */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /*
  Carga socios y productos habilitados
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
        productsApi.getSaleProductOptions(),
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
      /*
      CONCURRENCIA UI — REGISTRO DE VENTA

      El ref se consulta antes de modificar estado porque setState
      no bloquea sincrónicamente un segundo clic dentro del mismo
      ciclo de eventos.
      */
      if (savingSaleGuardRef.current) {
        return null;
      }

      savingSaleGuardRef.current = true;

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
        savingSaleGuardRef.current = false;
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
      /*
      CONCURRENCIA UI — ANULACIÓN DE VENTA

      Solo una solicitud de anulación puede estar en vuelo desde
      esta instancia del hook. Un segundo clic se ignora hasta
      que la primera operación termine.
      */
      if (cancellingSaleGuardRef.current) {
        return null;
      }

      cancellingSaleGuardRef.current = true;

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
        cancellingSaleGuardRef.current = false;
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