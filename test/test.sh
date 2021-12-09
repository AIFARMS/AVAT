#!/bin/bash
DIR="python_env"
if [ -d "$DIR" ]; then
  echo "python environment detected - ${DIR}..."
  echo "Installing dependencies just in case"
  source python_env/bin/activate
  pip3 install -r requirements.txt
else
  ###  Control will jump here if $DIR does NOT exists ###
  echo "Error: ${DIR} not found. Will attempt to create one and install dependencies."
  echo "Creating virtual environment"
  python3 -m venv python_env
  source python_env/bin/activate
  pip3 install -r requirements.txt
fi
echo "Python dependencies installed."
echo "Now starting up docker-compose..."
sudo nohup docker-compose up &
echo "Waiting 20 seconds for docker-compose to warm up"
sleep 20
echo "Now running seleniumt tests! Off we go..."
python3 run_tests.py