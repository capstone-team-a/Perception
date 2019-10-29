import src.server.cea_608_encoder.caption_string_utility as utils

def create_bytes_for_scene_background_color(color: str):
    pass


def create_bytes_for_scene_position(position):
    pass


def create_bytes_for_scene_opacity(opacity):
    pass


def validate_time_formatting(time):
    pass


def get_default_preamble_style_bytes() -> list:
    return [0x10, 0x40]


def get_default_preamble_address_bytes() -> list:
    return [0x10, 0x50]


def get_resume_caption_loading_bytes() -> list:
    return [0x14, 0x20]


def get_erase_non_displayed_memory_bytes() -> list:
    return [0x14, 0x2e]


def get_end_of_caption_bytes() -> list:
    return [0x14, 0x2f]

# this function takes output from any of the above get commands as a parameter.
# it then turns the bytes into a single bytepair and returns that bytepair as
# a list- make sure you concat the output.
#
# example: eoc=create_byte_pairs_for_control_command(get_end_of_caption_bytes())
#
def create_byte_pairs_for_control_command(control_bytes) -> list:
    byte_list = []
    for byte in control_bytes:
        if utils.check_parity(byte) == 0:
            byte = utils.add_parity_to_byte(byte)
        byte_list.append(hex(byte))
    raw_hex_values = utils.parse_raw_hex_values(byte_list)
    byte_pairs = utils.bytes_to_byte_pairs(raw_hex_values)
    return byte_pairs
