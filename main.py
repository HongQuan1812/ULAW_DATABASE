from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
import uvicorn


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


app = FastAPI()

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


#----------------------------------
# Startup & shutdown events
#----------------------------------
@app.on_event("startup")
async def startup_event():
    await db_manager.init()

@app.on_event("shutdown")
async def shutdown_event():
    await db_manager.shutdown()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)