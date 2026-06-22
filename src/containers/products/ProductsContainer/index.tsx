"use client";

import { useEffect, useMemo, useState } from "react";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  Paper,
  Popover,
  Snackbar,
  TextField,
  Typography,
  type AlertColor,
} from "@mui/material";

import {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "@/api/productsApi";
import { useProducts } from "@/hooks/products/useProducts";

import ProductFormModal, { ProductFormSubmitPayload } from "./ProductFormModal";
import { ProductCard } from "./ProductCard";
import { productsStyles } from "./products.styles";

type ProductFilter = {
  type: string;
  status: string;
  genetics: string;
};

type ProductFeedback = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

type ProductFormMode = "create" | "edit";

type EditProductPayloadWithStatus = UpdateProductPayload & {
  estado: Product["estado"];
};

const initialFilters: ProductFilter = {
  type: "TODOS",
  status: "TODOS",
  genetics: "TODOS",
};

const filterLabels: Record<string, string> = {
  TODOS: "Todos",
  FLOR: "Flores",
  SEMILLA: "Semillas",
  ACTIVO: "Activos",
  INACTIVO: "Inactivos",
  INDICA: "Índica",
  SATIVA: "Sativa",
  HIBRIDA: "Híbrida",
};

// Normaliza textos técnicos recibidos desde backend para mostrarlos de forma clara.
const formatLabel = (value?: string | null) => {
  if (!value) {
    return "No definido";
  }

  return filterLabels[value] ?? value.toLowerCase().replace("_", " ");
};

/*
Container principal del módulo administrativo de productos.

Responsabilidades:
- cargar productos desde useProducts;
- administrar búsqueda y filtros de interfaz;
- administrar apertura y cierre del modal de alta/edición;
- delegar creación, actualización y baja lógica de productos al hook;
- administrar feedback visual de operaciones;
- renderizar estados de carga, error y vacío;
- delegar la presentación individual de cada producto a ProductCard.

No realiza llamadas directas al backend.
No contiene reglas de negocio del dominio.
*/
export function ProductsContainer() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    updateProductStatus,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductFilter>(initialFilters);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null,
  );

  const filterPopoverOpen = Boolean(filterAnchorEl);

  const [productFormMode, setProductFormMode] =
    useState<ProductFormMode>("create");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [productModalOpen, setProductModalOpen] = useState(false);

  const [feedback, setFeedback] = useState<ProductFeedback>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const searchableValues = [
        product.nombre,
        product.descripcion,
        product.tipo,
        product.genetica,
        product.estado,
      ];

      const matchesSearch =
        !normalizedSearch ||
        searchableValues.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedSearch),
        );

      const matchesType =
        filters.type === "TODOS" || product.tipo === filters.type;

      const matchesStatus =
        filters.status === "TODOS" || product.estado === filters.status;

      const matchesGenetics =
        filters.genetics === "TODOS" || product.genetica === filters.genetics;

      return matchesSearch && matchesType && matchesStatus && matchesGenetics;
    });
  }, [products, searchTerm, filters]);

  const hasProducts = products.length > 0;
  const hasSearchResults = filteredProducts.length > 0;

  const activeFilterCount = [
    filters.type !== "TODOS",
    filters.status !== "TODOS",
    filters.genetics !== "TODOS",
  ].filter(Boolean).length;

  const activeFilterChips = [
    {
      key: "type",
      visible: filters.type !== "TODOS",
      label: formatLabel(filters.type),
      onDelete: () =>
        setFilters((currentFilters) => ({
          ...currentFilters,
          type: "TODOS",
        })),
    },
    {
      key: "status",
      visible: filters.status !== "TODOS",
      label: formatLabel(filters.status),
      onDelete: () =>
        setFilters((currentFilters) => ({
          ...currentFilters,
          status: "TODOS",
        })),
    },
    {
      key: "genetics",
      visible: filters.genetics !== "TODOS",
      label: formatLabel(filters.genetics),
      onDelete: () =>
        setFilters((currentFilters) => ({
          ...currentFilters,
          genetics: "TODOS",
        })),
    },
  ].filter((chip) => chip.visible);

  const handleOpenFilterPopover = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilterPopover = () => {
    setFilterAnchorEl(null);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
  };

  const handleOpenCreateModal = () => {
    setProductFormMode("create");
    setSelectedProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setProductFormMode("edit");
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseFeedback = () => {
    setFeedback((currentFeedback) => ({
      ...currentFeedback,
      open: false,
    }));
  };

  /*
  Recibe el payload construido por el modal
  y delega la creación o actualización al hook
  según el modo activo del formulario.

  En edición se separa la actualización
  de datos generales del cambio de estado
  lógico, porque el backend expone endpoints
  distintos para cada responsabilidad.
  */
  const handleSubmitProductForm = async (payload: ProductFormSubmitPayload) => {
    if (productFormMode === "create") {
      const createdProduct = await createProduct(
        payload as CreateProductPayload,
      );

      if (createdProduct) {
        handleCloseProductModal();

        setFeedback({
          open: true,
          severity: "success",
          message: "Producto registrado correctamente.",
        });

        return;
      }

      setFeedback({
        open: true,
        severity: "error",
        message:
          "No se pudo registrar el producto. Revisá los datos e intentá nuevamente.",
      });

      return;
    }

    if (!selectedProduct) {
      setFeedback({
        open: true,
        severity: "error",
        message: "No se encontró el producto seleccionado para editar.",
      });

      return;
    }

    const editPayload = payload as EditProductPayloadWithStatus;

    const productDataPayload: UpdateProductPayload = {
      nombre: editPayload.nombre,
      descripcion: editPayload.descripcion,
      imagen_url: editPayload.imagen_url,
      genetica: editPayload.genetica,
      porcentaje_thc: editPayload.porcentaje_thc,
      precio_venta_actual: editPayload.precio_venta_actual,
    };

    const hasDataChanges =
      productDataPayload.nombre !== selectedProduct.nombre ||
      (productDataPayload.descripcion ?? null) !==
        (selectedProduct.descripcion ?? null) ||
      (productDataPayload.imagen_url ?? null) !==
        (selectedProduct.imagen_url ?? null) ||
      productDataPayload.genetica !== selectedProduct.genetica ||
      productDataPayload.porcentaje_thc !== selectedProduct.porcentaje_thc ||
      productDataPayload.precio_venta_actual !==
        selectedProduct.precio_venta_actual;

    const hasStatusChange = editPayload.estado !== selectedProduct.estado;

    if (!hasDataChanges && !hasStatusChange) {
      handleCloseProductModal();

      setFeedback({
        open: true,
        severity: "info",
        message: "No se detectaron cambios para guardar.",
      });

      return;
    }

    if (hasDataChanges) {
      const updatedProduct = await updateProduct(
        selectedProduct.id,
        productDataPayload,
      );

      if (!updatedProduct) {
        setFeedback({
          open: true,
          severity: "error",
          message:
            "No se pudo actualizar el producto. Revisá los datos e intentá nuevamente.",
        });

        return;
      }
    }

    if (hasStatusChange) {
      const updatedProductStatus = await updateProductStatus(
        selectedProduct.id,
        {
          estado: editPayload.estado,
        },
      );

      if (!updatedProductStatus) {
        setFeedback({
          open: true,
          severity: "error",
          message:
            "No se pudo actualizar el estado del producto. Revisá los datos e intentá nuevamente.",
        });

        return;
      }
    }

    handleCloseProductModal();

    setFeedback({
      open: true,
      severity: "success",
      message: hasStatusChange
        ? "Estado del producto actualizado correctamente."
        : "Producto actualizado correctamente.",
    });
  };

  return (
    <Box component="main" sx={productsStyles.page}>
      <Container maxWidth={false} disableGutters>
        <Paper elevation={0} sx={productsStyles.panel}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              sx={productsStyles.createButton}
              onClick={handleOpenCreateModal}
            >
              Nuevo producto
            </Button>
          </Box>

          <Box sx={productsStyles.toolbar}>
            <Box sx={productsStyles.searchRow}>
              <TextField
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nombre, tipo, genética o estado..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                variant="outlined"
                startIcon={<FilterListRoundedIcon />}
                sx={
                  activeFilterCount > 0
                    ? [
                        productsStyles.filterButton,
                        productsStyles.filterButtonActive,
                      ]
                    : productsStyles.filterButton
                }
                onClick={handleOpenFilterPopover}
                aria-haspopup="dialog"
                aria-expanded={filterPopoverOpen ? "true" : undefined}
              >
                {activeFilterCount > 0
                  ? `Filtros (${activeFilterCount})`
                  : "Filtros"}
              </Button>
            </Box>

            <Box sx={productsStyles.resultsHeader}>
              <Box sx={productsStyles.summaryCard}>
                <Typography variant="body2" sx={productsStyles.summaryLabel}>
                  {filteredProducts.length} productos encontrados
                </Typography>
              </Box>

              <Box sx={productsStyles.viewToggleGroup} aria-hidden="true">
                <Box sx={productsStyles.activeViewToggle}>
                  <GridViewRoundedIcon fontSize="small" />
                </Box>

                <Box sx={productsStyles.viewToggle}>
                  <ViewListRoundedIcon fontSize="small" />
                </Box>
              </Box>
            </Box>

            {activeFilterCount > 0 && (
              <Box sx={productsStyles.activeFiltersBar}>
                <Box sx={productsStyles.activeFiltersList}>
                  {activeFilterChips.map((chip) => (
                    <Chip
                      key={chip.key}
                      label={chip.label}
                      onDelete={chip.onDelete}
                      sx={productsStyles.activeFilterSummaryChip}
                    />
                  ))}
                </Box>

                <Button
                  sx={productsStyles.activeFiltersClearButton}
                  onClick={handleClearFilters}
                >
                  Limpiar todo
                </Button>
              </Box>
            )}
          </Box>

          {loading && (
            <Box sx={productsStyles.loadingState}>
              <CircularProgress size={28} />

              <Typography variant="body2" sx={productsStyles.feedbackText}>
                Cargando productos...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={productsStyles.alert}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <Box component="section">
              {!hasProducts && (
                <Box sx={productsStyles.emptyState}>
                  <Typography variant="h6" sx={productsStyles.emptyTitle}>
                    Todavía no hay productos registrados
                  </Typography>

                  <Typography variant="body2" sx={productsStyles.feedbackText}>
                    Cuando registres productos, se mostrarán junto con su stock,
                    estado e imagen asociada.
                  </Typography>
                </Box>
              )}

              {hasProducts && !hasSearchResults && (
                <Box sx={productsStyles.emptyState}>
                  <Typography variant="h6" sx={productsStyles.emptyTitle}>
                    No se encontraron resultados
                  </Typography>

                  <Typography variant="body2" sx={productsStyles.feedbackText}>
                    Probá ajustar la búsqueda o limpiar los filtros aplicados.
                  </Typography>

                  <Button
                    sx={productsStyles.clearFiltersButton}
                    onClick={handleClearFilters}
                  >
                    Limpiar filtros
                  </Button>
                </Box>
              )}

              {hasSearchResults && (
                <Box sx={productsStyles.productGrid}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleOpenEditModal}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>

      <Popover
        open={filterPopoverOpen}
        anchorEl={filterAnchorEl}
        onClose={handleCloseFilterPopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: productsStyles.filterPopoverPaper,
          },
        }}
      >
        <Box sx={productsStyles.filterPopoverContent}>
          <Box sx={productsStyles.filterPopoverHeader}>
            <Typography variant="h6" sx={productsStyles.filterDialogTitle}>
              Filtros de productos
            </Typography>
          </Box>

          <Box sx={productsStyles.filterSection}>
            <Box sx={productsStyles.filterSectionHeader}>
              <Typography variant="subtitle2" sx={productsStyles.filterTitle}>
                Tipo de producto
              </Typography>

              <Typography
                variant="caption"
                sx={productsStyles.filterSectionHelp}
              >
                Filtrar por tipo de producto.
              </Typography>
            </Box>

            <Box sx={productsStyles.modalChipGroup}>
              {["TODOS", "FLOR", "SEMILLA"].map((type) => (
                <Chip
                  key={type}
                  label={formatLabel(type)}
                  onClick={() =>
                    setFilters((currentFilters) => ({
                      ...currentFilters,
                      type,
                    }))
                  }
                  sx={
                    filters.type === type
                      ? productsStyles.activeFilterChip
                      : productsStyles.filterChip
                  }
                />
              ))}
            </Box>
          </Box>

          <Box sx={productsStyles.filterSection}>
            <Box sx={productsStyles.filterSectionHeader}>
              <Typography variant="subtitle2" sx={productsStyles.filterTitle}>
                Estado
              </Typography>

              <Typography
                variant="caption"
                sx={productsStyles.filterSectionHelp}
              >
                Filtrar por estado del producto.
              </Typography>
            </Box>

            <Box sx={productsStyles.modalChipGroup}>
              {["TODOS", "ACTIVO", "INACTIVO"].map((status) => (
                <Chip
                  key={status}
                  label={formatLabel(status)}
                  onClick={() =>
                    setFilters((currentFilters) => ({
                      ...currentFilters,
                      status,
                    }))
                  }
                  sx={
                    filters.status === status
                      ? productsStyles.activeFilterChip
                      : productsStyles.filterChip
                  }
                />
              ))}
            </Box>
          </Box>

          <Box sx={productsStyles.filterSection}>
            <Box sx={productsStyles.filterSectionHeader}>
              <Typography variant="subtitle2" sx={productsStyles.filterTitle}>
                Genética
              </Typography>

              <Typography
                variant="caption"
                sx={productsStyles.filterSectionHelp}
              >
                Filtrar por genética del producto.
              </Typography>
            </Box>

            <Box sx={productsStyles.modalChipGroup}>
              {["TODOS", "INDICA", "SATIVA", "HIBRIDA"].map((genetics) => (
                <Chip
                  key={genetics}
                  label={formatLabel(genetics)}
                  onClick={() =>
                    setFilters((currentFilters) => ({
                      ...currentFilters,
                      genetics,
                    }))
                  }
                  sx={
                    filters.genetics === genetics
                      ? productsStyles.activeFilterChip
                      : productsStyles.filterChip
                  }
                />
              ))}
            </Box>
          </Box>

          <Box sx={productsStyles.filterFooter}>
            <Button
              sx={productsStyles.filterClearButton}
              onClick={handleClearFilters}
            >
              Limpiar
            </Button>

            <Button
              variant="contained"
              sx={productsStyles.filterApplyButton}
              onClick={handleCloseFilterPopover}
            >
              Aplicar
            </Button>
          </Box>
        </Box>
      </Popover>

      <ProductFormModal
        open={productModalOpen}
        mode={productFormMode}
        product={selectedProduct}
        loading={loading}
        onClose={handleCloseProductModal}
        onSubmit={handleSubmitProductForm}
      />

      <Snackbar
        open={feedback.open}
        autoHideDuration={3500}
        onClose={handleCloseFeedback}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseFeedback}
          severity={feedback.severity}
          variant="filled"
          sx={productsStyles.productFeedbackAlert}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
