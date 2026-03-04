import ProductDetails from "@/components/product-page";
import { db } from "@/db";
import { products } from "@/db/schema";
import { Product } from "@/lib/definitions";
import { eq } from "drizzle-orm";
import { Metadata } from "next";

type Props = {
  params: { productSlug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params;
  const formattedSlug = productSlug.replace(/-/g, ' ');
  const product = (await db.select().from(products).where(eq(products.name, formattedSlug))) as Product[];

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product[0].name} | Business Name`,
    description: `Buy ${product[0].name} for  $${product[0].price}. ${product[0].description.substring(0, 150)}...`,
    openGraph: {
      title: product[0].name,
      description: product[0].description,
      images: [
        {
          url: product[0].photo,
          width: 1200,
          height: 630,
          alt: product[0].name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product[0].name,
      description: product[0].description,
      images: [product[0].photo],
    },
   };
}

export default async function ProductPage({ params }: { params: { productSlug: string } }) {
    const { productSlug } = await params;
    const formattedSlug = productSlug.replace(/-/g, ' ');
    const result = (await db.select().from(products).where(eq(products.name, formattedSlug))) as Product[];
    const product = result[0];

    if (!product) return <div>Product not found</div>;

    return (
        <ProductDetails product={product} />
    );
}