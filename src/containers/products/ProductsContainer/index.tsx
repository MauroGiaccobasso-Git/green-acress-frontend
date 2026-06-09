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
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f7f5",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: "1px solid #dbe5dd",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              color="#1f3d2b"
              gutterBottom
            >
              Productos y stock
            </Typography>

            <Typography color="text.secondary">
              Gestioná los productos del inventario, consultá su disponibilidad
              y prepará futuras acciones de edición o cambio de estado.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 2,
              mb: 4,
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "#1f7a3a",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  bgcolor: "#17612e",
                },
              }}
            >
              Nuevo producto
            </Button>

            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por nombre, tipo, genética o estado"
            />
          </Box>

          {loading && <p>Cargando productos...</p>}

          {error && <p>{error}</p>}

          {!loading && !error && (
            <section>
              {products.length === 0 ? (
                <p>No hay productos registrados.</p>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                  }}
                >
                  {products.map((product) => (
                    <Card key={product.id}>
                      <CardContent>
                        <h2>{product.nombre}</h2>

                        <p>{product.descripcion}</p>

                        <p>Tipo: {product.tipo}</p>

                        <p>Genética: {product.genetica}</p>

                        <p>
                          THC:{" "}
                          {product.porcentaje_thc
                            ? `${product.porcentaje_thc}%`
                            : "No aplica"}
                        </p>

                        <p>Precio: ${product.precio_venta_actual}</p>

                        <p>
                          Disponible: {product.stock?.cantidad_disponible ?? 0}{" "}
                          {product.unidad_medida}
                        </p>

                        <p>Estado: {product.estado}</p>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </section>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
