import sys
import os
import time
import random

# Add root directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

try:
    from gpiozero import DistanceSensor
    MOCK_MODE = False
except ImportError:
    print("Warning: gpiozero not found. Running in MOCK mode for sensors.")
    MOCK_MODE = True

class UltrasonicSensor:
    def __init__(self):
        self.mock_mode = MOCK_MODE
        if not self.mock_mode:
            try:
                self.sensor = DistanceSensor(
                    echo=config.PIN_ULTRASONIC_ECHO,
                    trigger=config.PIN_ULTRASONIC_TRIG,
                    max_distance=4.0 # 4 meters max
                )
            except Exception as e:
                print(f"Failed to initialize GPIO: {e}. Switching to Mock mode.")
                self.mock_mode = True
        
    def get_distance_cm(self):
        """Returns distance in cm"""
        if self.mock_mode:
            # Return a random distance between 10cm and 200cm for testing
            return random.uniform(5.0, 150.0)
        
        try:
            # gpiozero returns distance in meters, convert to cm
            dist_m = self.sensor.distance
            return dist_m * 100
        except Exception as e:
            print(f"Error reading sensor: {e}")
            return -1
