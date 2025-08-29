import {
  BCPhongCTSVPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongCTSV = (formData: any): BCPhongCTSVPayLoad => {
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
    soLuongGtxncnChoSvTdDh: Number(formData.soLuongGtxncnChoSvTdDh) || 0,
    soLuongGtKhacChoSvTdDh: Number(formData.soLuongGtKhacChoSvTdDh) || 0,
    soLuongSvdkt: Number(formData.soLuongSvdkt) || 0,
    soLuongSvbkl: Number(formData.soLuongSvbkl) || 0,
    soLuongSvdchb: Number(formData.soLuongSvdchb) || 0,
    soLuongSvdmghp: Number(formData.soLuongSvdmghp) || 0,
    soLuongSvdhtcpht: Number(formData.soLuongSvdhtcpht) || 0,
    soLuongSvdtcxh: Number(formData.soLuongSvdtcxh) || 0,
    soLuongDonThuCuaSv: Number(formData.soLuongDonThuCuaSv) || 0,
    thongKeHangNamVeSvTheoQdcpl: Number(formData.thongKeHangNamVeSvTheoQdcpl) || 0,
  };
};
