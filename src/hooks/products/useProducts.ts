"use client";

import { useCallback, useState } from "react";

import {
  Product,
  productsApi,
} from "@/api/productsApi";

/*
Hook especializado encargado de administrar
la lógica relacionada al listado administrativo
de productos.

Su responsabilidad es:

- solicitar productos al backend

- almacenar productos cargados

- administrar loading

- administrar errores

- exponer funciones reutilizables
  para consumir desde containers

Este hook NO renderiza componentes.

Este hook NO construye interfaz.

Este hook NO realiza fetch directo.

Toda comunicación ocurre mediante
productsApi.
*/
export function useProducts() {

  /*
  Almacena productos obtenidos
  desde backend.

  El container consumirá este estado
  para renderizar cards, tablas
  o cualquier representación visual.
  */
  const [products, setProducts] =
    useState<Product[]>([]);

  /*
  Indica cuándo existe una solicitud
  en ejecución.

  Permite que la interfaz pueda:

  - mostrar spinner

  - bloquear acciones

  - mostrar mensajes de carga
  */
  const [loading, setLoading] =
    useState(false);

  /*
  Guarda mensajes de error producidos
  durante solicitudes.

  El container puede utilizar esto
  para renderizar mensajes amigables
  para el usuario.
  */
  const [error, setError] =
    useState<string | null>(null);

  /*
  Función reutilizable encargada
  de consultar productos.

  Puede utilizarse:

  - al cargar pantalla

  - al buscar

  - al refrescar

  - luego de crear productos

  - luego de editar productos

  - luego de desactivar productos

  search es opcional para permitir
  reutilización futura con filtros.
  */
  const fetchProducts =
    useCallback(

      async (
        search?: string
      ): Promise<void> => {

        try {

          /*
          Comienza estado de carga.

          La interfaz sabrá que existe
          una operación ejecutándose.
          */

          setLoading(true);

          /*
          Limpia errores anteriores.

          Evita mostrar mensajes viejos
          durante nuevas consultas.
          */

          setError(null);

          /*
          Solicita productos utilizando
          la capa API.

          El hook NO conoce detalles
          técnicos del backend.

          Sólo solicita información.
          */

          const data =
            await productsApi
              .getProducts(search);

          /*
          Actualiza estado local
          con productos obtenidos.

          Esto provoca re-render
          automático del container.
          */

          setProducts(data);

        } catch (error) {

          /*
          Convierte errores técnicos
          en mensajes utilizables
          por la interfaz.
          */

          setError(

            error instanceof Error
              ? error.message
              : "Error al cargar productos"

          );

        } finally {

          /*
          Finaliza estado de carga.

          Ocurre tanto si la operación
          fue exitosa como si falló.
          */

          setLoading(false);

        }

      },

      []

    );

  /*
  Expone únicamente la información
  necesaria para containers.

  El container decide:

  - cuándo cargar

  - cómo mostrar

  - cómo renderizar

  El hook sólo entrega datos y lógica.
  */

  return {

    products,

    loading,

    error,

    fetchProducts,

  };

}