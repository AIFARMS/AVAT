import threading
import os
import sys, getopt
import json

files = ['selection_test.py', 'upload_dialog_test.py', 'navbar_test.py', 'boundingbox_test.py', 'video_upload_test.py']
browsers = ['firefox', 'chrome', 'edge']

def main(argv):
    
    threaded = False

    try:
        opts, args = getopt.getopt(argv, "t:")
    except:
        print("Incorrect input!")
        sys.exit(2)

    for opt, args in opts:
        if opt == '-t':
            threaded = bool(args)

    if threaded:
        print("Running threaded tests")
        run_tests_threaded(files)
    else:
        print("Running tests in sequential order")
        run_tests_normal(files)

def run_tests_normal(files):
    for i in browsers:
        change_browsers(i)
        for j in files:
            run_file(j)

def run_tests_threaded(files):
    test_threads = []

    for i in files:
        print(i)
        test_threads.append(threading.Thread(target=run_file, args=(i,)))

    for i in test_threads:
        i.start()

    for i in test_threads:
        i.join()

def change_browsers(browser):
    with open("SELENIUM_ENV.json", 'r') as options:
        data = json.load(options)
    
    data['browserName'] = browser

    with open("SELENIUM_ENV.json", 'w') as options:
        json.dump(data,options)

def run_file(fp):
    os.system("python3 " + fp)

if __name__ == "__main__":
    main(sys.argv[1:])