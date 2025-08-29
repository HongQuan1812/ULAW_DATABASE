from functools import lru_cache
from Helper.load_file import load_config_file, load_env_file

import copy

@lru_cache(maxsize=10)
def _load_config(file_path: str) -> dict:
    return load_config_file(file_path)

def get_config(file_path: str = "common_config.json") -> dict:
    return copy.deepcopy(_load_config(file_path))




@lru_cache(maxsize=5)
def _load_env(file_path: str = "../API_Definition/.env") -> None:
    """
    Cached loader for .env files.
    Ensures environment variables are loaded only once per file.
    """
    load_env_file(file_path)