# Store Setup

This version adds a long-term store foundation.

## Public store

/store/

If there are no active products, it displays:

"Understanding Trauma merchandise coming soon."

## Admin product manager

/admin/products/

You can add, edit, hide, or delete products from the admin portal.

Product fields:

- Product name
- Description
- Price
- Image URL
- Checkout URL
- Status: Draft or Active
- Sort order

## Square later

When Square is ready, create a Square checkout/payment link for a product and paste it into the product's Checkout URL field. The public store button will then send the buyer to that checkout link.

## D1 migration required

Before using the product admin page, run this SQL in Cloudflare D1 Console:

store_products_schema.sql

Steps:

Cloudflare > D1 > understandingtrauma-db > Console > paste SQL > Run
