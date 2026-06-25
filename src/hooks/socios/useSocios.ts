"use client";

import { useCallback, useState } from "react";

import { Socio, sociosApi } from "@/api/sociosApi";

/*
Hook especializado encargado de administrar
la lógica relacionada al listado administrativo
de socios.

Su responsabilidad es:

- solicitar socios al backend

- almacenar socios cargados

- administrar loading

- administrar errores

- exponer funciones reutilizables
  para consumir desde containers

Este hook NO renderiza componentes.

Este hook NO construye interfaz.

Este hook NO realiza fetch directo.

Toda comunicación ocurre mediante
sociosApi.
*/
export function useSocios() {
  /*
  Almacena socios obtenidos
  desde backend.

  El container consumirá este estado
  para renderizar selects, tablas
  o cualquier representación visual.
  */
  const [socios, setSocios] =
    useState<Socio[]>([]);

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
  de consultar socios.
  */
  const fetchSocios =
    useCallback(
      async (
        search?: string
      ): Promise<void> => {
        try {
          setLoading(true);
          setError(null);

          const data =
            await sociosApi
              .getSocios(search);

          setSocios(data);
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Error al cargar socios"
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  return {
    socios,
    loading,
    error,
    fetchSocios,
  };
}