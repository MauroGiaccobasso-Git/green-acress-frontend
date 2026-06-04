"use client";

import { useCallback, useState } from "react";

import {
  Product,
  productsApi,
} from "@/api/productsApi";

/*
Hook specialized in managing
the administrative product list.

Responsibilities:

- store loaded products
- manage loading state
- manage errors
- expose a reusable function
  to request products from backend

It has no visual responsibility.

It does not render components.

It does not perform direct fetch calls.

All backend communication happens
through productsApi.
*/
export function useProducts() {
  /*
  Products currently loaded
  from backend.
  */
  const [products, setProducts] =
    useState<Product[]>([]);

  /*
  Indicates whether an HTTP request
  is currently running.
  */
  const [loading, setLoading] =
    useState(false);

  /*
  Error message that can be shown
  by the UI when backend returns
  an error or communication fails.
  */
  const [error, setError] =
    useState<string | null>(null);

  /*
  Reusable function responsible
  for loading products.

  It can be executed:

  - when the screen loads
  - when searching
  - when refreshing
  - after editing
  - after changing product state

  search is optional, allowing this
  same function to be reused for
  future search/filter behavior.
  */
  const fetchProducts =
    useCallback(
      async (
        search?: string
      ): Promise<void> => {
        try {
          /*
          Start loading state.
          */
          setLoading(true);

          /*
          Clear previous errors.
          */
          setError(null);

          /*
          Request products using
          the API layer.
          */
          const data =
            await productsApi
              .getProducts(search);

          /*
          Store backend response
          in local hook state.
          */
          setProducts(data);
        } catch (error) {
          /*
          Convert technical errors
          into UI-friendly messages.
          */
          setError(
            error instanceof Error
              ? error.message
              : "Error loading products"
          );
        } finally {
          /*
          Stop loading state
          regardless of success
          or failure.
          */
          setLoading(false);
        }
      },
      []
    );

  /*
  Expose only what visual containers
  need to render the screen.
  */
  return {
    products,
    loading,
    error,
    fetchProducts,
  };
}