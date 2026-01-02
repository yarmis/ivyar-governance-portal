export default function AccessDeniedPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D1B2A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui",
      color: "white",
      textAlign: "center",
    }}>
      <div>
        <div style={{ fontSize: "80px", marginBottom: "16px" }}>🚫</div>
        <h1 style={{ fontSize: "48px", margin: "0 0 16px" }}>403</h1>
        <h2 style={{ fontSize: "24px", margin: "0 0 16px", color: "#A8B5C4" }}>Access Denied</h2>
        <p style={{ color: "#6B7280", marginBottom: "32px" }}>
          You do not have permission to view this page.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <a href="/" style={{ background: "#1B3A5C", padding: "12px 24px", borderRadius: "8px", color: "white", textDecoration: "none" }}>
            Go Home
          </a>
          <a href="/login" style={{ background: "#10B9B9", padding: "12px 24px", borderRadius: "8px", color: "white", textDecoration: "none" }}>
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}