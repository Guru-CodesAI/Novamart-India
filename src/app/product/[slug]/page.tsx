import { notFound } from "next/navigation";
import { getDBProductBySlug, getDBProducts } from "@/lib/dbProducts";
import ProductClient from "./ProductClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const resolvedParams = await params;
    const product = await getDBProductBySlug(resolvedParams.slug);
    if (!product) {
      return {
        title: "Product Not Found | NovaMart India",
      };
    }

    return {
      title: `${product.name} | NovaMart India`,
      description: product.shortDesc || product.description.substring(0, 155) + "...",
      openGraph: {
        title: `${product.name} - NovaMart India`,
        description: product.shortDesc || product.description.substring(0, 155) + "...",
        images: product.images,
      },
    };
  } catch (error) {
    return {
      title: "NovaMart India",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getDBProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Fetch related products from DB
  const related = await getDBProducts({
    categorySlug: product.category?.slug,
    limit: 5,
  });

  const relatedFiltered = related.filter((p) => p.id !== product.id).slice(0, 4);

  return <ProductClient product={product} relatedProducts={relatedFiltered} />;
}
