export interface ToChucBackEnd {
  idToChuc?: number;
  capToChuc: string;
}

export interface DonViBackEnd {
  idDonVi?: number;
  capDonVi: string;
  toChuc: ToChucBackEnd;
}

export interface NguoiBaoCaoBackEnd {
  idNguoiBaoCao?: number;
  hoVaTen: string;
  email: string;
  chucVu: string
}

export interface GiaiDoanBackEnd {
  idGiaiDoan: number;
}

export interface BaoCaoBackEnd {
  idBaoCao?: number;
  nguoiBaoCao: NguoiBaoCaoBackEnd;
  donVi: DonViBackEnd;
  namBaoCao: number;
  giaiDoan: GiaiDoanBackEnd;
}

export interface DanhMucNganhBackEnd {
  idNganh: number;
  tenNganh: string;
}

export interface BCKhoaPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongGvch: number;
  soLuongGvtg: number;
  soLuongNld: number;
  danhMucNganh: DanhMucNganhBackEnd[];
  tongSoMhk: number;
  fileDmmh: string;
  soCtdtCanCaiTien: number;
  soCtdtXayDungMoi: number;
  soTlgtCanChinhSua: number;
  soTlgtBienSoanMoi: number;
  soGvCanDtbd: number;
  soGvCanTuyenMoi: number;
}

export interface BCPhongCTSVPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongGtxncnChoSvTdDh: number;
  soLuongGtKhacChoSvTdDh: number;
  soLuongSvdkt: number;
  soLuongSvbkl: number;
  soLuongSvdchb: number;
  soLuongSvdmghp: number;
  soLuongSvdhtcpht: number;
  soLuongSvdtcxh: number;
  soLuongDonThuCuaSv: number;
  thongKeHangNamVeSvTheoQdcpl: number;
}

export interface ThongKeHTCSDLBackEnd {
  idBaoCao?: number;
  idHtCsdl?: number;
  soLuongCsdl: number;
}

export interface ThongTinHTCSDLBackEnd {
  idHtCsdl?: number;
  tenHtCsdl: string;
}

export interface ThongKeTuongLuaBackEnd {
  idBaoCao?: number;
  idTuongLua?: number;
  soLuongTuongLua: number;
}

export interface ThongTinTuongLuaBackEnd {
  idTuongLua?: number;
  tenTuongLua: string;
}

export interface ThongKePMDVBackEnd {
  idBaoCao?: number;
  idPmdv?: number;
  soLuongPmdv: number;
}

export interface ThongTinPMDVBackEnd {
  idPmdv?: number;
  tenPmdv: string;
}

export interface BCPhongCSDLCNTTPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongMcvlTaiTruong: number;
  soLuongMcaTaiTruong: number;
  soLuongMccThue: number;
  soLuongDtLeasedLine: number;
  dungLuongDtInternetTrongNuoc: number;
  dungLuongDtInternetQuocTe: number;
  soLuongSwitchTang: number;
  soLuongThietBiWifi: number;
  soLuongThietBiCamera: number;
  soLuongTddtThuocPvt: number;
  soLuongTrangWeb: number;
  soLuongPhanMem: number;
  soLuongTtdcpChoSv: number;
  soLuongTtdcpChoNguoiHoc: number;
  soLuongTtdcpChoNld: number;
  soLuongThietBiCuaTu: number;
  soLuongHtCntt: number;
  thongTinHTCSDL: ThongTinHTCSDLBackEnd[];
  thongTinTuongLua: ThongTinTuongLuaBackEnd[];
  thongtinPmdv: ThongTinPMDVBackEnd[];
  thongKeHTCSDL: ThongKeHTCSDLBackEnd[];
  thongKeTuongLua: ThongKeTuongLuaBackEnd[];
  thongKePmdv: ThongKePMDVBackEnd[];
}

export interface ThongKeMuaSamMMTBBackEnd {
  idBaoCao?: number;
  idMmtb?: number;
  soLuongMmtb: number;
  tongChiPhi: number;
}

export enum EquipmentCategory {
  DIEN = "Điện",
  NUOC = "Nước",
  KHAC = "Khác"
}

export interface ThongTinMMTBBackEnd {
  idMmtb?: number;
  loaiMmtb: EquipmentCategory;
  tenMmtb: string;
}

export interface BCPhongCSVCPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongDatDai: number;
  soLuongCongTrinh: number;
  soLuongHthtkt: number;
  soLuongCxcq: number;
  thongTinMmtb: ThongTinMMTBBackEnd[];
  thongKeMmtb: ThongKeMuaSamMMTBBackEnd[];
}

export interface BCPhongHCTHPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongVanBanDen: number;
  soLuongVanBanDi: number;
  soLuongVanBanMat: number;
  soLuongCtsyVbgtct: number;
  soLuongCapPhatVb: number;
  soLuongCapPhatCc: number;
  soLuongBcCthcqtdk: number;
  soLuongBcCthcqtdx: number;
  soLuongDinhMucSuDungVpp: number;
  soLuongHsltTlltTaiTruong: number;
  soLuongHsltTlltNopKlt: number;
}

export interface BCPhongKHCNHTPTPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongDtnckhccTruong: number;
  soLuongDtnckhccVcNld: number;
  soLuongChuyenGiaoKqnckk: number;
  soLieuHdxtCbqt: number;
  soLuongHtHnkhcttl: number;
  soLuongDahtqtVeNckhvdt: number;
  thongKeDoanRa: number;
  thongKeDoanVao: number;
  soLuongKyHopTacTctn: number;
  soLuongKyHopTacTcnn: number;
}

export interface BCPhongTRPCPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongCtkhTtpcDinhKy: number;
  soLuongCtkhTtpcDotXuat: number;
  soLuongCttcCtkhTtpcDinhKy: number;
  soLuongCttcCtkhTtpcDotXuat: number
  soLuongCttcd: number;
  soLuongCtgqkntc: number;
  soLuongCtpctn: number;
  soLuongVxmVb: number;
  soLuongVxmCc: number;
}

export interface BCPhongTTQHDNPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongTtthUlaw: number;
  soLuongHath: number;
  soLuongKhtt: number;
  soLuongKsttvl: number;
  soLuongCtttktDn: number;
  soLuongCsvUlaw: number;
}

export interface BCPhongTCKTPayLoad {
  baoCao: BaoCaoBackEnd;
  thongKeThuHpKpn: number;
  thongKeBctcNam: number;
  thongKeBcqtNam: number;
  thongKeDmktkt: number;
}

export interface BCPhongTVTSPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongKhTvtshn: number;
  soLuongCttcTvtshn: number;
  soLuongKhTt: number;
  soLuongCttcTt: number;
  soLuongLuotTvts: number;
  soLuongHdcsnh: number;
}

export interface BCPhongTCNSPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongHdm: number;
  soLuongHdtl: number;
  soLuongTtCtv: number;
  tongSoVc: number;
  tongSoVcNam: number;
  tongSoVcNu: number;
  tongSoCtv: number;
  tongSoHhGs: number;
  tongSoHhPgs: number;
  tongSoHvTs: number;
  tongSoHvThs: number;
  tongSoHvDH: number;
  tongSoHvDdh: number;
  tongSoGvch: number;
  tongSoGvtg: number;
  tongSoTuoiBinhQuan: number;
  tongSoThuNhapBinhQuan: number;
  soLuongQh: number;
  soLuongQhbs: number;
  soLieuBn: number;
  soLieuBnl: number;
  soLieuKdcv: number;
  soLieuTcv: number;
  soLieuTuChuc: number;
  soLieuMienNhiem: number;
  soLieuCdct: number;
  soLieuBnCdnn: number;
  soLieuChuyenHangCdnn: number;
  soLieuThangHangCdnn: number;
  soLieuDtcmnv: number;
  soLieuDtnctd: number;
  soLieuDtllct: number;
  soLieuDtnn: number;
  soLieuNbltx: number;
  soLieuNblth: number;
  soLieuNblvk: number;
  soLieuNblkd: number;
  soLieuNpctnng: number;
  soLieuNcdbhht: number;
  soLieuThoiViec: number;
  soLieuChuyenCongTac: number;
  soLieuKkts: number;
  soLieuCstd: number;
  soLieuLdtt: number;
  soLieuHtxs: number;
  soLieuHtt: number;
  soLieuHtnv: number;
  soLieuKhtnv: number;
  soLieuBkl: number;
  soLieuDkt: number;
  soLuongTtLdtt: number;
  soLuongTtHtxs: number;
  soLuongTtHtt: number;
  soLuongTtHtnv: number;
  soLuongTtKhtnv: number;
  soLuongTtDkt: number
}

export interface BCPhongDTSDHPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongMndt: number;
  soLuongCtdt: number;
  trinhDoDaoTao: string;
  soLuongCtts: number;
  soLuongHvsdh: number;
  soLuongHvch: number;
  soLuongNcstn: number;
  soLuongHvsdhcdh: number;
  soLuongLbdCcsdh: number;
}

export interface BCPhongDTDHPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongMndt: number;
  soLuongCtdt: number;
  soLuongCtts: number;
  soLieuSvnh: number;
  soLieuSvtn: number;
}

export interface BCPhongDBCLKTPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongKhdbcldth: number;
  soLuongKhdbcldrsdc: number;
  soLuongKhdbcldtk: number;
  soLuongKhksDv: number;
  soLuongKhctCsgd: number;
  soLuongKhctCtdt: number;
  soLuongHtvbDbcldcn: number;
  soLuongHtThGvm: number;
  soLuongHtHnTdct: number;
  soLuongVbhttn: number;
  soLuongVbhtnn: number;
  soLuongDtkthpdis: number;
  soLuongCbctKthp: number;
  soLuongCbctvpqc: number;
  soLuongSvvpqc: number;
  soLuongBtdc: number;
  soLuongBtdql: number;
  soLuongGvctvpqc: number;
  soLuongThCtctKtph: number;
}

export interface BCThuVienPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongDtnckhdnt: number;
  soLuongNdtntc: number;
  soLuongNgtntx: number;
}

export interface BCTrungtamHLPayLoad {
  baoCao: BaoCaoBackEnd;
  soTenGt: number;
  soCuongGt: number;
  soTenTbg: number;
  soCuonTbg: number;
  soTenSth: number;
  soCuonSth: number;
  soTenSck: number;
  soCuonSck: number;
  soTenStk: number;
  soCuonStk: number;
  soTenSkgGv: number;
  soCuonSkgGv: number;
  soTenSkgTcCnKhac: number;
  coCuonSkgTcCnKhac: number;
  doanhThuTuSach: number;
  thuLaoTuSkg: number;
}

export interface BCTrungTamTVPLPVCDPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongDvtnCn: number;
  soLuongDvtnTc: number;
  soLuongHtpl: number;
  soLuongHdttpbpl: number;
  soLuongLienKettn: number;
  soLuongLienKetnn: number;
}

export interface BCVanPhongPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongHsptd: number;
  soLuonghscdct: number;
  soLuongHskt: number;
  soLuongHskl: number;
  soLuongDvct: number;
  soLuongDvdb: number;
  soLuongDvvpkl: number;
  soLuongVtltCtd: number;
  soLuongVtltCtcd: number;
  soLuongVtltKhac: number;
}

export interface BCVienLSSPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongNckhLss: number;
  soLuongNckhLnn: number;
  soLuongNckhKhac: number;
}

export interface BCVienSHTTKNDMSTPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongHdtvtkCtdtnh: number;
  soLuongKdtnh: number;
  soLuongKth: number;
  tyLeHvtn: number;
}

export interface BCVienDTQTPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongSvClcTddhHtcq: number;
  soLuongToChucCtnkclc: number;
  soLuongToChucCttdTcClc: number;
  soLuongToChucCtdtbdccqtClc: number;
  soLuongToChucCtttckClc: number;
  soLuongHdttvdhSauDhClc: number;
}

export interface BCVienDTBDPayLoad {
  baoCao: BaoCaoBackEnd;
  soLuongKhnh: number;
  soLuongNsddtbdHangNam: number;
  soLuongCqDnTcddtbd: number;
  soLuongCaNhanddtbd: number;
  soLuongNhuCauddtbdNn: number;
  soLuongNhuCauddtbdNnpl: number;
  soLuongNhuCauddtbdTh: number;
  soLuongCttcktnlNn: number;
  soLuongCttcktnlTh: number;
}