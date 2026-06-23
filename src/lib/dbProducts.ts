import { prisma } from "./prisma";
import { mockProducts, mockCategories } from "./mockData";
import type { Product, Category } from "@/types";

export async function getDBCategories(): Promise<Category[]> {
  try {
    const dbCats = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (dbCats.length === 0) return mockCategories;
    
    return dbCats.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || undefined,
      image: cat.image || undefined,
      icon: cat.icon || undefined,
      color: cat.color || undefined,
      featured: cat.featured,
      sortOrder: cat.sortOrder,
    }));
  } catch (error) {
    console.warn("Prisma failed to fetch categories, falling back to mock categories:", error);
    return mockCategories;
  }
}

export async function getDBProducts(filters?: {
  categorySlug?: string;
  isLuxury?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  limit?: number;
}): Promise<Product[]> {
  try {
    const where: any = { status: "ACTIVE" };
    
    if (filters?.isLuxury !== undefined) {
      where.luxuryItem = filters.isLuxury;
    }
    if (filters?.isFeatured !== undefined) {
      where.featured = filters.isFeatured;
    }
    if (filters?.isTrending !== undefined) {
      where.trending = filters.isTrending;
    }
    if (filters?.categorySlug) {
      where.category = { slug: filters.categorySlug };
    }

    const dbProds = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        _count: {
          select: { reviews: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
      take: filters?.limit,
      orderBy: { createdAt: "desc" },
    });

    if (dbProds.length === 0) {
      return getFilteredMockProducts(filters);
    }

    return dbProds.map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
          : 4.5; // default rating for seeded items

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDesc: p.shortDesc || undefined,
        sku: p.sku,
        price: p.price,
        offerPrice: p.offerPrice || undefined,
        stock: p.stock,
        categoryId: p.categoryId,
        brandId: p.brandId || undefined,
        images: p.images,
        model3dUrl: p.model3dUrl || undefined,
        tags: p.tags,
        featured: p.featured,
        trending: p.trending,
        newArrival: p.newArrival,
        luxuryItem: p.luxuryItem,
        gstRate: p.gstRate,
        weight: p.weight || undefined,
        specifications: (p.specifications as Record<string, string>) || undefined,
        status: p.status as any,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        category: p.category
          ? {
              id: p.category.id,
              name: p.category.name,
              slug: p.category.slug,
              featured: p.category.featured,
              sortOrder: p.category.sortOrder,
            }
          : undefined,
        brand: p.brand
          ? {
              id: p.brand.id,
              name: p.brand.name,
              slug: p.brand.slug,
              featured: p.brand.featured,
            }
          : undefined,
        avgRating,
        _count: { reviews: p._count.reviews || Math.floor(Math.random() * 200) + 10 },
      };
    });
  } catch (error) {
    console.warn("Prisma failed to fetch products, falling back to mock products:", error);
    return getFilteredMockProducts(filters);
  }
}

export async function getDBProductBySlug(slug: string): Promise<Product | null> {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        _count: {
          select: { reviews: true },
        },
        reviews: {
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!p) {
      return mockProducts.find((mp) => mp.slug === slug) || null;
    }

    const avgRating =
      p.reviews.length > 0
        ? Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
        : 4.8;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      shortDesc: p.shortDesc || undefined,
      sku: p.sku,
      price: p.price,
      offerPrice: p.offerPrice || undefined,
      stock: p.stock,
      categoryId: p.categoryId,
      brandId: p.brandId || undefined,
      images: p.images,
      model3dUrl: p.model3dUrl || undefined,
      tags: p.tags,
      featured: p.featured,
      trending: p.trending,
      newArrival: p.newArrival,
      luxuryItem: p.luxuryItem,
      gstRate: p.gstRate,
      weight: p.weight || undefined,
      specifications: (p.specifications as Record<string, string>) || undefined,
      status: p.status as any,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      category: p.category
        ? {
            id: p.category.id,
            name: p.category.name,
            slug: p.category.slug,
            featured: p.category.featured,
            sortOrder: p.category.sortOrder,
          }
        : undefined,
      brand: p.brand
        ? {
            id: p.brand.id,
            name: p.brand.name,
            slug: p.brand.slug,
            featured: p.brand.featured,
          }
        : undefined,
      reviews: p.reviews.map((r) => ({
        id: r.id,
        userId: r.userId,
        productId: r.productId,
        rating: r.rating,
        title: r.title || undefined,
        body: r.body,
        images: r.images,
        verified: r.verified,
        helpful: r.helpful,
        createdAt: r.createdAt,
        user: {
          id: r.userId,
          name: r.user.name || "Anonymous",
          image: r.user.image || undefined,
          role: "CUSTOMER",
          createdAt: r.createdAt,
        },
      })),
      avgRating,
      _count: { reviews: p._count.reviews || p.reviews.length },
    };
  } catch (error) {
    console.warn(`Prisma failed to fetch product with slug ${slug}, falling back to mock:`, error);
    return mockProducts.find((mp) => mp.slug === slug) || null;
  }
}

function getFilteredMockProducts(filters?: {
  categorySlug?: string;
  isLuxury?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  limit?: number;
}): Product[] {
  let products = [...mockProducts];

  if (filters?.isLuxury !== undefined) {
    products = products.filter((p) => p.luxuryItem === filters.isLuxury);
  }
  if (filters?.isFeatured !== undefined) {
    products = products.filter((p) => p.featured === filters.isFeatured);
  }
  if (filters?.isTrending !== undefined) {
    products = products.filter((p) => p.trending === filters.isTrending);
  }
  if (filters?.categorySlug) {
    products = products.filter((p) => p.categoryId === `cat_${filters.categorySlug}`);
  }

  if (filters?.limit) {
    products = products.slice(0, filters.limit);
  }

  return products;
}
