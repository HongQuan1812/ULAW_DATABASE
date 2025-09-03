import os
from typing import Optional, List
from pydantic import Field
from Schemas_Definition.Common_Schemas import (
    BaoCaoBase, 
    BaoCaoCreate,
    BaoCaoUpdate,
    BaoCaoRead,
    ConfiguredBase
)
from OrmModels_Definition.Khoa_OrmModels import (
    BCK, 
    DANHMUCNGANH, 
    FDANHMUCNGANH  
)
from Schemas_Definition import DanhMucNganhEnum





# =====================================================
# Reference Tables Schemas (for BCK)
# =====================================================

# --- DANHMUCNGANH (Majors / Fields of Study) ---
class DanhMucNganhBase(ConfiguredBase):
    idNganh: int
    tenNganh: str


# --- FDANHMUCNGANH (Mapping Table: BCK <-> DANHMUCNGANH) ---
class FDanhMucNganhBase(ConfiguredBase):
    idBaoCao: int
    idNganh: int


# =====================================================
# BCK Base (common + specific fields)
# =====================================================
class BCKBase(BaoCaoBase):
    # --- Specific fields ---
    soLuongGvch: Optional[int] = Field(None, ge=0)
    soLuongGvtg: Optional[int] = Field(None, ge=0)
    soLuongNld: Optional[int] = Field(None, ge=0)

    danhMucNganh: Optional[List[DanhMucNganhEnum]] = []
    tongSoBmk: Optional[int] = Field(None, ge=0)
    tongSoMhk: Optional[int] = Field(None, ge=0)
    fileDmmh: Optional[str] = None

    soCtdtCanCaiTien: Optional[int] = Field(None, ge=0)
    soCtdtXayDungMoi: Optional[int] = Field(None, ge=0)

    soTlgtCanChinhSua: Optional[int] = Field(None, ge=0)
    soTlgtBienSoanMoi: Optional[int] = Field(None, ge=0)

    soGvCanDtbd: Optional[int] = Field(None, ge=0)
    soGvCanTuyenMoi: Optional[int] = Field(None, ge=0)


class BCKCreate(BaoCaoCreate, BCKBase):
    pass


class BCKUpdate(BaoCaoUpdate, BCKBase):
    pass


class BCKRead(BaoCaoRead, BCKBase):
    danhMucNganh: Optional[List[DanhMucNganhBase]] = []


