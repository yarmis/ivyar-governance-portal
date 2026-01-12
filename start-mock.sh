#!/bin/bash
while true; do
  echo "🚀 Starting mock API..."
  node mock-autopilot.cjs
  echo "⚠️  Mock API crashed. Restarting in 2 seconds..."
  sleep 2
done
