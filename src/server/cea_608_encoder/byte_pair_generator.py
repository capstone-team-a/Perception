import src.server.cea_608_encoder.caption_string_utility as utils
import src.server.cea_608_encoder.scene_utility as scene_utils

# At a future time this could live in it's own config file
# Leaving it here temporarily
supported_caption_formats = [
    'CEA-608'
]


def consume(caption_data: dict) -> dict:
    """Perform error handling around caption format and ensure
    there are scenes to create byte pairs for.

    :param caption_data: the full JSON blob from the front end
    :return: TODO
    """
    if not caption_data['caption_format']:
        raise ValueError('You must specify a caption format')

    if caption_data['caption_format'] not in supported_caption_formats:
        caption_format = caption_data['caption_format']
        raise ValueError(f'The supplied caption format {caption_format} is not supported.')

    if not caption_data['scene_list']:
        raise ValueError('Cannot encode byte pairs with an empty scene list.')

    scene_data = caption_data['scene_list']
    caption_format = caption_data['caption_format']

    return {
        'type': caption_format,
        'scenes': consume_scenes(scene_data)
    }


def consume_scenes(scene_list: list) -> list:
    """Iterate over the list of scenes and create bytes for fields that
    are set in the scene data. Call the consume function for caption
    strings to return byte pairs for caption strings inside a scene.

    :param scene_list:
    :return: TODO
    """
    scene_data = []
    
    for scene in scene_list:
        current_scene_data = {}
        current_scene_data['start'] = 0
        current_scene_data['data'] = []

        if not scene['scene_id']:
            raise ValueError('Every scene must have a scene ID.')

        if not scene['start']:
            raise ValueError('You must specify a starting time for a scene.')
        else:
            start = scene['start']
            current_scene_data['start'] = start

        if scene['position']:
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
        current_scene_data['data'] += consume_captions(caption_list)['caption_string']

        # append EOC.
        current_scene_data['data'] += scene_utils.create_byte_pairs_for_control_command(
                              scene_utils.get_end_of_caption_bytes()
                              )

        scene_data.append(current_scene_data)

    return scene_data


def consume_captions(caption_list: list) -> dict:
    """Iterate over the list of captions in a scene and create bytes pairs
    for the list of caption strings and properties that the strings have.

    :param caption_list:
    :return: TODO
    """
    caption_metadata = {}
    caption_metadata['caption_string'] = []

    for caption in caption_list:
        if 'caption_id' not in caption or 'caption_string' not in caption:
            raise ValueError('A caption ID and string list must be set for each caption')
        
        if 'caption_string' in caption:
            string = caption['caption_string']
            caption_metadata['caption_string'] += utils.create_byte_pairs_for_caption_string(string, 0)

        if 'foreground_color' in caption and 'color' in caption:
            caption_color = caption['foreground_color']['color']
            caption_color_byte_encoded = utils.create_byte_pairs_for_caption_color(caption_color)
            caption_metadata['foreground_color'] = caption_color_byte_encoded

        if 'background_color' in caption and 'color' in caption:
            background_color = caption['background_color']['color']
            scene_utils.create_bytes_for_scene_background_color(background_color)

        if 'opacity' in caption:
            opacity = caption['opacity']
            scene_utils.create_bytes_for_scene_opacity(opacity)

        if 'text_alignment' in caption and 'placement' in caption:
            text_alignment = caption['text_alignment']['placement']
            caption_alignment_byte_encoded = utils.create_byte_pairs_for_text_alignment(text_alignment)
            caption_metadata['text_alignment'] = caption_alignment_byte_encoded

        if 'underline' in caption:
            caption_metadata['underlined_text_bytes'] = utils.create_bytes_to_underline_text()

        if 'italics' in caption:
            caption_metadata['italicized_bytes'] = utils.create_bytes_to_italicize_text()

    return caption_metadata

