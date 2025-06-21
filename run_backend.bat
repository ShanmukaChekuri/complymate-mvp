@echo off
ECHO Activating virtual environment...
CALL "backend\\venv\\Scripts\\activate.bat"

IF %ERRORLEVEL% NEQ 0 (
    ECHO Failed to activate virtual environment. Please ensure it's created at backend/venv.
    GOTO :EOF
)

ECHO.
ECHO Starting FastAPI development server...
ECHO To stop the server, press CTRL+C in this window.
ECHO.

python "backend/scripts/run_dev.py"

ECHO.
ECHO Server stopped.
ECHO The virtual environment is still active in this terminal. You can run other commands or close this window.
ECHO.

REM The /K switch keeps the command prompt window open after the script finishes.
cmd /k 