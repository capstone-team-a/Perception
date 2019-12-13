import pathlib

path_to_project_folder = pathlib.Path(__file__).resolve().parent.parent.parent
path_to_data_folder = str(path_to_project_folder) + '/data/byte_pairs/'
path_to_schema_folder = str(path_to_project_folder) + '/data/schema/'
DEBUG = False
