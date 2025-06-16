from locust import HttpUser, task, between

class TemperatureUser(HttpUser):
    wait_time = between(1, 2.5)

    @task
    def get_temperatures(self):
        self.client.get("/api/v1/temperature/")
