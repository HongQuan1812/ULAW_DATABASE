import {
  BCPhongTVTSPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongTVTS = (formData: any): BCPhongTVTSPayLoad => {
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
    soLuongKhTvtshn: Number(formData.soLuongKhTvtshn) || 0,
    soLuongCttcTvtshn: Number(formData.soLuongCttcTvtshn) || 0,
    soLuongKhTt: Number(formData.soLuongKhTt) || 0,
    soLuongCttcTt: Number(formData.soLuongCttcTt) || 0,
    soLuongLuotTvts: Number(formData.soLuongLuotTvts) || 0,
    soLuongHdcsnh: Number(formData.soLuongHdcsnh) || 0,
  };
};
