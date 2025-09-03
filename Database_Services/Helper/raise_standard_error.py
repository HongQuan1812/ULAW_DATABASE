from fastapi import HTTPException, status, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from sqlalchemy.exc import IntegrityError



#----------------------------------
# Error at Schemas-Level
#----------------------------------

def validation_error(detail: str, status_code: int = status.HTTP_400_BAD_REQUEST) -> HTTPException:
    """
    Create a standardized validation HTTPException.
    Prefixes all validation errors with '❌ Validation Error:'.
    """
    return HTTPException(
        status_code=status_code, 
        detail={
            "detail": f"❌ Validation Error: Field Validation Error",
            "errors": [{"message": detail}]
        }
    )



#----------------------------------
# Error at System-Level
#----------------------------------

# if Pydantic raises ValidationError (Field validation), our app will call this function
async def request_validation_error_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "❌ Validation Error: Field Validation Error",
            "errors": exc.errors()  # Already a list of dictionaries
        }
    )

# if developers or Libraries raise IntegrityError, our app will call this function
async def integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400,
        content={
            "detail": "❌ Validation Error: Integrity Error",
            "errors": [{"message": str(exc)}]  # Wrap in array for consistency
        }
    )

# if developers or Libraries raise ValueError, our app will call this function
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={
            "detail": "❌ Validation Error: Value Error",
            "errors": [{"message": str(exc)}]  # Wrap in array for consistency
        }
    )

# if developers or Libraries raise Exception (not HTTPException), our app will call this function
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "❌ System Error",
            "errors": [{"message": str(exc)}]  # Wrap in array for consistency
        }
    )