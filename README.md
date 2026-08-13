# Lalibela Soul Tours — site

Static site: `index.html` + `styles.css` + `script.js`, plus one serverless
function `api/book.js` that forwards booking form submissions to Telegram.
Deploys to Vercel with zero config (framework preset: "Other").

## 1. Connect your Telegram bot

1. In Telegram, message **@BotFather** → `/newbot` → follow the prompts.
   You'll get a token that looks like `123456789:AAExxxxxxxxxxxxxxxxxxxxxxxxxxxx`.
2. Decide where booking requests should land:
   - **Your own DMs** — message your new bot once (anything, e.g. "hi"),
     then visit `https://api.telegram.org/bot<TOKEN>/getUpdates` in a
     browser and copy the `"id"` value under `"chat"`. That's your chat ID.
   - **A group chat** — add the bot to the group, send a message in the
     group, then use the same `getUpdates` trick (group IDs are negative
     numbers).
3. In your Vercel project → **Settings → Environment Variables**, add:
   - `TELEGRAM_BOT_TOKEN` = the token from step 1
   - `TELEGRAM_CHAT_ID` = the ID from step 2
4. Redeploy (Vercel → Deployments → ⋯ → Redeploy).

That's it — the form on the site POSTs to `/api/book`, which relays it to
Telegram. No token is ever exposed to the browser.

## 2. Swap in real photos

The gallery, hero, and guide portrait currently use carved-rock gradient
placeholders (no stock photos were used, so there's nothing to license or
attribute). To use your own:

- Add images to an `assets/` folder (e.g. `assets/gallery-1.jpg`).
- In `index.html`, replace a placeholder's `style="background:..."` with
  a nested `<img src="assets/gallery-1.jpg" alt="...">`, or add
  `background-image` in `styles.css`.
- Guide portrait: same pattern inside `.guide-portrait` in `index.html`.

## 3. Personalize the copy

Search `index.html` for bracketed placeholders and fill them in:
- Guide name, bio, and certifications (`#guide` section)
- WhatsApp/Telegram number and email (`#booking` section)

Tour names, durations, and prices live in the `#packages` section — edit
directly.

## 4. Deploy

```
vercel deploy
```
or connect the repo in the Vercel dashboard for auto-deploys on push.

## Notes on the design

- Dark "basalt" palette instead of the common cream/terracotta template
  look — meant to evoke the volcanic rock the churches are carved from.
- The jagged dividers between sections ("trenches") reference the rock-cut
  trenches you actually walk through between churches; they draw
  themselves in on scroll.
- The thin gold rail on the left fills as you scroll — a small nod to
  "descending" through the site the way visitors descend into the church
  courtyards.
- All animation respects `prefers-reduced-motion`.
