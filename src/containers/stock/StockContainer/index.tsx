"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckIcon from "@mui/icons-material/Check";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EditIcon from "@mui/icons-material/Edit";
import UndoIcon from "@mui/icons-material/Undo";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";

import {
  StockFilters,
  StockItem,
  StockMovement,
  StockMovementFilters,
} from "@/api/stockApi";
import { useStock } from "@/hooks/stock/useStock";

import { stockStyles } from "./stock.styles";

import StockAdjustmentModal from "./StockAdjustmentModal";
import StockFiltersModal from "./StockFiltersModal";
import StockMovementsModal from "./StockMovementsModal";

/*
Traduce enums técnicos del backend a textos amigables
para la interfaz administrativa.
*/
const productTypeLabels = {
  FLOR: "Flor",
  SEMILLA: "Semilla",
};

const productStatusLabels = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
};

const movementTypeLabels: Record<string, string> = {
  INGRESO: "Ingreso",
  EGRESO: "Egreso",
  AJUSTE: "Ajuste",
  RESERVA: "Reserva",
  LIBERACION_RESERVA: "Liberación de reserva",
};

const referenceTypeLabels: Record<string, string> = {
  COMPRA: "Compra",
  VENTA: "Venta",
  ANULACION_VENTA: "Venta anulada",
  AJUSTE_MANUAL: "Ajuste manual",
  RESERVA: "Reserva",
};

/*
Tiempo de espera aplicado al buscador dinámico.

Permite ejecutar búsquedas contra backend sin disparar
una solicitud por cada tecla presionada por el usuario.
*/
const SEARCH_DEBOUNCE_MS = 400;

/*
Estado limpio utilizado al abrir el modal de filtros.

Los filtros administrativos se comportan como constructor
de nueva búsqueda: cada apertura comienza sin arrastrar
valores anteriores.
*/
const emptyStockFilterForm: StockFilters = {
  search: "",
  tipo: undefined,
  estado: undefined,
};

/*
Estado limpio utilizado para los filtros del modal
de historial completo de movimientos.

Estos filtros se aplican contra backend y reinician
la consulta desde la primera página del historial.
*/
const emptyMovementFilterForm: StockMovementFilters = {
  search: "",
  tipo: undefined,
  referenciaTipo: undefined,
  fechaDesde: undefined,
  fechaHasta: undefined,
};

/*
Formatea cantidades respetando la unidad operativa
del producto recibida desde el DTO de Stock.
*/
function formatQuantity(value: number, unit: "GRAMOS" | "UNIDADES") {
  const suffix = unit === "GRAMOS" ? "g" : "un.";

  return `${value} ${suffix}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("es-UY", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getMovementQuantityPrefix(movement: StockMovement) {
  if (movement.tipo === "INGRESO") {
    return "+";
  }

  if (movement.tipo === "EGRESO") {
    return "-";
  }

  if (movement.tipo === "AJUSTE" && movement.cantidad > 0) {
    return "+";
  }

  return "";
}

function getPaginationRange(page: number, limit: number, total: number) {
  if (total === 0) {
    return {
      from: 0,
      to: 0,
    };
  }

  return {
    from: (page - 1) * limit + 1,
    to: Math.min(page * limit, total),
  };
}

function SummaryCard({
  icon,
  label,
  value,
  hint,
  warning = false,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  hint: string;
  warning?: boolean;
}) {
  return (
    <Box sx={stockStyles.summaryCard}>
      <Box
        sx={{
          ...stockStyles.summaryIcon,
          ...(warning ? stockStyles.summaryIconWarning : {}),
        }}
      >
        {icon}
      </Box>

      <Box sx={{ pt: 0.5 }}>
        <Typography sx={stockStyles.summaryLabel}>{label}</Typography>

        <Typography
          sx={{
            ...stockStyles.summaryValue,
            ...(warning ? stockStyles.summaryValueWarning : {}),
          }}
        >
          {value}
        </Typography>

        <Typography sx={stockStyles.summaryHint}>{hint}</Typography>
      </Box>
    </Box>
  );
}

/*
Container principal del módulo Stock.

Responsabilidades:
- orquestar la pantalla administrativa;
- cargar resumen global para KPI;
- cargar inventario paginado y movimientos recientes;
- coordinar filtros, paginación y acciones de usuario;
- renderizar la UI del módulo.

NO llama endpoints directamente.
NO construye URLs.
NO accede a httpClient.
*/
export default function StockContainer() {
  const {
    stockSummary,
    stockItems,
    movements,

    stockPagination,
    movementPagination,

    stockFilters,

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

    fetchStockSummary,
    fetchStock,
    fetchMovements,

    applyStockFilters,
    clearStockFilters,
    changeStockPage,

    applyMovementFilters,
    clearMovementFilters,
    loadMoreMovements,

    adjustStock,
    clearAdjustmentFeedback,
  } = useStock();

  const [searchTerm, setSearchTerm] = useState("");
  const isInitialSearchRender = useRef(true);
  const isInitialMovementSearchRender = useRef(true);
  const appliedMovementFiltersRef = useRef<StockMovementFilters>(
    emptyMovementFilterForm,
  );

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [filterForm, setFilterForm] =
    useState<StockFilters>(emptyStockFilterForm);

  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(
    null,
  );

  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [adjustmentObservation, setAdjustmentObservation] = useState("");

  /*
  Error local del formulario de ajuste.

  Se utiliza para validar datos antes de delegar la operación
  al hook y evitar conversiones peligrosas de JavaScript, como
  Number("") === 0.
  */
  const [frontendAdjustmentError, setFrontendAdjustmentError] = useState<
    string | null
  >(null);

  const [isMovementsModalOpen, setIsMovementsModalOpen] = useState(false);
  const [movementFiltersForm, setMovementFiltersForm] =
    useState<StockMovementFilters>(emptyMovementFilterForm);

  useEffect(() => {
    fetchStockSummary();
    fetchStock();
    fetchMovements();
  }, [fetchStockSummary, fetchStock, fetchMovements]);

  /*
  Ejecuta la búsqueda administrativa de forma dinámica.

  Se utiliza debounce para evitar una consulta HTTP por cada
  tecla presionada, manteniendo una experiencia fluida sin
  sobrecargar al backend.
  */
  useEffect(() => {
    if (isInitialSearchRender.current) {
      isInitialSearchRender.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const search = searchTerm.trim();

      if ((stockFilters.search ?? "") === search) {
        return;
      }

      applyStockFilters({
        search,
        tipo: stockFilters.tipo,
        estado: stockFilters.estado,
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [
    searchTerm,
    stockFilters.search,
    stockFilters.tipo,
    stockFilters.estado,
    applyStockFilters,
  ]);

  /*
  Normaliza los filtros del historial antes de enviarlos al hook.

  El modal muestra criterios orientados al usuario, como tipo de
  operación y rango de fechas, mientras el hook conserva el contrato
  técnico esperado por la API.
  */
  const normalizeMovementFilters = (
    filters: StockMovementFilters,
  ): StockMovementFilters => ({
    search: filters.search?.trim() || "",
    tipo: undefined,
    referenciaTipo: filters.referenciaTipo,
    fechaDesde: filters.fechaDesde,
    fechaHasta: filters.fechaHasta,
  });

  /*
  Ejecuta la búsqueda del historial de forma dinámica.

  Solo el campo de búsqueda se aplica con debounce. El tipo de
  operación y el rango de fechas se aplican mediante el botón
  "Aplicar filtros" para evitar refrescos excesivos dentro del modal.
  */
  useEffect(() => {
    if (!isMovementsModalOpen) {
      return;
    }

    if (isInitialMovementSearchRender.current) {
      isInitialMovementSearchRender.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextFilters = normalizeMovementFilters({
        ...appliedMovementFiltersRef.current,
        search: movementFiltersForm.search,
      });

      appliedMovementFiltersRef.current = nextFilters;

      applyMovementFilters(nextFilters);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isMovementsModalOpen, movementFiltersForm.search, applyMovementFilters]);
  /*
  El inventario ya llega paginado desde backend.

  El container no recorta datos ni simula páginas:
  solamente renderiza la página actual recibida desde la API.
  */
  const visibleStockItems = stockItems;

  /*
  El panel lateral muestra los últimos 5 movimientos.

  Ese criterio se resuelve solicitando al backend la primera
  página del historial ordenado por fecha descendente.
  */
  const recentMovements = movements;

  const stockPaginationRange = useMemo(() => {
    return getPaginationRange(
      stockPagination.page,
      stockPagination.limit,
      stockPagination.total,
    );
  }, [stockPagination]);

  const handleSearch = async () => {
    const search = searchTerm.trim();

    await applyStockFilters({
      search,
      tipo: stockFilters.tipo,
      estado: stockFilters.estado,
    });
  };

  const handleClearStockFilters = async () => {
    setSearchTerm("");

    await clearStockFilters();
  };

  const handleOpenFiltersModal = () => {
    setFilterForm(emptyStockFilterForm);
    setIsFiltersModalOpen(true);
  };

  const handleCloseFiltersModal = () => {
    setIsFiltersModalOpen(false);
  };

  const handleApplyFilters = async () => {
    const nextFilters: StockFilters = {
      search: filterForm.search?.trim() || "",
      tipo: filterForm.tipo,
      estado: filterForm.estado,
    };

    setSearchTerm(nextFilters.search ?? "");
    setIsFiltersModalOpen(false);

    await applyStockFilters(nextFilters);
  };

  const handleOpenAdjustmentModal = (item: StockItem) => {
    clearAdjustmentFeedback();
    setFrontendAdjustmentError(null);

    setSelectedStockItem(item);
    setAdjustmentQuantity("");
    setAdjustmentObservation("");
  };

  const handleCloseAdjustmentModal = () => {
    setSelectedStockItem(null);
    setAdjustmentQuantity("");
    setAdjustmentObservation("");
    setFrontendAdjustmentError(null);
    clearAdjustmentFeedback();
  };

  const handleAdjustmentQuantityChange = (value: string) => {
    setAdjustmentQuantity(value);
    setFrontendAdjustmentError(null);
    clearAdjustmentFeedback();
  };

  const handleAdjustmentObservationChange = (value: string) => {
    setAdjustmentObservation(value);
    setFrontendAdjustmentError(null);
    clearAdjustmentFeedback();
  };

  const handleSubmitAdjustment = async () => {
    if (!selectedStockItem) {
      return;
    }

    const normalizedQuantity = adjustmentQuantity.trim();

    /*
    Validación explícita del campo antes de convertir a number.

    JavaScript convierte Number("") en 0, lo que podía registrar
    incorrectamente un ajuste a cero cuando el usuario dejaba el
    campo vacío.
    */
    if (normalizedQuantity === "") {
      setFrontendAdjustmentError("Debe ingresar una cantidad a ajustar.");
      return;
    }

    const parsedQuantity = Number(normalizedQuantity);

    if (Number.isNaN(parsedQuantity)) {
      setFrontendAdjustmentError(
        "La cantidad a ajustar debe ser un número válido.",
      );
      return;
    }

    const success = await adjustStock(selectedStockItem.producto_id, {
      variacion: parsedQuantity,
      observaciones: adjustmentObservation,
    });

    if (success) {
      handleCloseAdjustmentModal();
    }
  };

  const handleOpenMovementsModal = async () => {
    isInitialMovementSearchRender.current = true;
    appliedMovementFiltersRef.current = emptyMovementFilterForm;
    setMovementFiltersForm(emptyMovementFilterForm);
    setIsMovementsModalOpen(true);

    await fetchMovements({
      ...emptyMovementFilterForm,
      page: 1,
      limit: 5,
    });
  };

  const handleCloseMovementsModal = async () => {
    isInitialMovementSearchRender.current = true;
    appliedMovementFiltersRef.current = emptyMovementFilterForm;
    setIsMovementsModalOpen(false);
    setMovementFiltersForm(emptyMovementFilterForm);

    await fetchMovements({
      page: 1,
      limit: 5,
    });
  };

  const handleClearMovementFilters = async () => {
    isInitialMovementSearchRender.current = true;
    appliedMovementFiltersRef.current = emptyMovementFilterForm;
    setMovementFiltersForm(emptyMovementFilterForm);

    await clearMovementFilters();
  };

  const handleApplyMovementFilters = async () => {
    const nextFilters = normalizeMovementFilters(movementFiltersForm);

    appliedMovementFiltersRef.current = nextFilters;

    await applyMovementFilters(nextFilters);
  };

  const renderProductImage = (item: StockItem) => {
    if (item.producto.imagen_url) {
      return (
        <Box
          component="img"
          src={item.producto.imagen_url}
          alt={`Imagen de ${item.producto.nombre}`}
          sx={stockStyles.productImage}
        />
      );
    }

    return (
      <Box sx={stockStyles.productPlaceholder}>
        <Inventory2OutlinedIcon fontSize="small" />
      </Box>
    );
  };

  const renderQuantityCell = (
    label: string,
    value: number,
    unit: "GRAMOS" | "UNIDADES",
    highlight = false,
  ) => {
    return (
      <Box>
        <Typography sx={stockStyles.cellLabelMobile}>{label}</Typography>

        <Typography
          sx={{
            ...stockStyles.cellValue,
            ...(highlight ? stockStyles.cellValueAvailable : {}),
          }}
        >
          {formatQuantity(value, unit)}
        </Typography>

        <Typography sx={stockStyles.cellSubtext}>{label}</Typography>
      </Box>
    );
  };

  /*
  Define el icono visual de cada movimiento según
  la operación de negocio que originó el cambio.
  */
  const renderMovementIcon = (movement: StockMovement) => {
    switch (movement.referencia_tipo) {
      case "COMPRA":
        return <CheckIcon fontSize="small" />;

      case "VENTA":
        return <AttachMoneyIcon fontSize="small" />;

      case "ANULACION_VENTA":
        return <UndoIcon fontSize="small" />;

      case "AJUSTE_MANUAL":
        return <EditIcon fontSize="small" />;

      default:
        return <EditIcon fontSize="small" />;
    }
  };

  /*
  Aplica el color semántico del movimiento:
  compra en rojo por salida de dinero, venta en verde
  por ingreso de dinero, venta anulada en azul por reversión
  y ajuste manual en naranja por intervención administrativa.
  */
  const getMovementIconStyle = (movement: StockMovement) => {
    if (movement.referencia_tipo === "COMPRA") {
      return {
        backgroundColor: "#FDE8E6",
        color: "#B42318",
      };
    }

    if (movement.referencia_tipo === "ANULACION_VENTA") {
      return stockStyles.movementIconBlue;
    }

    if (movement.referencia_tipo === "AJUSTE_MANUAL") {
      return stockStyles.movementIconOrange;
    }

    return {};
  };

  const renderStockRow = (item: StockItem) => {
    const isInactive = item.producto.estado === "INACTIVO";

    const unitLabel =
      item.producto.unidad_medida === "GRAMOS" ? "Gramos" : "Unidades";

    const formatLabel = (value?: string) =>
      value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";

    const geneticsLabel = formatLabel(item.producto.genetica);

    return (
      <Box key={item.producto.id} sx={stockStyles.stockRow}>
        <Box sx={stockStyles.productCell}>
          {renderProductImage(item)}

          <Box>
            <Typography sx={stockStyles.productName}>
              {item.producto.nombre}
            </Typography>

            <Typography sx={stockStyles.productMeta}>
              {productTypeLabels[item.producto.tipo]}
              {geneticsLabel ? ` · ${geneticsLabel}` : ""}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography sx={stockStyles.cellLabelMobile}>Unidad</Typography>

          <Typography sx={stockStyles.cellValue}>{unitLabel}</Typography>
        </Box>

        {renderQuantityCell(
          "Total",
          item.cantidad_total,
          item.producto.unidad_medida,
        )}

        {renderQuantityCell(
          "Reservado",
          item.cantidad_reservada,
          item.producto.unidad_medida,
        )}

        {renderQuantityCell(
          "Disponible",
          item.cantidad_disponible,
          item.producto.unidad_medida,
          true,
        )}

        <Box>
          <Typography sx={stockStyles.cellLabelMobile}>Estado</Typography>

          <Chip
            label={productStatusLabels[item.producto.estado]}
            size="small"
            sx={{
              ...stockStyles.statusChip,
              ...(isInactive ? stockStyles.statusChipInactive : {}),
            }}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pl: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            sx={stockStyles.adjustButton}
            onClick={() => handleOpenAdjustmentModal(item)}
          >
            Ajustar stock
          </Button>
        </Box>
      </Box>
    );
  };

  const renderMovementItem = (movement: StockMovement, index: number) => {
    const isNegative = movement.tipo === "EGRESO" || movement.cantidad < 0;
    const prefix = getMovementQuantityPrefix(movement);
    const referenceLabel = movement.referencia_tipo
      ? (referenceTypeLabels[movement.referencia_tipo] ??
        movement.referencia_tipo)
      : (movementTypeLabels[movement.tipo] ?? movement.tipo);

    return (
      <Box
        key={`${movement.producto_id}-${movement.fecha_creacion}-${index}`}
        sx={stockStyles.movementItem}
      >
        <Box
          sx={{
            ...stockStyles.movementIcon,
            ...getMovementIconStyle(movement),
          }}
        >
          {renderMovementIcon(movement)}
        </Box>

        <Box>
          <Typography sx={stockStyles.movementTitle}>
            {referenceLabel}
          </Typography>

          <Typography sx={stockStyles.movementProduct}>
            {movement.producto.nombre}
          </Typography>

          {movement.observaciones && (
            <Typography sx={stockStyles.movementObservation}>
              {movement.observaciones}
            </Typography>
          )}
        </Box>

        <Box sx={stockStyles.movementSide}>
          <Typography
            sx={
              isNegative
                ? stockStyles.movementQuantityNegative
                : stockStyles.movementQuantityPositive
            }
          >
            {prefix}
            {formatQuantity(movement.cantidad, movement.producto.unidad_medida)}
          </Typography>

          <Typography sx={stockStyles.movementDate}>
            {formatDate(movement.fecha_creacion)}
          </Typography>

          <Typography sx={stockStyles.movementTime}>
            {formatTime(movement.fecha_creacion)}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={stockStyles.root}>
      <Box sx={stockStyles.summaryGrid}>
        <SummaryCard
          icon={<Inventory2OutlinedIcon />}
          label="Productos en inventario"
          value={loadingSummary ? "..." : stockSummary.productosInventario}
          hint="Productos registrados"
        />

        <SummaryCard
          icon={<GrassOutlinedIcon />}
          label="Stock flores disponible"
          value={
            loadingSummary ? "..." : `${stockSummary.stockFloresDisponible} g`
          }
          hint="Disponible para venta"
        />

        <SummaryCard
          icon={<SpaOutlinedIcon />}
          label="Stock semillas disponible"
          value={
            loadingSummary
              ? "..."
              : `${stockSummary.stockSemillasDisponible} un.`
          }
          hint="Unidades disponibles"
        />

        <SummaryCard
          icon={<WarningAmberOutlinedIcon />}
          label="Productos sin stock"
          value={loadingSummary ? "..." : stockSummary.productosSinStock}
          hint="No disponibles"
          warning
        />
      </Box>

      {summaryError && <Box sx={stockStyles.errorBox}>{summaryError}</Box>}

      <Box sx={stockStyles.contentGrid}>
        <Box sx={stockStyles.panel}>
          <Box sx={stockStyles.panelBody}>
            <Box sx={stockStyles.panelHeader}>
              <Box>
                <Typography sx={stockStyles.panelTitle}>
                  Inventario actual
                </Typography>

                <Typography sx={stockStyles.panelSubtitle}>
                  Productos con stock disponible
                </Typography>
              </Box>

              <Box sx={stockStyles.toolbar}>
                <TextField
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="Buscar producto..."
                  size="small"
                  sx={stockStyles.searchField}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  variant="outlined"
                  startIcon={<FilterListOutlinedIcon />}
                  sx={stockStyles.filterButton}
                  onClick={handleOpenFiltersModal}
                >
                  Filtros
                </Button>
              </Box>
            </Box>

            {hasStockFiltersApplied && (
              <Box sx={stockStyles.filtersNotice}>
                <Typography sx={stockStyles.filtersNoticeText}>
                  Filtros aplicados sobre el inventario
                </Typography>

                <Button size="small" onClick={handleClearStockFilters}>
                  Limpiar filtros
                </Button>
              </Box>
            )}

            {stockError && <Box sx={stockStyles.errorBox}>{stockError}</Box>}

            {loadingStock ? (
              <Box sx={stockStyles.emptyState}>
                <CircularProgress size={28} />

                <Typography sx={stockStyles.emptyText}>
                  Cargando inventario...
                </Typography>
              </Box>
            ) : stockItems.length === 0 ? (
              <Box sx={stockStyles.emptyState}>
                <Typography sx={stockStyles.emptyTitle}>
                  No se encontraron productos
                </Typography>

                <Typography sx={stockStyles.emptyText}>
                  No existen productos que coincidan con los criterios de
                  búsqueda aplicados.
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={stockStyles.tableWrapper}>
                  <Box sx={stockStyles.tableHeader}>
                    <span>Producto</span>
                    <span>Unidad</span>
                    <span>Total</span>
                    <span>Reservado</span>
                    <span>Disponible</span>
                    <span>Estado</span>
                    <span>Acciones</span>
                  </Box>

                  {visibleStockItems.map(renderStockRow)}
                </Box>

                <Box sx={stockStyles.footerRow}>
                  <Typography sx={stockStyles.footerText}>
                    Mostrando {stockPaginationRange.from} a{" "}
                    {stockPaginationRange.to} de {stockPagination.total}{" "}
                    productos
                  </Typography>

                  {stockPagination.totalPages > 1 && (
                    <Pagination
                      page={stockPagination.page}
                      count={stockPagination.totalPages}
                      size="small"
                      onChange={(_, page) => changeStockPage(page)}
                      sx={stockStyles.tablePagination}
                    />
                  )}
                </Box>
              </>
            )}
          </Box>
        </Box>

        <Box sx={stockStyles.movementsPanel}>
          <Box sx={stockStyles.panelBody}>
            <Box sx={stockStyles.panelHeader}>
              <Box>
                <Typography sx={stockStyles.panelTitle}>
                  Movimientos recientes
                </Typography>

                <Typography sx={stockStyles.panelSubtitle}>
                  Últimos 5 movimientos registrados.
                </Typography>
              </Box>
            </Box>

            {movementError && (
              <Box sx={stockStyles.errorBox}>{movementError}</Box>
            )}

            {loadingMovements ? (
              <Box sx={stockStyles.emptyState}>
                <CircularProgress size={28} />

                <Typography sx={stockStyles.emptyText}>
                  Cargando movimientos...
                </Typography>
              </Box>
            ) : recentMovements.length === 0 ? (
              <Box sx={stockStyles.emptyState}>
                <Typography sx={stockStyles.emptyTitle}>
                  Sin movimientos registrados
                </Typography>

                <Typography sx={stockStyles.emptyText}>
                  Los ingresos, egresos y ajustes aparecerán en esta sección.
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={stockStyles.movementList}>
                  {recentMovements.map(renderMovementItem)}
                </Box>

                <Button
                  variant="outlined"
                  sx={stockStyles.viewAllButton}
                  onClick={handleOpenMovementsModal}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        flex: 1,
                        textAlign: "center",
                      }}
                    >
                      Ver todos
                    </Box>

                    <ChevronRightRoundedIcon sx={{ fontSize: 22 }} />
                  </Box>
                </Button>
              </>
            )}

            <Box sx={stockStyles.infoBox}>
              <InfoOutlinedIcon fontSize="small" sx={stockStyles.infoIcon} />

              <Box>
                <Typography sx={stockStyles.infoTitle}>
                  Información importante
                </Typography>

                <Typography sx={stockStyles.infoText}>
                  Los ajustes manuales requieren observación obligatoria y
                  quedan registrados para trazabilidad completa.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <StockFiltersModal
        open={isFiltersModalOpen}
        filterForm={filterForm}
        onChange={setFilterForm}
        onClose={handleCloseFiltersModal}
        onApply={handleApplyFilters}
      />

      <StockAdjustmentModal
        open={Boolean(selectedStockItem)}
        selectedStockItem={selectedStockItem}
        adjustmentQuantity={adjustmentQuantity}
        adjustmentObservation={adjustmentObservation}
        adjustmentError={frontendAdjustmentError ?? adjustmentError}
        adjustmentSuccess={adjustmentSuccess}
        adjustingStock={adjustingStock}
        onClose={handleCloseAdjustmentModal}
        onQuantityChange={handleAdjustmentQuantityChange}
        onObservationChange={handleAdjustmentObservationChange}
        onSubmit={handleSubmitAdjustment}
      />

      <StockMovementsModal
        open={isMovementsModalOpen}
        movements={movements}
        movementFiltersForm={movementFiltersForm}
        movementError={movementError}
        loadingMovements={loadingMovements}
        loadingMoreMovements={loadingMoreMovements}
        canLoadMoreMovements={movementPagination.hasNextPage}
        onClose={handleCloseMovementsModal}
        onFiltersChange={setMovementFiltersForm}
        onApplyFilters={handleApplyMovementFilters}
        onClearFilters={handleClearMovementFilters}
        onLoadMore={loadMoreMovements}
        renderMovementItem={renderMovementItem}
      />
    </Box>
  );
}
