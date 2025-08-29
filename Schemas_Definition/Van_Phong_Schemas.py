from typing import Optional
from Schemas_Definition.Common_Schemas import (
    BaoCaoBase,
    BaoCaoCreate,
    BaoCaoUpdate,
    BaoCaoRead
)

# =====================================================
# BCVPDUHDTCD Base (common + specific fields)
# =====================================================
class BCVPDUHDTCDBase(BaoCaoBase):
    # --- Công tác Đảng - Hồ sơ phát triển ---
    soLuongHsptd: Optional[int] = None
    soLuongHscdct: Optional[int] = None

    # --- Hồ sơ khen thưởng và kỷ luật ---
    soLuongHskt: Optional[int] = None
    soLuongHskl: Optional[int] = None

    # --- Thành phần đảng viên ---
    soLuongDvct: Optional[int] = None
    soLuongDvdb: Optional[int] = None
    soLuongDvvpkl: Optional[int] = None

    # --- Văn thư lưu trữ ---
    soLuongVtltCtd: Optional[int] = None
    soLuongVtltCtcd: Optional[int] = None
    soLuongVtltKhac: Optional[int] = None


class BCVPDUHDTCDCreate(BaoCaoCreate, BCVPDUHDTCDBase):
    pass


class BCVPDUHDTCDUpdate(BaoCaoUpdate, BCVPDUHDTCDBase):
    pass


class BCVPDUHDTCDRead(BaoCaoRead, BCVPDUHDTCDBase):
    pass
