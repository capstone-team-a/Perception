from src.server.character_sets.basic_na_char_set import basic_north_american_char_set


BYTE_PARITY_MASK = 0x80


def get_bit_count(integer: int) -> int:
    """Get the number of bits in an integer

    :param integer:
    :return: -1 for odd numbers of bits, 0 for even number
    """
    count = 0
    while integer:
        integer &= integer -1
        count += 1
    return count


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


def create_byte_pairs(caption_string: str) -> list:
    byte_list = []
    for letter in caption_string:
        if letter in basic_north_american_char_set:
            character_hex_value = basic_north_american_char_set[letter]
            if get_bit_count(character_hex_value) & 1 != -1:
                masked_hex_value = add_parity_to_byte(character_hex_value)
                byte_list.append(hex(masked_hex_value))
    raw_hex_values = parse_raw_hex_values(byte_list)
    byte_pairs = bytes_to_byte_pairs(raw_hex_values)
    print(byte_pairs)
    return byte_pairs


caption = 'HUCKLEBERRY FINNEGAN!!!!!@@@@'

create_byte_pairs(caption)
