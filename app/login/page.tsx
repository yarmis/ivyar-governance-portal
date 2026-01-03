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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@ivyar.org" && password === "ivyar2024") {
      document.cookie = "auth=true; path=/";
      router.push(redirect || "/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D1117" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "24px" }}>
        <div style={{ background: "#161B22", border: "1px solid #1F242C", padding: "32px" }}>
          <h1 style={{ color: "#E6EDF3", fontSize: "24px", fontWeight: "600", marginBottom: "24px", textAlign: "center" }}>
            IVYAR Login
          </h1>
          {error && <p style={{ color: "#F85149", marginBottom: "16px", textAlign: "center" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px", marginBottom: "16px", background: "#0D1117", border: "1px solid #1F242C", color: "#E6EDF3" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", marginBottom: "24px", background: "#0D1117", border: "1px solid #1F242C", color: "#E6EDF3" }}
            />
            <button type="submit" style={{ width: "100%", padding: "12px", background: "#00A3FF", color: "#0D1117", fontWeight: "600", border: "none", cursor: "pointer" }}>
              Sign In
            </button>
          </form>
        </div>
        <p style={{ textAlign: "center", color: "#6B7280", marginTop: "24px", fontSize: "14px" }}>
          IVYAR Platform — Lake Stevens, Washington
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
