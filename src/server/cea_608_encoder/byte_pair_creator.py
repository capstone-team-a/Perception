import src.server.cea_608_encoder.cea_608_utility as utils


def consume(caption_data: dict) -> dict:
    caption_metadata = {}

    if not caption_data['scene_list']:
        raise ValueError('Cannot encode byte pairs with an empty scene list')

    for scene in caption_data['scene_list']:
        for caption in scene['caption_list']:
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

    return caption_metadata

