export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { lat, lon } = req.body;
  const mapsLink = `https://maps.google.com/?q=${lat},${lon}`;

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: `📍 New Location!\n${mapsLink}\nLat: ${lat}\nLon: ${lon}`,
        }),
      }
    );

    const data = await telegramResponse.json();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to send location" });
  }
}
