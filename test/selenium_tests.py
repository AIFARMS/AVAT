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

class AVAT_Upload(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get("http://localhost:3000")

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
        self.driver.close()
        
class AVAT_NavBar(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.get("http://localhost:3000")

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
        self.driver.close()



if __name__ == "__main__":
    print("Starting selenium tests")
    unittest.main()