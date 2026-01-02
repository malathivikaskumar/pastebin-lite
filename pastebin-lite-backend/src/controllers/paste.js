import { nanoid } from "nanoid";
import { pool } from "../db/db.js";
import { getNow } from "../helper/time.js";


export async function createPaste(req, res) {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const id = nanoid(10);
  const now = getNow(req);
  const expiresAt = ttl_seconds
    ? new Date(now.getTime() + ttl_seconds * 1000)
    : null;

  await pool.query(
    `INSERT INTO pastes (id, content, expires_at, max_views)
     VALUES ($1, $2, $3, $4)`,
    [id, content, expiresAt, max_views || null]
  );

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  res.status(201).json({
    id,
    url: `${baseUrl}/p/${id}`
  });
}

/**
 * GET /api/pastes/:id
 */
export async function fetchPaste(req, res) {
  const client = await pool.connect();
  const { id } = req.params;

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      "SELECT * FROM pastes WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Not found" });
    }

    const paste = rows[0];
    const now = getNow(req);

    if (paste.expires_at && now > paste.expires_at) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Not found" });
    }

    if (paste.max_views && paste.view_count >= paste.max_views) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Not found" });
    }

    await client.query(
      "UPDATE pastes SET view_count = view_count + 1 WHERE id = $1",
      [id]
    );

    await client.query("COMMIT");

    res.status(200).json({
      content: paste.content,
      remaining_views:
        paste.max_views == null
          ? null
          : Math.max(paste.max_views - paste.view_count - 1, 0),
      expires_at: paste.expires_at
        ? paste.expires_at.toISOString()
        : null
    });
  } catch {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
}

/**
 * GET /p/:id
 */
export async function viewPasteHtml(req, res) {
  const client = await pool.connect();
  const { id } = req.params;

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      "SELECT * FROM pastes WHERE id = $1 FOR UPDATE",
      [id]
    );

    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res.sendStatus(404);
    }

    const paste = rows[0];
    const now = getNow(req);

    if (
      (paste.expires_at && now > paste.expires_at) ||
      (paste.max_views && paste.view_count >= paste.max_views)
    ) {
      await client.query("ROLLBACK");
      return res.sendStatus(404);
    }

    await client.query(
      "UPDATE pastes SET view_count = view_count + 1 WHERE id = $1",
      [id]
    );

    await client.query("COMMIT");

    res.setHeader("Content-Type", "text/html");
    res.send(`<pre>${escapeHtml(paste.content)}</pre>`);
  } finally {
    client.release();
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c])
  );
}
