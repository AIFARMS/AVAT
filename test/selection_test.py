from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

import json
#import page
import unittest

class AVAT_SelectionScreen(unittest.TestCase):
    def setUp(self):
        with open("SELENIUM_ENV.json", "r") as f: #https://stackoverflow.com/questions/49196889/getting-variables-from-a-external-json-file-python
            options = json.load(f)
        self.driver = webdriver.Remote(
            command_executor='http://localhost:4444/wd/hub',
            desired_capabilities={
                'browserName': options['browserName'],
                'javascriptEnabled': True
            }
        )
        self.driver.get("https://aifarms.github.io/AVAT/")

    def test_title(self):
        assert "AVAT - ALPHA" in self.driver.title

    def test_navButton(self):
        buttons = self.driver.find_elements(By.TAG_NAME, "button")[0]
        assert "Video Upload" in buttons.text

    def test_navButton(self):
        buttons = self.driver.find_elements(By.TAG_NAME, "button")[1]
        assert "Multiview" in buttons.text

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    print("Starting SelectionScreen tests")
    unittest.main(warnings='ignore')