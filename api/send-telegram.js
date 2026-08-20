export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, contact, service, message } = req.body || {};

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(500).json({ error: 'Telegram credentials are not configured' });
    return;
  }

  const text = [
    "Нова заявка з сайту",
    `Ім'я: ${name || '-'}`,
    `Контакт: ${contact || '-'}`,
    `Послуга: ${service || '-'}`,
    `Повідомлення: ${message || '-'}`
  ].join('\n');

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    if (!telegramResponse.ok) {
      const errorBody = await telegramResponse.text();
      res.status(500).json({ error: `Telegram API error: ${errorBody}` });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to send message to Telegram' });
  }
}
