#include <WiFi.h>
#include <WebSocketsServer.h>

#define TRIG_PIN  15
#define ECHO_PIN  4

#define LED_COUNT 19
#define LED_1     32
#define LED_2     33
#define LED_3     25
#define LED_4     26
#define LED_5     27

int       counter             = 0;
int       source_counter      = 0;
int       counter_waiting     = 0;
bool      send_data           = false;
const int max_counter_waiting = 5;

const char* ssid     = "";
const char* password = "";

WebSocketsServer webSocket = WebSocketsServer(81);

float cal_distance() 
{
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // اندازه‌گیری مدت زمان برگشت پالس
  long duration = pulseIn(ECHO_PIN, HIGH);

  // محاسبه فاصله بر حسب سانتی‌متر
  float distance = (duration * 0.0343) / 2;

  return distance;
}

void charge(unsigned int distance, int border_min, int border_max) 
{
  if (distance > border_min && distance < border_max && counter_waiting < max_counter_waiting) {
    counter_waiting++;
  } else if ((distance <= border_min || distance >= border_max) && counter_waiting > 0) {
    counter_waiting--;
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) 
{
  if (type == WStype_CONNECTED) {
    Serial.printf("Client %u connected\n", num);
  } else if (type == WStype_DISCONNECTED) {
    Serial.printf("Client %u disconnected\n", num);
  }
}

void setup() 
{
  Serial.begin(115200); // تنظیم سرعت سریال مانیتور
  pinMode(TRIG_PIN, OUTPUT); // تنظیم پین تریگر به عنوان خروجی
  pinMode(ECHO_PIN, INPUT);  // تنظیم پین اکو به عنوان ورودی
  pinMode(LED_COUNT, OUTPUT);
  pinMode(LED_1, OUTPUT);
  pinMode(LED_2, OUTPUT);
  pinMode(LED_3, OUTPUT);
  pinMode(LED_4, OUTPUT);
  pinMode(LED_5, OUTPUT);

  WiFi.begin(ssid,password);
  while (WiFi.status() != WL_CONNECTED)
  {
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

void show_led()
{
  if(source_counter == max_counter_waiting)
  {
    digitalWrite(LED_COUNT, HIGH);
  }
  else
  {
    digitalWrite(LED_COUNT, LOW);
  }
  if(counter_waiting >= 1)
  {
    digitalWrite(LED_1, HIGH);
  }
  else
  {
    digitalWrite(LED_1, LOW);
  }
  if(counter_waiting >= 2)
  {
    digitalWrite(LED_2, HIGH);
  }
  else
  {
    digitalWrite(LED_2, LOW);
  }
  if(counter_waiting >= 3)
  {
    digitalWrite(LED_3, HIGH);
  }
  else
  {
    digitalWrite(LED_3, LOW);
  }
  if(counter_waiting >= 4)
  {
    digitalWrite(LED_4, HIGH);
  }
  else
  {
    digitalWrite(LED_4, LOW);
  }
  if(counter_waiting >= 5)
  {
    digitalWrite(LED_5, HIGH);
  }
  else
  {
    digitalWrite(LED_5, LOW);
  }
}

void loop() 
{
  webSocket.loop();
  float distance = cal_distance();
  charge(distance, 20, 60);
  //
  if (counter_waiting == max_counter_waiting || counter_waiting == 0) 
  {
    send_data = true;
  }
  if (counter_waiting == source_counter) 
  {
    send_data = false;
  }
  //
  if (counter_waiting == max_counter_waiting && send_data == true) 
  {
    send_data = false;
    counter++;
    String message = String(counter);
    webSocket.broadcastTXT(message);
  } 
  //
  if (counter_waiting == max_counter_waiting) 
  {
    source_counter = max_counter_waiting;
  }
  else if (counter_waiting == 0) 
  {
    source_counter = 0;
  }
  show_led();
  delay(300);
}
