import {
  BCPhongKHCNHTPTPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongKHCNHTPT = (formData: any): BCPhongKHCNHTPTPayLoad => {
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
    soLuongDtnckhccTruong: Number(formData.soLuongDtnckhccTruong) || 0,
    soLuongDtnckhccVcNld: Number(formData.soLuongDtnckhccVcNld) || 0,
    soLuongChuyenGiaoKqnckk: Number(formData.soLuongChuyenGiaoKqnckk) || 0,
    soLieuHdxtCbqt: Number(formData.soLieuHdxtCbqt) || 0,
    soLuongHtHnkhcttl: Number(formData.soLuongHtHnkhcttl) || 0,
    soLuongDahtqtVeNckhvdt: Number(formData.soLuongDahtqtVeNckhvdt) || 0,
    thongKeDoanRa: Number(formData.thongKeDoanRa) || 0,
    thongKeDoanVao: Number(formData.thongKeDoanVao) || 0,
    soLuongCtKhcn: Number(formData.soLuongCtKhcn) || 0,
    soLuongKyHopTacTctn: Number(formData.soLuongKyHopTacTctn) || 0,
    soLuongKyHopTacTcnn: Number(formData.soLuongKyHopTacTcnn) || 0,
  };
};
