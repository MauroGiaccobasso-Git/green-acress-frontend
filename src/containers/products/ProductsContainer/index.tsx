"use client";

import { useEffect } from "react";

/*
Componentes Material UI utilizados
para construir la interfaz visual
de la pantalla administrativa
de productos.

Container:
- centra el contenido horizontalmente
- limita el ancho máximo
- ayuda a mantener una interfaz ordenada

Paper:
- genera superficies o paneles visuales
- permite agrupar información relacionada
- aporta una apariencia más profesional

Box:
- componente genérico utilizado para layout
- facilita espaciados, alineaciones y distribución
- suele reemplazar div cuando se utiliza MUI

Typography:
- representa títulos y textos
- mantiene consistencia visual
- evita utilizar etiquetas HTML sueltas

Button:
- representa acciones ejecutables
- en esta pantalla se utilizará para
  "Nuevo producto"

TextField:
- campo de entrada estilizado de Material UI
- será utilizado inicialmente para búsqueda
- podrá reutilizarse luego en formularios

Card:
- contenedor visual para mostrar información
  individual de cada producto
- facilita la lectura y separación de datos

CardContent:
- área interna de una Card donde se ubica
  el contenido principal de la tarjeta
*/
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useProducts } from "@/hooks/products/useProducts";

import { productsStyles } from "./products.styles";

/*
Container principal de la pantalla
administrativa de productos.

Responsabilidades:

- construir la interfaz visual
- disparar la carga inicial
  de productos
- consumir useProducts
- renderizar estados de carga,
  error y datos

NO realiza fetch directo.

NO conoce detalles del backend.
*/
export function ProductsContainer() {
  const { products, loading, error, fetchProducts } = useProducts();

  /*
  Ejecuta la carga inicial
  de productos cuando la
  pantalla se monta.
  */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /*
  Estructura general de la pantalla.

  Box:
  actúa como fondo principal
  de toda la vista.

  Container:
  centra el contenido y limita
  el ancho máximo.

  Paper:
  agrupa visualmente el módulo
  de productos dentro de un panel.
  */
  return (
    <Box component="main" sx={productsStyles.page}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={productsStyles.panel}>
          <Box sx={productsStyles.header}>
            <Typography variant="h4" sx={productsStyles.title} gutterBottom>
              Productos y stock
            </Typography>

            <Typography variant="body1" sx={productsStyles.subtitle}>
              Gestioná los productos del inventario, consultá su disponibilidad
              y prepará futuras acciones de edición o cambio de estado.
            </Typography>
          </Box>

          <Box sx={productsStyles.actions}>
            <Button variant="contained" sx={productsStyles.createButton}>
              Nuevo producto
            </Button>

            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nombre, tipo, genética o estado"
            />
          </Box>

          {loading && (
            <Typography variant="body2" sx={productsStyles.feedbackText}>
              Cargando productos...
            </Typography>
          )}

          {error && (
            <Typography variant="body2" sx={productsStyles.errorText}>
              {error}
            </Typography>
          )}

          {!loading && !error && (
            <Box component="section">
              {products.length === 0 ? (
                <Typography variant="body2" sx={productsStyles.feedbackText}>
                  No hay productos registrados.
                </Typography>
              ) : (
                <Box sx={productsStyles.list}>
                  {products.map((product) => (
                    <Card key={product.id} sx={productsStyles.card}>
                      <CardContent>
                        <Typography variant="h6" sx={productsStyles.cardTitle}>
                          {product.nombre}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={productsStyles.cardDescription}
                        >
                          {product.descripcion}
                        </Typography>

                        <Typography variant="body2">
                          Tipo: {product.tipo}
                        </Typography>

                        <Typography variant="body2">
                          Genética: {product.genetica}
                        </Typography>

                        <Typography variant="body2">
                          THC:{" "}
                          {product.porcentaje_thc
                            ? `${product.porcentaje_thc}%`
                            : "No aplica"}
                        </Typography>

                        <Typography variant="body2">
                          Precio: ${product.precio_venta_actual}
                        </Typography>

                        <Typography variant="body2">
                          Disponible: {product.stock?.cantidad_disponible ?? 0}{" "}
                          {product.unidad_medida}
                        </Typography>

                        <Typography variant="body2">
                          Estado: {product.estado}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}