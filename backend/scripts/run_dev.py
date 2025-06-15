import uvicorn
from pathlib import Path
import sys

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 