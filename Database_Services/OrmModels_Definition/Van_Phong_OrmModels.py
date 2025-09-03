from sqlalchemy import (
    Column, Integer, ForeignKey
)
from sqlalchemy.orm import relationship
from OrmModels_Definition.Common_OrmModels import BaoCao

# =====================================================
# BCSL - VĂN PHÒNG ĐẢNG ỦY - HỘI ĐỒNG TRƯỜNG - CÔNG ĐOÀN
# =====================================================
class BCVPDUHDTCD(BaoCao):
    """
    Báo cáo Văn Phòng Đảng Ủy - Hội Đồng Trường - Công Đoàn
    Specific report data for Party Office, School Council, and Trade Union reports
    """
    __tablename__ = "bcVpduHdtCd"
    
    # === CÔNG TÁC ĐẢNG - HỒ SƠ PHÁT TRIỂN (Party Development Records) ===
    soLuongHsptd = Column(
        Integer,
        nullable=True,
        comment="So luong ho so phat trien Dang"
    )
    
    soLuongHscdct = Column(
        Integer,
        nullable=True,
        comment="So luong ho so chuyen Dang chinh thuc"
    )
    
    # === HỒ SƠ KHEN THƯỞNG VÀ KỶ LUẬT (Rewards and Discipline Records) ===
    soLuongHskt = Column(
        Integer,
        nullable=True,
        comment="So luong ho so khen thuong"
    )
    
    soLuongHskl = Column(
        Integer,
        nullable=True,
        comment="So luong ho so ky luat Dang vien"
    )
    
    # === THÀNH PHẦN ĐẢNG VIÊN (Party Member Composition) ===
    soLuongDvct = Column(
        Integer,
        nullable=True,
        comment="So luong Dang vien chinh thuc"
    )
    
    soLuongDvdb = Column(
        Integer,
        nullable=True,
        comment="So luong Dang vien du bi"
    )
    
    soLuongDvvpkl = Column(
        Integer,
        nullable=True,
        comment="So luong Dang vien vi pham ky luat"
    )
    
    # === VĂN THƯ LƯU TRỮ (Document Storage) ===
    soLuongVtltCtd = Column(
        Integer,
        nullable=True,
        comment="So luong van thu duoc luu tru lien quan den cong tac Dang"
    )
    
    soLuongVtltCtcd = Column(
        Integer,
        nullable=True,
        comment="So luong van thu duoc luu tru lien quan den cong tac Cong doan"
    )
    
    soLuongVtltKhac = Column(
        Integer,
        nullable=True,
        comment="So luong van thu khac (Neu co)"
    )
