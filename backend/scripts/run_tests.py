import subprocess
import sys
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_pytest():
    logger.info("Running pytest...")
    result = subprocess.run(
        ["pytest", "tests/", "-v"],
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        logger.error("Pytest failed!")
        logger.error(result.stdout)
        logger.error(result.stderr)
        return False
    logger.info("Pytest passed!")
    return True

def run_api_tests():
    logger.info("Running API tests...")
    result = subprocess.run(
        [sys.executable, "scripts/test_api.py"],
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        logger.error("API tests failed!")
        logger.error(result.stdout)
        logger.error(result.stderr)
        return False
    logger.info("API tests passed!")
    return True

def main():
    # Run pytest
    if not run_pytest():
        sys.exit(1)
    
    # Run API tests
    if not run_api_tests():
        sys.exit(1)
    
    logger.info("All tests passed successfully!")

if __name__ == "__main__":
    main() 