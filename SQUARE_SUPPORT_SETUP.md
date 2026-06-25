# Friendly Square Support Page

This version replaces the generic Buy Me a Coffee idea with your own branded support page:

/support/

Main phrase:

Buy me a moment of calm.

Support options:

- $3 — Buy a quiet coffee
- $5 — Buy a soft note
- $10 — Buy a little peace
- Any amount — Buy what feels right

## How to connect Square links

Create Square payment links for each support amount.

Then open:

assets/js/support.js

Paste each Square link here:

const SUPPORT_LINKS={
coffee:"PASTE $3 SQUARE LINK HERE",
note:"PASTE $5 SQUARE LINK HERE",
peace:"PASTE $10 SQUARE LINK HERE",
custom:"PASTE CUSTOM AMOUNT SQUARE LINK HERE"
};

If a link is blank, the button will not leave the page. It will show a friendly message that Square links are almost ready.

## Why this setup

This keeps the support page friendly and separate from the store checkout. The site explains the support option softly, and Square handles the secure payment page.


## Connected Square coffee link

The $3 coffee support button is connected to:

https://square.link/u/n12Mckni


## Connected Square $5 link

The $5 support button is connected to:

https://square.link/u/l9QhSqIH
