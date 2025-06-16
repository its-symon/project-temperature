to run
docker compose up -d

to load test
docker run --rm -p 8089:8089 -v $(pwd):/mnt locustio/locust -f /mnt/locustfile.py --host=http://host.docker.internal:8000

load testing report-
![Farmers Market Finder Demo](image.png)
