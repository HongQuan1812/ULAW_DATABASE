from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError, SQLAlchemyError

import os
from Helper.load_file import load_env_file, load_secret



class DatabaseSetup:
    def __init__(self, username, password, host, port, database, echo=True):
        """
        Initializes the DatabaseSetup class.

        Args:
            username (str): MySQL username
            password (str): MySQL password
            host (str): Database server hostname or IP
            port (int): Database server port (default for MySQL = 3306)
            database (str): Database name
            echo (bool): If True, SQLAlchemy will log all SQL statements
        """
        self.username = username
        self.password = password
        self.host = host
        self.port = port
        self.database = database
        self.echo = echo
        self.engine = None          # SQLAlchemy engine (connection to DB)
        self.SessionLocal = None    # Session factory for creating sessions

        # Ensure database exists, then connect
        if not self._is_exists():
            self._create_database_if_not_exists()
        self._connect_to_database()
    
    def _is_exists(self):
        """
        Connects to the MySQL server and checks if the target database exists.
        Raises an exception if the database is not found.
        
        Raises:
            DatabaseNotFoundError: If the specified database does not exist
            ConnectionError: If unable to connect to MySQL server
        """
        try:
            # Connect to MySQL server (without selecting a specific database)
            server_engine = create_engine(
                f"mysql+pymysql://{self.username}:{self.password}@{self.host}:{self.port}/",
                echo=False  # Don't echo for this check
            )
            
            with server_engine.connect() as conn:
                # Check if database exists
                result = conn.execute(
                    text("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = :db_name"),
                    {"db_name": self.database}
                )
                
                if not result.fetchone():
                    print(f"❌ Database '{self.database}' does not exist on server {self.host}:{self.port}. ")
                    return False
                else:
                    print(f"✅ Database '{self.database}' found on server {self.host}:{self.port}")
                    return True

        except OperationalError as e:
            raise ConnectionError(
                f"❌ Unable to connect to MySQL server at {self.host}:{self.port}. "
                f"Please check your connection parameters. Error: {str(e)}"
            )
        except SQLAlchemyError as e:
            raise ConnectionError(f"❌ Database connection error: {str(e)}")
        
    def _create_database_if_not_exists(self):
        """
        Connects to the MySQL *server* (without selecting a database yet)
        and creates the target database if it does not already exist.
        """
        try:
            server_engine = create_engine(
                f"mysql+pymysql://{self.username}:{self.password}@{self.host}:{self.port}/"
            )
            with server_engine.connect() as conn:
                # Run raw SQL to create the database with utf8mb4 encoding

                print(f"🔄 Creating Database {self.database} ...")
                conn.execute(
                    text(
                        f"CREATE DATABASE IF NOT EXISTS {self.database} "
                        "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
                    )
                )
                print(f"✅ {self.database} is created")
            
        except OperationalError as e:
            raise ConnectionError(
                f"❌ Unable to connect to MySQL server at {self.host}:{self.port}. "
                f"Please check your connection parameters. Error: {str(e)}"
            )
        except SQLAlchemyError as e:
            raise ConnectionError(f"❌ Database connection error: {str(e)}")
          
    def _connect_to_database(self):
        """
        Creates a SQLAlchemy engine connected to the specific database,
        and prepares a session factory for ORM interactions.
        """
        try:
            # Create engine (connection factory)
            self.engine = create_engine(
                f"mysql+pymysql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}",
                echo=self.echo
            )

            # Test the engine connection (raw connection)
            with self.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print(f"✅ Successfully connected to database '{self.database}'")

        except Exception as e:
            raise ConnectionError(f"❌ Failed to connect to database '{self.database}': {str(e)}")

        try:
            # Create session factory (sessionmaker is itself a factory)
            self.SessionLocal = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self.engine
            )

            # Use context manager for session test
            with self.SessionLocal() as session:
                session.execute(text("SELECT 1"))  # lightweight test query
                print(f"✅ Session test succeeded for database '{self.database}'")

        except Exception as e:
            print(f"❌ Failed to pass session test for database '{self.database}': {str(e)}")

    def get_engine(self):
        """
        Returns the SQLAlchemy engine (useful for running raw queries).
        """
        return self.engine

    def get_session(self):
        """
        Creates and returns a new Session object.
        You should close the session after using it.
        """
        return self.SessionLocal()
    


def connect_to_db()-> DatabaseSetup:
    """
    Establish a database connection using environment variables.
    
    Requires a .env file with:
        DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME

    Returns:
        DatabaseSetup instance if successful.

    Raises:
        ValueError if required environment variables are missing or invalid.
    """
    # Load environment file (safe loader)
    env_filename = ".env"
    load_env_file(env_filename)
    load_secret("DB_USERNAME", "db_username.txt")
    load_secret("DB_PASSWORD", "db_password.txt")
    

    print("🔄 Setting up database connection...")

    # Required environment variables
    required_vars = ["DB_USERNAME", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME"]

    # Check for missing values
    missing = [var for var in required_vars if not os.getenv(var)]
    if missing:
        raise ValueError(f"❌ Missing required environment variables: {', '.join(missing)}")

    try:
        db = DatabaseSetup(
            username=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT")),  # convert safely
            database=os.getenv("DB_NAME"),
            echo=True
        )
        print("✅ Database connection initialized successfully")
        return db

    except ValueError as ve:
        raise ValueError(f"❌ Invalid value in environment variables: {ve}") from ve
    except Exception as e:
        raise RuntimeError(f"❌ Failed to initialize database connection: {e}") from e


if __name__ == "__main__":    
    db = connect_to_db()


    
