/**
 * Utility functions for IVYAR Autopilot v12
 */

/**
 * Format large numbers with K/M suffix
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format percentage with precision
 */
export function formatPercent(num: number, precision: number = 1): string {
  return num.toFixed(precision) + '%';
}

/**
 * Get color based on accuracy
 */
export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 95) return 'text-green-400';
  if (accuracy >= 90) return 'text-yellow-400';
  return 'text-orange-400';
}

/**
 * Get color based on confidence
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 95) return 'from-green-500 to-green-600';
  if (confidence >= 85) return 'from-yellow-500 to-yellow-600';
  return 'from-orange-500 to-orange-600';
}

/**
 * Generate random decision data for demo
 */
export function generateMockDecision(moduleId: string) {
  const actions = {
    materials: 'Approve construction materials for project',
    zoning: 'Recommend zoning change for parcel',
    violations: 'Issue warning for minor violation',
    donors: 'Match donor to infrastructure project',
    'us-construction': 'Auto-approve building permit',
    geo: 'Approve development for high-potential area',
    procurement: 'Recommend vendor for tender',
    freight: 'Optimize shipping route',
    routing: 'Plan delivery route with traffic avoidance',
    hbs: 'Forecast budget allocation for Q2',
  };

  return {
    id: `DEC-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date(),
    module: moduleId,
    action: actions[moduleId as keyof typeof actions] || 'Process request',
    confidence: 85 + Math.random() * 15,
    status: Math.random() > 0.1 ? 'approved' : 'pending',
  };
}

/**
 * Calculate trend from data
 */
export function calculateTrend(current: number, previous: number): {
  value: number;
  direction: 'up' | 'down' | 'stable';
} {
  const diff = current - previous;
  const percent = (diff / previous) * 100;
  
  return {
    value: Math.abs(percent),
    direction: percent > 0.5 ? 'up' : percent < -0.5 ? 'down' : 'stable',
  };
}

/**
 * Debounce function for search
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Download data as JSON
 */
export function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Format timestamp
 */
export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
