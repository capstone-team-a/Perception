import json

from flask import Flask, request, Response, send_from_directory
from flask_cors import CORS

import src.server.cea_608_encoder.byte_pair_generator as encoder


app = Flask(__name__, static_folder="../client/")
CORS(app)


@app.route("/", methods=['GET'])
def home():
    return send_from_directory('../client','index.html')


@app.route("/submit", methods=['POST'])
def submit():
    if request.get_json() is None:
        app.logger.error('Received request with a mimetype other than JSON')
        return Response(json.dumps({'Error': 'The endpoint requires a JSON mimetype: \'application/json\''}),
                        status=415,
                        mimetype='application/json')

    caption_data = request.get_json()

    try:
        with open('data.json', 'w', encoding='utf-8') as file:
            json.dump(caption_data, file, ensure_ascii=False, indent=4)
        result = encoder.consume(caption_data)
        print(json.dumps(result, indent=4))
        return Response(json.dumps({'Success': 'ok'}),
                        status=200,
                        mimetype='application/json')
    except IOError as err:
        app.logger.error(f'Could not write JSON to file: {err}')
        return Response(json.dumps({'Error': 'There was a problem trying to write the caption data to file'}),
                        status=500,
                        mimetype='application/json')
    except ValueError as err:
        app.logger.error(f'Could not encode caption data to byte pairs, shutting down with error: {err}')
        return Response(json.dumps({'Error': 'Received bad input for one or more values.'}),
                        status=500,
                        mimetype='application/json')
    except Exception:
        return Response(json.dumps({'Error': 'Could not create byte pairs for the specified caption data, try again'}),
                        status=500,
                        mimetype='application/json')


if __name__ == "__main__":
    app.run()

