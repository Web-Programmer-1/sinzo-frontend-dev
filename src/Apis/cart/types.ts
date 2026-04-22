export type TAddToCartPayload = {
  productId: string;
  quantity?: number;
  selectedColor?: string;
  selectedSize?: string;
};

export type TUpdateCartItemPayload = {
  quantity?: number;
  selectedColor?: string;
  selectedSize?: string;
};

export type TUpdateCartItemParams = {
  cartId: string;
  payload: TUpdateCartItemPayload;
};