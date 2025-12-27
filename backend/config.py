# config.py

# Hardware Configuration - PINS (BCM Mode)
# Update these to match your actual wiring
PIN_ULTRASONIC_TRIG = 23
PIN_ULTRASONIC_ECHO = 24
PIN_SPRINKLER_RELAY = 17

# Sensor Settings
MIN_SPRAY_DISTANCE_CM = 20   # Minimum distance to plant to allow spraying
MAX_SPRAY_DISTANCE_CM = 100  # Maximum distance to plant to allow spraying
OBSTACLE_STOP_DISTANCE_CM = 10 # Stop if something is too close

# Sprinkler Settings
SPRAY_DURATION_SECONDS = 2.0
SPRAY_COOLDOWN_SECONDS = 5.0 # Prevent continuous spraying

# Camera & Vision Settings
CAMERA_INDEX = 0  # 0 is usually the default USB webcam
USE_PI_CAMERA = False # Set to True if using the ribbon cable Pi Camera (requires picamera lib)
FRAME_WIDTH = 640
FRAME_HEIGHT = 480

# YOLO Settings
MODEL_PATH = "yolov8n.pt" # Path to your trained model (.pt)
CONFIDENCE_THRESHOLD = 0.5
TARGET_CLASSES = [0, 1] # List of class IDs to trigger sprinkler (e.g. 0=plant, 1=pest)
