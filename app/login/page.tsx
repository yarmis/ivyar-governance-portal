"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Redirect based on role or original destination
      router.push(redirect || data.redirectTo || "/");
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ color: "white", fontSize: "32px", margin: 0 }}>🛡️ IVYAR</h1>
          <p style={{ color: "#A8B5C4", margin: "8px 0 0" }}>Institutional Transparency & Legal Integrity</p>
        </div>

        {/* Login Card */}
        <div style={{ background: "#1B3A5C", padding: "32px", borderRadius: "16px" }}>
          <h2 style={{ color: "white", margin: "0 0 24px", fontSize: "20px", textAlign: "center" }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#A8B5C4", marginBottom: "8px", fontSize: "14px" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "8px",
                  border: "1px solid #2D4A6A",
                  background: "#0D1B2A",
                  color: "white",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#A8B5C4", marginBottom: "8px", fontSize: "14px" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "8px",
                  border: "1px solid #2D4A6A",
                  background: "#0D1B2A",
                  color: "white",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div style={{ background: "#EF444430", border: "1px solid #EF4444", padding: "12px", borderRadius: "8px", marginBottom: "20px" }}>
                <p style={{ color: "#EF4444", margin: 0, fontSize: "14px" }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                border: "none",
                background: loading ? "#2D4A6A" : "#10B9B9",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{ marginTop: "24px", padding: "16px", background: "#0D1B2A", borderRadius: "8px" }}>
            <p style={{ color: "#A8B5C4", margin: "0 0 12px", fontSize: "12px", textTransform: "uppercase" }}>
              Demo Accounts
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px", color: "#6B7280" }}>
              <div>admin@ivyar.org</div><div>admin123</div>
              <div>employer@ivyar.org</div><div>employer123</div>
              <div>attorney@ivyar.org</div><div>attorney123</div>
              <div>client@ivyar.org</div><div>client123</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", color: "#6B7280", marginTop: "24px", fontSize: "14px" }}>
          IVYAR Platform — Lake Stevens, Washington
        </p>
      </div>
    </div>
  );
}