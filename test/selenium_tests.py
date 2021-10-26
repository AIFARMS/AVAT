#NOTE - This is a sample script to just run all of the tests in parallel using threading.

import threading
import os

def run_tests(fp):
    os.system("python3 " + fp + " | grep Ran")

files = ['selection_test.py', 'upload_dialog_test.py', 'navbar_test.py']
test_threads = []

for i in files:
    print(i)
    test_threads.append(threading.Thread(target=run_tests, args=(i,)))

for i in test_threads:
    i.start()

for i in test_threads:
    i.join()