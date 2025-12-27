import cv2
import sys
import os

# Add root directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

class Camera:
    def __init__(self):
        self.cap = cv2.VideoCapture(config.CAMERA_INDEX)
        # Set resolution
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, config.FRAME_WIDTH)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, config.FRAME_HEIGHT)
        
        if not self.cap.isOpened():
            print("Error: Could not open camera.")
            
    def get_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            print("Failed to grab frame")
            return None
        return frame

    def release(self):
        self.cap.release()
