# Morphy v2: a chess openings chatbot

- **Live:** https://vishadrajonta.github.io/morphy-v2/
- **Code:** https://github.com/vishadrajonta/morphy-v2

Morphy answers questions about 106 chess openings. Ask about one ("explain the Najdorf") and it shows a card with the moves, the main idea, and a Lichess link. It also handles follow-ups, small talk, and a wishlist of saved openings.

## How it meets the brief

- **Form, DOM, events:** two forms (chat and wishlist). Every message, card and button is created with JavaScript and handled with event listeners.
- **Validation:** empty, too-short, no-letter and too-long questions are caught before Morphy sees them. Errors show inline under the form, not in alerts.
- **UI/UX:** suggestion chips after each reply, a typing indicator, a saved wishlist, and a layout that works on phones.

## How I used AI

I used AI throughout. For Assignment 4, Claude tutored me and I wrote most of the code myself.

For this version, Claude wrote the new code as commented pieces with step-by-step task sheets. A second AI assistant (CODY, running on my computer) pasted each piece into the project, ran the console tests, and made the git commits. I followed along and asked it to walk me through each piece: how `findBest`, `lookup`, `respond` and `suggestions` work, and why the follow-up memory still works. Then I checked the page in the browser myself.

Opening moves come from Lichess's public dataset. The opening descriptions were drafted by Claude.
