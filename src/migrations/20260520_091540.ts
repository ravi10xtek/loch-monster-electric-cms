import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone" varchar DEFAULT '763-292-1191',
  	"email" varchar DEFAULT 'service@lochmonsterelectric.com',
  	"address" varchar DEFAULT '7600 W 27th St # 213, St Louis Park, MN 55426',
  	"business_hours" varchar DEFAULT 'Monday–Friday: 8:00 AM – 5:00 PM',
  	"emergency_note" varchar DEFAULT 'Emergency service available 24/7',
  	"license_m_n" varchar DEFAULT 'EA807591',
  	"license_w_i" varchar DEFAULT '1443 — EC',
  	"service_area_note" varchar DEFAULT 'Licensed Minnesota & Wisconsin Electrical Contractor Serving the Twin Cities Metro and Surrounding Areas',
  	"facebook" varchar,
  	"instagram" varchar,
  	"x" varchar,
  	"linkedin" varchar,
  	"tiktok" varchar,
  	"copyright_name" varchar DEFAULT 'Loch Monster Electric',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings" CASCADE;`)
}
