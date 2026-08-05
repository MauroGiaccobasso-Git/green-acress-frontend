"use client";

import {
  useState,
  type ChangeEvent,
} from "react";

import AddIcon from "@mui/icons-material/Add";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import type { MemberReservationDraftItem } from "@/hooks/reservations/useMemberReservationDraft";
import { MEMBER_RESERVATION_GRAM_STEP } from "@/hooks/reservations/useMemberReservationDraft";

import { availableProductsStyles as styles } from "../availableProducts.styles";

/* =========================================================
   TIPOS
========================================================= */

type MemberReservationDraftProps = {
  items: MemberReservationDraftItem[];

  observations: string;

  totalGrams: number;

  estimatedTotal: number;

  availableLegalGrams: number | null;

  validationError: string | null;

  operationError: string | null;

  canSubmit: boolean;

  isSubmitting: boolean;

  disabled?: boolean;

  onIncrementProduct: (
    productId: number,
  ) => void;

  onDecrementProduct: (
    productId: number,
  ) => void;

  onRemoveProduct: (
    productId: number,
  ) => void;

  onObservationsChange: (
    value: string,
  ) => void;

  onConfirm: () =>
    | void
    | Promise<void>;
};

type DraftProductImageProps = {
  imageUrl: string | null;

  productName: string;
};

/* =========================================================
   CONSTANTES
========================================================= */

const FLOATING_POINT_TOLERANCE =
  0.000001;

const MAX_OBSERVATIONS_LENGTH = 200;

/* =========================================================
   HELPERS DE PRESENTACIÓN
========================================================= */

/*
Evita representar números inválidos o negativos
sin modificar los valores reales del dominio.
*/
function normalizeNumber(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(value, 0);
}

/*
Las cantidades generales se presentan sin
agregar decimales innecesarios.
*/
function formatGrams(
  value: number,
): string {
  const formattedValue =
    new Intl.NumberFormat("es-UY", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(normalizeNumber(value));

  return `${formattedValue} g`;
}

/*
Las cantidades seleccionadas mantienen siempre
un decimal para representar claramente los
pasos de 0,5 gramos.
*/
function formatSelectedGrams(
  value: number,
): string {
  const formattedValue =
    new Intl.NumberFormat("es-UY", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(normalizeNumber(value));

  return `${formattedValue} g`;
}

/*
Presenta importes estimados en pesos uruguayos.

Backend vuelve a calcular y congelar los valores
definitivos cuando procesa la reserva.
*/
function formatCurrency(
  value: number,
): string {
  const formattedValue =
    new Intl.NumberFormat("es-UY", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(normalizeNumber(value));

  return `$${formattedValue}`;
}

/*
Construye el subtítulo contextual del panel.
*/
function getDraftSubtitle(
  itemsCount: number,
): string {
  if (itemsCount === 0) {
    return "Agregá productos desde el catálogo para comenzar.";
  }

  if (itemsCount === 1) {
    return "Estás por reservar 1 producto.";
  }

  return `Estás por reservar ${itemsCount} productos.`;
}

/* =========================================================
   IMAGEN DEL PRODUCTO
========================================================= */

/*
Muestra una miniatura del producto seleccionado
y utiliza un fallback coherente cuando la imagen
no existe o no puede cargarse.
*/
function DraftProductImage({
  imageUrl,
  productName,
}: DraftProductImageProps) {
  const [
    imageLoadFailed,
    setImageLoadFailed,
  ] = useState(false);

  const hasUsableImage =
    Boolean(imageUrl) &&
    !imageLoadFailed;

  if (!hasUsableImage) {
    return (
      <Box
        role="img"
        aria-label={`${productName} sin imagen disponible`}
        sx={styles.draftItemImageFallback}
      >
        <LocalFloristOutlinedIcon
          aria-hidden="true"
        />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={imageUrl ?? undefined}
      alt={`Flor ${productName}`}
      loading="lazy"
      onError={() =>
        setImageLoadFailed(true)
      }
      sx={styles.draftItemImage}
    />
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

/*
Presenta el borrador Premium de la reserva.

Responsabilidades:

- mostrar los productos seleccionados;
- permitir modificar cada cantidad;
- permitir eliminar productos;
- presentar subtotales y resumen general;
- mostrar el límite legal disponible;
- administrar la observación opcional;
- mostrar validaciones preliminares;
- delegar la confirmación de la reserva.

No realiza solicitudes HTTP.
No crea reservas directamente.
No congela precios.
No bloquea stock.
No sustituye las validaciones del backend.
*/
export function MemberReservationDraft({
  items,
  observations,
  totalGrams,
  estimatedTotal,
  availableLegalGrams,
  validationError,
  operationError,
  canSubmit,
  isSubmitting,
  disabled = false,
  onIncrementProduct,
  onDecrementProduct,
  onRemoveProduct,
  onObservationsChange,
  onConfirm,
}: MemberReservationDraftProps) {
  const interactionsDisabled =
    disabled || isSubmitting;

  const visibleValidationMessage =
    operationError ??
    validationError;

  const hasOperationError =
    Boolean(operationError);

  const normalizedAvailableLegalGrams =
    availableLegalGrams === null ||
    !Number.isFinite(
      availableLegalGrams,
    )
      ? null
      : Math.max(
          availableLegalGrams,
          0,
        );

  const exceedsLegalLimit =
    normalizedAvailableLegalGrams !==
      null &&
    totalGrams >
      normalizedAvailableLegalGrams +
        FLOATING_POINT_TOLERANCE;

  const observationsLength =
    observations.length;

  const handleObservationsChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ): void => {
    const nextValue =
      event.target.value.slice(
        0,
        MAX_OBSERVATIONS_LENGTH,
      );

    onObservationsChange(nextValue);
  };

  const handleConfirm = (): void => {
    void onConfirm();
  };

  return (
    <Box
      component="section"
      aria-labelledby="member-reservation-draft-title"
      sx={styles.draftCard}
    >
      <Box sx={styles.draftHeader}>
        <Typography
          id="member-reservation-draft-title"
          component="h2"
          sx={styles.draftTitle}
        >
          Tu reserva
        </Typography>

        <Typography
          component="p"
          sx={styles.draftSubtitle}
        >
          {getDraftSubtitle(
            items.length,
          )}
        </Typography>
      </Box>

      <Box sx={styles.draftBody}>
        {items.length === 0 ? (
          <Box sx={styles.emptyDraftState}>
            <Box
              aria-hidden="true"
              sx={styles.emptyDraftIcon}
            >
              <LocalFloristOutlinedIcon />
            </Box>

            <Typography
              component="h3"
              sx={styles.emptyDraftTitle}
            >
              Tu reserva está vacía
            </Typography>

            <Typography
              component="p"
              sx={
                styles.emptyDraftDescription
              }
            >
              Elegí una o varias flores del
              catálogo. Podrás ajustar cada
              cantidad antes de confirmar.
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              component="ul"
              aria-label="Productos seleccionados"
              sx={{
                ...styles.draftItemsList,
                p: 0,
                m: 0,
                listStyle: "none",
              }}
            >
              {items.map((item) => {
                const canIncrement =
                  item.quantity +
                    MEMBER_RESERVATION_GRAM_STEP <=
                  item.product
                    .cantidadDisponible +
                    FLOATING_POINT_TOLERANCE;

                return (
                  <Box
                    key={item.product.id}
                    component="li"
                    sx={styles.draftItem}
                  >
                    <Box
                      sx={
                        styles.draftItemHeader
                      }
                    >
                      <DraftProductImage
                        imageUrl={
                          item.product.imagen
                        }
                        productName={
                          item.product.nombre
                        }
                      />

                      <Box
                        sx={
                          styles.draftItemCopy
                        }
                      >
                        <Typography
                          component="h3"
                          title={
                            item.product.nombre
                          }
                          sx={
                            styles.draftItemName
                          }
                        >
                          {item.product.nombre}
                        </Typography>

                        <Typography
                          component="p"
                          sx={
                            styles.draftItemPrice
                          }
                        >
                          {formatCurrency(
                            item.product
                              .precioPorGramo,
                          )}{" "}
                          / g
                        </Typography>
                      </Box>

                      <IconButton
                        type="button"
                        aria-label={`Eliminar ${item.product.nombre} de la reserva`}
                        onClick={() =>
                          onRemoveProduct(
                            item.product.id,
                          )
                        }
                        disabled={
                          interactionsDisabled
                        }
                        sx={
                          styles.removeDraftItemButton
                        }
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>

                    <Box
                      sx={
                        styles.draftItemFooter
                      }
                    >
                      <Box
                        role="group"
                        aria-label={`Cantidad seleccionada de ${item.product.nombre}`}
                        sx={
                          styles.draftItemQuantityControl
                        }
                      >
                        <IconButton
                          type="button"
                          aria-label={`Reducir cantidad de ${item.product.nombre}`}
                          onClick={() =>
                            onDecrementProduct(
                              item.product.id,
                            )
                          }
                          disabled={
                            interactionsDisabled
                          }
                          sx={
                            styles.draftItemQuantityButton
                          }
                        >
                          <RemoveIcon />
                        </IconButton>

                        <Typography
                          component="span"
                          aria-live="polite"
                          sx={
                            styles.draftItemQuantityValue
                          }
                        >
                          {formatSelectedGrams(
                            item.quantity,
                          )}
                        </Typography>

                        <IconButton
                          type="button"
                          aria-label={`Aumentar cantidad de ${item.product.nombre}`}
                          onClick={() =>
                            onIncrementProduct(
                              item.product.id,
                            )
                          }
                          disabled={
                            interactionsDisabled ||
                            !canIncrement
                          }
                          sx={
                            styles.draftItemQuantityButton
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>

                      <Typography
                        component="strong"
                        sx={
                          styles.draftItemSubtotal
                        }
                      >
                        {formatCurrency(
                          item.estimatedSubtotal,
                        )}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Box
              aria-label="Resumen de la reserva"
              sx={styles.draftSummaryCard}
            >
              <Box
                sx={
                  styles.draftSummaryRows
                }
              >
                <Box
                  sx={
                    styles.draftSummaryRow
                  }
                >
                  <Box
                    aria-hidden="true"
                    sx={
                      styles.draftSummaryIcon
                    }
                  >
                    <BalanceOutlinedIcon />
                  </Box>

                  <Typography
                    component="span"
                    sx={
                      styles.draftSummaryLabel
                    }
                  >
                    Total de gramos
                  </Typography>

                  <Typography
                    component="strong"
                    sx={
                      styles.draftSummaryValue
                    }
                  >
                    {formatGrams(totalGrams)}
                  </Typography>
                </Box>

                <Box
                  sx={
                    styles.draftSummaryRow
                  }
                >
                  <Box
                    aria-hidden="true"
                    sx={
                      styles.draftSummaryIcon
                    }
                  >
                    <AttachMoneyIcon />
                  </Box>

                  <Typography
                    component="span"
                    sx={
                      styles.draftSummaryLabel
                    }
                  >
                    Total de la reserva
                  </Typography>

                  <Typography
                    component="strong"
                    sx={{
                      ...styles.draftSummaryValue,
                      ...styles.draftEstimatedTotalValue,
                    }}
                  >
                    {formatCurrency(
                      estimatedTotal,
                    )}
                  </Typography>
                </Box>

                <Box
                  sx={
                    styles.draftSummaryRow
                  }
                >
                  <Box
                    aria-hidden="true"
                    sx={
                      styles.draftSummaryIcon
                    }
                  >
                    <CalendarMonthOutlinedIcon />
                  </Box>

                  <Typography
                    component="span"
                    sx={
                      styles.draftSummaryLabel
                    }
                  >
                    Límite disponible este mes
                  </Typography>

                  <Typography
                    component="strong"
                    sx={{
                      ...styles.draftSummaryValue,
                      ...styles.draftLimitValue(
                        exceedsLegalLimit,
                      ),
                    }}
                  >
                    {normalizedAvailableLegalGrams ===
                    null
                      ? "Verificando..."
                      : formatGrams(
                          normalizedAvailableLegalGrams,
                        )}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={
                  styles.legalLimitNotice
                }
              >
                <InfoOutlinedIcon
                  aria-hidden="true"
                />

                <Typography
                  component="p"
                  sx={
                    styles.legalLimitNoticeText
                  }
                >
                  Tu límite disponible se
                  calcula según los retiros y
                  reservas vigentes del mes
                  actual.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={
                styles.observationsFieldWrapper
              }
            >
              <Typography
                component="label"
                htmlFor="member-reservation-observations"
                sx={
                  styles.observationsLabel
                }
              >
                Observaciones
              </Typography>

              <TextField
                id="member-reservation-observations"
                value={observations}
                onChange={
                  handleObservationsChange
                }
                placeholder="Opcional"
                multiline
                minRows={4}
                fullWidth
                disabled={
                  interactionsDisabled
                }
                slotProps={{
                  htmlInput: {
                    maxLength:
                      MAX_OBSERVATIONS_LENGTH,
                    "aria-label":
                      "Observaciones opcionales de la reserva",
                    "aria-describedby":
                      "member-reservation-observations-counter",
                  },
                }}
                sx={
                  styles.observationsField
                }
              />

              <Typography
                id="member-reservation-observations-counter"
                component="span"
                aria-live="polite"
                sx={
                  styles.observationsCounter
                }
              >
                {observationsLength} /{" "}
                {MAX_OBSERVATIONS_LENGTH}
              </Typography>
            </Box>

            {visibleValidationMessage ? (
              <Box
                role={
                  hasOperationError
                    ? "alert"
                    : "status"
                }
                sx={{
                  ...styles.draftValidationNotice,
                  ...(hasOperationError
                    ? styles.draftValidationErrorNotice
                    : {}),
                }}
              >
                <ErrorOutlineRoundedIcon
                  aria-hidden="true"
                />

                <Typography
                  component="p"
                  sx={
                    styles.draftValidationText
                  }
                >
                  {visibleValidationMessage}
                </Typography>
              </Box>
            ) : null}

            <Button
              type="button"
              variant="contained"
              onClick={handleConfirm}
              disabled={
                interactionsDisabled ||
                !canSubmit
              }
              startIcon={
                isSubmitting ? (
                  <CircularProgress
                    size={18}
                    thickness={5}
                    sx={
                      styles.confirmReservationSpinner
                    }
                  />
                ) : undefined
              }
              sx={
                styles.confirmReservationButton
              }
            >
              {isSubmitting
                ? "Procesando reserva..."
                : "Confirmar reserva"}
            </Button>

            <Box
              sx={
                styles.reservationValidationFootnote
              }
            >
              <CheckRoundedIcon
                aria-hidden="true"
              />

              <Typography
                component="p"
                sx={
                  styles.reservationValidationFootnoteText
                }
              >
                Tu reserva será validada
                automáticamente según las
                reglas del club y tu límite
                legal mensual.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}