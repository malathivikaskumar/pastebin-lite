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
    setResult(null);
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4 text-center">
                Pastebin Lite
              </h3>

              <form onSubmit={createPaste}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Paste Content</label>
                  <textarea
                    className="form-control"
                    rows="8"
                    placeholder="Enter your paste content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">
                      TTL (seconds)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Optional"
                      value={ttl}
                      onChange={(e) => setTtl(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">
                      Max Views
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Optional"
                      value={maxViews}
                      onChange={(e) => setMaxViews(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Paste"}
                </button>
              </form>

              {error && (
                <div className="alert alert-danger mt-4">
                  {error}
                </div>
              )}

              {result && (
                <div className="alert alert-success mt-4">
                  <strong>Paste Created!</strong>
                  <br />
                  <a
                    href={result.url}
                    target="_blank"
                    className="text-break"
                  >
                    {result.url}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
