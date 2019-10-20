from src.server.character_sets.char_sets import char_sets


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


def which_channel(channel_toggle: int,char_set: str) -> str:
    """Provides the correct first byte to a letter depending on the channel toggle

    :param channel_toggle, char_set:
    :return: The first byte
    """
    if channel_toggle == 0:
        if char_set == 'basic_na_set':
            return '-1'
        elif char_set == 'special_na_set':
            return '11'
        elif char_set in ('extended_we_sm_set','extended_we_french_set'):
            return '12'
        elif char_set in ('extended_we_port_set','extended_we_gd_set'):
            return '13'
        #raise ValueError(f'The character set: {char_set} is not supported')
    elif channel_toggle == 1:
        if char_set == 'basic_na_set':
            return '-1'
        elif char_set == 'special_na_set':
            return '19'
        elif char_set in ('extended_we_sm_set','extended_we_french_set'):
            return '1a'
        elif char_set in ('extended_we_port_set','extended_we_gd_set'):
            return '1b'
        #raise ValueError(f'The character set: {char_set} is not supported')
    else:
        raise ValueError(f'Channel toggle must be 0 or 1!')


def create_byte_pair(caption_string: str, channel_toggle: int) -> list:
    """Generates a list of byte pairs given a caption string

    :param caption_string, channel_toggle:
    :return: list of byte pairs
    """
    byte_list = []
    for letter in caption_string:
        set_flag = which_char_set(letter)
        first_byte = which_channel(channel_toggle,set_flag)
        if first_byte != '-1':
            first_hex_value = int(first_byte,16)
            if check_parity(first_hex_value) == 0:
                first_hex_value = add_parity_to_byte(first_hex_value)
            byte_list.append(hex(first_hex_value))
        character_hex_value = char_sets[set_flag][letter]
        if check_parity(character_hex_value) == 0:
            character_hex_value = add_parity_to_byte(character_hex_value)
        byte_list.append(hex(character_hex_value))
    raw_hex_values = parse_raw_hex_values(byte_list)
    byte_pairs = bytes_to_byte_pairs(raw_hex_values)
    return byte_pairs

