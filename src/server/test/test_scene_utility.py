import unittest
import src.server.cea_608_encoder.scene_utility as utils
import src.server.cea_608_encoder.caption_string_utility as caption_utils


class TestSceneUtilities(unittest.TestCase):

    def test_create_bytes_for_scene_background_color_normal(self):
        color = "cyan"
        expected = ['1026']

        actual = caption_utils.create_bytes_for_scene_background_color(color,False)

        self.assertEqual(expected, actual)

    def test_create_bytes_for_scene_background_color_unsupported_color(self):
        color = "Purple"
        expected = ['97ad']

        actual = caption_utils.create_bytes_for_scene_background_color(color,False)

        self.assertEqual(expected, actual)

    def test_create_bytes_for_scene_background_color_transparent(self):
        color = "white"
        expected = ['10a1']

        actual = caption_utils.create_bytes_for_scene_background_color(color,True)

        self.assertEqual(expected, actual)

    def test_get_default_preamble_style_bytes(self):
        expected = [0x10, 0x40]

        actual = utils.get_default_preamble_style_bytes()

        self.assertEqual(expected, actual)

    def test_get_default_preamble_address_bytes(self):
        expected = [0x10, 0x50]

        actual = utils.get_default_preamble_address_bytes()

        self.assertEqual(expected, actual)

    def test_get_resume_caption_loading_bytes(self):
        expected = [0x14, 0x20]

        actual = utils.get_resume_caption_loading_bytes()

        self.assertEqual(expected, actual)

    def test_get_erase_non_displayed_memory_bytes(self):
        expected = [0x14, 0x2e]

        actual = utils.get_erase_non_displayed_memory_bytes()

        self.assertEqual(expected, actual)

    def test_get_end_of_caption_bytes(self):
        expected = [0x14, 0x2f]

        actual = utils.get_end_of_caption_bytes()

        self.assertEqual(expected, actual)

    def test_create_byte_pairs_for_control_command_get_end_of_caption(self):
        expected = ['942f']

        actual = utils.create_byte_pairs_for_control_command(utils.get_end_of_caption_bytes())

        self.assertEqual(expected, actual)


if __name__ == '__main__':
    unittest.main()

