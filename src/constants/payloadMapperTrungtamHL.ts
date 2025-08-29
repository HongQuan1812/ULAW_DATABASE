import {
  BCTrungtamHLPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCTrungtamHL = (formData: any): BCTrungtamHLPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'PhongTrungtam',
  };

  const donVi: DonViBackEnd = {
    capDonVi: formData.capDonVi || '',
    toChuc,
  };

  const nguoiBaoCao: NguoiBaoCaoBackEnd = {
    hoVaTen: formData.hoVaTen || '',
    email: formData.email || '',
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
    soTenGt: Number(formData.soTenGt) || 0,
    soCuongGt: Number(formData.soCuongGt) || 0,
    soTenTbg: Number(formData.soTenTbg) || 0,
    soCuonTbg: Number(formData.soCuonTbg) || 0,
    soTenSth: Number(formData.soTenSth) || 0,
    soCuonSth: Number(formData.soCuonSth) || 0,
    soTenSck: Number(formData.soTenSck) || 0,
    soCuonSck: Number(formData.soCuonSck) || 0,
    soTenStk: Number(formData.soTenStk) || 0,
    soCuonStk: Number(formData.soCuonStk) || 0,
    soTenSkgGv: Number(formData.soTenSkgGv) || 0,
    soCuonSkgGv: Number(formData.soCuonSkgGv) || 0,
    soTenSkgTcCnKhac: Number(formData.soTenSkgTcCnKhac) || 0,
    coCuonSkgTcCnKhac: Number(formData.coCuonSkgTcCnKhac) || 0,
    doanhThuTuSach: Number(formData.doanhThuTuSach) || 0,
    thuLaoTuSkg: Number(formData.thuLaoTuSkg) || 0,
  };
};
