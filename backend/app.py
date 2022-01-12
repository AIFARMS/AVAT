from flask import Flask, request

app = Flask(__name__, static_folder='../build', static_url_path='')

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000)

@app.route('/')
def index():
	return app.send_static_file('index.html')