import threading
import os
import sys, getopt

def main(argv):
    files = ['selection_test.py', 'upload_dialog_test.py', 'navbar_test.py']
    
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
        run_tests_threaded(files)
    else:
        run_tests_normal(files)

def run_tests_normal(files):
    for i in files:
        run_file(i)

def run_tests_threaded(files):
    test_threads = []

    for i in files:
        print(i)
        test_threads.append(threading.Thread(target=run_file, args=(i,)))

    for i in test_threads:
        i.start()

    for i in test_threads:
        i.join()

def run_file(fp):
    os.system("python3 " + fp + " | grep Ran")

if __name__ == "__main__":
    main(sys.argv[1:])