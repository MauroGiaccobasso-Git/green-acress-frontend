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

import { Product, UpdateProductPayload } from "@/api/productsApi";
import { useProducts } from "@/hooks/products/useProducts";

import ProductFormModal from "./ProductFormModal";
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
- administrar apertura y cierre del modal de edición;
- delegar actualización de productos al hook;
- administrar feedback visual de operaciones;
- renderizar estados de carga, error y vacío;
- delegar la presentación individual de cada producto a ProductCard.

No realiza llamadas directas al backend.
No contiene reglas de negocio del dominio.
*/
export function ProductsContainer() {
  const { products, loading, error, fetchProducts, updateProduct } =
    useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductFilter>(initialFilters);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null,
  );

  const filterPopoverOpen = Boolean(filterAnchorEl);

  /*
  Producto seleccionado para edición.

  Se mantiene en el container porque
  representa estado de pantalla, no
  responsabilidad del ProductCard.
  */
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /*
  Feedback visual de operaciones.

  Se administra en el container porque
  responde al resultado de acciones del
  módulo, no a la presentación interna
  del modal.
  */
  const [feedback, setFeedback] = useState<ProductFeedback>({
    open: false,
    message: "",
    severity: "success",
  });

  // Carga inicial del listado al montar la pantalla.
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /*
  Aplica búsqueda y filtros locales sobre los productos cargados.

  Esta decisión mantiene una experiencia rápida para el MVP,
  evitando llamadas innecesarias al backend mientras el volumen
  de productos es reducido.
  */
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

  /*
  Chips visibles únicamente cuando existen filtros activos.

  No funcionan como entrada principal de filtrado,
  sino como resumen editable de la selección aplicada.
  */
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

  /*
  Abre el modal de edición con el
  producto seleccionado desde la card.
  */
  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
  };

  /*
  Cierra el modal y limpia el producto
  seleccionado para evitar arrastrar
  estado entre ediciones.
  */
  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  /*
  Cierra el feedback visual.

  El estado se conserva mínimamente para
  evitar parpadeos innecesarios mientras
  el Snackbar finaliza su animación.
  */
  const handleCloseFeedback = () => {
    setFeedback((currentFeedback) => ({
      ...currentFeedback,
      open: false,
    }));
  };

  /*
  Recibe el payload construido por el modal
  y delega la actualización al hook.

  Si la operación fue exitosa, se cierra
  el modal y se muestra confirmación.
  Si falla, se informa el error sin cerrar
  el formulario para permitir corrección.
  */
  const handleSubmitProductForm = async (
    productId: number,
    payload: UpdateProductPayload,
  ) => {
    const updatedProduct = await updateProduct(productId, payload);

    if (updatedProduct) {
      handleCloseProductModal();

      setFeedback({
        open: true,
        severity: "success",
        message: "Producto actualizado correctamente.",
      });

      return;
    }

    setFeedback({
      open: true,
      severity: "error",
      message: "No se pudo actualizar el producto. Revisá los datos e intentá nuevamente.",
    });
  };

  return (
    <Box component="main" sx={productsStyles.page}>
      <Container maxWidth={false} disableGutters>
        <Paper elevation={0} sx={productsStyles.panel}>
          <Box sx={productsStyles.header}>
            <Box sx={productsStyles.headerContent}>
              <Typography variant="h4" sx={productsStyles.title}>
                Productos
              </Typography>

              <Typography variant="body1" sx={productsStyles.subtitle}>
                Gestioná el catálogo de productos del club
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              sx={productsStyles.createButton}
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
        open={Boolean(selectedProduct)}
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