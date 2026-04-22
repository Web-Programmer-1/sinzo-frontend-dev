export type TProductBadge =
  | "SALE"
  | "BEST_SELLER"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "NEW";

export type TProductCategory = {
  id?: string;
  title: string;
  thumbnailImage: string;
};

export type TProduct = {
  id: string;
  title: string;
  cardShortTitle?: string | null;
  slug: string;
  description?: string | null;
  productCardImage: string;
  price: number;
  stock: number;
  badge?: TProductBadge | null;
  totalReviews: number;
  averageRating?: number;

  galleryImages?: string[];
  colors?: string[];
  sizes?: string[];
  sizeType?: string | null;
  sizeGuideImage?: string | null;
  sizeGuideData?: any;

  createdAt?: string;
  updatedAt?: string;

  category: TProductCategory;
};

export type TRelatedProduct = {
  id: string;
  slug: string;
  productCardImage: string;
  title: string;
  price: number;
  badge?: TProductBadge | null;
  stock: number;
  totalReviews: number;
};



export type TProductsMeta = {
  page: number;
  limit: number;
  total: number;
};

export type TProductsResponse = {
  success: boolean;
  message: string;
  meta: TProductsMeta;
  data: TProduct[];
};



export type TDeleteProductResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
  };
};

export type TGetProductsParams = {
  searchTerm?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  categoryId?: string;
  size?: string;
  color?: string;
  sort?: "oldest";
  page?: number;
  limit?: number;
};