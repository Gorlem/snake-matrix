#include <WiFi.h>
#include <ArduinoMqttClient.h>

const char ssid[] = "WLAN";
const char password[] = "XXX";

//const char broker[] = "192.168.2.144";
IPAddress broker(192, 168, 2, 144);
int port = 1883;

const char topic[] = "test/topic";

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

int xPin = 35;
int yPin = 32;
int buttonPin = 33;

void setup() {
  Serial.begin(115200);
  
  connectWifi();
  connectMqtt();
}

void connectWifi() {
  WiFi.mode(WIFI_STA);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println(WiFi.localIP());
}

void connectMqtt() {
  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());

    while (1);
  }
  Serial.println("You're connected to the MQTT broker!");
  Serial.println();

  mqttClient.subscribe(topic);
}

void loop() {
  //mqttClient.poll();

  int messageSize = mqttClient.parseMessage();
  if (messageSize) {
    while (mqttClient.available()) {
      Serial.print((char)mqttClient.read());
    }
    Serial.println();
  }

  int buttonValue = analogRead(buttonPin);
  Serial.println(buttonValue);
  if (buttonValue == 0) {
    Serial.println("knopf");
    sendMessage("button");
  }

  int xValue = analogRead(xPin);
  Serial.println(xValue);
  if (xValue == 0) {
    Serial.println("links");
    sendMessage("left");
  } else if (xValue > 4000) {
    Serial.println("rechts");
    sendMessage("right");
  }

  int yValue = analogRead(yPin);
  Serial.println(yValue);
  if (yValue == 0) {
    Serial.println("oben");
    sendMessage("up");
  } else if (yValue > 4000) {
    Serial.println("unten");
    sendMessage("down");
  }

  Serial.println("----------");
  delay(1000);
}

void sendMessage(char message[]) {
  mqttClient.beginMessage(topic);
  mqttClient.print(message);
  mqttClient.endMessage();
}
