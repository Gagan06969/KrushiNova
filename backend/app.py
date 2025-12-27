from flask import Flask, render_template, Response, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import cv2
import time
import threading
import json
import config

# Import our modules
from sensors.ultrasonic import UltrasonicSensor
from actuators.sprinkler import Sprinkler
from actuators.motors import MotorDriver
from vision.camera import Camera
from vision.detector import Detector

app = Flask(__name__)
CORS(app) # Allow React frontend to connect
socketio = SocketIO(app, cors_allowed_origins="*")

# Global State
rover_state = {
    "distance": 0,
    "status": "Idle",
    "detections": []
}

# Initialize Hardware (Lazy load to avoid global scope issues)
camera = None
detector = None
sensor = None
sprinkler = None
motors = None
is_running = False

def init_hardware():
    global camera, detector, sensor, sprinkler, motors
    if camera is None:
        camera = Camera()
        detector = Detector()
        sensor = UltrasonicSensor()
        sprinkler = Sprinkler()
        motors = MotorDriver()

def generate_frames():
    """Video streaming generator function."""
    print("Starting video feed generator...")
    init_hardware()
    while True:
        print("Grabbing frame...", flush=True)
        frame = camera.get_frame()
        if frame is None:
            print("Frame is None! Stopping stream.", flush=True)
            break
        print(f"Frame captured.", flush=True)

        # Run Detection
        detections = detector.detect(frame)
        rover_state["detections"] = detections

        # Draw boxes
        for d in detections:
            x1, y1, x2, y2 = map(int, d['box'])
            label = f"{d['name']} {d['conf']:.2f}"
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # Encode
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

def automation_loop():
    """Background thread for sensor readings and auto-sprinkling"""
    init_hardware()
    while True:
        # 1. Read Sensor
        dist = sensor.get_distance_cm()
        rover_state["distance"] = dist
        
        # 2. Emit Telemetry to Web Client
        socketio.emit('telemetry', rover_state)
        
        # 3. Automation Logic (Spray if target & close)
        # Note: In manual web mode, maybe we want a toggle for this?
        # For now, let's keep it simple: if target seen in last frame 'detections'
        # and distance is good -> spray.
        
        should_spray = False
        # Check if any recent detection matches
        # (This is simplified; ideally we sync frame & distance better)
        if rover_state["detections"]:
            if config.MIN_SPRAY_DISTANCE_CM <= dist <= config.MAX_SPRAY_DISTANCE_CM:
                should_spray = True
        
        if should_spray:
            socketio.emit('log', {'msg': 'Auto-Spray Triggered!'})
            sprinkler.activate()

        socketio.sleep(0.5) # Update 2Hz

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return "Rover Backend Online. <br> <a href='/video_feed'>View Raw Video Feed</a>"

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    # Simple hardcoded check for demo
    if data.get('username') == 'admin' and data.get('password') == 'krushinova':
        return jsonify({"success": True, "token": "demo-token"})
    return jsonify({"success": False}), 401

@socketio.on('control')
def handle_control(data):
    """Handle Joystick/Keyboard commands"""
    command = data.get('command') # 'forward', 'left', etc.
    init_hardware()
    motors.move(command)

@socketio.on('connect')
def test_connect():
    print('Client connected')
    emit('log', {'msg': 'Connected to Rover'})
    global is_running
    if not is_running:
        socketio.start_background_task(automation_loop)
        is_running = True

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=False)
