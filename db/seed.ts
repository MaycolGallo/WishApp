import { db } from '../lib/db';
import * as schema from './schema';

const seedData = async () => {
  // Clear existing data
  await db.delete(schema.wishlist_products);
  await db.delete(schema.product_categories);
  await db.delete(schema.products);
  await db.delete(schema.categories);
  await db.delete(schema.wishlists);

  // Insert categories
  const [electronics, books, clothing] = await db.insert(schema.categories).values([
    { name: 'Electronics' },
    { name: 'Books' },
    { name: 'Clothing' },
  ]).returning();

  // Insert products
  const [product1, product2, product3] = await db.insert(schema.products).values([
    { nombre: 'Laptop', price: 1200, imageUrl: 'https://via.placeholder.com/150' },
    { nombre: 'The Great Gatsby', price: 15, imageUrl: 'https://via.placeholder.com/150' },
    { nombre: 'T-Shirt', price: 25, imageUrl: 'https://via.placeholder.com/150' },
  ]).returning();

  // Link products to categories
  await db.insert(schema.product_categories).values([
    { productId: product1.id, categoryId: electronics.id },
    { productId: product2.id, categoryId: books.id },
    { productId: product3.id, categoryId: clothing.id },
  ]);

  // Insert a wishlist
  const [wishlist] = await db.insert(schema.wishlists).values({
    name: 'My Wishlist',
    createdAt: new Date().toISOString(),
    totalPrice: 1240,
    completed: 0,
  }).returning();

  // Link products to the wishlist
  await db.insert(schema.wishlist_products).values([
    { wishlistId: wishlist.id, productId: product1.id },
    { wishlistId: wishlist.id, productId: product2.id },
    { wishlistId: wishlist.id, productId: product3.id },
  ]);

  console.log('Database seeded successfully!');
};

seedData().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
