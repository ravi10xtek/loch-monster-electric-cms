import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_category" AS ENUM('residential', 'commercial', 'team-events');
  CREATE TYPE "public"."enum_social_posts_post_type" AS ENUM('static', 'reel');
  CREATE TYPE "public"."enum_social_posts_platform" AS ENUM('facebook', 'instagram', 'tiktok');
  CREATE TABLE "projects_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"category" "enum_projects_category" NOT NULL,
  	"service_type" varchar,
  	"location" varchar,
  	"completed_at" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"cover_image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "social_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"post_type" "enum_social_posts_post_type" NOT NULL,
  	"platform" "enum_social_posts_platform" DEFAULT 'facebook' NOT NULL,
  	"thumbnail_id" integer NOT NULL,
  	"caption" varchar NOT NULL,
  	"post_url" varchar NOT NULL,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "locations" ADD COLUMN "hero_tagline" varchar;
  ALTER TABLE "locations" ADD COLUMN "hero_intro" varchar;
  ALTER TABLE "locations" ADD COLUMN "housing_profile" varchar;
  ALTER TABLE "locations" ADD COLUMN "common_issues" jsonb;
  ALTER TABLE "locations" ADD COLUMN "neighborhoods" jsonb;
  ALTER TABLE "category_hubs" ADD COLUMN "card_image_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "social_posts_id" integer;
  ALTER TABLE "projects_photos" ADD CONSTRAINT "projects_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_photos" ADD CONSTRAINT "projects_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_posts" ADD CONSTRAINT "social_posts_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_photos_order_idx" ON "projects_photos" USING btree ("_order");
  CREATE INDEX "projects_photos_parent_id_idx" ON "projects_photos" USING btree ("_parent_id");
  CREATE INDEX "projects_photos_image_idx" ON "projects_photos" USING btree ("image_id");
  CREATE INDEX "projects_cover_image_idx" ON "projects" USING btree ("cover_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "social_posts_thumbnail_idx" ON "social_posts" USING btree ("thumbnail_id");
  CREATE INDEX "social_posts_updated_at_idx" ON "social_posts" USING btree ("updated_at");
  CREATE INDEX "social_posts_created_at_idx" ON "social_posts" USING btree ("created_at");
  ALTER TABLE "category_hubs" ADD CONSTRAINT "category_hubs_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_social_posts_fk" FOREIGN KEY ("social_posts_id") REFERENCES "public"."social_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "category_hubs_card_image_idx" ON "category_hubs" USING btree ("card_image_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_social_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("social_posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "social_posts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_photos" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "social_posts" CASCADE;
  ALTER TABLE "category_hubs" DROP CONSTRAINT "category_hubs_card_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_social_posts_fk";
  
  DROP INDEX "category_hubs_card_image_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_social_posts_id_idx";
  ALTER TABLE "locations" DROP COLUMN "hero_tagline";
  ALTER TABLE "locations" DROP COLUMN "hero_intro";
  ALTER TABLE "locations" DROP COLUMN "housing_profile";
  ALTER TABLE "locations" DROP COLUMN "common_issues";
  ALTER TABLE "locations" DROP COLUMN "neighborhoods";
  ALTER TABLE "category_hubs" DROP COLUMN "card_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "social_posts_id";
  DROP TYPE "public"."enum_projects_category";
  DROP TYPE "public"."enum_social_posts_post_type";
  DROP TYPE "public"."enum_social_posts_platform";`)
}
