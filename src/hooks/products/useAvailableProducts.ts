"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  type MemberAvailableProduct,
  productsApi,
} from "@/api/productsApi";

/* =========================================================
   CONSTANTES DEL MÓDULO
========================================================= */

const AVAILABLE_PRODUCTS_LOAD_ERROR_MESSAGE =
  "No fue posible cargar los productos disponibles.";

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
   HOOK DE PRODUCTOS DISPONIBLES
========================================================= */

/*
Administra el catálogo de flores disponibles
para reserva dentro del Portal Socio.

Responsabilidades:

- consultar el catálogo público;
- almacenar los productos disponibles;
- administrar el estado de carga;
- manejar errores controlados;
- permitir actualizaciones posteriores;
- evitar que respuestas antiguas sobrescriban
  una consulta más reciente.

No contiene JSX.
No construye interfaz.
No realiza solicitudes HTTP directas.
No replica los filtros aplicados por backend.
No administra productos seleccionados.
No crea reservas.
*/
export function useAvailableProducts() {
  /*
  Catálogo público de flores disponibles
  para el socio autenticado.
  */
  const [
    availableProducts,
    setAvailableProducts,
  ] = useState<MemberAvailableProduct[]>([]);

  /*
  Indica si la consulta del catálogo
  se encuentra en ejecución.
  */
  const [
    loadingAvailableProducts,
    setLoadingAvailableProducts,
  ] = useState(false);

  /*
  Error asociado exclusivamente
  a la consulta del catálogo.
  */
  const [
    availableProductsError,
    setAvailableProductsError,
  ] = useState<string | null>(null);

  /*
  Identificador incremental que evita
  que una respuesta antigua sobrescriba
  el resultado de una consulta posterior.
  */
  const latestRequestIdRef = useRef(0);

  /* =========================================================
     CARGA DEL CATÁLOGO
  ========================================================= */

  /*
  Obtiene las flores actualmente disponibles.

  Backend determina qué productos pueden mostrarse
  aplicando las reglas de estado, tipo, precio
  y disponibilidad real de stock.
  */
  const fetchAvailableProducts =
    useCallback(async (): Promise<
      MemberAvailableProduct[] | null
    > => {
      const requestId =
        latestRequestIdRef.current + 1;

      latestRequestIdRef.current = requestId;

      try {
        setLoadingAvailableProducts(true);
        setAvailableProductsError(null);

        const products =
          await productsApi.getAvailableProducts();

        if (
          latestRequestIdRef.current !== requestId
        ) {
          return null;
        }

        setAvailableProducts(products);

        return products;
      } catch (error) {
        if (
          latestRequestIdRef.current !== requestId
        ) {
          return null;
        }

        /*
        Ante un fallo posterior se conserva
        el último catálogo válido disponible.

        El container podrá mostrar el error
        sin eliminar datos previamente cargados.
        */
        setAvailableProductsError(
          getErrorMessage(
            error,
            AVAILABLE_PRODUCTS_LOAD_ERROR_MESSAGE,
          ),
        );

        return null;
      } finally {
        if (
          latestRequestIdRef.current === requestId
        ) {
          setLoadingAvailableProducts(false);
        }
      }
    }, []);

  /* =========================================================
     LIMPIEZA
  ========================================================= */

  /*
  Limpia únicamente el error actual
  asociado a la consulta del catálogo.
  */
  const clearAvailableProductsError =
    useCallback(() => {
      setAvailableProductsError(null);
    }, []);

  /*
  Limpia el estado completo del catálogo
  e invalida cualquier solicitud pendiente.
  */
  const clearAvailableProducts =
    useCallback(() => {
      latestRequestIdRef.current += 1;

      setAvailableProducts([]);
      setAvailableProductsError(null);
      setLoadingAvailableProducts(false);
    }, []);

  /* =========================================================
     API PÚBLICA DEL HOOK
  ========================================================= */

  return {
    availableProducts,

    loadingAvailableProducts,

    availableProductsError,

    fetchAvailableProducts,

    clearAvailableProductsError,

    clearAvailableProducts,
  };
}