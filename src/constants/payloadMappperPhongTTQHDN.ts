import {
  BCPhongTTQHDNPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongTTQHDN = (formData: any, userInfo: any): BCPhongTTQHDNPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'PhongTrungtam',
  };

  const donVi: DonViBackEnd = {
    capDonVi: 'PhongTTQHDN',
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
    soLuongTtthUlaw: Number(formData.soLuongTtthUlaw) || 0,
    soLuongHath: Number(formData.soLuongHath) || 0,
    soLuongKhtt: Number(formData.soLuongKhtt) || 0,
    soLuongKsttvl: Number(formData.soLuongKsttvl) || 0,
    soLuongCtttktDn: Number(formData.soLuongCtttktDn) || 0,
    soLuongCsvUlaw: Number(formData.soLuongCsvUlaw) || 0,
  };
};
