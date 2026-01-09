"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Redirect based on API response
      router.push(redirect || data.redirectTo || '/us');
      router.refresh();
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D1117" }}>
      <div style={{ width: "100%", maxWidth: "450px", padding: "24px" }}>
        <div style={{ background: "#161B22", border: "1px solid #1F242C", padding: "32px" }}>
          
          <h1 style={{ color: "#E6EDF3", fontSize: "24px", fontWeight: "600", marginBottom: "8px", textAlign: "center" }}>
            IVYAR LOGIN
          </h1>
          <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "24px", textAlign: "center" }}>
            Governance Portal Access
          </p>

          {error && (
            <div style={{ background: "#3F1F1F", border: "1px solid #F85149", padding: "12px", marginBottom: "16px", color: "#F85149", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#8B949E", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="user@ivyar.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: "100%", 
                  padding: "12px", 
                  background: "#0D1117", 
                  border: "1px solid #1F242C", 
                  color: "#E6EDF3",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#8B949E", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: "100%", 
                  padding: "12px", 
                  background: "#0D1117", 
                  border: "1px solid #1F242C", 
                  color: "#E6EDF3",
                  fontSize: "14px"
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: "100%", 
                padding: "12px", 
                background: loading ? "#005A9E" : "#00A3FF", 
                color: "#0D1117", 
                fontWeight: "600", 
                border: "none", 
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN →'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #1F242C" }}>
            <p style={{ color: "#8B949E", fontSize: "11px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Demo Accounts:
            </p>
            <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#6B7280", lineHeight: "1.6" }}>
              <div>admin@ivyar.org / admin123</div>
              <div>employer@ivyar.org / employer123</div>
              <div>attorney@ivyar.org / attorney123</div>
              <div>client@ivyar.org / client123</div>
            </div>
          </div>
        </div>
        
        <p style={{ textAlign: "center", color: "#6B7280", marginTop: "24px", fontSize: "12px" }}>
          IVYAR Governance Platform
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0D1117" }} />}>
      <LoginForm />
    </Suspense>
  );
}
