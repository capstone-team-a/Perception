import json
import logging
from datetime import datetime

import src.server.cea_608_encoder.caption_string_utility as utils
import src.server.cea_608_encoder.scene_utility as scene_utils
import src.server.config as config

# At a future time this could live in it's own config file
# Leaving it here temporarily
supported_caption_formats = [
    'CEA-608'
]


def write_caption_data_to_file(caption_data: dict):
    """Writes caption data to file as json.

       :param caption_data: json with byte pairs
    """
    # datetime object containing current date and time
    now = datetime.now()
    # mm.dd.YY_H:M:S
    dt_string = now.strftime("%m.%d.%Y_%H-%M-%S")

    path = config.path_to_data_folder
    file_name = f'output_{dt_string}.json'
    try:
        with open(path + file_name, 'w', encoding='utf-8') as file:
            json.dump(caption_data, file, ensure_ascii=False, indent=4)
    except IOError as err:
        logging.error(f'Could not write JSON to file: {err}')


def consume(caption_data: dict):
    """Perform error handling around caption format and ensure
    there are scenes to create byte pairs for.

    :param caption_data: the full JSON blob from the front end
    """
    if 'caption_format' not in caption_data:
        raise ValueError('You must specify a caption format')

    if caption_data['caption_format'] not in supported_caption_formats:
        caption_format = caption_data['caption_format']
        raise ValueError(f'The supplied caption format {caption_format} is not supported.')

    if 'scene_list' not in caption_data:
        raise ValueError('Cannot encode byte pairs with an empty scene list.')

    scene_data = caption_data['scene_list']
    caption_format = caption_data['caption_format']

    caption_data = {
        'type': caption_format,
        'scenes': consume_scenes(scene_data)
    }

    write_caption_data_to_file(caption_data)


def consume_scenes(scene_list: list) -> list:
    """Iterate over the list of scenes and create bytes for fields that
    are set in the scene data. Call the consume function for caption
    strings to return byte pairs for caption strings inside a scene.

    :param scene_list:
    :return: scene_data
    """
    scene_data = []

    for scene in scene_list:
        current_scene_data = {}
        current_scene_data['start'] = 0
        current_scene_data['data'] = []

        if 'scene_id' not in scene:
            raise ValueError('Every scene must have a scene ID.')

        if 'start' not in scene: 
            raise ValueError('You must specify a starting time for a scene.')
        else:
            start = scene['start']
            current_scene_data['start'] = start

        if 'position' in scene:
            position = scene['position']
            scene_utils.create_bytes_for_scene_position(position)

        # append RCL.
        current_scene_data['data'] += scene_utils.create_byte_pairs_for_control_command(
                        scene_utils.get_resume_caption_loading_bytes()
                        )

        # append ENM.
        current_scene_data['data'] += scene_utils.create_byte_pairs_for_control_command(
                        scene_utils.get_erase_non_displayed_memory_bytes()
                        )

        # append Default Style Bytepairs.
        # TODO This will have to be reworked when we add proper style support.
        current_scene_data['data'] += scene_utils.create_byte_pairs_for_control_command(
                        scene_utils.get_default_preamble_style_bytes()
                        )

        # append Default Style Bytepairs.
        # TODO This will have to be reworked when we add proper position support
        current_scene_data['data'] += scene_utils.create_byte_pairs_for_control_command(
                        scene_utils.get_default_preamble_address_bytes()
                        )

        # append the Char Bytepairs.
        caption_list = scene['caption_list']
        current_scene_data['data'] += consume_captions(caption_list)

        # append EOC.
        current_scene_data['data'] += scene_utils.create_byte_pairs_for_control_command(
                              scene_utils.get_end_of_caption_bytes()
                              )

        scene_data.append(current_scene_data)

    validate_scene_ids(scene_list)

    return scene_data


def consume_captions(caption_list: list) -> list:
    """Iterate over the list of captions in a scene and create bytes pairs
    for the list of caption strings and properties that the strings have.

    :param caption_list:
    :return: caption_bytes
    """

    caption_bytes = []

    for caption in caption_list:
        if 'caption_id' not in caption:
            raise ValueError('A caption ID must be set for each caption')

        foreground_color_and_underline_style_changes = {}

        if 'foreground_color' in caption and 'color' in caption['foreground_color']:
            foreground_color = caption['foreground_color']['color']
            foreground_color_and_underline_style_changes['color'] = foreground_color

        if 'underline' in caption:
            underlined = caption['underline']
            foreground_color_and_underline_style_changes['underline'] = underlined

        if foreground_color_and_underline_style_changes:
            caption_bytes += utils.create_byte_pairs_for_midrow_style(
                **foreground_color_and_underline_style_changes)

        background_color_and_transparency_style_changes = {}

        if 'background_color' in caption and 'color' in caption['background_color']:
            color = caption['background_color']['color']
            background_color_and_transparency_style_changes['color'] = color

        if 'transparency' in caption:
            transparency = caption['transparency']
            background_color_and_transparency_style_changes['transparency'] = transparency

        if background_color_and_transparency_style_changes:
            utils.create_bytes_for_scene_background_color(
                **background_color_and_transparency_style_changes)

        if 'caption_string' in caption and caption['caption_string']:
            string = caption['caption_string']
            caption_bytes += utils.create_byte_pairs_for_caption_string(string)
        else:
            raise ValueError('You must specify a caption string that is not null.')

        if 'text_alignment' in caption and 'placement' in caption['text_alignment']:
            text_alignment = caption['text_alignment']['placement']
            caption_alignment_byte_encoded = utils.create_byte_pairs_for_text_alignment(text_alignment)
            caption_bytes = caption_alignment_byte_encoded

    return caption_bytes


def validate_scene_ids(scene_list: list):
    """Validates the scene IDs to look for duplicate IDs

    :param scene_list:
    """
    scene_ids = {}
    for scene in scene_list:
        for key,value in scene.items():
            if key == "scene_id":
                if value not in scene_ids:
                    scene_ids[value] = 1;
                else:
                    scene_ids[value] = scene_ids.get(value) + 1;

    for id,number_of_that_id in scene_ids.items():
        if number_of_that_id > 1:
            raise ValueError(f'There are duplicate scene IDs {id}.')


def validate_caption_ids(caption_list: list):
    """Validates the caption IDs to look for duplicate IDs

    :param caption_list:
    """
    caption_ids = {}
    for caption in caption_list:
        for key,value in caption.items():
            if key == "caption_id":
                if value not in caption_ids:
                    caption_ids[value] = 1;
                else:
                    caption_ids[value] = caption_ids.get(value) + 1;

    for id,number_of_that_id in caption_ids.items():
        if number_of_that_id > 1:
            raise ValueError(f'There are duplicate caption IDs {id}.')

