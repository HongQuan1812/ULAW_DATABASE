import {
  BCPhongTCNSPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongTCNS = (formData: any, userInfo: any): BCPhongTCNSPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'PhongTrungtam',
  };

  const donVi: DonViBackEnd = {
    capDonVi: 'PhongTCNS',
    toChuc,
  };

  const nguoiBaoCao: NguoiBaoCaoBackEnd = {
    hoVaTen: userInfo?.hoVaTen || '',
    email: userInfo?.email || '',
    chucVu: formData.chucVu || '',
  };

  const baoCao: BaoCaoBackEnd = {
    nguoiBaoCao,
    donVi,
    namBaoCao: formData.namBaoCao,
    giaiDoan: formData.giaiDoan,
  };

  return {
    baoCao,
    soLuongHdm: Number(formData.soLuongHdm) || 0,
    soLuongHdtl: Number(formData.soLuongHdtl) || 0,
    soLuongTtCtv: Number(formData.soLuongTtCtv) || 0,
    tongSoVc: Number(formData.tongSoVc) || 0,
    tongSoVcNam: Number(formData.tongSoVcNam) || 0,
    tongSoVcNu: Number(formData.tongSoVcNu) || 0,
    tongSoCtv: Number(formData.tongSoCtv) || 0,
    tongSoHhGs: Number(formData.tongSoHhGs) || 0,
    tongSoHhPgs: Number(formData.tongSoHhPgs) || 0,
    tongSoHvTs: Number(formData.tongSoHvTs) || 0,
    tongSoHvThs: Number(formData.tongSoHvThs) || 0,
    tongSoHvDH: Number(formData.tongSoHvDH) || 0,
    tongSoHvDdh: Number(formData.tongSoHvDdh) || 0,
    tongSoGvch: Number(formData.tongSoGvch) || 0,
    tongSoGvtg: Number(formData.tongSoGvtg) || 0,
    tongSoTuoiBinhQuan: Number(formData.tongSoTuoiBinhQuan) || 0,
    tongSoThuNhapBinhQuan: Number(formData.tongSoThuNhapBinhQuan) || 0,
    soLuongQh: Number(formData.soLuongQh) || 0,
    soLuongQhbs: Number(formData.soLuongQhbs) || 0,
    soLieuBn: Number(formData.soLieuBn) || 0,
    soLieuBnl: Number(formData.soLieuBnl) || 0,
    soLieuKdcv: Number(formData.soLieuKdcv) || 0,
    soLieuTcv: Number(formData.soLieuTcv) || 0,
    soLieuTuChuc: Number(formData.soLieuTuChuc) || 0,
    soLieuMienNhiem: Number(formData.soLieuMienNhiem) || 0,
    soLieuCdct: Number(formData.soLieuCdct) || 0,
    soLieuBnCdnn: Number(formData.soLieuBnCdnn) || 0,
    soLieuChuyenHangCdnn: Number(formData.soLieuChuyenHangCdnn) || 0,
    soLieuThangHangCdnn: Number(formData.soLieuThangHangCdnn) || 0,
    soLieuDtcmnv: Number(formData.soLieuDtcmnv) || 0,
    soLieuDtnctd: Number(formData.soLieuDtnctd) || 0,
    soLieuDtllct: Number(formData.soLieuDtllct) || 0,
    soLieuDtnn: Number(formData.soLieuDtnn) || 0,
    soLieuNbltx: Number(formData.soLieuNbltx) || 0,
    soLieuNblth: Number(formData.soLieuNblth) || 0,
    soLieuNblvk: Number(formData.soLieuNblvk) || 0,
    soLieuNblkd: Number(formData.soLieuNblkd) || 0,
    soLieuNpctnng: Number(formData.soLieuNpctnng) || 0,
    soLieuNcdbhht: Number(formData.soLieuNcdbhht) || 0,
    soLieuThoiViec: Number(formData.soLieuThoiViec) || 0,
    soLieuChuyenCongTac: Number(formData.soLieuChuyenCongTac) || 0,
    soLieuKkts: Number(formData.soLieuKkts) || 0,
    soLieuCstd: Number(formData.soLieuCstd) || 0,
    soLieuLdtt: Number(formData.soLieuLdtt) || 0,
    soLieuHtxs: Number(formData.soLieuHtxs) || 0,
    soLieuHtt: Number(formData.soLieuHtt) || 0,
    soLieuHtnv: Number(formData.soLieuHtnv) || 0,
    soLieuKhtnv: Number(formData.soLieuKhtnv) || 0,
    soLieuBkl: Number(formData.soLieuBkl) || 0,
    soLieuDkt: Number(formData.soLieuDkt) || 0,
    soLuongTtLdtt: Number(formData.soLuongTtLdtt) || 0,
    soLuongTtHtxs: Number(formData.soLuongTtHtxs) || 0,
    soLuongTtHtt: Number(formData.soLuongTtHtt) || 0,
    soLuongTtHtnv: Number(formData.soLuongTtHtnv) || 0,
    soLuongTtKhtnv: Number(formData.soLuongTtKhtnv) || 0,
    soLuongTtDkt: Number(formData.soLuongTtDkt) || 0,
  };
};
