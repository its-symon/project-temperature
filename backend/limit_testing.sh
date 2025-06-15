#!/bin/bash

URL="http://localhost:8000/api/v1/temperature/"
TOTAL_REQUESTS=150

echo "Rate Limit Test - Sending $TOTAL_REQUESTS requests"
echo "Target: $URL"
echo "Expected: ~100 successful, ~50 rate limited (429)"
echo ""


success_file=$(mktemp)
rate_limited_file=$(mktemp)
error_file=$(mktemp)

make_request() {
    local id=$1
    response=$(curl -s -w "%{http_code}" -o /dev/null "$URL" 2>/dev/null)

    if [ "$response" = "200" ] || [ "$response" = "404" ]; then
        echo "$id" >> "$success_file"
    elif [ "$response" = "429" ]; then
        echo "$id" >> "$rate_limited_file"
    else
        echo "$id:$response" >> "$error_file"
    fi
}

# Record start time
start_time=$(date +%s.%3N)

echo "sending requests..."
for i in $(seq 1 $TOTAL_REQUESTS); do
    make_request $i &
done

wait

# Record end time
end_time=$(date +%s.%3N)
duration=$(echo "$end_time - $start_time" | bc -l)

# Count results
successful=$(wc -l < "$success_file" 2>/dev/null || echo 0)
rate_limited=$(wc -l < "$rate_limited_file" 2>/dev/null || echo 0)
errors=$(wc -l < "$error_file" 2>/dev/null || echo 0)

# Display results
echo ""
echo "RESULTS:"
echo ""
echo "Total requests: $TOTAL_REQUESTS"
echo "Time taken: ${duration}s"
echo "Rate: $(echo "scale=2; $TOTAL_REQUESTS / $duration" | bc -l) requests/second"
echo ""
echo "Successful (200): $successful"
echo "Rate limited (429): $rate_limited"
echo "Other errors: $errors"
echo ""

if [ "$rate_limited" -gt 0 ]; then
    echo "Rate limiting is working! $rate_limited requests were blocked"
else
    echo "No rate limiting detected"
fi

if [ "$TOTAL_REQUESTS" -gt 100 ] && [ "$rate_limited" -ge $((TOTAL_REQUESTS - 110)) ]; then
    echo "Rate limiter correctly allowed ~100 requests"
else
    echo "Expected ~100 successful requests, got $successful"
fi

if [ "$rate_limited" -gt 0 ]; then
    echo ""
    echo "Sample of rate limited request IDs:"
    head -5 "$rate_limited_file"
fi

rm -f "$success_file" "$rate_limited_file" "$error_file"

echo ""
echo "test done!"