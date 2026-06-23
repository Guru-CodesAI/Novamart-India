import { getDBProducts, getDBCategories } from "@/lib/dbProducts";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop Luxury Electronics & Fashion | NovaMart India",
  description: "Browse NovaMart India's premium curated collection of flagship smartphones, next-gen gaming consoles, audio gear, and exclusive luxury cars.",
};

export default async function ShopPage() {
  const products = await getDBProducts();
  const categories = await getDBCategories();

  return <ShopClient initialProducts={products} initialCategories={categories} />;
}
