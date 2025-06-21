#!/usr/bin/env python3
"""
Setup script for downloading and initializing required models
"""
import os
import sys
import subprocess
from pathlib import Path

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

def download_spacy_model():
    """Download spaCy model if not present"""
    try:
        import spacy
        # Try to load the model
        spacy.load("en_core_web_lg")
        print("✓ spaCy model already installed")
    except OSError:
        print("Downloading spaCy model...")
        subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_lg"], check=True)
        print("✓ spaCy model downloaded successfully")

def setup_cache_directory():
    """Create cache directory for models"""
    cache_dir = Path(__file__).parent.parent / "app" / "services" / ".cache"
    cache_dir.mkdir(exist_ok=True)
    print(f"✓ Cache directory created: {cache_dir}")

def main():
    """Main setup function"""
    print("Setting up ComplyMate models...")
    
    try:
        setup_cache_directory()
        download_spacy_model()
        print("\n✓ All models setup complete!")
        print("You can now start the server with: python scripts/run_dev.py")
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 