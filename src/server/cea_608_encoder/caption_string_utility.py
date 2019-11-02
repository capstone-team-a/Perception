from src.server.character_sets.char_sets import char_sets
# import sys
# sys.path.append('../character_sets/')
# from char_sets import char_sets


BYTE_PARITY_MASK = 0x80


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
    while byte_list:
        first_byte = byte_list.pop(0)
        if not byte_list:
            second_byte = ''
        else:
            second_byte = byte_list.pop(0)
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


def get_special_characters_first_byte(char_set: str) -> hex:
    """Provides the correct first byte to a letter depending on the channel toggle

    :param char_set:
    :param channel_toggle:
    :return: The first byte
    """
    if char_set in special_character_sets:
        return special_character_sets[char_set]
    else:
        raise ValueError(f'Channel toggle must be 0 or 1!')


special_character_sets = {
    ''
    'special_na_set': 0x11,
    'extended_we_sm_set': 0x12,
    'extended_we_french_set': 0x12,
    'extended_we_port_set': 0x13,
    'extended_we_gd_set': 0x13
}


def create_byte_pairs_for_caption_string(caption_string: str) -> list:
    """Generates a list of byte pairs given a caption string

    :param caption_string
    :param channel_toggle
    :return: list of byte pairs
    """
    byte_list = []
    for letter in caption_string:
        char_set_name = get_char_set(letter)
        first_byte = get_special_characters_first_byte(char_set_name)
        if first_byte != 0x00:
            if check_parity(first_byte) == 0:
                first_byte = add_parity_to_byte(first_byte)
            byte_list.append(hex(first_byte))
        character_hex_value = char_sets[char_set_name][letter]
        if check_parity(character_hex_value) == 0:
            character_hex_value = add_parity_to_byte(character_hex_value)
        byte_list.append(hex(character_hex_value))
    raw_hex_values = parse_raw_hex_values(byte_list)
    byte_pairs = bytes_to_byte_pairs(raw_hex_values)
    return byte_pairs


def create_byte_pairs_for_caption_color(color):
    pass


def create_byte_pairs_for_text_alignment(alignment):
    pass


def create_bytes_to_underline_text():
    pass


def create_bytes_to_italicize_text():
    pass

