#include <MD_MAX72xx.h>

#define HARDWARE_TYPE MD_MAX72XX::GENERIC_HW
#define MAX_DEVICES 1

#define CLK_PIN   19  // or SCK
#define DATA_PIN  5  // or MOSI
#define CS_PIN    18  // or SS

MD_MAX72XX mx = MD_MAX72XX(HARDWARE_TYPE, DATA_PIN, CLK_PIN, CS_PIN, MAX_DEVICES);

#include <WiFi.h>
#include <ArduinoMqttClient.h>

#include "arduino_secrets.h"
const char ssid[] = SECRET_SSID;
const char password[] = SECRET_PASS;

IPAddress broker(MQTT_SERVER);
int port = 1883;

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

int xPin = 35;
int yPin = 32;
int buttonPin = 33;

void setup() {
  mx.begin();
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

  // set the message receive callback
  mqttClient.onMessage(onMqttMessage);  
  mqttClient.subscribe("board");
}

int count = 0;
int foodpos1 = false;
int foodpos2 = false;

void loop() {
  mqttClient.poll();
  
  int buttonValue = analogRead(buttonPin);
  if (buttonValue == 0) {
    sendAction();
  }

  int xValue = analogRead(xPin);
  if (xValue == 0) {
    sendDirection("up");
  } else if (xValue > 4000) {
    sendDirection("down");
  }

  int yValue = analogRead(yPin);
  if (yValue == 0) {
    sendDirection("right");
  } else if (yValue > 4000) {
    sendDirection("left");
  }

  if (foodpos1 != -1 && foodpos2 != -1) {
    count++;
    bool blink = count >= 0 ? true : false;
    if (count >= 5) {
      count = -5;
    }
  
    mx.setPoint(foodpos1, 7 - foodpos2, blink);
  }
  
  delay(100);
}

void sendDirection(char message[]) {
  mqttClient.beginMessage("direction");
  mqttClient.print(message);
  mqttClient.endMessage();
}

void sendAction() {
  mqttClient.beginMessage("action");
  mqttClient.endMessage();
}

void onMqttMessage(int messageSize) {
  String messageTopic = mqttClient.messageTopic();

  mx.clear();

  if (messageTopic == "board") {
    for (int i = 0; i < 8; i++) {
      uint8_t row = (uint8_t)mqttClient.read();
      mx.setRow(i, row);
    }

    foodpos1 = mqttClient.read();
    foodpos2 = mqttClient.read();
  }
}
