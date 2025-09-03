from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, Text, Float, Enum
)
from sqlalchemy.orm import relationship
from OrmModels_Definition.Common_OrmModels import Base, BaoCao
import enum

# =====================================================
# BCSL - PHÒNG CÔNG TÁC SINH VIÊN (Student Affairs Office)
# =====================================================
class BCPCTSV(BaoCao):
    """
    Báo cáo Phòng Công Tác Sinh Viên
    Specific report data for Student Affairs Office
    """
    __tablename__ = "bcPCtsv"

    # === GIẤY TỜ XÁC NHẬN CHO SINH VIÊN (Student Documentation) ===
    soLuongGtxncnChoSvTdDh = Column(
        Integer,
        nullable=True,
        comment="So luong cac giay to xac nhan, chung nhan cho sinh vien trinh do dai hoc"
    )

    soLuongGtKhacChoSvTdDh = Column(
        Integer,
        nullable=True,
        comment="So luong cac giay to khac cho sinh vien trinh do dai hoc"
    )

    # === HỖ TRỢ VÀ KHEN THƯỞNG SINH VIÊN (Student Support and Awards) ===
    soLuongSvdkt = Column(
        Integer,
        nullable=True,
        comment="So luong sinh vien duoc khen thuong"
    )

    soLuongSvbkl = Column(
        Integer,
        nullable=True,
        comment="So luong sinh vien bi ky luat"
    )

    soLuongSvdchb = Column(
        Integer,
        nullable=True,
        comment="So luong sinh vien duoc cap hoc bong"
    )

    soLuongSvdmghp = Column(
        Integer,
        nullable=True,
        comment="So luong sinh vien duoc mien giam hoc phi"
    )

    soLuongSvdhtcpht = Column(
        Integer,
        nullable=True,
        comment="So luong sinh vien duoc ho tro chi phi hoc tap"
    )

    soLuongSvdtcxh = Column(
        Integer,
        nullable=True,
        comment="So luong sinh vien duoc tro cap xa hoi"
    )

    # === BÁO CÁO VÀ ĐƠN THƯ (Reports and Petitions) ===
    soLuongDonThuCuaSv = Column(
        Integer,
        nullable=True,
        comment="So luong don, thu cua sinh vien"
    )

    thongKeHangNamVeSvTheoQdcpl = Column(
        Integer,
        nullable=True,
        comment="Thong ke hang nam ve sinh vien theo quy dinh cua phap luat"
    )



# =====================================================
# BCSL - PHÒNG CƠ SỞ DỮ LIỆU VÀ CÔNG NGHỆ THÔNG TIN
# =====================================================
class BCPCSDLCNTT(BaoCao):
    """
    Báo cáo Phòng Cơ Sở Dữ Liệu và Công Nghệ Thông Tin
    Specific report data for Database and Information Technology Office
    """
    __tablename__ = "bcPCsdlCntt"

    # === MÁY CHỦ VÀ HẠ TẦNG (Servers and Infrastructure) ===
    soLuongMcvlTaiTruong = Column(
        Integer,
        nullable=True,
        comment="So luong may chu vat ly tai Truong"
    )

    soLuongMcaTaiTruong = Column(
        Integer,
        nullable=True,
        comment="So luong may chu ao tai Truong"
    )

    soLuongMccThue = Column(
        Integer,
        nullable=True,
        comment="So luong may chu Cloud (thue)"
    )

    # === ĐƯỜNG TRUYỀN VÀ MẠNG (Network and Connectivity) ===
    soLuongDtLeasedLine = Column(
        Integer,
        nullable=True,
        comment="So luong duong truyen Leased-line"
    )

    dungLuongDtInternetTrongNuoc = Column(
        Float,
        nullable=True,
        comment="Dung luong duong truyen internet trong nuoc (Mbps)"
    )

    dungLuongDtInternetQuocTe = Column(
        Float,
        nullable=True,
        comment="Dung luong duong truyen internet quoc te (Mbps)"
    )

    soLuongSwitchTang = Column(
        Integer,
        nullable=True,
        comment="So luong Switch tang"
    )

    soLuongThietBiWifi = Column(
        Integer,
        nullable=True,
        comment="So luong thiet bi wifi"
    )

    # === THIẾT BỊ VÀ PHẦN MỀM (Equipment and Software) ===
    soLuongThietBiCamera = Column(
        Integer,
        nullable=True,
        comment="So luong thiet bi Camera"
    )

    soLuongTddtThuocPvt = Column(
        Integer,
        nullable=True,
        comment="So luong tong dai dien thoai thuoc pham vi Truong"
    )

    soLuongTrangWeb = Column(
        Integer,
        nullable=True,
        comment="So luong trang web"
    )

    soLuongPhanMem = Column(
        Integer,
        nullable=True,
        comment="So luong phan mem"
    )

    # === THẺ TỪ VÀ KIỂM SOÁT RA VÀO (Magnetic Cards and Access Control) ===
    soLuongTtdcpChoSv = Column(
        Integer,
        nullable=True,
        comment="So luong the tu da cap phat cho sinh vien"
    )

    soLuongTtdcpChoNguoiHoc = Column(
        Integer,
        nullable=True,
        comment="So luong the tu da cap phat cho nguoi hoc"
    )

    soLuongTtdcpChoNld = Column(
        Integer,
        nullable=True,
        comment="So luong the tu da cap phat cho nguoi lao dong"
    )

    soLuongThietBiCuaTu = Column(
        Integer,
        nullable=True,
        comment="So luong thiet bi cua tu"
    )

    # === TỔNG HẠ TẦNG (General Infrastructure) ===
    soLuongHtCntt = Column(
        Integer,
        nullable=True,
        comment="So luong ha tang cong nghe thong tin"
    )

    # Relationships
    thongKeHtCsdlList = relationship(
        "THONGKEHTCSDL", 
        back_populates="bcPCsdlCntt",
        cascade="all, delete-orphan"
    )

    thongKeTuongLuaList = relationship(
        "THONGKETUONGLUA", 
        back_populates="bcPCsdlCntt",
        cascade="all, delete-orphan"  # Delete stats when system is deleted
    )

    thongKePmdvList = relationship(
        "THONGKEPMDV", 
        back_populates="bcPCsdlCntt",
        cascade="all, delete-orphan"  # Delete stats when system is deleted
    )

# REFERENCE TABLES - HỆ THỐNG CƠ SỞ DỮ LIỆU
# =====================================================
class THONGTINHTCSDL(Base):
    """
    Thông tin Hệ thống Cơ sở dữ liệu dùng chung của Trường
    Reference table for database systems information
    """
    __tablename__ = "thongTinHtCsdl"

    idHtCsdl = Column(
        Integer,
        primary_key=True,
        comment="Id He Thong CSDL"
    )

    tenHtCsdl = Column(
        String(255),
        nullable=False,
        comment="Ten He Thong CSDL"
    )

    # Relationships
    thongKeHtCsdlList = relationship(
        "THONGKEHTCSDL", 
        back_populates="thongTinHtCsdl",
        cascade="all, delete-orphan"  # Delete stats when system is deleted
    )

class THONGKEHTCSDL(Base):
    """
    Số lượng hệ thống cơ sở dữ liệu dùng chung của Trường
    Quantity tracking for database systems
    """
    __tablename__ = "thongKeHtCsdl"

    idBaoCao = Column(
        Integer,
        ForeignKey('bcPCsdlCntt.idBaoCao'),
        primary_key=True,
        comment="Id Bao Cao"
    )

    idHtCsdl = Column(
        Integer,
        ForeignKey('thongTinHtCsdl.idHtCsdl'),
        primary_key=True,
        comment="Id He Thong CSDL"
    )

    soLuong = Column(
        Integer,
        nullable=False,
        comment="So luong"
    )

    # Both relationships explicitly defined
    thongTinHtCsdl = relationship("THONGTINHTCSDL", back_populates="thongKeHtCsdlList")
    bcPCsdlCntt = relationship("BCPCSDLCNTT", back_populates="thongKeHtCsdlList")

# REFERENCE TABLES - TƯỜNG LỬA (FIREWALL)
# =====================================================
class THONGTINTUONGLUA(Base):
    """
    Thông tin Tường lửa (Firewall)
    Reference table for firewall information
    """
    __tablename__ = "thongTinTuongLua"

    idTuongLua = Column(
        Integer,
        primary_key=True,
        comment="Id Tuong Lua"
    ) 

    tenTuongLua = Column(
        String(255),
        nullable=False,
        comment="Ten Tuong Lua (Firewall)"
    )

    # Relationships
    thongKeTuongLuaList = relationship(
        "THONGKETUONGLUA", 
        back_populates="thongTinTuongLua",
        cascade="all, delete-orphan"  # Delete stats when system is deleted
    )

class THONGKETUONGLUA(Base):
    """
    Số lượng Tường lửa (Firewall)
    Quantity tracking for firewalls
    """
    __tablename__ = "thongKeTuongLua"

    idBaoCao = Column(
        Integer,
        ForeignKey('bcPCsdlCntt.idBaoCao'),
        primary_key=True,
        comment="Id Bao Cao"
    )

    idTuongLua = Column(
        Integer,
        ForeignKey('thongTinTuongLua.idTuongLua'),
        primary_key=True,
        comment="Id Tuong Lua"
    )

    soLuong = Column(
        Integer,
        nullable=False,
        comment="So luong"
    )

    # Relationships
    thongTinTuongLua = relationship("THONGTINTUONGLUA", back_populates="thongKeTuongLuaList")
    bcPCsdlCntt = relationship("BCPCSDLCNTT", back_populates="thongKeTuongLuaList")

# REFERENCE TABLES - PHẦN MỀM DIỆT VIRUS
# =====================================================
class THONGTINPMDV(Base):
    """
    Thông tin Phần mềm diệt virus
    Reference table for antivirus software information
    """
    __tablename__ = "thongTinPmdv"

    idPmdv = Column(
        Integer,
        primary_key=True,
        comment="Id Phan mem diet virus"
    ) 

    tenPmdv = Column(
        String(255),
        nullable=False,
        comment="Ten Phan mem diet virus"
    )

    # Relationships
    thongKePmdvList = relationship(
        "THONGKEPMDV", 
        back_populates="thongTinPmdv",
        cascade="all, delete-orphan"  # Delete stats when system is deleted
    )

class THONGKEPMDV(Base):
    """
    Số lượng phần mềm diệt virus
    Quantity tracking for antivirus software
    """
    __tablename__ = "thongKePmdv"

    idBaoCao = Column(
        Integer,
        ForeignKey('bcPCsdlCntt.idBaoCao'),
        primary_key=True,
        comment="Id Bao Cao"
    )

    idPmdv = Column(
        Integer,
        ForeignKey('thongTinPmdv.idPmdv'),
        primary_key=True,
        comment="Id Phan mem diet virus"
    )

    soLuong = Column(
        Integer,
        nullable=False,
        comment="So luong"
    )

    # Relationships
    thongTinPmdv = relationship("THONGTINPMDV", back_populates="thongKePmdvList")
    bcPCsdlCntt = relationship("BCPCSDLCNTT", back_populates="thongKePmdvList")



# =====================================================
# BCSL - PHÒNG CƠ SỞ VẬT CHẤT (Infrastructure Office)
# =====================================================

class BCPCSVC(BaoCao):
    """
    Báo cáo Phòng Cơ Sở Vật Chất
    Specific report data for Infrastructure Office
    """
    __tablename__ = "bcPCsvc"

    # === CƠ SỞ VẬT CHẤT CHUNG (General Infrastructure) ===
    soLuongDatDai = Column(
        Integer,
        nullable=True,
        comment="So luong dat dai"
    )

    soLuongCongTrinh = Column(
        Integer,
        nullable=True,
        comment="So luong cong trinh"
    )

    soLuongHthtkt = Column(
        Integer,
        nullable=True,
        comment="So luong he thong ha tang ky thuat"
    )

    soLuongCxcq = Column(
        Integer,
        nullable=True,
        comment="So luong cay xanh canh quan"
    )

    # Relationships
    thongKeMuaSamMmtbList = relationship(
        "THONGKEMUASAMMMTB", 
        back_populates="bcPCsvc",
        cascade="all, delete-orphan"  # Delete stats when system is deleted
    ) 

# REFERENCE TABLES - MÁY MÓC TRANG THIẾT BỊ
# =====================================================
# Define enum for equipment categories
class EquipmentCategory(enum.Enum):
    DIEN = "Điện"
    NUOC = "Nước"
    KHAC = "Khác"

class THONGTINMMTB(Base):
    """
    Thông tin máy móc, trang thiết bị
    Reference table for equipment and machinery information
    """
    __tablename__ = "thongTinMmtb"

    idMmtb = Column(
        Integer,
        primary_key=True,
        comment="Id may moc, thiet bi"
    ) 

    loaiMmtb = Column(
        Enum(EquipmentCategory),
        nullable=False,
        comment="Phan loai may moc, thiet bi (Dien, Nuoc, Khac)"
    )

    tenMmtb = Column(
        String(255),
        nullable=False,
        comment="Ten may moc, thiet bi"
    )

    # Relationships
    thongKeMuaSamMmtbList = relationship(
        "THONGKEMUASAMMMTB", 
        back_populates="thongTinMmtb",
        cascade="all, delete-orphan"  # Delete stats when system is deleted
    ) 

class THONGKEMUASAMMMTB(Base):
    """
    Thống kê mua sắm trang thiết bị
    Equipment procurement statistics
    """
    __tablename__ = "thongKeMuaSamMmtb"

    idBaoCao = Column(
        Integer,
        ForeignKey('bcPCsvc.idBaoCao'),
        primary_key=True,
        comment="Id Bao Cao"
    )

    idMmtb = Column(
        Integer,
        ForeignKey('thongTinMmtb.idMmtb'),
        primary_key=True,
        comment="Id may moc, thiet bi"
    )

    soLuong = Column(
        Integer,
        nullable=False,
        comment="So luong"
    )

    tongChiPhi = Column(
        Integer,
        nullable=False,
        comment="Tong Chi Phi"
    )

    # Relationships
    thongTinMmtb = relationship("THONGTINMMTB", back_populates="thongKeMuaSamMmtbList")
    bcPCsvc = relationship("BCPCSVC", back_populates="thongKeMuaSamMmtbList")



# =====================================================
# BCSL - PHÒNG HÀNH CHÍNH - TỔNG HỢP (Administrative Office)
# =====================================================
class BCPHCTH(BaoCao):
    """
    Báo cáo Phòng Hành Chính - Tổng Hợp
    Specific report data for Administrative and General Affairs Office
    """
    __tablename__ = "bcPHcTh"

    # === VĂN BẢN VÀ THỦ TỤC HÀNH CHÍNH (Documents and Administrative Procedures) ===
    soLuongVanBanDen = Column(
        Integer,
        nullable=True,
        comment="So luong van ban den"
    )

    soLuongVanBanDi = Column(
        Integer,
        nullable=True,
        comment="So luong van ban di"
    )

    soLuongVanBanMat = Column(
        Integer,
        nullable=True,
        comment="So luong van ban mat"
    )

    soLuongCtsyVbgtct = Column(
        Integer,
        nullable=True,
        comment="So luong chung thuc - sao y cac van ban giay to cua Nha truong"
    )

    # === CẤP PHÁT VĂN BẰNG VÀ CHỨNG CHỈ (Certificate and Diploma Issuance) ===
    soLuongCapPhatVb = Column(
        Integer,
        nullable=True,
        comment="So luong cap phat van bang cua Truong"
    )

    soLuongCapPhatCc = Column(
        Integer,
        nullable=True,
        comment="So luong cap phat chung chi cua Truong"
    )

    # === BÁO CÁO HÀNH CHÍNH (Administrative Reports) ===
    soLuongBcCthtqtdk = Column(
        Integer,
        nullable=True,
        comment="So luong cac bao cao ve cong tac hanh chinh, quan tri dinh ky"
    )

    soLuongBcCthtqtdx = Column(
        Integer,
        nullable=True,
        comment="So luong cac bao cao ve cong tac hanh chinh, quan tri dot xuat"
    )

    # === VĂN PHÒNG PHẨM VÀ LƯU TRỮ (Office Supplies and Archive) ===
    soLuongDinhMucSuDungVpp = Column(
        Integer,
        nullable=True,
        comment="So luong dinh muc su dung van phong pham"
    )

    soLuongHsltTlltTaiTruong = Column(
        Integer,
        nullable=True,
        comment="So luong ho so luu tru, tai lieu luu tru tai Truong"
    )

    soLuongHsltTlltNopKlt = Column(
        Integer,
        nullable=True,
        comment="So luong ho so luu tru, tai lieu luu tru nop kho luu tru"
    )



# =====================================================
# BCSL - PHÒNG KHOA HỌC CÔNG NGHỆ VÀ HỢP TÁC PHÁT TRIỂN
# =====================================================
class BCPKHCNHTPT(BaoCao):
    """
    Báo cáo Phòng Khoa Học Công Nghệ và Hợp Tác Phát Triển
    Specific report data for Science Technology and Development Cooperation Office
    """
    __tablename__ = "bcPKhcnHtpt"

    # === NGHIÊN CỨU KHOA HỌC (Scientific Research) ===
    soLuongDtnckhccTruong = Column(
        Integer,
        nullable=True,
        comment="So luong de tai nghien cuu khoa hoc cac cap do Truong chu tri"
    )

    soLuongDtnckhccVcNld = Column(
        Integer,
        nullable=True,
        comment="So luong de tai nghien cuu khoa hoc cac cap do vien chuc, nguoi lao dong cua Truong thuc hien"
    )

    soLuongChuyenGiaoKqnckh = Column(
        Integer,
        nullable=True,
        comment="So luong chuyen giao ket qua nghien cuu khoa hoc cua Truong voi cac to chuc, ca nhan ngoai Truong"
    )

    soLieuHdxtCbqt = Column(
        Integer,
        nullable=True,
        comment="So lieu tiep nhan, de xuat lap hoi dong xet thuong cac cong bo quoc te cua vien chuc, nguoi lao dong va nguoi hoc cua Truong"
    )

    # === HỘI THẢO VÀ HỘI NGHỊ (Conferences and Seminars) ===
    soLuongHtHnkhcttl = Column(
        Integer,
        nullable=True,
        comment="So luong cac hoi thao, hoi nghi khoa hoc tu cap Truong tro len"
    )

    # === HỢP TÁC QUỐC TẾ (International Cooperation) ===
    soLuongDahtqtVeNckhvdt = Column(
        Integer,
        nullable=True,
        comment="So luong cac du an hop tac quoc te ve nghien cuu khoa hoc va dao tao"
    )

    thongKeDoanRa = Column(
        Integer,
        nullable=True,
        comment="Thong ke doan ra; so lieu vien chuc, nguoi lao dong va nguoi hoc cua Truong ra nuoc ngoai du hoi thao, hoi nghi khoa hoc hoac di dao tao, hoc tap ngan han o nuoc ngoai"
    )

    thongKeDoanVao = Column(
        Integer,
        nullable=True,
        comment="Thong ke doan vao; so lieu vien chuc, nguoi lao dong va nguoi hoc cua Truong ra nuoc ngoai du hoi thao, hoi nghi khoa hoc hoac di dao tao, hoc tap ngan han o nuoc ngoai"
    )

    # === CÔNG TRÌNH VÀ HỢP TÁC (Publications and Partnerships) ===
    soLuongCtKhcn = Column(
        Integer,
        nullable=True,
        comment="So luong cong trinh KHCN toan Truong"
    )

    soLuongKyHopTacTctn = Column(
        Integer,
        nullable=True,
        comment="So luong ky hop tac voi cac to chuc trong nuoc"
    )

    soLuongKyHopTacTcnn = Column(
        Integer,
        nullable=True,
        comment="So luong ky hop tac voi cac to chuc ngoai nuoc"
    )



# =====================================================
# BCSL - PHÒNG THANH TRA - PHÁP CHẾ (Inspection and Legal Office)
# =====================================================
class BCPTTPC(BaoCao):
    """
    Báo cáo Phòng Thanh Tra - Pháp Chế
    Specific report data for Inspection and Legal Office
    """
    __tablename__ = "bcPTtPc"

    # === THANH TRA PHÁP CHẾ ĐỊNH KỲ (Regular Inspection and Legal) ===
    soLuongCtkhTtpcDinhKy = Column(
        Integer,
        nullable=True,
        comment="So luong chuong trinh, ke hoach thanh tra, phap che dinh ky"
    )

    soLuongCtkhTtpcDotXuat = Column(
        Integer,
        nullable=True,
        comment="So luong chuong trinh, ke hoach thanh tra, phap che dot xuat"
    )

    # === TỔ CHỨC THỰC HIỆN (Implementation Organization) ===
    soLuongCttcCtkhTtpcDinhKy = Column(
        Integer,
        nullable=True,
        comment="So luong cong tac to chuc thuc hien cac chuong trinh, ke hoach thanh tra, phap che dinh ky"
    )

    soLuongCttcCtkhTtpcDotXuat = Column(
        Integer,
        nullable=True,
        comment="So luong cong tac to chuc thuc hien cac chuong trinh, ke hoach thanh tra, phap che dot xuat"
    )

    # === TIẾP CÔNG DAN VÀ GIẢI QUYẾT KHIẾU NẠI (Citizen Reception and Complaint Resolution) ===
    soLuongCttcd = Column(
        Integer,
        nullable=True,
        comment="So luong cong tac tiep cong dan cua Truong"
    )

    soLuongCtgqkntc = Column(
        Integer,
        nullable=True,
        comment="So luong cong tac giai quyet khieu nai, to cao, thuc hien quy che dan chu cua Truong"
    )

    # === CHỐNG THAM NHŨNG (Anti-Corruption) ===
    soLuongCtpctn = Column(
        Integer,
        nullable=True,
        comment="So luong cong tac phong, chong tham nhung cua Truong"
    )

    # === XÁC MINH VĂN BẰNG (Document Verification) ===
    soLuongVxmVb = Column(
        Integer,
        nullable=True,
        comment="So luong vu xac minh tinh phap ly cua van bang theo quy dinh ve quy trinh xac minh van bang, chung chi"
    )

    soLuongVxmCc = Column(
        Integer,
        nullable=True,
        comment="So luong vu xac minh tinh phap ly cua chung chi theo quy dinh ve quy trinh xac minh van bang, chung chi"
    )



# =====================================================
# BCSL - PHÒNG TRUYỀN THÔNG VÀ QUAN HỆ DOANH NGHIỆP
# =====================================================
class BCPTTQHDN(BaoCao):
    """
    Báo cáo Phòng Truyền Thông và Quan Hệ Doanh Nghiệp
    Specific report data for Communications and Business Relations Office
    """
    __tablename__ = "bcPTtQhdn"

    # === TRUYỀN THÔNG THƯƠNG HIỆU (Brand Communications) ===
    soLuongTtthUlaw = Column(
        Integer,
        nullable=True,
        comment="So luong truyen thong thuong hieu ULAW"
    )

    soLuongHath = Column(
        Integer,
        nullable=True,
        comment="So luong hinh anh thuong hieu"
    )

    soLuongKhtt = Column(
        Integer,
        nullable=True,
        comment="So luong khung hoang truyen thong"
    )

    # === KHẢO SÁT VỀ VIỆC LÀM (Employment Survey) ===
    soLuongKsttvl = Column(
        Integer,
        nullable=True,
        comment="So luong khao sat tinh trang viec lam cua sinh vien sau khi tot nghiep"
    )

    # === HỢP TÁC DOANH NGHIỆP (Business Partnership) ===
    soLuongCtttktDn = Column(
        Integer,
        nullable=True,
        comment="So luong chuong trinh thuc tap, kien tap theo nhu cau cua doanh nghiep"
    )

    # === CỰU SINH VIÊN (Alumni) ===
    soLuongCsvUlaw = Column(
        Integer,
        nullable=True,
        comment="So luong Cuu sinh vien (Alumni ULAW)"
    )



# =====================================================
# BCSL - PHÒNG TÀI CHÍNH - KẾ TOÁN (Finance and Accounting Office)
# =====================================================
class BCPTCKT(BaoCao):
    """
    Báo cáo Phòng Tài Chính - Kế Toán
    Specific report data for Finance and Accounting Office
    """
    __tablename__ = "bcPTcKt"

    # === THỐNG KÊ TÀI CHÍNH (Financial Statistics) ===
    thongKeThuHpKpn = Column(
        Integer,
        nullable=True,
        comment="Thong ke thu hoc phi va cac khoan phai nop cua nguoi hoc; theo doi cac hop dong dich vu trong Truong"
    )

    thongKeBctcNam = Column(
        Integer,
        nullable=True,
        comment="Thong ke bao cao tai chinh nam theo quy dinh tai chinh"
    )

    thongKeBcqtNam = Column(
        Integer,
        nullable=True,
        comment="Thong ke bao cao quyet toan nam theo quy dinh tai chinh"
    )

    thongKeDmktkt = Column(
        Integer,
        nullable=True,
        comment="Thong ke dinh muc kinh te ky thuat"
    )



# =====================================================
# BCSL - PHÒNG TƯ VẤN TUYỂN SINH (Admissions Counseling Office)
# =====================================================
class BCPTVTS(BaoCao):
    """
    Báo cáo Phòng Tư Vấn Tuyển Sinh
    Specific report data for Admissions Counseling Office
    """
    __tablename__ = "bcPTvts"

    # === CHIẾN LƯỢC KẾ HOẠCH (Strategy and Planning) ===
    soLuongKhTvtshn = Column(
        Integer,
        nullable=True,
        comment="So luong chien luoc, ke hoach thuc hien tu van tuyen sinh, huong nghiep"
    )

    soLuongCttcTvtshn = Column(
        Integer,
        nullable=True,
        comment="So luong cong tac to chuc thuc hien tu van tuyen sinh, huong nghiep"
    )

    # === TRUYỀN THÔNG (Communications) ===
    soLuongKhTt = Column(
        Integer,
        nullable=True,
        comment="So luong chien luoc, ke hoach thuc hien cac loai hinh truyen thong"
    )

    soLuongCttcTt = Column(
        Integer,
        nullable=True,
        comment="So luong cong tac to chuc thuc hien cac loai hinh truyen thong"
    )

    # === TƯ VẤN VÀ CHĂM SÓC (Counseling and Care) ===
    soLuongLuotTvts = Column(
        Integer,
        nullable=True,
        comment="So luong luot tu van tuyen sinh qua cac dot"
    )

    soLuongHdcsnh = Column(
        Integer,
        nullable=True,
        comment="So luong hoat dong cham soc nguoi hoc duoc thuc hien"
    )



# =====================================================
# BCSL - PHÒNG TỔ CHỨC NHÂN SỰ (Human Resources Office)
# =====================================================
class BCPTCNS(BaoCao):
    """
    Báo cáo Phòng Tổ Chức Nhân Sự
    Specific report data for Human Resources Office
    """
    __tablename__ = "bcPTcns"

    # === HỢP ĐỒNG VÀ THỎA THUẬN (Contracts and Agreements) ===
    soLuongHdm = Column(
        Integer,
        nullable=True,
        comment="So luong ky hop dong moi"
    )

    soLuonghdtl = Column(
        Integer,
        nullable=True,
        comment="So luong hop dong thanh ly "
    )

    soLuongTtCtv = Column(
        Integer,
        nullable=True,
        comment="So luong thoa thuan cong tac vien"
    )

    # === TỔNG SỐ VIÊN CHỨC (Total Staff) ===
    tongSoVc = Column(
        Integer,
        nullable=True,
        comment="Tong so vien chuc"
    )

    tongSoVcNam = Column(
        Integer,
        nullable=True,
        comment="Tong so vien chuc nam"
    )

    tongSoVcNu = Column(
        Integer,
        nullable=True,
        comment="Tong so vien chuc nu"
    )

    tongSoCtv = Column(
        Integer,
        nullable=True,
        comment="Tong so cong tac vien"
    )

    # === HỌC HÀM VÀ HỌC VỊ (Academic Titles and Degrees) ===
    tongSoHhGs = Column(
        Integer,
        nullable=True,
        comment="Tong so hoc ham giao su"
    )

    tongSohhPgs = Column(
        Integer,
        nullable=True,
        comment="Tong so hoc ham pho giao su"
    )

    tongSoHvTs = Column(
        Integer,
        nullable=True,
        comment="Tong so hoc vi tien si"
    )

    tongSoHvThs = Column(
        Integer,
        nullable=True,
        comment="Tong so hoc vi thac si"
    )

    tongSoHvDh = Column(
        Integer,
        nullable=True,
        comment="Tong so hoc vi dai hoc"
    )

    tongSoHvDdh = Column(
        Integer,
        nullable=True,
        comment="Tong so hoc vi duoi dai hoc"
    )

    # === GIẢNG VIÊN (Lecturers) ===
    tongSoGvch = Column(
        Integer,
        nullable=True,
        comment="Tong so giang vien co huu"
    )

    tongSoGvtg = Column(
        Integer,
        nullable=True,
        comment="Tong so giang vien thinh giang"
    )

    # === THỐNG KÊ CHUNG (General Statistics) ===
    tongSoTuoiBinhQuan = Column(
        Float,
        nullable=True,
        comment="Tong so tuoi binh quan"
    )

    tongSoThuNhapBinhQuan = Column(
        Float,
        nullable=True,
        comment="Tong so thu nhap binh quan"
    )

    # === QUY HOẠCH (Planning) ===
    soLuongQh = Column(
        Integer,
        nullable=True,
        comment="So luong quy hoach"
    )

    soLuongQhbs = Column(
        Integer,
        nullable=True,
        comment="So luong quy hoach bo sung"
    )

    # === BỔ NHIỆM (Appointments) ===
    soLieuBn = Column(
        Integer,
        nullable=True,
        comment="So lieu bo nhiem"
    )

    soLieuBnl = Column(
        Integer,
        nullable=True,
        comment="So lieu bo nhiem lai"
    )

    soLieuKdcv = Column(
        Integer,
        nullable=True,
        comment="So lieu keo dai thoi gian giu chuc vu"
    )

    soLieuTcv = Column(
        Integer,
        nullable=True,
        comment="So lieu thoi giu chuc vu"
    )

    soLieuTuChuc = Column(
        Integer,
        nullable=True,
        comment="So lieu tu chuc"
    )

    soLieuMienNhiem = Column(
        Integer,
        nullable=True,
        comment="So lieu mien nhiem"
    )

    soLieuCdct = Column(
        Integer,
        nullable=True,
        comment="So lieu chuyen doi cong tac"
    )

    # === CHỨC DANH NGHỀ NGHIỆP (Professional Titles) ===
    soLieuBnCdnn = Column(
        Integer,
        nullable=True,
        comment="So lieu bo nhiem chuc danh nghe nghiep"
    )

    soLieuChuyenHangCdnn = Column(
        Integer,
        nullable=True,
        comment="So lieu chuyen hang chuc danh nghe nghiep"
    )

    soLieuThangHangCdnn = Column(
        Integer,
        nullable=True,
        comment="So lieu thang hang chuc danh nghe nghiep"
    )

    # === ĐÀO TẠO (Training) ===
    soLieuDtcmnv = Column(
        Integer,
        nullable=True,
        comment="So lieu dao tao ve chuyen mon nghiep vu"
    )

    soLieuDtnctd = Column(
        Integer,
        nullable=True,
        comment="So lieu dao tao nang cao trinh do"
    )

    soLieuDtllct = Column(
        Integer,
        nullable=True,
        comment="So lieu dao tao ve ly luan chinh tri"
    )

    soLieuDtnn = Column(
        Integer,
        nullable=True,
        comment="So lieu dao tao ngoai nuoc"
    )

    # === NÂNG BẬC LƯƠNG (Salary Upgrades) ===
    soLieuNbltx = Column(
        Integer,
        nullable=True,
        comment="So lieu nang bac luong thuong xuyen"
    )

    soLieuNblth = Column(
        Integer,
        nullable=True,
        comment="So lieu nang bac luong truoc han"
    )

    soLieuNblvk = Column(
        Integer,
        nullable=True,
        comment="So lieu nang bac luong vuot khung"
    )

    soLieuNblkd = Column(
        Integer,
        nullable=True,
        comment="So lieu keo dai thoi gian nang bac luong"
    )

    soLieuNpctnng = Column(
        Integer,
        nullable=True,
        comment="So lieu nang phu cap tham nien nha giao"
    )

    # === NGHỈ VIỆC VÀ CHUYỂN CÔNG TÁC (Resignation and Job Transfer) ===
    soLieuNcdbhht = Column(
        Integer,
        nullable=True,
        comment="So lieu nghi che do bao hiem, huu tri"
    )

    soLieuThoiViec = Column(
        Integer,
        nullable=True,
        comment="So lieu thoi viec"
    )

    soLieuChuyenCongTac = Column(
        Integer,
        nullable=True,
        comment="So lieu chuyen cong tac"
    )

    # === KÊ KHAI TÀI SẢN (Asset Declaration) ===
    soLieuKkts = Column(
        Integer,
        nullable=True,
        comment="So lieu ke khai tai san doi voi vien chuc"
    )

    # === KHEN THƯỞNG CÁ NHÂN (Individual Awards) ===
    soLieuCstd = Column(
        Integer,
        nullable=True,
        comment="So lieu chien si thi dua"
    )

    soLieuLdtt = Column(
        Integer,
        nullable=True,
        comment="So lieu lao dong tien tien"
    )

    soLieuHtxs = Column(
        Integer,
        nullable=True,
        comment="So lieu hoan thanh xuat sac"
    )

    soLieuHtt = Column(
        Integer,
        nullable=True,
        comment="So lieu hoan thanh tot"
    )

    soLieuHtnv = Column(
        Integer,
        nullable=True,
        comment="So lieu hoan thanh nhiem vu"
    )

    soLieuKhtnv = Column(
        Integer,
        nullable=True,
        comment="So lieu khong hoan thanh nhiem vu"
    )

    soLieuBkl = Column(
        Integer,
        nullable=True,
        comment="So lieu vien chuc - nguoi lao dong bi ky luat"
    )

    soLieuDkt = Column(
        Integer,
        nullable=True,
        comment="So lieu vien chuc - nguoi lao khen thuong"
    )

    # === KHEN THƯỞNG TẬP THỂ (Collective Awards) ===
    soLuongTtLdtt = Column(
        Integer,
        nullable=True,
        comment="So luong tap the lao dong tien tien"
    )

    soLuongTtHtxs = Column(
        Integer,
        nullable=True,
        comment="So luong tap the hoan thanh xuat sac"
    )

    soLuongTtHtt = Column(
        Integer,
        nullable=True,
        comment="So luong tap the hoan thanh tot"
    )

    soLuongTtHtnv = Column(
        Integer,
        nullable=True,
        comment="So luong tap the hoan thanh nhiem vu"
    )

    soLuongTtKhtnv = Column(
        Integer,
        nullable=True,
        comment="So luong tap the khong hoan thanh nhiem vu"
    )

    soLuongTtDkt = Column(
        Integer,
        nullable=True,
        comment="So luong tap the khen thuong khac (Neu co)"
    )



# =====================================================
# BCSL - PHÒNG ĐÀO TẠO SAU ĐẠI HỌC (Postgraduate Training Office)
# =====================================================
class BCPDTSDH(BaoCao):
    """
    Báo cáo Phòng Đào Tạo Sau Đại Học
    Specific report data for Postgraduate Training Office
    """
    __tablename__ = "bcPDtsdh"

    # === CHƯƠNG TRÌNH ĐÀO TẠO (Training Programs) ===
    soLuongMndt = Column(
        Integer,
        nullable=True,
        comment="So luong ma nganh dao tao"
    )

    soLuongCtdt = Column(
        Integer,
        nullable=True,
        comment="So luong chuong trinh dao tao"
    )

    trinhDoDaoTao = Column(
        String(255),
        nullable=True,
        comment="Trinh do dao tao"
    )

    # === TUYỂN SINH VÀ HỌC VIÊN (Admissions and Students) ===
    soLuongCtts = Column(
        Integer,
        nullable=True,
        comment="So luong chi tieu tuyen sinh"
    )

    soLuongHvsdh = Column(
        Integer,
        nullable=True,
        comment="So luong hoc vien sau dai hoc"
    )

    soLuongHvch= Column(
        Integer,
        nullable=True,
        comment="So luong hoc vien cao hoc"
    )

    soLuongNcstn = Column(
        Integer,
        nullable=True,
        comment="So luong nghien cuu sinh tot nghiep cua Truong"
    )

    soLuongHvsdhcdh = Column(
        Integer,
        nullable=True,
        comment="So luong hoc vien sau dai hoc cham dut hoc tai Truong"
    )

    # === ĐÀO TẠO BỒI DƯỠNG (Training and Development) ===
    soLuongLdtbdCcsdh = Column(
        Integer,
        nullable=True,
        comment="So luong cac lop boi duong cap chung chi sau dai hoc"
    )



# =====================================================
# BCSL - PHÒNG ĐÀO TẠO ĐẠI HỌC (Undergraduate Training Office)
# =====================================================
class BCPDTDH(BaoCao):
    """
    Báo cáo Phòng Đào Tạo Đại Học
    Specific report data for Undergraduate Training Office
    """
    __tablename__ = "bcPDtdh"

    # === CHƯƠNG TRÌNH ĐÀO TẠO (Training Programs) ===
    soLuongMndt = Column(
        Integer,
        nullable=True,
        comment="So luong ma nganh dao tao"
    )

    soLuongCtdt = Column(
        Integer,
        nullable=True,
        comment="So luong chuong trinh dao tao"
    )

    # === TUYỂN SINH VÀ SINH VIÊN (Admissions and Students) ===
    soLuongCtts = Column(
        Integer,
        nullable=True,
        comment="So luong chi tieu tuyen sinh"
    )

    soLieuSvnh = Column(
        Integer,
        nullable=True,
        comment="So lieu sinh vien nhap hoc"
    )

    soLieuSvtn = Column(
        Integer,
        nullable=True,
        comment="So lieu sinh vien tot nghiep"
    )



# =====================================================
# BCSL - PHÒNG ĐẢM BẢO CHẤT LƯỢNG VÀ KHẢO THÍ
# =====================================================
class BCPDBCLKT(BaoCao):
    """
    Báo cáo Phòng Đảm Bảo Chất Lượng và Khảo Thí
    Specific report data for Quality Assurance and Examination Office
    """
    __tablename__ = "bcPDbclKt"

    # === ĐẢM BẢO CHẤT LƯỢNG (Quality Assurance) ===
    soLuongKhdbcldth = Column(
        Integer,
        nullable=True,
        comment="So luong ke hoach dam bao chat luong cua Truong duoc thuc hien"
    )

    soLuongKhdbcldrsdc = Column(
        Integer,
        nullable=True,
        comment="So luong ke hoach dam bao chat luong cua Truong duoc ra soat, dieu chinh"
    )

    soLuongKhdbcldtk = Column(
        Integer,
        nullable=True,
        comment="So luong ke hoach dam bao chat luong cua Truong duoc tong ket"
    )

    # === KHẢO SÁT VÀ CẢI TIẾN (Survey and Improvement) ===
    soLuongKhksDv = Column(
        Integer,
        nullable=True,
        comment="So luong ke hoach khao sat thuoc chuc nang, nhiem vu cua don vi"
    )

    soLuongKhctCsgd = Column(
        Integer,
        nullable=True,
        comment="So luong ke hoach cai tien cap co so giao duc"
    )

    soLuongKhctCtdt = Column(
        Integer,
        nullable=True,
        comment="So luong ke hoach cai tien cap chuong trinh dao tao"
    )

    # === HỆ THỐNG VĂN BẢN VÀ ĐÀO TẠO (Documentation System and Training) ===
    soLuongHtvbDbcldcn = Column(
        Integer,
        nullable=True,
        comment="So luong he thong van ban ve dam bao chat luong cua Truong duoc cap nhat"
    )

    soLuongHtThGvm = Column(
        Integer,
        nullable=True,
        comment="So luong hoi thao, tap huan, trao doi kinh nghiem giang day cho giang vien moi"
    )

    soLuongHtHnTdct = Column(
        Integer,
        nullable=True,
        comment="So luong hoi thao, hoi nghi, toa dam cap Truong"
    )

    # === HỢP TÁC (Cooperation) ===
    soLuongVbhttn = Column(
        Integer,
        nullable=True,
        comment="So luong van ban hop tac trong nuoc"
    )

    soLuongVbhtnn = Column(
        Integer,
        nullable=True,
        comment="So luong van ban hop tac ngoai nuoc"
    )

    # === KHẢO THÍ (Examination) ===
    soLuongDtKthpdis = Column(
        Integer,
        nullable=True,
        comment="So luong de thi ket thuc hoc phan duoc in/sao"
    )

    soLuongCbctKthp = Column(
        Integer,
        nullable=True,
        comment="So luong can bo coi thi ket thuc hoc phan duoc dieu phoi"
    )

    soLuongCbctvpqc = Column(
        Integer,
        nullable=True,
        comment="So luong can bo coi thi vi pham quy che"
    )

    soLuongSvvpqc = Column(
        Integer,
        nullable=True,
        comment="So luong sinh vien vi pham quy che"
    )

    soLuongBtdc = Column(
        Integer,
        nullable=True,
        comment="So luong bai thi duoc cham"
    )

    soLuongBtdql = Column(
        Integer,
        nullable=True,
        comment="So luong bai thi duoc quan ly"
    )

    soLuongGvctvpqc = Column(
        Integer,
        nullable=True,
        comment="So luong giang vien cham thi vi pham quy che"
    )

    soLuongThCtctKthp = Column(
        Integer,
        nullable=True,
        comment="So luong buoi tap huan cong tac coi thi ket thuc hoc phan"
    )



# =====================================================
# BCSL - THƯ VIỆN (Library)
# =====================================================
class BCTV(BaoCao):
    """
    Báo cáo Thư Viện
    Specific report data for Library
    """
    __tablename__ = "bcTv"

    # === NGHIÊN CỨU KHOA HỌC VÀ KHAI THÁC TÀI NGUYÊN (Research and Resource Exploitation) ===
    soLuongDtnckhdnt = Column(
        Integer,
        nullable=True,
        comment="So luong de tai nghien cuu khoa hoc da nghiem thu do thu vien quan ly va khai thac"
    )

    # === TRUY NHẬP TÀI NGUYÊN THÔNG TIN (Information Resource Access) ===
    soLuongNdtntc = Column(
        Integer,
        nullable=True,
        comment="So luong nguoi dung truy nhap tai cho den nguon tai nguyen thong tin da dang"
    )

    soLuongNgtntx = Column(
        Integer,
        nullable=True,
        comment="So luong nguoi dung truy nhap tu xa den nguon tai nguyen thong tin da dang"
    )



# =====================================================
# BCSL - TRUNG TÂM HỌC LIỆU (Learning Materials Center)
# =====================================================
class BCTTTHL(BaoCao):
    """
    Báo cáo Trung Tâm Học Liệu
    Specific report data for Learning Materials Center
    """
    __tablename__ = "bcTthl"

    # === GIÁO TRÌNH (Textbooks) ===
    soTeGt = Column(
        Integer,
        nullable=True,
        comment="So ten cua giao trinh"
    )

    soCuonGt = Column(
        Integer,
        nullable=True,
        comment="So cuon cua giao trinh"
    )

    # === TẬP BÀI GIẢNG (Lecture Collections) ===
    soTenTbg = Column(
        Integer,
        nullable=True,
        comment="So ten cua tap bai giang"
    )

    soCuonTbg = Column(
        Integer,
        nullable=True,
        comment="So cuon cua tap bai giang"
    )

    # === SÁCH TÌNH HUỐNG (Case Study Books) ===
    soTenSth = Column(
        Integer,
        nullable=True,
        comment="So ten cua sach tinh huong"
    )

    soCuonSth = Column(
        Integer,
        nullable=True,
        comment="So cuon cua sach tinh huong"
    )

    # === SÁCH CHUYÊN KHẢO (Specialized Books) ===
    soTenSck = Column(
        Integer,
        nullable=True,
        comment="So ten cua sach chuyen khao"
    )

    soCuonSck = Column(
        Integer,
        nullable=True,
        comment="So cuon cua sach chuyen khao"
    )

    # === SÁCH THAM KHẢO (Reference Books) ===
    soTenStk = Column(
        Integer,
        nullable=True,
        comment="So ten cua sach tham khao"
    )

    soCuonStk = Column(
        Integer,
        nullable=True,
        comment="So cuon cua sach tham khao"
    )

    # === SÁCH KÝ GỬI CỦA GIẢNG VIÊN (Faculty Deposited Books) ===
    soTenSkgGv = Column(
        Integer,
        nullable=True,
        comment="So ten sach ky gui cua giang vien"
    )

    soCuonSkgGv = Column(
        Integer,
        nullable=True,
        comment="So cuon sach ky gui cua giang vien"
    )

    # === SÁCH KÝ GỬI CỦA TỔ CHỨC/CÁ NHÂN KHÁC (Other Organization/Individual Deposited Books) ===
    soTenSkgTcCnKhac = Column(
        Integer,
        nullable=True,
        comment="So ten sach ky gui cua to chuc/ ca nhan khac"
    )

    soCuonSkgTcCnKhac = Column(
        Integer,
        nullable=True,
        comment="So cuon sach ky gui cua to chuc/ ca nhan khac"
    )

    # === DOANH THU VÀ THÙ LAO (Revenue and Fees) ===
    doanhThuTuSach = Column(
        Integer,
        nullable=True,
        comment="Doanh thu tu sach cua Truong"
    )

    thuLaoTuSkg = Column(
        Integer,
        nullable=True,
        comment="Thu lao tu sach ky gui"
    )



# =====================================================
# BCSL - TRUNG TÂM TƯ VẤN PHÁP LUẬT VÀ PHỤC VỤ CỘNG ĐỒNG
# =====================================================
class BCTTTVPLPVCD(BaoCao):
    """
    Báo cáo Trung Tâm Tư Vấn Pháp Luật và Phục Vụ Cộng Đồng
    Specific report data for Legal Consultation and Community Service Center
    """
    __tablename__ = "bcTtTvplPvcd"

    # === DỊCH VỤ TƯ VẤN CÓ THU PHÍ (Paid Consultation Services) ===
    soLuongDvtvCn = Column(
        Integer,
        nullable=True,
        comment="So luong dich vu tu van phap luat \"co thu phi\" doi voi ca nhan co nhu cau"
    )

    soLuongDvtvTc = Column(
        Integer,
        nullable=True,
        comment="So luong dich vu tu van phap luat \"co thu phi\" doi voi to chuc co nhu cau"
    )

    # === HỖ TRỢ PHÁP LÝ MIỄN PHÍ (Free Legal Support) ===
    soLuongHtpl = Column(
        Integer,
        nullable=True,
        comment="So luong ho tro phap ly doi voi cac doi tuong duoc huong theo quy dinh cua Phap luat"
    )

    # === TUYÊN TRUYỀN PHÁP LUẬT (Legal Education and Advocacy) ===
    soLuongHdttpbpl = Column(
        Integer,
        nullable=True,
        comment="So luong hoat dong tuyen truyen, pho bien phap luat"
    )

    # === HOẠT ĐỘNG LIÊN KẾT (Partnership Activities) ===
    soLuongLienKettn = Column(
        Integer,
        nullable=True,
        comment="So luong cac hoat dong lien ket voi co quan, don vi, ca nhan trong nuoc"
    )

    soLuongLienKetnn = Column(
        Integer,
        nullable=True,
        comment="So luong cac hoat dong lien ket voi co quan, don vi, ca nhan ngoai nuoc"
    )

    