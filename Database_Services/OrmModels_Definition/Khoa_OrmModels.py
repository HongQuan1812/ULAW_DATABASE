from sqlalchemy import (
    Column, Integer, String, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from OrmModels_Definition.Common_OrmModels import BaoCao, Base

# =====================================================
# BMBC - Bao cao cap Khoa (Faculty Level Reports)
# =====================================================
class BCK(BaoCao):
    """
    Bao cao cap Khoa (Faculty-level)
    Specific report data for Faculty-level BMBC reports
    """
    __tablename__ = "bcK"
    
    # === NHAN SU (Personnel) ===
    soLuongGvch = Column(
        Integer, 
        nullable=True, 
        comment="So luong giang vien co huu"
    )
    
    soLuongGvtg = Column(
        Integer, 
        nullable=True, 
        comment="So luong giang vien thinh giang"
    )
    
    soLuongNld = Column(
        Integer, 
        nullable=True, 
        comment="So luong nguoi lao dong"
    )
    
    # === CHUONG TRINH DAO TAO (Training Programs) ===
    tongSoBmk = Column(
        Integer, 
        nullable=True, 
        comment="Tong so bo mon cua Khoa"
    )
    
    tongSoMhk = Column(
        Integer, 
        nullable=True, 
        comment="Tong so mon hoc (hoc phan) cua Khoa"
    )
    
    fileDmmh = Column(
        String(500), 
        nullable=True, 
        comment="Cap nhat (upload) File danh muc mon hoc"
    )
    
    # === PHAT TRIEN CHUONG TRINH (Program Development) ===
    soCtdtCanCaiTien = Column(
        Integer, 
        nullable=True, 
        comment="Tong so Ctdt can cai tien"
    )
    
    soCtdtXayDungMoi = Column(
        Integer, 
        nullable=True, 
        comment="Tong so Ctdt xay dung moi"
    )
    
    # === TAI LIEU GIANG DAY (Teaching Materials) ===
    soTlgtCanChinhSua = Column(
        Integer, 
        nullable=True, 
        comment="Tong so tai lieu giao trinh can chinh sua"
    )
    
    soTlgtBienSoanMoi = Column(
        Integer, 
        nullable=True, 
        comment="Tong so tai lieu giao trinh bien soan moi"
    )
    
    # === PHAT TRIEN NHAN SU (Staff Development) ===
    soGvCanDtbd = Column(
        Integer, 
        nullable=True, 
        comment="So luong giang vien can dao tao, boi duong"
    )
    
    soGvCanTuyenMoi = Column(
        Integer, 
        nullable=True, 
        comment="So luong giang vien can tuyen moi"
    )

    # # --- Relationship ---
    # danhMucNganhList = relationship("FDANHMUCNGANH", back_populates="bcK",
    #                                 cascade="all, delete-orphan")



# REFERENCE TABLES - DANH MỤC NGÀNH (Majors / Fields of Study)
# =====================================================
class DANHMUCNGANH(Base):
    """
    Danh muc nganh (Majors / Fields of Study)
    Reference table for storing list of academic majors
    """
    __tablename__ = "danhMucNganh"

    idNganh = Column(
        Integer, 
        primary_key=True, 
        comment="Ma nganh"
    )

    tenNganh = Column(
        String(255), 
        nullable=False, 
        unique=True, 
        comment="Ten nganh (Major name)"
    )

    # # --- Relationship ---
    # bcKList = relationship("FDANHMUCNGANH", back_populates="danhMucNganh",
    #                        cascade="all, delete-orphan")


# REFERENCE TABLES - TRƯỜNG DỮ LIỆU VỀ DANH MỤC NGÀNH 
# =====================================================
class FDANHMUCNGANH(Base):
    """
    Số lượng hệ thống cơ sở dữ liệu dùng chung của Trường
    Quantity tracking for database systems
    """
    __tablename__ = "fDanhMucNganh"

    idBaoCao = Column(
        Integer,
        ForeignKey('bcK.idBaoCao'),
        primary_key=True,
        comment="Id Bao Cao"
    )

    idNganh = Column(
        Integer,
        ForeignKey('danhMucNganh.idNganh'),
        primary_key=True,
        comment="Ma nganh"
    )

    # # --- Relationships ---
    # bcK = relationship("BCK", back_populates="danhMucNganhList")
    # danhMucNganh = relationship("DANHMUCNGANH", back_populates="bcKList")