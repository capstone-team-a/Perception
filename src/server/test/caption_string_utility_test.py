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


if __name__ == '__main__':
    unittest.main()
