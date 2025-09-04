import {
  BCVienLSSPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCVienLSS = (formData: any): BCVienLSSPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'Vien',
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
    soLuongNckhLss: Number(formData.soLuongNckhLss) || 0,
    soLuongNckhLnn: Number(formData.soLuongNckhLnn) || 0,
    soLuongNckhKhac: Number(formData.soLuongNckhKhac) || 0,
  };
};
