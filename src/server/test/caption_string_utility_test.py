import unittest

import src.server.cea_608_encoder.caption_string_utility as utils


class TestCaptionStringUtilities(unittest.TestCase):

    def test_check_parity_for_integer_with_odd_parity(self):
        integer = 0x1
        expected_parity = -1

        actual_parity = utils.check_parity(integer)

        self.assertEqual(expected_parity, actual_parity)

    def test_check_parity_for_integer_with_even_parity(self):
        integer = 0x3
        expected_parity = 0

        actual_parity = utils.check_parity(integer)

        self.assertEqual(expected_parity, actual_parity)

    def test_adding_parity_bit_to_byte(self):
        integer = 0x1
        expected = 0x81

        actual = utils.add_parity_to_byte(integer)

        self.assertEqual(expected, actual)

    def test_parsing_raw_hex_values(self):
        list_of_hex_values = ['0x11', '0x22']
        expected = ['11', '22']

        actual = utils.parse_raw_hex_values(list_of_hex_values)

        self.assertEqual(expected, actual)

    def test_bytes_to_byte_pairs_with_valid_byte_list(self):
        bytes_list = ['a5', 'b4']
        expected = ['a5b4']

        actual = utils.bytes_to_byte_pairs(bytes_list)

        self.assertEqual(expected, actual)

    def test_bytes_to_byte_pairs_with_invalid_byte_list(self):
        bytes_list = ['a5', 'b4', 'c6']

        self.assertRaises(ValueError, utils.bytes_to_byte_pairs, bytes_list)

    def test_get_char_set_with_valid_caption_character(self):
        valid_character_sets_and_chars = {'basic_na_set': '@',
                                          'special_na_set': '♪',
                                          'extended_we_sm_set': 'Á',
                                          'extended_we_french_set': 'À',
                                          'extended_we_port_set': 'Ã',
                                          'extended_we_gd_set': 'Ä'}

        for expected_character_set, sample_char in valid_character_sets_and_chars.items():
            actual_character_set = utils.get_char_set(sample_char)
            self.assertEqual(expected_character_set, actual_character_set)

    def test_get_char_set_with_invalid_caption_character(self):
        unsupported_character = '👎'

        self.assertRaises(ValueError, utils.get_char_set, unsupported_character)

    def test_get_special_characters_first_byte_with_valid_char_set(self):
        valid_special_character_sets_and_first_bytes = {'special_na_set': 0x11,
                                                'extended_we_sm_set': 0x12,
                                                'extended_we_french_set': 0x12,
                                                'extended_we_port_set': 0x13,
                                                'extended_we_gd_set': 0x13}

        for special_char_set, expected_first_byte in valid_special_character_sets_and_first_bytes.items():
            actual_first_byte = utils.get_special_characters_first_byte(special_char_set)
            self.assertEqual(expected_first_byte, actual_first_byte)


if __name__ == '__main__':
    unittest.main()
