ALTER TABLE `wishlist_products` RENAME TO `list_wishlists`;--> statement-breakpoint
ALTER TABLE `product_categories` RENAME TO `wishlist_categories`;--> statement-breakpoint
ALTER TABLE `list_wishlists` RENAME COLUMN "productId" TO "categoryId";--> statement-breakpoint
ALTER TABLE `wishlist_categories` RENAME COLUMN "productId" TO "wishlistId";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_list_wishlists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wishlistId` integer NOT NULL,
	`categoryId` integer NOT NULL,
	FOREIGN KEY (`wishlistId`) REFERENCES `wishlists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_list_wishlists`("id", "wishlistId", "categoryId") SELECT "id", "wishlistId", "categoryId" FROM `list_wishlists`;--> statement-breakpoint
DROP TABLE `list_wishlists`;--> statement-breakpoint
ALTER TABLE `__new_list_wishlists` RENAME TO `list_wishlists`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_wishlist_categories` (
	`wishlistId` integer NOT NULL,
	`categoryId` integer NOT NULL,
	FOREIGN KEY (`wishlistId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_wishlist_categories`("wishlistId", "categoryId") SELECT "wishlistId", "categoryId" FROM `wishlist_categories`;--> statement-breakpoint
DROP TABLE `wishlist_categories`;--> statement-breakpoint
ALTER TABLE `__new_wishlist_categories` RENAME TO `wishlist_categories`;