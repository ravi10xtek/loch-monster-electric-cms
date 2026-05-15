import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_tags" AS ENUM('guides', 'warnings', 'safety', 'upgrades', 'compliance', 'products', 'insurance');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_services_parent_category" AS ENUM('residential-electrical-services', 'commercial-electrical-services', 'hoa-electrical-services');
  CREATE TYPE "public"."enum_services_parent_hub" AS ENUM('electrical-repairs', 'electrical-upgrades', 'installations', 'safety-compliance', 'commercial-repairs', 'compliance-infrastructure', 'lighting-systems', 'power-distribution', 'hoa-common-areas', 'hoa-emergency-repairs', 'hoa-ev-charging', 'hoa-inspections');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_variant" AS ENUM('orange', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_image_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_faqs_tags" AS ENUM('home', 'pricing', 'residential', 'commercial', 'hoa', 'service-areas', 'general', 'electrical-repairs', 'electrical-upgrades', 'installations', 'safety-compliance', 'commercial-repairs', 'power-distribution', 'lighting-systems', 'compliance-infrastructure', 'hoa-common-areas', 'hoa-emergency-repairs', 'hoa-ev-charging', 'hoa-inspections');
  CREATE TYPE "public"."enum_service_hubs_slug" AS ENUM('residential-electrical-services', 'commercial-electrical-services', 'hoa-electrical-services');
  CREATE TYPE "public"."enum_category_hubs_parent_hub" AS ENUM('residential-electrical-services', 'commercial-electrical-services', 'hoa-electrical-services');
  CREATE TYPE "public"."enum_seo_audits_issues_category" AS ENUM('seo', 'performance', 'accessibility', 'best-practices');
  CREATE TYPE "public"."enum_seo_audits_issues_severity" AS ENUM('error', 'warning', 'info');
  CREATE TYPE "public"."enum_home_page_pricing_cards_badge_style" AS ENUM('orange', 'outline');
  CREATE TYPE "public"."enum_pricing_page_pricing_cards_badge_style" AS ENUM('orange', 'outline');
  CREATE TYPE "public"."enum_seo_settings_lme_keywords_priority" AS ENUM('high', 'medium', 'low');
  CREATE TABLE "posts_toc" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "posts_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "posts_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_posts_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"body_html" varchar,
  	"faq_title" varchar DEFAULT 'Frequently Asked Questions',
  	"cover_image_id" integer,
  	"cover_gradient" varchar,
  	"featured" boolean DEFAULT false,
  	"read_time" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"status" "enum_posts_status" DEFAULT 'draft' NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "page_seo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"meta_title" varchar NOT NULL,
  	"meta_description" varchar NOT NULL,
  	"og_image_id" integer,
  	"canonical_url" varchar,
  	"no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"state" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"county" varchar,
  	"lat" numeric,
  	"lng" numeric,
  	"blurb" varchar NOT NULL,
  	"hero_image_id" integer,
  	"city_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "locations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locations_id" integer
  );
  
  CREATE TABLE "services_hero_title" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "services_scenarios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"parent_category" "enum_services_parent_category" NOT NULL,
  	"parent_hub" "enum_services_parent_hub" NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_tagline" varchar,
  	"hero_body" varchar,
  	"hero_image_id" integer,
  	"when_heading" varchar,
  	"when_gradient" varchar,
  	"when_color" varchar,
  	"when_image_id" integer,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_breadcrumb" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"tagline" varchar,
  	"body" varchar,
  	"cta_label" varchar DEFAULT 'CALL NOW — 763-292-1191',
  	"cta_href" varchar DEFAULT '/contact-us',
  	"background_gradient" varchar DEFAULT 'linear-gradient(135deg,#1a1a1a 0%,#2e2e2e 100%)',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_when_do_you_need_scenarios" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_when_do_you_need" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"gradient" varchar DEFAULT 'linear-gradient(160deg,#111,#2a2a2a)',
  	"color" varchar DEFAULT '#1a1a1a',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"tagline" varchar,
  	"body" varchar,
  	"href" varchar,
  	"color" varchar DEFAULT '#1a1a1a',
  	"gradient" varchar DEFAULT 'linear-gradient(160deg,#111,#2a2a2a)'
  );
  
  CREATE TABLE "pages_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'FREQUENTLY ASKED QUESTIONS',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Ready to Get Started? Let''s Talk.',
  	"subheading" varchar,
  	"cta_label" varchar DEFAULT 'CALL NOW — 763-292-1191',
  	"cta_href" varchar DEFAULT 'tel:7632921191',
  	"variant" "enum_pages_blocks_cta_banner_variant" DEFAULT 'orange',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"image_position" "enum_pages_blocks_image_text_image_position" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_why_choose_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_service_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_expect" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dark" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"og_image_id" integer,
  	"no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_faqs_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "service_hubs_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "service_hubs_tabs_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"href" varchar,
  	"color" varchar DEFAULT '#2a2a2a',
  	"gradient" varchar DEFAULT 'linear-gradient(160deg,#191919,#333)',
  	"image_id" integer
  );
  
  CREATE TABLE "service_hubs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "service_hubs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" "enum_service_hubs_slug" NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_tagline" varchar,
  	"hero_body" varchar,
  	"hero_body2" varchar,
  	"hero_image_id" integer,
  	"what_eyebrow" varchar,
  	"what_heading" varchar,
  	"what_body" varchar,
  	"what_cta" varchar,
  	"cta_card_label" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "category_hubs_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "category_hubs_sub_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"tagline" varchar,
  	"body" varchar NOT NULL,
  	"read_more_href" varchar,
  	"color" varchar DEFAULT '#1a1a1a',
  	"gradient" varchar DEFAULT 'linear-gradient(160deg,#111,#2a2a2a)',
  	"image_id" integer
  );
  
  CREATE TABLE "category_hubs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"parent_hub" "enum_category_hubs_parent_hub" NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_tagline" varchar,
  	"hero_body" varchar,
  	"hero_body2" varchar,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "seo_audits_issues" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" "enum_seo_audits_issues_category",
  	"title" varchar,
  	"description" varchar,
  	"severity" "enum_seo_audits_issues_severity"
  );
  
  CREATE TABLE "seo_audits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"page_name" varchar,
  	"audited_at" timestamp(3) with time zone,
  	"seo_score" numeric,
  	"performance_score" numeric,
  	"accessibility_score" numeric,
  	"best_practices_score" numeric,
  	"raw_data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "competitors_top_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar,
  	"position" numeric,
  	"search_volume" numeric,
  	"url" varchar
  );
  
  CREATE TABLE "competitors_keyword_gaps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar,
  	"search_volume" numeric,
  	"competitor_position" numeric
  );
  
  CREATE TABLE "competitors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"domain" varchar NOT NULL,
  	"location_id" integer,
  	"estimated_monthly_traffic" numeric,
  	"last_synced" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"media_id" integer,
  	"page_seo_id" integer,
  	"users_id" integer,
  	"locations_id" integer,
  	"services_id" integer,
  	"pages_id" integer,
  	"contact_submissions_id" integer,
  	"faqs_id" integer,
  	"service_hubs_id" integer,
  	"category_hubs_id" integer,
  	"seo_audits_id" integer,
  	"competitors_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_services_tabs_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"href" varchar,
  	"color" varchar DEFAULT '#2a2a2a',
  	"gradient" varchar DEFAULT 'linear-gradient(160deg,#191919,#333)'
  );
  
  CREATE TABLE "home_page_services_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"cta" varchar,
  	"cta_href" varchar,
  	"cta_card" varchar
  );
  
  CREATE TABLE "home_page_expect_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_pricing_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_pricing_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"badge_text" varchar,
  	"badge_style" "enum_home_page_pricing_cards_badge_style",
  	"anchor" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "home_page_story_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_tagline" varchar,
  	"hero_body" varchar,
  	"hero_image_id" integer,
  	"banner_heading" varchar,
  	"banner_body" varchar,
  	"banner_note" varchar,
  	"banner_cta_label" varchar,
  	"pricing_heading" varchar,
  	"story_eyebrow" varchar,
  	"story_heading" varchar,
  	"story_cta_label" varchar,
  	"story_cta_href" varchar,
  	"why_heading" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_hero_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_story_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar,
  	"hero_author" varchar,
  	"hero_image_id" integer,
  	"story_eyebrow" varchar,
  	"story_heading" varchar,
  	"story_cta_label" varchar,
  	"story_cta_href" varchar,
  	"story_cta_secondary_label" varchar,
  	"story_cta_secondary_href" varchar,
  	"banner_heading" varchar,
  	"banner_body" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_body_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"heading" varchar DEFAULT 'LET''S TALK',
  	"phone" varchar DEFAULT '763-292-1191',
  	"phone_href" varchar DEFAULT 'tel:7632921191',
  	"email" varchar,
  	"address" varchar,
  	"form_header" varchar DEFAULT 'Phone Is Usually The Fastest Way To Reach You, But We''re Happy To Follow Up However Works Best.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pricing_page_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "pricing_page_pricing_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pricing_page_pricing_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"badge_text" varchar,
  	"badge_style" "enum_pricing_page_pricing_cards_badge_style",
  	"anchor" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "pricing_page_tiers_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pricing_page_tiers_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pricing_page_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"heading_orange" varchar,
  	"body" varchar NOT NULL,
  	"pay_for" varchar,
  	"gradient" varchar DEFAULT 'linear-gradient(160deg,#1a1a1a,#2e2e2e)'
  );
  
  CREATE TABLE "pricing_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_tagline" varchar,
  	"hero_body" varchar,
  	"hero_image_id" integer,
  	"pricing_heading" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "service_areas_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_heading" varchar,
  	"hero_subheading" varchar,
  	"hero_body" varchar,
  	"hero_image_id" integer,
  	"banner_heading" varchar,
  	"banner_body" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "shared_sections_expect_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "shared_sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"why_heading" varchar,
  	"orange_banner_heading" varchar,
  	"orange_banner_body" varchar,
  	"orange_banner_note" varchar,
  	"orange_banner_cta_label" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_settings_target_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "seo_settings_lme_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL,
  	"priority" "enum_seo_settings_lme_keywords_priority"
  );
  
  CREATE TABLE "seo_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"google_psi_api_key" varchar,
  	"data_for_seo_login" varchar,
  	"data_for_seo_password" varchar,
  	"site_url" varchar DEFAULT 'http://localhost:3000',
  	"target_location_code" numeric DEFAULT 1023191,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "posts_toc" ADD CONSTRAINT "posts_toc_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_faq" ADD CONSTRAINT "posts_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_seo" ADD CONSTRAINT "page_seo_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_city_image_id_media_id_fk" FOREIGN KEY ("city_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_rels" ADD CONSTRAINT "locations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_rels" ADD CONSTRAINT "locations_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_hero_title" ADD CONSTRAINT "services_hero_title_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_scenarios" ADD CONSTRAINT "services_scenarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_when_image_id_media_id_fk" FOREIGN KEY ("when_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_title_lines" ADD CONSTRAINT "pages_blocks_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_breadcrumb" ADD CONSTRAINT "pages_blocks_hero_breadcrumb_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_when_do_you_need_scenarios" ADD CONSTRAINT "pages_blocks_when_do_you_need_scenarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_when_do_you_need"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_when_do_you_need" ADD CONSTRAINT "pages_blocks_when_do_you_need_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid_cards" ADD CONSTRAINT "pages_blocks_services_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid" ADD CONSTRAINT "pages_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_choose_us" ADD CONSTRAINT "pages_blocks_why_choose_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_areas" ADD CONSTRAINT "pages_blocks_service_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_expect" ADD CONSTRAINT "pages_blocks_expect_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs_tags" ADD CONSTRAINT "faqs_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_hubs_hero_title_lines" ADD CONSTRAINT "service_hubs_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_hubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_hubs_tabs_cards" ADD CONSTRAINT "service_hubs_tabs_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_hubs_tabs_cards" ADD CONSTRAINT "service_hubs_tabs_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_hubs_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_hubs_tabs" ADD CONSTRAINT "service_hubs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_hubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_hubs" ADD CONSTRAINT "service_hubs_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "category_hubs_hero_title_lines" ADD CONSTRAINT "category_hubs_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."category_hubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "category_hubs_sub_services" ADD CONSTRAINT "category_hubs_sub_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "category_hubs_sub_services" ADD CONSTRAINT "category_hubs_sub_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."category_hubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "category_hubs" ADD CONSTRAINT "category_hubs_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_audits_issues" ADD CONSTRAINT "seo_audits_issues_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo_audits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitors_top_keywords" ADD CONSTRAINT "competitors_top_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitors_keyword_gaps" ADD CONSTRAINT "competitors_keyword_gaps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."competitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "competitors" ADD CONSTRAINT "competitors_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_seo_fk" FOREIGN KEY ("page_seo_id") REFERENCES "public"."page_seo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_hubs_fk" FOREIGN KEY ("service_hubs_id") REFERENCES "public"."service_hubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_category_hubs_fk" FOREIGN KEY ("category_hubs_id") REFERENCES "public"."category_hubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_seo_audits_fk" FOREIGN KEY ("seo_audits_id") REFERENCES "public"."seo_audits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_competitors_fk" FOREIGN KEY ("competitors_id") REFERENCES "public"."competitors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_title_lines" ADD CONSTRAINT "home_page_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_services_tabs_cards" ADD CONSTRAINT "home_page_services_tabs_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_services_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_services_tabs" ADD CONSTRAINT "home_page_services_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_expect_items" ADD CONSTRAINT "home_page_expect_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_pricing_cards_items" ADD CONSTRAINT "home_page_pricing_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_pricing_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_pricing_cards" ADD CONSTRAINT "home_page_pricing_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_story_paragraphs" ADD CONSTRAINT "home_page_story_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_hero_paragraphs" ADD CONSTRAINT "about_page_hero_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_story_paragraphs" ADD CONSTRAINT "about_page_story_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_body_paragraphs" ADD CONSTRAINT "contact_page_body_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pricing_page_hero_title_lines" ADD CONSTRAINT "pricing_page_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_page_pricing_cards_items" ADD CONSTRAINT "pricing_page_pricing_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_page_pricing_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_page_pricing_cards" ADD CONSTRAINT "pricing_page_pricing_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_page_tiers_bullets" ADD CONSTRAINT "pricing_page_tiers_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_page_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_page_tiers_notes" ADD CONSTRAINT "pricing_page_tiers_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_page_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_page_tiers" ADD CONSTRAINT "pricing_page_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pricing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pricing_page" ADD CONSTRAINT "pricing_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_areas_page" ADD CONSTRAINT "service_areas_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shared_sections_expect_items" ADD CONSTRAINT "shared_sections_expect_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."shared_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_settings_target_keywords" ADD CONSTRAINT "seo_settings_target_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_settings_lme_keywords" ADD CONSTRAINT "seo_settings_lme_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_toc_order_idx" ON "posts_toc" USING btree ("_order");
  CREATE INDEX "posts_toc_parent_id_idx" ON "posts_toc" USING btree ("_parent_id");
  CREATE INDEX "posts_faq_order_idx" ON "posts_faq" USING btree ("_order");
  CREATE INDEX "posts_faq_parent_id_idx" ON "posts_faq" USING btree ("_parent_id");
  CREATE INDEX "posts_tags_order_idx" ON "posts_tags" USING btree ("order");
  CREATE INDEX "posts_tags_parent_idx" ON "posts_tags" USING btree ("parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "page_seo_slug_idx" ON "page_seo" USING btree ("slug");
  CREATE INDEX "page_seo_og_image_idx" ON "page_seo" USING btree ("og_image_id");
  CREATE INDEX "page_seo_updated_at_idx" ON "page_seo" USING btree ("updated_at");
  CREATE INDEX "page_seo_created_at_idx" ON "page_seo" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "locations_slug_idx" ON "locations" USING btree ("slug");
  CREATE INDEX "locations_hero_image_idx" ON "locations" USING btree ("hero_image_id");
  CREATE INDEX "locations_city_image_idx" ON "locations" USING btree ("city_image_id");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE INDEX "locations_rels_order_idx" ON "locations_rels" USING btree ("order");
  CREATE INDEX "locations_rels_parent_idx" ON "locations_rels" USING btree ("parent_id");
  CREATE INDEX "locations_rels_path_idx" ON "locations_rels" USING btree ("path");
  CREATE INDEX "locations_rels_locations_id_idx" ON "locations_rels" USING btree ("locations_id");
  CREATE INDEX "services_hero_title_order_idx" ON "services_hero_title" USING btree ("_order");
  CREATE INDEX "services_hero_title_parent_id_idx" ON "services_hero_title" USING btree ("_parent_id");
  CREATE INDEX "services_scenarios_order_idx" ON "services_scenarios" USING btree ("_order");
  CREATE INDEX "services_scenarios_parent_id_idx" ON "services_scenarios" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_hero_image_idx" ON "services" USING btree ("hero_image_id");
  CREATE INDEX "services_when_image_idx" ON "services" USING btree ("when_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "pages_blocks_hero_title_lines_order_idx" ON "pages_blocks_hero_title_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_title_lines_parent_id_idx" ON "pages_blocks_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_breadcrumb_order_idx" ON "pages_blocks_hero_breadcrumb" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_breadcrumb_parent_id_idx" ON "pages_blocks_hero_breadcrumb" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_when_do_you_need_scenarios_order_idx" ON "pages_blocks_when_do_you_need_scenarios" USING btree ("_order");
  CREATE INDEX "pages_blocks_when_do_you_need_scenarios_parent_id_idx" ON "pages_blocks_when_do_you_need_scenarios" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_when_do_you_need_order_idx" ON "pages_blocks_when_do_you_need" USING btree ("_order");
  CREATE INDEX "pages_blocks_when_do_you_need_parent_id_idx" ON "pages_blocks_when_do_you_need" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_when_do_you_need_path_idx" ON "pages_blocks_when_do_you_need" USING btree ("_path");
  CREATE INDEX "pages_blocks_services_grid_cards_order_idx" ON "pages_blocks_services_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_cards_parent_id_idx" ON "pages_blocks_services_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_order_idx" ON "pages_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_parent_id_idx" ON "pages_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_path_idx" ON "pages_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_banner_order_idx" ON "pages_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_banner_parent_id_idx" ON "pages_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_path_idx" ON "pages_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_order_idx" ON "pages_blocks_image_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_parent_id_idx" ON "pages_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_path_idx" ON "pages_blocks_image_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_image_idx" ON "pages_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_why_choose_us_order_idx" ON "pages_blocks_why_choose_us" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_choose_us_parent_id_idx" ON "pages_blocks_why_choose_us" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_choose_us_path_idx" ON "pages_blocks_why_choose_us" USING btree ("_path");
  CREATE INDEX "pages_blocks_service_areas_order_idx" ON "pages_blocks_service_areas" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_areas_parent_id_idx" ON "pages_blocks_service_areas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_areas_path_idx" ON "pages_blocks_service_areas" USING btree ("_path");
  CREATE INDEX "pages_blocks_expect_order_idx" ON "pages_blocks_expect" USING btree ("_order");
  CREATE INDEX "pages_blocks_expect_parent_id_idx" ON "pages_blocks_expect" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_expect_path_idx" ON "pages_blocks_expect" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_og_image_idx" ON "pages" USING btree ("og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE INDEX "faqs_tags_order_idx" ON "faqs_tags" USING btree ("order");
  CREATE INDEX "faqs_tags_parent_idx" ON "faqs_tags" USING btree ("parent_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "service_hubs_hero_title_lines_order_idx" ON "service_hubs_hero_title_lines" USING btree ("_order");
  CREATE INDEX "service_hubs_hero_title_lines_parent_id_idx" ON "service_hubs_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "service_hubs_tabs_cards_order_idx" ON "service_hubs_tabs_cards" USING btree ("_order");
  CREATE INDEX "service_hubs_tabs_cards_parent_id_idx" ON "service_hubs_tabs_cards" USING btree ("_parent_id");
  CREATE INDEX "service_hubs_tabs_cards_image_idx" ON "service_hubs_tabs_cards" USING btree ("image_id");
  CREATE INDEX "service_hubs_tabs_order_idx" ON "service_hubs_tabs" USING btree ("_order");
  CREATE INDEX "service_hubs_tabs_parent_id_idx" ON "service_hubs_tabs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "service_hubs_slug_idx" ON "service_hubs" USING btree ("slug");
  CREATE INDEX "service_hubs_hero_image_idx" ON "service_hubs" USING btree ("hero_image_id");
  CREATE INDEX "service_hubs_updated_at_idx" ON "service_hubs" USING btree ("updated_at");
  CREATE INDEX "service_hubs_created_at_idx" ON "service_hubs" USING btree ("created_at");
  CREATE INDEX "category_hubs_hero_title_lines_order_idx" ON "category_hubs_hero_title_lines" USING btree ("_order");
  CREATE INDEX "category_hubs_hero_title_lines_parent_id_idx" ON "category_hubs_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "category_hubs_sub_services_order_idx" ON "category_hubs_sub_services" USING btree ("_order");
  CREATE INDEX "category_hubs_sub_services_parent_id_idx" ON "category_hubs_sub_services" USING btree ("_parent_id");
  CREATE INDEX "category_hubs_sub_services_image_idx" ON "category_hubs_sub_services" USING btree ("image_id");
  CREATE UNIQUE INDEX "category_hubs_slug_idx" ON "category_hubs" USING btree ("slug");
  CREATE INDEX "category_hubs_hero_image_idx" ON "category_hubs" USING btree ("hero_image_id");
  CREATE INDEX "category_hubs_updated_at_idx" ON "category_hubs" USING btree ("updated_at");
  CREATE INDEX "category_hubs_created_at_idx" ON "category_hubs" USING btree ("created_at");
  CREATE INDEX "seo_audits_issues_order_idx" ON "seo_audits_issues" USING btree ("_order");
  CREATE INDEX "seo_audits_issues_parent_id_idx" ON "seo_audits_issues" USING btree ("_parent_id");
  CREATE INDEX "seo_audits_updated_at_idx" ON "seo_audits" USING btree ("updated_at");
  CREATE INDEX "seo_audits_created_at_idx" ON "seo_audits" USING btree ("created_at");
  CREATE INDEX "competitors_top_keywords_order_idx" ON "competitors_top_keywords" USING btree ("_order");
  CREATE INDEX "competitors_top_keywords_parent_id_idx" ON "competitors_top_keywords" USING btree ("_parent_id");
  CREATE INDEX "competitors_keyword_gaps_order_idx" ON "competitors_keyword_gaps" USING btree ("_order");
  CREATE INDEX "competitors_keyword_gaps_parent_id_idx" ON "competitors_keyword_gaps" USING btree ("_parent_id");
  CREATE INDEX "competitors_location_idx" ON "competitors" USING btree ("location_id");
  CREATE INDEX "competitors_updated_at_idx" ON "competitors" USING btree ("updated_at");
  CREATE INDEX "competitors_created_at_idx" ON "competitors" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_page_seo_id_idx" ON "payload_locked_documents_rels" USING btree ("page_seo_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_service_hubs_id_idx" ON "payload_locked_documents_rels" USING btree ("service_hubs_id");
  CREATE INDEX "payload_locked_documents_rels_category_hubs_id_idx" ON "payload_locked_documents_rels" USING btree ("category_hubs_id");
  CREATE INDEX "payload_locked_documents_rels_seo_audits_id_idx" ON "payload_locked_documents_rels" USING btree ("seo_audits_id");
  CREATE INDEX "payload_locked_documents_rels_competitors_id_idx" ON "payload_locked_documents_rels" USING btree ("competitors_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_hero_title_lines_order_idx" ON "home_page_hero_title_lines" USING btree ("_order");
  CREATE INDEX "home_page_hero_title_lines_parent_id_idx" ON "home_page_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "home_page_services_tabs_cards_order_idx" ON "home_page_services_tabs_cards" USING btree ("_order");
  CREATE INDEX "home_page_services_tabs_cards_parent_id_idx" ON "home_page_services_tabs_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_services_tabs_order_idx" ON "home_page_services_tabs" USING btree ("_order");
  CREATE INDEX "home_page_services_tabs_parent_id_idx" ON "home_page_services_tabs" USING btree ("_parent_id");
  CREATE INDEX "home_page_expect_items_order_idx" ON "home_page_expect_items" USING btree ("_order");
  CREATE INDEX "home_page_expect_items_parent_id_idx" ON "home_page_expect_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_pricing_cards_items_order_idx" ON "home_page_pricing_cards_items" USING btree ("_order");
  CREATE INDEX "home_page_pricing_cards_items_parent_id_idx" ON "home_page_pricing_cards_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_pricing_cards_order_idx" ON "home_page_pricing_cards" USING btree ("_order");
  CREATE INDEX "home_page_pricing_cards_parent_id_idx" ON "home_page_pricing_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_story_paragraphs_order_idx" ON "home_page_story_paragraphs" USING btree ("_order");
  CREATE INDEX "home_page_story_paragraphs_parent_id_idx" ON "home_page_story_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_image_idx" ON "home_page" USING btree ("hero_image_id");
  CREATE INDEX "about_page_hero_paragraphs_order_idx" ON "about_page_hero_paragraphs" USING btree ("_order");
  CREATE INDEX "about_page_hero_paragraphs_parent_id_idx" ON "about_page_hero_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_page_story_paragraphs_order_idx" ON "about_page_story_paragraphs" USING btree ("_order");
  CREATE INDEX "about_page_story_paragraphs_parent_id_idx" ON "about_page_story_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_page_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
  CREATE INDEX "contact_page_body_paragraphs_order_idx" ON "contact_page_body_paragraphs" USING btree ("_order");
  CREATE INDEX "contact_page_body_paragraphs_parent_id_idx" ON "contact_page_body_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "contact_page_hero_image_idx" ON "contact_page" USING btree ("hero_image_id");
  CREATE INDEX "pricing_page_hero_title_lines_order_idx" ON "pricing_page_hero_title_lines" USING btree ("_order");
  CREATE INDEX "pricing_page_hero_title_lines_parent_id_idx" ON "pricing_page_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "pricing_page_pricing_cards_items_order_idx" ON "pricing_page_pricing_cards_items" USING btree ("_order");
  CREATE INDEX "pricing_page_pricing_cards_items_parent_id_idx" ON "pricing_page_pricing_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pricing_page_pricing_cards_order_idx" ON "pricing_page_pricing_cards" USING btree ("_order");
  CREATE INDEX "pricing_page_pricing_cards_parent_id_idx" ON "pricing_page_pricing_cards" USING btree ("_parent_id");
  CREATE INDEX "pricing_page_tiers_bullets_order_idx" ON "pricing_page_tiers_bullets" USING btree ("_order");
  CREATE INDEX "pricing_page_tiers_bullets_parent_id_idx" ON "pricing_page_tiers_bullets" USING btree ("_parent_id");
  CREATE INDEX "pricing_page_tiers_notes_order_idx" ON "pricing_page_tiers_notes" USING btree ("_order");
  CREATE INDEX "pricing_page_tiers_notes_parent_id_idx" ON "pricing_page_tiers_notes" USING btree ("_parent_id");
  CREATE INDEX "pricing_page_tiers_order_idx" ON "pricing_page_tiers" USING btree ("_order");
  CREATE INDEX "pricing_page_tiers_parent_id_idx" ON "pricing_page_tiers" USING btree ("_parent_id");
  CREATE INDEX "pricing_page_hero_image_idx" ON "pricing_page" USING btree ("hero_image_id");
  CREATE INDEX "service_areas_page_hero_image_idx" ON "service_areas_page" USING btree ("hero_image_id");
  CREATE INDEX "shared_sections_expect_items_order_idx" ON "shared_sections_expect_items" USING btree ("_order");
  CREATE INDEX "shared_sections_expect_items_parent_id_idx" ON "shared_sections_expect_items" USING btree ("_parent_id");
  CREATE INDEX "seo_settings_target_keywords_order_idx" ON "seo_settings_target_keywords" USING btree ("_order");
  CREATE INDEX "seo_settings_target_keywords_parent_id_idx" ON "seo_settings_target_keywords" USING btree ("_parent_id");
  CREATE INDEX "seo_settings_lme_keywords_order_idx" ON "seo_settings_lme_keywords" USING btree ("_order");
  CREATE INDEX "seo_settings_lme_keywords_parent_id_idx" ON "seo_settings_lme_keywords" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "posts_toc" CASCADE;
  DROP TABLE "posts_faq" CASCADE;
  DROP TABLE "posts_tags" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "page_seo" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "locations_rels" CASCADE;
  DROP TABLE "services_hero_title" CASCADE;
  DROP TABLE "services_scenarios" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "pages_blocks_hero_title_lines" CASCADE;
  DROP TABLE "pages_blocks_hero_breadcrumb" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_when_do_you_need_scenarios" CASCADE;
  DROP TABLE "pages_blocks_when_do_you_need" CASCADE;
  DROP TABLE "pages_blocks_services_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_services_grid" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_cta_banner" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_image_text" CASCADE;
  DROP TABLE "pages_blocks_why_choose_us" CASCADE;
  DROP TABLE "pages_blocks_service_areas" CASCADE;
  DROP TABLE "pages_blocks_expect" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "faqs_tags" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "service_hubs_hero_title_lines" CASCADE;
  DROP TABLE "service_hubs_tabs_cards" CASCADE;
  DROP TABLE "service_hubs_tabs" CASCADE;
  DROP TABLE "service_hubs" CASCADE;
  DROP TABLE "category_hubs_hero_title_lines" CASCADE;
  DROP TABLE "category_hubs_sub_services" CASCADE;
  DROP TABLE "category_hubs" CASCADE;
  DROP TABLE "seo_audits_issues" CASCADE;
  DROP TABLE "seo_audits" CASCADE;
  DROP TABLE "competitors_top_keywords" CASCADE;
  DROP TABLE "competitors_keyword_gaps" CASCADE;
  DROP TABLE "competitors" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_page_hero_title_lines" CASCADE;
  DROP TABLE "home_page_services_tabs_cards" CASCADE;
  DROP TABLE "home_page_services_tabs" CASCADE;
  DROP TABLE "home_page_expect_items" CASCADE;
  DROP TABLE "home_page_pricing_cards_items" CASCADE;
  DROP TABLE "home_page_pricing_cards" CASCADE;
  DROP TABLE "home_page_story_paragraphs" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "about_page_hero_paragraphs" CASCADE;
  DROP TABLE "about_page_story_paragraphs" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "contact_page_body_paragraphs" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "pricing_page_hero_title_lines" CASCADE;
  DROP TABLE "pricing_page_pricing_cards_items" CASCADE;
  DROP TABLE "pricing_page_pricing_cards" CASCADE;
  DROP TABLE "pricing_page_tiers_bullets" CASCADE;
  DROP TABLE "pricing_page_tiers_notes" CASCADE;
  DROP TABLE "pricing_page_tiers" CASCADE;
  DROP TABLE "pricing_page" CASCADE;
  DROP TABLE "service_areas_page" CASCADE;
  DROP TABLE "shared_sections_expect_items" CASCADE;
  DROP TABLE "shared_sections" CASCADE;
  DROP TABLE "seo_settings_target_keywords" CASCADE;
  DROP TABLE "seo_settings_lme_keywords" CASCADE;
  DROP TABLE "seo_settings" CASCADE;
  DROP TYPE "public"."enum_posts_tags";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_services_parent_category";
  DROP TYPE "public"."enum_services_parent_hub";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_variant";
  DROP TYPE "public"."enum_pages_blocks_image_text_image_position";
  DROP TYPE "public"."enum_faqs_tags";
  DROP TYPE "public"."enum_service_hubs_slug";
  DROP TYPE "public"."enum_category_hubs_parent_hub";
  DROP TYPE "public"."enum_seo_audits_issues_category";
  DROP TYPE "public"."enum_seo_audits_issues_severity";
  DROP TYPE "public"."enum_home_page_pricing_cards_badge_style";
  DROP TYPE "public"."enum_pricing_page_pricing_cards_badge_style";
  DROP TYPE "public"."enum_seo_settings_lme_keywords_priority";`)
}
