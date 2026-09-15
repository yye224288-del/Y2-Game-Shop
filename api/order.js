export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const o = req.body || {};
    if (!o.id || !o.player || !o.server || !o.diamonds || !o.price || !o.payment) {
      return res.status(400).json({ error: 'Missing order fields' });
    }
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return res.status(500).json({ error: 'Telegram environment variables are not configured' });
    const text = [
      'ðŸ›’ Y2 Game Shop â€” New Order',
      '',
      `ðŸ†” Order ID: ${o.id}`,
      `ðŸ’Ž Diamonds: ${o.diamonds}`,
      `ðŸ’° Price: ${Number(o.price).toLocaleString()} Ks`,
      `ðŸŽ® Player ID: ${o.player}`,
      `ðŸ”¢ Server ID: ${o.server}`,
      `ðŸ’³ Payment: ${o.payment}`,
      `ðŸ“Œ Status: ${o.status || 'Pending'}`,
      `ðŸ•’ Time: ${o.time || new Date().toLocaleString()}`
    ].join('\n');
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    const data = await r.json();
    if (!r.ok || !data.ok) return res.status(502).json({ error: 'Telegram send failed' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
        }
