import { getDBProducts, getDBCategories } from "@/lib/dbProducts";
import HomeClient from "./HomeClient";

export const metadata = {
  title: "NovaMart India | Futuristic 3D Shopping Experience",
  description: "Experience India's next-generation 3D eCommerce platform. Buy premium luxury cars, flagship electronics, and trending high fashion with immersive cinematic visuals.",
};

export default async function HomePage() {
  const products = await getDBProducts();
  const categories = await getDBCategories();

  return <HomeClient initialProducts={products} initialCategories={categories} />;
}
