"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AddRounded,
  CalendarMonthRounded,
  CheckCircleRounded,
  Delete,
  FilterListRounded,
  GrassRounded,
  LocalFloristRounded,
  PersonOutlineRounded,
  ReceiptLongRounded,
  SearchRounded,
  ShoppingCartRounded,
  VisibilityOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { Sale } from "@/api/salesApi";
import { useSales } from "@/hooks/sales/useSales";
import { SaleDetailModal } from "./SaleDetailModal";
import { SalesFiltersModal, SalesStatusFilter } from "./SalesFiltersModal";

import { salesStyles } from "./sales.styles";

const LEGAL_LIMIT_GRAMS = 40;

type LocalSaleDetail = {
  productId: number;
  productName: string;
  thc: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

/*
Miniatura visual premium para productos FLOR.

Evita emojis y mantiene una representación visual
consistente, reutilizable y alineada al módulo.
*/
function ProductVisual({ compact = false }: { compact?: boolean }) {
  return (
    <Box
      sx={
        compact ? salesStyles.productVisualCompact : salesStyles.productVisual
      }
    >
      <LocalFloristRounded
        sx={{
          fontSize: compact ? 17 : 21,
          color: "#2F6F46",
        }}
      />
    </Box>
  );
}

/*
Container principal del módulo de ventas.

Responsabilidades:
- renderizar la interfaz administrativa de ventas;
- manejar estado local del formulario;
- conectar la UI con el hook orquestador del módulo;
- aplicar validaciones preventivas de experiencia de usuario;
- delegar persistencia, auditoría, stock y reglas legales definitivas al backend.

No accede directamente a httpClient.
No realiza llamadas HTTP directas.
No contiene reglas críticas definitivas de negocio.
*/
export default function SalesContainer() {
  /*
  useSales centraliza las operaciones del módulo:

  - historial de ventas;
  - detalle de venta;
  - registro y anulación;
  - socios activos;
  - flores activas.

  El container consume datos listos para renderizar
  y no coordina hooks de otros módulos.
  */
  const {
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
  } = useSales();

  const [selectedMemberId, setSelectedMemberId] = useState<number | "">("");
  const [selectedFlowerId, setSelectedFlowerId] = useState<number | "">("");
  const [quantity, setQuantity] = useState("");
  const [observations, setObservations] = useState("");
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  /*
  Estados temporales del modal de filtros.

  El modal funciona como constructor de una nueva búsqueda:
  cada vez que se abre, comienza limpio y no arrastra
  valores de búsquedas anteriores.
  */
  const [statusFilter, setStatusFilter] = useState<SalesStatusFilter>("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /*
  Filtros actualmente aplicados al historial.

  Se separan de los estados temporales del modal para que
  el historial pueda permanecer filtrado mientras el modal
  vuelve a abrirse limpio para construir una nueva búsqueda.
  */
  const [appliedStatusFilter, setAppliedStatusFilter] =
    useState<SalesStatusFilter>("");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const [saleDetails, setSaleDetails] = useState<LocalSaleDetail[]>([]);
  /*
  Carga la información necesaria para inicializar
  la pantalla de ventas.

  useSales actúa como hook orquestador del módulo:
  obtiene el historial y también las opciones necesarias
  para el formulario, manteniendo el container sin
  dependencias directas de hooks de otros dominios.
  */
  useEffect(() => {
    void fetchSales();
    void fetchSaleOptions();
  }, [fetchSales, fetchSaleOptions]);

  /*
  Obtiene las flores disponibles para registrar una venta.

  useSales ya solicita al backend productos tipo FLOR
  en estado ACTIVO mediante getProductOptions.

  Este filtro local solo conserva reglas visuales del formulario:
  - precio de venta definido;
  - stock disponible mayor a cero.

  La validación definitiva de producto, stock y límite legal
  continúa siendo responsabilidad del backend.
  */
  const availableFlowers = useMemo(
    () =>
      products.filter(
        (product) =>
          product.tipo === "FLOR" &&
          product.estado === "ACTIVO" &&
          product.precio_venta_actual !== null &&
          (product.stock?.cantidad_disponible ?? 0) > 0,
      ),
    [products],
  );

  /*
  Obtiene los socios habilitados para registrar ventas.

  useSales ya expone socios activos. Se mantiene este
  useMemo como capa defensiva de UI para preservar
  el contrato visual del formulario.
  */
  const activeSocios = useMemo(
    () => socios.filter((socio) => socio.estado === "ACTIVO"),
    [socios],
  );

  const selectedMember = activeSocios.find(
    (socio) => socio.id === selectedMemberId,
  );

  const selectedFlower = availableFlowers.find(
    (product) => product.id === selectedFlowerId,
  );

  const selectedFlowerReservedQuantity = saleDetails
    .filter((detail) => detail.productId === selectedFlowerId)
    .reduce((total, detail) => total + detail.quantity, 0);

  /*
  Stock visual temporal disponible para la venta actual.

  No modifica el stock real de base de datos.
  Solo descuenta localmente las cantidades ya agregadas
  al carrito de esta venta.
  */
  const selectedFlowerAvailableStock =
    (selectedFlower?.stock?.cantidad_disponible ?? 0) -
    selectedFlowerReservedQuantity;

  const totalGrams = useMemo(
    () => saleDetails.reduce((total, detail) => total + detail.quantity, 0),
    [saleDetails],
  );

  const totalAmount = useMemo(
    () => saleDetails.reduce((total, detail) => total + detail.subtotal, 0),
    [saleDetails],
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));

  const getSaleTotalGrams = (sale: Sale) =>
    sale.detalles.reduce((total, detail) => total + detail.cantidad, 0);

  /*
  Calcula el consumo mensual actual del socio seleccionado
  a partir de ventas registradas en el historial cargado.

  Solo considera ventas REGISTRADAS del mes corriente.
  Las ventas anuladas no impactan el consumo.
  */
  const currentConsumption = useMemo(() => {
    if (!selectedMember) return 0;

    const now = new Date();

    return sales
      .filter((sale) => {
        const saleDate = new Date(sale.fecha);

        return (
          sale.socio_id === selectedMember.id &&
          sale.estado === "REGISTRADA" &&
          saleDate.getMonth() === now.getMonth() &&
          saleDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((total, sale) => total + getSaleTotalGrams(sale), 0);
  }, [sales, selectedMember]);

  const consumptionPercentage = Math.min(
    Math.round((currentConsumption / LEGAL_LIMIT_GRAMS) * 100),
    100,
  );

  /*
  Construye los filtros actuales del historial
  para mantener centralizada la forma en que
  el container solicita ventas al hook.

  El container decide qué filtros aplicar.
  El hook se limita a ejecutar la consulta.
  */
  const getCurrentSalesFilters = () => ({
    search: search || undefined,
    estado: appliedStatusFilter || undefined,
    fechaDesde: appliedFromDate || undefined,
    fechaHasta: appliedToDate || undefined,
  });

  const hasActiveHistoryFilters = Boolean(
    search || appliedStatusFilter || appliedFromDate || appliedToDate,
  );

  /*
  Abre el modal de filtros como constructor de una nueva búsqueda.

  Por decisión UX global del sistema, el modal no arrastra
  los filtros previamente aplicados; siempre inicia limpio.
  */
  const handleOpenFilters = () => {
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setFiltersOpen(true);
  };

  /*
  Aplica los filtros seleccionados en el modal
  sobre el historial de ventas.
  */
  const handleApplyFilters = () => {
    setAppliedStatusFilter(statusFilter);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);

    void fetchSales({
      search: search || undefined,
      estado: statusFilter || undefined,
      fechaDesde: fromDate || undefined,
      fechaHasta: toDate || undefined,
    });

    setFiltersOpen(false);
  };

  /*
  Limpia búsqueda, estado y rango de fechas,
  restituyendo el historial completo.
  */
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setAppliedStatusFilter("");
    setAppliedFromDate("");
    setAppliedToDate("");
    void fetchSales();
    setFiltersOpen(false);
  };

  /*
  Agrega un producto FLOR al resumen local.

  Se realizan validaciones preventivas en frontend
  para mejorar la experiencia del administrador.

  La validación definitiva continúa siendo
  responsabilidad del backend.
  */
  const handleAddFlower = () => {
    if (!selectedMember) {
      setFormError("Seleccioná un socio antes de agregar una flor.");
      return;
    }

    if (!selectedFlower || selectedFlower.precio_venta_actual === null) {
      setFormError("Seleccioná una flor antes de agregarla a la venta.");
      return;
    }

    const parsedQuantity = Number(quantity.replace(",", "."));

    if (
      !parsedQuantity ||
      parsedQuantity <= 0 ||
      Number.isNaN(parsedQuantity)
    ) {
      setFormError("Ingresá una cantidad en gramos mayor a cero.");
      return;
    }

    const availableStock = selectedFlowerAvailableStock;

    if (parsedQuantity > availableStock) {
      setFormError("La cantidad ingresada supera el stock disponible.");
      return;
    }

    if (currentConsumption + totalGrams + parsedQuantity > LEGAL_LIMIT_GRAMS) {
      setFormError(
        "La venta supera el límite legal mensual de 40 g para el socio.",
      );
      return;
    }

    const unitPrice = selectedFlower.precio_venta_actual;

    const existingDetail = saleDetails.find(
      (detail) => detail.productId === selectedFlower.id,
    );

    if (existingDetail) {
      setSaleDetails((currentDetails) =>
        currentDetails.map((detail) =>
          detail.productId === selectedFlower.id
            ? {
                ...detail,
                quantity: detail.quantity + parsedQuantity,
                subtotal: (detail.quantity + parsedQuantity) * detail.unitPrice,
              }
            : detail,
        ),
      );

      setFormError("");
      setQuantity("");
      setSelectedFlowerId("");

      return;
    }

    setSaleDetails((currentDetails) => [
      ...currentDetails,
      {
        productId: selectedFlower.id,
        productName: selectedFlower.nombre,
        thc: selectedFlower.porcentaje_thc ?? 0,
        quantity: parsedQuantity,
        unitPrice,
        subtotal: parsedQuantity * unitPrice,
      },
    ]);

    setFormError("");
    setQuantity("");
    setSelectedFlowerId("");
  };

  /*
  Elimina un producto del resumen local.
  */
  const handleRemoveDetail = (productId: number) => {
    setSaleDetails((currentDetails) =>
      currentDetails.filter((detail) => detail.productId !== productId),
    );
  };

  /*
  Restablece el formulario de venta.
  */
  const handleClearForm = () => {
    setSelectedMemberId("");
    setSelectedFlowerId("");
    setSaleDetails([]);
    setQuantity("");
    setObservations("");
    setFormError("");
  };

  /*
  Confirma una venta directa presencial.

  Backend valida socio, stock, límite legal,
  tipo de producto, auditoría y movimiento de stock.
  */
  const handleConfirmSale = async () => {
    if (!selectedMember || saleDetails.length === 0) return;

    const createdSale = await createSale({
      socio_id: selectedMember.id,
      observaciones: observations || undefined,
      detalles: saleDetails.map((detail) => ({
        producto_id: detail.productId,
        cantidad: detail.quantity,
      })),
    });

    if (createdSale) {
      handleClearForm();

      /*
      Refresca el historial respetando los filtros activos.
      Las opciones del formulario se actualizan desde useSales
      luego de registrar la operación.
      */
      void fetchSales(getCurrentSalesFilters());
    }
  };

  /*
  Anula una venta registrada.
  Backend mantiene trazabilidad y restituye stock.
  */
  const handleCancelSale = async (sale: Sale) => {
    if (sale.estado !== "REGISTRADA") return;

    const cancelledSale = await cancelSale(sale.id);

    if (cancelledSale) {
      /*
      Refresca el historial respetando los filtros activos.
      Las opciones del formulario se actualizan desde useSales
      luego de anular la operación.
      */
      void fetchSales(getCurrentSalesFilters());
    }
  };

  return (
    <Box sx={salesStyles.root}>
      {error && (
        <Alert severity="error" onClose={clearError} sx={salesStyles.errorBox}>
          {error}
        </Alert>
      )}


      {formError && (
        <Alert
          severity="error"
          onClose={() => setFormError("")}
          sx={salesStyles.errorBox}
        >
          {formError}
        </Alert>
      )}

      <Box sx={salesStyles.contentGrid}>
        <Paper sx={salesStyles.mainPanel}>
          <Box sx={salesStyles.panelHeader}>
            <Box sx={salesStyles.panelIcon}>
              <ShoppingCartRounded fontSize="small" />
            </Box>

            <Box>
              <Typography variant="h5" sx={salesStyles.panelTitle}>
                Nueva venta
              </Typography>

              <Typography variant="body2" sx={salesStyles.panelSubtitle}>
                Completá los datos para registrar una venta presencial.
              </Typography>
            </Box>
          </Box>

          <Box sx={salesStyles.stepsWrapper}>
            <Box sx={salesStyles.memberStep}>
              <Box sx={salesStyles.stepHeader}>
                <Box sx={salesStyles.stepNumber}>1</Box>

                <PersonOutlineRounded sx={salesStyles.memberStepIcon} />

                <Typography variant="subtitle1" sx={salesStyles.stepTitle}>
                  Seleccionar socio
                </Typography>
              </Box>

              <Box sx={salesStyles.memberGrid}>
                <Box>
                  <Select
                    fullWidth
                    displayEmpty
                    value={selectedMemberId}
                    onChange={(event) => {
                      const value = event.target.value as number | "";
                      setSelectedMemberId(value);
                      setFormError("");
                    }}
                    sx={salesStyles.memberSelect}
                    inputProps={{
                      "aria-label": "Seleccionar socio",
                    }}
                  >
                    <MenuItem value="" disabled>
                      Seleccionar socio
                    </MenuItem>

                    {loadingOptions && (
                      <MenuItem value="" disabled>
                        Cargando socios...
                      </MenuItem>
                    )}

                    {!loadingOptions &&
                      activeSocios.map((socio) => (
                        <MenuItem key={socio.id} value={socio.id}>
                          <Box sx={salesStyles.memberOption}>
                            <Box sx={salesStyles.memberAvatar}>
                              <PersonOutlineRounded fontSize="small" />
                            </Box>

                            <Box sx={salesStyles.optionText}>
                              <Typography sx={salesStyles.optionPrimary}>
                                {`${socio.nombre} ${socio.apellido}`}
                              </Typography>

                              <Typography sx={salesStyles.optionSecondary}>
                                CI: {socio.documento}
                              </Typography>
                            </Box>

                            <Chip
                              label={socio.estado}
                              size="small"
                              sx={salesStyles.activeChip}
                            />
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                </Box>

                <Box sx={salesStyles.consumptionCard}>
                  <Typography variant="caption" sx={salesStyles.mutedText}>
                    Consumo mensual actual
                  </Typography>

                  <Box sx={salesStyles.consumptionValueRow}>
                    <Typography sx={salesStyles.consumptionValue}>
                      {currentConsumption.toString().replace(".", ",")} g
                    </Typography>

                    <Typography sx={salesStyles.limitText}>
                      / {LEGAL_LIMIT_GRAMS} g
                    </Typography>
                  </Box>

                  <Box sx={salesStyles.progressRow}>
                    <Box sx={salesStyles.progressTrack}>
                      <Box
                        sx={{
                          ...salesStyles.progressBar,
                          width: `${consumptionPercentage}%`,
                        }}
                      />
                    </Box>

                    <Typography sx={salesStyles.progressPercentage}>
                      {consumptionPercentage}%
                    </Typography>
                  </Box>

                  <Typography variant="caption" sx={salesStyles.mutedText}>
                    Límite legal: {LEGAL_LIMIT_GRAMS} gramos mensuales por socio
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={salesStyles.productsStep}>
              <Box sx={salesStyles.stepHeader}>
                <Box sx={salesStyles.stepNumberBlue}>2</Box>

                <GrassRounded sx={salesStyles.flowerStepIcon} />

                <Typography variant="subtitle1" sx={salesStyles.stepTitle}>
                  Agregar flores
                </Typography>
              </Box>

              <Box sx={salesStyles.productGrid}>
                <Box>
                  <Typography variant="caption" sx={salesStyles.inputLabel}>
                    Producto
                  </Typography>

                  <Select
                    fullWidth
                    displayEmpty
                    value={selectedFlowerId}
                    onChange={(event) => {
                      const value = event.target.value as number | "";
                      setSelectedFlowerId(value);
                      setFormError("");
                    }}
                    sx={salesStyles.productSelect}
                    inputProps={{
                      "aria-label": "Seleccionar producto tipo flor",
                    }}
                  >
                    <MenuItem value="" disabled>
                      Seleccionar producto
                    </MenuItem>

                    {loadingOptions && (
                      <MenuItem value="" disabled>
                        Cargando flores...
                      </MenuItem>
                    )}

                    {!loadingOptions &&
                      availableFlowers.map((flower) => (
                        <MenuItem key={flower.id} value={flower.id}>
                          <Box sx={salesStyles.productOption}>
                            <ProductVisual />

                            <Box sx={salesStyles.optionText}>
                              <Typography sx={salesStyles.optionPrimary}>
                                {flower.nombre}
                              </Typography>

                              <Typography sx={salesStyles.optionSecondary}>
                                THC {flower.porcentaje_thc}% · FLOR
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                </Box>

                <Box>
                  <Typography variant="caption" sx={salesStyles.inputLabel}>
                    Cantidad (g) *
                  </Typography>

                  <TextField
                    fullWidth
                    value={quantity}
                    onChange={(event) => {
                      setQuantity(event.target.value);
                      setFormError("");
                    }}
                    placeholder="Ej: 3.5"
                    sx={salesStyles.input}
                    slotProps={{
                      htmlInput: {
                        "aria-label": "Cantidad en gramos",
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={salesStyles.inputLabel}>
                    Stock disponible
                  </Typography>

                  <Box sx={salesStyles.stockBox}>
                    <Typography sx={salesStyles.stockValue}>
                      {selectedFlower
                        ? `${selectedFlowerAvailableStock.toString().replace(".", ",")} g`
                        : "—"}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AddRounded />}
                  onClick={handleAddFlower}
                  sx={salesStyles.addButton}
                >
                  Agregar
                </Button>
              </Box>

              <Box sx={salesStyles.detailsTable}>
                <Box sx={salesStyles.tableHeader}>
                  <Typography>Producto</Typography>

                  <Typography sx={{ textAlign: "center" }}>THC</Typography>

                  <Typography sx={{ textAlign: "center" }}>
                    Cantidad (g)
                  </Typography>

                  <Typography sx={{ textAlign: "center" }}>
                    Precio unit.
                  </Typography>

                  <Typography sx={{ textAlign: "center" }}>Subtotal</Typography>

                  <Typography sx={{ textAlign: "center" }}>Acciones</Typography>
                </Box>

                {saleDetails.map((detail) => (
                  <Box key={detail.productId} sx={salesStyles.tableRow}>
                    <Box sx={salesStyles.tableProductCell}>
                      <ProductVisual compact />

                      <Typography sx={salesStyles.productName}>
                        {detail.productName}
                      </Typography>
                    </Box>

                    <Typography sx={{ textAlign: "center" }}>
                      {detail.thc}%
                    </Typography>

                    <Typography sx={{ textAlign: "center", fontWeight: 800 }}>
                      {detail.quantity.toString().replace(".", ",")}
                    </Typography>

                    <Typography sx={{ textAlign: "center" }}>
                      {formatCurrency(detail.unitPrice)}
                    </Typography>

                    <Typography
                      sx={{
                        ...salesStyles.subtotalText,
                        textAlign: "center",
                      }}
                    >
                      {formatCurrency(detail.subtotal)}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <IconButton
                        size="small"
                        aria-label={`Eliminar ${detail.productName}`}
                        onClick={() => handleRemoveDetail(detail.productId)}
                        sx={salesStyles.deleteButton}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={salesStyles.summaryStep}>
              <Box sx={salesStyles.summaryTop}>
                <Box sx={salesStyles.stepHeaderNoMargin}>
                  <Box sx={salesStyles.stepNumberOrange}>3</Box>

                  <ReceiptLongRounded sx={salesStyles.summaryStepIcon} />

                  <Typography variant="subtitle1" sx={salesStyles.stepTitle}>
                    Resumen de venta
                  </Typography>
                </Box>
              </Box>

              <Divider sx={salesStyles.divider} />

              <Box sx={salesStyles.summaryMetricsGrid}>
                <Box sx={salesStyles.summaryMetricCard}>
                  <Box sx={salesStyles.summaryMetricIcon}>
                    <LocalFloristRounded />
                  </Box>

                  <Box sx={salesStyles.summaryMetricContent}>
                    <Typography sx={salesStyles.summaryMetricLabel}>
                      Total gramos
                    </Typography>

                    <Typography sx={salesStyles.summaryMetricValueOrange}>
                      {totalGrams.toString().replace(".", ",")} g
                    </Typography>

                    <Typography sx={salesStyles.summaryMetricHint}>
                      {saleDetails.length} productos seleccionados
                    </Typography>
                  </Box>
                </Box>

                <Box sx={salesStyles.summaryMetricCard}>
                  <Box sx={salesStyles.summaryMetricIconGreen}>
                    <Typography sx={salesStyles.summaryCurrencyIcon}>
                      $
                    </Typography>
                  </Box>

                  <Box sx={salesStyles.summaryMetricContent}>
                    <Typography sx={salesStyles.summaryMetricLabel}>
                      Total a cobrar
                    </Typography>

                    <Typography sx={salesStyles.summaryMetricValueGreen}>
                      {formatCurrency(totalAmount)}
                    </Typography>

                    <Box sx={salesStyles.summaryStatusPill}>
                      <CheckCircleRounded sx={salesStyles.summaryStatusIcon} />
                      <Typography sx={salesStyles.summaryStatusText}>
                        Listo para confirmar
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Typography sx={salesStyles.observationsHeader}>
                Observaciones (opcional)
              </Typography>

              <TextField
                multiline
                minRows={5}
                value={observations}
                onChange={(event) => setObservations(event.target.value)}
                placeholder="Agregá observaciones sobre la venta..."
                sx={salesStyles.observationsInput}
              />

              <Divider sx={salesStyles.divider} />

              <Box sx={salesStyles.actionsBox}>
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={handleClearForm}
                  sx={salesStyles.clearButton}
                >
                  Limpiar
                </Button>

                <Button
                  variant="contained"
                  startIcon={!savingSale && <CheckCircleRounded />}
                  disabled={savingSale || saleDetails.length === 0}
                  onClick={handleConfirmSale}
                  sx={salesStyles.confirmButton}
                >
                  {savingSale ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Confirmar venta"
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper sx={salesStyles.historyPanel}>
          <Box sx={salesStyles.historyHeader}>
            <Box sx={salesStyles.panelHeaderCompact}>
              <Box sx={salesStyles.panelIcon}>
                <ReceiptLongRounded fontSize="small" />
              </Box>

              <Box>
                <Typography variant="h5" sx={salesStyles.panelTitle}>
                  Historial de ventas
                </Typography>

                <Typography variant="body2" sx={salesStyles.panelSubtitle}>
                  Últimas ventas registradas
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<FilterListRounded />}
              onClick={handleOpenFilters}
              sx={salesStyles.filterButton}
            >
              Filtros
            </Button>

            {hasActiveHistoryFilters && (
              <>
                <Chip
                  label="Filtros activos"
                  size="small"
                  sx={salesStyles.registeredChip}
                />

                <Button
                  variant="text"
                  onClick={handleClearFilters}
                  sx={salesStyles.cancelButton}
                >
                  Limpiar filtros
                </Button>
              </>
            )}
          </Box>

          <TextField
            fullWidth
            placeholder="Buscar por venta, socio o CI..."
            value={search}
            onChange={(event) => {
              const value = event.target.value;

              setSearch(value);
              void fetchSales({
                search: value || undefined,
                estado: appliedStatusFilter || undefined,
                fechaDesde: appliedFromDate || undefined,
                fechaHasta: appliedToDate || undefined,
              });
            }}
            sx={salesStyles.searchInput}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Box sx={salesStyles.salesList}>
            {loadingSales && (
              <Box sx={salesStyles.loadingBox}>
                <CircularProgress size={24} />
              </Box>
            )}

            {!loadingSales && sales.length > 0 && (
              <>
                <Box sx={salesStyles.salesTableHeader}>
                  <Typography>Venta</Typography>
                  <Typography>Socio</Typography>
                  <Typography>Cantidad</Typography>
                  <Typography>Total</Typography>
                  <Typography>Estado</Typography>
                  <Typography>Acciones</Typography>
                </Box>

                <Box sx={salesStyles.salesTableBody}>
                  {sales.map((sale) => (
                    <Box key={sale.id} sx={salesStyles.saleRow}>
                      <Box sx={salesStyles.saleMainInfo}>
                        <Typography sx={salesStyles.saleCode}>
                          #V-{sale.id.toString().padStart(6, "0")}
                        </Typography>

                        <Typography variant="body2" sx={salesStyles.saleDate}>
                          <CalendarMonthRounded sx={salesStyles.inlineIcon} />
                          {formatDate(sale.fecha)}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography sx={salesStyles.saleMember}>
                          {sale.socio.nombre} {sale.socio.apellido}
                        </Typography>

                        <Typography variant="body2" sx={salesStyles.mutedText}>
                          CI: {sale.socio.documento}
                        </Typography>
                      </Box>

                      <Typography sx={salesStyles.saleQuantity}>
                        {getSaleTotalGrams(sale)} g
                      </Typography>

                      <Typography sx={salesStyles.saleTotal}>
                        {formatCurrency(sale.total)}
                      </Typography>

                      <Chip
                        label={sale.estado}
                        size="small"
                        sx={
                          sale.estado === "REGISTRADA"
                            ? salesStyles.registeredChip
                            : salesStyles.cancelledChip
                        }
                      />

                      <Box sx={salesStyles.saleActions}>
                        <IconButton
                          size="small"
                          aria-label="Ver detalle de venta"
                          sx={salesStyles.viewButton}
                          onClick={() => void fetchSaleById(sale.id)}
                        >
                          <VisibilityOutlined fontSize="small" />
                        </IconButton>

                        <Button
                          size="small"
                          disabled={
                            sale.estado !== "REGISTRADA" || cancellingSale
                          }
                          onClick={() => handleCancelSale(sale)}
                          sx={salesStyles.cancelButton}
                        >
                          Anular
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {!loadingSales && sales.length === 0 && (
              <Box sx={salesStyles.emptyBox}>
                <Typography sx={salesStyles.emptyTitle}>
                  Todavía no hay ventas registradas.
                </Typography>

                <Typography variant="body2" sx={salesStyles.mutedText}>
                  Cuando registres una venta, aparecerá en este historial.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        <SalesFiltersModal
          open={filtersOpen}
          status={statusFilter}
          fromDate={fromDate}
          toDate={toDate}
          onStatusChange={setStatusFilter}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          onClose={() => setFiltersOpen(false)}
        />

        <SaleDetailModal
          open={Boolean(selectedSale)}
          sale={selectedSale}
          loading={loadingDetail}
          onClose={() => setSelectedSale(null)}
        />
      </Box>
    </Box>
  );
}
