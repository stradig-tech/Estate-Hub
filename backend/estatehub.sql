-- ============================================================================
-- EstateHub MySQL Database Dump
-- Converted from SQLite (db.sqlite3)
-- Compatible with: MySQL 8.0+, MariaDB 10.5+, phpMyAdmin, CloudPanel, cPanel
-- ============================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET AUTOCOMMIT = 0;
START TRANSACTION;

USE `estatehub`;

-- ----------------------------------------------------------------------------
-- Table Structures
-- ----------------------------------------------------------------------------

DROP TABLE IF EXISTS `accounts_agency`;
CREATE TABLE `accounts_agency` (`id` char(32) NOT NULL PRIMARY KEY, `name` varchar(255) NOT NULL UNIQUE, `email` varchar(254) NULL, `phone` varchar(50) NULL, `address` varchar(255) NULL, `website` varchar(200) NULL, `logo` varchar(100) NULL, `description` longtext NULL, `created_at` datetime(6) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `accounts_favorite`;
CREATE TABLE `accounts_favorite` (`id` char(32) NOT NULL PRIMARY KEY, `user_id` char(32) NULL, `property_id` char(32) NOT NULL, `created_date` datetime(6) NOT NULL, `property_title` varchar(255) NULL, `property_price` numeric(12, 2) NULL, `property_image` varchar(1000) NULL, `property_city` varchar(100) NULL, `property_state` varchar(100) NULL, `property_beds` integer NOT NULL, `property_baths` integer NOT NULL, `property_size` integer NOT NULL, `property_type` varchar(50) NULL, `listing_type` varchar(50) NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `accounts_review`;
CREATE TABLE `accounts_review` (`id` char(32) NOT NULL PRIMARY KEY, `rating` integer NOT NULL, `comment` longtext NULL, `author_name` varchar(255) NOT NULL, `author_email` varchar(254) NOT NULL, `agent_id` char(32) NULL, `created_date` datetime(6) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `accounts_user`;
CREATE TABLE `accounts_user` (`password` varchar(128) NOT NULL, `last_login` datetime(6) NULL, `is_superuser` bool NOT NULL, `username` varchar(150) NOT NULL UNIQUE, `first_name` varchar(150) NOT NULL, `last_name` varchar(150) NOT NULL, `email` varchar(254) NOT NULL, `is_staff` bool NOT NULL, `is_active` bool NOT NULL, `date_joined` datetime(6) NOT NULL, `id` char(32) NOT NULL PRIMARY KEY, `role` varchar(20) NOT NULL, `phone` varchar(20) NULL, `bio` longtext NULL, `agency_id` char(32) NULL, `agency_name` varchar(255) NULL, `agent_title` varchar(100) NULL, `is_featured_agent` bool NOT NULL, `avatar_url` varchar(1000) NULL, `license_number` varchar(100) NULL, `subscription_plan` varchar(100) NOT NULL, `subscription_status` varchar(20) NOT NULL, `agent_status` varchar(20) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `accounts_user_groups`;
CREATE TABLE `accounts_user_groups` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `user_id` char(32) NOT NULL, `group_id` integer NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `accounts_user_user_permissions`;
CREATE TABLE `accounts_user_user_permissions` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `user_id` char(32) NOT NULL, `permission_id` integer NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group` (`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `name` varchar(150) NOT NULL UNIQUE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE `auth_group_permissions` (`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `group_id` integer NOT NULL, `permission_id` integer NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission` (`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `name` varchar(255) NOT NULL, `content_type_id` integer NOT NULL, `codename` varchar(100) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `billing_invoice`;
CREATE TABLE `billing_invoice` (`id` char(32) NOT NULL PRIMARY KEY, `amount` numeric(10, 2) NOT NULL, `status` varchar(50) NOT NULL, `plan_name` varchar(100) NOT NULL, `user_id` char(32) NULL, `created_date` datetime(6) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `billing_subscriptionplan`;
CREATE TABLE `billing_subscriptionplan` (`id` char(32) NOT NULL PRIMARY KEY, `name` varchar(100) NOT NULL, `price` numeric(10, 2) NOT NULL, `interval` varchar(50) NOT NULL, `features` json NOT NULL, `popular` bool NOT NULL, `created_date` datetime(6) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cms_blogpost`;
CREATE TABLE `cms_blogpost` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `title` varchar(200) NOT NULL, `slug` varchar(50) NOT NULL UNIQUE, `author` varchar(100) NOT NULL, `category` varchar(100) NOT NULL, `image` varchar(100) NULL, `excerpt` longtext NOT NULL, `content` longtext NOT NULL, `published_date` date NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cms_heroslide`;
CREATE TABLE `cms_heroslide` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `site_setting_id` bigint NULL, `image` varchar(100) NULL, `image_url` varchar(1000) NULL, `title` varchar(255) NULL, `description` longtext NULL, `order` integer UNSIGNED NOT NULL CHECK (`order` >= 0), `is_active` bool NOT NULL, `created_at` datetime(6) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cms_menucategory`;
CREATE TABLE `cms_menucategory` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `title` varchar(100) NOT NULL, `order` integer NOT NULL, `is_mega_menu` bool NOT NULL, `url` varchar(200) NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cms_menuitem`;
CREATE TABLE `cms_menuitem` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `category_id` bigint NOT NULL, `title` varchar(100) NOT NULL, `description` varchar(255) NULL, `url` varchar(200) NOT NULL, `order` integer NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cms_pagecontent`;
CREATE TABLE `cms_pagecontent` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `slug` varchar(50) NOT NULL UNIQUE, `title` varchar(200) NOT NULL, `description` longtext NOT NULL, `updated_at` datetime(6) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cms_sitesetting`;
CREATE TABLE `cms_sitesetting` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `hero_title` varchar(255) NOT NULL, `hero_description` longtext NOT NULL, `hero_image` varchar(100) NULL, `hero_slider_autoplay` bool NOT NULL, `hero_slider_interval` integer UNSIGNED NOT NULL CHECK (`hero_slider_interval` >= 0), `logo` varchar(100) NULL, `favicon` varchar(100) NULL, `og_image` varchar(100) NULL, `facebook_url` varchar(200) NULL, `twitter_url` varchar(200) NULL, `instagram_url` varchar(200) NULL, `linkedin_url` varchar(200) NULL, `youtube_url` varchar(200) NULL, `show_developer_stradigtech` bool NOT NULL, `show_developer_mansib` bool NOT NULL, `ceo_name` varchar(100) NOT NULL, `ceo_role` varchar(100) NOT NULL, `ceo_signature` varchar(100) NULL, `contact_address` longtext NULL, `contact_phone` varchar(50) NULL, `contact_email` varchar(254) NULL, `contact_opentime` longtext NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log` (`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `action_time` datetime(6) NOT NULL, `user_id` char(32) NOT NULL, `content_type_id` integer NULL, `object_id` longtext NULL, `object_repr` varchar(200) NOT NULL, `action_flag` smallint UNSIGNED NOT NULL CHECK (`action_flag` >= 0), `change_message` longtext NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE `django_content_type` (`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `app_label` varchar(100) NOT NULL, `model` varchar(100) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `django_session`;
CREATE TABLE `django_session` (`session_key` varchar(40) NOT NULL PRIMARY KEY, `session_data` longtext NOT NULL, `expire_date` datetime(6) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `properties_nearbyplace`;
CREATE TABLE `properties_nearbyplace` (`id` char(32) NOT NULL PRIMARY KEY, `name` varchar(255) NOT NULL, `type` varchar(100) NOT NULL, `distance` varchar(50) NOT NULL, `property_id` char(32) NULL, `created_date` datetime(6) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `properties_property`;
CREATE TABLE `properties_property` (`id` char(32) NOT NULL PRIMARY KEY, `title` varchar(255) NOT NULL, `description` longtext NULL, `price` numeric(12, 2) NOT NULL, `listing_type` varchar(20) NOT NULL, `property_type` varchar(20) NOT NULL, `bedrooms` integer NOT NULL, `bathrooms` integer NOT NULL, `size` integer NOT NULL, `lot_size` integer NULL, `address` varchar(255) NULL, `city` varchar(100) NULL, `state` varchar(100) NULL, `zip_code` varchar(20) NULL, `latitude` numeric(9, 6) NULL, `longitude` numeric(9, 6) NULL, `status` varchar(20) NOT NULL, `amenities` json NOT NULL, `images` json NOT NULL, `floor_plan_image` varchar(1000) NULL, `floor_plan_images` json NOT NULL, `video_url` varchar(1000) NULL, `virtual_tour_url` varchar(1000) NULL, `agent_id` char(32) NULL, `agent_name` varchar(255) NULL, `views` integer NOT NULL, `featured` bool NOT NULL, `year_built` integer NULL, `parking` integer NOT NULL, `rejection_note` longtext NULL, `created_date` datetime(6) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `support_inquiry`;
CREATE TABLE `support_inquiry` (`id` char(32) NOT NULL PRIMARY KEY, `name` varchar(255) NOT NULL, `email` varchar(254) NOT NULL, `phone` varchar(20) NULL, `message` longtext NULL, `property_id` char(32) NULL, `agent_id` char(32) NULL, `customer_id` char(32) NULL, `status` varchar(20) NOT NULL, `created_date` datetime(6) NOT NULL, `updated_date` datetime(6) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `support_inquirymessage`;
CREATE TABLE `support_inquirymessage` (`id` char(32) NOT NULL PRIMARY KEY, `inquiry_id` char(32) NOT NULL, `sender_id` char(32) NULL, `sender_name` varchar(255) NULL, `sender_email` varchar(254) NULL, `sender_role` varchar(20) NOT NULL, `message` longtext NOT NULL, `created_date` datetime(6) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Data Insertions
-- ----------------------------------------------------------------------------

-- Table `accounts_agency`: 2 row(s)
LOCK TABLES `accounts_agency` WRITE;
/*!40000 ALTER TABLE `accounts_agency` DISABLE KEYS */;
INSERT INTO `accounts_agency` (`id`, `name`, `email`, `phone`, `address`, `website`, `logo`, `description`, `created_at`) VALUES
  ('33b5f63c084845bcb1b2390a9021fe7b', 'Estate Hub', 'support@estatehub.com', '+1 (800) 555-0199', '123 Business Avenue, Suite 100, New York, NY', NULL, '', 'Premier full-service real estate brokerage under Estate Hub.', '2026-10-03 11:23:06.148970'),
  ('458a8078259a485c8fb5a6aa4a414b16', 'Independent', NULL, NULL, NULL, NULL, '', NULL, '2026-10-03 11:30:08.291938');
/*!40000 ALTER TABLE `accounts_agency` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `accounts_favorite`: 0 rows (empty)

-- Table `accounts_review`: 0 rows (empty)

-- Table `accounts_user`: 8 row(s)
LOCK TABLES `accounts_user` WRITE;
/*!40000 ALTER TABLE `accounts_user` DISABLE KEYS */;
INSERT INTO `accounts_user` (`password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`, `id`, `role`, `phone`, `bio`, `agency_name`, `avatar_url`, `license_number`, `subscription_plan`, `subscription_status`, `agent_status`, `agent_title`, `is_featured_agent`, `agency_id`) VALUES
  ('pbkdf2_sha256$1200000$xspKcZGYALc5422n3oUGbx$fcjYuX/d8JCO4jg5+5sw+X3A+71VujvmddqJ36gW2zA=', '2026-10-03 13:19:05.234954', 1, 'SuperAdmin', 'Mansib', 'Khan', 'maahsankhan93@gmail.com', 1, 1, '2026-10-03 07:15:36', '80e687df7e4049868e66ddf877a64b75', 'admin', NULL, '', NULL, NULL, NULL, 'Free', 'free', 'approved', 'Administrative Staff', 0, NULL),
  ('pbkdf2_sha256$1200000$35dljikROkeXTHjoPyeMTl$wqEieCI46MjMe8QbZQ/YrGkDYaiKfBMjWqzSvx8jYVc=', NULL, 0, 'sifatss@gmail.com', 'Sifat', 'Rahman', 'sifatss@gmail.com', 0, 1, '2026-10-03 09:31:00', '70f3c05a5e5b454db22d7cb787909c44', 'agent', '01534727582', '', 'Independent', 'http://localhost:8000/media/uploads/e47d34bd1c6f4496b73ea5908b0fbb7d.png', 'RE-109405', 'Free', 'free', 'approved', 'Administrative Staff', 0, '458a8078259a485c8fb5a6aa4a414b16'),
  ('pbkdf2_sha256$1200000$sLF9Es5bLwOHZtCbI1AffH$m9Sh8gRTlqRCrW25iSosdvSR2OjKaBbRfmsa+bHffJo=', NULL, 0, 'james@gmail.com', 'James', 'Nob', 'james@gmail.com', 0, 1, '2026-10-03 10:23:23.710416', 'e9427e4ff2ce446c8e4bfa61376414f2', 'buyer', '+32158545752', '', '', 'http://localhost:8000/media/uploads/b5a6237aec924904bf87ef1f3f588b0d.jpg', '', 'Free', 'free', 'approved', 'Administrative Staff', 0, NULL),
  ('pbkdf2_sha256$1200000$LsziB874PtlSzedLPTcHdP$MNwtVogRFHBN66HAQs4Pakt7Jc4tf9ruiBiCWepXvIs=', NULL, 0, 'chris.patt', 'Chris', 'Patt', 'chris.patt@estatehub.com', 0, 1, '2026-10-03 11:23:06.154664', '4368471900a04bc38c178f86010df9db', 'agent', '+1 (555) 234-5678', 'Administrative Staff', 'Estate Hub', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', NULL, 'Free', 'free', 'approved', 'Administrative Staff', 1, '33b5f63c084845bcb1b2390a9021fe7b'),
  ('pbkdf2_sha256$1200000$VHj3lNp4XJhfX1uLBzwCoh$PJcpEW+0Pvso6wmc+XT0ck0CO+/hXESj5aF7EeH7Ofc=', NULL, 0, 'esther.howard', 'Esther', 'Howard', 'esther.howard@estatehub.com', 0, 1, '2026-10-03 11:23:06.919668', '68d156544ff14e3586a8be604655a218', 'agent', '+1 (555) 345-6789', 'Administrative Staff', 'Estate Hub', 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&q=80', NULL, 'Free', 'free', 'approved', 'Administrative Staff', 1, '33b5f63c084845bcb1b2390a9021fe7b'),
  ('pbkdf2_sha256$1200000$OFwRNIXOyqaJCU79g5l91R$QghKJl9ji9ftTAxu0+x+jTq37Ycn7vdxxUDogrePiR4=', NULL, 0, 'darrell.steward', 'Darrell', 'Steward', 'darrell.steward@estatehub.com', 0, 1, '2026-10-03 11:23:07.655348', 'a675c972a5f34934864cef7c85d2a99c', 'agent', '+1 (555) 456-7890', 'Administrative Staff', 'Estate Hub', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', NULL, 'Free', 'free', 'approved', 'Administrative Staff', 1, '33b5f63c084845bcb1b2390a9021fe7b'),
  ('pbkdf2_sha256$1200000$RKtjkwhAxxbEyhHlPuWRDb$GulbmV2etLWdn7IYnvRq7xP7nqIvEn/+C2L/Vf32CJM=', NULL, 0, 'robert.fox', 'Robert', 'Fox', 'robert.fox@estatehub.com', 0, 1, '2026-10-03 11:23:08.404645', '8ca73e9628c741e2b8c2169bb3396e47', 'agent', '+1 (555) 567-8901', 'Administrative Staff', 'Estate Hub', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', NULL, 'Free', 'free', 'approved', 'Administrative Staff', 1, '33b5f63c084845bcb1b2390a9021fe7b'),
  ('pbkdf2_sha256$1200000$ftFu2xKLegZQidQgG6VSHQ$hPf5UR5qbkU4utbtmSUQP/tSK9jBv8E2RFAGlgsduZ0=', '2026-10-04 05:28:33.088587', 1, 'admin', '', '', 'admin@estatehub.com', 1, 1, '2026-10-03 12:38:22.392211', 'd6ae2de523c04bc6b88f0e5cf8e99f06', 'admin', NULL, NULL, NULL, NULL, NULL, 'Free', 'free', 'approved', 'Administrative Staff', 0, NULL);
/*!40000 ALTER TABLE `accounts_user` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `accounts_user_groups`: 0 rows (empty)

-- Table `accounts_user_user_permissions`: 0 rows (empty)

-- Table `auth_group`: 0 rows (empty)

-- Table `auth_group_permissions`: 0 rows (empty)

-- Table `auth_permission`: 88 row(s)
LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` (`id`, `content_type_id`, `codename`, `name`) VALUES
  (1, 1, 'add_logentry', 'Can add log entry'),
  (2, 1, 'change_logentry', 'Can change log entry'),
  (3, 1, 'delete_logentry', 'Can delete log entry'),
  (4, 1, 'view_logentry', 'Can view log entry'),
  (5, 2, 'add_permission', 'Can add permission'),
  (6, 2, 'change_permission', 'Can change permission'),
  (7, 2, 'delete_permission', 'Can delete permission'),
  (8, 2, 'view_permission', 'Can view permission'),
  (9, 3, 'add_group', 'Can add group'),
  (10, 3, 'change_group', 'Can change group'),
  (11, 3, 'delete_group', 'Can delete group'),
  (12, 3, 'view_group', 'Can view group'),
  (13, 4, 'add_contenttype', 'Can add content type'),
  (14, 4, 'change_contenttype', 'Can change content type'),
  (15, 4, 'delete_contenttype', 'Can delete content type'),
  (16, 4, 'view_contenttype', 'Can view content type'),
  (17, 5, 'add_session', 'Can add session'),
  (18, 5, 'change_session', 'Can change session'),
  (19, 5, 'delete_session', 'Can delete session'),
  (20, 5, 'view_session', 'Can view session'),
  (21, 6, 'add_favorite', 'Can add favorite'),
  (22, 6, 'change_favorite', 'Can change favorite'),
  (23, 6, 'delete_favorite', 'Can delete favorite'),
  (24, 6, 'view_favorite', 'Can view favorite'),
  (25, 7, 'add_review', 'Can add review'),
  (26, 7, 'change_review', 'Can change review'),
  (27, 7, 'delete_review', 'Can delete review'),
  (28, 7, 'view_review', 'Can view review'),
  (29, 8, 'add_user', 'Can add user'),
  (30, 8, 'change_user', 'Can change user'),
  (31, 8, 'delete_user', 'Can delete user'),
  (32, 8, 'view_user', 'Can view user'),
  (33, 9, 'add_property', 'Can add property'),
  (34, 9, 'change_property', 'Can change property'),
  (35, 9, 'delete_property', 'Can delete property'),
  (36, 9, 'view_property', 'Can view property'),
  (37, 10, 'add_nearbyplace', 'Can add nearby place'),
  (38, 10, 'change_nearbyplace', 'Can change nearby place'),
  (39, 10, 'delete_nearbyplace', 'Can delete nearby place'),
  (40, 10, 'view_nearbyplace', 'Can view nearby place'),
  (41, 11, 'add_subscriptionplan', 'Can add subscription plan'),
  (42, 11, 'change_subscriptionplan', 'Can change subscription plan'),
  (43, 11, 'delete_subscriptionplan', 'Can delete subscription plan'),
  (44, 11, 'view_subscriptionplan', 'Can view subscription plan'),
  (45, 12, 'add_invoice', 'Can add invoice'),
  (46, 12, 'change_invoice', 'Can change invoice'),
  (47, 12, 'delete_invoice', 'Can delete invoice'),
  (48, 12, 'view_invoice', 'Can view invoice'),
  (49, 13, 'add_inquiry', 'Can add inquiry'),
  (50, 13, 'change_inquiry', 'Can change inquiry');
INSERT INTO `auth_permission` (`id`, `content_type_id`, `codename`, `name`) VALUES
  (51, 13, 'delete_inquiry', 'Can delete inquiry'),
  (52, 13, 'view_inquiry', 'Can view inquiry'),
  (53, 15, 'add_menuitem', 'Can add menu item'),
  (54, 15, 'change_menuitem', 'Can change menu item'),
  (55, 15, 'delete_menuitem', 'Can delete menu item'),
  (56, 15, 'view_menuitem', 'Can view menu item'),
  (57, 14, 'add_menucategory', 'Can add menu category'),
  (58, 14, 'change_menucategory', 'Can change menu category'),
  (59, 14, 'delete_menucategory', 'Can delete menu category'),
  (60, 14, 'view_menucategory', 'Can view menu category'),
  (61, 16, 'add_sitesetting', 'Can add Site Setting'),
  (62, 16, 'change_sitesetting', 'Can change Site Setting'),
  (63, 16, 'delete_sitesetting', 'Can delete Site Setting'),
  (64, 16, 'view_sitesetting', 'Can view Site Setting'),
  (65, 17, 'add_pagecontent', 'Can add Page Content'),
  (66, 17, 'change_pagecontent', 'Can change Page Content'),
  (67, 17, 'delete_pagecontent', 'Can delete Page Content'),
  (68, 17, 'view_pagecontent', 'Can view Page Content'),
  (69, 18, 'add_blogpost', 'Can add blog post'),
  (70, 18, 'change_blogpost', 'Can change blog post'),
  (71, 18, 'delete_blogpost', 'Can delete blog post'),
  (72, 18, 'view_blogpost', 'Can view blog post'),
  (73, 19, 'add_inquirymessage', 'Can add inquiry message'),
  (74, 19, 'change_inquirymessage', 'Can change inquiry message'),
  (75, 19, 'delete_inquirymessage', 'Can delete inquiry message'),
  (76, 19, 'view_inquirymessage', 'Can view inquiry message'),
  (77, 20, 'add_heroslide', 'Can add Hero Slide'),
  (78, 20, 'change_heroslide', 'Can change Hero Slide'),
  (79, 20, 'delete_heroslide', 'Can delete Hero Slide'),
  (80, 20, 'view_heroslide', 'Can view Hero Slide'),
  (81, 21, 'add_agency', 'Can add Agency'),
  (82, 21, 'change_agency', 'Can change Agency'),
  (83, 21, 'delete_agency', 'Can delete Agency'),
  (84, 21, 'view_agency', 'Can view Agency'),
  (85, 22, 'add_agent', 'Can add Agent'),
  (86, 22, 'change_agent', 'Can change Agent'),
  (87, 22, 'delete_agent', 'Can delete Agent'),
  (88, 22, 'view_agent', 'Can view Agent');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `billing_invoice`: 5 row(s)
LOCK TABLES `billing_invoice` WRITE;
/*!40000 ALTER TABLE `billing_invoice` DISABLE KEYS */;
INSERT INTO `billing_invoice` (`id`, `amount`, `status`, `plan_name`, `created_date`, `user_id`) VALUES
  ('5f7f3434f55a4d7fa2e0aa7b8e9b2f11', 199, 'paid', 'Professional Agent Plan', '2026-10-03 13:02:51.728931', '70f3c05a5e5b454db22d7cb787909c44'),
  ('2d61855ddf9745f3a24abef3db85f42d', 99, 'paid', 'Starter Listing Pack', '2026-10-03 13:02:51.735388', '4368471900a04bc38c178f86010df9db'),
  ('5a569c98d9b64dceb88161c50f767473', 299, 'paid', 'Agency Pro Tier', '2026-10-03 13:02:51.738376', '68d156544ff14e3586a8be604655a218'),
  ('5701956f27394950a2ab5aa579276359', 49, 'pending', 'Featured Listing Booster', '2026-10-03 13:02:51.740883', 'a675c972a5f34934864cef7c85d2a99c'),
  ('7a97cad2b6df456a951c37fd01bbb1da', 199, 'paid', 'Professional Agent Plan', '2026-10-03 13:02:51.743708', '70f3c05a5e5b454db22d7cb787909c44');
/*!40000 ALTER TABLE `billing_invoice` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `billing_subscriptionplan`: 0 rows (empty)

-- Table `cms_blogpost`: 3 row(s)
LOCK TABLES `cms_blogpost` WRITE;
/*!40000 ALTER TABLE `cms_blogpost` DISABLE KEYS */;
INSERT INTO `cms_blogpost` (`id`, `title`, `slug`, `author`, `category`, `image`, `excerpt`, `content`, `published_date`) VALUES
  (1, 'Building Gains Into Housing Stocks And How To Trade The Sector', 'building-gains-housing-stocks', 'Jerome Bell', 'Furniture', '', 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...', 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...', '2026-07-21'),
  (2, 'How to choose the perfect furniture for your new home', 'choose-perfect-furniture', 'Jerome Bell', 'Furniture', '', 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...', 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...', '2026-07-21'),
  (3, 'Real estate market predictions for the next 5 years', 'real-estate-market-predictions', 'Jerome Bell', 'Real Estate', '', 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...', 'The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances...', '2026-07-21');
/*!40000 ALTER TABLE `cms_blogpost` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `cms_heroslide`: 3 row(s)
LOCK TABLES `cms_heroslide` WRITE;
/*!40000 ALTER TABLE `cms_heroslide` DISABLE KEYS */;
INSERT INTO `cms_heroslide` (`id`, `image`, `image_url`, `title`, `description`, `order`, `is_active`, `created_at`, `site_setting_id`) VALUES
  (1, '', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80', 'Find Your Perfect Home', 'Search thousands of homes for sale and rent. Connect with trusted agents.', 1, 1, '2026-10-03 11:05:27.290843', 1),
  (2, '', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80', 'Discover Luxury Living', 'Explore premium estates and contemporary architecture in top locations.', 2, 1, '2026-10-03 11:05:27.294989', 1),
  (3, '', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80', 'Find A Place You Will Love', 'Verified properties with authentic tours and transparent neighborhood insights.', 3, 1, '2026-10-03 11:05:27.297706', 1);
/*!40000 ALTER TABLE `cms_heroslide` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `cms_menucategory`: 0 rows (empty)

-- Table `cms_menuitem`: 0 rows (empty)

-- Table `cms_pagecontent`: 7 row(s)
LOCK TABLES `cms_pagecontent` WRITE;
/*!40000 ALTER TABLE `cms_pagecontent` DISABLE KEYS */;
INSERT INTO `cms_pagecontent` (`id`, `title`, `description`, `updated_at`, `slug`) VALUES
  (1, 'Welcome to the EstateHub', 'Welcome to EstateHub, where we turn houses into homes and dreams into reality. At EstateHub, we believe that a home is more than just a physical space; it\'s a place where memories are created, families grow, and life unfolds.', '2026-07-21 13:16:43.537163', 'about-us'),
  (2, 'Drop Us A Line', 'Feel free to connect with us through our online channels for updates, news, and more.', '2026-07-21 13:16:43.537163', 'contact'),
  (3, 'Find Your Perfect Home', 'Search thousands of homes for sale and rent. Connect with trusted agents.', '2026-07-21 13:16:43.537163', 'home'),
  (4, 'Our Services', 'Home / Pages / Our Services', '2026-07-21 13:16:43.537163', 'services'),
  (5, 'Simple, Transparent Pricing', 'Choose the plan that fits your business. Upgrade or cancel anytime.', '2026-07-21 13:16:43.537163', 'pricing'),
  (6, 'From Our Blog', 'LATEST NEW', '2026-07-21 13:16:43.537163', 'blog'),
  (7, 'Property Listings', 'Find your dream property', '2026-07-21 13:16:43.537163', 'listings');
/*!40000 ALTER TABLE `cms_pagecontent` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `cms_sitesetting`: 1 row(s)
LOCK TABLES `cms_sitesetting` WRITE;
/*!40000 ALTER TABLE `cms_sitesetting` DISABLE KEYS */;
INSERT INTO `cms_sitesetting` (`id`, `hero_image`, `logo`, `favicon`, `facebook_url`, `twitter_url`, `instagram_url`, `linkedin_url`, `show_developer_mansib`, `show_developer_stradigtech`, `ceo_name`, `ceo_role`, `ceo_signature`, `contact_address`, `contact_email`, `contact_opentime`, `contact_phone`, `youtube_url`, `hero_description`, `hero_slider_autoplay`, `hero_slider_interval`, `hero_title`, `og_image`) VALUES
  (1, '', 'site/estate_hub_logo_trimmed.png', 'site/Black_and_White_House_Real_Estate_Logo_1DYHC35.jpg', NULL, NULL, NULL, NULL, 0, 1, 'Mansib Ahsan', 'CEO/Founder', '', '', 'estatehub@gmail.com', '', NULL, NULL, 'Search thousands of homes for sale and rent. Connect with trusted agents.', 1, 5000, 'Find Your Perfect Home', 'site/Black_and_White_House_Real_Estate_Logo_zTmwHcP.jpg');
/*!40000 ALTER TABLE `cms_sitesetting` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `django_admin_log`: 12 row(s)
LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` (`id`, `object_id`, `object_repr`, `action_flag`, `change_message`, `content_type_id`, `user_id`, `action_time`) VALUES
  (6, 'de05fa44-b8c9-4f02-ad54-5d558ee0c43c', 'admin', 3, '', 8, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 07:17:43.334025'),
  (7, 'ed71fbd8-82d2-4ae0-8168-0f4f04e16257', 'agent1', 3, '', 8, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 07:17:51.786889'),
  (8, '80e687df-7e40-4986-8e66-ddf877a64b75', 'SuperAdmin', 2, '[{"changed": {"fields": ["Role"]}}]', 8, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 07:18:21.308466'),
  (9, '411ebcc5-0a20-45e2-84fb-ab385de377b0', 'test@gmail.com', 3, '', 8, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 07:18:26.644845'),
  (10, '80e687df-7e40-4986-8e66-ddf877a64b75', 'SuperAdmin', 2, '[{"changed": {"fields": ["First name", "Last name", "Email address"]}}]', 8, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 08:42:18.635431'),
  (11, '70f3c05a-5e5b-454d-b22d-7cb787909c44', 'sifatss@gmail.com', 2, '[{"changed": {"fields": ["Agent status"]}}]', 8, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 09:31:45.197914'),
  (12, '631dc4cc-3748-4704-8405-0abf749f9b0d', 'Casa Lomas de Machalí Machas', 2, '[{"changed": {"fields": ["Status", "Description"]}}]', 9, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 09:45:07.832905'),
  (13, '1', 'Global Site Settings', 2, '[{"changed": {"fields": ["Ceo name"]}}]', 16, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 11:03:43.115196'),
  (14, '1', 'Global Site Settings', 2, '[{"changed": {"fields": ["Logo", "Favicon"]}}]', 16, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 11:08:46.456100'),
  (15, '1', 'Global Site Settings', 2, '[{"changed": {"fields": ["Logo"]}}]', 16, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 11:34:39.303886'),
  (16, '1', 'Global Site Settings', 2, '[{"changed": {"fields": ["Og image"]}}]', 16, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 11:34:53.175942'),
  (17, '631dc4cc-3748-4704-8405-0abf749f9b0d', 'Casa Lomas de Machalí Machas', 2, '[{"changed": {"fields": ["Featured", "Cover Photo (Thumbnail)"]}}]', 9, '80e687df7e4049868e66ddf877a64b75', '2026-10-03 12:48:07.720216');
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `django_content_type`: 22 row(s)
LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
  (1, 'admin', 'logentry'),
  (2, 'auth', 'permission'),
  (3, 'auth', 'group'),
  (4, 'contenttypes', 'contenttype'),
  (5, 'sessions', 'session'),
  (6, 'accounts', 'favorite'),
  (7, 'accounts', 'review'),
  (8, 'accounts', 'user'),
  (9, 'properties', 'property'),
  (10, 'properties', 'nearbyplace'),
  (11, 'billing', 'subscriptionplan'),
  (12, 'billing', 'invoice'),
  (13, 'support', 'inquiry'),
  (14, 'cms', 'menucategory'),
  (15, 'cms', 'menuitem'),
  (16, 'cms', 'sitesetting'),
  (17, 'cms', 'pagecontent'),
  (18, 'cms', 'blogpost'),
  (19, 'support', 'inquirymessage'),
  (20, 'cms', 'heroslide'),
  (21, 'accounts', 'agency'),
  (22, 'accounts', 'agent');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `django_migrations`: 36 row(s)
LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
  (1, 'contenttypes', '0001_initial', '2026-07-19 04:57:44.004310'),
  (2, 'contenttypes', '0002_remove_content_type_name', '2026-07-19 04:57:44.253199'),
  (3, 'auth', '0001_initial', '2026-07-19 04:57:44.358626'),
  (4, 'auth', '0002_alter_permission_name_max_length', '2026-07-19 04:57:44.389468'),
  (5, 'auth', '0003_alter_user_email_max_length', '2026-07-19 04:57:44.405734'),
  (6, 'auth', '0004_alter_user_username_opts', '2026-07-19 04:57:44.420822'),
  (7, 'auth', '0005_alter_user_last_login_null', '2026-07-19 04:57:44.435541'),
  (8, 'auth', '0006_require_contenttypes_0002', '2026-07-19 04:57:44.446289'),
  (9, 'auth', '0007_alter_validators_add_error_messages', '2026-07-19 04:57:44.460004'),
  (10, 'auth', '0008_alter_user_username_max_length', '2026-07-19 04:57:44.476978'),
  (11, 'auth', '0009_alter_user_last_name_max_length', '2026-07-19 04:57:44.488602'),
  (12, 'auth', '0010_alter_group_name_max_length', '2026-07-19 04:57:44.507221'),
  (13, 'auth', '0011_update_proxy_permissions', '2026-07-19 04:57:44.515096'),
  (14, 'auth', '0012_alter_user_first_name_max_length', '2026-07-19 04:57:44.524598'),
  (15, 'accounts', '0001_initial', '2026-07-19 04:57:44.548291'),
  (16, 'properties', '0001_initial', '2026-07-19 04:57:44.579435'),
  (17, 'accounts', '0002_initial', '2026-07-19 04:57:44.664105'),
  (18, 'admin', '0001_initial', '2026-07-19 04:57:44.687123'),
  (19, 'admin', '0002_logentry_remove_auto_add', '2026-07-19 04:57:44.711036'),
  (20, 'admin', '0003_logentry_add_action_flag_choices', '2026-07-19 04:57:44.726177'),
  (21, 'billing', '0001_initial', '2026-07-19 04:57:44.750791'),
  (22, 'sessions', '0001_initial', '2026-07-19 04:57:44.762505'),
  (23, 'support', '0001_initial', '2026-07-19 04:57:44.800986'),
  (24, 'cms', '0001_initial', '2026-07-20 13:36:24.292387'),
  (25, 'cms', '0002_sitesetting', '2026-07-20 13:51:44.479581'),
  (26, 'cms', '0003_sitesetting_show_developer_mansib_and_more', '2026-07-20 15:04:01.425738'),
  (27, 'cms', '0004_pagecontent', '2026-07-21 12:37:00.711190'),
  (28, 'cms', '0005_sitesetting_ceo_name_sitesetting_ceo_role_and_more', '2026-07-21 12:46:48.363880'),
  (29, 'cms', '0006_sitesetting_youtube_url', '2026-07-21 12:52:05.703176'),
  (30, 'cms', '0007_blogpost_pagecontent_updated_at_and_more', '2026-07-21 13:16:43.546892'),
  (31, 'accounts', '0003_alter_user_managers_user_agent_status', '2026-10-03 08:54:57.455833'),
  (32, 'properties', '0002_property_floor_plan_images', '2026-10-03 10:10:13.519464'),
  (33, 'support', '0002_alter_inquiry_options_inquiry_customer_and_more', '2026-10-03 10:32:21.435683'),
  (34, 'cms', '0008_sitesetting_hero_description_and_more', '2026-10-03 11:04:31.499742'),
  (35, 'cms', '0009_sitesetting_og_image', '2026-10-03 11:10:39.050951'),
  (36, 'accounts', '0004_agency_agent_user_agent_title_user_is_featured_agent_and_more', '2026-10-03 11:21:09.264637');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `django_session`: 29 row(s)
LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
  ('ymvbhjkghu8ypt4pps6wh6lgjfdql21x', '.eJxVjTsOwjAQBe_imlj-rbEp6TlDtN5dkwBKpHwqxN0JKAXUb2beU7W4Ll27zjK1PauTYjFQMYSmJMpNqMY1yBAaYIAkYih4UodfrSDdZfi6Nxyuo6ZxWKa-6A-i93XWl5Hlcd7Zv0CHc7fZfvuKmEgkAnLGICWCZbCSPPvqE1Nx1RzJYbbRCVpHrhAQ-2Qki3q9AVELQlY:1wlJci:p_bt5Ko1xpKh8qRwcY82NFfDFLqP9ENvzBsRUThLFGo', '2026-08-02 04:59:32.796589'),
  ('z8rlqp0591inhzvmwuv95y17ob3i4ate', '.eJxVjTsOwjAQBe_imlj-rbEp6TlDtN5dkwBKpHwqxN0JKAXUb2beU7W4Ll27zjK1PauTYjFQMYSmJMpNqMY1yBAaYIAkYih4UodfrSDdZfi6Nxyuo6ZxWKa-6A-i93XWl5Hlcd7Zv0CHc7fZfvuKmEgkAnLGICWCZbCSPPvqE1Nx1RzJYbbRCVpHrhAQ-2Qki3q9AVELQlY:1wlo11:hFQHX7UhiKg92EG5uQ4Y0fepYZjq1Q80Cmj1zDpC1FI', '2026-08-03 13:26:39.747492'),
  ('9wnicq7yorrcjxyndzqjefoc42ay3dfi', '.eJxVzEkOwjAMheG7ZE2rkMF2WLLnDFXsOJRBrdRhhbg7VOoC1u__3st0eV36bp116m7FnAxZBcJSG9Rgm5AIGlKAppRKiBkCYzSHX8ZZHjpsttzzcB1bGYdlunG7Je2-zu1lLPo87-3fQZ_n_qttxRSBCoF3QhLVRXY1WPDBY6QqlZlRSRlBhMFLEutSOrqgXoXN-wPG1kEo:1xCvP5:70DHp91YO5p-EiqdYU3XSm3u1sXXLmMy3QyMp-9IYoo', '2026-10-17 08:47:35.234814'),
  ('40517falwfhmpubvxhxzquydrw21ldn2', '.eJxVzEkOwjAMheG7ZE2rkMF2WLLnDFXsOJRBrdRhhbg7VOoC1u__3st0eV36bp116m7FnAxZBcJSG9Rgm5AIGlKAppRKiBkCYzSHX8ZZHjpsttzzcB1bGYdlunG7Je2-zu1lLPo87-3fQZ_n_qttxRSBCoF3QhLVRXY1WPDBY6QqlZlRSRlBhMFLEutSOrqgXoXN-wPG1kEo:1xCvPC:_XxjHFCXRSll52mXSksU_-tXUv7WHZrn8NbWTFIaPKc', '2026-10-17 08:47:42.118370'),
  ('muprf5f37v8aoah2rrcq5yu1vniuqyq5', '.eJxVzEkOwjAMheG7ZE2rkMF2WLLnDFXsOJRBrdRhhbg7VOoC1u__3st0eV36bp116m7FnAxZBcJSG9Rgm5AIGlKAppRKiBkCYzSHX8ZZHjpsttzzcB1bGYdlunG7Je2-zu1lLPo87-3fQZ_n_qttxRSBCoF3QhLVRXY1WPDBY6QqlZlRSRlBhMFLEutSOrqgXoXN-wPG1kEo:1xCvPY:W-jPM3HPVIGgJ3xfrGqdj2fClda27Wni7S7UBOMMN4Q', '2026-10-17 08:48:04.935130'),
  ('fs0yzizmleg8ggzzfl9ta0fupjm9uoyn', '.eJxVzEkOwjAMheG7ZE2rkMF2WLLnDFXsOJRBrdRhhbg7VOoC1u__3st0eV36bp116m7FnAxZBcJSG9Rgm5AIGlKAppRKiBkCYzSHX8ZZHjpsttzzcB1bGYdlunG7Je2-zu1lLPo87-3fQZ_n_qttxRSBCoF3QhLVRXY1WPDBY6QqlZlRSRlBhMFLEutSOrqgXoXN-wPG1kEo:1xCvPr:MrBolALPYb4fVyi59dO__ifM87d5Z5AJSFRD-hOSc08', '2026-10-17 08:48:23.792008'),
  ('svh0jy2wxndist4fwzjsevhufl0tj9xw', '.eJxVzEkOwjAMheG7ZE2rkMF2WLLnDFXsOJRBrdRhhbg7VOoC1u__3st0eV36bp116m7FnAxZBcJSG9Rgm5AIGlKAppRKiBkCYzSHX8ZZHjpsttzzcB1bGYdlunG7Je2-zu1lLPo87-3fQZ_n_qttxRSBCoF3QhLVRXY1WPDBY6QqlZlRSRlBhMFLEutSOrqgXoXN-wPG1kEo:1xCvRs:2TfmqNEmxLijvdoGiwRjqYka0GMJyoUSik4cZJa1irI', '2026-10-17 08:50:28.904679'),
  ('w2mypeodywcw6kuchme7qecwlg7tfdhy', '.eJxVzEkOwjAMheG7ZE2rkMF2WLLnDFXsOJRBrdRhhbg7VOoC1u__3st0eV36bp116m7FnAxZBcJSG9Rgm5AIGlKAppRKiBkCYzSHX8ZZHjpsttzzcB1bGYdlunG7Je2-zu1lLPo87-3fQZ_n_qttxRSBCoF3QhLVRXY1WPDBY6QqlZlRSRlBhMFLEutSOrqgXoXN-wPG1kEo:1xCvSG:NkD-16Gfe9L8uin45_eYY-NcSquMxx1lJ6KToT1ig88', '2026-10-17 08:50:52.372585'),
  ('1ds7a0wfd1t6ryrj6nfq716sh6d5jodh', '.eJxVzEkOwjAMheG7ZE2rkMF2WLLnDFXsOJRBrdRhhbg7VOoC1u__3st0eV36bp116m7FnAxZBcJSG9Rgm5AIGlKAppRKiBkCYzSHX8ZZHjpsttzzcB1bGYdlunG7Je2-zu1lLPo87-3fQZ_n_qttxRSBCoF3QhLVRXY1WPDBY6QqlZlRSRlBhMFLEutSOrqgXoXN-wPG1kEo:1xCvSe:qySS0y1uxYpj66T_5GrT_4a3GLyzTWlYxcvTkBvDd7o', '2026-10-17 08:51:16.194680'),
  ('nsowq244t9uznwsdop9pd26gzyiryxbh', '.eJxVzEkOwjAMheG7ZE2rkMF2WLLnDFXsOJRBrdRhhbg7VOoC1u__3st0eV36bp116m7FnAxZBcJSG9Rgm5AIGlKAppRKiBkCYzSHX8ZZHjpsttzzcB1bGYdlunG7Je2-zu1lLPo87-3fQZ_n_qttxRSBCoF3QhLVRXY1WPDBY6QqlZlRSRlBhMFLEutSOrqgXoXN-wPG1kEo:1xCvSr:jKfK1pVvE3EWua0liUXy2bA_BeWu8c5pb9PZVrSGY_Q', '2026-10-17 08:51:29.318968'),
  ('cpsdfoqwhl8m65jwhhrwtg6lbd9af3n4', '.eJxVzEkOwjAMheG7ZE2rkMF2WLLnDFXsOJRBrdRhhbg7VOoC1u__3st0eV36bp116m7FnAxZBcJSG9Rgm5AIGlKAppRKiBkCYzSHX8ZZHjpsttzzcB1bGYdlunG7Je2-zu1lLPo87-3fQZ_n_qttxRSBCoF3QhLVRXY1WPDBY6QqlZlRSRlBhMFLEutSOrqgXoXN-wPG1kEo:1xCvUE:mREnqbdQdlg93RGK1mDP7u9NnDrVLakwbOFvQ5-27M8', '2026-10-17 08:52:54.745415'),
  ('xxiwf9rs2lz2xf3vngmeqh73mt4c2ctr', '.eJxVzEkOwjAMheG7ZE2rkMF2WLLnDFXsOJRBrdRhhbg7VOoC1u__3st0eV36bp116m7FnAxZBcJSG9Rgm5AIGlKAppRKiBkCYzSHX8ZZHjpsttzzcB1bGYdlunG7Je2-zu1lLPo87-3fQZ_n_qttxRSBCoF3QhLVRXY1WPDBY6QqlZlRSRlBhMFLEutSOrqgXoXN-wPG1kEo:1xCxax:oR5tlb_LPUfBF1Q64V1GZ4Ter1JFk6yFEZpNPQWzDeA', '2026-10-17 11:07:59.653623'),
  ('e0ajgz7g8jhjdnnha62o77jihoxfy1e9', '.eJxVzEkOwjAMheG7ZE2rkMF2WLLnDFXsOJRBrdRhhbg7VOoC1u__3st0eV36bp116m7FnAxZBcJSG9Rgm5AIGlKAppRKiBkCYzSHX8ZZHjpsttzzcB1bGYdlunG7Je2-zu1lLPo87-3fQZ_n_qttxRSBCoF3QhLVRXY1WPDBY6QqlZlRSRlBhMFLEutSOrqgXoXN-wPG1kEo:1xCxbA:Kmdow9Txcwf9Tom2xmUWHDJkz9ub7SpXH8KEGFbUuP4', '2026-10-17 11:08:12.045056'),
  ('dwdai97ajlt6u6hxoh993k1p6ur4nkcg', '.eJxVjjsOwjAQBe_iGls2_qyXkp4zRBvvmgRQIuVTIe5OIqWA-s2M3ls1tC5ds84yNT2ri8pWUgauGiRYHTAnnSUlzVwzAKXQQlSnX62l8pRhd_lBw300ZRyWqW_Njphjnc1tZHldD_Yv0NHcbXY4R0SuBVmc9y7Zs0VPKRbiaLNI9RjFkQAygK-JHAUIMQIKbp-z-nwBwatAeQ:1xCxzU:1yINQ-Ub6v76IBv1FO7MfYVQS4-CvaQ99UGnzL-KfM0', '2026-10-17 11:33:20.961518'),
  ('hmm4pf8ij6huzqfbpcr6b7eodxzzdeep', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzHz:wlgecNMOgHETj5wAkhyNY7Ntq3_EjHRHpvh-R9MW_IQ', '2026-10-17 12:56:31.877509'),
  ('3eztpvjxmn7s7beaddj3dosspvl86kvh', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzIZ:HFf7flZygJeOdrus6VjX2B9156HjfjzZW5JVAkDdxd0', '2026-10-17 12:57:07.032694'),
  ('56ylfa4lsyg870dy890trnlzfqbi9jov', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzJc:DGNz9u2EohdbmgQ0M9nFZByjw6ezJewvOlBmgN9qkBE', '2026-10-17 12:58:12.354062'),
  ('jmwpsr2jdzk4cv1yvick6iw05xmz9u6j', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzKg:uA_7KBHfb9XfNUWOEvqQzDNQXRCWx6qbLGMwgWYiHfo', '2026-10-17 12:59:18.296081'),
  ('swdsm42i17kwfqvw791smj3razza4r8h', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzQh:1rBD_nkV0KDRXDfXp_VDBNdK6w5iQ6LqAzDoY5r0feM', '2026-10-17 13:05:31.734369'),
  ('ezb53sgn1vhpu8jcvhnpz7t5ahtz7g5f', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzRH:ywZw1Snf3IRaJLmZHWUMGsR3PcZpnjBTiPew9O0snao', '2026-10-17 13:06:07.278460'),
  ('upziueb3i38ddm4m6x7zcbxbrt403yxv', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzRR:EiPrJIvUBHp4ya9oI0yJ2bb1nGscDXyH1Buw1sNqTi4', '2026-10-17 13:06:17.408856'),
  ('b5jpee9vmzsvkct7fkxbprisjsy2ezq1', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzYQ:y7FKoei-karDm5eNtRL5vCmbAX4pXINLDpuWZNDGG7Y', '2026-10-17 13:13:30.633244'),
  ('z9kzrdjb722smw79h6idv5i521f19r8g', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzYW:59MlNQQeM7njXjjc6E9xKuDmIgN_cytU0Ki18F7Aw1c', '2026-10-17 13:13:36.532639'),
  ('z6bg0oe2pfr9d7u20kkxo90jrxehq58g', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzd6:RQSqWOpZLES0WOfK6G_IWdFLb-L6Nogs-012t8ebSLY', '2026-10-17 13:18:20.894419'),
  ('ophdz1312bdnmy4udwo69ys5bhajpv9z', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzdQ:rbQSHnHfFSNWMoAvtyQL3PfZ-5C0ubiejlBTdePW9x8', '2026-10-17 13:18:40.838784'),
  ('1yvpw2v5j8019ick0m30spcpqp462pg0', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzdX:QyJN8L4hMgzT4vtx9YdMpb9-ankNGuqi6_-iykpYhdg', '2026-10-17 13:18:47.017296'),
  ('q938z01xv27m0rfghsijjtija5wkb4lb', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzdh:daXMhgdvRw0uovgHyoZ2ZyIgSWSsi2zfrY9Eo8701ro', '2026-10-17 13:18:57.454342'),
  ('yvo2spx8u1z2razqaa0py51olbmqsse2', '.eJxVjrsOgkAQRf9layEL-5gdSxNLY2VNhp3ZQOSRsFAZ_11MKLS9OefkvlRD29o1W5al6VmdVdDiA3AqQKwuLAZfBPG-YE4BgLxtwanTr9ZSfMr0dSnGeZvWXB5TLq8j9cN9eezcRKPcZpbhcvB_kY5ytxds7RA5RWSpjKm8rjUa8i4SOx1EkkEnFQkgA5jkqSIL1jlAwf13UO8PCixCUA:1xCzdp:GBaMFS_r44xLNnWTTbyp1IXsp4hauLgb9XChSXhuGXA', '2026-10-17 13:19:05.237739'),
  ('62hjnwznxewx73xjhzdbslk1hf0ne6w1', '.eJxVjLsKwkAQAP_lahPu9h65WAqWYmUd9nb3SDAPyKMS_90IKbQdZualGtzWttkWmZuO1VlxQAEWX4AlXbhEoUgx5kKLpxylrrMO6vSbJaSnjN8WiaZtXJfyQEt5HbDr7_Nj90Yc5Dax9JfD_5u0uLT7wVTaMrKBiMkz-FhbZ6qUMScXCEIEYGugosqw0c5olqx9dqCR2Meg3h-XN0MJ:1xDEm1:y7Rsv49Jls6u4rYT1Sn7aXDQ4AaUwiO4NmIm-y4pcnw', '2026-10-18 05:28:33.094281');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `properties_nearbyplace`: 0 rows (empty)

-- Table `properties_property`: 6 row(s)
LOCK TABLES `properties_property` WRITE;
/*!40000 ALTER TABLE `properties_property` DISABLE KEYS */;
INSERT INTO `properties_property` (`id`, `title`, `description`, `price`, `listing_type`, `property_type`, `bedrooms`, `bathrooms`, `size`, `lot_size`, `address`, `city`, `state`, `zip_code`, `latitude`, `longitude`, `status`, `amenities`, `images`, `floor_plan_image`, `video_url`, `virtual_tour_url`, `agent_name`, `views`, `featured`, `year_built`, `parking`, `rejection_note`, `created_date`, `agent_id`, `floor_plan_images`) VALUES
  ('631dc4cc3748470484050abf749f9b0d', 'Casa Lomas de Machalí Machas', 'Located around an hour away from Paris, between the Perche and the Iton valley, in a beautiful wooded park bordered by a charming stream, this country property immediately seduces with its bucolic and soothing environment.\r\n\r\nAn ideal choice for sports and leisure enthusiasts who will be able to take advantage of its swimming pool (11m x 5m), tennis court, gym and sauna', 7500, 'for_sale', 'house', 9, 3, 900, 2000, '145 Brooklyn Ave, Califonia', 'New York City', 'New York', NULL, NULL, NULL, 'active', '["Pool", "Garden", "Wifi", "Balcony", "Parking", "Air Conditioning", "Gym", "Garage", "Pet Friendly", "Fireplace", "Security System", "Furnished", "Heating", "Solar Panels", "Smart Home"]', '["http://localhost:8000/media/uploads/8daa768d7c7f4e7ea4a26de212075103.jpg", "http://localhost:8000/media/uploads/fdf4f75e17af496b9fff4e55ef2a4f04.jpg", "http://localhost:8000/media/uploads/ff7eb311a23048998ccd8812f4f2ce70.jpg"]', 'http://localhost:8000/media/uploads/0f5d7da94195480f9f1f99537a314845.png', NULL, NULL, 'Sifat Rahman', 6, 1, 2024, 1, '', '2026-10-03 09:43:51.348086', '70f3c05a5e5b454db22d7cb787909c44', '["http://localhost:8000/media/uploads/0f5d7da94195480f9f1f99537a314845.png", "http://localhost:8000/media/uploads/dc60eae3300e4506a2287e6d61cab5f1.png"]'),
  ('15ee4075038f44fc82e4f35c3a792cb9', 'Test Upload Prop', NULL, 100000, 'for_sale', 'house', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pending', '[]', '["https://test.com/existing.jpg"]', NULL, NULL, NULL, NULL, 0, 0, NULL, 0, NULL, '2026-10-03 10:15:48.464925', NULL, '[]'),
  ('09ffdeed006f43f8b34d8ef39dded931', 'Modern Townhouse with Panoramic City Views', 'Stunning contemporary townhouse featuring open layout, floor-to-ceiling windows, private rooftop terrace, and smart home system.', 750000, 'for_sale', 'townhouse', 3, 3, 2200, 2500, '742 Evergreen Terrace', 'New York', 'NY', '10001', NULL, NULL, 'rejected', '["Air Conditioning", "Balcony", "Garage", "Security System", "Smart Home"]', '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]', NULL, NULL, NULL, 'Chris Patt', 2, 1, 2022, 2, 'Rejected by administrator.', '2026-10-03 11:30:12.913204', '4368471900a04bc38c178f86010df9db', '[]'),
  ('5548175dcee44cd986836aa835e7a25c', 'Luxury Waterfront Villa with Private Pool', 'Magnificent waterfront property offering breathtaking sunset views, infinity pool, lush tropical gardens, and private boat dock.', 1250000, 'for_sale', 'house', 5, 4, 3800, 6000, '108 Ocean Boulevard', 'Miami', 'FL', '33139', NULL, NULL, 'active', '["Swimming Pool", "Waterfront View", "Garden", "Wine Cellar", "Gated Security"]', '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]', NULL, NULL, NULL, 'Esther Howard', 0, 1, 2023, 3, NULL, '2026-10-03 11:30:12.918080', '68d156544ff14e3586a8be604655a218', '[]'),
  ('9e392eb277014835942b20e3ef3634a0', 'Chic Downtown Loft with Industrial Accents', 'Expansive loft in the heart of downtown boasting exposed brick, soaring 14-foot ceilings, chef kitchen, and dedicated workspace.', 3400, 'for_rent', 'apartment', 2, 2, 1350, 0, '452 Broadway, Loft 4B', 'Los Angeles', 'CA', '90013', NULL, NULL, 'active', '["Gym", "High Ceilings", "Washer/Dryer", "Doorman", "Wifi", "Garden", "Pool", "Balcony", "Parking", "Security System", "Furnished", "Air Conditioning", "Heating", "Garage", "Fireplace", "Pet Friendly"]', '["http://localhost:8000/media/uploads/66e0054e01c14e2a874a3e0b1fd9ca62.jpg"]', 'http://localhost:8000/media/uploads/aaae798a297a443ea8552d060181952c.png', '', '', 'Darrell Steward', 1, 1, 2020, 1, NULL, '2026-10-03 11:30:12.921613', 'a675c972a5f34934864cef7c85d2a99c', '["http://localhost:8000/media/uploads/aaae798a297a443ea8552d060181952c.png"]'),
  ('95a0f44b90324eb590103cfeb06cd68f', 'Contemporary Hillside Residence with Garden', 'Elegantly designed family home nestled in peaceful hills, featuring expansive deck, open chef kitchen, master suite, and solar panels.', 620000, 'for_sale', 'house', 4, 3, 2750, 4500, '890 Hillcrest Lane', 'Austin', 'TX', '78701', NULL, NULL, 'active', '["Solar Panels", "Fireplace", "Hardwood Floors", "Backyard", "Attached Garage"]', '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"]', NULL, NULL, NULL, 'Robert Fox', 1, 1, 2021, 2, NULL, '2026-10-03 11:30:12.925617', '8ca73e9628c741e2b8c2169bb3396e47', '[]');
/*!40000 ALTER TABLE `properties_property` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `support_inquiry`: 1 row(s)
LOCK TABLES `support_inquiry` WRITE;
/*!40000 ALTER TABLE `support_inquiry` DISABLE KEYS */;
INSERT INTO `support_inquiry` (`id`, `name`, `email`, `phone`, `message`, `status`, `created_date`, `agent_id`, `property_id`, `customer_id`, `updated_date`) VALUES
  ('ee4a76b439c34e07b19ffde8ee162192', 'James', 'james@gmail.com', '01686492382', 'I am  interested', 'replied', '2026-10-03 10:29:26.925925', '70f3c05a5e5b454db22d7cb787909c44', '631dc4cc3748470484050abf749f9b0d', 'e9427e4ff2ce446c8e4bfa61376414f2', '2026-10-03 10:56:18.379925');
/*!40000 ALTER TABLE `support_inquiry` ENABLE KEYS */;
UNLOCK TABLES;

-- Table `support_inquirymessage`: 4 row(s)
LOCK TABLES `support_inquirymessage` WRITE;
/*!40000 ALTER TABLE `support_inquirymessage` DISABLE KEYS */;
INSERT INTO `support_inquirymessage` (`id`, `sender_name`, `sender_email`, `sender_role`, `message`, `created_date`, `inquiry_id`, `sender_id`) VALUES
  ('f39037611f9e43f693059e811866531a', 'Sifat Rahman', 'sifatss@gmail.com', 'agent', '👋 Hello! Thank you for reaching out. When would you like to schedule a viewing?', '2026-10-03 10:40:14.717071', 'ee4a76b439c34e07b19ffde8ee162192', '70f3c05a5e5b454db22d7cb787909c44'),
  ('cdea61ae6c7046e2b23dede42e01d68e', 'James Nob', 'james@gmail.com', 'customer', 'Hi Sifat, Saturday 2 PM works great for viewing!', '2026-10-03 10:45:24.261964', 'ee4a76b439c34e07b19ffde8ee162192', 'e9427e4ff2ce446c8e4bfa61376414f2'),
  ('e040ec9f6c43475dbf0bfedbdef7fc6d', 'James Nob', 'james@gmail.com', 'customer', '📋 Could you share more information about the pricing and terms?', '2026-10-03 10:55:57.562440', 'ee4a76b439c34e07b19ffde8ee162192', 'e9427e4ff2ce446c8e4bfa61376414f2'),
  ('10d462e0a37444c3aada030cbe63bf46', 'Sifat Rahman', 'sifatss@gmail.com', 'agent', '📞 I would be happy to discuss this over a call. When is a good time for you?', '2026-10-03 10:56:18.367027', 'ee4a76b439c34e07b19ffde8ee162192', '70f3c05a5e5b454db22d7cb787909c44');
/*!40000 ALTER TABLE `support_inquirymessage` ENABLE KEYS */;
UNLOCK TABLES;

-- ----------------------------------------------------------------------------
-- Constraints and Indexes
-- ----------------------------------------------------------------------------

ALTER TABLE `django_admin_log` ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`);
ALTER TABLE `django_admin_log` ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);
CREATE INDEX `django_admin_log_user_id_c564eba6` ON `django_admin_log` (`user_id`);
CREATE INDEX `django_admin_log_content_type_id_c4bce8eb` ON `django_admin_log` (`content_type_id`);
ALTER TABLE `auth_permission` ADD CONSTRAINT `auth_permission_content_type_id_codename_01ab375a_uniq` UNIQUE (`content_type_id`, `codename`);
ALTER TABLE `auth_permission` ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);
CREATE INDEX `auth_permission_content_type_id_2f476e4b` ON `auth_permission` (`content_type_id`);
ALTER TABLE `auth_group_permissions` ADD CONSTRAINT `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` UNIQUE (`group_id`, `permission_id`);
ALTER TABLE `auth_group_permissions` ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);
ALTER TABLE `auth_group_permissions` ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`);
CREATE INDEX `auth_group_permissions_group_id_b120cbf9` ON `auth_group_permissions` (`group_id`);
CREATE INDEX `auth_group_permissions_permission_id_84c5c92e` ON `auth_group_permissions` (`permission_id`);
ALTER TABLE `django_content_type` ADD CONSTRAINT `django_content_type_app_label_model_76bd3d3b_uniq` UNIQUE (`app_label`, `model`);
CREATE INDEX `django_session_expire_date_a5c62663` ON `django_session` (`expire_date`);
ALTER TABLE `accounts_user` ADD CONSTRAINT `accounts_user_agency_id_ba328885_fk_accounts_agency_id` FOREIGN KEY (`agency_id`) REFERENCES `accounts_agency` (`id`);
CREATE INDEX `accounts_user_agency_id_ba328885` ON `accounts_user` (`agency_id`);
ALTER TABLE `accounts_user_groups` ADD CONSTRAINT `accounts_user_groups_user_id_group_id_59c0b32f_uniq` UNIQUE (`user_id`, `group_id`);
ALTER TABLE `accounts_user_groups` ADD CONSTRAINT `accounts_user_groups_user_id_52b62117_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`);
ALTER TABLE `accounts_user_groups` ADD CONSTRAINT `accounts_user_groups_group_id_bd11a704_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);
CREATE INDEX `accounts_user_groups_user_id_52b62117` ON `accounts_user_groups` (`user_id`);
CREATE INDEX `accounts_user_groups_group_id_bd11a704` ON `accounts_user_groups` (`group_id`);
ALTER TABLE `accounts_user_user_permissions` ADD CONSTRAINT `accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq` UNIQUE (`user_id`, `permission_id`);
ALTER TABLE `accounts_user_user_permissions` ADD CONSTRAINT `accounts_user_user_p_user_id_e4f0a161_fk_accounts_` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`);
ALTER TABLE `accounts_user_user_permissions` ADD CONSTRAINT `accounts_user_user_p_permission_id_113bb443_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`);
CREATE INDEX `accounts_user_user_permissions_user_id_e4f0a161` ON `accounts_user_user_permissions` (`user_id`);
CREATE INDEX `accounts_user_user_permissions_permission_id_113bb443` ON `accounts_user_user_permissions` (`permission_id`);
ALTER TABLE `accounts_favorite` ADD CONSTRAINT `accounts_favorite_user_id_081a5fb5_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`);
ALTER TABLE `accounts_favorite` ADD CONSTRAINT `accounts_favorite_property_id_67e53925_fk_properties_property_id` FOREIGN KEY (`property_id`) REFERENCES `properties_property` (`id`);
CREATE INDEX `accounts_favorite_user_id_081a5fb5` ON `accounts_favorite` (`user_id`);
CREATE INDEX `accounts_favorite_property_id_67e53925` ON `accounts_favorite` (`property_id`);
ALTER TABLE `accounts_review` ADD CONSTRAINT `accounts_review_agent_id_f84c39a2_fk_accounts_user_id` FOREIGN KEY (`agent_id`) REFERENCES `accounts_user` (`id`);
CREATE INDEX `accounts_review_agent_id_f84c39a2` ON `accounts_review` (`agent_id`);
ALTER TABLE `properties_property` ADD CONSTRAINT `properties_property_agent_id_469d1bc8_fk_accounts_user_id` FOREIGN KEY (`agent_id`) REFERENCES `accounts_user` (`id`);
CREATE INDEX `properties_property_agent_id_469d1bc8` ON `properties_property` (`agent_id`);
ALTER TABLE `properties_nearbyplace` ADD CONSTRAINT `properties_nearbypla_property_id_407e870b_fk_propertie` FOREIGN KEY (`property_id`) REFERENCES `properties_property` (`id`);
CREATE INDEX `properties_nearbyplace_property_id_407e870b` ON `properties_nearbyplace` (`property_id`);
ALTER TABLE `billing_invoice` ADD CONSTRAINT `billing_invoice_user_id_f4bf734a_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`);
CREATE INDEX `billing_invoice_user_id_f4bf734a` ON `billing_invoice` (`user_id`);
ALTER TABLE `support_inquiry` ADD CONSTRAINT `support_inquiry_property_id_d6f81e91_fk_properties_property_id` FOREIGN KEY (`property_id`) REFERENCES `properties_property` (`id`);
ALTER TABLE `support_inquiry` ADD CONSTRAINT `support_inquiry_agent_id_77f5c723_fk_accounts_user_id` FOREIGN KEY (`agent_id`) REFERENCES `accounts_user` (`id`);
ALTER TABLE `support_inquiry` ADD CONSTRAINT `support_inquiry_customer_id_9c7e96cd_fk_accounts_user_id` FOREIGN KEY (`customer_id`) REFERENCES `accounts_user` (`id`);
CREATE INDEX `support_inquiry_property_id_d6f81e91` ON `support_inquiry` (`property_id`);
CREATE INDEX `support_inquiry_agent_id_77f5c723` ON `support_inquiry` (`agent_id`);
CREATE INDEX `support_inquiry_customer_id_9c7e96cd` ON `support_inquiry` (`customer_id`);
ALTER TABLE `support_inquirymessage` ADD CONSTRAINT `support_inquirymessage_inquiry_id_40bb3949_fk_support_inquiry_id` FOREIGN KEY (`inquiry_id`) REFERENCES `support_inquiry` (`id`);
ALTER TABLE `support_inquirymessage` ADD CONSTRAINT `support_inquirymessage_sender_id_ebb7ffdb_fk_accounts_user_id` FOREIGN KEY (`sender_id`) REFERENCES `accounts_user` (`id`);
CREATE INDEX `support_inquirymessage_inquiry_id_40bb3949` ON `support_inquirymessage` (`inquiry_id`);
CREATE INDEX `support_inquirymessage_sender_id_ebb7ffdb` ON `support_inquirymessage` (`sender_id`);
ALTER TABLE `cms_menuitem` ADD CONSTRAINT `cms_menuitem_category_id_e3129953_fk_cms_menucategory_id` FOREIGN KEY (`category_id`) REFERENCES `cms_menucategory` (`id`);
CREATE INDEX `cms_menuitem_category_id_e3129953` ON `cms_menuitem` (`category_id`);
CREATE INDEX `cms_pagecontent_slug_23c7b868` ON `cms_pagecontent` (`slug`);
CREATE INDEX `cms_blogpost_slug_d1482d56` ON `cms_blogpost` (`slug`);
ALTER TABLE `cms_heroslide` ADD CONSTRAINT `cms_heroslide_site_setting_id_b1f1c87e_fk_cms_sitesetting_id` FOREIGN KEY (`site_setting_id`) REFERENCES `cms_sitesetting` (`id`);
CREATE INDEX `cms_heroslide_site_setting_id_b1f1c87e` ON `cms_heroslide` (`site_setting_id`);

-- ----------------------------------------------------------------------------
-- Finalize Transaction & Restore Settings
-- ----------------------------------------------------------------------------

COMMIT;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION;
SET SQL_MODE=@OLD_SQL_MODE;
