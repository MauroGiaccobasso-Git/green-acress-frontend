"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
  Snackbar,
  TextField,
  Typography,
  type AlertColor,
} from "@mui/material";

import {
  type CreateProductPayload,
  type GetProductsParams,
  type Product,
  type UpdateProductPayload,
} from "@/api/productsApi";
import {
  type EditProductFormPayload,
  hasProductDataChanges,
  hasProductStatusChange,
  type ProductFormMode,
} from "@/features/products/utils/productForm";
import { useProducts } from "@/hooks/products/useProducts";
import { AppPagination } from "@/components/common/Pagination";
import {
  ProductFiltersModal,
  type ProductFilters,
} from "./ProductFiltersModal";
import ProductFormModal, {
  type ProductFormSubmitPayload,
} from "./ProductFormModal";
import { ProductCard } from "./ProductCard";
import { productsStyles } from "./products.styles";

type ProductFeedback = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

const PRODUCTS_PAGE_LIMIT = 10;

const initialFilters: ProductFilters = {
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
- administrar estado visual de búsqueda, filtros, paginación y modales;
- solicitar productos mediante useProducts;
- delegar creación, actualización y baja lógica de productos al hook;
- administrar feedback visual de operaciones;
- renderizar estados de carga, error y vacío;
- delegar la presentación individual de cada producto a ProductCard.

No realiza llamadas directas al backend.
No construye URLs.
No contiene reglas de negocio del dominio.
*/
export function ProductsContainer() {
  const {
    products,
    pagination,
    loading,
    submitting,
    updatingStatus,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    updateProductStatus,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

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

  /*
  Construye los parámetros funcionales que consume el hook.

  El buscador se utiliza solo para texto libre.
  Tipo, estado y genética se envían como filtros exactos al backend.
  */
  const productQueryParams = useMemo<GetProductsParams>(() => {
    const normalizedSearch = searchTerm.trim();

    return {
      search: normalizedSearch || undefined,
      tipo: filters.type !== "TODOS" ? filters.type : undefined,
      estado: filters.status !== "TODOS" ? filters.status : undefined,
      genetica: filters.genetics !== "TODOS" ? filters.genetics : undefined,
      page: currentPage,
      limit: PRODUCTS_PAGE_LIMIT,
    };
  }, [searchTerm, filters, currentPage]);

  /*
  Carga productos desde backend aplicando debounce.

  Esto evita solicitudes excesivas mientras el administrador escribe
  y mantiene búsqueda, filtros y paginación en una única fuente de verdad.
  */
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchProducts(productQueryParams);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchProducts, productQueryParams]);

  const activeFilterCount = [
    filters.type !== "TODOS",
    filters.status !== "TODOS",
    filters.genetics !== "TODOS",
  ].filter(Boolean).length;

  const hasActiveSearch = searchTerm.trim().length > 0;
  const hasActiveFilters = activeFilterCount > 0;
  const hasActiveQuery = hasActiveSearch || hasActiveFilters;

  const hasProducts = products.length > 0;
  const totalProducts = pagination.total;

  const firstVisibleProduct =
    totalProducts === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;

  const lastVisibleProduct = Math.min(
    pagination.page * pagination.limit,
    totalProducts,
  );

  const activeFilterChips = [
    {
      key: "type",
      visible: filters.type !== "TODOS",
      label: formatLabel(filters.type),
      onDelete: () => {
        setCurrentPage(1);
        setFilters((currentFilters) => ({
          ...currentFilters,
          type: "TODOS",
        }));
      },
    },
    {
      key: "status",
      visible: filters.status !== "TODOS",
      label: formatLabel(filters.status),
      onDelete: () => {
        setCurrentPage(1);
        setFilters((currentFilters) => ({
          ...currentFilters,
          status: "TODOS",
        }));
      },
    },
    {
      key: "genetics",
      visible: filters.genetics !== "TODOS",
      label: formatLabel(filters.genetics),
      onDelete: () => {
        setCurrentPage(1);
        setFilters((currentFilters) => ({
          ...currentFilters,
          genetics: "TODOS",
        }));
      },
    },
  ].filter((chip) => chip.visible);

  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    setSearchTerm(value);
  };

  const handleChangeFilters = useCallback((nextFilters: ProductFilters) => {
    setCurrentPage(1);
    setFilters(nextFilters);
  }, []);

  const handleOpenFilterPopover = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilterPopover = () => {
    setFilterAnchorEl(null);
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
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
  Recibe el contrato construido por el modal
  y delega la creación o actualización al hook
  según el modo activo del formulario.

  La imagen se mantiene separada del payload
  de negocio y se entrega al hook como archivo
  opcional para que productsApi construya FormData.

  En edición se separan:

  - los datos generales mediante PUT;
  - el estado lógico mediante PATCH.

  Esto respeta los endpoints reales del backend.
  */
  const handleSubmitProductForm = async ({
    payload,
    imageFile,
  }: ProductFormSubmitPayload) => {
    if (productFormMode === "create") {
      const createdProduct = await createProduct(
        payload as CreateProductPayload,
        imageFile,
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

    const editPayload = payload as EditProductFormPayload;

    const productDataPayload: UpdateProductPayload = {
      nombre: editPayload.nombre,
      descripcion: editPayload.descripcion,
      genetica: editPayload.genetica,
      porcentaje_thc: editPayload.porcentaje_thc,
      precio_venta_actual: editPayload.precio_venta_actual,
    };

    const hasDataChanges = hasProductDataChanges(
      selectedProduct,
      productDataPayload,
      imageFile,
    );

    const hasStatusChange = hasProductStatusChange(
      selectedProduct,
      editPayload.estado,
    );

    if (!hasDataChanges && !hasStatusChange) {
      handleCloseProductModal();

      setFeedback({
        open: true,
        severity: "info",
        message: "No se detectaron cambios para guardar.",
      });

      return;
    }

    /*
    Los datos generales se actualizan primero.

    Cuando incluyen una imagen nueva, el backend se encarga de:

    - subirla a S3;
    - compensarla si PostgreSQL falla;
    - eliminar la imagen anterior después del reemplazo exitoso.
    */
    if (hasDataChanges) {
      const updatedProduct = await updateProduct(
        selectedProduct.id,
        productDataPayload,
        imageFile,
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
        /*
        Si los datos generales ya fueron guardados, se cierra el
        formulario para evitar reenviar una imagen que ya se subió.

        La advertencia informa claramente que solo quedó pendiente
        el cambio de estado.
        */
        if (hasDataChanges) {
          handleCloseProductModal();

          setFeedback({
            open: true,
            severity: "warning",
            message:
              "Los datos del producto se guardaron, pero no fue posible actualizar su estado.",
          });

          return;
        }

        setFeedback({
          open: true,
          severity: "error",
          message:
            "No se pudo actualizar el estado del producto. Intentá nuevamente.",
        });

        return;
      }
    }

    handleCloseProductModal();

    const successMessage =
      hasDataChanges && hasStatusChange
        ? "Producto y estado actualizados correctamente."
        : hasStatusChange
          ? "Estado del producto actualizado correctamente."
          : "Producto actualizado correctamente.";

    setFeedback({
      open: true,
      severity: "success",
      message: successMessage,
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
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Buscar por nombre o descripción..."
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
                  {totalProducts} productos encontrados
                </Typography>

                {totalProducts > 0 && (
                  <Typography
                    variant="caption"
                    sx={productsStyles.feedbackText}
                  >
                    Mostrando {firstVisibleProduct}-{lastVisibleProduct}
                  </Typography>
                )}
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

            {hasActiveQuery && (
              <Box sx={productsStyles.activeFiltersBar}>
                <Box sx={productsStyles.activeFiltersList}>
                  {hasActiveSearch && (
                    <Chip
                      label={`Búsqueda: ${searchTerm.trim()}`}
                      onDelete={() => handleSearchChange("")}
                      sx={productsStyles.activeFilterSummaryChip}
                    />
                  )}

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
              {!hasProducts && !hasActiveQuery && (
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

              {!hasProducts && hasActiveQuery && (
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

              {hasProducts && (
                <>
                  <Box sx={productsStyles.productGrid}>
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={handleOpenEditModal}
                      />
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      pt: 3,
                      pb: 1.5,
                    }}
                  >
                    <AppPagination
                      page={pagination.page}
                      totalPages={pagination.totalPages}
                      onChange={setCurrentPage}
                    />
                  </Box>
                </>
              )}
            </Box>
          )}
        </Paper>
      </Container>

      <ProductFiltersModal
        open={filterPopoverOpen}
        anchorEl={filterAnchorEl}
        filters={filters}
        onClose={handleCloseFilterPopover}
        onClearFilters={handleClearFilters}
        onChangeFilters={handleChangeFilters}
        formatLabel={formatLabel}
      />

      <ProductFormModal
        open={productModalOpen}
        mode={productFormMode}
        product={selectedProduct}
        loading={submitting || updatingStatus}
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