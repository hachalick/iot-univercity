#include <NewPing.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define TRIGGER_PIN 15
#define ECHO_PIN 5
#define MAX_DISTANCE 400

const char* ssid = "TP-Link_7638";
const char* password = "38949371";
// const char* ssid = "Galaxy S20+ 5Gb841";
// const char* password = "asdfffgaah";
const char* serverName = "http://192.168.1.105:8080/sensor/parking/srf";
// const char* parking = "Fl0-A1";
bool send_data = false;
int source_counter = 0;
int counter_waiting = 0;
const int max_counter_waiting = 2;
const int ledPinNotFull = 18;
const int ledPinFull = 19;
const int ledPinAlert = 21;

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

void send_status(bool full) {
  send_data = false;
  HTTPClient http;
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");
  String jsonData = "";
  if (full == true) {
    jsonData = "{\"full\":true,\"parking\":\"Fl0-A1\"}";
  } else {
    jsonData = "{\"full\":false,\"parking\":\"Fl0-A1\"}";
  }
  int httpResponseCode = http.POST(jsonData);
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}

void charge(unsigned int distance) {
  if (distance < 20 && counter_waiting < max_counter_waiting) {
    counter_waiting++;
  } else if (distance >= 20 && counter_waiting > 0) {
    counter_waiting--;
  }
}

void show_full_led() {
  if (counter_waiting == max_counter_waiting) {
    digitalWrite(ledPinFull, HIGH);
    digitalWrite(ledPinNotFull, LOW);
  } else if (counter_waiting == 0) {
    digitalWrite(ledPinFull, LOW);
    digitalWrite(ledPinNotFull, HIGH);
  }
}

void setup() {
  pinMode(ledPinAlert, OUTPUT);
  digitalWrite(ledPinAlert, HIGH);
  pinMode(ledPinNotFull, OUTPUT);
  pinMode(ledPinFull, OUTPUT);
  Serial.begin(115200);
  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  digitalWrite(ledPinAlert, LOW);
}

void loop() {
  delay(1000);
  unsigned int distance = sonar.ping_cm();
  if (WiFi.status() == WL_CONNECTED) {
    charge(distance);
    if (counter_waiting == max_counter_waiting || counter_waiting == 0) {
      send_data = true;
    }
    if (counter_waiting == source_counter) {
      send_data = false;
    }
    Serial.print(source_counter);
    Serial.println(counter_waiting);
    if (counter_waiting == max_counter_waiting && send_data == true) {
      send_data = false;
      send_status(true);
    } else if (counter_waiting == 0 && send_data == true) {
      send_data = false;
      send_status(false);
    }
    if (counter_waiting == max_counter_waiting) {
      source_counter = max_counter_waiting;
    } else if (counter_waiting == 0) {
      source_counter = 0;
    }
    show_full_led();
  } else {
    Serial.println("WiFi Disconnected");
  }
}
