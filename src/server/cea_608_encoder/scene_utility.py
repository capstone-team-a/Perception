def create_bytes_for_scene_background_color(color: str):
    pass


def create_bytes_for_scene_position(position):
    pass


def create_bytes_for_scene_opacity(opacity):
    pass


def validate_time_formatting(time):
    pass


def get_default_preamble_style_bytes() -> tuple:
    return 0x10, 0x40


def get_resume_caption_loading_bytes() -> tuple:
    return 0x14, 0x20


def get_erase_non_displayed_memory_bytes() -> tuple:
    return 0x14, 0x2e


def get_end_of_caption_bytes() -> tuple:
    return 0x14, 0x2F
