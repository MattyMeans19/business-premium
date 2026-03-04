import ProductCard from "@/components/product-card";
import { db } from "@/db";
import { products } from "@/db/schema";
import { Product } from "@/lib/definitions";
import { asc } from "drizzle-orm";

export default async function Products() {
  const productList = await db.select().from(products).orderBy(asc(products.id)) as Product[];

  return (
    <div className="grow m-10">
      {productList.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productList.map((product) => (
          <ProductCard 
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            photo={product.photo}
            count={product.count}
          />
          ))}
        </div>
      )}
    </div>
  );
}
