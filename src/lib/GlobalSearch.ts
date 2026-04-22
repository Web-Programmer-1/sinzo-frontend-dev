"use client";

import { useMemo, useState } from "react";
import { useGetAllProducts } from "../Apis/products/queries";

export interface SearchProduct {
  id: string;
  slug: string;
  title: string;
  cardShortTitle?: string;
  productCardImage?: string;
  price: number;
  stock: number;
}

export const useGlobalProductSearch = () => {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();
  const shouldSearch = trimmedQuery.length >= 2;
// global
  const params = useMemo(
    () => ({
      searchTerm: trimmedQuery,
      page: 1,
      limit: 6,
    }),
    [trimmedQuery]
  );

  const { data, isLoading, isFetching } = useGetAllProducts(params, {
    enabled: shouldSearch,
  });

  const products: SearchProduct[] = data?.data ?? [];

  return {
    query,
    setQuery,
    trimmedQuery,
    shouldSearch,
    products,
    isLoading,
    isFetching,
  };
};