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
        options = webdriver.ChromeOptions()
        options.headless = True
        self.driver = webdriver.Chrome(options=options)
        self.driver.get("http://localhost:3000")

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
        self.driver.close()

if __name__ == "__main__":
    print("Starting SelectionScreen tests")
    unittest.main(warnings='ignore')