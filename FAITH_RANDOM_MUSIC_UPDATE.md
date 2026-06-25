# Faith Random Page + Smooth Music Update

This version adds a Christian faith random-message page and improves the music behavior.

## Music behavior
- The footer music button remains available sitewide.
- Once the visitor taps music on, the audio loops continuously.
- Normal public navigation is soft-loaded so the audio does not restart while moving between public pages.
- External links, Square checkout links, admin pages, downloads, and API links still open normally.
- Browsers still require the visitor to tap the music button first before audio can start.

## Faith page
The Faith page now mirrors the home page style:
- A large handwritten-style faith note card
- A random faith message button
- Scripture references when the random item is a verse
- Faith encouragement, prayer, sayings, and KJV scripture in the same random-note style

## SQL
Run this file in Cloudflare D1 Console to load the faith content:

faith_messages_schema.sql

Migration copy:

migrations/0004_create_faith_messages.sql

Faith records included: 241
Asset cache version: v19
