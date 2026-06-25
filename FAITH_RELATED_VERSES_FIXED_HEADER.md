# Faith Related Verses + Fixed Header

Changes:
- Faith page now shows a related scripture under every faith message.
- API returns message, reference/kind, verse_text, and verse_reference.
- SQL schema now includes verse_text and verse_reference.
- Header uses true fixed positioning at the very top again.
- The page body has top spacing so the header does not cover content.

Run in D1 Console:
faith_messages_schema.sql

If Cloudflare D1 stops on duplicate column for verse_text or verse_reference:
- That only means the columns already exist.
- Run the remaining INSERT/UPDATE statements from the file.

Asset version: v20
Faith records: 204
