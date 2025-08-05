DROP TABLE `products`;
--> statement-breakpoint
PRAGMA foreign_keys = OFF;
--> statement-breakpoint
CREATE TABLE `__new_wishlist_categories` (
    `wishlistId` integer NOT NULL,
    `categoryId` integer NOT NULL,
    FOREIGN KEY (`wishlistId`) REFERENCES `wishlists` (`id`) ON UPDATE no action ON DELETE no action,
    FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO
    `__new_wishlist_categories` ("wishlistId", "categoryId")
SELECT "wishlistId", "categoryId"
FROM `wishlist_categories`;
--> statement-breakpoint
DROP TABLE `wishlist_categories`;
--> statement-breakpoint
ALTER TABLE `__new_wishlist_categories`
RENAME TO `wishlist_categories`;
--> statement-breakpoint
PRAGMA foreign_keys = ON;