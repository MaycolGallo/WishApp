CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_categories` (
	`productId` integer NOT NULL,
	`categoryId` integer NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wishlist_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wishlistId` integer NOT NULL,
	`productId` integer NOT NULL,
	FOREIGN KEY (`wishlistId`) REFERENCES `wishlists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`totalPrice` integer NOT NULL,
	`completed` integer NOT NULL
);
