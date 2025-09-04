import {
  BCThuVienPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCThuVien = (formData: any): BCThuVienPayLoad => {
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
    soLuongDtnckhdnt: Number(formData.soLuongDtnckhdnt) || 0,
    soLuongDtnckhdntK: Number(formData.soLuongDtnckhdntK) || 0,
    soLuongNdtntc: Number(formData.soLuongNdtntc) || 0,
    soLuongNgtntx: Number(formData.soLuongNgtntx) || 0,
  };
};
