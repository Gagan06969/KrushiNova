import cv2
import time
import config
from sensors.ultrasonic import UltrasonicSensor
from actuators.sprinkler import Sprinkler
from vision.camera import Camera
from vision.detector import Detector

def draw_boxes(frame, detections):
    """Helper to draw bounding boxes on the frame"""
    for d in detections:
        x1, y1, x2, y2 = map(int, d['box'])
        label = f"{d['name']} {d['conf']:.2f}"
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    return frame

def main():
    print("Initializing Krushinova Rover modules...")
    
    # Initialize Modules
    sensor = UltrasonicSensor()
    sprinkler = Sprinkler()
    camera = Camera()
    detector = Detector()

    print("Rover Active. Press 'q' to quit.")

    try:
        while True:
            # 1. Check Distance
            dist = sensor.get_distance_cm()
            
            # Safety Check
            if dist != -1 and dist < config.OBSTACLE_STOP_DISTANCE_CM:
                print(f"OBSTACLE TOO CLOSE! {dist:.1f}cm. Stopping actions.")
                # Here you would also stop motors if you had them
                time.sleep(0.1)
                continue

            # 2. Get Vision Frame
            frame = camera.get_frame()
            if frame is None:
                break

            # 3. Detect Objects
            detections = detector.detect(frame)

            # 4. Logic: Should we spray?
            should_spray = False
            for d in detections:
                # Logic: If we see a target
                print(f"Detected: {d['name']} ({d['conf']:.2f})")
                
                # Check distance context
                if config.MIN_SPRAY_DISTANCE_CM <= dist <= config.MAX_SPRAY_DISTANCE_CM:
                    should_spray = True
                else:
                    print(f"Target found but out of range ({dist:.1f}cm).")

            # 5. Actuate
            if should_spray:
                print("Target confirmed in range. Sprinkling!")
                sprinkler.activate()

            # 6. User Feedback (GUI)
            frame = draw_boxes(frame, detections)
            # Add distance text
            cv2.putText(frame, f"Dist: {dist:.1f}cm", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            cv2.imshow('Krushinova Rover Vision', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
            # Small delay to prevent CPU hogging
            time.sleep(0.01)

    except KeyboardInterrupt:
        print("\nStopping Rover...")
    finally:
        camera.release()
        cv2.destroyAllWindows()
        sprinkler.deactivate()
        print("Shutdown complete.")

if __name__ == "__main__":
    main()
