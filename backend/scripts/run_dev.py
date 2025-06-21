import uvicorn
from pathlib import Path
import sys
import signal
import os

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

def signal_handler(signum, frame):
    """Handle shutdown signals gracefully"""
    print(f"\nReceived signal {signum}. Shutting down gracefully...")
    sys.exit(0)

if __name__ == "__main__":
    # Set up signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Set environment variables for better compatibility
    os.environ["PYTHONUNBUFFERED"] = "1"
    
    try:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info",
            access_log=True,
            loop="asyncio"
        )
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Server error: {e}")
        sys.exit(1) 