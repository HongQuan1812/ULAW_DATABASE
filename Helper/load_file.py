import os
import json
from dotenv import load_dotenv


def load_env_file(filename: str = ".env"):
    """
    Safely load environment variables from a .env file.

    Args:
        filename (str): The name of the .env file to load. Default = ".env".

    Behavior:
        - Looks for the file in the same directory as this script.
        - Falls back to default load_dotenv() (current working directory).
        - Prints diagnostic information for debugging.
    """
    try:
        # Directory of the current Python file
        base_dir = os.path.dirname(os.path.abspath(__file__))

        # Build path relative to this file
        dotenv_path = os.path.join(base_dir, filename)

        print("=" * 40)
        print(f"Looking for environment file: {dotenv_path}")
        print(f"File exists: {os.path.exists(dotenv_path)}")
        print(f"Is file: {os.path.isfile(dotenv_path)}")
        print("=" * 40)

        if os.path.isfile(dotenv_path):
            load_dotenv(dotenv_path=dotenv_path, override=False)
            print(f"✅ Environment file '{filename}' loaded successfully")
        else:
            print(f"⚠️ Environment file '{filename}' not found in script directory")
            print("👉 Falling back to default search (cwd)")
            load_dotenv(override=False)

    except Exception as e:
        print(f"❌ Error loading environment file: {e}")



def load_config_file(config_path="organization_config.json"):
    """
    Load organization configuration from a JSON file.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(base_dir, config_path)

    if not os.path.isfile(path):
        raise FileNotFoundError(f"❌ Config file not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        config = json.load(f)

    return config
