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


def which_char_set(caption_char: str) -> str:
    """Finds which character set the letter is in

    :param caption_char:
    :return: the name of the char set the caption_char is in
    """
    for char_set_name,list_of_characters in char_sets.items():
        if caption_char in list_of_characters:
            return char_set_name


def which_channel(channel_toggle: int,char_set: str) -> hex:
    """Provides the correct first byte to a letter depending on the channel toggle

    :param char_set:
    :param channel_toggle:
    :return: The first byte
    """
    if channel_toggle == 0:
        if char_set == 'basic_na_set':
            return 0x00
        elif char_set == 'special_na_set':
            return 0x11
        elif char_set in ('extended_we_sm_set','extended_we_french_set'):
            return 0x12
        elif char_set in ('extended_we_port_set','extended_we_gd_set'):
            return 0x13
    elif channel_toggle == 1:
        if char_set == 'basic_na_set':
            return 0x00
        elif char_set == 'special_na_set':
            return 0x19
        elif char_set in ('extended_we_sm_set','extended_we_french_set'):
            return 0x1a
        elif char_set in ('extended_we_port_set','extended_we_gd_set'):
            return 0x1b
    else:
        raise ValueError(f'Channel toggle must be 0 or 1!')


def create_byte_pairs_for_caption_string(caption_string: str, channel_toggle: int) -> list:
    """Generates a list of byte pairs given a caption string

    :param caption_string
    :param channel_toggle
    :return: list of byte pairs
    """
    byte_list = []
    # for determining whether or not a 0x80 needs to be appended before the end
    # of the string or before an extended character set. if it is odd, we need
    # to append before putting the extended char header.
    basic_chars_is_odd = False
    for letter in caption_string:
        char_set_name = which_char_set(letter)
        first_byte = which_channel(channel_toggle,char_set_name)
        if first_byte != 0x00:
            # check to see if the basic chars prior to this was an odd number,
            # and if so, append 0x80
            if basic_chars_is_odd:
                byte_list.append(hex(get_single_null_byte_with_parity()))
            if check_parity(first_byte) == 0:
                first_byte = add_parity_to_byte(first_byte)
            byte_list.append(hex(first_byte))
            # since we know we just appended a full bytepair, we set to false.
            basic_chars_is_odd = False
        else:
            basic_chars_is_odd = ~basic_chars_is_odd
        character_hex_value = char_sets[char_set_name][letter]
        if check_parity(character_hex_value) == 0:
            character_hex_value = add_parity_to_byte(character_hex_value)
        byte_list.append(hex(character_hex_value))
    # at the end of the string, we again check to see if we have an odd number
    # of basic chars, and if so, append 0x80.
    if basic_chars_is_odd:
        byte_list.append(hex(get_single_null_byte_with_parity()))
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

def get_single_null_byte_with_parity():
    return 0x80