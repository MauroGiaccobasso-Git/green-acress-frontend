"use client";

import { useEffect } from "react";

import { useProducts } from "@/hooks/products/useProducts";

/*
Main container for the administrative
products screen.

Responsibilities:

- build the screen UI
- trigger initial product loading
- consume useProducts
- render loading, error and data states

It does not perform direct fetch calls.

It does not know backend details.
*/
export function ProductsContainer() {
  const {
    products,
    loading,
    error,
    fetchProducts,
  } = useProducts();

  /*
  Initial product loading when
  the screen is mounted.
  */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main>
      <section>
        <h1>Productos y stock</h1>

        <p>
          Gestioná los productos del inventario,
          consultá su disponibilidad y prepará
          futuras acciones de edición o cambio
          de estado.
        </p>
      </section>

      <section>
        <button type="button">
          Nuevo producto
        </button>

        <input
          type="text"
          placeholder="Buscar por nombre, tipo, genética o estado"
        />
      </section>

      {loading && (
        <p>Cargando productos...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading && !error && (
        <section>
          {products.length === 0 ? (
            <p>No hay productos registrados.</p>
          ) : (
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  <h2>{product.nombre}</h2>

                  <p>{product.descripcion}</p>

                  <p>
                    Tipo: {product.tipo}
                  </p>

                  <p>
                    Genética: {product.genetica}
                  </p>

                  <p>
                    THC:{" "}   
                    {product.porcentaje_thc
                      ? `${product.porcentaje_thc}%`
                      : "No aplica"}
                  </p>

                  <p>
                    Precio: $
                    {product.precio_venta_actual}
                  </p>

                  <p>
                    Disponible:{" "}
                    {product.stock?.cantidad_disponible ?? 0}{" "}
                    {product.unidad_medida}
                  </p>

                  <p>
                    Estado: {product.estado}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}