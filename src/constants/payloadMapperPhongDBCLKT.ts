import {
  BCPhongDBCLKTPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongDBCLKT = (formData: any, userInfo: any): BCPhongDBCLKTPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'PhongTrungtam',
  };

  const donVi: DonViBackEnd = {
    capDonVi: 'PhongDBCLKT',
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
    soLuongKhdbcldth: Number(formData.soLuongKhdbcldth) || 0,
    soLuongKhdbcldrsdc: Number(formData.soLuongKhdbcldrsdc) || 0,
    soLuongKhdbcldtk: Number(formData.soLuongKhdbcldtk) || 0,
    soLuongKhksDv: Number(formData.soLuongKhksDv) || 0,
    soLuongKhctCsgd: Number(formData.soLuongKhctCsgd) || 0,
    soLuongKhctCtdt: Number(formData.soLuongKhctCtdt) || 0,
    soLuongHtvbDbcldcn: Number(formData.soLuongHtvbDbcldcn) || 0,
    soLuongHtThGvm: Number(formData.soLuongHtThGvm) || 0,
    soLuongHtHnTdct: Number(formData.soLuongHtHnTdct) || 0,
    soLuongVbhttn: Number(formData.soLuongVbhttn) || 0,
    soLuongVbhtnn: Number(formData.soLuongVbhtnn) || 0,
    soLuongDtkthpdis: Number(formData.soLuongDtkthpdis) || 0,
    soLuongCbctKthp: Number(formData.soLuongCbctKthp) || 0,
    soLuongCbctvpqc: Number(formData.soLuongCbctvpqc) || 0,
    soLuongSvvpqc: Number(formData.soLuongSvvpqc) || 0,
    soLuongBtdc: Number(formData.soLuongBtdc) || 0,
    soLuongBtdql: Number(formData.soLuongBtdql) || 0,
    soLuongGvctvpqc: Number(formData.soLuongGvctvpqc) || 0,
    soLuongThCtctKtph: Number(formData.soLuongThCtctKtph) || 0,
  }
};
