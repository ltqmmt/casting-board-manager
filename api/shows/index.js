import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const showIds = await redis.smembers('shows:ids');
      if (!showIds || showIds.length === 0) {
        return res.status(200).json([]);
      }

      const pipeline = redis.pipeline();
      for (const id of showIds) {
        pipeline.get(`show:${id}`);
      }
      const results = await pipeline.exec();

      const shows = [];
      for (let i = 0; i < showIds.length; i++) {
        const show = results[i];
        if (show) {
          shows.push({ id: showIds[i], ...show });
        }
      }

      shows.sort((a, b) => new Date(b.sharedAt) - new Date(a.sharedAt));

      return res.status(200).json(shows);
    } catch (error) {
      console.error("Failed to list shows:", error);
      return res.status(500).json({ error: "Failed to load shared shows" });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, data } = req.body;

      if (!name || !data) {
        return res.status(400).json({ error: "name and data are required" });
      }

      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      const show = {
        name,
        data,
        sharedAt: new Date().toISOString(),
      };

      await redis.set(`show:${id}`, show);
      await redis.sadd('shows:ids', id);

      return res.status(201).json({ id, ...show });
    } catch (error) {
      console.error("Failed to share show:", error);
      return res.status(500).json({ error: "Failed to share show" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
