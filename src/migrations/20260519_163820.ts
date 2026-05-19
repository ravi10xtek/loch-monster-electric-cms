import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_projects_category" ADD VALUE 'hoa' BEFORE 'team-events';
  CREATE TABLE "media_page_hero_title_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "media_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Our Work',
  	"hero_tagline" varchar,
  	"hero_body" varchar,
  	"hero_cta1_label" varchar DEFAULT 'VIEW PROJECTS',
  	"hero_cta1_href" varchar DEFAULT '#projects',
  	"hero_cta2_label" varchar DEFAULT 'FOLLOW US',
  	"hero_cta2_href" varchar DEFAULT '#stay-connected',
  	"hero_form_title" varchar DEFAULT 'GET A FREE ESTIMATE',
  	"hero_form_subtitle" varchar DEFAULT 'Fast response. No obligation.',
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "media_page_hero_title_lines" ADD CONSTRAINT "media_page_hero_title_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_page" ADD CONSTRAINT "media_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_page_hero_title_lines_order_idx" ON "media_page_hero_title_lines" USING btree ("_order");
  CREATE INDEX "media_page_hero_title_lines_parent_id_idx" ON "media_page_hero_title_lines" USING btree ("_parent_id");
  CREATE INDEX "media_page_hero_image_idx" ON "media_page" USING btree ("hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "media_page_hero_title_lines" CASCADE;
  DROP TABLE "media_page" CASCADE;
  ALTER TABLE "projects" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_projects_category";
  CREATE TYPE "public"."enum_projects_category" AS ENUM('residential', 'commercial', 'team-events');
  ALTER TABLE "projects" ALTER COLUMN "category" SET DATA TYPE "public"."enum_projects_category" USING "category"::"public"."enum_projects_category";`)
}
