# dependencies/khoa_validators.py

from fastapi import Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from OrmModels_Definition.Khoa_OrmModels import BCK
from Schemas_Definition.Khoa_Schemas import BCKCreate, BCKUpdate
from API_Definition.Dependencies.Database_Dependencies import db_manager


from Helper.raise_standard_error import validation_error

from datetime import datetime
from typing import Union


#----------------------------------
# Define Section
#----------------------------------
class BCKValidator:
    """
    Class-based validator for BCK reports (Faculty-level reports).
    """

    def __init__(self, db: AsyncSession = Depends(db_manager.get_db)):
        self.db = db

    # ------------------------------------General Rules------------------------------------------

    async def validate_exists(self, report_id: int) -> int:
        """Check if a BCK report exists."""
        bao_cao = await self.db.get(BCK, report_id)
        if not bao_cao:
            raise validation_error(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Faculty report with ID {report_id} not found",
            )
        return report_id
    


    # --------------------------------Business Rule Validation----------------------------------

    async def validate_business_rules(
            self, 
            bao_cao: Union[BCKCreate, BCKUpdate]
    ) -> Union[BCKCreate, BCKUpdate]:
        """
        Validate business logic specific to BCK reports.
        Also applies common BaoCao foreign key validation.
        """

        # 1) Report year cannot be more than current year
        current_year = datetime.now().year
        if bao_cao.namBaoCao > current_year:
            raise validation_error(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Report year cannot be more than current year (current year: {current_year})",
            )

        # 2) File path validation
        if bao_cao.fileDmmh and bao_cao.fileDmmh.strip() == "":
            raise validation_error(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File path cannot be empty string",
            )


        return bao_cao

    
    
#----------------------------------
# Setup Section
#----------------------------------
def get_bck_validator(db: AsyncSession = Depends(db_manager.get_db),) -> BCKValidator:
    """Factory function to create BCKValidator with its dependencies."""
    return BCKValidator(db=db)