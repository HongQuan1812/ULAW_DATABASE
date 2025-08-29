from datetime import date, datetime
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
from Helper.create_enum import (
    create_donvi_enum, 
    create_giaidoan_enum,
    create_chucvu_enum
)

org_config_path = os.path.join("..", "OrmModels_Definition", "organization_config.json")
common_config_path = os.path.join("..", "OrmModels_Definition", "common_config.json")
DonViEnum = create_donvi_enum(org_config_path)
GdbcEnum = create_giaidoan_enum(common_config_path)
ChucVuEnum = create_chucvu_enum(common_config_path)


# ========================================
# Shared Base Config
# ========================================
class ConfiguredBase(BaseModel):
    class Config:
        from_attributes = True  # allows conversion from SQLAlchemy ORM
        use_enum_values = True  # 👈 this makes .dict() / .model_dump() return .value instead of Enum object


# ========================================
# Lookup / Read-Only Models
# ========================================
class ToChucRead(ConfiguredBase):
    idToChuc: int
    capToChuc: str


class DonViRead(ConfiguredBase):
    idDonVi: int
    capDonVi: str
    idToChuc: int


class GiaiDoanBaoCaoRead(ConfiguredBase):
    idGiaiDoan: int
    thoiDiemBatDau: date
    thoiDiemKetThuc: date



# ========================================
# Reporter Models (NguoiBaoCao)
# ========================================
class NguoiBaoCaoBase(ConfiguredBase):
    hoVaTen: str
    emailTruong: EmailStr
    chucVu: ChucVuEnum
    idDonVi: DonViEnum   # chosen from DonVi list


class NguoiBaoCaoCreate(NguoiBaoCaoBase):
    pass


class NguoiBaoCaoUpdate(ConfiguredBase):
    hoVaTen: Optional[str] = None
    emailTruong: Optional[EmailStr] = None
    chucVu: Optional[ChucVuEnum] = None
    idDonVi: Optional[DonViEnum] = None


# For returning
class NguoiBaoCaoRead(NguoiBaoCaoBase):
    idNguoiBaoCao: int

    


# ========================================
# Report Models (BaoCao)
# ========================================
class BaoCaoBase(ConfiguredBase):
    idNguoiBaoCao: int       # chosen from NguoiBaoCao list
    idDonVi: DonViEnum       # chosen from DonVi list
    idGiaiDoan: GdbcEnum     # chosen from GiaiDoanBaoCao list
    namBaoCao: int


class BaoCaoCreate(BaoCaoBase):
    pass


class BaoCaoUpdate(ConfiguredBase):
    idNguoiBaoCao: Optional[int] = None
    idDonVi: Optional[DonViEnum] = None
    idGiaiDoan: Optional[GdbcEnum] = None
    namBaoCao: Optional[int] = None


class BaoCaoRead(BaoCaoBase):
    idBaoCao: int
    timestamp: datetime




