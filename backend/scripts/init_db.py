import logging
from pathlib import Path
import sys

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from app.db.session import Base, engine
from app.core.logging import logger

def init_db():
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

if __name__ == "__main__":
    logger.info("Creating initial database tables")
    init_db() 