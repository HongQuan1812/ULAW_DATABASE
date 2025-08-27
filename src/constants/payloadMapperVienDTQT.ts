import {
  BCVienDTQTPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCVienDTQT = (formData: any, userInfo: any): BCVienDTQTPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'Vien',
  };

  const donVi: DonViBackEnd = {
    capDonVi: 'VienDTQT',
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
    soLuongSvClcTddhHtcq: Number(formData.soLuongSvClcTddhHtcq) || 0,
    soLuongToChucCtnkclc: Number(formData.soLuongToChucCtnkclc) || 0,
    soLuongToChucCttdTcClc: Number(formData.soLuongToChucCttdTcClc) || 0,
    soLuongToChucCtdtbdccqtClc: Number(formData.soLuongToChucCtdtbdccqtClc) || 0,
    soLuongToChucCtttckClc: Number(formData.soLuongToChucCtttckClc) || 0,
    soLuongHdttvdhSauDhClc: Number(formData.soLuongHdttvdhSauDhClc) || 0,
  };
};
