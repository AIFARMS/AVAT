from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

#import page
import unittest
import json

class AVAT_Upload(unittest.TestCase):
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

    def test_annotatorName(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        annot_name = self.driver.find_elements(By.TAG_NAME, "input")[0]
        annot_name.send_keys("test_user")
        assert "test_user" in annot_name.get_attribute("value")

    def test_upload(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        video_upload = self.driver.find_elements(By.TAG_NAME, "input")[2]
        assert ".mp4" in video_upload.get_attribute("accept")

    def test_upload(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        video_upload = self.driver.find_elements(By.TAG_NAME, "input")[3]
        assert ".json" in video_upload.get_attribute("accept")

    def test_frameRate(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        frame_rate = self.driver.find_elements(By.TAG_NAME, "input")[4]
        frame_rate.send_keys("12")
        assert "12" in frame_rate.get_attribute("value")

    def test_skipValue(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        frame_rate = self.driver.find_elements(By.TAG_NAME, "input")[5]
        frame_rate.send_keys("15")
        assert "15" in frame_rate.get_attribute("value")

    def test_playbackRate(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        frame_rate = self.driver.find_elements(By.TAG_NAME, "input")[6]
        frame_rate.send_keys("5")
        assert "5" in frame_rate.get_attribute("value")
        
    def test_playbackRate_error(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        frame_rate = self.driver.find_elements(By.TAG_NAME, "input")[6]
        frame_rate.send_keys("17")
        try:
            WebDriverWait(self.driver, 3).until(EC.alert_is_present(), 'waiting for confirmation popup to appear.')

            alert = self.driver.switch_to.alert
            alert.accept()
            alert_accept = True
        except TimeoutException:
            alert_accept = False

        assert alert_accept is True

    def test_videoFormat_upload(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        frame_rate = self.driver.find_elements(By.TAG_NAME, "select")[0]
        upload = frame_rate.find_elements(By.TAG_NAME, "option")[0]
        assert "Upload" in upload.text
    
    def test_videoFormat_youtube(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        frame_rate = self.driver.find_elements(By.TAG_NAME, "select")[0]
        youtube = frame_rate.find_elements(By.TAG_NAME, "option")[1]
        assert "Youtube" in youtube.text

    def object_detection(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        frame_rate = self.driver.find_elements(By.TAG_NAME, "select")[0].find_elements(By.TAG_NAME, "option")[1]
        assert len(frame_rate) is 2

    def tearDown(self):
        self.driver.quit()
        

if __name__ == "__main__":
    print("Starting upload-dialogtesting")
    unittest.main(warnings='ignore')