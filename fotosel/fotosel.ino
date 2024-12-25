#include <WebSocketsServer.h>
#include <WiFi.h>

const int photoPin = 34;
bool show = false;

const char *ssid = "";
const char *password = "";

WebSocketsServer webSocket = WebSocketsServer(81);

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload,
                    size_t length) {
  if (type == WStype_CONNECTED) {
    Serial.printf("Client %u connected\n", num);
    show = true;
  } else if (type == WStype_DISCONNECTED) {
    Serial.printf("Client %u disconnected\n", num);
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting to WiFi...");
    delay(500);
  }
  Serial.println("WIFI CONNECTED");
  Serial.print("IP ADDRESS: ");
  Serial.println(WiFi.localIP());

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.println("WebSocket server started");
}

void loop() {
  webSocket.loop();
  int lightLevel = analogRead(photoPin);
  if (show) {
    // Serial.print("Light Level: ");
    Serial.print(lightLevel * 100 / 4095);
    Serial.println("%");
    String message = String(lightLevel * 100 / 4095);
    webSocket.broadcastTXT(message);
    delay(1000);
  } else {
    delay(2000);
  }
}
