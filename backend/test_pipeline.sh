#!/bin/bash
set -e
BASE="http://localhost:4000"

echo "=== 1. Citizen login ==="
TOKEN=$(curl -s -X POST $BASE/api/auth/citizen/login -H "Content-Type: application/json" \
  -d '{"email":"naomi@example.com","password":"password123"}' | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).token))")
echo "token acquired"

echo ""
echo "=== 2. Preview a NEW complaint (pothole) -> should classify as Roads & Infrastructure ==="
PREVIEW1=$(curl -s -X POST $BASE/api/complaints/preview -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"There is a huge dangerous pothole near the bus stop, cars are swerving to avoid it","latitude":13.0827,"longitude":80.2707,"ward":"Ward 7"}')
echo "$PREVIEW1" | node -e "let d=JSON.parse(require('fs').readFileSync(0));console.log(JSON.stringify(d,null,2))"

echo ""
echo "=== 3. Submit that complaint as citizen A ==="
CLUSTER_ID=$(echo "$PREVIEW1" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).cluster_id)")
SUBMIT1=$(curl -s -X POST $BASE/api/complaints -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d "{\"description\":\"Huge dangerous pothole near the bus stop\",\"category\":\"Roads & Infrastructure\",\"subcategory\":\"Pothole\",\"department\":\"Public Works Dept\",\"severity_score\":7.5,\"urgency_level\":\"High\",\"cluster_id\":\"$CLUSTER_ID\",\"latitude\":13.0827,\"longitude\":80.2707,\"ward\":\"Ward 7\"}")
echo "$SUBMIT1"

echo ""
echo "=== 4. Register a SECOND citizen who reports the SAME pothole nearby (within 100m) ==="
curl -s -X POST $BASE/api/auth/citizen/register -H "Content-Type: application/json" \
  -d '{"name":"Ravi","email":"ravi@example.com","password":"password123"}' > /dev/null
TOKEN2=$(curl -s -X POST $BASE/api/auth/citizen/login -H "Content-Type: application/json" \
  -d '{"email":"ravi@example.com","password":"password123"}' | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).token)")

echo "--- Ravi previews a complaint ~30m away, same category ---"
PREVIEW2=$(curl -s -X POST $BASE/api/complaints/preview -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN2" \
  -d '{"description":"Big pothole close to the bus stand, almost damaged my bike","latitude":13.0830,"longitude":80.2709,"ward":"Ward 7"}')
echo "$PREVIEW2" | node -e "let d=JSON.parse(require('fs').readFileSync(0));console.log(JSON.stringify(d,null,2))"
echo ""
echo ">>> KEY CHECK: is_duplicate should be TRUE and consensus_message should mention the existing report <<<"

echo ""
echo "=== 5. Government login and status update ==="
curl -s -X POST $BASE/api/auth/government/register -H "Content-Type: application/json" -d '{}' > /dev/null 2>&1 || true
GTOKEN=$(curl -s -X POST $BASE/api/auth/government/login -H "Content-Type: application/json" \
  -d '{"email":"sharma@municipality.gov","password":"password123","empId":"GOV-2024-1847"}' | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).token)")
echo "gov token acquired"

echo ""
echo "=== 6. Dashboard stats ==="
curl -s $BASE/api/dashboard/stats -H "Authorization: Bearer $GTOKEN" | node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0)),null,2))"

echo ""
echo "=== 7. Resolution-audit agent: try to resolve WITHOUT a photo (should be rejected) ==="
ISS_ID=$(echo "$SUBMIT1" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).complaint.id)")
curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST $BASE/api/complaints/$ISS_ID/resolve -H "Content-Type: application/json" -H "Authorization: Bearer $GTOKEN" -d '{}'

echo ""
echo "=== 8. Resolution-audit agent: resolve WITH a photo (should pass/flag for review) ==="
curl -s -X POST $BASE/api/complaints/$ISS_ID/resolve -H "Content-Type: application/json" -H "Authorization: Bearer $GTOKEN" -d '{"resolutionPhotoUrl":"https://example.com/fixed.jpg"}'

echo ""
echo ""
echo "=== 9. Leaderboard ==="
curl -s $BASE/api/leaderboard -H "Authorization: Bearer $GTOKEN" | node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync(0)),null,2))"
