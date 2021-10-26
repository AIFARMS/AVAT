from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

#import page
import unittest


class AVAT_SelectionScreen(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get("http://localhost:3000")

    def test_title(self):
        assert "AVAT - ALPHA" in self.driver.title

    def test_navButton(self):
        buttons = self.driver.find_element(By.TAG_NAME, "button")
        assert "Video Upload" in buttons.text

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    print("Starting selenium tests")
    unittest.main()