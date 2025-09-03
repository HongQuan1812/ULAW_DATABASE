from typing import Optional
from Schemas_Definition.Common_Schemas import (
    BaoCaoBase,
    BaoCaoCreate,
    BaoCaoUpdate,
    BaoCaoRead
)

# =====================================================
# BCVLSS - Viện Luật So Sánh
# =====================================================
class BCVLSSBase(BaoCaoBase):
    soLuongNckhLss: Optional[int] = None
    soLuongNckhLnn: Optional[int] = None
    soLuongNckhKhac: Optional[int] = None


class BCVLSSCreate(BaoCaoCreate, BCVLSSBase):
    pass


class BCVLSSUpdate(BaoCaoUpdate, BCVLSSBase):
    pass


class BCVLSSRead(BaoCaoRead, BCVLSSBase):
    pass


# =====================================================
# BCVSHTTKNDMST - Viện Sở hữu trí tuệ, Khởi nghiệp và Đổi mới sáng tạo
# =====================================================
class BCVSHTTKNDMSTBase(BaoCaoBase):
    soLuongHdtvtkCtdtnh: Optional[int] = None
    soLuongKdtnh: Optional[int] = None
    soLuongKth: Optional[int] = None
    tyLeHvtn: Optional[float] = None


class BCVSHTTKNDMSTCreate(BaoCaoCreate, BCVSHTTKNDMSTBase):
    pass


class BCVSHTTKNDMSTUpdate(BaoCaoUpdate, BCVSHTTKNDMSTBase):
    pass


class BCVSHTTKNDMSTRead(BaoCaoRead, BCVSHTTKNDMSTBase):
    pass


# =====================================================
# BCVDTQT - Viện Đào tạo Quốc tế
# =====================================================
class BCVDTQTBase(BaoCaoBase):
    soLuongSvClcTddhHtcq: Optional[int] = None
    soLuongToChucCtnkClc: Optional[int] = None
    soLuongToChucCttdTcClc: Optional[int] = None
    soLuongToChucCtdtbdccqtClc: Optional[int] = None
    soLuongToChucCtttckClc: Optional[int] = None
    soLuongHdtvdhSauDhClc: Optional[int] = None


class BCVDTQTCreate(BaoCaoCreate, BCVDTQTBase):
    pass


class BCVDTQTUpdate(BaoCaoUpdate, BCVDTQTBase):
    pass


class BCVDTQTRead(BaoCaoRead, BCVDTQTBase):
    pass


# =====================================================
# BCVDTBD - Viện Đào tạo và Bồi dưỡng
# =====================================================
class BCVDTBDBase(BaoCaoBase):
    soLuongKhnh: Optional[int] = None
    soLuongNsddtbdHangNam: Optional[int] = None
    soLuongCqDnTcddtbd: Optional[int] = None
    soLuongCaNhanddtbd: Optional[int] = None
    soLuongNhuCauddtbdNn: Optional[int] = None
    soLuongNhuCauddtbdNnpl: Optional[int] = None
    soLuongNhuCauddtbdTh: Optional[int] = None
    soLuongCttcktnlNn: Optional[int] = None
    soLuongCttcktnlTh: Optional[int] = None


class BCVDTBDCreate(BaoCaoCreate, BCVDTBDBase):
    pass


class BCVDTBDUpdate(BaoCaoUpdate, BCVDTBDBase):
    pass


class BCVDTBDRead(BaoCaoRead, BCVDTBDBase):
    pass
