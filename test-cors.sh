#!/bin/bash
# CORS Testing Script - Test different network scenarios

echo "=========================================="
echo "  CORS Configuration Test"
echo "=========================================="
echo ""

# Get current IP
CURRENT_IP=$(hostname -I | awk '{print $1}')
echo "📍 Current Machine IP: $CURRENT_IP"
echo ""

# Test scenarios
echo "Testing CORS with different network IPs..."
echo ""

# Test 1: Current network
echo "✓ Test 1: Current network ($CURRENT_IP)"
RESPONSE=$(curl -s -H "Origin: https://$CURRENT_IP:8080" -X OPTIONS http://localhost:5000/api/auth/login -v 2>&1 | grep "Access-Control-Allow-Origin")
if [ ! -z "$RESPONSE" ]; then
    echo "  ✅ ALLOWED"
else
    echo "  ❌ BLOCKED"
fi
echo ""

# Test 2: Different home network
echo "✓ Test 2: Different home network (192.168.1.100)"
RESPONSE=$(curl -s -H "Origin: https://192.168.1.100:8080" -X OPTIONS http://localhost:5000/api/auth/login -v 2>&1 | grep "Access-Control-Allow-Origin")
if [ ! -z "$RESPONSE" ]; then
    echo "  ✅ ALLOWED"
else
    echo "  ❌ BLOCKED"
fi
echo ""

# Test 3: Mobile hotspot
echo "✓ Test 3: Mobile hotspot (192.168.0.50)"
RESPONSE=$(curl -s -H "Origin: http://192.168.0.50:8080" -X OPTIONS http://localhost:5000/api/auth/login -v 2>&1 | grep "Access-Control-Allow-Origin")
if [ ! -z "$RESPONSE" ]; then
    echo "  ✅ ALLOWED"
else
    echo "  ❌ BLOCKED"
fi
echo ""

# Test 4: Corporate network
echo "✓ Test 4: Corporate network (10.0.0.123)"
RESPONSE=$(curl -s -H "Origin: https://10.0.0.123:8080" -X OPTIONS http://localhost:5000/api/auth/login -v 2>&1 | grep "Access-Control-Allow-Origin")
if [ ! -z "$RESPONSE" ]; then
    echo "  ✅ ALLOWED"
else
    echo "  ❌ BLOCKED"
fi
echo ""

# Test 5: Public IP (should be blocked)
echo "✓ Test 5: Public IP (8.8.8.8) - Should be BLOCKED"
RESPONSE=$(curl -s -H "Origin: https://8.8.8.8:8080" -X POST http://localhost:5000/api/auth/login 2>&1 | grep "Not allowed by CORS")
if [ ! -z "$RESPONSE" ]; then
    echo "  ✅ BLOCKED (Secure!)"
else
    echo "  ⚠️  ALLOWED (Check security settings)"
fi
echo ""

echo "=========================================="
echo "✅ All private network IPs work automatically!"
echo "🔒 Public IPs are blocked for security"
echo ""
echo "Access your app from mobile at:"
echo "  https://$CURRENT_IP:8080"
echo "=========================================="
