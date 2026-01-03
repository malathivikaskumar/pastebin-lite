import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createPaste(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pastes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            ttl_seconds: ttl ? Number(ttl) : undefined,
            max_views: maxViews ? Number(maxViews) : undefined
          })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Pastebin Lite</h1>

      <form onSubmit={createPaste}>
        <textarea
          placeholder="Paste content"
          rows={8}
          style={{ width: "100%" }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          placeholder="TTL (seconds)"
          type="number"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />

        <input
          placeholder="Max Views"
          type="number"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h3>Paste Created</h3>
          <a href={result.url} target="_blank">
            {result.url}
          </a>
        </div>
      )}
    </main>
  );
}
