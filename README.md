# Perception

Perception is a headless web application for encoding caption data to CEA-608 byte pairs and logging the data as JSON to a file. The specification for implementing the encoder can be found on this wiki page: https://en.wikipedia.org/wiki/EIA-608

## Build Branch

This is the build branch, meaning it contains a bundled build of the frontend as part of the repository, meaning the web application can be run without needing node or npm.

This means some of the steps in the "Running the web application" of this readme can be skipped. Specifically, the steps involving `npm install` and `npm start` can be skipped.

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
2. Navigate to the Perception backend directory: 
```
cd Perception/src/server
```
3. Install Python dependencies with pip:
```
pip3 install -r requirements.txt
```
4. Start the Flask application: 
```
flask run
```
5. Open your browser to: 
```
http://localhost:5000
```

**Note:** 

If you have receiving errors regarding Python failing to find modules. Try to export the path to Perception into the PYTHONPATH environment variable:
```
export PYTHONPATH="${PYTHONPATH}:path/to/Perception/"
```

## Built With

* Python 3.7.4
* Flask 1.1.1

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

