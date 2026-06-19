"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

import { Product } from "@/api/productsApi";
import { usePurchases } from "@/hooks/purchases/usePurchases";
import { colors } from "@/theme/colors";

import { purchasesStyles } from "./purchases.styles";
import { CreateSeedModal } from "@/components/CreateSeedModal";

type PurchaseItem = {
  product: Product;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
};

export default function PurchasesContainer() {
  const {
    providers,
    products,
    createdPurchase,
    loading,
    submitting,
    creatingSeed,
    error,
    fetchPurchaseOptions,
    createPurchase,
    createSeedProduct,
    clearError,
    clearCreatedPurchase,
  } = usePurchases();

  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [observations, setObservations] = useState("");

  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isCreateSeedModalOpen, setIsCreateSeedModalOpen] = useState(false);

  /*
  Carga inicial de proveedores y productos.

  El container consume el hook del módulo.
  No realiza solicitudes HTTP directas.

  Arquitectura respetada:
  Page → Container → Hook → API → httpClient → Backend.
  */
  useEffect(() => {
    fetchPurchaseOptions();
  }, [fetchPurchaseOptions]);

  /*
  Muestra feedback visual cuando backend confirma
  el registro correcto de la compra.
  */
  useEffect(() => {
    if (createdPurchase) {
      setSuccessOpen(true);
    }
  }, [createdPurchase]);

  const activeProviders = useMemo(
    () => providers.filter((provider) => provider.estado === "ACTIVO"),
    [providers],
  );

  /*
  Decisión UX actual:
  se muestran semillas activas para prevenir errores operativos.

  Nota importante:
  backend permite comprar semillas inactivas.
  Si se decide reabastecer semillas inactivas desde UI,
  este filtro debe ajustarse de forma consciente.
  */
  const activeSeedProducts = useMemo(
    () =>
      products.filter(
        (product) => product.tipo === "SEMILLA" && product.estado === "ACTIVO",
      ),
    [products],
  );

  const selectedProvider = useMemo(
    () =>
      activeProviders.find(
        (provider) => provider.id === Number(selectedProviderId),
      ),
    [activeProviders, selectedProviderId],
  );

  const selectedProduct = useMemo(
    () =>
      activeSeedProducts.find(
        (product) => product.id === Number(selectedProductId),
      ),
    [activeSeedProducts, selectedProductId],
  );

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.subtotal, 0),
    [items],
  );

  const totalUnits = useMemo(
    () => items.reduce((acc, item) => acc + item.cantidad, 0),
    [items],
  );

  const canAddItem =
    Boolean(selectedProduct) && Number(quantity) > 0 && Number(unitPrice) > 0;

  const canSubmit =
    Boolean(selectedProviderId) && items.length > 0 && !submitting;

  const formatCurrency = (value: number) =>
    `$ ${value.toLocaleString("es-UY", {
      maximumFractionDigits: 0,
    })}`;

  const formatGenetics = (value: Product["genetica"]) =>
    value.charAt(0) + value.slice(1).toLowerCase();

  const resetItemForm = () => {
    setSelectedProductId("");
    setQuantity("");
    setUnitPrice("");
  };

  const handleResetForm = () => {
    setSelectedProviderId("");
    setObservations("");
    setItems([]);
    resetItemForm();
    setFormError(null);
    clearError();
    clearCreatedPurchase();
  };

  const handleAddItem = () => {
    setFormError(null);

    if (!selectedProduct) {
      setFormError("Seleccioná una semilla para agregar a la compra.");
      return;
    }

    if (items.some((item) => item.product.id === selectedProduct.id)) {
      setFormError("Esta semilla ya fue agregada al detalle de compra.");
      return;
    }

    const parsedQuantity = Number(quantity);
    const parsedUnitPrice = Number(unitPrice);

    if (parsedQuantity <= 0 || Number.isNaN(parsedQuantity)) {
      setFormError("La cantidad debe ser mayor a cero.");
      return;
    }

    if (parsedUnitPrice <= 0 || Number.isNaN(parsedUnitPrice)) {
      setFormError("El precio unitario debe ser mayor a cero.");
      return;
    }

    setItems((currentItems) => [
      ...currentItems,
      {
        product: selectedProduct,
        cantidad: parsedQuantity,
        precio_unitario: parsedUnitPrice,
        subtotal: parsedQuantity * parsedUnitPrice,
      },
    ]);

    resetItemForm();
  };

  /*
  Crea una semilla desde Compras y la selecciona automáticamente.

  Esto evita que el administrador tenga que salir del flujo,
  ir a Productos, crear la semilla y volver a cargar la compra.
  */
  const handleCreateSeed = async (
    payload: Parameters<typeof createSeedProduct>[0],
  ) => {
    const createdSeed = await createSeedProduct(payload);

    if (!createdSeed) return null;

    setSelectedProductId(String(createdSeed.id));
    setUnitPrice(String(createdSeed.precio_venta_actual));

    return createdSeed;
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setItems((currentItems) =>
      currentItems.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!selectedProviderId) {
      setFormError("Seleccioná un proveedor activo antes de confirmar.");
      return;
    }

    if (items.length === 0) {
      setFormError("Agregá al menos una semilla a la compra.");
      return;
    }

    const purchase = await createPurchase({
      proveedor_id: Number(selectedProviderId),
      observaciones: observations.trim() || undefined,
      detalles: items.map((item) => ({
        producto_id: item.product.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      })),
    });

    if (!purchase) return;

    setSelectedProviderId("");
    setObservations("");
    setItems([]);
    resetItemForm();
  };

  return (
    <Box sx={purchasesStyles.page}>
      <Box sx={purchasesStyles.headerStats}>
        <Box sx={purchasesStyles.statPill}>
          <GroupsOutlinedIcon />

          <Box>
            <Typography sx={purchasesStyles.statLabel}>
              Proveedores activos
            </Typography>

            <Typography sx={purchasesStyles.statValue}>
              {activeProviders.length}
            </Typography>

            <Typography sx={purchasesStyles.providerMeta}>
              Total registrados
            </Typography>
          </Box>
        </Box>

        <Box sx={purchasesStyles.statPill}>
          <SpaOutlinedIcon />

          <Box>
            <Typography sx={purchasesStyles.statLabel}>
              Semillas activas
            </Typography>

            <Typography sx={purchasesStyles.statValue}>
              {activeSeedProducts.length}
            </Typography>

            <Typography sx={purchasesStyles.providerMeta}>
              Disponibles
            </Typography>
          </Box>
        </Box>

        <Box sx={purchasesStyles.statPill}>
          <Inventory2OutlinedIcon />

          <Box>
            <Typography sx={purchasesStyles.statLabel}>
              Compras del mes
            </Typography>

            <Typography sx={purchasesStyles.statValue}>0</Typography>

            <Typography sx={purchasesStyles.providerMeta}>
              Sin compras aún
            </Typography>
          </Box>
        </Box>

        <Box sx={purchasesStyles.statPill}>
          <PaidOutlinedIcon />

          <Box>
            <Typography sx={purchasesStyles.statLabel}>Total actual</Typography>

            <Typography sx={purchasesStyles.statValue}>
              {formatCurrency(total)}
            </Typography>

            <Typography sx={purchasesStyles.providerMeta}>
              Esta compra
            </Typography>
          </Box>
        </Box>
      </Box>

      {(error || formError) && (
        <Alert
          severity="error"
          onClose={() => {
            clearError();
            setFormError(null);
          }}
          sx={purchasesStyles.alert}
        >
          {formError || error}
        </Alert>
      )}

      {loading ? (
        <Box sx={purchasesStyles.loadingState}>
          <CircularProgress size={24} />

          <Typography sx={purchasesStyles.feedbackText}>
            Cargando proveedores y semillas...
          </Typography>
        </Box>
      ) : (
        <Box sx={purchasesStyles.contentGrid}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
            }}
          >
            <Card sx={purchasesStyles.card}>
              <CardContent sx={purchasesStyles.cardContent}>
                <Box sx={purchasesStyles.sectionHeader}>
                  <Box sx={purchasesStyles.providerIcon}>1</Box>

                  <Box>
                    <Typography sx={purchasesStyles.sectionTitle}>
                      Datos de la compra
                    </Typography>

                    <Typography sx={purchasesStyles.sectionDescription}>
                      Seleccioná el proveedor y agregá una observación opcional.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={purchasesStyles.providerPanel}>
                  <Box sx={purchasesStyles.providerCard}>
                    <FormControl fullWidth>
                      <InputLabel id="provider-label">Proveedor *</InputLabel>

                      <Select
                        labelId="provider-label"
                        label="Proveedor *"
                        value={selectedProviderId}
                        onChange={(event) =>
                          setSelectedProviderId(event.target.value)
                        }
                      >
                        {activeProviders.map((provider) => (
                          <MenuItem
                            key={provider.id}
                            value={String(provider.id)}
                          >
                            {provider.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box sx={purchasesStyles.selectedProviderBox}>
                      <Box sx={purchasesStyles.providerIcon}>
                        <LocalShippingOutlinedIcon fontSize="small" />
                      </Box>

                      <Box>
                        <Typography sx={purchasesStyles.providerName}>
                          {selectedProvider?.nombre ||
                            "Sin proveedor seleccionado"}
                        </Typography>

                        <Typography sx={purchasesStyles.providerMeta}>
                          {selectedProvider
                            ? selectedProvider.email ||
                              selectedProvider.telefono ||
                              selectedProvider.contacto ||
                              "Proveedor activo"
                            : "Seleccioná un proveedor activo para continuar"}
                        </Typography>
                      </Box>

                      <Chip
                        label={selectedProvider ? "Activo" : "Pendiente"}
                        size="small"
                        sx={purchasesStyles.softChip}
                      />
                    </Box>
                  </Box>

                  <TextField
                    label="Observaciones"
                    value={observations}
                    onChange={(event) => setObservations(event.target.value)}
                    placeholder="Agregá una observación administrativa opcional"
                    multiline
                    minRows={4}
                    fullWidth
                  />
                </Box>
              </CardContent>
            </Card>

            <Card sx={purchasesStyles.card}>
              <CardContent sx={purchasesStyles.cardContent}>
                <Box sx={purchasesStyles.sectionHeader}>
                  <Box sx={purchasesStyles.providerIcon}>2</Box>

                  <Box>
                    <Typography sx={purchasesStyles.sectionTitle}>
                      Agregar semillas
                    </Typography>

                    <Typography sx={purchasesStyles.sectionDescription}>
                      Solo se muestran productos activos de tipo semilla.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={purchasesStyles.addItemGrid}>
                  <Box sx={{ minWidth: 0 }}>
                    <FormControl fullWidth>
                      <InputLabel id="seed-label">Semilla *</InputLabel>

                      <Select
                        labelId="seed-label"
                        label="Semilla *"
                        value={selectedProductId}
                        onChange={(event) =>
                          setSelectedProductId(event.target.value)
                        }
                      >
                        {activeSeedProducts.map((product) => (
                          <MenuItem key={product.id} value={String(product.id)}>
                            {product.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        mt: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: colors.text.secondary,
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        ¿No encontrás la semilla?
                      </Typography>

                      <Button
                        variant="text"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => setIsCreateSeedModalOpen(true)}
                        sx={{
                          minHeight: 28,
                          px: 0.5,
                          color: colors.brand.primary,
                          fontSize: 12,
                          fontWeight: 850,
                          textTransform: "none",
                        }}
                      >
                        Crear nueva semilla
                      </Button>
                    </Box>
                  </Box>

                  <TextField
                    label="Cantidad *"
                    type="number"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    slotProps={{
                      htmlInput: {
                        min: 1,
                      },
                    }}
                  />

                  <TextField
                    label="Precio unitario *"
                    type="number"
                    value={unitPrice}
                    onChange={(event) => setUnitPrice(event.target.value)}
                    slotProps={{
                      htmlInput: {
                        min: 1,
                      },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={!canAddItem}
                    onClick={handleAddItem}
                    sx={purchasesStyles.addItemButton}
                  >
                    Agregar
                  </Button>
                </Box>

                {selectedProduct && (
                  <Box sx={purchasesStyles.seedPreview}>
                    {selectedProduct.imagen_url ? (
                      <Box
                        component="img"
                        src={selectedProduct.imagen_url}
                        alt={selectedProduct.nombre}
                        sx={purchasesStyles.seedImage}
                      />
                    ) : (
                      <Box sx={purchasesStyles.seedFallback}>
                        {selectedProduct.nombre.charAt(0)}
                      </Box>
                    )}

                    <Box>
                      <Typography sx={purchasesStyles.detailProductName}>
                        {selectedProduct.nombre}
                      </Typography>

                      <Typography sx={purchasesStyles.detailProductMeta}>
                        Semilla {formatGenetics(selectedProduct.genetica)} ·
                        Precio venta actual{" "}
                        {formatCurrency(selectedProduct.precio_venta_actual)}
                      </Typography>

                      <Box sx={purchasesStyles.chipRow}>
                        <Chip
                          label="Semilla"
                          size="small"
                          sx={purchasesStyles.softChip}
                        />

                        <Chip
                          label={formatGenetics(selectedProduct.genetica)}
                          size="small"
                          sx={purchasesStyles.softChip}
                        />

                        <Chip
                          label={`Stock ${
                            selectedProduct.stock?.cantidad_disponible ?? 0
                          } unidades`}
                          size="small"
                          sx={purchasesStyles.softChip}
                        />

                        <Chip
                          label={selectedProduct.estado}
                          size="small"
                          sx={purchasesStyles.softChip}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card sx={purchasesStyles.card}>
              <CardContent sx={purchasesStyles.cardContent}>
                <Box sx={purchasesStyles.sectionHeader}>
                  <Box sx={purchasesStyles.providerIcon}>3</Box>

                  <Box>
                    <Typography sx={purchasesStyles.sectionTitle}>
                      Detalle de la compra
                    </Typography>

                    <Typography sx={purchasesStyles.sectionDescription}>
                      Revisá las semillas agregadas antes de confirmar la
                      operación.
                    </Typography>
                  </Box>
                </Box>

                {items.length === 0 ? (
                  <Box sx={purchasesStyles.emptyState}>
                    <Box sx={purchasesStyles.emptyIcon}>
                      <Inventory2OutlinedIcon fontSize="small" />
                    </Box>

                    <Typography sx={purchasesStyles.emptyTitle}>
                      Aún no agregaste semillas
                    </Typography>

                    <Typography sx={purchasesStyles.feedbackText}>
                      Seleccioná una semilla, indicá cantidad y precio unitario
                      para construir el detalle de la compra.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={purchasesStyles.detailsList}>
                    {items.map((item, index) => (
                      <Box
                        key={`${item.product.id}-${index}`}
                        sx={purchasesStyles.detailItem}
                      >
                        <Box>
                          <Typography sx={purchasesStyles.detailProductName}>
                            {item.product.nombre}
                          </Typography>

                          <Typography sx={purchasesStyles.detailProductMeta}>
                            Semilla · {formatGenetics(item.product.genetica)}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography sx={purchasesStyles.summaryLabel}>
                            Cantidad
                          </Typography>

                          <Typography sx={purchasesStyles.detailValue}>
                            {item.cantidad} unidades
                          </Typography>
                        </Box>

                        <Box>
                          <Typography sx={purchasesStyles.summaryLabel}>
                            Unitario
                          </Typography>

                          <Typography sx={purchasesStyles.detailValue}>
                            {formatCurrency(item.precio_unitario)}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography sx={purchasesStyles.summaryLabel}>
                            Subtotal
                          </Typography>

                          <Typography sx={purchasesStyles.detailValue}>
                            {formatCurrency(item.subtotal)}
                          </Typography>
                        </Box>

                        <IconButton
                          aria-label={`Eliminar ${item.product.nombre}`}
                          onClick={() => handleRemoveItem(index)}
                          sx={purchasesStyles.removeButton}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          <Card sx={[purchasesStyles.card, purchasesStyles.summaryCard]}>
            <CardContent sx={purchasesStyles.cardContent}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box>
                  <Typography sx={purchasesStyles.sectionTitle}>
                    Resumen de compra
                  </Typography>

                  <Typography sx={purchasesStyles.sectionDescription}>
                    Revisá el impacto antes de confirmar.
                  </Typography>
                </Box>

                <VerifiedOutlinedIcon fontSize="small" />
              </Box>

              <Box sx={purchasesStyles.summaryProviderCard}>
                <Box sx={purchasesStyles.summaryProviderIcon}>
                  <LocalShippingOutlinedIcon fontSize="small" />
                </Box>

                <Box>
                  <Typography sx={purchasesStyles.providerName}>
                    Proveedor
                  </Typography>

                  <Typography sx={purchasesStyles.providerMeta}>
                    {selectedProvider?.nombre || "Sin seleccionar"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={purchasesStyles.summaryTable}>
                <Box sx={purchasesStyles.summaryRow}>
                  <Typography sx={purchasesStyles.summaryLabel}>
                    Productos
                  </Typography>

                  <Typography sx={purchasesStyles.summaryValue}>
                    {items.length}
                  </Typography>
                </Box>

                <Box sx={purchasesStyles.summaryRow}>
                  <Typography sx={purchasesStyles.summaryLabel}>
                    Unidades totales
                  </Typography>

                  <Typography sx={purchasesStyles.summaryValue}>
                    {totalUnits}
                  </Typography>
                </Box>

                <Box sx={purchasesStyles.summaryRow}>
                  <Typography sx={purchasesStyles.summaryLabel}>
                    Subtotal
                  </Typography>

                  <Typography sx={purchasesStyles.summaryValue}>
                    {formatCurrency(total)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={purchasesStyles.totalRowLight}>
                <Typography sx={purchasesStyles.totalLabelLight}>
                  Total a pagar
                </Typography>

                <Typography sx={purchasesStyles.totalValueLight}>
                  {formatCurrency(total)}
                </Typography>
              </Box>

              <Box sx={purchasesStyles.confirmationBox}>
                <Box sx={purchasesStyles.confirmationHeader}>
                  <Box sx={purchasesStyles.confirmationIcon}>
                    <VerifiedOutlinedIcon fontSize="small" />
                  </Box>

                  <Typography sx={purchasesStyles.confirmationTitle}>
                    Al confirmar la compra:
                  </Typography>
                </Box>

                <Typography sx={purchasesStyles.confirmationItem}>
                  <CheckCircleIcon fontSize="small" />
                  Se incrementará el stock automáticamente
                </Typography>

                <Typography sx={purchasesStyles.confirmationItem}>
                  <CheckCircleIcon fontSize="small" />
                  Se registrarán los movimientos de inventario
                </Typography>

                <Typography sx={purchasesStyles.confirmationItem}>
                  <CheckCircleIcon fontSize="small" />
                  Se generará la trazabilidad completa
                </Typography>
              </Box>

              <Button
                variant="contained"
                disabled={!canSubmit}
                onClick={handleSubmit}
                endIcon={<VerifiedOutlinedIcon fontSize="small" />}
                sx={purchasesStyles.submitButton}
              >
                {submitting ? "Registrando compra..." : "Confirmar compra"}
              </Button>

              <Button
                variant="outlined"
                disabled={submitting}
                onClick={handleResetForm}
                endIcon={<DeleteIcon fontSize="small" />}
                sx={purchasesStyles.secondaryButton}
              >
                Limpiar formulario
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      <CreateSeedModal
        open={isCreateSeedModalOpen}
        creating={creatingSeed}
        onClose={() => setIsCreateSeedModalOpen(false)}
        onCreate={handleCreateSeed}
      />

      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert
          severity="success"
          onClose={() => setSuccessOpen(false)}
          sx={{ width: "100%" }}
        >
          Compra registrada correctamente. El stock fue actualizado.
        </Alert>
      </Snackbar>
    </Box>
  );
}
