from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, Date
)
from sqlalchemy.orm import declarative_base, relationship, declared_attr
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

# Import custom DatabaseSetup class (manages DB connection & creation)
from Database.Database_Setup import DatabaseSetup

# Base class for all ORM models
Base = declarative_base()

# =====================================================
# Table 1: Phân cấp tổ chức (Organization Levels)
# =====================================================
class ToChuc(Base):
    __tablename__ = "toChuc"

    idToChuc = Column(Integer, primary_key=True)
    capToChuc = Column(String(255), unique=True, nullable=False)

    # donViList = relationship("DonVi", back_populates="toChuc")


# =====================================================
# Table 2: Phân cấp đơn vị (Unit Levels)
# =====================================================
class DonVi(Base):
    __tablename__ = "donVi"

    idDonVi = Column(Integer, primary_key=True)
    capDonVi = Column(String(255), unique=True, nullable=False)

    idToChuc = Column(Integer, ForeignKey("toChuc.idToChuc"), nullable=False)

    # toChuc = relationship("ToChuc", back_populates="donViList")
    # nguoiBaoCaoList = relationship("NguoiBaoCao", back_populates="donVi")
    # baoCaoList = relationship("BaoCao", back_populates="donVi")


# =====================================================
# Table 3: Người báo cáo (Reporter Info)
# =====================================================
class NguoiBaoCao(Base):
    __tablename__ = "nguoiBaoCao"

    idNguoiBaoCao = Column(Integer, primary_key=True)
    hoVaTen = Column(String(255), nullable=False)
    chucVu = Column(Integer, nullable=False)
    emailTruong = Column(String(255), unique=True, nullable=False)

    idDonVi = Column(Integer, ForeignKey("donVi.idDonVi"), nullable=False)

    # donVi = relationship("DonVi", back_populates="nguoiBaoCaoList")
    # baoCaoList = relationship("BaoCao", back_populates="nguoiBaoCao")


# =====================================================
# Table 4: Giai đoạn báo cáo (Reporting Period)
# =====================================================
class GiaiDoanBaoCao(Base):
    __tablename__ = "giaiDoanBaoCao"

    idGiaiDoan = Column(Integer, primary_key=True)
    thoiDiemBatDau = Column(Date, nullable=False)
    thoiDiemKetThuc = Column(Date, nullable=False)

    # baoCaoList = relationship("BaoCao", back_populates="giaiDoan")


# =====================================================
# Table 5: Báo cáo (Reports)
# =====================================================
class BaoCao(Base):
    __abstract__ = True

    idBaoCao = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    idNguoiBaoCao = Column(Integer, ForeignKey("nguoiBaoCao.idNguoiBaoCao"), nullable=False)
    idDonVi = Column(Integer, ForeignKey("donVi.idDonVi"), nullable=False)
    idGiaiDoan = Column(Integer, ForeignKey("giaiDoanBaoCao.idGiaiDoan"), nullable=False)

    namBaoCao = Column(Integer, nullable=False)

    # # Use @declared_attr for relationships in abstract base classes
    # @declared_attr
    # def nguoiBaoCao(cls):
    #     return relationship("NguoiBaoCao", back_populates="baoCaoList")

    # @declared_attr
    # def donVi(cls):
    #     return relationship("DonVi", back_populates="baoCaoList")

    # @declared_attr
    # def giaiDoan(cls):
    #     return relationship("GiaiDoanBaoCao", back_populates="baoCaoList")