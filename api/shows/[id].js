import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Show ID is required" });
  }

  if (req.method === "GET") {
    try {
      const show = await redis.get(`show:${id}`);

      if (!show) {
        return res.status(404).json({ error: "Show not found" });
      }

      const parsed = typeof show === 'string' ? JSON.parse(show) : show;
      return res.status(200).json({ id, ...parsed });
    } catch (error) {
      console.error("Failed to get show:", error);
      return res.status(500).json({ error: "Failed to load show" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await redis.del(`show:${id}`);
      await redis.srem('shows:ids', id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Failed to delete show:", error);
      return res.status(500).json({ error: "Failed to delete show" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
