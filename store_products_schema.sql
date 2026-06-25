-- Understanding Trauma store products table
-- Paste this into Cloudflare D1 Console for understandingtrauma-db.
CREATE TABLE IF NOT EXISTS products (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
description TEXT,
price_cents INTEGER NOT NULL DEFAULT 0,
image_url TEXT,
checkout_url TEXT,
status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','active')),
sort_order INTEGER NOT NULL DEFAULT 0,
created_at TEXT NOT NULL DEFAULT (datetime('now')),
updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_products_status_sort ON products(status, sort_order, created_at);
