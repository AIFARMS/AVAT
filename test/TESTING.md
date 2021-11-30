# AVAT Testing

## Goals
This folder serves as the main hub for running all the tests for the current version of AVAT. The testing has been made to be device agnostic so that should not be a limiting factor. The only thing that stays constant is that you will have to use Chrome and Chrome webdriver.

## Install

To get it working you need:
1) Selenium
2) Chrome
3) Chrome webdriver

The above really depends based off of your system.

_For systems running Apple Silicon make sure to have an updated version of pip otherwise some of the installations might fail._

Install the python virtual environment using the requirements.txt

## Testing

To run the tests do ```python3 run_tests.py``` and it will be run automatically.