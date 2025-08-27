import {
  BCPhongHCTHPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongHCTH = (formData: any, userInfo: any): BCPhongHCTHPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'PhongTrungtam',
  };

  const donVi: DonViBackEnd = {
    capDonVi: 'PhongHCTH',
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
    soLuongVanBanDen: Number(formData.soLuongVanBanDen) || 0,
    soLuongVanBanDi: Number(formData.soLuongVanBanDi) || 0,
    soLuongVanBanMat: Number(formData.soLuongVanBanMat) || 0,
    soLuongCtsyVbgtct: Number(formData.soLuongCtsyVbgtct) || 0,
    soLuongCapPhatVb: Number(formData.soLuongCapPhatVb) || 0,
    soLuongCapPhatCc: Number(formData.soLuongCapPhatCc) || 0,
    soLuongBcCthcqtdk: Number(formData.soLuongBcCthcqtdk) || 0,
    soLuongBcCthcqtdx: Number(formData.soLuongBcCthcqtdx) || 0,
    soLuongDinhMucSuDungVpp: Number(formData.soLuongDinhMucSuDungVpp) || 0,
    soLuongHsltTlltTaiTruong: Number(formData.soLuongHsltTlltTaiTruong) || 0,
    soLuongHsltTlltNopKlt: Number(formData.soLuongHsltTlltNopKlt) || 0,
  };
};
