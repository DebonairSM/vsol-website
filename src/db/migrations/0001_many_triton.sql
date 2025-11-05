CREATE TABLE `referrals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`referrer_first_name` text NOT NULL,
	`referrer_last_name` text NOT NULL,
	`referral_linkedin_url` text NOT NULL,
	`referral_email` text NOT NULL,
	`referral_phone` text,
	`ip_address` text,
	`user_agent` text,
	`submitted_at` integer DEFAULT (unixepoch()) NOT NULL
);
