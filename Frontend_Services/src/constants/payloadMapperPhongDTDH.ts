import {
  BCPhongDTDHPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongDTDH = (formData: any): BCPhongDTDHPayLoad => {
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
    soLuongMndt: Number(formData.soLuongMndt) || 0,
    soLuongCtdt: Number(formData.soLuongCtdt) || 0,
    soLuongCtts: Number(formData.soLuongCtts) || 0,
    soLieuSvnh: Number(formData.soLieuSvnh) || 0,
    soLieuSvtn: Number(formData.soLieuSvtn) || 0,
  }
};
