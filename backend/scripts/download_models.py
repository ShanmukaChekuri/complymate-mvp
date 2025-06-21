#!/usr/bin/env python3
"""
Script to download and set up required models for ComplyMate
"""
import os
import sys
from pathlib import Path
import logging
import spacy

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

# Model configurations
CACHE_DIR = os.path.join(Path(__file__).parent.parent, "app", "services", ".cache")
SPACY_MODEL = "en_core_web_lg"

def setup_cache_directory():
    """Create cache directory for models"""
    os.makedirs(CACHE_DIR, exist_ok=True)
    logger.info(f"Cache directory created at: {CACHE_DIR}")

def download_spacy_model():
    """Download spaCy model"""
    try:
        logger.info(f"Checking spaCy model: {SPACY_MODEL}")
        try:
            spacy.load(SPACY_MODEL)
            logger.info("✓ spaCy model already installed")
            return True
        except OSError:
            logger.info("Downloading spaCy model...")
            spacy.cli.download(SPACY_MODEL)
            spacy.load(SPACY_MODEL)  # Verify the download
            logger.info("✓ spaCy model downloaded successfully")
            return True
    except Exception as e:
        logger.error(f"Failed to download spaCy model: {str(e)}")
        return False

def main():
    """Main setup function"""
    logger.info("Starting model downloads for ComplyMate")
    logger.info("=" * 50)
    
    # Setup cache directory
    setup_cache_directory()
    
    # Download spaCy model
    if not download_spacy_model():
        logger.error("❌ Failed to download spaCy model")
        sys.exit(1)
    
    logger.info("\n✓ All models downloaded successfully!")
    logger.info("You can now start the server with: python scripts/start_server.py")

if __name__ == "__main__":
    main() 