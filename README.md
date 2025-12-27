# Krushinova Rover

Python control software for an agricultural rover using Raspberry Pi, YOLO, and Ultrasonic sensors.

## Hardware Requirements

- Raspberry Pi (3B/4/Zero 2W recommended)
- USB Webcam
- HC-SR04 Ultrasonic Sensor
- 5V Relay Module (for Sprinkler/Pump)
- Power Supply (Power bank or Battery)

## Wiring (Default Config)

Check `config.py` to change these.

- **Ultrasonic Trigger**: GPIO 23
- **Ultrasonic Echo**: GPIO 24
- **Sprinkler Relay**: GPIO 17

## Setup Instructions

### 1. Install System Dependencies

On your Raspberry Pi terminal:

```bash
sudo apt-get update
sudo apt-get install python3-opencv python3-pip libatlas-base-dev
```

### 2. Install Python Libraries

```bash
pip3 install -r requirements.txt
```

### 3. Run the Rover

```bash
python3 main.py
```

### Note on YOLO

The default configuration uses `yolov8n.pt`. On the first run, it might try to download this model.
If you have a custom trained model for your specific plants, place the `.pt` file in this directory and update `MODEL_PATH` in `config.py`.
