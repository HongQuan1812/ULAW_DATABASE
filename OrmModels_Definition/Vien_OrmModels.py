from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, Text, Float
)
from sqlalchemy.orm import relationship
from OrmModels_Definition.Common_OrmModels import BaoCao

# =====================================================
# BCSL - VIỆN LUẬT SO SÁNH (Comparative Law Institute)
# =====================================================
class BCVLSS(BaoCao):
    """
    Báo cáo Viện Luật So Sánh
    Specific report data for comparative law research institute
    """
    __tablename__ = "bcVLss"

    
    # === HOẠT ĐỘNG NGHIÊN CỨU KHOA HỌC (Research Activities) ===
    soLuongNckhLss = Column(
        Integer,
        nullable=True,
        comment="So luong hoat dong nghien cuu khoa hoc va cong nghe trong linh vuc Luat hoc so sanh"
    )

    soLuongNckhLnn = Column(
        Integer,
        nullable=True,
        comment="So luong hoat dong nghien cuu khoa hoc va cong nghe trong linh vuc Phap luat nuoc ngoai"
    )

    soLuongNckhKhac = Column(
        Integer,
        nullable=True,
        comment="So luong hoat dong nghien cuu khoa hoc va cong nghe trong cac linh vuc khac (Neu co)"
    )


# =====================================================
# BCSL - VIỆN SỞ HỮU TRÍ TUỆ, KHỞI NGHIỆP VÀ ĐỔI MỚI SÁNG TẠO
# =====================================================
class BCVSHTTKNDMST(BaoCao):
    """
    Báo cáo Viện Sở Hữu Trí Tuệ, Khởi Nghiệp và Đổi Mới Sáng Tạo
    Specific report data for Intellectual Property and Innovation Institute
    """
    __tablename__ = "bcVShttKnDmst"

    # === HOẠT ĐỘNG ĐÀO TẠO NGẮN HẠN (Short-term Training Activities) ===
    soLuongHdtvtkCtdtnh = Column(
        Integer,
        nullable=True,
        comment="So luong hoat dong tu van va thiet ke cac chuong trinh dao tao ngan han"
    )

    soLuongKdtnh = Column(
        Integer,
        nullable=True,
        comment="So luong cac khoa dao tao ngan han"
    )

    soLuongKth = Column(
        Integer,
        nullable=True,
        comment="So luong cac khoa tap huan"
    )

    tyLeHvtn = Column(
        Float,
        nullable=True,
        comment="Ty le hoc vien tham gia khoa hoc tot nghiep"
    )


# =====================================================
# BCSL - VIỆN ĐÀO TẠO QUỐC TẾ (International Training Institute)
# =====================================================
class BCVDTQT(BaoCao):
    """
    Báo cáo Viện Đào Tạo Quốc Tế
    Specific report data for International Training Institute
    """
    __tablename__ = "bcVDtqt"
    
    # === ĐÀO TẠO CHẤT LƯỢNG CAO (High-quality Training) ===
    soLuongSvClcTddhHtcq = Column(
        Integer,
        nullable=True,
        comment="So luong sinh vien cac lop chat luong cao trinh do dai hoc hinh thuc dao tao chinh quy"
    )
    
    soLuongToChucCtnkClc = Column(
        Integer,
        nullable=True,
        comment="So luong to chuc cac chuong trinh hoc ngoai khoa cho sinh vien chat luong cao"
    )

    soLuongToChucCttdTcClc = Column(
        Integer,
        nullable=True,
        comment="So luong to chuc cac chuong trinh trao doi tin chi co thu phi cho sinh vien chat luong cao"
    )

    soLuongToChucCtdtbdccqtClc = Column(
        Integer,
        nullable=True,
        comment="So luong to chuc cac chuong trinh dao tao boi duong chung chi quoc te cho sinh vien chat luong cao"
    )

    soLuongToChucCtttckClc = Column(
        Integer,
        nullable=True,
        comment="So luong to chuc cac chuong trinh thuc tap cuoi khoa cho sinh vien chat luong cao"
    )

    soLuongHdtvdhSauDhClc = Column(
        Integer,
        nullable=True,
        comment="So luong hoat dong tu van du hoc sau dai hoc cho sinh vien chat luong cao"
    )


# =====================================================
# BCSL - VIỆN ĐÀO TẠO VÀ BỒI DƯỠNG (Training and Development Institute)
# =====================================================
class BCVDTBD(BaoCao):
    """
    Báo cáo Viện Đào Tạo và Bồi Dưỡng
    Specific report data for Training and Development Institute
    """
    __tablename__ = "bcVDtbd"
    
    # === HOẠT ĐỘNG ĐÀO TẠO VÀ BỒI DƯỠNG (Training and Development Activities) ===
    soLuongKhnh = Column(
        Integer,
        nullable=True,
        comment="So luong khoa hoc ngan han"
    )
    
    soLuongNsddtbdHangNam = Column(
        Integer,
        nullable=True,
        comment="So luong nhan su duoc dao tao, boi duong hang nam"
    )
    
    soLuongCqDnTcddtbd = Column(
        Integer,
        nullable=True,
        comment="So luong co quan, doanh nghiep, to chuc duoc dao tao, boi duong, tap huan, nang cao kien thuc phap luat, ky nang hanh chinh, ky nang chuyen mon nghiep vu"
    )

    soLuongCaNhanddtbd = Column(
        Integer,
        nullable=True,
        comment="So luong ca nhan duoc dao tao, boi duong, tap huan, nang cao kien thuc phap luat, ky nang hanh chinh, ky nang chuyen mon nghiep vu"
    )

    soLuongNhuCauddtbdNn = Column(
        Integer,
        nullable=True,
        comment="So luong nhu cau duoc dao tao, boi duong ngoai ngu"
    )
    
    soLuongNhuCauddtbdNnpl = Column(
        Integer,
        nullable=True,
        comment="So luong nhu cau duoc dao tao, boi duong ngoai ngu phap ly"
    )

    soLuongNhuCauddtbdTh = Column(
        Integer,
        nullable=True,
        comment="So luong nhu cau duoc dao tao, boi duong tin hoc"
    )

    soLuongCttcktnlNn = Column(
        Integer,
        nullable=True,
        comment="So luong cong tac to chuc kiem tra, thi, danh gia nang luc ngoai ngu"
    )

    soLuongCttcktnlTh = Column(
        Integer,
        nullable=True,
        comment="So luong cong tac to chuc kiem tra, thi, danh gia nang luc tin hoc"
    )