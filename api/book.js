export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      contact,
      package: pkg,
      guests,
      date,
      country,
      message
    } = req.body || {};

    // Check required fields
    if (!name || !contact || !pkg || !date) {
      return res.status(400).json({
        error: 'Please fill in all required fields.'
      });
    }

    // Get Telegram credentials from Vercel
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('Telegram environment variables are missing.');

      return res.status(500).json({
        error: 'Telegram is not configured correctly.'
      });
    }

    // Create the Telegram message
    const text = `
🗿 New Booking Request — Lalibela Soul Tours

👤 Name: ${name}
📞 Contact: ${contact}
🗺️ Journey: ${pkg}
👥 Guests: ${guests || '—'}
📅 Preferred date: ${date}
🌍 Country: ${country || '—'}
📝 Notes: ${message || '—'}
    `.trim();

    // Send message to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      console.error('Telegram error:', telegramData);

      return res.status(502).json({
        error: 'Telegram could not receive the booking.'
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Booking sent successfully.'
    });

  } catch (error) {
    console.error('Booking error:', error);

    return res.status(500).json({
      error: 'Unexpected server error.'
    });
  }
}
