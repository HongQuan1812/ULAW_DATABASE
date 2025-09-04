import {
  BCPhongTCKTPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongTCKT = (formData: any): BCPhongTCKTPayLoad => {
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
    thongKeThuHpKpn: Number(formData.thongKeThuHpKpn) || 0,
    thongKeBctcNam: Number(formData.thongKeBctcNam) || 0,
    thongKeBcqtNam: Number(formData.thongKeBcqtNam) || 0,
    thongKeDmktkt: Number(formData.thongKeDmktkt) || 0,
  };
};
