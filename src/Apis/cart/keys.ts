export const cartKeys = {
  all: ["cart"] as const,
  myCart: () => [...cartKeys.all, "my-cart"] as const,
};