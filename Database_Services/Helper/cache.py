from functools import lru_cache
import copy
from Helper.load_file import load_config_file, load_env_file


@lru_cache(maxsize=10)
def _load_config(filename: str) -> dict:
    """
    Internal cached loader for JSON/YAML configuration files.

    Args:
        filename (str): Path to the configuration file.

    Returns:
        dict: Parsed configuration data.

    Notes:
        - Uses an LRU cache (max size 10) to avoid re-reading files unnecessarily.
        - Intended for internal use. Use `get_config()` for safe retrieval.
    """
    return load_config_file(filename)



@lru_cache(maxsize=5)
def _load_env(filename: str = ".env") -> None:
    """
    Internal cached loader for environment variable files.

    Args:
        filename (str, optional): Path to the .env file.
                                  Defaults to ".env".

    Returns:
        None

    Notes:
        - Ensures environment variables are loaded only once per file.
        - Uses an LRU cache (max size 5).
        - Call this function before accessing os.environ values that
          depend on the specified .env file.
    """
    load_env_file(filename)
