"use client";

import { useEffect, useMemo, useState } from "react";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useProducts } from "@/hooks/products/useProducts";

import { ProductCard } from "./ProductCard";
import { productsStyles } from "./products.styles";

type ProductFilter = {
  type: string;
  status: string;
  genetics: string;
};

const initialFilters: ProductFilter = {
  type: "TODOS",
  status: "TODOS",
  genetics: "TODOS",
};

// Normaliza textos técnicos recibidos desde backend para mostrarlos de forma clara.
const formatLabel = (value?: string | null) => {
  if (!value) {
    return "No definido";
  }

  return value.toLowerCase().replace("_", " ");
};

/*
Container principal del módulo administrativo de productos.

Responsabilidades:
- cargar productos desde useProducts;
- administrar búsqueda y filtros de interfaz;
- renderizar estados de carga, error y vacío;
- delegar la presentación individual de cada producto a ProductCard.

No realiza llamadas directas al backend.
No contiene reglas de negocio del dominio.
*/
export function ProductsContainer() {
  const { products, loading, error, fetchProducts } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductFilter>(initialFilters);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Carga inicial del listado al montar la pantalla.
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /*
  Calcula cantidades visibles por filtro rápido.

  Se usa para mostrar chips informativos como:
  Todos, Flores, Semillas, Activos e Inactivos.
  */
  const getFilteredCount = (filter: ProductFilter) => {
    return products.filter((product) => {
      const matchesType =
        filter.type === "TODOS" || product.tipo === filter.type;

      const matchesStatus =
        filter.status === "TODOS" || product.estado === filter.status;

      const matchesGenetics =
        filter.genetics === "TODOS" || product.genetica === filter.genetics;

      return matchesType && matchesStatus && matchesGenetics;
    }).length;
  };

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

  const handleTypeQuickFilter = (type: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      type,
    }));
  };

  const handleStatusQuickFilter = (status: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      status,
    }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
  };

  return (
    <Box component="main" sx={productsStyles.page}>
      <Container maxWidth="xl">
        <Paper elevation={0} sx={productsStyles.panel}>
          <Box sx={productsStyles.header}>
            <Box sx={productsStyles.headerContent}>
              <Typography variant="overline" sx={productsStyles.eyebrow}>
                Inventario
              </Typography>

              <Typography variant="h4" sx={productsStyles.title}>
                Productos y stock
              </Typography>

              <Typography variant="body1" sx={productsStyles.subtitle}>
                Gestioná el catálogo del club, visualizá disponibilidad real y
                controlá el estado operativo del inventario.
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
                placeholder="Buscar por nombre, genética, tipo o estado"
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
                sx={productsStyles.filterButton}
                onClick={() => setFilterModalOpen(true)}
              >
                Filtros
              </Button>
            </Box>

            <Box sx={productsStyles.quickFilters}>
              <Chip
                label={`Todos (${products.length})`}
                onClick={() => setFilters(initialFilters)}
                sx={
                  filters.type === "TODOS" &&
                  filters.status === "TODOS" &&
                  filters.genetics === "TODOS"
                    ? productsStyles.activeFilterChip
                    : productsStyles.filterChip
                }
              />

              <Chip
                label={`Flores (${getFilteredCount({
                  ...filters,
                  type: "FLOR",
                })})`}
                onClick={() => handleTypeQuickFilter("FLOR")}
                sx={
                  filters.type === "FLOR"
                    ? productsStyles.activeFilterChip
                    : productsStyles.filterChip
                }
              />

              <Chip
                label={`Semillas (${getFilteredCount({
                  ...filters,
                  type: "SEMILLA",
                })})`}
                onClick={() => handleTypeQuickFilter("SEMILLA")}
                sx={
                  filters.type === "SEMILLA"
                    ? productsStyles.activeFilterChip
                    : productsStyles.filterChip
                }
              />

              <Chip
                label={`Activos (${getFilteredCount({
                  ...filters,
                  status: "ACTIVO",
                })})`}
                onClick={() => handleStatusQuickFilter("ACTIVO")}
                sx={
                  filters.status === "ACTIVO"
                    ? productsStyles.activeFilterChip
                    : productsStyles.filterChip
                }
              />

              <Chip
                label={`Inactivos (${getFilteredCount({
                  ...filters,
                  status: "INACTIVO",
                })})`}
                onClick={() => handleStatusQuickFilter("INACTIVO")}
                sx={
                  filters.status === "INACTIVO"
                    ? productsStyles.activeFilterChip
                    : productsStyles.filterChip
                }
              />
            </Box>
          </Box>

          <Box sx={productsStyles.summaryCard}>
            <Typography variant="caption" sx={productsStyles.summaryLabel}>
              Productos visibles
            </Typography>

            <Typography variant="h6" sx={productsStyles.summaryValue}>
              {filteredProducts.length}
            </Typography>
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
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>

      <Dialog
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: productsStyles.filterDialog,
          },
        }}
      >
        <DialogTitle sx={productsStyles.filterDialogTitle}>
          Filtros de productos
        </DialogTitle>

        <DialogContent sx={productsStyles.filterModalContent}>
          <Box>
            <Typography variant="subtitle2" sx={productsStyles.filterTitle}>
              Tipo de producto
            </Typography>

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

          <Box>
            <Typography variant="subtitle2" sx={productsStyles.filterTitle}>
              Estado
            </Typography>

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

          <Box>
            <Typography variant="subtitle2" sx={productsStyles.filterTitle}>
              Genética
            </Typography>

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
        </DialogContent>

        <DialogActions sx={productsStyles.filterDialogActions}>
          <Button onClick={handleClearFilters}>Limpiar</Button>

          <Button variant="contained" onClick={() => setFilterModalOpen(false)}>
            Aplicar filtros
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
