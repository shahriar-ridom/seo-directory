import { text } from "drizzle-orm/pg-core";
import { index } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

//Locations (City)
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  state: text("state"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
});

//Categories (Coffee Shop)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  templateData: text("template_data"),
});

// Listing (The Content)
export const listings = pgTable(
  "listings",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    locationId: integer("location_id").references(() => locations.id),
    categoryId: integer("category_id").references(() => categories.id),
    websiteUrl: text("website_url"),
    rating: integer("rating").default(0),
  },
  (table) => {
    return {
      locationCategoryIdx: index("location_category_idx").on(
        table.locationId,
        table.categoryId,
      ),
    };
  },
);
