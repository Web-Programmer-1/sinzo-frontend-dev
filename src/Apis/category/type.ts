export type TCategory = {
  id: string;
  title: string;
  thumbnailImage: string;
  createdAt: string;
  updatedAt: string;
};

export type TCategoryMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TCategoryResponse = {
  success: boolean;
  message: string;
  meta?: TCategoryMeta;
  data: TCategory[];
};

export type TSingleCategoryResponse = {
  success: boolean;
  message: string;
  data: TCategory;
};

export type TGetCategoriesParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};