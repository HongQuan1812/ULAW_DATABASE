# dependencies/common_validators.py

from fastapi import Depends, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from OrmModels_Definition.Common_OrmModels import NguoiBaoCao, DonVi, GiaiDoanBaoCao, ToChuc
from Schemas_Definition.Common_Schemas import (
    BaoCaoCreate, 
    BaoCaoUpdate,
    NguoiBaoCaoCreate, 
    NguoiBaoCaoUpdate,
    NguoiBaoCaoRead,
    ChucVuEnum
)
from Helper.raise_standard_error import validation_error
from API_Definition.Dependencies.Database_Dependencies import db_manager  # <- class-based DB manager

from typing import Union


#----------------------------------
# Define Section
#----------------------------------
class NguoiBaoCaoValidator:
    """Dependencies and validations for NguoiBaoCao."""

    def __init__(
        self,
        db: AsyncSession = Depends(db_manager.get_db),
        request: Request = None
    ):
        self.db = db
        self.config = request.app.state.common_config  # Access config from app state

    # ------------------------------------General Rules------------------------------------------

    async def validate_not_exists(self, nguoi_bao_cao: NguoiBaoCaoRead):
        existing = await self.db.get(NguoiBaoCao, nguoi_bao_cao.idNguoiBaoCao)
        if existing:
            raise validation_error(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Reporter with ID {existing.idNguoiBaoCao} already exists",
            )
        return nguoi_bao_cao

    async def validate_foreign_keys(
            self, 
            nguoi_bao_cao: Union[NguoiBaoCaoCreate, NguoiBaoCaoUpdate]
    ) -> Union[NguoiBaoCaoCreate, NguoiBaoCaoUpdate]:
        """Validate DonVi exists for the reporter."""

        don_vi = await self.db.get(DonVi, nguoi_bao_cao.idDonVi)
        if not don_vi:
            raise validation_error(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unit with ID {nguoi_bao_cao.idDonVi} does not exist"
            )
        return nguoi_bao_cao
    

    # --------------------------------Business Rule Validation----------------------------------
    
    async def validate_chucvu(
            self, 
            nguoi_bao_cao: Union[NguoiBaoCaoCreate, NguoiBaoCaoUpdate]
    ) -> Union[NguoiBaoCaoCreate, NguoiBaoCaoUpdate]:
        """Validate that chucVu belongs to the organizational unit of idDonVi."""

        chucvu_mapping = self.config.get("CapToChuc_ChucVu_Mapper", {})

        # 1️) Ensure DonVi exists
        don_vi = await self.db.get(DonVi, nguoi_bao_cao.idDonVi)
        if not don_vi:
            raise validation_error(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unit with ID {nguoi_bao_cao.idDonVi} does not exist"
            )

        # 2️) Ensure ToChuc exists
        to_chuc = await self.db.get(ToChuc, don_vi.idToChuc)
        if not to_chuc:
            raise validation_error(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Organization (ToChuc) for unit ID {nguoi_bao_cao.idDonVi} not found"
            )

        # 3) Convert allowed_positions from str -> IntEnum.value
        allowed_names = chucvu_mapping.get(to_chuc.capToChuc.lower(), [])
        allowed_values = []
        for name in allowed_names:
            try:
                allowed_values.append(ChucVuEnum[name].value)
            except KeyError:
                # If config contains invalid enum name
                continue  

        # 4️) Validate
        if nguoi_bao_cao.chucVu not in allowed_values:
            raise validation_error(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Position '{nguoi_bao_cao.chucVu}' is not allowed for organization '{to_chuc.capToChuc}'. "
                    f"Allowed: {', '.join(map(str, allowed_values)) if allowed_values else 'None'}"
                )
            )

        return nguoi_bao_cao



class BaoCaoValidator:
    """Dependencies and validations for any BaoCao subtype."""

    def __init__(self, db: AsyncSession = Depends(db_manager.get_db)):
        self.db = db

    # ------------------------------------General Rules------------------------------------------

    async def validate_foreign_keys(
            self, 
            bao_cao: Union[BaoCaoCreate, BaoCaoUpdate]
    ) -> Union[BaoCaoCreate, BaoCaoUpdate]:
        """Validate foreign key references: NguoiBaoCao, DonVi, GiaiDoanBaoCao."""
        
        # Validate reporter exists
        nguoi_bao_cao = await self.db.get(NguoiBaoCao, bao_cao.idNguoiBaoCao)
        if not nguoi_bao_cao:
            raise validation_error(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Reporter with ID {bao_cao.idNguoiBaoCao} does not exist"
            )

        # Validate DonVi exists
        don_vi = await self.db.get(DonVi, bao_cao.idDonVi)
        if not don_vi:
            raise validation_error(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unit with ID {bao_cao.idDonVi} does not exist"
            )

        # Validate GiaiDoan exists
        giai_doan = await self.db.get(GiaiDoanBaoCao, bao_cao.idGiaiDoan)
        if not giai_doan:
            raise validation_error(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Reporting period with ID {bao_cao.idGiaiDoan} does not exist"
            )

        # Validate reporter belongs to unit
        if nguoi_bao_cao.idDonVi != bao_cao.idDonVi:
            raise validation_error(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Reporter {bao_cao.idNguoiBaoCao} does not belong to unit {bao_cao.idDonVi}"
            )

        return bao_cao


#----------------------------------
# Setup Section
#----------------------------------
def get_nguoi_baocao_validator(
    db: AsyncSession = Depends(db_manager.get_db),
    request: Request = None
) -> NguoiBaoCaoValidator:
    """Factory function to create NguoiBaoCaoValidator."""
    return NguoiBaoCaoValidator(db=db, request=request)

def get_baocao_validator(db: AsyncSession = Depends(db_manager.get_db)) -> BaoCaoValidator:
    """Factory function to create BaoCaoValidator."""
    return BaoCaoValidator(db=db)