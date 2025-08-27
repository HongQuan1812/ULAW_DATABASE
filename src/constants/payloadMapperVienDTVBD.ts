import {
  BCVienDTBDPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCVienDTBD = (formData: any, userInfo: any): BCVienDTBDPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'Vien',
  };

  const donVi: DonViBackEnd = {
    capDonVi: 'VienDTBD',
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
    soLuongKhnh: Number(formData.soLuongKhnh) || 0,
    soLuongNsddtbdHangNam: Number(formData.soLuongNsddtbdHangNam) || 0,
    soLuongCqDnTcddtbd: Number(formData.soLuongCqDnTcddtbd) || 0,
    soLuongCaNhanddtbd: Number(formData.soLuongCaNhanddtbd) || 0,
    soLuongNhuCauddtbdNn: Number(formData.soLuongNhuCauddtbdNn) || 0,
    soLuongNhuCauddtbdNnpl: Number(formData.soLuongNhuCauddtbdNnpl) || 0,
    soLuongNhuCauddtbdTh: Number(formData.soLuongNhuCauddtbdTh) || 0,
    soLuongCttcktnlNn: Number(formData.soLuongCttcktnlNn) || 0,
    soLuongCttcktnlTh: Number(formData.soLuongCttcktnlTh) || 0,
  };
};
