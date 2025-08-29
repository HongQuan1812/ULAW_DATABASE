# dependencies/database_dependencies.py

from sqlalchemy.ext.asyncio import AsyncSession
from Database.Async_Database_Setup import AsyncDatabaseSetup
from Helper.cache import _load_env
import os


class DatabaseManager:
    """
    Manages global database connection, session, and lifecycle.
    """

    def __init__(self):
        self.db_instance: AsyncDatabaseSetup | None = None

    async def init(self, env_path: str = "../API_Definition/.env"):
        
        # Load environment variables
        _load_env(env_path)

        required_vars = ["DB_USERNAME", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME"]
        missing = [var for var in required_vars if not os.getenv(var)]
        if missing:
            raise ValueError(f"❌ Missing required environment variables: {', '.join(missing)}")

        # Initialize AsyncDatabaseSetup
        self.db_instance = AsyncDatabaseSetup(
            username=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=int(os.getenv("DB_PORT")),
            database=os.getenv("DB_NAME"),
            echo=True
        )

        await self.db_instance.init()
        print("✅ DatabaseManager initialized")

    async def shutdown(self):
        """
        Dispose the engine. Call at FastAPI shutdown.
        """
        if self.db_instance and self.db_instance.engine:
            await self.db_instance.engine.dispose()
            print("🔒 DatabaseManager disposed")

    async def get_db(self) -> AsyncSession:
        """
        Dependency to get a database session.
        Usage: db: AsyncSession = Depends(db_manager.get_db)
        """
        if self.db_instance is None:
            raise RuntimeError("❌ Database not initialized. Call init() first.")

        async with self.db_instance.get_session() as session:
            try:
                yield session
            except Exception as e:
                await session.rollback()
                raise e
            finally: 
                await session.close()
                print("🔒 Session closed")


# =====================================================
# Usage: Create a global instance
# =====================================================
db_manager = DatabaseManager()
