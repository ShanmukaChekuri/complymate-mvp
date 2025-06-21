#!/usr/bin/env python3
"""
Comprehensive startup script for ComplyMate backend
"""
import os
import sys
import subprocess
import time
from pathlib import Path

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        "fastapi", "uvicorn", "sqlalchemy", "spacy", 
        "transformers", "torch", "PyMuPDF"
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("Please install missing packages with: pip install -r requirements.txt")
        return False
    
    print("✓ All dependencies are installed")
    return True

def setup_environment():
    """Set up environment variables"""
    os.environ["PYTHONUNBUFFERED"] = "1"
    os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
    os.environ["TRANSFORMERS_OFFLINE"] = "0"
    print("✓ Environment variables set")

def run_setup_models():
    """Run model setup if needed"""
    try:
        print("Setting up models...")
        subprocess.run([sys.executable, "scripts/setup_models.py"], check=True)
        return True
    except subprocess.CalledProcessError:
        print("⚠️  Model setup failed, continuing anyway...")
        return False

def start_server():
    """Start the development server"""
    print("Starting ComplyMate backend server...")
    try:
        subprocess.run([sys.executable, "scripts/run_dev.py"], check=True)
    except KeyboardInterrupt:
        print("\n✓ Server stopped gracefully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

def main():
    """Main startup function"""
    print("🚀 Starting ComplyMate Backend")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not Path("app").exists():
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Setup steps
    if not check_dependencies():
        sys.exit(1)
    
    setup_environment()
    
    # Try to setup models (optional)
    run_setup_models()
    
    # Start server
    start_server()

if __name__ == "__main__":
    main() 