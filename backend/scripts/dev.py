#!/usr/bin/env python
import argparse
import subprocess
import sys
from pathlib import Path

def run_command(command):
    """Run a command and print its output."""
    try:
        result = subprocess.run(command, shell=True, check=True, text=True, capture_output=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error: {e.stderr}")
        return False

def setup_venv():
    """Create and activate virtual environment."""
    print("Setting up virtual environment...")
    if not Path("venv").exists():
        run_command("python -m venv venv")
    print("Virtual environment created. Please activate it:")
    print("On Windows: venv\\Scripts\\activate")
    print("On Unix/MacOS: source venv/bin/activate")

def install_deps():
    """Install project dependencies."""
    print("Installing dependencies...")
    return run_command("pip install -r requirements.txt")

def init_db():
    """Initialize the database."""
    print("Initializing database...")
    return run_command("python scripts/init_db.py")

def run_migrations():
    """Run database migrations."""
    print("Running migrations...")
    return run_command("alembic upgrade head")

def run_tests():
    """Run all tests."""
    print("Running tests...")
    return run_command("python scripts/run_tests.py")

def start_server():
    """Start the development server."""
    print("Starting development server...")
    return run_command("python scripts/run_dev.py")

def main():
    parser = argparse.ArgumentParser(description="Development tools for ComplyMate backend")
    parser.add_argument("command", choices=[
        "setup", "install", "init-db", "migrate", "test", "run"
    ], help="Command to run")
    
    args = parser.parse_args()
    
    if args.command == "setup":
        setup_venv()
    elif args.command == "install":
        install_deps()
    elif args.command == "init-db":
        init_db()
    elif args.command == "migrate":
        run_migrations()
    elif args.command == "test":
        run_tests()
    elif args.command == "run":
        start_server()

if __name__ == "__main__":
    main() 