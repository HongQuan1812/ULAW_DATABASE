import {
  BCPhongCSDLCNTTPayLoad,
  BaoCaoBackEnd,
  DonViBackEnd,
  ToChucBackEnd,
  NguoiBaoCaoBackEnd,
} from '@/services/data_info';

export const buildPayloadBCPhongCSDLCNTT = (
  formData: any,
  userInfo: any,
): BCPhongCSDLCNTTPayLoad => {
  const toChuc: ToChucBackEnd = {
    capToChuc: 'PhongTrungtam',
  };

  const donVi: DonViBackEnd = {
    capDonVi: 'PhongCSDLCNTT',
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

  const thongTinHTCSDL = (formData.htCsdlList || []).map((item: any, idx: number) => ({
    tenHtCsdl: item.tenHtCsdl || '',
  }));

  const thongKeHTCSDL = (formData.htCsdlList || []).map((item: any, idx: number) => ({
    soLuongCsdl: Number(item.soLuongCsdl),
  }));

  const thongTinTuongLua = (formData.tuongLuaList || []).map((item: any, idx: number) => ({
    tenTuongLua: item.tenTuongLua || '',
  }));

  const thongKeTuongLua = (formData.tuongLuaList || []).map((item: any, idx: number) => ({
    soLuongTuongLua: Number(item.soLuongTuongLua),
  }));

  const thongtinPmdv = (formData.pmdvList || []).map((item: any, idx: number) => ({
    tenPmdv: item.tenPmdv || '',
  }));

  const thongKePmdv = (formData.pmdvList || []).map((item: any, idx: number) => ({
    soLuongPmdv: Number(item.soLuongPmdv),
  }));

  return {
    baoCao,
    soLuongMcvlTaiTruong: Number(formData.soLuongMcvlTaiTruong) || 0,
    soLuongMcaTaiTruong: Number(formData.soLuongMcaTaiTruong) || 0,
    soLuongMccThue: Number(formData.soLuongMccThue) || 0,
    soLuongDtLeasedLine: Number(formData.soLuongDtLeasedLine) || 0,
    dungLuongDtInternetTrongNuoc: Number(formData.dungLuongDtInternetTrongNuoc) || 0,
    dungLuongDtInternetQuocTe: Number(formData.dungLuongDtInternetQuocTe) || 0,
    soLuongSwitchTang: Number(formData.soLuongSwitchTang) || 0,
    soLuongThietBiWifi: Number(formData.soLuongThietBiWifi) || 0,
    soLuongThietBiCamera: Number(formData.soLuongThietBiCamera) || 0,
    soLuongTddtThuocPvt: Number(formData.soLuongTddtThuocPvt) || 0,
    soLuongTrangWeb: Number(formData.soLuongTrangWeb) || 0,
    soLuongPhanMem: Number(formData.soLuongPhanMem) || 0,
    soLuongTtdcpChoSv: Number(formData.soLuongTtdcpChoSv) || 0,
    soLuongTtdcpChoNguoiHoc: Number(formData.soLuongTtdcpChoNguoiHoc) || 0,
    soLuongTtdcpChoNld: Number(formData.soLuongTtdcpChoNld) || 0,
    soLuongThietBiCuaTu: Number(formData.soLuongThietBiCuaTu) || 0,
    soLuongHtCntt: Number(formData.soLuongHtCntt) || 0,
    thongTinHTCSDL,
    thongKeHTCSDL,
    thongTinTuongLua,
    thongKeTuongLua,
    thongtinPmdv,
    thongKePmdv,
  };
};
