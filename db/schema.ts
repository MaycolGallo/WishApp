import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: int().primaryKey({ autoIncrement: true }),
  nombre: text().notNull(),
  price: int().notNull(),
  imageUrl: text().notNull(),
});

// One-to-many: wishlists to products
export const wishlists = sqliteTable("wishlists", {
  id: int().primaryKey({ autoIncrement: true }),
  createdAt: text().notNull(), // ISO date string
  name: text().notNull(),
  description: text(),
  totalPrice: int().notNull(),
  completed: int().notNull(), // 0 or 1

});

export const categories = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

// Many-to-many: products <-> categories
export const product_categories = sqliteTable("product_categories", {
  productId: int().notNull().references(() => products.id),
  categoryId: int().notNull().references(() => categories.id),
});

// One-to-many: wishlists <-> products (wishlist can have many products)
export const wishlist_products = sqliteTable("wishlist_products", {
  id: int().primaryKey({ autoIncrement: true }),
  wishlistId: int().notNull().references(() => wishlists.id),
  productId: int().notNull().references(() => products.id),
});
