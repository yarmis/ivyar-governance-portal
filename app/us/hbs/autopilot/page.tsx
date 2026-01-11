"use client";

import { useState } from "react";
import { autopilotRequest } from "@/lib/autopilot";

export default function AutopilotPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function runAutopilot() {
    setLoading(true);

    const response = await autopilotRequest({
      domain: "F",
      document: "F3",
      input: { case: input }
    });

    setResult(response);
    setLoading(false);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <h1>Autopilot</h1>
      <p>Enter case details and run the Autopilot decision engine.</p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe the case..."
        style={{
          width: "100%",
          height: "150px",
          padding: "1rem",
          marginTop: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      <button
        onClick={runAutopilot}
        disabled={loading}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "6px",
          background: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Processing..." : "Run Autopilot"}
      </button>

      {result && (
        <pre
          style={{
            marginTop: "2rem",
            padding: "1rem",
            background: "#f5f5f5",
            borderRadius: "8px"
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
