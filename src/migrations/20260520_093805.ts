import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "navigation_top_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_service_menus_hubs_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_service_menus_hubs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_service_menus" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"top_href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_mobile_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "navigation_top_links" ADD CONSTRAINT "navigation_top_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_service_menus_hubs_services" ADD CONSTRAINT "navigation_service_menus_hubs_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_service_menus_hubs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_service_menus_hubs" ADD CONSTRAINT "navigation_service_menus_hubs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_service_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_service_menus" ADD CONSTRAINT "navigation_service_menus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mobile_links" ADD CONSTRAINT "navigation_mobile_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "navigation_top_links_order_idx" ON "navigation_top_links" USING btree ("_order");
  CREATE INDEX "navigation_top_links_parent_id_idx" ON "navigation_top_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_service_menus_hubs_services_order_idx" ON "navigation_service_menus_hubs_services" USING btree ("_order");
  CREATE INDEX "navigation_service_menus_hubs_services_parent_id_idx" ON "navigation_service_menus_hubs_services" USING btree ("_parent_id");
  CREATE INDEX "navigation_service_menus_hubs_order_idx" ON "navigation_service_menus_hubs" USING btree ("_order");
  CREATE INDEX "navigation_service_menus_hubs_parent_id_idx" ON "navigation_service_menus_hubs" USING btree ("_parent_id");
  CREATE INDEX "navigation_service_menus_order_idx" ON "navigation_service_menus" USING btree ("_order");
  CREATE INDEX "navigation_service_menus_parent_id_idx" ON "navigation_service_menus" USING btree ("_parent_id");
  CREATE INDEX "navigation_mobile_links_order_idx" ON "navigation_mobile_links" USING btree ("_order");
  CREATE INDEX "navigation_mobile_links_parent_id_idx" ON "navigation_mobile_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "navigation_top_links" CASCADE;
  DROP TABLE "navigation_service_menus_hubs_services" CASCADE;
  DROP TABLE "navigation_service_menus_hubs" CASCADE;
  DROP TABLE "navigation_service_menus" CASCADE;
  DROP TABLE "navigation_mobile_links" CASCADE;
  DROP TABLE "navigation" CASCADE;`)
}
