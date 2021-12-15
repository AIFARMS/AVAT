from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

#import page
import unittest
import json
import os

class AVAT_video_upload(unittest.TestCase):
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

    def test_bbox(self):
        #uplaod video
        self.driver.find_element(By.TAG_NAME, "button").click()
        video_upload = self.driver.find_elements(By.TAG_NAME, "input")[2]
        curr_dir = os.getcwd() 
        video_upload.send_keys(curr_dir + "/test_video.mp4")
        self.driver.find_element(By.CLASS_NAME, "close").click()
        frame = self.driver.find_elements(By.CLASS_NAME, "btn-secondary")[0]
        #Check video was uploaded
        assert "Frame #1 / 1200" in frame.text
        #Switch mode and transfer to
        self.driver.send_keys('2')
        self.driver.send_keys('a')

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    print("Starting SelectionScreen tests")
    unittest.main(warnings='ignore')