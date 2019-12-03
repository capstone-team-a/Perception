import json
from datetime import datetime

from flask import Flask, request, Response, send_from_directory
from flask_cors import CORS

from src.server.cea_608_encoder.byte_pair_generator import consume
from src.server.config import path_to_schema_folder

app = Flask(__name__, static_folder="../client/")
CORS(app)


@app.route("/", methods=['GET'])
def home():
    return send_from_directory('../client', 'index.html')


@app.route("/submit", methods=['POST'])
def submit():
    if request.get_json() is None:
        app.logger.error('Received request with a mimetype other than JSON')
        return Response(json.dumps({'Error': 'The endpoint requires a JSON mimetype: \'application/json\''}),
                        status=415,
                        mimetype='application/json')

    caption_data = request.get_json()

    try:
        now = datetime.now()
        time_stamp = now.strftime("%m.%d.%Y_%H-%M-%S")
        file_name = caption_data["file_name"] + f'output_{time_stamp}.json'

        with open(path_to_schema_folder + file_name, 'w', encoding='utf-8') as file:
            json.dump(caption_data, file, ensure_ascii=False, indent=4)
        consume(caption_data,time_stamp)
        return Response(json.dumps({'Success': 'ok'}),
                        status=200,
                        mimetype='application/json')
    except KeyError as err:
        error_message = {'Error': 'No filename provided: {err}'}
        app.logger.error(error_message)
        return Response(json.dumps(error_message),
                        status=500,
                        mimetype='application/json')
    except IOError as err:
        error_message = {'Error': f'Writing JSON to file failed: {err}'}
        app.logger.error(error_message)
        return Response(json.dumps(error_message),
                        status=500,
                        mimetype='application/json')
    except ValueError as err:
        error_message = {'Error': f'Received bad input for one or more values: {err}'}
        app.logger.error(error_message)
        return Response(json.dumps(error_message),
                        status=500,
                        mimetype='application/json')
    except Exception as err:
        error_message = {'Error': 'Could not create byte pairs for the specified caption data, try again'}
        app.logger.error(f'Failed to encode byte pairs: {err}')
        return Response(json.dumps(error_message),
                        status=500,
                        mimetype='application/json')


if __name__ == "__main__":
    app.run()

