const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ivyar-api.ivyar-gov.workers.dev';


export async function fetchAutopilotStatus() {
  const res = await fetch(`${API_URL}/api/hbs/autopilot/status`);
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
}

export async function enableAutopilot(percentage: number) {
  const res = await fetch(`${API_URL}/api/hbs/autopilot/flags/enable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ percentage }),
  });
  if (!res.ok) throw new Error('Failed to enable');
  return res.json();
}

export async function disableAutopilot() {
  const res = await fetch(`${API_URL}/api/hbs/autopilot/flags/disable`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to disable');
  return res.json();
}
