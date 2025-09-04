import {
  BCVienSHTTKNDMSTPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCVienSHTTKNDMST = (formData: any): BCVienSHTTKNDMSTPayLoad => {
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
    soLuongHdtvtkCtdtnh: Number(formData.soLuongHdtvtkCtdtnh) || 0,
    soLuongKdtnh: Number(formData.soLuongKdtnh) || 0,
    soLuongKth: Number(formData.soLuongKth) || 0,
    tyLeHvtn: Number(formData.tyLeHvtn) || 0,
  };
};
