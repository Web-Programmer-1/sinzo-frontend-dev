export const logoKeys = {
  all: ["logo"] as const,
  setting: () => [...logoKeys.all, "setting"] as const,
};