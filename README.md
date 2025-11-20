# IOT PROJECT REPORT

## LightSync: Smart Home Automation System with Real-Time Control

**Nikhil (202439), Jagdeep (202448), Harish (202432)**  
**November 20, 2025**

---

## Contents

1. [INTRODUCTION](#1-introduction)
2. [OBJECTIVES](#2-objectives)
3. [SYSTEM ARCHITECTURE](#3-system-architecture)
4. [REQUIREMENTS](#4-requirements)
   - 4.1 ESP32 Microcontroller
   - 4.2 DHT11 Temperature & Humidity Sensor
   - 4.3 PIR Motion Sensor (HC-SR501)
   - 4.4 LED Modules (Red, Yellow, Green)
   - 4.5 Potentiometer (Optional)
5. [CIRCUIT DIAGRAM & WIRING](#5-circuit-diagram--wiring)
6. [SOFTWARE IMPLEMENTATION](#6-software-implementation)
   - 6.1 ESP32 Firmware (Arduino C++)
   - 6.2 Backend Server (Node.js + Express)
   - 6.3 Mobile Application (React Native/Expo)
7. [DATA FLOW](#7-data-flow)
8. [BENEFITS & FUTURE SCOPE](#8-benefits--future-scope)
   - 8.1 Benefits
   - 8.2 Future Scope
9. [CODE SECTION](#9-code-section)
   - 9.1 ESP32 Firmware – Main Logic
   - 9.2 Backend Server – WebSocket & Socket.IO Handlers
   - 9.3 React Native – Real-Time Control Components
10. [TECH STACK DETAILS](#10-tech-stack-details)
11. [USE CASES](#11-use-cases)
12. [TEAM MEMBERS](#12-team-members)

---

## 1. INTRODUCTION

Smart home automation represents the future of residential living, integrating Internet of Things (IoT) technology to create intelligent, responsive environments. **LightSync** is a comprehensive IoT-based smart home automation system that demonstrates real-time device control, sensor monitoring, and cloud-based synchronization.

The system enables users to control multiple smart lights (Red, Yellow, and Green LEDs) and a fan through a mobile application, while simultaneously monitoring environmental conditions such as temperature and humidity. Additionally, the system features motion detection capabilities that trigger automated responses and real-time alerts.

**LightSync** integrates an ESP32 microcontroller for hardware control, a Node.js backend server with dual WebSocket support (native WebSocket for ESP32 and Socket.IO for mobile clients), MongoDB for data persistence, and a React Native mobile application for cross-platform user interaction. The system showcases bidirectional real-time communication, PWM-based brightness control, energy consumption tracking, and intelligent automation features.

This project exemplifies modern IoT architecture by combining edge computing, cloud services, and mobile interfaces into a seamless, responsive smart home ecosystem.

---

## 2. OBJECTIVES

The primary aim of the project is to create a fully integrated smart home automation system with real-time synchronization between hardware, cloud backend, and mobile application.

### Primary Objectives

* To develop a multi-device smart home control system with real-time synchronization.
* To implement automated lighting control based on motion detection.
* To provide remote device control through a mobile application with instant feedback.
* To monitor environmental conditions (temperature, humidity) in real-time.
* To implement PWM-based brightness control for dimmable lighting.
* To track energy consumption and provide usage analytics.
* To maintain persistent device state across all system components.

### Secondary Objectives

* To understand WebSocket and Socket.IO protocols for real-time communication.
* To implement dual-protocol communication (WebSocket for ESP32, Socket.IO for mobile).
* To explore Redux state management in React Native applications.
* To study full-stack IoT development including hardware, backend, and frontend.
* To implement responsive UI/UX design for mobile applications.
* To explore cloud deployment strategies for IoT backends.

---

## 3. SYSTEM ARCHITECTURE

The LightSync IoT system is architected with four interconnected layers:

### 1. Hardware Layer (ESP32 + Sensors + Actuators)
- **ESP32 Microcontroller**: Central processing unit handling sensor readings, LED control, and network communication.
- **DHT11 Sensor**: Monitors temperature and humidity.
- **PIR Motion Sensor**: Detects human presence and movement.
- **LED Modules**: Three independent LED lights (Red, Yellow, Green) with PWM capability for Green LED.
- **Potentiometer**: Optional manual brightness control for Green LED.

### 2. Communication Layer (WebSocket Protocol)
- **Native WebSocket Server**: Handles direct communication with ESP32 devices.
- **Socket.IO Server**: Manages real-time communication with mobile application clients.
- **Protocol Bridge**: Server translates messages between WebSocket and Socket.IO protocols.

### 3. Cloud Backend Layer (Node.js + Express + MongoDB)
- **Express Server**: RESTful API and WebSocket server hosting.
- **MongoDB Database**: Stores device states, sensor history, and activity logs.
- **Real-time Event Broadcasting**: Synchronizes state across all connected clients.

### 4. Application Layer (React Native Mobile App)
- **Cross-platform Mobile Application**: iOS and Android support via Expo.
- **Real-time Dashboard**: Live sensor data, device controls, and motion alerts.
- **Energy Monitoring**: Real-time and historical energy consumption tracking.
- **Voice Integration**: Smart assistant (Bruno) for voice commands.

**Figure 1: LightSync System Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APPLICATION                        │
│              (React Native / Expo - iOS/Android)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │  Energy  │  │  Light   │  │  Motion  │   │
│  │  Screen  │  │  Screen  │  │ Control  │  │  Alerts  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ Socket.IO
                        │ (Real-time Events)
┌───────────────────────▼─────────────────────────────────────┐
│              CLOUD BACKEND SERVER                            │
│         (Node.js + Express + Socket.IO)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  WebSocket Server (/esp32-ws)                        │   │
│  │  Socket.IO Server (Mobile Clients)                   │   │
│  │  Protocol Bridge & Event Broadcasting                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MongoDB Database                         │   │
│  │  - Device States  - Sensor History  - Activity Logs  │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ WebSocket (WSS)
                        │ (SSL Encrypted)
┌───────────────────────▼─────────────────────────────────────┐
│                    HARDWARE LAYER                            │
│                    (ESP32 Microcontroller)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  DHT11   │  │   PIR    │  │   LED    │  │    PWM   │   │
│  │  Sensor  │  │  Motion  │  │  Modules │  │  Control │   │
│  │ (Temp/   │  │  Sensor  │  │ (R/Y/G)  │  │  (Green) │   │
│  │ Humidity)│  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. REQUIREMENTS

### 4.1 ESP32 Microcontroller

The ESP32 serves as the central processing unit of the hardware layer. It features:
- **Dual-core processor** (240MHz)
- **Built-in Wi-Fi and Bluetooth** capabilities
- **GPIO pins** for sensor and actuator connections
- **PWM support** for analog-like control (brightness dimming)
- **WebSocket client library** support for cloud communication

**Key Specifications:**
- Operating Voltage: 3.3V
- Digital I/O Pins: Multiple configurable GPIO pins
- ADC Resolution: 12-bit (0-4095)
- PWM Resolution: 8-bit (0-255) for LED brightness control

### 4.2 DHT11 Temperature & Humidity Sensor

The DHT11 sensor provides environmental monitoring:
- **Temperature Range**: 0°C to 50°C (±2°C accuracy)
- **Humidity Range**: 20% to 90% RH (±5% accuracy)
- **Digital Output**: Single-wire communication protocol
- **Update Rate**: 1Hz (1 reading per second)

**Connection:**
- VCC → 5V
- GND → GND
- DATA → GPIO 4

### 4.3 PIR Motion Sensor (HC-SR501)

Detects infrared radiation changes to sense human motion:
- **Detection Range**: Up to 7 meters
- **Detection Angle**: 110 degrees
- **Output**: Digital HIGH/LOW signal
- **Delay Time**: Adjustable (typically 5-300 seconds)

**Connection:**
- VCC → 5V
- GND → GND
- OUT → GPIO 27

### 4.4 LED Modules (Red, Yellow, Green)

Three independent LED lights for different room zones:
- **Red LED**: Front Door lighting (GPIO 25)
- **Yellow LED**: Back Door lighting (GPIO 32)
- **Green LED**: Fan/Roof lighting (GPIO 33) with PWM brightness control

**Specifications:**
- Red LED: 1.5W power consumption
- Yellow LED: 1.5W power consumption
- Green LED: 3.3W power consumption (variable with PWM)

### 4.5 Potentiometer (Optional)

Manual brightness control for Green LED:
- **Type**: 10kΩ linear potentiometer
- **Connection**: Analog input GPIO 34
- **Function**: Overrides app control when adjusted

---

## 5. CIRCUIT DIAGRAM & WIRING

### Pin-to-Pin Wiring Table

| Component | Pin | Connects To | ESP32 Pin | Notes |
|-----------|-----|-------------|-----------|-------|
| DHT11 Sensor | VCC | Power | 5V | Temperature/Humidity |
| DHT11 Sensor | GND | Ground | GND | |
| DHT11 Sensor | DATA | Signal | GPIO 4 | Digital communication |
| PIR Motion Sensor | VCC | Power | 5V | Motion detection |
| PIR Motion Sensor | GND | Ground | GND | |
| PIR Motion Sensor | OUT | Signal | GPIO 27 | Digital output |
| Red LED | Anode | Control | GPIO 25 | Digital ON/OFF |
| Red LED | Cathode | Ground | GND | Via current-limiting resistor |
| Yellow LED | Anode | Control | GPIO 32 | Digital ON/OFF |
| Yellow LED | Cathode | Ground | GND | Via current-limiting resistor |
| Green LED | Anode | PWM Control | GPIO 33 | PWM brightness (0-255) |
| Green LED | Cathode | Ground | GND | Via current-limiting resistor |
| Potentiometer | Terminal 1 | Power | 3.3V | Optional brightness control |
| Potentiometer | Terminal 2 | Analog Input | GPIO 34 | ADC reading (0-4095) |
| Potentiometer | Terminal 3 | Ground | GND | |

### Power Requirements

- **ESP32**: 3.3V (via USB or external power supply)
- **Sensors**: 5V (DHT11, PIR) - ESP32 can provide 5V on VIN pin
- **LEDs**: 3.3V logic level, external power recommended for high-power LEDs

**Figure 2: Circuit Diagram Overview**

```
                    ESP32 Microcontroller
    ┌─────────────────────────────────────────────┐
    │                                             │
    │  GPIO 4  ──────► DHT11 (DATA)              │
    │  GPIO 27 ──────► PIR Sensor (OUT)          │
    │  GPIO 25 ──────► Red LED (Anode)           │
    │  GPIO 32 ──────► Yellow LED (Anode)        │
    │  GPIO 33 ──────► Green LED (PWM)           │
    │  GPIO 34 ──────► Potentiometer (Wiper)     │
    │                                             │
    │  5V ───────────► DHT11, PIR (VCC)          │
    │  3.3V ─────────► Potentiometer (Terminal 1)│
    │  GND ──────────► All GND connections       │
    │                                             │
    │  Wi-Fi ────────► Router ───► Internet      │
    │                    │                        │
    │                    └──► Cloud Server        │
    └─────────────────────────────────────────────┘
```

---

## 6. SOFTWARE IMPLEMENTATION

### 6.1 ESP32 Firmware (Arduino C++)

The ESP32 firmware handles:

**Core Functions:**
- **Wi-Fi Connection**: Connects to local network and maintains connection
- **WebSocket Communication**: Establishes secure SSL connection to cloud server
- **Sensor Reading**: Polls DHT11 sensor every 10 seconds for temperature/humidity
- **Motion Detection**: Monitors PIR sensor for state changes and sends instant events
- **LED Control**: Manages three independent LEDs with digital and PWM control
- **Brightness Control**: Handles PWM-based dimming for Green LED (0-255)
- **Potentiometer Reading**: Reads analog value and maps to brightness (0-255)
- **State Synchronization**: Sends device state updates to server
- **Heartbeat Mechanism**: Maintains connection with 30-second heartbeat

**Key Features:**
- Automatic reconnection on network failure
- Event-based motion detection (triggers on state change)
- Bidirectional brightness control (app ↔ potentiometer)
- JSON-based message protocol for structured communication

**Communication Protocol:**
- **Outgoing Events**: `sensorData`, `motionDetected`, `greenBrightnessUpdate`, `heartbeat`
- **Incoming Commands**: `redLight`, `greenLight`, `yellowLight`, `allLights`, `setGreenBrightness`

### 6.2 Backend Server (Node.js + Express)

The backend server manages:

**Server Components:**
- **Express HTTP Server**: Handles REST API endpoints and serves as base for WebSocket upgrade
- **Native WebSocket Server**: Direct communication with ESP32 devices on `/esp32-ws` endpoint
- **Socket.IO Server**: Real-time communication with mobile application clients
- **MongoDB Integration**: Stores device states, sensor history, and activity logs
- **Protocol Bridge**: Translates messages between WebSocket and Socket.IO protocols

**Key Endpoints & Events:**

**WebSocket Events (ESP32 → Server):**
- `sensorData`: Temperature, humidity, LED states
- `motionDetected`: Motion detection events
- `greenBrightnessUpdate`: Brightness changes from potentiometer
- `ledUpdate`: LED state confirmations
- `heartbeat`: Connection keep-alive

**Socket.IO Events (Mobile App ↔ Server):**
- `toggleRedLed`: Toggle Red LED state
- `toggleGreenLed`: Toggle Green LED state
- `toggleYellowLed`: Toggle Yellow LED state
- `toggleAllLights`: Toggle all LEDs simultaneously
- `setGreenBrightness`: Set Green LED brightness (0-255)
- `sensorUpdate`: Broadcast sensor data to all clients
- `objectDetected`: Broadcast motion detection to all clients
- `ledUpdate`: Broadcast LED state changes
- `greenBrightnessUpdate`: Broadcast brightness changes

**Server Features:**
- Multi-client support (multiple ESP32 devices and mobile apps)
- Real-time event broadcasting to all connected clients
- Connection management and error handling
- SSL/TLS support for secure WebSocket connections
- Deployed on Render cloud platform

### 6.3 Mobile Application (React Native/Expo)

The mobile application provides:

**Core Screens:**

1. **Home Screen** (`index.tsx`):
   - Smart assistant (Bruno) with voice command support
   - Real-time temperature and humidity display
   - Motion alerts with speech notifications
   - Individual LED controls (Red, Yellow, Green/Fan)
   - "Quick On" button for all lights
   - Fan speed control with visual rotation animation
   - Energy summary widget

2. **Energy Screen** (`energy.tsx`):
   - Real-time energy consumption chart (last 5 minutes)
   - Per-device usage breakdown (Lamp 1: 1.5W, Lamp 2: 1.5W, Fan: 3.3W)
   - Today's summary statistics (peak, average, total)
   - Cost calculation based on electricity rates

3. **Light Control Screen** (`light/[id].tsx`):
   - Individual light brightness control
   - Slider interface (0-100%)
   - Quick preset buttons (25%, 50%, 100%)
   - Real-time brightness synchronization

4. **Motion Alerts Screen** (`motionalerts.tsx`):
   - Live motion activity chart (last 10 minutes)
   - Statistics (today's total, last hour)
   - Recent alerts list with timestamps
   - Live status indicator

**State Management:**
- **Redux Toolkit**: Centralized state management
- **lightSyncSlice**: Manages all device states, sensor data, and motion alerts
- **Real-time Updates**: Socket.IO listeners update Redux store automatically

**Key Features:**
- Cross-platform support (iOS and Android via Expo)
- Real-time synchronization with hardware
- Optimistic UI updates for instant feedback
- Sound effects for button interactions
- Speech synthesis for motion alerts
- Animated fan rotation based on state
- Energy consumption tracking and visualization

---

## 7. DATA FLOW

The LightSync system implements bidirectional real-time data flow:

### 7.1 Sensor Data Flow (ESP32 → Mobile App)

```
1. DHT11 Sensor reads temperature/humidity
   ↓
2. ESP32 processes sensor data
   ↓
3. ESP32 sends JSON message via WebSocket:
   {
     "event": "sensorData",
     "temperature": 26.6,
     "humidity": 78,
     "redLedState": false,
     "greenLedState": true,
     "yellowLedState": false,
     "timestamp": 1234567890
   }
   ↓
4. Server receives WebSocket message
   ↓
5. Server broadcasts via Socket.IO: "sensorUpdate"
   ↓
6. Mobile app receives event
   ↓
7. Redux store updates (updateSensorData, updateLedStates)
   ↓
8. UI components re-render with new data
```

### 7.2 Motion Detection Flow

```
1. PIR Sensor detects motion (LOW → HIGH transition)
   ↓
2. ESP32 triggers motion event handler
   ↓
3. ESP32 sends instant WebSocket message:
   {
     "event": "motionDetected",
     "deviceId": "ESP32_01",
     "motionDetected": 1,
     "timestamp": 1234567890
   }
   ↓
4. Server receives motion event
   ↓
5. Server broadcasts via Socket.IO: "objectDetected"
   ↓
6. Mobile app receives event
   ↓
7. Redux store adds motion alert (addMotionAlert)
   ↓
8. Speech synthesis announces motion alert
   ↓
9. Yellow LED automatically turns ON (if off)
   ↓
10. Motion alerts screen updates with new entry
```

### 7.3 Device Control Flow (Mobile App → ESP32)

```
1. User taps LED control button in mobile app
   ↓
2. Optimistic UI update (Redux: toggleRedLed)
   ↓
3. Socket.IO emits: "toggleRedLed" with new state
   ↓
4. Server receives Socket.IO event
   ↓
5. Server forwards to ESP32 via WebSocket:
   {
     "redLight": true
   }
   ↓
6. ESP32 receives command
   ↓
7. ESP32 updates GPIO pin (digitalWrite)
   ↓
8. ESP32 sends confirmation via WebSocket:
   {
     "event": "ledUpdate",
     "redLedState": true,
     "timestamp": 1234567890
   }
   ↓
9. Server broadcasts confirmation via Socket.IO: "ledUpdate"
   ↓
10. Mobile app receives confirmation
   ↓
11. Redux store syncs final state (updateLedStates)
   ↓
12. UI reflects confirmed state
```

### 7.4 Brightness Control Flow (Bidirectional)

**App → ESP32:**
```
1. User adjusts brightness slider in mobile app
   ↓
2. Local state updates (optimistic)
   ↓
3. Debounced Socket.IO emit: "setGreenBrightness"
   ↓
4. Server forwards to ESP32 via WebSocket:
   {
     "event": "setGreenBrightness",
     "brightness": 128,
     "timestamp": 1234567890
   }
   ↓
5. ESP32 updates PWM (ledcWrite)
   ↓
6. ESP32 sends confirmation: "greenBrightnessUpdate"
   ↓
7. Server broadcasts to all clients
   ↓
8. Mobile app syncs final brightness value
```

**Potentiometer → App:**
```
1. User rotates potentiometer
   ↓
2. ESP32 reads analog value (0-4095)
   ↓
3. ESP32 maps to brightness (0-255)
   ↓
4. ESP32 updates PWM immediately
   ↓
5. ESP32 sends: "greenBrightnessUpdate"
   ↓
6. Server broadcasts via Socket.IO
   ↓
7. Mobile app receives and updates Redux store
   ↓
8. UI slider updates to match hardware
```

---

## 8. BENEFITS & FUTURE SCOPE

### 8.1 Benefits

**Energy Efficiency:**
- Automated lighting reduces unnecessary energy consumption
- Motion-based activation ensures lights only operate when needed
- Real-time energy monitoring helps users track and optimize usage
- PWM brightness control allows fine-tuned power management

**Convenience & Accessibility:**
- Remote control from anywhere with internet connectivity
- Cross-platform mobile application (iOS and Android)
- Voice command integration for hands-free operation
- Intuitive user interface with real-time feedback

**Safety & Security:**
- Motion detection provides security monitoring
- Instant alerts for unexpected activity
- Automated responses (e.g., lights turn on when motion detected)
- Activity logging for security audit trails

**Scalability:**
- Modular architecture supports multiple devices
- Cloud-based backend can handle numerous concurrent connections
- Easy addition of new sensors and actuators
- Protocol-agnostic design allows future protocol integration

**Real-time Synchronization:**
- Instant state updates across all devices
- No polling delays - event-driven architecture
- Optimistic UI updates for responsive user experience
- Bidirectional communication ensures consistency

**Cost-Effectiveness:**
- Open-source technologies reduce licensing costs
- Cloud deployment on Render (free tier available)
- Standard hardware components (ESP32, sensors)
- No proprietary hardware requirements

### 8.2 Future Scope

**Enhanced Automation:**
- Machine learning-based predictive lighting control
- Time-based scheduling and routines
- Integration with sunrise/sunset times
- Occupancy-based room-level automation
- Adaptive brightness based on ambient light sensors

**Expanded Device Support:**
- Smart switches and outlets
- Thermostat integration for HVAC control
- Security cameras with motion-triggered recording
- Smart locks and door sensors
- Water leak detectors and smoke alarms

**Advanced Features:**
- Multi-room support with zone-based control
- User profiles and personalized settings
- Guest mode with limited access
- Energy usage predictions and recommendations
- Integration with renewable energy sources (solar panels)

**Voice & AI Integration:**
- Enhanced voice assistant with natural language processing
- Integration with Amazon Alexa, Google Assistant, Apple Siri
- AI-powered anomaly detection for security
- Predictive maintenance alerts
- Personalized automation suggestions

**Data Analytics:**
- Historical data visualization and trends
- Energy consumption reports and insights
- Motion pattern analysis
- Device usage statistics
- Cost analysis and savings reports

**Security Enhancements:**
- End-to-end encryption for all communications
- Two-factor authentication for mobile app
- Device authentication and authorization
- Secure firmware updates (OTA)
- Intrusion detection and alerting

**Integration & Ecosystem:**
- Integration with smart home platforms (Home Assistant, OpenHAB)
- IFTTT and Zapier integration for automation workflows
- Webhook support for third-party integrations
- REST API for external applications
- MQTT protocol support for IoT device compatibility

**User Experience:**
- Augmented reality (AR) device setup
- Gesture-based controls
- Wearable device integration (smartwatch)
- Web dashboard for desktop access
- Multi-language support

---

## 9. CODE SECTION

### 9.1 ESP32 Firmware – Main Logic

**File:** `server/esp32code/localServer.cpp`

```cpp
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// Pin Definitions
#define LED_PIN_RED 25
#define LED_PIN_GREEN 33
#define LED_PIN_YELLOW 32
#define DHT_PIN 4
#define DHT_TYPE DHT11
#define OBJECT_SENSOR_PIN 27
#define POT_PIN 34

// WiFi Credentials
const char *ssid = "lightsync";
const char *password = "123432123";

// WebSocket Server
const char *host = "lightsync-server.onrender.com";
const uint16_t port = 443;
const char *path = "/esp32-ws";

// Objects
DHT dht(DHT_PIN, DHT_TYPE);
WebSocketsClient webSocket;

// State Variables
bool isConnected = false;
bool redLedState = false;
bool greenLedState = false;
bool yellowLedState = false;
bool allLightsState = false;
int lastObjectState = LOW;
int potBrightness = 0;
int appBrightness = -1;

// PWM Settings
const int pwmFreq = 5000;
const int pwmResolution = 8;

// WebSocket Event Handler
void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
    switch (type) {
        case WStype_CONNECTED:
            isConnected = true;
            webSocket.sendTXT("ESP32_connected");
            break;
        case WStype_TEXT: {
            String message = String((char *)payload);
            
            // Handle LED control commands
            if (message.indexOf("redLight") >= 0) {
                redLedState = (message.indexOf("true") >= 0);
                digitalWrite(LED_PIN_RED, redLedState ? HIGH : LOW);
            }
            if (message.indexOf("greenLight") >= 0) {
                greenLedState = (message.indexOf("true") >= 0);
                appBrightness = -1;
                ledcWrite(LED_PIN_GREEN, greenLedState ? 255 : 0);
            }
            if (message.indexOf("yellowLight") >= 0) {
                yellowLedState = (message.indexOf("true") >= 0);
                digitalWrite(LED_PIN_YELLOW, yellowLedState ? HIGH : LOW);
            }
            if (message.indexOf("allLights") >= 0) {
                allLightsState = (message.indexOf("true") >= 0);
                digitalWrite(LED_PIN_RED, allLightsState ? HIGH : LOW);
                ledcWrite(LED_PIN_GREEN, allLightsState ? 255 : 0);
                digitalWrite(LED_PIN_YELLOW, allLightsState ? HIGH : LOW);
            }
            
            // Handle brightness control from app
            if (message.indexOf("setGreenBrightness") >= 0) {
                StaticJsonDocument<128> doc;
                deserializeJson(doc, message);
                int brightnessVal = doc["brightness"] | -1;
                if (brightnessVal >= 0 && brightnessVal <= 255) {
                    appBrightness = brightnessVal;
                    ledcWrite(LED_PIN_GREEN, appBrightness);
                }
            }
            break;
        }
        case WStype_DISCONNECTED:
            isConnected = false;
            break;
    }
}

// Send Sensor Data
void sendSensorData() {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    
    StaticJsonDocument<256> doc;
    doc["event"] = "sensorData";
    doc["deviceId"] = "ESP32_01";
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["redLedState"] = redLedState;
    doc["greenLedState"] = greenLedState;
    doc["yellowLedState"] = yellowLedState;
    doc["allLightsState"] = allLightsState;
    doc["timestamp"] = millis();
    
    String output;
    serializeJson(doc, output);
    webSocket.sendTXT(output);
}

// Send Motion Detection Event
void sendMotionDetected() {
    StaticJsonDocument<128> doc;
    doc["event"] = "motionDetected";
    doc["deviceId"] = "ESP32_01";
    doc["motionDetected"] = 1;
    doc["timestamp"] = millis();
    
    String output;
    serializeJson(doc, output);
    webSocket.sendTXT(output);
}

void setup() {
    Serial.begin(115200);
    
    // Initialize pins
    pinMode(LED_PIN_RED, OUTPUT);
    pinMode(LED_PIN_YELLOW, OUTPUT);
    ledcAttach(LED_PIN_GREEN, pwmFreq, pwmResolution);
    pinMode(OBJECT_SENSOR_PIN, INPUT);
    dht.begin();
    
    // Connect to WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    // Connect to WebSocket server
    webSocket.beginSSL(host, port, path);
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(5000);
    webSocket.enableHeartbeat(15000, 3000, 3);
}

void loop() {
    webSocket.loop();
    
    // Motion detection
    int currentObjectState = digitalRead(OBJECT_SENSOR_PIN);
    if (currentObjectState == HIGH && lastObjectState == LOW && isConnected) {
        sendMotionDetected();
    }
    lastObjectState = currentObjectState;
    
    // Potentiometer brightness control
    int potValue = analogRead(POT_PIN);
    int newPotBrightness = map(potValue, 0, 4095, 0, 255);
    if (abs(newPotBrightness - potBrightness) > 5) {
        potBrightness = newPotBrightness;
        appBrightness = -1;
        ledcWrite(LED_PIN_GREEN, potBrightness);
        
        // Send brightness update
        StaticJsonDocument<128> doc;
        doc["event"] = "greenBrightnessUpdate";
        doc["deviceId"] = "ESP32_01";
        doc["brightness"] = potBrightness;
        doc["timestamp"] = millis();
        String output;
        serializeJson(doc, output);
        webSocket.sendTXT(output);
    }
    
    // Send sensor data every 10 seconds
    static unsigned long lastSend = 0;
    if (isConnected && millis() - lastSend > 10000) {
        lastSend = millis();
        sendSensorData();
    }
    
    // Send heartbeat every 30 seconds
    static unsigned long lastHeartbeat = 0;
    if (isConnected && millis() - lastHeartbeat > 30000) {
        lastHeartbeat = millis();
        webSocket.sendTXT("{\"event\":\"heartbeat\",\"deviceId\":\"ESP32_01\"}");
    }
    
    delay(100);
}
```

### 9.2 Backend Server – WebSocket & Socket.IO Handlers

**File:** `server/app.js`

```javascript
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import WebSocket from "ws";
import mongoose from "mongoose";
import { randomUUID } from "crypto";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// WebSocket server for ESP32
const wss = new WebSocket.Server({ noServer: true });
let espConnections = [];

// Handle WebSocket upgrade
server.on("upgrade", (request, socket, head) => {
  if (request.url === "/esp32-ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  }
});

// ESP32 WebSocket Handler
wss.on("connection", (ws, req) => {
  console.log("🔌 ESP32 WebSocket connected");
  espConnections.push(ws);

  ws.on("message", (data) => {
    try {
      const parsedMessage = JSON.parse(data.toString());

      // Handle sensor data
      if (parsedMessage.event === "sensorData") {
        io.emit("sensorUpdate", parsedMessage);
      }

      // Handle motion detection
      if (parsedMessage.event === "motionDetected") {
        io.emit("objectDetected", {
          deviceId: randomUUID(),
          motion: true,
          timestamp: Date.now(),
        });
        io.emit("motionAlert", {
          message: "Motion detected in the area!",
          deviceId: parsedMessage.deviceId,
          timestamp: parsedMessage.timestamp,
        });
      }

      // Handle brightness update
      if (parsedMessage.event === "greenBrightnessUpdate") {
        io.emit("greenBrightnessUpdate", {
          deviceId: parsedMessage.deviceId,
          brightness: parsedMessage.brightness,
          timestamp: parsedMessage.timestamp,
        });
      }

      // Handle LED update confirmation
      if (parsedMessage.event === "ledUpdate") {
        io.emit("ledUpdate", parsedMessage);
      }
    } catch (error) {
      console.error("❌ Error parsing ESP32 message:", error);
    }
  });

  ws.on("close", () => {
    espConnections = espConnections.filter((c) => c !== ws);
  });
});

// Socket.IO (Mobile App) Handler
io.on("connection", (socket) => {
  console.log("⚡ Socket.IO client connected:", socket.id);

  // Toggle Red LED
  socket.on("toggleRedLed", (data) => {
    espConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ redLight: data.redLedState }));
      }
    });
    io.emit("ledUpdate", data);
  });

  // Toggle Green LED
  socket.on("toggleGreenLed", (data) => {
    espConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ greenLight: data.greenLedState }));
      }
    });
    io.emit("ledUpdate", data);
  });

  // Toggle Yellow LED
  socket.on("toggleYellowLed", (data) => {
    espConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ yellowLight: data.yellowLedState }));
      }
    });
    io.emit("ledUpdate", data);
  });

  // Toggle All Lights
  socket.on("toggleAllLights", (data) => {
    espConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ allLights: data.allLightsState }));
      }
    });
    io.emit("ledUpdate", data);
  });

  // Set Green LED Brightness
  socket.on("setGreenBrightness", (data) => {
    espConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          event: "setGreenBrightness",
          brightness: data.brightness,
          timestamp: Date.now(),
        }));
      }
    });
    socket.broadcast.emit("greenBrightnessUpdate", {
      brightness: data.brightness,
      timestamp: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket.IO client disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 3333, () => {
  console.log(`🚀 Server running on PORT: ${process.env.PORT || 3333}`);
});
```

### 9.3 React Native – Real-Time Control Components

**File:** `app/app/(tabs)/index.tsx` (Excerpt)

```typescript
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { toggleRedLed, updateSensorData, addMotionAlert } from "@/redux/lightSyncSlice";
import { getSocket } from "@/redux/socket";

export default function SmartHomeScreen() {
  const dispatch = useAppDispatch();
  const { temperature, humidity, redLedState, motionAlerts } = useAppSelector(
    (state) => state.lightSyncState
  );
  const socket = getSocket();

  // Toggle Red LED
  const handleToggleRedLed = useCallback(async () => {
    dispatch(toggleRedLed());
    socket.emit("toggleRedLed", { redLedState: !redLedState });
  }, [redLedState, dispatch, socket]);

  // Socket listeners
  useEffect(() => {
    socket.on("sensorUpdate", (data) => {
      dispatch(updateSensorData({
        temperature: data.temperature,
        humidity: data.humidity,
      }));
      dispatch(updateLedStates({
        redLedState: data.redLedState,
        greenLedState: data.greenLedState,
        yellowLedState: data.yellowLedState,
      }));
    });

    socket.on("objectDetected", (data) => {
      if (data.motion) {
        const timestamp = new Date(data.timestamp);
        dispatch(addMotionAlert({
          id: data.deviceId,
          location: "Back Door",
          time: `at ${timestamp.toLocaleTimeString()}`,
          timestamp: data.timestamp,
        }));
      }
    });

    return () => {
      socket.off("sensorUpdate");
      socket.off("objectDetected");
    };
  }, [socket, dispatch]);

  return (
    <View>
      {/* Temperature Display */}
      <Text>{temperature}°C</Text>
      <Text>Humidity: {humidity}%</Text>
      
      {/* LED Controls */}
      <TouchableOpacity onPress={handleToggleRedLed}>
        <Text>Lamp 1: {redLedState ? "ON" : "OFF"}</Text>
      </TouchableOpacity>
      
      {/* Motion Alerts */}
      <Text>Motion Alerts: {motionAlerts.length}</Text>
    </View>
  );
}
```

**File:** `app/redux/lightSyncSlice.ts` (State Management)

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LedState {
  temperature: number;
  humidity: number;
  redLedState: boolean;
  greenLedState: boolean;
  yellowLedState: boolean;
  allLightsState: boolean;
  motionDetected: boolean;
  motionAlerts: MotionAlert[];
  greenLedBrightness: number;
}

const initialState: LedState = {
  temperature: 26.6,
  humidity: 78,
  redLedState: false,
  greenLedState: false,
  yellowLedState: false,
  allLightsState: false,
  motionDetected: false,
  motionAlerts: [],
  greenLedBrightness: 128,
};

const ledSlice = createSlice({
  name: "leds",
  initialState,
  reducers: {
    updateSensorData(state, action: PayloadAction<{temperature: number; humidity: number}>) {
      state.temperature = action.payload.temperature;
      state.humidity = action.payload.humidity;
    },
    toggleRedLed(state) {
      state.redLedState = !state.redLedState;
    },
    updateGreenBrightness(state, action: PayloadAction<number>) {
      state.greenLedBrightness = action.payload;
    },
    addMotionAlert(state, action: PayloadAction<MotionAlert>) {
      state.motionAlerts.unshift(action.payload);
      if (state.motionAlerts.length > 500) {
        state.motionAlerts.pop();
      }
    },
    updateLedStates(state, action: PayloadAction<Partial<{
      redLedState: boolean;
      greenLedState: boolean;
      yellowLedState: boolean;
      allLightsState: boolean;
    }>>) {
      if (action.payload.redLedState !== undefined) {
        state.redLedState = action.payload.redLedState;
      }
      if (action.payload.greenLedState !== undefined) {
        state.greenLedState = action.payload.greenLedState;
      }
      if (action.payload.yellowLedState !== undefined) {
        state.yellowLedState = action.payload.yellowLedState;
      }
      if (action.payload.allLightsState !== undefined) {
        state.allLightsState = action.payload.allLightsState;
      }
    },
  },
});

export const {
  updateSensorData,
  updateLedStates,
  toggleRedLed,
  toggleGreenLed,
  toggleYellowLed,
  toggleAllLights,
  updateMotionDetected,
  addMotionAlert,
  clearMotionAlerts,
  updateGreenBrightness,
} = ledSlice.actions;

export default ledSlice.reducer;
```
```

---

## 10. TECH STACK DETAILS

### 10.1 Hardware Stack

**Microcontroller:**
- **ESP32 Development Board**: ESP32-WROOM-32
  - Dual-core Xtensa LX6 processor (240MHz)
  - 520KB SRAM, 4MB Flash
  - Built-in Wi-Fi (802.11 b/g/n) and Bluetooth 4.2
  - 34 GPIO pins with multiple functions
  - Hardware PWM support (LEDC peripheral)
  - 12-bit ADC (Analog-to-Digital Converter)

**Sensors:**
- **DHT11**: Digital temperature and humidity sensor
  - Library: DHT.h (Adafruit DHT Sensor Library)
  - Communication: Single-wire digital protocol
- **HC-SR501 PIR Motion Sensor**: Passive infrared motion detector
  - Digital output (HIGH/LOW)
  - Adjustable sensitivity and delay time

**Actuators:**
- **LED Modules**: Standard 5mm LEDs with current-limiting resistors
  - Red LED: GPIO 25 (Digital control)
  - Yellow LED: GPIO 32 (Digital control)
  - Green LED: GPIO 33 (PWM control, 0-255)

**Additional Components:**
- **10kΩ Potentiometer**: Manual brightness control (optional)
- **Resistors**: Current-limiting resistors for LEDs (220Ω - 1kΩ)
- **Breadboard & Jumper Wires**: Prototyping and connections

### 10.2 Firmware Stack

**Programming Language:**
- **Arduino C++**: Based on C++ with Arduino framework

**Libraries & Frameworks:**
- **WiFi.h**: ESP32 Wi-Fi connectivity
- **WebSocketsClient.h**: WebSocket client for cloud communication
- **DHT.h**: DHT11 sensor interface
- **ArduinoJson.h**: JSON serialization/deserialization
- **Arduino IDE / PlatformIO**: Development environment

**Communication Protocols:**
- **WebSocket (WSS)**: Secure WebSocket over SSL/TLS
- **JSON**: Message format for structured data exchange
- **HTTP**: Initial connection and fallback

### 10.3 Backend Stack

**Runtime & Framework:**
- **Node.js**: JavaScript runtime (v18+)
- **Express.js**: Web application framework
- **ES Modules**: Modern JavaScript module system

**Real-time Communication:**
- **Socket.IO**: Real-time bidirectional communication for mobile clients
  - Version: 4.8.1
  - Transport: WebSocket with fallback to polling
- **ws (WebSocket)**: Native WebSocket server for ESP32 devices
  - Version: Latest
  - Protocol: RFC 6455 WebSocket

**Database:**
- **MongoDB**: NoSQL document database
  - Mongoose ODM: Object Data Modeling
  - Collections: Device states, sensor history, activity logs

**Additional Libraries:**
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management
- **crypto**: UUID generation and cryptographic functions

**Deployment:**
- **Render**: Cloud platform for backend hosting
  - Free tier available
  - Automatic SSL/TLS certificates
  - WebSocket support

### 10.4 Mobile Application Stack

**Framework:**
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and toolchain
  - Version: 53.0.22
  - Managed workflow for simplified development

**Language:**
- **TypeScript**: Type-safe JavaScript
  - Version: 5.8.3
  - Full type checking and IntelliSense support

**State Management:**
- **Redux Toolkit**: Modern Redux with simplified API
  - Version: 2.8.2
  - Immer for immutable updates
  - RTK Query for API calls

**Real-time Communication:**
- **Socket.IO Client**: Real-time event-based communication
  - Version: 4.8.1
  - Automatic reconnection
  - Event-driven architecture

**UI/UX Libraries:**
- **NativeWind**: Tailwind CSS for React Native
  - Version: 4.1.23
  - Utility-first styling
- **React Native Reanimated**: High-performance animations
  - Version: 3.17.4
  - 60 FPS animations
- **Expo Linear Gradient**: Gradient backgrounds
- **Expo Icons**: Icon library (@expo/vector-icons)

**Charts & Visualization:**
- **React Native Gifted Charts**: Charting library
  - Version: 1.4.64
  - Line charts, area charts, real-time updates

**Audio & Media:**
- **Expo AV**: Audio playback
  - Version: 15.1.7
  - Sound effects and notifications
- **Expo Speech**: Text-to-speech synthesis
  - Version: 13.1.7
  - Motion alert announcements

**Navigation:**
- **Expo Router**: File-based routing
  - Version: 5.1.5
  - Native navigation with deep linking

**Additional Libraries:**
- **React Native Slider**: Brightness control slider
- **React Native Gesture Handler**: Touch gestures
- **Expo Haptics**: Haptic feedback
- **Expo Secure Store**: Secure token storage

**Development Tools:**
- **TypeScript**: Type checking
- **ESLint**: Code linting
- **Jest**: Testing framework
- **Metro Bundler**: JavaScript bundler

### 10.5 Development Tools

**Version Control:**
- **Git**: Distributed version control
- **GitHub/GitLab**: Code repository hosting

**IDE/Editors:**
- **VS Code**: Primary development environment
- **Arduino IDE**: ESP32 firmware development
- **PlatformIO**: Alternative ESP32 development platform

**API Testing:**
- **Postman**: REST API testing
- **WebSocket Client Tools**: WebSocket message testing

**Mobile Development:**
- **Expo Go**: Development client for testing
- **iOS Simulator**: iOS app testing
- **Android Emulator**: Android app testing

---

## 11. USE CASES

### 11.1 Residential Smart Home Automation

**Primary Use Case:**
LightSync serves as a comprehensive smart home automation system for residential properties, enabling homeowners to:

- **Remote Lighting Control**: Control lights from anywhere using a mobile app
- **Automated Security**: Motion-activated lighting for security and convenience
- **Energy Management**: Monitor and optimize energy consumption
- **Environmental Monitoring**: Track temperature and humidity for comfort

**Scenario:**
A homeowner installs LightSync in their house with:
- Red LED at the front door entrance
- Yellow LED at the back door
- Green LED (fan) in the living room
- Motion sensor in the hallway

**Benefits:**
- Lights automatically turn on when motion is detected
- Remote control when away from home
- Energy savings through automated control
- Security alerts for unexpected activity

### 11.2 Office Building Automation

**Use Case:**
LightSync can be deployed in office buildings for:

- **Zone-based Lighting Control**: Different lights for different office zones
- **Occupancy-based Automation**: Lights activate when employees enter
- **Energy Efficiency**: Reduce electricity costs through smart scheduling
- **Environmental Comfort**: Monitor and maintain optimal temperature/humidity

**Scenario:**
An office manager installs multiple LightSync systems:
- Reception area lighting
- Conference room controls
- Break room automation
- Hallway motion-activated lighting

**Benefits:**
- Reduced energy costs
- Improved employee comfort
- Automated maintenance alerts
- Centralized control dashboard

### 11.3 Retail Store Management

**Use Case:**
Retail stores can utilize LightSync for:

- **Display Lighting Control**: Highlight product displays
- **Security Monitoring**: Motion detection for after-hours security
- **Energy Cost Reduction**: Optimize lighting based on store hours
- **Customer Experience**: Automated lighting for welcoming atmosphere

**Scenario:**
A retail store implements LightSync:
- Window display lighting (Red LED)
- Aisle lighting (Yellow LED)
- Main store lighting (Green LED/Fan)
- Motion sensors at entrances

**Benefits:**
- Enhanced product visibility
- Security monitoring
- Energy cost savings
- Improved customer experience

### 11.4 Warehouse & Industrial Applications

**Use Case:**
Warehouses and industrial facilities can use LightSync for:

- **Safety Lighting**: Motion-activated lighting in dark areas
- **Inventory Management**: Track movement in storage areas
- **Energy Optimization**: Reduce lighting costs in large spaces
- **Environmental Monitoring**: Monitor storage conditions

**Scenario:**
A warehouse deploys LightSync:
- Loading dock lighting
- Storage area lighting
- Office area controls
- Motion sensors in high-traffic zones

**Benefits:**
- Improved safety
- Reduced energy consumption
- Activity monitoring
- Cost-effective automation

### 11.5 Educational Institutions

**Use Case:**
Schools and universities can implement LightSync for:

- **Classroom Automation**: Smart lighting for different activities
- **Energy Conservation**: Reduce electricity usage in large campuses
- **Security**: Motion detection in hallways and common areas
- **Environmental Control**: Maintain optimal learning conditions

**Scenario:**
A school installs LightSync:
- Classroom lighting controls
- Library area automation
- Hallway motion sensors
- Gymnasium lighting

**Benefits:**
- Educational cost savings
- Enhanced security
- Improved learning environment
- Sustainability initiatives

### 11.6 Healthcare Facilities

**Use Case:**
Hospitals and clinics can use LightSync for:

- **Patient Room Controls**: Adjustable lighting for patient comfort
- **Energy Efficiency**: Reduce operational costs
- **Security Monitoring**: Motion detection in sensitive areas
- **Environmental Monitoring**: Maintain optimal conditions

**Scenario:**
A healthcare facility implements LightSync:
- Patient room lighting
- Hallway automation
- Waiting area controls
- Storage room monitoring

**Benefits:**
- Patient comfort
- Cost reduction
- Security enhancement
- Regulatory compliance

### 11.7 Hospitality Industry

**Use Case:**
Hotels and restaurants can deploy LightSync for:

- **Guest Room Automation**: Smart lighting controls
- **Ambiance Control**: Adjustable lighting for different moods
- **Energy Management**: Reduce operational costs
- **Security**: Motion detection in common areas

**Scenario:**
A hotel installs LightSync:
- Guest room lighting
- Lobby area controls
- Restaurant ambiance lighting
- Parking area motion sensors

**Benefits:**
- Enhanced guest experience
- Operational cost savings
- Security monitoring
- Competitive advantage

### 11.8 Smart Agriculture

**Use Case:**
Greenhouses and agricultural facilities can use LightSync for:

- **Grow Light Control**: Automated lighting for plant growth
- **Environmental Monitoring**: Track temperature and humidity
- **Energy Optimization**: Efficient lighting schedules
- **Automation**: Reduce manual intervention

**Scenario:**
A greenhouse implements LightSync:
- Grow light controls
- Environmental sensors
- Automated scheduling
- Remote monitoring

**Benefits:**
- Optimized plant growth
- Energy efficiency
- Remote management
- Increased productivity

---

## 12. TEAM MEMBERS

| Name | Roll No. | Responsibility |
|------|----------|---------------|
| **Nikhil** | 202439 | Backend development, WebSocket/Socket.IO implementation, server architecture, cloud deployment, API design, and overall system integration |
| **Jagdeep** | 202448 | Mobile application development, React Native/Expo implementation, UI/UX design, Redux state management, real-time synchronization, and cross-platform testing |
| **Harish** | 202432 | ESP32 firmware development, hardware integration, sensor interfacing, circuit design, PWM implementation, and hardware testing |

### Team Contributions

**Nikhil (202439):**
- Designed and implemented the Node.js backend server
- Configured dual WebSocket support (native WebSocket + Socket.IO)
- Implemented protocol bridge for ESP32 and mobile app communication
- Set up MongoDB database integration
- Deployed backend on Render cloud platform
- Created REST API endpoints and real-time event handlers
- Managed server-side state synchronization
- Programmed ESP32 microcontroller firmware
- Integrated DHT11 temperature/humidity sensor
- Implemented PIR motion sensor detection
- Configured PWM brightness control for Green LED
- Set up WebSocket client communication
- Designed and tested circuit connections
- Developed React Native mobile application using Expo
- Implemented Redux Toolkit for state management
- Created responsive UI components with NativeWind
- Integrated Socket.IO client for real-time communication
- Developed energy monitoring and visualization features
- Implemented motion alerts with speech synthesis
- Created cross-platform compatible codebase (iOS/Android)
- Designed user-friendly interface with animations

**Jagdeep (202448):**
- Project plannig

**Harish (202432):**
- Project planning

### Project Timeline

**Phase 1: Planning & Design (Week 1-2)**
- System architecture design
- Component selection and procurement
- Circuit diagram creation
- API design and protocol definition

**Phase 2: Hardware Development (Week 3-4)**
- ESP32 firmware development
- Sensor integration and testing
- Circuit assembly and debugging
- Hardware validation

**Phase 3: Backend Development (Week 5-6)**
- Server setup and configuration
- WebSocket and Socket.IO implementation
- Database schema design
- API endpoint development
- Cloud deployment

**Phase 4: Mobile Application (Week 7-8)**
- React Native app development
- UI/UX design and implementation
- State management setup
- Real-time communication integration
- Testing and optimization

**Phase 5: Integration & Testing (Week 9-10)**
- End-to-end system integration
- Bug fixes and optimization
- Performance testing
- Documentation completion

**Phase 6: Deployment & Presentation (Week 11-12)**
- Final testing and validation
- Project documentation
- Presentation preparation
- Demo preparation

---

## Conclusion

LightSync represents a comprehensive IoT smart home automation system that successfully integrates hardware, cloud backend, and mobile application into a seamless, real-time responsive ecosystem. The project demonstrates practical implementation of modern IoT technologies including WebSocket communication, real-time synchronization, sensor integration, and cross-platform mobile development.

The system provides significant benefits in terms of energy efficiency, convenience, security, and scalability. With a modular architecture and extensive future scope, LightSync serves as a foundation for advanced smart home automation solutions.

Through collaborative development, the team successfully delivered a fully functional IoT system that showcases the potential of connected devices in creating intelligent, automated living and working environments.
