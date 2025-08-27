import {
  BCPhongDTSDHPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongDTSDH = (formData: any, userInfo: any): BCPhongDTSDHPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'PhongTrungtam',
  };

  const donVi: DonViBackEnd = {
    capDonVi: 'PhongDTSDH',
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
    soLuongMndt: Number(formData.soLuongMndt) || 0,
    soLuongCtdt: Number(formData.soLuongCtdt) || 0,
    trinhDoDaoTao: formData.trinhDoDaoTao || '',
    soLuongCtts: Number(formData.soLuongCtts) || 0,
    soLuongHvsdh: Number(formData.soLuongHvsdh) || 0,
    soLuongHvch: Number(formData.soLuongHvch) || 0,
    soLuongNcstn: Number(formData.soLuongNcstn) || 0,
    soLuongHvsdhcdh: Number(formData.soLuongHvsdhcdh) || 0,
    soLuongLbdCcsdh: Number(formData.soLuongLbdCcsdh) || 0,
  };
};
