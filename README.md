# Lalibela Soul Tours — site

Static site: `index.html` + `styles.css` + `script.js`, plus one serverless
function `api/book.js` that forwards booking form submissions to Telegram.
Deploys to Vercel with zero config (framework preset: "Other").

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
