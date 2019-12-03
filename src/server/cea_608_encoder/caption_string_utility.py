from collections import deque
import logging

from src.server.character_sets.char_sets import char_sets


BYTE_PARITY_MASK = 0x80

BASIC_NORTH_AMERICAN_CHARACTER_SET = 'basic_na_set'

valid_special_character_sets_and_static_first_bytes = {
    'special_na_set': 0x11,
    'extended_we_sm_set': 0x12,
    'extended_we_french_set': 0x12,
    'extended_we_port_set': 0x13,
    'extended_we_gd_set': 0x13
}

text_colors = {"white": 0x0, "green": 0x2, "blue": 0x4, "cyan": 0x6,
               "red": 0x8, "yellow": 0xa, "magenta": 0xc, "italic white": 0xe}

background_colors = {"white": 0x0, "green": 0x2, "blue": 0x4, "cyan": 0x6,
                     "red": 0x8, "yellow": 0xa, "magenta": 0xc, "black": 0xe}

row_positioning = {
    1: [0x1, 0x0],
    2: [0x1, 0x20],
    3: [0x2, 0x0],
    4: [0x2, 0x20],
    5: [0x5, 0x0],
    6: [0x5, 0x20],
    7: [0x6, 0x0],
    8: [0x6, 0x20],
    9: [0x7, 0x0],
    10: [0x7, 0x20],
    11: [0x0, 0x0],
    12: [0x3, 0x0],
    13: [0x3, 0x20],
    14: [0x4, 0x0],
    15: [0x4, 0x20]
}


def check_parity(integer: int) -> int:
    """Check the bit parity of the input

    :param integer:
    :return: -1 for odd numbers of bits, 0 for even number
    """
    parity = 0
    while integer:
        parity = ~parity
        integer = integer & (integer - 1)
    return parity


def add_parity_to_byte(integer: int) -> int:
    """Add a parity bit to the provided integer

    :param integer:
    :return: byte with parity bit added
    """
    return integer | BYTE_PARITY_MASK


def parse_raw_hex_values(byte_list: list) -> list:
    """Parse out the hex prefix from a list of bytes

    :param byte_list:
    :return: list of bytes with '0x' prefix omitted
    """
    raw_hex_values = []
    for byte in byte_list:
        raw_hex = byte[2:]
        raw_hex_values.append(raw_hex)
    return raw_hex_values


def bytes_to_byte_pairs(byte_list: list) -> list:
    """Join neighboring bytes into a byte pair

    :param byte_list:
    :return: list of byte pairs ['a0', 'e5'] -> ['a0e5']
    """
    byte_pairs = []

    if len(byte_list) % 2 != 0:
        raise ValueError('Can not create byte pairs for an odd length list')

    byte_list = deque(byte_list)
    while byte_list:
        first_byte = byte_list.popleft()
        second_byte = byte_list.popleft()
        byte_pairs.append(first_byte + second_byte)

    return byte_pairs


def get_char_set(caption_char: str) -> str:
    """Finds which character set the letter is in

    :param caption_char:
    :return: the name of the char set the caption_char is in
    """
    for char_set_name, list_of_characters in char_sets.items():
        if caption_char in list_of_characters:
            return char_set_name

    raise ValueError(f'The character {caption_char} is not in any of the valid character sets')


def get_special_characters_first_byte(char_set: str) -> hex:
    """Provides the correct first byte to a letter depending on the channel toggle

    :param char_set:
    :return: The first byte
    """
    if char_set in valid_special_character_sets_and_static_first_bytes:
        return valid_special_character_sets_and_static_first_bytes[char_set]
    else:
        raise ValueError(f'The character set: {char_set} does not belong to a '
                         f'supported special character set')


def create_byte_pairs_for_caption_string(caption_string: str) -> list:
    """Generates a list of byte pairs given a caption string

    :param caption_string
    :return: list of byte pairs
    """
    byte_list = []
    # for determining whether or not a 0x80 needs to be appended before the end
    # of the string or before an extended character set. if it is odd, we need
    # to append before putting the extended char header.
    null_byte_is_needed = False
    for letter in caption_string:
        character_set = get_char_set(letter)

        if character_set is BASIC_NORTH_AMERICAN_CHARACTER_SET:
            character_hex_value = char_sets[BASIC_NORTH_AMERICAN_CHARACTER_SET][letter]
            if check_parity(character_hex_value) == 0:
                character_hex_value = add_parity_to_byte(character_hex_value)

            byte_list.append(hex(character_hex_value))

            null_byte_is_needed = not null_byte_is_needed
        else:
            if null_byte_is_needed:
                byte_list.append(hex(get_single_null_byte_with_parity()))
                null_byte_is_needed = False

            first_byte = get_special_characters_first_byte(character_set)
            if check_parity(first_byte) == 0:
                first_byte = add_parity_to_byte(first_byte)
            byte_list.append(hex(first_byte))

            second_byte = char_sets[character_set][letter]
            if check_parity(second_byte) == 0:
                second_byte = add_parity_to_byte(second_byte)
            byte_list.append(hex(second_byte))

    if null_byte_is_needed:
        byte_list.append(hex(get_single_null_byte_with_parity()))

    raw_hex_values = parse_raw_hex_values(byte_list)
    byte_pairs = bytes_to_byte_pairs(raw_hex_values)
    return byte_pairs


def create_byte_pairs_for_backspace() -> list:
    # CC1 Backspace control command
    # first_byte = 0x14 
    # second_byte = 0x21
    return [0x94, 0xa1] # parity bits included


def create_bytes_for_scene_background_color(color: str, transparency: bool = False):
    """Creates byte pairs for a valid background color and transparency flag

    :param color:
    :param transparency:
    :return: a list of byte pairs to set background color and transparency
    """
    byte_list = []

    # Default: no background
    first_byte = 0x17
    second_byte = 0x2d

    if isinstance(color, str):
        color = color.lower()
    if color in background_colors:
        first_byte = 0x10
        second_byte = 0x20 + background_colors[color]
        if transparency:
            second_byte += 0x1

    if check_parity(first_byte) == 0:
        first_byte = add_parity_to_byte(first_byte)
    byte_list.append(hex(first_byte))

    if check_parity(second_byte) == 0:
        second_byte = add_parity_to_byte(second_byte)
    byte_list.append(hex(second_byte))

    raw_hex_values = parse_raw_hex_values(byte_list)
    byte_pairs = bytes_to_byte_pairs(raw_hex_values)
    return byte_pairs


def create_byte_pairs_for_midrow_style(color: str, underline: bool = False):
    """Creates byte pairs for a foreground color and underlines text

    :param color:
    :param underline:
    :return: a list of byte pairs for changing text color and underlining text
    """
    byte_list = []
    
    # Default: Do nothing, no change in style
    first_byte = 0x00
    second_byte = 0x00

    if isinstance(color, str):
        color = color.lower()
    if color == "black":
        first_byte = 0x17
        second_byte = 0x2e
    elif color in text_colors:
        first_byte = 0x11 
        second_byte = 0x20 + text_colors[color]
    else:
        logging.error(f'Could not change midrow style: \'{color}\' is not supported by CEA-608')

    if underline == True and second_byte != 0x00: 
        second_byte += 0x1  

    if check_parity(first_byte) == 0:
            first_byte = add_parity_to_byte(first_byte)
    byte_list.append(hex(first_byte))
    if check_parity(second_byte) == 0:
        second_byte = add_parity_to_byte(second_byte)
    byte_list.append(hex(second_byte))

    # To move the cursor one position back
    if first_byte != 0x80:
        backspace_bytes = create_byte_pairs_for_backspace()
        byte_list.append(hex(backspace_bytes[0]))
        byte_list.append(hex(backspace_bytes[1]))

    raw_hex_values = parse_raw_hex_values(byte_list)
    byte_pairs = bytes_to_byte_pairs(raw_hex_values)
    return byte_pairs

def create_byte_pairs_for_tab_offset(offset: int):
    if offset < 1 or offset > 3:
        raise ValueError(f'Cannot create byte pairs for tab offset. \'{offset}\' is not in the range of [1, 3]')
    byte_list = []
    first_byte = 0x17
    second_byte = 0x20 + offset

    if check_parity(first_byte) == 0:
        first_byte = add_parity_to_byte(first_byte)
    byte_list.append(hex(first_byte))
    if check_parity(second_byte) == 0:
        second_byte = add_parity_to_byte(second_byte)
    byte_list.append(hex(second_byte))
    return byte_list

def create_byte_pairs_for_preamble_address(row: int, cursor: int, underline = False):
    if row < 1 or row > 15:
        raise ValueError(f'Cannot create byte pairs for preamble address. \'{row}\' is not in the range of [1, 15]')
    if cursor < 0 or cursor > 31:
        raise ValueError(f'Cannot create byte pairs for preamble address. \'{cursor}\' is not in the range of [0, 31]')

    byte_list = []
    first_byte = 0x10
    second_byte = 0x50

    row_bytes = row_positioning[row]
    first_byte += row_bytes[0]
    second_byte += row_bytes[1]

    tab_offset = cursor % 4
    cursor_multiplier = cursor // 4
    second_byte += cursor_multiplier * 2
    if underline == True: 
        second_byte += 0x1 

    if check_parity(first_byte) == 0:
        first_byte = add_parity_to_byte(first_byte)
    byte_list.append(hex(first_byte))
    if check_parity(second_byte) == 0:
        second_byte = add_parity_to_byte(second_byte)
    byte_list.append(hex(second_byte))

    if tab_offset > 0:
        offset_bytes = create_byte_pairs_for_tab_offset(tab_offset)
        byte_list.append(offset_bytes[0])
        byte_list.append(offset_bytes[1])

    raw_hex_values = parse_raw_hex_values(byte_list)
    byte_pairs = bytes_to_byte_pairs(raw_hex_values)
    return byte_pairs


def get_single_null_byte_with_parity():
    return 0x80
