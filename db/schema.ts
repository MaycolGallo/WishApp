import { relations } from "drizzle-orm";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// One-to-many: wishlists to products
export const wishlists = sqliteTable("wishlists", {
  id: int().primaryKey({ autoIncrement: true }),
  createdAt: text().notNull(), // ISO date string
  name: text().notNull(),
  description: text(),
  totalPrice: int().notNull(),
  completed: int().notNull(), // 0 or 1
  imageUrl: text(),
  date_completed: integer({ mode: "timestamp" }),
  available: integer({ mode: "boolean" }).default(true),
  url: text(),
});

export const categories = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

// Many-to-many: products <-> categories
export const wishlist_categories = sqliteTable("wishlist_categories", {
  wishlistId: int()
    .notNull()
    .references(() => wishlists.id),
  categoryId: int()
    .notNull()
    .references(() => categories.id),
});

// One-to-many: wishlists <-> products (wishlist can have many products)
export const list_wishlists = sqliteTable("list_wishlists", {
  id: int().primaryKey({ autoIncrement: true }),
  wishlistId: int()
    .notNull()
    .references(() => wishlists.id),
  categoryId: int()
    .notNull()
    .references(() => categories.id),
});

export const lists = sqliteTable("lists", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  createdAt: text().notNull(), // ISO date string
});

export const list_wishlist_items = sqliteTable("list_wishlist_items", {
  id: int().primaryKey({ autoIncrement: true }),
  listId: int()
    .notNull()
    .references(() => lists.id),
  wishlistId: int()
    .notNull()
    .references(() => wishlists.id),
});

// export type Product = typeof products.$inferSelect;
export type Wishlist = typeof wishlists.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type WishlistCategory = typeof wishlist_categories.$inferSelect;
export type ListWishlist = typeof list_wishlists.$inferSelect;
export type List = typeof lists.$inferSelect;
export type ListWishlistItem = typeof list_wishlist_items.$inferSelect;

export type WhislitPayload = typeof wishlists.$inferInsert;

export const listsRelations = relations(lists, ({ many }) => ({
  list_wishlist_items: many(list_wishlist_items),
}));

export const wishlistsRelations = relations(wishlists, ({ many }) => ({
  list_wishlist_items: many(list_wishlist_items),
}));

export const list_wishlist_itemsRelations = relations(
  list_wishlist_items,
  ({ one }) => ({
    list: one(lists, {
      fields: [list_wishlist_items.listId],
      references: [lists.id],
    }),
    wishlist: one(wishlists, {
      fields: [list_wishlist_items.wishlistId],
      references: [wishlists.id],
    }),
  })
);
