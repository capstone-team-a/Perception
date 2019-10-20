import src.server.cea_608_encoder.caption_string_utility as utils
import src.server.cea_608_encoder.scene_utility as scene_utils

supported_caption_formats = [
    'CEA_608'
]


def consume(caption_data: dict) -> dict:
    if not caption_data['caption_format']:
        raise ValueError('You must specify a caption format')

    if caption_data['caption_format'] not in supported_caption_formats:
        caption_format = caption_data['caption_format']
        raise ValueError(f'The supplied caption format {caption_format} is not supported.')

    if not caption_data['scenes_list']:
        raise ValueError('Cannot encode byte pairs with an empty scene list.')

    scene_data = caption_data['scenes_list']
    caption_format = caption_data['caption_format']

    return {
        'type': caption_format,
        'data': consume_scenes(scene_data)
    }


def consume_scenes(scene_list: list) -> list:
    scene_data = []
    for scene in scene_list:
        if not scene['scene_id']:
            raise ValueError('Every scene must have a scene ID.')

        if not scene['start_time']:
            raise ValueError('You must specify a starting time for a scene.')
        else:
            start_time = scene['start_time']
            scene_utils.validate_time_formatting(start_time)

        if scene['background_color']:
            background_color = scene['background_color']
            scene_utils.create_bytes_for_scene_background_color(background_color)

        if scene['position']:
            position = scene['position']
            scene_utils.create_bytes_for_scene_position(position)

        if scene['opacity']:
            opacity = scene['opacity']
            scene_utils.create_bytes_for_scene_opacity(opacity)

        scene_data.append(consume_captions(scene))

    return []


def consume_captions(scene: dict) -> dict:
    caption_metadata = {}

    for caption in scene:
        if not caption['caption_id'] or not caption['string_list']:
            raise ValueError('A caption ID and string list must be set for each caption')

        caption_string_byte_pairs = []
        for string in caption['string_list']:
            caption_string_byte_pairs.append(utils.create_byte_pairs_for_caption_string(string))

        if caption['color']:
            caption_color = caption['color']
            caption_color_byte_encoded = utils.create_byte_pairs_for_caption_color(caption_color)
            caption_metadata[caption_color] = caption_color_byte_encoded

        if caption['text_alignment']:
            text_alignment = caption['text_alignment']
            caption_alignment_byte_encoded = utils.create_byte_pairs_for_text_alignment(text_alignment)
            caption_metadata[text_alignment] = caption_alignment_byte_encoded

        if caption['underline']:
            caption_metadata['underlined_text_bytes'] = utils.create_bytes_to_underline_text()

        if caption['italics']:
            caption_metadata['italicized_bytes'] = utils.create_bytes_to_italicize_text()

    return {}

