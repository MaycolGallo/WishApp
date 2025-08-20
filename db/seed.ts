import { db } from '../lib/db';
import * as schema from './schema';

const seedData = async () => {
  console.log('Starting to seed database...');

  // Clear existing data in the correct order to avoid foreign key constraint issues
  console.log('Clearing existing data...');
  await db.delete(schema.list_wishlist_items);
  await db.delete(schema.list_wishlists);
  await db.delete(schema.wishlist_categories);
  await db.delete(schema.lists);
  await db.delete(schema.wishlists);
  await db.delete(schema.categories);
  console.log('Existing data cleared.');

  // Insert categories
  console.log('Inserting categories...');
  const [electronics, books, clothing, homeGoods] = await db.insert(schema.categories).values([
    { name: 'Electronics' },
    { name: 'Books' },
    { name: 'Clothing' },
    { name: 'Home Goods' },
  ]).returning();
  console.log('Categories inserted.');

  // Insert wishlists
  console.log('Inserting wishlists...');
  const [techWishlist, bookWishlist] = await db.insert(schema.wishlists).values([
    {
      name: 'Tech Upgrades',
      description: 'New gadgets for my setup',
      createdAt: new Date().toISOString(),
      totalPrice: 1500,
      completed: 0,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      name: 'Summer Reading List',
      description: 'Books to read this summer',
      createdAt: new Date().toISOString(),
      totalPrice: 75,
      completed: 0,
      imageUrl: 'https://via.placeholder.com/150',
    },
  ]).returning();
  console.log('Wishlists inserted.');

  // Link wishlists to categories (Many-to-many)
  console.log('Linking wishlists to categories...');
  await db.insert(schema.wishlist_categories).values([
    { wishlistId: techWishlist.id, categoryId: electronics.id },
    { wishlistId: bookWishlist.id, categoryId: books.id },
  ]);
  console.log('Wishlists linked to categories.');


  // Insert a main list (e.g., "My Shopping Lists")
  console.log('Inserting lists...');
  const [mainList] = await db.insert(schema.lists).values({
      name: 'Main Shopping List',
      createdAt: new Date().toISOString(),
  }).returning();
  console.log('Lists inserted.');

  // Link wishlists to the main list
  console.log('Linking wishlists to the main list...');
  await db.insert(schema.list_wishlist_items).values([
      { listId: mainList.id, wishlistId: techWishlist.id },
      { listId: mainList.id, wishlistId: bookWishlist.id },
  ]);
  console.log('Wishlists linked to the main list.');


  console.log('Database seeded successfully!');
};

seedData().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});