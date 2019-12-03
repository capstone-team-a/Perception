import argparse
import json
import logging
from datetime import datetime

from src.server.cea_608_encoder.byte_pair_generator import consume

logging.basicConfig(format='%(levelname)s: %(asctime)s: %(message)s')


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("-f",
                        "--file_path",
                        help='Path to JSON file',
                        type=str,
                        required=True)

    args = parser.parse_args()

    try:
        now = datetime.now()
        time_stamp = now.strftime("%m.%d.%Y_%H-%M-%S")
        file_name = args.f + f'output_{time_stamp}.json'
        with open(args.file_path, 'r') as file:
            caption_data = json.load(file)
            consume(caption_data,file_name)
       
    except IOError as err:
        logging.error('Error trying to read in the file.', exc_info=err)
    except json.decoder.JSONDecodeError as err:
        logging.error('Error trying to parse the JSON file.', exc_info=err)
    except Exception as err:
        logging.error('Error trying to encode caption data.', exc_info=err)


if __name__ == '__main__':
    main()
