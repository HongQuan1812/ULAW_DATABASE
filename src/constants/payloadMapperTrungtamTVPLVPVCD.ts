import {
  BCTrungTamTVPLPVCDPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCTrungtamTVPLPVCD = (formData: any, userInfo: any): BCTrungTamTVPLPVCDPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'PhongTrungtam',
  };

  const donVi: DonViBackEnd = {
    capDonVi: 'TrungTamTVPLPVCD',
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
    soLuongDvtnCn: Number(formData.soLuongDvtnCn) || 0,
    soLuongDvtnTc: Number(formData.soLuongDvtnTc) || 0,
    soLuongHtpl: Number(formData.soLuongHtpl) || 0,
    soLuongHdttpbpl: Number(formData.soLuongHdttpbpl) || 0,
    soLuongLienKettn: Number(formData.soLuongLienKettn) || 0,
    soLuongLienKetnn: Number(formData.soLuongLienKetnn) || 0,
  };
};
