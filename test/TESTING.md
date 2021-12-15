# AVAT Testing

## Goals
This folder serves as the main hub for running all the tests for the current version of AVAT. 

An alternative option would be to use docker-compose to run the tests as that automatically sets up an environment which can run the tests easily.

## Install and Run

To get it working you need:
* Docker and docker-compose
    * Please refer to your specific system insturctions
* Python
    * venv python package should be installed.

Run ```./test.sh``` to automatically install the docker containers, install python dependencies and run 

_For systems running Apple Silicon make sure to have an updated version of pip otherwise some of the installations might fail._

## Manual Testing

### Browser Docker Containers

Make sure you have the docker containers pre-installed and running:
```docker pull selenium/standalone-chrome```
```docker pull selenium/standalone-firefox```

### run_tests.py 

To run the tests, do ```python3 run_tests.py``` and it will be run automatically.  with different browers that was setup from the docker containers. 