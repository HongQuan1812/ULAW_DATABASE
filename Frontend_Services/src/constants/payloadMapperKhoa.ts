import {
  BCKhoaPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
  DanhMucNganhBackEnd,
} from '@/services/data_info';

export const buildPayloadBCKhoa = (formData: any): BCKhoaPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'Khoa',
  };

  const donViList: Record<number, string> = {
    1: 'Khoa Luật Dân sự',
    2: 'Khoa Luật Hình sự',
    3: 'Khoa Luật Thương mại',
    4: 'Khoa Luật Quốc tế',
    5: 'Khoa Luật Hành chính - Nhà nước',
    6: 'Khoa Quản trị',
    7: 'Khoa Ngoại ngữ pháp lý',
    8: 'Khoa Khoa học cơ bản',
  };

  const donVi: DonViBackEnd = {
    idDonVi: formData.idDonVi,
    capDonVi: donViList[formData.idDonVi],
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

  const nganhList: Record<number, string> = {
    7220201: 'Ngôn ngữ Anh',
    7380101: 'Luật',
    7380109: 'Luật thương mại quốc tế',
    7340102: 'Quản trị - Luật',
    7340101: 'Quản trị kinh doanh',
    7340120: 'Kinh doanh quốc tế',
    7340201: 'Tài chính - Ngân hàng',
  };

  const danhMucNganh: DanhMucNganhBackEnd[] = (formData.idNganh || []).map((id: number) => ({
    idNganh: id,
    tenNganh: nganhList[id],
  }));

  return {
    baoCao,
    soLuongGvch: Number(formData.soLuongGvch) || 0,
    soLuongGvtg: Number(formData.soLuongGvtg) || 0,
    soLuongNld: Number(formData.soLuongNld) || 0,
    danhMucNganh,
    tongSoMhk: Number(formData.tongSoMhk) || 0,
    fileDmmh: formData.fileDmmh || '',
    soCtdtCanCaiTien: Number(formData.soCtdtCanCaiTien) || 0,
    soCtdtXayDungMoi: Number(formData.soCtdtXayDungMoi) || 0,
    soTlgtCanChinhSua: Number(formData.soTlgtCanChinhSua) || 0,
    soTlgtBienSoanMoi: Number(formData.soTlgtBienSoanMoi) || 0,
    soGvCanDtbd: Number(formData.soGvCanDtbd) || 0,
    soGvCanTuyenMoi: Number(formData.soGvCanTuyenMoi) || 0,
  };
};
