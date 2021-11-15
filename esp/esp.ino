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
}

int pos1 = 0;
int pos2 = 0;
int opos1 = 0;
int opos2 = 0;


int count = 0;
int foodpos1 = false;
int foodpos2 = false;

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
    sendMessage("button");
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

  // move point with joystick
  /*
  if (pos1 < 0) {
    pos1 = 0;
  }
  if (pos2 < 0) {
    pos2 = 0;
  }
  if (pos1 > 7) {
    pos1 = 7;
  }
  if (pos2 > 7) {
    pos2 = 7;
  }
  mx.setPoint(opos1, opos2, false);
  mx.setPoint(pos1, pos2, true);
  opos1 = pos1;
  opos2 = pos2;
  */
  //uint8_t buf[64];
  //mx.setBuffer(0,64,0x1111000011110000111100001111000011110000111100001111000011110000);
  

  if (count == 1) {
    mx.setPoint(foodpos1, foodpos2, true);  
    count=0;
  } else {
    mx.setPoint(foodpos1, foodpos2, false);  
    count++;
  }
  Serial.println(foodpos1);
  Serial.println(foodpos2);
  delay(500);
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
  int count1 = 7;
  int count2 = 0;
  // use the Stream interface to print the contents
  while (mqttClient.available()) {
    int message = (int)mqttClient.read();
    Serial.print(message);
    if(message == 0) {
      mx.setPoint(count1, count2, false);
    } else if (message == 2){
      mx.setPoint(count1, count2, true);  
    } else if (message == 1) {
      mx.setPoint(count1, count2, true);  
    } else {
      foodpos1 = count1;
      foodpos2 = count2;
    }
    count2++;
    if(count2 == 8) {
      count2 = 0;
      count1--;
    }
  }
  Serial.println();

  Serial.println();
}
