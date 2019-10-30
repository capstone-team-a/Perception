import src.server.cea_608_encoder.caption_string_utility as utils

background_colors = {"white": 0x0, "green": 0x2, "blue": 0x4, "cyan": 0x6, 
    "red": 0x8, "yellow": 0xa, "magenta": 0xc, "black": 0xe}

def create_bytes_for_scene_background_color(color: str, transparency = False):
    byte_list = []
    first_byte = 0x00
    second_byte = 0x00

    color = color.lower()
    if color in background_colors:
        first_byte = 0x10
        second_byte = 0x20 + background_colors[color]
        if transparency == True: 
            second_byte += 0x1
    else:                           # if color not found, then no background
        first_byte = 0x17
        second_byte = 0x2d

    if utils.check_parity(first_byte) == 0:
        first_byte = utils.add_parity_to_byte(first_byte)
    byte_list.append(hex(first_byte))

    if utils.check_parity(second_byte) == 0:
        second_byte = utils.add_parity_to_byte(second_byte)
    byte_list.append(hex(second_byte))

    raw_hex_values = utils.parse_raw_hex_values(byte_list)
    byte_pairs = utils.bytes_to_byte_pairs(raw_hex_values)
    return byte_pairs


def create_bytes_for_scene_position(position):
    pass

# the below function is useless, opacity is set in the 
# create_bytes_for_scene_background_color() function
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
