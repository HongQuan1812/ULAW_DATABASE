from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
import uvicorn
from contextlib import asynccontextmanager


from API_Definition.Dependencies.Database_Dependencies import db_manager
from API_Definition.Khoa_API import bck_router
from API_Definition.Common_API import common_router
from sqlalchemy.exc import IntegrityError
from Helper.raise_standard_error import (
    request_validation_error_handler,
    integrity_error_handler, 
    value_error_handler, 
    generic_exception_handler
)

from Helper.load_file import load_env_file, load_secret, load_config_file



@asynccontextmanager
async def lifespan(app: FastAPI):
    # ---- Startup ----
    load_env_file(".env")
    load_secret("DB_USERNAME", "db_username.txt")
    load_secret("DB_PASSWORD", "db_password.txt")
    
    await db_manager.init()
    
    app.state.org_config = load_config_file("organization_config.json")
    app.state.common_config = load_config_file("common_config.json")
    

    
    yield  # control returns to FastAPI; app is now running
    
    # ---- Shutdown ----
    await db_manager.shutdown()



# ----------------------------------
# Create app with lifespan
# ----------------------------------
app = FastAPI(lifespan=lifespan)


# ----------------------------------
# Register routers
# ----------------------------------
app.include_router(common_router, prefix="/common", tags=["Common"])
app.include_router(bck_router, prefix="/khoa", tags=["Khoa"])


# ----------------------------------
# Register Global Exception Handlers
# ----------------------------------
app.add_exception_handler(RequestValidationError, request_validation_error_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(ValueError, value_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)




