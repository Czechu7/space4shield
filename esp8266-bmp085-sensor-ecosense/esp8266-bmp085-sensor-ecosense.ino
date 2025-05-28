#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP085_U.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085);

const char* ssid = "";
const char* password = "";
const char* serverUrl = "http://localhost:5238/api/Sensors/sensorID";

void setup() {
  Serial.begin(115200);

  Wire.begin(D2, D1); // SDA, SCL

  if (!bmp.begin()) {
    Serial.println("Nie znaleziono BMP085!");
    while (1);
  }

  WiFi.begin(ssid, password);
  Serial.print("Łączenie z WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nPołączono z WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    sensors_event_t event;
    bmp.getEvent(&event);

    if (event.pressure) {
      float pressure = event.pressure;
      float temperature = 0;
      bmp.getTemperature(&temperature);

      WiFiClient client;
      HTTPClient http;

      http.begin(client, serverUrl);
      http.addHeader("Content-Type", "application/json");

      String jsonData = "{"
        "\"temperature\": \"" + String(temperature, 2) + "\","
        "\"humidity\": null,"
        "\"airPressure\": " + String(pressure, 2) + ","
        "\"pM1_0\": null,"
        "\"pM2_5\": null,"
        "\"pM10\": null,"
        "\"waterLevel\": null,"
        "\"precipitation\": null,"
        "\"uvRadiation\": null,"
        "\"readingSource\": \"string\""
        "}";

      int httpResponseCode = http.PUT(jsonData);

      if (httpResponseCode > 0) {
        Serial.printf("HTTP Response code: %d\n", httpResponseCode);
      } else {
        Serial.printf("HTTP PUT failed: %s\n", http.errorToString(httpResponseCode).c_str());
      }

      http.end();
    } else {
      Serial.println("Brak danych z BMP180");
    }
  } else {
    Serial.println("WiFi disconnected");
  }

  delay(60000); // 60 sec
}