import json
import logging

import src.server.cea_608_encoder.caption_string_utility as utils
import src.server.cea_608_encoder.scene_utility as scene_utils
import src.server.config as config

# At a future time this could live in it's own config file
# Leaving it here temporarily
supported_caption_formats = [
    'CEA-608'
]


def write_caption_data_to_file(caption_data: dict, file_name: str):
    """Writes caption data to file as json.

       :param caption_data: json with byte pairs
       :param file_name: used for saving resulting file
    """
    path = config.path_to_data_folder
    try:
        with open(path + file_name, 'w', encoding='utf-8') as file:
            json.dump(caption_data, file, ensure_ascii=False, indent=4)
    except IOError as err:
        logging.error(f'Could not write JSON to file: {err}')


def consume(caption_data: dict, time_stamp: str) -> list:
    """Perform error handling around caption format and ensure
    there are scenes to create byte pairs for.

    :param caption_data: the full JSON blob from the front end
    :param time_stamp: the date time the request is received
    """
    errors = []

    if 'caption_format' not in caption_data:
        errors.append(f'You must specify a caption format')

    if caption_data['caption_format'] not in supported_caption_formats:
        caption_format = caption_data['caption_format']
        errors.append(f'The supplied caption format {caption_format} is not supported.')

    if 'scene_list' not in caption_data:
        errors.append(f'Cannot encode byte pairs with an empty scene list.')

    if errors:
        return errors

    scene_data = caption_data['scene_list']
    caption_format = caption_data['caption_format']
    file_name = caption_data['file_name'] + f'_output_{time_stamp}.json'

    scene_bytes, scene_errors = consume_scenes(scene_data)
    caption_data = {
        'type': caption_format,
        'scenes': scene_bytes
    }

    if scene_errors:
        return scene_errors

    write_caption_data_to_file(caption_data, file_name)
    return None


def consume_scenes(scene_list: list) -> tuple:
    """Iterate over the list of scenes and create bytes for fields that
    are set in the scene data. Call the consume function for caption
    strings to return byte pairs for caption strings inside a scene.

    :param scene_list:
    :return: scene_data
    """
    scene_data = []
    errors = []

    for scene in scene_list:
        scene_errors = []
        current_scene_data = {
            'data': []
        }

        if 'scene_id' not in scene:
            scene_errors.append(f'Every scene must have a scene ID')

        if 'start' not in scene: 
            scene_errors.append(f'\tdoes not have a start time')
        else:
            start = scene['start']
            current_scene_data['start'] = start

        # append RCL.
        current_scene_data['data'].extend(scene_utils.create_byte_pairs_for_control_command(
                        scene_utils.get_resume_caption_loading_bytes()
                        ))

        # append ENM.
        current_scene_data['data'].extend(scene_utils.create_byte_pairs_for_control_command(
                        scene_utils.get_erase_non_displayed_memory_bytes()
                        ))

        # append the Char Bytepairs.
        caption_list, caption_errors = consume_captions(scene['caption_list'])
        current_scene_data['data'].extend(caption_list)
        scene_errors.extend(caption_errors)

        # append EOC.
        current_scene_data['data'].extend(scene_utils.create_byte_pairs_for_control_command(
                              scene_utils.get_end_of_caption_bytes()
                              ))

        scene_data.append(current_scene_data)
        if scene_errors:
            scene_errors.insert(0, f'Errors encountered while consuming scene with ID: {scene["scene_id"]}')
            errors.extend(scene_errors)

    errors.extend(validate_scene_ids(scene_list))
    errors.extend(validate_start_times(scene_list))



    return scene_data, errors


def consume_captions(caption_list: list) -> tuple:
    """Iterate over the list of captions in a scene and create bytes pairs
    for the list of caption strings and properties that the strings have.

    :param caption_list:
    :return: caption_bytes
    """

    caption_bytes = []
    errors = []

    for caption in caption_list:
        caption_errors = []
        if 'caption_id' not in caption:
            caption_errors.append(f'Every caption must have a caption ID')

        foreground_color_and_underline_style_changes = {}

        if 'foreground_color' in caption and 'color' in caption['foreground_color']:
            foreground_color = caption['foreground_color']['color']
            foreground_color_and_underline_style_changes['color'] = foreground_color

        if 'underline' in caption:
            underlined = caption['underline']
            foreground_color_and_underline_style_changes['underline'] = underlined

        if 'position' in caption:
            text_position = caption['position']

            if 'row' in text_position and not (text_position['row'] == ""):
                text_row_position = text_position['row']
            else:
                text_row_position = 11 #Default row position

            if 'column' in text_position and not (text_position['column'] == ""):
                text_column_position = text_position['column']
            else:
                text_column_position = 0 #Default row position

            if 'underline' in foreground_color_and_underline_style_changes \
            and foreground_color_and_underline_style_changes['underline'] == "true":
                text_underlined = True
            else:
                text_underlined = False

            caption_position_bytes, preamble_errors = utils.create_byte_pairs_for_preamble_address(int(text_row_position),
                                                                                  int(text_column_position),
                                                                                  text_underlined)
            caption_errors.extend(preamble_errors)
            caption_bytes.extend(caption_position_bytes)

        if foreground_color_and_underline_style_changes:
            midrow_bytes, midrow_errors = utils.create_byte_pairs_for_midrow_style(
                                              **foreground_color_and_underline_style_changes)
            caption_bytes.extend(midrow_bytes)
            caption_errors.extend(midrow_errors)

        background_color_and_transparency_style_changes = {}

        if 'background_color' in caption and 'color' in caption['background_color']:
            color = caption['background_color']['color']
            background_color_and_transparency_style_changes['color'] = color

        if 'transparency' in caption:
            transparency = caption['transparency']
            background_color_and_transparency_style_changes['transparency'] = transparency

        if background_color_and_transparency_style_changes:
            background_bytes, background_errors = utils.create_bytes_for_scene_background_color(
                                                      **background_color_and_transparency_style_changes)
            caption_bytes.extend(background_bytes)
            caption_errors.extend(background_errors)

        if 'caption_string' in caption and caption['caption_string']:
            string, string_errors = utils.create_byte_pairs_for_caption_string(caption['caption_string'])
            caption_bytes.extend(string)
            caption_errors.extend(string_errors)
        else:
            caption_errors.append(f'\t\tYou must specify a caption string')

        if caption_errors:
            caption_errors.insert(0, f'\tErrors encountered while consuming caption with ID: {caption["caption_id"]}')
            errors.extend(caption_errors)

    errors.extend(validate_caption_ids(caption_list))

	
    return caption_bytes, errors


def validate_scene_ids(scene_list: list):
    """Validates the scene IDs to look for duplicate IDs

    :param scene_list:
    """
    scene_ids = {}
    conflicting_id_errors = []
    for scene in scene_list:
        for key,value in scene.items():
            if key == "scene_id":
                if value not in scene_ids:
                    scene_ids[value] = 1
                else:
                    scene_ids[value] = scene_ids.get(value) + 1

    for id, number_of_that_id in scene_ids.items():
        if number_of_that_id > 1:
            conflicting_id_errors.append(f'There are duplicate scene IDs {id}.')

    return conflicting_id_errors


def validate_caption_ids(caption_list: list):
    """Validates the caption IDs to look for duplicate IDs

    :param caption_list:
    """
    caption_ids = {}
    conflicting_id_errors = []
    for caption in caption_list:
        for key, value in caption.items():
            if key == "caption_id":
                if value not in caption_ids:
                    caption_ids[value] = 1
                else:
                    caption_ids[value] = caption_ids.get(value) + 1

    for id, number_of_that_id in caption_ids.items():
        if number_of_that_id > 1:
            conflicting_id_errors.append(f'There are duplicate caption IDs {id}.')

    return conflicting_id_errors


def validate_start_times(scene_list: list) -> list:
    """Checks if multiple scenes have the same start time

    :param scene_list:
    """
    errors = []
    start_times = {}
    for scene in scene_list:
        for key, value in scene.items():
            if key == "start":
                scene_time = value["time"]
                if scene_time not in start_times:
                    start_times[scene_time] = [1, [scene["scene_id"]]]
                else:
                    start_times[scene_time][0] = start_times[scene_time][0] + 1
                    start_times[scene_time][1].append(scene["scene_id"])

    for time, number_and_ids in start_times.items():
        if number_and_ids[0] > 1:
            errors.append(f'Scenes with the IDs {number_and_ids[1]} are starting at the same time of {time}.')
    return errors

