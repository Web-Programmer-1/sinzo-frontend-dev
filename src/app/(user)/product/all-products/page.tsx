import { Metadata } from "next";
import UserSideProducts from "../../../../components/_Products/UserSideProducts";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Explore all products on Sinzo Official. Buy high-quality wooden items, furniture, decor, and e-commerce products online at best price in Bangladesh.",
  openGraph: {
    title: "All Products | Sinzo Official",
    description:
      "Explore all products on Sinzo Official. Best deals and online shopping in Bangladesh.",
    url: "https://sinzooffcial.com/product/all-products",
  },
  alternates: {
    canonical: "https://sinzooffcial.com/product/all-products",
  },
};

export default function AllProductPage() {
  return <UserSideProducts />;
}