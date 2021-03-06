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
        with open(args.file_path, 'r') as file:
            caption_data = json.load(file)
            optional_errors = consume(caption_data,time_stamp)

            if optional_errors is not None:
                print('\n')
                for err in optional_errors:
                    print(err + '\n')
					
    except IOError as err:
        logging.error('Error trying to read in the file.', exc_info=err)
    except json.decoder.JSONDecodeError as err:
        logging.error('Error trying to parse the JSON file.', exc_info=err)
    except Exception as err:
        logging.error('Error trying to encode caption data.', exc_info=err)


if __name__ == '__main__':
    main()
