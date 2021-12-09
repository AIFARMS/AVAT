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

    def test_video_upload_mp4(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        video_upload = self.driver.find_elements(By.TAG_NAME, "input")[2]
        curr_dir = os.getcwd() 
        video_upload.send_keys(curr_dir + "/test_video.mp4")
        self.driver.find_element(By.CLASS_NAME, "close").click()
        frame = self.driver.find_elements(By.CLASS_NAME, "btn-secondary")[0]
        assert "Frame #1 / 1200" in frame.text

    def test_video_upload_avi(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        video_upload = self.driver.find_elements(By.TAG_NAME, "input")[2]
        curr_dir = os.getcwd() 
        video_upload.send_keys(curr_dir + "/test_video.avi")
        self.driver.find_element(By.CLASS_NAME, "close").click()
        frame = self.driver.find_elements(By.CLASS_NAME, "btn-secondary")[0]
        assert "Frame #1 / 1200" in frame.text

    def test_video_upload_mkv(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        video_upload = self.driver.find_elements(By.TAG_NAME, "input")[2]
        curr_dir = os.getcwd() 
        video_upload.send_keys(curr_dir + "/test_video.mkv")
        self.driver.find_element(By.CLASS_NAME, "close").click()
        frame = self.driver.find_elements(By.CLASS_NAME, "btn-secondary")[0]
        assert "Frame #1 / 1200" in frame.text

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    print("Starting SelectionScreen tests")
    unittest.main(warnings='ignore')