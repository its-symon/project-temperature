#!/bin/bash

URL="http://localhost:8000/api/v1/temperature/"
TOTAL_REQUESTS=150
CONCURRENCY=150 

echo "Rate Limit Test - Sending $TOTAL_REQUESTS requests concurrently"
echo "Target URL: $URL"
echo "Expected: ~100 successful, ~50 rate limited (429)"
echo ""

success_file=$(mktemp)
rate_limited_file=$(mktemp)
error_file=$(mktemp)

make_request() {
    local id=$1
    response=$(curl -s -w "%{http_code}" -o /dev/null "$URL")

    if [ "$response" = "200" ] || [ "$response" = "404" ]; then
        echo "$response" >> "$success_file"
    elif [ "$response" = "429" ]; then
        echo "$response" >> "$rate_limited_file"
    else
        echo "$response" >> "$error_file"
    fi
}

start_time=$(date +%s.%3N)

for i in $(seq 1 $TOTAL_REQUESTS); do
    make_request $i &
done

wait

end_time=$(date +%s.%3N)
duration=$(echo "$end_time - $start_time" | bc -l)

successful=$(wc -l < "$success_file" 2>/dev/null || echo 0)
rate_limited=$(wc -l < "$rate_limited_file" 2>/dev/null || echo 0)
errors=$(wc -l < "$error_file" 2>/dev/null || echo 0)

echo ""
echo "RESULTS:"
echo " "
echo "Total requests:    $TOTAL_REQUESTS"
echo "Duration:          ${duration}s"
echo "Rate:              $(echo "scale=2; $TOTAL_REQUESTS / $duration" | bc -l) requests/sec"
echo "Successful:        $successful"
echo "Rate Limited:      $rate_limited"
echo "Other Errors:      $errors"

# Verdict
if [ "$rate_limited" -gt 0 ]; then
    echo "Rate limiting is working! $rate_limited requests were blocked."
else
    echo "No rate limiting detected. Expected some 429 responses."
fi

if [ "$rate_limited" -gt 0 ]; then
    echo ""
    echo "Sample rate-limited responses:"
    head -5 "$rate_limited_file"  
fi

rm -f "$success_file" "$rate_limited_file" "$error_file"

echo ""
echo "Test complete."
