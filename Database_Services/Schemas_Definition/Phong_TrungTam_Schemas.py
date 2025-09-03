from typing import Optional, List
from Schemas_Definition.Common_Schemas import (
    BaoCaoBase,
    BaoCaoCreate,
    BaoCaoUpdate,
    BaoCaoRead,
    ConfiguredBase
)
import enum

# =====================================================
# BCPCTSV - Phòng Công Tác Sinh Viên
# =====================================================
class BCPCTSVBase(BaoCaoBase):
    soLuongGtxncnChoSvTdDh: Optional[int] = None
    soLuongGtKhacChoSvTdDh: Optional[int] = None
    soLuongSvdkt: Optional[int] = None
    soLuongSvbkl: Optional[int] = None
    soLuongSvdchb: Optional[int] = None
    soLuongSvdmghp: Optional[int] = None
    soLuongSvdhtcpht: Optional[int] = None
    soLuongSvdtcxh: Optional[int] = None
    soLuongDonThuCuaSv: Optional[int] = None
    thongKeHangNamVeSvTheoQdcpl: Optional[int] = None

class BCPCTSVCreate(BaoCaoCreate, BCPCTSVBase):
    pass

class BCPCTSVUpdate(BaoCaoUpdate, BCPCTSVBase):
    pass

class BCPCTSVRead(BaoCaoRead, BCPCTSVBase):
    pass


# =====================================================
# BCPCSDLCNTT - Phòng Cơ Sở Dữ Liệu và CNTT
# =====================================================
class BCPCSDLCNTTBase(BaoCaoBase):
    soLuongMcvlTaiTruong: Optional[int] = None
    soLuongMcaTaiTruong: Optional[int] = None
    soLuongMccThue: Optional[int] = None
    soLuongDtLeasedLine: Optional[int] = None
    dungLuongDtInternetTrongNuoc: Optional[float] = None
    dungLuongDtInternetQuocTe: Optional[float] = None
    soLuongSwitchTang: Optional[int] = None
    soLuongThietBiWifi: Optional[int] = None
    soLuongThietBiCamera: Optional[int] = None
    soLuongTddtThuocPvt: Optional[int] = None
    soLuongTrangWeb: Optional[int] = None
    soLuongPhanMem: Optional[int] = None
    soLuongTtdcpChoSv: Optional[int] = None
    soLuongTtdcpChoNguoiHoc: Optional[int] = None
    soLuongTtdcpChoNld: Optional[int] = None
    soLuongThietBiCuaTu: Optional[int] = None
    soLuongHtCntt: Optional[int] = None

class BCPCSDLCNTTCreate(BaoCaoCreate, BCPCSDLCNTTBase):
    pass

class BCPCSDLCNTTUpdate(BaoCaoUpdate, BCPCSDLCNTTBase):
    pass

class BCPCSDLCNTTRead(BaoCaoRead, BCPCSDLCNTTBase):
    pass

# -------- Reference Tables Schemas (for BCPCSDLCNTT) --------

# Hệ thống CSDL
class ThongTinHtCsdlBase(ConfiguredBase):
    idHtCsdl: int
    tenHtCsdl: str

class ThongKeHtCsdlBase(ConfiguredBase):
    idBaoCao: int
    idHtCsdl: int
    soLuong: int

# Tường lửa
class ThongTinTuongLuaBase(ConfiguredBase):
    idTuongLua: int
    tenTuongLua: str

class ThongKeTuongLuaBase(ConfiguredBase):
    idBaoCao: int
    idTuongLua: int
    soLuong: int

# Phần mềm diệt virus
class ThongTinPmdvBase(ConfiguredBase):
    idPmdv: int
    tenPmdv: str

class ThongKePmdvBase(ConfiguredBase):
    idBaoCao: int
    idPmdv: int
    soLuong: int


# =====================================================
# BCPCSVC - Phòng Cơ Sở Vật Chất
# =====================================================
class BCPCSVCBase(BaoCaoBase):
    soLuongDatDai: Optional[int] = None
    soLuongCongTrinh: Optional[int] = None
    soLuongHthtkt: Optional[int] = None
    soLuongCxcq: Optional[int] = None

class BCPCSVCCreate(BaoCaoCreate, BCPCSVCBase):
    pass

class BCPCSVCUpdate(BaoCaoUpdate, BCPCSVCBase):
    pass

class BCPCSVCRead(BaoCaoRead, BCPCSVCBase):
    pass

# -------- Reference Tables Schemas (for BCPCSVC) --------

# Equipment Category Enum
class EquipmentCategory(int, enum.Enum):
    DIEN = 1
    NUOC = 2
    KHAC = 3

class ThongTinMmtbBase(ConfiguredBase):
    idMmtb: int
    loaiMmtb: EquipmentCategory
    tenMmtb: str

class ThongKeMuaSamMmtbBase(ConfiguredBase):
    idBaoCao: int
    idMmtb: int
    soLuong: int
    tongChiPhi: int


# =====================================================
# BCPHCTH - Phòng Hành Chính - Tổng Hợp
# =====================================================
class BCPHCTHBase(BaoCaoBase):
    soLuongVanBanDen: Optional[int] = None
    soLuongVanBanDi: Optional[int] = None
    soLuongVanBanMat: Optional[int] = None
    soLuongCtsyVbgtct: Optional[int] = None
    soLuongCapPhatVb: Optional[int] = None
    soLuongCapPhatCc: Optional[int] = None
    soLuongBcCthtqtdk: Optional[int] = None
    soLuongBcCthtqtdx: Optional[int] = None
    soLuongDinhMucSuDungVpp: Optional[int] = None
    soLuongHsltTlltTaiTruong: Optional[int] = None
    soLuongHsltTlltNopKlt: Optional[int] = None

class BCPHCTHCreate(BaoCaoCreate, BCPHCTHBase):
    pass

class BCPHCTHUpdate(BaoCaoUpdate, BCPHCTHBase):
    pass

class BCPHCTHRead(BaoCaoRead, BCPHCTHBase):
    pass


# =====================================================
# BCPKHCNHTPT - Phòng Khoa học Công nghệ & Hợp tác Phát triển
# =====================================================
class BCPKHCNHTPTBase(BaoCaoBase):
    soLuongDtnckhccTruong: Optional[int] = None
    soLuongDtnckhccVcNld: Optional[int] = None
    soLuongChuyenGiaoKqnckh: Optional[int] = None
    soLieuHdxtCbqt: Optional[int] = None
    soLuongHtHnkhcttl: Optional[int] = None
    soLuongDahtqtVeNckhvdt: Optional[int] = None
    thongKeDoanRa: Optional[int] = None
    thongKeDoanVao: Optional[int] = None
    soLuongCtKhcn: Optional[int] = None
    soLuongKyHopTacTctn: Optional[int] = None
    soLuongKyHopTacTcnn: Optional[int] = None

class BCPKHCNHTPTCreate(BaoCaoCreate, BCPKHCNHTPTBase):
    pass

class BCPKHCNHTPTUpdate(BaoCaoUpdate, BCPKHCNHTPTBase):
    pass

class BCPKHCNHTPTRead(BaoCaoRead, BCPKHCNHTPTBase):
    pass


# =====================================================
# BCPTTPC - Phòng Thanh tra - Pháp chế
# =====================================================
class BCPTTPCBase(BaoCaoBase):
    soLuongCtkhTtpcDinhKy: Optional[int] = None
    soLuongCtkhTtpcDotXuat: Optional[int] = None
    soLuongCttcCtkhTtpcDinhKy: Optional[int] = None
    soLuongCttcCtkhTtpcDotXuat: Optional[int] = None
    soLuongCttcd: Optional[int] = None
    soLuongCtgqkntc: Optional[int] = None
    soLuongCtpctn: Optional[int] = None
    soLuongVxmVb: Optional[int] = None
    soLuongVxmCc: Optional[int] = None

class BCPTTPCCreate(BaoCaoCreate, BCPTTPCBase):
    pass

class BCPTTPCUpdate(BaoCaoUpdate, BCPTTPCBase):
    pass

class BCPTTPCRead(BaoCaoRead, BCPTTPCBase):
    pass


# =====================================================
# BCPTTQHDN - Phòng Truyền thông & Quan hệ Doanh nghiệp
# =====================================================
class BCPTTQHDNBase(BaoCaoBase):
    soLuongTtthUlaw: Optional[int] = None
    soLuongHath: Optional[int] = None
    soLuongKhtt: Optional[int] = None
    soLuongKsttvl: Optional[int] = None
    soLuongCtttktDn: Optional[int] = None
    soLuongCsvUlaw: Optional[int] = None

class BCPTTQHDNCreate(BaoCaoCreate, BCPTTQHDNBase):
    pass

class BCPTTQHDNUpdate(BaoCaoUpdate, BCPTTQHDNBase):
    pass

class BCPTTQHDNRead(BaoCaoRead, BCPTTQHDNBase):
    pass


# =====================================================
# BCPTCKT - Phòng Tài chính - Kế toán
# =====================================================
class BCPTCKTBase(BaoCaoBase):
    thongKeThuHpKpn: Optional[int] = None
    thongKeBctcNam: Optional[int] = None
    thongKeBcqtNam: Optional[int] = None
    thongKeDmktkt: Optional[int] = None

class BCPTCKTCreate(BaoCaoCreate, BCPTCKTBase):
    pass

class BCPTCKTUpdate(BaoCaoUpdate, BCPTCKTBase):
    pass

class BCPTCKTRead(BaoCaoRead, BCPTCKTBase):
    pass


# =====================================================
# BCPTVTS - Phòng Tư vấn Tuyển sinh
# =====================================================
class BCPTVTSBase(BaoCaoBase):
    soLuongKhTvtshn: Optional[int] = None
    soLuongCttcTvtshn: Optional[int] = None
    soLuongKhTt: Optional[int] = None
    soLuongCttcTt: Optional[int] = None
    soLuongLuotTvts: Optional[int] = None
    soLuongHdcsnh: Optional[int] = None

class BCPTVTSCreate(BaoCaoCreate, BCPTVTSBase):
    pass

class BCPTVTSUpdate(BaoCaoUpdate, BCPTVTSBase):
    pass

class BCPTVTSRead(BaoCaoRead, BCPTVTSBase):
    pass



# =====================================================
# BCSL - PHÒNG TỔ CHỨC NHÂN SỰ (Human Resources Office)
# =====================================================
class BCPTCNSBase(BaoCaoBase):
    soLuongHdm: Optional[int] = None
    soLuonghdtl: Optional[int] = None
    soLuongTtCtv: Optional[int] = None
    tongSoVc: Optional[int] = None
    tongSoVcNam: Optional[int] = None
    tongSoVcNu: Optional[int] = None
    tongSoCtv: Optional[int] = None
    tongSoHhGs: Optional[int] = None
    tongSohhPgs: Optional[int] = None
    tongSoHvTs: Optional[int] = None
    tongSoHvThs: Optional[int] = None
    tongSoHvDh: Optional[int] = None
    tongSoHvDdh: Optional[int] = None
    tongSoGvch: Optional[int] = None
    tongSoGvtg: Optional[int] = None
    tongSoTuoiBinhQuan: Optional[float] = None
    tongSoThuNhapBinhQuan: Optional[float] = None
    soLuongQh: Optional[int] = None
    soLuongQhbs: Optional[int] = None
    soLieuBn: Optional[int] = None
    soLieuBnl: Optional[int] = None
    soLieuKdcv: Optional[int] = None
    soLieuTcv: Optional[int] = None
    soLieuTuChuc: Optional[int] = None
    soLieuMienNhiem: Optional[int] = None
    soLieuCdct: Optional[int] = None
    soLieuBnCdnn: Optional[int] = None
    soLieuChuyenHangCdnn: Optional[int] = None
    soLieuThangHangCdnn: Optional[int] = None
    soLieuDtcmnv: Optional[int] = None
    soLieuDtnctd: Optional[int] = None
    soLieuDtllct: Optional[int] = None
    soLieuDtnn: Optional[int] = None
    soLieuNbltx: Optional[int] = None
    soLieuNblth: Optional[int] = None
    soLieuNblvk: Optional[int] = None
    soLieuNblkd: Optional[int] = None
    soLieuNpctnng: Optional[int] = None
    soLieuNcdbhht: Optional[int] = None
    soLieuThoiViec: Optional[int] = None
    soLieuChuyenCongTac: Optional[int] = None
    soLieuKkts: Optional[int] = None
    soLieuCstd: Optional[int] = None
    soLieuLdtt: Optional[int] = None
    soLieuHtxs: Optional[int] = None
    soLieuHtt: Optional[int] = None
    soLieuHtnv: Optional[int] = None
    soLieuKhtnv: Optional[int] = None
    soLieuBkl: Optional[int] = None
    soLieuDkt: Optional[int] = None
    soLuongTtLdtt: Optional[int] = None
    soLuongTtHtxs: Optional[int] = None
    soLuongTtHtt: Optional[int] = None
    soLuongTtHtnv: Optional[int] = None
    soLuongTtKhtnv: Optional[int] = None
    soLuongTtDkt: Optional[int] = None

class BCPTCNSCreate(BaoCaoCreate, BCPTCNSBase):
    pass

class BCPTCNSUpdate(BaoCaoUpdate, BCPTCNSBase):
    pass

class BCPTCNSRead(BaoCaoRead, BCPTCNSBase):
    pass


# =====================================================
# BCSL - PHÒNG ĐÀO TẠO SAU ĐẠI HỌC (Postgraduate Training Office)
# =====================================================
class BCPDTSDHBase(BaoCaoBase):
    soLuongMndt: Optional[int] = None
    soLuongCtdt: Optional[int] = None
    trinhDoDaoTao: Optional[str] = None
    soLuongCtts: Optional[int] = None
    soLuongHvsdh: Optional[int] = None
    soLuongHvch: Optional[int] = None
    soLuongNcstn: Optional[int] = None
    soLuongHvsdhcdh: Optional[int] = None
    soLuongLdtbdCcsdh: Optional[int] = None

class BCPDTSDHCreate(BaoCaoCreate, BCPDTSDHBase):
    pass

class BCPDTSDHUpdate(BaoCaoUpdate, BCPDTSDHBase):
    pass

class BCPDTSDHRead(BaoCaoRead, BCPDTSDHBase):
    pass


# =====================================================
# BCSL - PHÒNG ĐÀO TẠO ĐẠI HỌC (Undergraduate Training Office)
# =====================================================
class BCPDTDHBase(BaoCaoBase):
    soLuongMndt: Optional[int] = None
    soLuongCtdt: Optional[int] = None
    soLuongCtts: Optional[int] = None
    soLieuSvnh: Optional[int] = None
    soLieuSvtn: Optional[int] = None

class BCPDTDHCreate(BaoCaoCreate, BCPDTDHBase):
    pass

class BCPDTDHUpdate(BaoCaoUpdate, BCPDTDHBase):
    pass

class BCPDTDHRead(BaoCaoRead, BCPDTDHBase):
    pass


# =====================================================
# BCSL - PHÒNG ĐẢM BẢO CHẤT LƯỢNG VÀ KHẢO THÍ
# =====================================================
class BCPDBCLKTBase(BaoCaoBase):
    soLuongKhdbcldth: Optional[int] = None
    soLuongKhdbcldrsdc: Optional[int] = None
    soLuongKhdbcldtk: Optional[int] = None
    soLuongKhksDv: Optional[int] = None
    soLuongKhctCsgd: Optional[int] = None
    soLuongKhctCtdt: Optional[int] = None
    soLuongHtvbDbcldcn: Optional[int] = None
    soLuongHtThGvm: Optional[int] = None
    soLuongHtHnTdct: Optional[int] = None
    soLuongVbhttn: Optional[int] = None
    soLuongVbhtnn: Optional[int] = None
    soLuongDtKthpdis: Optional[int] = None
    soLuongCbctKthp: Optional[int] = None
    soLuongCbctvpqc: Optional[int] = None
    soLuongSvvpqc: Optional[int] = None
    soLuongBtdc: Optional[int] = None
    soLuongBtdql: Optional[int] = None
    soLuongGvctvpqc: Optional[int] = None
    soLuongThCtctKthp: Optional[int] = None

class BCPDBCLKTCreate(BaoCaoCreate, BCPDBCLKTBase):
    pass

class BCPDBCLKTUpdate(BaoCaoUpdate, BCPDBCLKTBase):
    pass

class BCPDBCLKTRead(BaoCaoRead, BCPDBCLKTBase):
    pass


# =====================================================
# BCSL - THƯ VIỆN (Library)
# =====================================================
class BCTVBase(BaoCaoBase):
    soLuongDtnckhdnt: Optional[int] = None
    soLuongNdtntc: Optional[int] = None
    soLuongNgtntx: Optional[int] = None

class BCTVCreate(BaoCaoCreate, BCTVBase):
    pass

class BCTVUpdate(BaoCaoUpdate, BCTVBase):
    pass

class BCTVRead(BaoCaoRead, BCTVBase):
    pass


# =====================================================
# BCSL - TRUNG TÂM HỌC LIỆU (Learning Materials Center)
# =====================================================
class BCTTTHLBase(BaoCaoBase):
    soTeGt: Optional[int] = None
    soCuonGt: Optional[int] = None
    soTenTbg: Optional[int] = None
    soCuonTbg: Optional[int] = None
    soTenSth: Optional[int] = None
    soCuonSth: Optional[int] = None
    soTenSck: Optional[int] = None
    soCuonSck: Optional[int] = None
    soTenStk: Optional[int] = None
    soCuonStk: Optional[int] = None
    soTenSkgGv: Optional[int] = None
    soCuonSkgGv: Optional[int] = None
    soTenSkgTcCnKhac: Optional[int] = None
    soCuonSkgTcCnKhac: Optional[int] = None
    doanhThuTuSach: Optional[int] = None
    thuLaoTuSkg: Optional[int] = None

class BCTTTHLCreate(BaoCaoCreate, BCTTTHLBase):
    pass

class BCTTTHLUpdate(BaoCaoUpdate, BCTTTHLBase):
    pass

class BCTTTHLRead(BaoCaoRead, BCTTTHLBase):
    pass


# =====================================================
# BCSL - TRUNG TÂM TƯ VẤN PHÁP LUẬT VÀ PHỤC VỤ CỘNG ĐỒNG
# =====================================================
class BCTTTVPLPVCDBase(BaoCaoBase):
    soLuongDvtvCn: Optional[int] = None
    soLuongDvtvTc: Optional[int] = None
    soLuongHtpl: Optional[int] = None
    soLuongHdttpbpl: Optional[int] = None
    soLuongLienKettn: Optional[int] = None
    soLuongLienKetnn: Optional[int] = None

class BCTTTVPLPVCDCreate(BaoCaoCreate, BCTTTVPLPVCDBase):
    pass

class BCTTTVPLPVCDUpdate(BaoCaoUpdate, BCTTTVPLPVCDBase):
    pass

class BCTTTVPLPVCDRead(BaoCaoRead, BCTTTVPLPVCDBase):
    pass
