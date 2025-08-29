import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from sqlalchemy.pool import NullPool
import asyncio
from Helper.load_file import load_env_file



class AsyncDatabaseSetup:
    def __init__(self, username, password, host, port, database, echo=True):
        """
        Initializes the AsyncDatabaseSetup class.
        """
        self.username = username
        self.password = password
        self.host = host
        self.port = port
        self.database = database
        self.echo = echo
        self.engine = None          # Async SQLAlchemy engine
        self.SessionLocal = None    # AsyncSession factory

    # =============================
    # Context Manager Hooks
    # =============================

    async def __aenter__(self):
        """
        Context manager entry.

        - Initializes the database connection (calls `self.init()`).
        - Returns the current instance (`self`) so it can be used as:
        - Instead of:
            db = AsyncDatabaseSetup(...)
            await db.init()
        - we just need:
            async with AsyncDatabaseSetup(...) as db:
                
        This ensures that the engine and session factory are properly 
        initialized before entering the context block.
        """
        await self.init()
        return self

    async def __aexit__(self, exc_type, exc, tb):
        """
        Context manager exit.

        - Cleans up resources when leaving the context block.
        - Disposes of the SQLAlchemy async engine, which closes all
          pooled connections.
        - Ensures no dangling connections remain after use.

        Args:
            exc_type: Exception type (if any was raised inside the block).
            exc: The exception instance (if raised).
            tb: Traceback object (if raised).
        """
        if self.engine is not None:
            await self.engine.dispose()
            print("🔒 Engine disposed")


    # =============================
    # Initialization
    # =============================
    async def init(self):
        if not await self._is_exists():
            await self._create_database_if_not_exists()
        await self._connect_to_database()

    async def _is_exists(self) -> bool:
        """
        Check if target database exists on the MySQL server.
        """
        try:
            server_engine = create_async_engine(
                f"mysql+aiomysql://{self.username}:{self.password}@{self.host}:{self.port}/",
                echo=False
            )
            async with server_engine.connect() as conn:
                result = await conn.execute(
                    text("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = :db_name"),
                    {"db_name": self.database}
                )
                row = result.fetchone()
                if not row:
                    print(f"❌ Database '{self.database}' does not exist on server {self.host}:{self.port}.")
                    return False
                else:
                    print(f"✅ Database '{self.database}' found on server {self.host}:{self.port}")
                    return True

        except OperationalError as e:
            raise ConnectionError(
                f"❌ Unable to connect to MySQL server at {self.host}:{self.port}. "
                f"Check connection parameters. Error: {str(e)}"
            )
        except SQLAlchemyError as e:
            raise ConnectionError(f"❌ Database connection error: {str(e)}")
        
        finally:
            # The _aexit_() method only disposes self.engine, not server_engine
            # We need dispose it manually
            if server_engine:
                await server_engine.dispose()
                print("🔒 Server Engine disposed")

    async def _create_database_if_not_exists(self):
        """
        Create database if it does not exist.
        """
        try:
            server_engine = create_async_engine(
                f"mysql+aiomysql://{self.username}:{self.password}@{self.host}:{self.port}/"
            )
            async with server_engine.begin() as conn:
                print(f"🔄 Creating Database {self.database} ...")
                await conn.execute(
                    text(
                        f"CREATE DATABASE IF NOT EXISTS {self.database} "
                        "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
                    )
                )
                print(f"✅ {self.database} created (or already exists)")

        except Exception as e:
            raise ConnectionError(f"❌ Failed to create database {self.database}: {e}")
        
        finally:
            # The _aexit_() method only disposes self.engine, not server_engine
            # We need dispose it manually
            if server_engine:
                await server_engine.dispose()
                print("🔒 Server Engine disposed")

    async def _connect_to_database(self):
        """
        Creates an async engine and session factory bound to the target database.
        """
        try:
            # Create async engine
            self.engine = create_async_engine(
                f"mysql+aiomysql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}",
                echo=self.echo,
                poolclass=NullPool,   # ✅ don’t keep idle conns here
            )

            # Test the connection
            async with self.engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            print(f"✅ Successfully connected to database '{self.database}'")

        except Exception as e:
            raise ConnectionError(f"❌ Failed to connect to database '{self.database}': {str(e)}")

        try:
            # Create session factory
            self.SessionLocal = sessionmaker(
                bind=self.engine,
                class_=AsyncSession,
                expire_on_commit=False,
                autoflush=False,
                autocommit=False
            )

            # Test session
            async with self.SessionLocal() as session:
                await session.execute(text("SELECT 1"))
                print(f"✅ Session test succeeded for database '{self.database}'")

        except Exception as e:
            print(f"❌ Failed to pass session test for database '{self.database}': {str(e)}")

    # =============================
    # Public API
    # =============================
    def get_engine(self):
        return self.engine

    def get_session(self) -> AsyncSession:
        """
        Create a new async session.
        Usage:
            async with db.get_session() as session:
                ...
        """
        return self.SessionLocal()



async def connect_to_db() -> AsyncDatabaseSetup:
    """
    Initialize an async database connection using environment variables.
    """
    env_path = os.path.join("..", "Database", ".env")
    load_env_file(env_path)

    print("🔄 Setting up async database connection...")

    required_vars = ["DB_USERNAME", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME"]
    missing = [var for var in required_vars if not os.getenv(var)]
    if missing:
        raise ValueError(f"❌ Missing required environment variables: {', '.join(missing)}")

    async with AsyncDatabaseSetup(
        username=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT")),
        database=os.getenv("DB_NAME"),
        echo=True
    ) as db:
        print("✅ Async database connection initialized successfully")

        return db



if __name__ == "__main__":
    asyncio.run(connect_to_db())
