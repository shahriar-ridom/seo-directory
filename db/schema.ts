import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const locations = pgTable(
  "locations",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    state: text("state"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
  },
  (table) => ({
    nameTrgmIdx: index("locations_name_trgm_idx").using(
      "gin",
      sql`${table.name} gin_trgm_ops`,
    ),
  }),
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    templateData: jsonb("template_data"),
  },
  (table) => ({
    nameTrgmIdx: index("categories_name_trgm_idx").using(
      "gin",
      sql`${table.name} gin_trgm_ops`,
    ),
  }),
);

export const listings = pgTable(
  "listings",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),

    // FOREIGN KEYS
    locationId: integer("location_id")
      .notNull()
      .references(() => locations.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),

    // DENORMALIZED SLUGS
    locationSlug: text("location_slug").notNull(),
    categorySlug: text("category_slug").notNull(),

    websiteUrl: text("website_url"),
    rating: integer("rating").default(0),
  },
  (table) => {
    return {
      // --- THE MONEY INDEX ---
      pseoLookupIdx: index("pseo_lookup_idx").on(
        table.locationSlug,
        table.categorySlug,
        table.rating,
      ),

      // --- CATEGORY PAGE INDEX ---
      categoryLookupIdx: index("category_lookup_idx").on(table.categorySlug),

      // --- ADMIN/Foreign Key INDEX ---
      adminFkIdx: index("admin_fk_idx").on(table.locationId, table.categoryId),

      // --- FULL TEXT SEARCH ---
      searchIndex: index("search_idx").using(
        "gin",
        sql`to_tsvector('english', ${table.name} || ' ' || ${table.description})`,
      ),
    };
  },
);
