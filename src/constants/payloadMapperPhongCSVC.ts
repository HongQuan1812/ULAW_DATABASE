import {
  BCPhongCSVCPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  EquipmentCategory,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongCSVC = (formData: any, userInfo: any): BCPhongCSVCPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'PhongTrungtam',
  };

  const donVi: DonViBackEnd = {
    capDonVi: 'PhongCSVC',
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

  const thongTinMmtb = (formData.mmtbList || []).map((item: any, idx: number) => ({
    tenMmtb: item.tenMmtb || '',
    loaiMmtb: item.loaiMmtb as EquipmentCategory,
  }));

  const thongKeMmtb = (formData.mmtbList || []).map((item: any, idx: number) => ({
    soLuongMmtb: Number(item.soLuongMmtb),
    tongChiPhi: Number(item.tongChiPhi),
  }));

  return {
    baoCao,
    soLuongDatDai: Number(formData.soLuongDatDai) || 0,
    soLuongCongTrinh: Number(formData.soLuongCongTrinh) || 0,
    soLuongHthtkt: Number(formData.soLuongHthtkt) || 0,
    soLuongCxcq: Number(formData.soLuongCxcq) || 0,
    thongTinMmtb,
    thongKeMmtb,
  }
};
