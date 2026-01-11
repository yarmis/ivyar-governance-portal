export async function autopilotRequest(payload: any) {
  const endpoint = "https://ivyar-api.ivyar-gov.workers.dev/autopilot";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    return {
      status: "error",
      message: `Autopilot API error: ${res.status}`
    };
  }

  return res.json();
}
