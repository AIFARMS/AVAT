from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

import json
#import page
import unittest

class AVAT_NavBar(unittest.TestCase):
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

    def test_export(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        self.driver.find_element(By.CLASS_NAME, "close").click()
        export = self.driver.find_elements(By.CLASS_NAME, "nav-link")[0]
        assert "Export" in export.text

    def test_instructions(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        self.driver.find_element(By.CLASS_NAME, "close").click()
        instructions = self.driver.find_elements(By.CLASS_NAME, "nav-link")[1]
        assert "Instructions" in instructions.text

    def test_report(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        self.driver.find_element(By.CLASS_NAME, "close").click()
        report = self.driver.find_elements(By.CLASS_NAME, "nav-link")[2]
        assert "Report" in report.text

    def test_upload(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        self.driver.find_element(By.CLASS_NAME, "close").click()
        upload = self.driver.find_elements(By.CLASS_NAME, "btn-outline-success")[0]
        assert "Upload" in upload.text

    def test_editSeg(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        self.driver.find_element(By.CLASS_NAME, "close").click()
        edit_seg = self.driver.find_elements(By.CLASS_NAME, "btn-outline-success")[1]
        assert "Edit Seg" in edit_seg.text

    def test_frame(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        self.driver.find_element(By.CLASS_NAME, "close").click()
        frame = self.driver.find_elements(By.CLASS_NAME, "btn-secondary")[0]
        assert "Frame #1 / 0" in frame.text

    def test_prev(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        self.driver.find_element(By.CLASS_NAME, "close").click()
        prev = self.driver.find_elements(By.CLASS_NAME, "btn-primary")[0]
        assert "Prev" in prev.text

    def test_play(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        self.driver.find_element(By.CLASS_NAME, "close").click()
        play = self.driver.find_elements(By.CLASS_NAME, "btn-primary")[1]
        assert "Play" in play.text

    def test_next(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        self.driver.find_element(By.CLASS_NAME, "close").click()
        nextbtn = self.driver.find_elements(By.CLASS_NAME, "btn-primary")[2]
        assert "Next" in nextbtn.text

    def test_add(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        self.driver.find_element(By.CLASS_NAME, "close").click()
        add = self.driver.find_elements(By.CLASS_NAME, "btn-success")[0]
        assert "Add" in add.text

    '''def test_add_dropdown(self):
        self.driver.find_element(By.TAG_NAME, "button").click()
        self.driver.find_element(By.CLASS_NAME, "close").click()
        self.driver.find_elements(By.ID, "dropdown-split-basic")[0].click()
        dropdown = self.driver.find_elements(By.CLASS_NAME, "dropdown-item")
        assert len(dropdown) is 3'''

    def tearDown(self):
        self.driver.quit()



if __name__ == "__main__":
    print("Starting NavBar testing")
    unittest.main(warnings='ignore')