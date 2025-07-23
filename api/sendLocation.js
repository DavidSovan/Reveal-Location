// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 requests per minute
const ipRequestCounts = new Map();
let lastResetTime = Date.now();

// Helper function for readable timestamps
function formatTimestamp(date = new Date()) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

// Helper function for time duration
function formatDuration(ms) {
  const seconds = Math.ceil(ms / 1000);
  return `${seconds} second${seconds !== 1 ? "s" : ""}`;
}

export default async function handler(req, res) {
  const currentTime = Date.now();

  // Reset the count if the window has passed
  if (currentTime - lastResetTime > RATE_LIMIT_WINDOW_MS) {
    ipRequestCounts.clear();
    lastResetTime = currentTime;
  }

  // Get client IP (considering headers for proxies)
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Update request count for this IP
  const requestCount = (ipRequestCounts.get(clientIp) || 0) + 1;
  ipRequestCounts.set(clientIp, requestCount);

  // Check rate limit
  if (requestCount > MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = lastResetTime + RATE_LIMIT_WINDOW_MS - currentTime;
    return res.status(429).json({
      error: "Too many requests",
      timestamp: formatTimestamp(),
      formattedRetryAfter: formatDuration(retryAfter),
      retryAfterMs: retryAfter,
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      timestamp: formatTimestamp(),
    });
  }

  const { lat, lon } = req.body;

  if (!lat || !lon) {
    return res.status(400).json({
      error: "Missing latitude or longitude",
      timestamp: formatTimestamp(),
    });
  }

  const mapsLink = `https://maps.google.com/?q=${lat},${lon}`;
  const timestamp = formatTimestamp();

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: `📍 New Location!\n${mapsLink}\nLat: ${lat}\nLon: ${lon}\nTime: ${timestamp}`,
        }),
      }
    );

    const data = await telegramResponse.json();
    res.status(200).json({
      success: true,
      timestamp,
      formattedTimestamp: timestamp, // For consistency
      requestsRemaining: MAX_REQUESTS_PER_WINDOW - requestCount,
      rateLimitReset: formatDuration(
        lastResetTime + RATE_LIMIT_WINDOW_MS - currentTime
      ),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send location",
      timestamp: formatTimestamp(),
      details: error.message,
      formattedErrorTime: formatTimestamp(),
    });
  }
}
