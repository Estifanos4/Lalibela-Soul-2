// /api/book.js
// Vercel serverless function — receives the booking form POST from the
// site and forwards it as a message to a Telegram chat via a bot.
//
// SETUP (see README.md for the full walkthrough):
// 1. Create a bot with @BotFather on Telegram, get its token.
// 2. Get the chat ID that should receive booking requests (your own
//    account, or a group chat the bot has been added to).
// 3. In your Vercel project settings, add two environment variables:
//      TELEGRAM_BOT_TOKEN = <the token from BotFather>
//      TELEGRAM_CHAT_ID   = <the destination chat id>
// 4. Redeploy. The form on the site will then reach this endpoint at
//    https://<your-site>.vercel.app/api/book automatically.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, contact, package: pkg, guests, date, country, message } = req.body || {};

  if (!name || !contact || !pkg || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars');
    return res.status(500).json({ error: 'Booking is not fully configured yet' });
  }

  const text =
    `🗿 *New booking request — Lalibela Soul Tours*\n\n` +
    `*Name:* ${escapeMd(name)}\n` +
    `*Contact:* ${escapeMd(contact)}\n` +
    `*Journey:* ${escapeMd(pkg)}\n` +
    `*Guests:* ${escapeMd(String(guests || '—'))}\n` +
    `*Preferred date:* ${escapeMd(date)}\n` +
    `*Country:* ${escapeMd(country || '—')}\n` +
    (message ? `*Notes:* ${escapeMd(message)}\n` : '');

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'MarkdownV2'
      })
    });

    const tgData = await tgRes.json();
    if (!tgData.ok) {
      console.error('Telegram API error:', tgData);
      return res.status(502).json({ error: 'Failed to deliver booking' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Booking forward failed:', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}

// Telegram MarkdownV2 requires escaping these characters
function escapeMd(str) {
  return String(str).replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}
