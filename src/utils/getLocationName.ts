export function getLocationName(pathname: string): string {
  const mapping: Record<string, string> = {
    '/phong-trungtam/thuvien': 'Thư viện',
    '/phong-trungtam/phong-tcns': 'Phòng Tổ chức nhân sự',
    '/phong-trungtam/trungtam-tvpl-pvcd': 'Trung tâm Tư vấn Pháp luật & Phục vụ cộng đồng',
    '/phong-trungtam/trungtam-hl': 'Trung tâm Học liệu',
    '/phong-trungtam/phong-tvts': 'Phòng Tư vấn tuyển sinh',
    '/phong-trungtam/phong-tt-qhdn': 'Phòng Truyền thông & Quan hệ doanh nghiệp',
    '/phong-trungtam/phong-tt-pc': 'Phòng Thanh tra - Pháp chế',
    '/phong-trungtam/phong-tc-kt': 'Phòng Tài chính - Kế toán',
    '/phong-trungtam/phong-khcn-htpt': 'Phòng Khoa học công nghệ & Hợp tác phát triển',
    '/phong-trungtam/phong-hc-th': 'Phòng Hành chính - Tổng hợp',
    '/phong-trungtam/phong-dtsdh': 'Phòng Đào tạo Sau đại học',
    '/phong-trungtam/phong-dtdh': 'Phòng Đào tạo Đại học',
    '/phong-trungtam/phong-dbcl-kt': 'Phòng Đảm bảo chất lượng & Khảo thí',
    '/phong-trungtam/phong-ctsv': 'Phòng Công tác sinh viên',
    '/phong-trungtam/phong-csvc': 'Phòng Cơ sở vật chất',
    '/phong-trungtam/phong-csdl-cntt': 'Phòng Cơ sở dữ liệu & Công nghệ thông tin',
    '/vien/vien-shtt-kn-dmst': 'Viện sở hữu trí tuệ, Khởi nghiệp & Đổi mới sáng tạo',
    '/vien/vien-lss': 'Viện Luật so sánh',
    '/vien/vien-dt-bd': 'Viện Đào tạo & Bồi dưỡng',
    '/vien/vien-dtqt': 'Viện Đào tạo quốc tế',
    '/vanphong': 'Văn phòng Đảng ủy - Hội đồng trường - Công đoàn',
    '/khoa': 'Tất cả các Khoa',
  };

  if (mapping[pathname]) {
    return mapping[pathname];
  }

  return 'Đơn vị không xác định';
}
