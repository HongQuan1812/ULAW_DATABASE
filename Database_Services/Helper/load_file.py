import os
import json
from dotenv import load_dotenv



def load_secret(var_name: str, filename: str):
    """
    Safely load a secret value from a file and set it as an environment variable.

    Args:
        var_name (str): The environment variable name to set (e.g., "DB_PASSWORD").
        filename (str): The secret file name (e.g., "db_password.txt").

    Behavior:
        - Looks for the secret file under ../Secrets relative to this script.
        - Reads the file content, strips whitespace, and sets it as an env var.
        - Does not overwrite the env var if it's already set.
        - Prints diagnostic information for debugging.
    """
    try:
        # Directory of the current Python file
        base_dir = os.path.dirname(os.path.abspath(__file__))

        # Path to secrets folder (parallel to Config)
        secret_path = os.path.join(base_dir, "..", "Secrets", filename)

        print("=" * 40)
        print(f"Looking for secret file: {secret_path}")
        print(f"File exists: {os.path.exists(secret_path)}")
        print(f"Is file: {os.path.isfile(secret_path)}")
        print("=" * 40)

        if os.path.isfile(secret_path):
            if not os.getenv(var_name):  # only set if not already defined
                with open(secret_path, "r", encoding="utf-8") as f:
                    secret_value = f.read().strip()
                    os.environ[var_name] = secret_value
                    print(f"✅ Secret for '{var_name}' loaded from '{filename}'")
            else:
                print(f"ℹ️ Environment variable '{var_name}' already set, skipping file load")
        else:
            print(f"⚠️ Secret file '{filename}' not found in ../Secrets")

    except Exception as e:
        print(f"❌ Error loading secret '{var_name}': {e}")




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
        
        # path to .env under Docker_Config/Database_Services
        dotenv_path = os.path.join(base_dir, "..", "Config", filename)

        print("=" * 40)
        print(f"Looking for environment file: {dotenv_path}")
        print(f"File exists: {os.path.exists(dotenv_path)}")
        print(f"Is file: {os.path.isfile(dotenv_path)}")
        print("=" * 40)

        if os.path.isfile(dotenv_path):
            success = load_dotenv(dotenv_path=dotenv_path, override=False)
            if success:
                print(f"✅ Environment file '{filename}' loaded successfully")
            else:
                print(f"⚠️ Environment file '{filename}' found but could not be loaded")
        else:
            print(f"⚠️ Environment file '{filename}' not found in script directory")
            print("👉 Assuming variables are already set (Docker mode)")
            
    except Exception as e:
        print(f"❌ Error loading environment file: {e}")



def load_config_file(filename="organization_config.json"):
    """
    Load configuration from a JSON file.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    path = os.path.join(base_dir, "..", "Config", filename)

    if not os.path.isfile(path):
        raise FileNotFoundError(f"❌ Config file not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        config = json.load(f)

    return config
