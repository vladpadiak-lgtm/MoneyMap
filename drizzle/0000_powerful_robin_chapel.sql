CREATE TABLE `budgets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`category_id` integer NOT NULL,
	`month` text NOT NULL,
	`limit_cents` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_budgets_user_category_month` ON `budgets` (`user_id`,`category_id`,`month`);--> statement-breakpoint
CREATE INDEX `idx_budgets_user_month` ON `budgets` (`user_id`,`month`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`color` text DEFAULT '#C7F34A' NOT NULL,
	`icon` text DEFAULT 'circle' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_categories_user_name_type` ON `categories` (`user_id`,`name`,`type`);--> statement-breakpoint
CREATE INDEX `idx_categories_user_type` ON `categories` (`user_id`,`type`);--> statement-breakpoint
CREATE TABLE `goals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`target_cents` integer NOT NULL,
	`current_cents` integer DEFAULT 0 NOT NULL,
	`deadline` text NOT NULL,
	`color` text DEFAULT '#C7F34A' NOT NULL,
	`icon` text DEFAULT 'target' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_goals_user_status_deadline` ON `goals` (`user_id`,`status`,`deadline`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`category_id` integer NOT NULL,
	`type` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`description` text NOT NULL,
	`merchant` text DEFAULT '' NOT NULL,
	`date` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_transactions_user_date` ON `transactions` (`user_id`,`date`);--> statement-breakpoint
CREATE INDEX `idx_transactions_user_category_date` ON `transactions` (`user_id`,`category_id`,`date`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`currency` text DEFAULT 'EUR' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
PRAGMA optimize;
