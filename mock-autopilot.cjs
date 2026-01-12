const http = require('http');

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  if (req.url === '/autopilot/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', version: 'mock-1.0' }));
    return;
  }
  
  if (req.url === '/autopilot/stream' && req.method === 'POST') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    
    const response = "For construction foundations, you typically need concrete grade C25/30 (equivalent to 3000 PSI) for residential projects, or C30/37 (3600 PSI) for commercial buildings. The choice depends on structural load, soil conditions, and local building codes like DBN in Ukraine or ACI 318 in the US.";
    
    // Simulate word-by-word streaming
    const words = response.split(' ');
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < words.length) {
        res.write(`event: text\ndata: ${JSON.stringify({ text: words[i] + ' ' })}\n\n`);
        i++;
      } else {
        res.write(`event: done\ndata: ${JSON.stringify({ status: 'completed' })}\n\n`);
        res.end();
        clearInterval(interval);
      }
    }, 80);
    return;
  }
  
  res.writeHead(404);
  res.end('Not found');
});

server.listen(3001, () => {
  console.log('🤖 Mock Autopilot API running on http://localhost:3001');
  console.log('   Health: http://localhost:3001/autopilot/health');
  console.log('   Stream: http://localhost:3001/autopilot/stream');
});
