import {
  BCVanPhongPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCVanPhong = (formData: any): BCVanPhongPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'VanPhong',
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
    soLuongHsptd: Number(formData.soLuongHsptd) || 0,
    soLuonghscdct: Number(formData.soLuonghscdct) || 0,
    soLuongHskt: Number(formData.soLuongHskt) || 0,
    soLuongHskl: Number(formData.soLuongHskl) || 0,
    soLuongDvct: Number(formData.soLuongDvct) || 0,
    soLuongDvdb: Number(formData.soLuongDvdb) || 0,
    soLuongDvvpkl: Number(formData.soLuongDvvpkl) || 0,
    soLuongVtltCtd: Number(formData.soLuongVtltCtd) || 0,
    soLuongVtltCtcd: Number(formData.soLuongVtltCtcd) || 0,
    soLuongVtltKhac: Number(formData.soLuongVtltKhac) || 0,
  };
};
