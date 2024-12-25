#include <PulseSensorPlayground.h>
#include <WebServer.h>
#include <WiFi.h>

const char *ssid      = "";
const char *password  = "";

const int sensorPin   = 34;
const int count_beats = 10;

PulseSensorPlayground pulseSensor;

WebServer server(80);

void handlePulse() {
  int sumBPM = 0;
  for (int i = 0; i < count_beats; i++) {
    int beatDetected = pulseSensor.sawStartOfBeat();
    if (beatDetected) {
      int BPM = pulseSensor.getBeatsPerMinute();
      Serial.print("BPM: ");
      Serial.println(BPM);
      sumBPM += BPM;
      delay(1000);
    } else {
      i--;
    }
    beatDetected = 0;
  }
  Serial.println(String(sumBPM / count_beats));
  server.send(200, "text/plain", String(sumBPM / count_beats));
}

void handleRoot() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel=preconnect href="https://fonts.googleapis.com">
    <link rel=preconnect href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel=stylesheet>
</head>
<style>
    * {
        margin: 0;
        padding: 0;
        font-family: "Vazirmatn", serif;
    }

    body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100dvh;
        background: #c5eeff;
        gap: 10px;
    }

    form {
        max-width: 200px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: #64ccf8;
        padding: 20px;
        border-radius: 20px;
    }

    p {
        background: #64ccf8;
        padding: 10px;
        border-radius: 10px;
    }

    input {
        padding: 5px 8px;
        border-radius: 10px;
    }

    button {
        padding: 5px 8px;
        border-radius: 10px;
        background: #cbedfb;
    }
</style>

<body>
    <form>
        <label for="bpm">میانگین 10 ضربان</label>
        <span id="bpm"></span>
        <hr>
        <label for="age">سن</label>
        <input type="number" name="age" id="age" placeholder="1">
        <button type="button" title="getBPM" onclick="getBeat()">گرفتن پالس</button>
    </form>
    <div>
        <p id="message">آماده گرفتن پالس</p>
    </div>
    <script>
        function getBeat() {
            document.getElementById("message").innerText = "در حال گرفتن پالس";
            fetch("/s").then((response) => {
                return response.json()
            }).then((response) => {
                const elm = document.getElementById("bpm");
                elm.innerText = response;
                response = parseInt(response || 0)
                const age = parseInt(document.getElementById("age").innerText || "1");
                let message = "";
                if (age >= 1 && age < 3) {
                    const b = Math.abs(response - 98)
                    const o = Math.abs(response - 110)
                    const t = Math.abs(response - 140)
                    if (b < o) {
                        message = "پایین"
                    }
                    else if (t < o) {
                        message = "بالا"
                    }
                    else {
                        message = "طبیعی"
                    }
                }
                else if (age >= 3 && age < 5) {
                    const b = Math.abs(response - 80)
                    const o = Math.abs(response - 100)
                    const t = Math.abs(response - 120)
                    if (b < o) {
                        message = "پایین"
                    }
                    else if (t < o) {
                        message = "بالا"
                    }
                    else {
                        message = "طبیعی"
                    }
                }
                else if (age >= 5 && age < 12) {
                    const b = Math.abs(response - 75)
                    const o = Math.abs(response - 90)
                    const t = Math.abs(response - 118)
                    if (b < o) {
                        message = "پایین"
                    }
                    else if (t < o) {
                        message = "بالا"
                    }
                    else {
                        message = "طبیعی"
                    }
                }
                else if (age >= 12 && age < 20) {
                    const b = Math.abs(response - 60)
                    const o = Math.abs(response - 80)
                    const t = Math.abs(response - 100)
                    if (b < o) {
                        message = "پایین"
                    }
                    else if (t < o) {
                        message = "بالا"
                    }
                    else {
                        message = "طبیعی"
                    }
                }
                else if (age >= 20 && age < 40) {
                    const b = Math.abs(response - 55)
                    const o = Math.abs(response - 75)
                    const t = Math.abs(response - 95)
                    if (b < o) {
                        message = "پایین"
                    }
                    else if (t < o) {
                        message = "بالا"
                    }
                    else {
                        message = "طبیعی"
                    }
                }
                else if (age >= 40 && age < 60) {
                    const b = Math.abs(response - 55)
                    const o = Math.abs(response - 75)
                    const t = Math.abs(response - 95)
                    if (b < o) {
                        message = "پایین"
                    }
                    else if (t < o) {
                        message = "بالا"
                    }
                    else {
                        message = "طبیعی"
                    }
                }
                else if (age >= 60) {
                    const b = Math.abs(response - 55)
                    const o = Math.abs(response - 75)
                    const t = Math.abs(response - 98)
                    if (b < o) {
                        message = "پایین"
                    }
                    else if (t < o) {
                        message = "بالا"
                    }
                    else {
                        message = "طبیعی"
                    }
                }
                document.getElementById("message").innerText = message;

            })
        }
    </script>
</body>
</html>
)rawliteral";
  server.send(200, "text/html", html);
}

void setup() {
  Serial.begin(115200);

  pulseSensor.analogInput(sensorPin);
  pulseSensor.setThreshold(550);

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
  server.on("/", handleRoot);
  server.on("/s", HTTP_GET, handlePulse);
  server.begin();      
  Serial.println("Server started");

  Serial.print("Server Address: ");
  Serial.println(WiFi.localIP());

  if (pulseSensor.begin()) {
    Serial.println("Pulse Sensor initialized successfully!");
  } else {
    Serial.println("Pulse Sensor initialization failed!");
  }
}

void loop() { server.handleClient(); }
