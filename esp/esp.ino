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

//const char broker[] = "192.168.2.144";
IPAddress broker(MQTT_SERVER);
int port = 1883;

const char topic[] = "game/snake/direction";

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
  
  //mqttClient.subscribe(topic);
  
  mqttClient.subscribe("game/snake/board");
  mqttClient.subscribe("game/snake/extras");
}

int pos1 = 0;
int pos2 = 0;
int opos1 = 0;
int opos2 = 0;


int count = 0;
int foodpos1 = false;
int foodpos2 = false;
bool blinking = false;

void loop() {
  mqttClient.poll();

  int messageSize = mqttClient.parseMessage();
  Serial.println(messageSize);
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
    mqttClient.beginMessage("game/snake/action");
    mqttClient.print("");
    mqttClient.endMessage();
  }

  int xValue = analogRead(xPin);
  Serial.println(xValue);
  if (xValue == 0) {
    Serial.println("oben");
    //pos1 = pos1+1;
    sendMessage("up");
  } else if (xValue > 4000) {
    Serial.println("unten");
    //pos1 = pos1-1;
    sendMessage("down");
  }

  int yValue = analogRead(yPin);
  Serial.println(yValue);
  if (yValue == 0) {
    Serial.println("rechts");
    //pos2 = pos2+1;
    sendMessage("right");
  } else if (yValue > 4000) {
    Serial.println("links");
    //pos2 = pos2-1;
    sendMessage("left");
  }

  Serial.println("----------");

  if (blinking) {
    count++;
    bool blink = count >= 0 ? true : false;
    if (count >= 5) {
      count = -5;
    }
  
    mx.setPoint(foodpos1, 7 - foodpos2, blink);
  }
  
  Serial.println(foodpos1);
  Serial.println(foodpos2);
  delay(100);
}

void sendMessage(char message[]) {
  mqttClient.beginMessage(topic);
  mqttClient.print(message);
  mqttClient.endMessage();
}


void onMqttMessage(int messageSize) {
  // we received a message, print out the topic and contents
  Serial.println("Received a message with topic '");
  Serial.print(mqttClient.messageTopic());
  Serial.print("', length ");
  Serial.print(messageSize);
  Serial.println(" bytes:");

  String messageTopic = mqttClient.messageTopic();

  if (messageTopic == "game/snake/board") {
    int rowCount = 0;
    while (mqttClient.available()) {
      uint8_t row = (uint8_t)mqttClient.read();
      Serial.print(row);
      mx.setRow(rowCount, row);
      rowCount++;
    }
  }

  if (messageTopic == "game/snake/extras") {
    if (mqttClient.available()) {
      foodpos1 = mqttClient.read();
      foodpos2 = mqttClient.read();
      blinking = true;
    } else if (blinking) {
      blinking = false;
      mx.setPoint(foodpos1, 7 - foodpos2, false);
    }
  }
  
  Serial.println();
  Serial.println();
}
