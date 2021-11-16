#matrix & joystick

esp | matrix | joystick
--- | --- | ---
3V3 | VCC | +5V
GND | GND | GND
D5  | DIN |
D18 | CS  |
D19 | CLK |
D33 |     | SW
D32 |     | VRy
D35 |     | VRx


***
#game/.env
```
MQTT_IP=<ip-address>
```
***
#esp/arduino_secrets.h
```
#define SECRET_SSID "<ssid>"
#define SECRET_PASS "<pass>"
#define MQTT_SERVER 192,168,2,144
```