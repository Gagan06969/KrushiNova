from ultralytics import YOLO
import sys
import os

# Add root directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

class Detector:
    def __init__(self):
        print(f"Loading YOLO model from {config.MODEL_PATH}...")
        try:
            self.model = YOLO(config.MODEL_PATH) 
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Attempting to load standard 'yolov8n.pt'...")
            self.model = YOLO("yolov8n.pt")

    def detect(self, frame):
        """
        Runs inference on the frame.
        Returns a list of dicts: {'conf': float, 'class': int, 'box': [x1, y1, x2, y2]}
        """
        results = self.model(frame, verbose=False)
        
        detections = []
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                
                if conf >= config.CONFIDENCE_THRESHOLD:
                    # Check if this class is one we care about
                    if cls_id in config.TARGET_CLASSES:
                        detections.append({
                            'class': cls_id,
                            'conf': conf,
                            'box': box.xyxy[0].tolist(), # [x1, y1, x2, y2]
                            'name': result.names[cls_id]
                        })
        
        return detections
