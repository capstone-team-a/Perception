# Perception


Perception is a headless web application for encoding caption data to CEA-608 byte pairs and logging the data as JSON to a file. The specification for implementing the encoder can be found on this wiki page: https://en.wikipedia.org/wiki/EIA-608

## Getting Started

#### Running the application via command-line interface:

1. Clone the repository: 
```
git clone https://github.com/capstone-team-a/Perception.git
```
2. Navigate to the Perception backend directory: 
```
cd ~/Perception/src/server
```
3. Install Python dependencies with pip: 
```
pip3 install -r requirements.txt
```
4. Invoke main.py with a valid JSON file: 
```
python3 main.py path-to-file.json
```

#### Running the web application:

1. Clone the repository: 
```
git clone https://github.com/capstone-team-a/Perception.git
```
2. Navigate to the Perception frontend directory: 
```
cd ~/Perception/src/client
```
3. Run the npm command to install necessary dependencies:
```
npm install
```
4. Run the npm command to bundle all JavaScript files into one file: bin/app.js
```
npm start
```
5. Navigate to the Perception backend directory: 
```
cd ~/Perception/src/server
```
6. Install Python dependencies with pip:
```
pip3 install -r requirements.txt
```
7. Start the Flask application: 
```
flask run
```
8. Open your browser to: 
```
http://localhost:5000
```

**Note:** If you have receiving errors regarding Python failing to find modules. Try to export the path to Perception into PYTHONPATH: `export PYTHONPATH="${PYTHONPATH}:path/to/Perception/"`

## Installation

TODO

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* Python 3.7.4
* Flask 1.1.1
* Mithril 2.0.4

## Contributors

* Thong Nguyen 
* Joseph Jindrich
* Kennedy Hahn
* Ebraheem AlAthari
* Evan Hackett
* Gennadii Sytov
* Samuel Little
* Marko Bozic

## License

This project is licensed under the MIT License - see the [LICENSE.md](../master/LICENSE) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

