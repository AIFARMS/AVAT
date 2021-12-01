from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

#import page
import unittest

import os

class AVAT_video_upload(unittest.TestCase):
    def setUp(self):
        options = webdriver.FirefoxOptions()
        options.headless = True
        self.driver = webdriver.Firefox(options=options)
        self.driver.get("http://localhost:3000")

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
        self.driver.close()

if __name__ == "__main__":
    print("Starting SelectionScreen tests")
    unittest.main(warnings='ignore')