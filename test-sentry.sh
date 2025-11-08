#!/bin/bash

echo "🔍 Testing Sentry SDK Configuration..."
echo ""

# Start the server in background
cd /Users/lakshyakanwat/d3-custom-creation/contacts-api
npm run dev &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

echo "🏥 Testing health endpoint..."
curl -s http://localhost:4001/health | jq .

echo ""
echo "🚨 Testing Sentry error capture..."
RESPONSE=$(curl -s http://localhost:4001/test-sentry)
echo "Response: $RESPONSE"

echo ""
echo "🚨 Testing unhandled error endpoint..."
curl -s http://localhost:4001/test-error || echo "Expected to fail (unhandled error)"

# Clean up
kill $SERVER_PID 2>/dev/null
echo ""
echo "✅ Test completed. Check your Sentry dashboard for captured errors."
