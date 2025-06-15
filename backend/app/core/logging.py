import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler

from app.core.config import settings

# Create logs directory if it doesn't exist
log_dir = Path("logs")
log_dir.mkdir(exist_ok=True)

# Configure logging
def setup_logging():
    # Create formatters
    file_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_formatter = logging.Formatter(
        '%(levelname)s - %(message)s'
    )

    # Create handlers
    file_handler = RotatingFileHandler(
        log_dir / "app.log",
        maxBytes=10_000_000,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(file_formatter)
    file_handler.setLevel(logging.INFO)

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(console_formatter)
    console_handler.setLevel(logging.INFO)

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)

    # Configure specific loggers
    loggers = {
        "app": logging.INFO,
        "sqlalchemy.engine": logging.WARNING,
        "uvicorn": logging.INFO,
        "uvicorn.access": logging.INFO,
    }

    for logger_name, level in loggers.items():
        logger = logging.getLogger(logger_name)
        logger.setLevel(level)

    return root_logger

# Create logger instance
logger = setup_logging() 