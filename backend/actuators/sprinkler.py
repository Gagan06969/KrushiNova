import sys
import os
import time

# Add root directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

try:
    from gpiozero import OutputDevice
    MOCK_MODE = False
except ImportError:
    MOCK_MODE = True

class Sprinkler:
    def __init__(self):
        self.mock_mode = MOCK_MODE
        self.last_activated = 0
        
        if not self.mock_mode:
            try:
                # Active High relay (True = ON)
                # If your relay is Active Low, use active_high=False
                self.relay = OutputDevice(config.PIN_SPRINKLER_RELAY, active_high=True, initial_value=False)
            except Exception as e:
                print(f"Failed to initialize Sprinkler GPIO: {e}. Switching to Mock mode.")
                self.mock_mode = True

    def activate(self):
        """Activates the sprinkler for the configured duration"""
        current_time = time.time()
        
        # Check cooldown
        if current_time - self.last_activated < config.SPRAY_COOLDOWN_SECONDS:
            print("Sprinkler in cooldown. Skipping.")
            return

        print(f"ACTIVATE SPRINKLER for {config.SPRAY_DURATION_SECONDS} seconds!")
        
        if not self.mock_mode:
            self.relay.on()
        
        time.sleep(config.SPRAY_DURATION_SECONDS)
        
        if not self.mock_mode:
            self.relay.off()
            
        self.last_activated = time.time()
        print("Sprinkler OFF.")

    def deactivate(self):
        if not self.mock_mode:
            self.relay.off()
