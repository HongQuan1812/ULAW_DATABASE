import {
  BCPhongTTPCPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongTTPC = (formData: any): BCPhongTTPCPayLoad => {
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
    soLuongCtkhTtpcDinhKy: Number(formData.soLuongCtkhTtpcDinhKy) || 0,
    soLuongCtkhTtpcDotXuat: Number(formData.soLuongCtkhTtpcDotXuat) || 0,
    soLuongCttcCtkhTtpcDinhKy: Number(formData.soLuongCttcCtkhTtpcDinhKy) || 0,
    soLuongCttcCtkhTtpcDotXuat: Number(formData.soLuongCttcCtkhTtpcDotXuat) || 0,
    soLuongCttcd: Number(formData.soLuongCttcd) || 0,
    soLuongCtgqkntc: Number(formData.soLuongCtgqkntc) || 0,
    soLuongCtpctn: Number(formData.soLuongCtpctn) || 0,
    soLuongVxmVb: Number(formData.soLuongVxmVb) || 0,
    soLuongVxmCc: Number(formData.soLuongVxmCc) || 0,
  };
};
