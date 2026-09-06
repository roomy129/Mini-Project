@echo off
echo ===================================================
echo Starting Smart Faculty Tracker - Python Flask API
echo ===================================================
cd /d "%~dp0backend"
python -m pip install -r requirements.txt
python database.py
python app.py
pause
