"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import type { MemberAvailableProduct } from "@/api/productsApi";
import type {
  CreateMemberReservationDetailPayload,
  CreateMemberReservationPayload,
} from "@/api/reservationsApi";
import type { MemberProfile } from "@/api/sociosApi";

/* =========================================================
   CONSTANTES DEL DOMINIO
========================================================= */

/*
Las cantidades de flores deben expresarse
en múltiplos de 0,5 gramos.

La validación definitiva continúa siendo
responsabilidad del backend.
*/
export const MEMBER_RESERVATION_GRAM_STEP = 0.5;

const FLOATING_POINT_TOLERANCE = 0.000001;

/* =========================================================
   TIPOS
========================================================= */

type UseMemberReservationDraftParams = {
  memberStatus:
    | MemberProfile["estado"]
    | null;

  availableLegalGrams: number | null;
};

/*
Representa un producto agregado temporalmente
a la reserva que el socio está preparando.

El producto conserva el contrato público
recibido desde backend para poder presentar:

- nombre;
- precio;
- stock visible;
- imagen;
- genética;
- THC.

La cantidad y el subtotal son propios
del borrador local.
*/
export type MemberReservationDraftItem = {
  product: MemberAvailableProduct;

  quantity: number;

  estimatedSubtotal: number;
};

/* =========================================================
   HELPERS NUMÉRICOS
========================================================= */

/*
Redondea valores monetarios y cantidades
para evitar residuos de punto flotante.
*/
function roundToTwoDecimals(
  value: number,
): number {
  return Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100;
}

/*
Comprueba si una cantidad respeta
el incremento permitido de 0,5 gramos.
*/
function isValidGramMultiple(
  quantity: number,
): boolean {
  const stepUnits =
    quantity /
    MEMBER_RESERVATION_GRAM_STEP;

  return (
    Math.abs(
      stepUnits - Math.round(stepUnits),
    ) < FLOATING_POINT_TOLERANCE
  );
}

/*
Construye el subtotal estimado utilizando
el precio visible en el catálogo.

El backend volverá a calcular y congelar
el importe definitivo al crear la reserva.
*/
function calculateEstimatedSubtotal(
  product: MemberAvailableProduct,
  quantity: number,
): number {
  return roundToTwoDecimals(
    product.precioPorGramo * quantity,
  );
}

/* =========================================================
   VALIDACIONES DEL BORRADOR
========================================================= */

/*
Valida una cantidad contra las condiciones
conocidas por la interfaz:

- valor numérico;
- mayor a cero;
- múltiplo de 0,5 gramos;
- no superior al stock visible.

Estas comprobaciones mejoran la UX,
pero no sustituyen las validaciones
concurrentes del backend.
*/
function validateProductQuantity(
  product: MemberAvailableProduct,
  quantity: number,
): string | null {
  if (!Number.isFinite(quantity)) {
    return "La cantidad ingresada no es válida.";
  }

  if (quantity <= 0) {
    return "La cantidad debe ser mayor a cero.";
  }

  if (!isValidGramMultiple(quantity)) {
    return "La cantidad debe expresarse en múltiplos de 0,5 gramos.";
  }

  if (
    quantity >
    product.cantidadDisponible
  ) {
    return `Solo hay ${product.cantidadDisponible} g disponibles de ${product.nombre}.`;
  }

  return null;
}

/* =========================================================
   HOOK DEL BORRADOR
========================================================= */

/*
Administra la reserva temporal que el socio
prepara dentro de Productos disponibles.

Responsabilidades:

- agregar productos;
- evitar productos duplicados;
- modificar cantidades;
- eliminar productos;
- administrar observaciones;
- calcular gramos totales;
- calcular el total estimado;
- construir el payload de creación;
- validar preliminarmente estado, stock
  y límite legal disponible;
- limpiar el borrador.

No contiene JSX.
No realiza solicitudes HTTP.
No bloquea stock.
No crea reservas.
No reemplaza las validaciones del backend.
*/
export function useMemberReservationDraft({
  memberStatus,
  availableLegalGrams,
}: UseMemberReservationDraftParams) {
  /*
  Productos actualmente seleccionados
  para la solicitud.
  */
  const [
    reservationDraftItems,
    setReservationDraftItems,
  ] = useState<
    MemberReservationDraftItem[]
  >([]);

  /*
  Observación opcional incluida
  en la solicitud de reserva.
  */
  const [
    reservationObservations,
    setReservationObservations,
  ] = useState("");

  /*
  Error correspondiente a la última
  operación local sobre el borrador.
  */
  const [
    reservationDraftError,
    setReservationDraftError,
  ] = useState<string | null>(null);

  /* =========================================================
     CANTIDADES
  ========================================================= */

  /*
  Establece una cantidad específica
  para un producto ya seleccionado.
  */
  const setDraftProductQuantity =
    useCallback(
      (
        productId: number,
        quantity: number,
      ): boolean => {
        const currentItem =
          reservationDraftItems.find(
            (item) =>
              item.product.id === productId,
          );

        if (!currentItem) {
          setReservationDraftError(
            "El producto indicado no forma parte de la reserva.",
          );

          return false;
        }

        const normalizedQuantity =
          roundToTwoDecimals(quantity);

        const validationError =
          validateProductQuantity(
            currentItem.product,
            normalizedQuantity,
          );

        if (validationError) {
          setReservationDraftError(
            validationError,
          );

          return false;
        }

        setReservationDraftItems(
          (currentItems) =>
            currentItems.map((item) => {
              if (
                item.product.id !== productId
              ) {
                return item;
              }

              return {
                ...item,
                quantity:
                  normalizedQuantity,
                estimatedSubtotal:
                  calculateEstimatedSubtotal(
                    item.product,
                    normalizedQuantity,
                  ),
              };
            }),
        );

        setReservationDraftError(null);

        return true;
      },
      [reservationDraftItems],
    );

  /*
  Agrega un producto utilizando inicialmente
  0,5 gramos.

  Cuando el producto ya existe en el borrador,
  incrementa su cantidad en 0,5 gramos en lugar
  de crear una línea duplicada.
  */
  const addProductToDraft =
    useCallback(
      (
        product: MemberAvailableProduct,
      ): boolean => {
        const existingItem =
          reservationDraftItems.find(
            (item) =>
              item.product.id === product.id,
          );

        if (existingItem) {
          return setDraftProductQuantity(
            product.id,
            existingItem.quantity +
              MEMBER_RESERVATION_GRAM_STEP,
          );
        }

        const initialQuantity =
          MEMBER_RESERVATION_GRAM_STEP;

        const validationError =
          validateProductQuantity(
            product,
            initialQuantity,
          );

        if (validationError) {
          setReservationDraftError(
            validationError,
          );

          return false;
        }

        setReservationDraftItems(
          (currentItems) => [
            ...currentItems,
            {
              product,
              quantity: initialQuantity,
              estimatedSubtotal:
                calculateEstimatedSubtotal(
                  product,
                  initialQuantity,
                ),
            },
          ],
        );

        setReservationDraftError(null);

        return true;
      },
      [
        reservationDraftItems,
        setDraftProductQuantity,
      ],
    );

  /*
  Incrementa la cantidad seleccionada
  utilizando el paso oficial de 0,5 gramos.
  */
  const incrementDraftProduct =
    useCallback(
      (productId: number): boolean => {
        const currentItem =
          reservationDraftItems.find(
            (item) =>
              item.product.id === productId,
          );

        if (!currentItem) {
          setReservationDraftError(
            "El producto indicado no forma parte de la reserva.",
          );

          return false;
        }

        return setDraftProductQuantity(
          productId,
          currentItem.quantity +
            MEMBER_RESERVATION_GRAM_STEP,
        );
      },
      [
        reservationDraftItems,
        setDraftProductQuantity,
      ],
    );

  /*
  Reduce la cantidad en 0,5 gramos.

  Cuando la cantidad actual es la mínima,
  elimina el producto del borrador.
  */
  const decrementDraftProduct =
    useCallback(
      (productId: number): boolean => {
        const currentItem =
          reservationDraftItems.find(
            (item) =>
              item.product.id === productId,
          );

        if (!currentItem) {
          setReservationDraftError(
            "El producto indicado no forma parte de la reserva.",
          );

          return false;
        }

        if (
          currentItem.quantity <=
          MEMBER_RESERVATION_GRAM_STEP
        ) {
          setReservationDraftItems(
            (currentItems) =>
              currentItems.filter(
                (item) =>
                  item.product.id !==
                  productId,
              ),
          );

          setReservationDraftError(null);

          return true;
        }

        return setDraftProductQuantity(
          productId,
          currentItem.quantity -
            MEMBER_RESERVATION_GRAM_STEP,
        );
      },
      [
        reservationDraftItems,
        setDraftProductQuantity,
      ],
    );

  /* =========================================================
     ELIMINACIÓN
  ========================================================= */

  /*
  Elimina completamente un producto
  de la reserva en preparación.
  */
  const removeProductFromDraft =
    useCallback((productId: number) => {
      setReservationDraftItems(
        (currentItems) =>
          currentItems.filter(
            (item) =>
              item.product.id !== productId,
          ),
      );

      setReservationDraftError(null);
    }, []);

  /* =========================================================
     OBSERVACIONES
  ========================================================= */

  /*
  Actualiza la observación opcional
  de la solicitud.

  No se impone una longitud artificial
  porque el contrato auditado no define
  un máximo específico en frontend.
  */
  const updateReservationObservations =
    useCallback((value: string) => {
      setReservationObservations(value);
    }, []);

  /* =========================================================
     VALORES DERIVADOS
  ========================================================= */

  const selectedProductsCount =
    reservationDraftItems.length;

  const totalDraftGrams = useMemo(
    () =>
      roundToTwoDecimals(
        reservationDraftItems.reduce(
          (total, item) =>
            total + item.quantity,
          0,
        ),
      ),
    [reservationDraftItems],
  );

  const estimatedDraftTotal = useMemo(
    () =>
      roundToTwoDecimals(
        reservationDraftItems.reduce(
          (total, item) =>
            total +
            item.estimatedSubtotal,
          0,
        ),
      ),
    [reservationDraftItems],
  );

  /*
  Proyección exacta hacia el contrato
  esperado por POST /reservas.
  */
  const reservationDetailsPayload =
    useMemo<
      CreateMemberReservationDetailPayload[]
    >(
      () =>
        reservationDraftItems.map(
          (item) => ({
            producto_id:
              item.product.id,
            cantidad: item.quantity,
          }),
        ),
      [reservationDraftItems],
    );

  const createReservationPayload =
    useMemo<CreateMemberReservationPayload>(
      () => {
        const normalizedObservations =
          reservationObservations.trim();

        return {
          detalles:
            reservationDetailsPayload,
          observaciones:
            normalizedObservations.length > 0
              ? normalizedObservations
              : null,
        };
      },
      [
        reservationDetailsPayload,
        reservationObservations,
      ],
    );

  /*
  Expone la cantidad seleccionada
  de un producto específico.

  Resulta útil para tarjetas y controles
  visuales sin duplicar búsquedas.
  */
  const getDraftProductQuantity =
    useCallback(
      (productId: number): number => {
        return (
          reservationDraftItems.find(
            (item) =>
              item.product.id === productId,
          )?.quantity ?? 0
        );
      },
      [reservationDraftItems],
    );

  /* =========================================================
     VALIDACIÓN GENERAL
  ========================================================= */

  const reservationDraftValidationError =
    useMemo((): string | null => {
      if (!memberStatus) {
        return "Todavía estamos verificando el estado de tu perfil.";
      }

      if (memberStatus !== "ACTIVO") {
        return "Tu perfil debe estar activo para realizar reservas.";
      }

      if (
        reservationDraftItems.length === 0
      ) {
        return "Agregá al menos un producto para continuar.";
      }

      for (
        const item of
        reservationDraftItems
      ) {
        const itemValidationError =
          validateProductQuantity(
            item.product,
            item.quantity,
          );

        if (itemValidationError) {
          return itemValidationError;
        }
      }

      if (
        availableLegalGrams === null ||
        !Number.isFinite(
          availableLegalGrams,
        )
      ) {
        return "Todavía estamos verificando tu límite legal disponible.";
      }

      const normalizedAvailableGrams =
        Math.max(
          availableLegalGrams,
          0,
        );

      if (
        totalDraftGrams >
        normalizedAvailableGrams +
          FLOATING_POINT_TOLERANCE
      ) {
        return `La reserva supera los ${normalizedAvailableGrams} g disponibles de tu límite mensual.`;
      }

      return null;
    }, [
      availableLegalGrams,
      memberStatus,
      reservationDraftItems,
      totalDraftGrams,
    ]);

  const canSubmitReservationDraft =
    reservationDraftValidationError ===
    null;

  const hasReservationDraftItems =
    selectedProductsCount > 0;

  /* =========================================================
     LIMPIEZA
  ========================================================= */

  /*
  Limpia exclusivamente el último error
  producido por una operación local.
  */
  const clearReservationDraftError =
    useCallback(() => {
      setReservationDraftError(null);
    }, []);

  /*
  Descarta completamente la reserva
  en preparación.

  No afecta reservas persistidas,
  stock ni límite legal.
  */
  const clearReservationDraft =
    useCallback(() => {
      setReservationDraftItems([]);
      setReservationObservations("");
      setReservationDraftError(null);
    }, []);

  /* =========================================================
     API PÚBLICA DEL HOOK
  ========================================================= */

  return {
    reservationDraftItems,

    reservationObservations,

    reservationDraftError,

    reservationDraftValidationError,

    selectedProductsCount,

    totalDraftGrams,

    estimatedDraftTotal,

    reservationDetailsPayload,

    createReservationPayload,

    hasReservationDraftItems,

    canSubmitReservationDraft,

    addProductToDraft,

    setDraftProductQuantity,

    incrementDraftProduct,

    decrementDraftProduct,

    removeProductFromDraft,

    updateReservationObservations,

    getDraftProductQuantity,

    clearReservationDraftError,

    clearReservationDraft,
  };
}