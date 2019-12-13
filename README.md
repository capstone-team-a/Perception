# Perception


Perception is a headless web application for encoding caption data to CEA-608 byte pairs and logging the data as JSON to a file. The specification for implementing the encoder can be found on this wiki page: https://en.wikipedia.org/wiki/EIA-608

There are two outputs of Perception. The first is located at Perception/data/byte_pairs. This file is the caption data that has been input converted into byte pairs. The seconde is the captions in the basic JSON schema format. This is located at Perception/data/schema. This file can be used to load the caption data into the web application. 

## Installation

#### Running the application via command-line interface:

1. Clone the repository: 
```
git clone https://github.com/capstone-team-a/Perception.git
```
2. Navigate to the Perception backend directory: 
```
cd Perception/src/server
```
3. Install Python dependencies with pip: 
```
pip3 install -r requirements.txt
```
4. Invoke main.py with a valid JSON file: 
```
python3 main.py path-to-file.json
```

Perception expects a JSON file with the following format:

```
{
  "file_name": "test file",
  "caption_format": "CEA-608",
  "scene_list": [
    {
      "scene_id": 1,
      "scene_name": "Scene 1",
      "caption_list": [
        {
          "caption_id": 1,
          "caption_name": "Caption 1",
          "caption_string": "I'm your huckleberry",
          "background_color": {
            "color": "black"
          },
          "foreground_color": {
            "color": "white"
          },
          "text_alignment": {
            "placement": "left"
          },
          "underline": true,
          "italics": false,
          "opacity": 100
        }
      ],
      "start": {
        "time": 0
      },
      "position": {
        "row": "11"
      }
    }
  ]
}
```

#### Running the web application:

1. Clone the repository: 
```
git clone https://github.com/capstone-team-a/Perception.git
```
2. Navigate to the Perception frontend directory: 
```
cd Perception/src/client
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
cd Perception/src/server
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

**Note:** 

If you have receiving errors regarding Python failing to find modules. Try to export the path to Perception into the PYTHONPATH environment variable:
```
export PYTHONPATH="${PYTHONPATH}:path/to/Perception/"
```

## Configuration

The user can change the path to the folder for the byte pair generator output by changing the "path_to_data_folder" variable
in the "config.py" file located in the "server" folder.

## Testing

### Client Tests

1. Navigate to the client directoy:
```
cd Perception/src/client
```
2. Run the test suite:
```
npm test
```

This will automatically run any tests defined in any .js file within the `src/tests` directory.

The convention will be to name each test file with the same name as the file it is testing.

### Server Tests

1. Navigate to the server directory:
```
cd Perception/src/server
```
2. Run the test suite:
```
python3 -m unittest
```

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

