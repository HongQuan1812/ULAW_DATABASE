import {
  ApartmentOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BankOutlined,
  BookOutlined,
  BulbOutlined,
  ContainerOutlined,
  CreditCardOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  IdcardOutlined,
  InsertRowRightOutlined,
  LaptopOutlined,
  ProfileOutlined,
  ProjectOutlined,
  ReadOutlined,
  ToolOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

interface CardData {
  id: number;
  title: string;
  path: string;
  IconComponent: AntdIconType;
}

type AntdIconType =
  | typeof ProfileOutlined
  | typeof ApartmentOutlined
  | typeof ProjectOutlined
  | typeof BookOutlined
  | typeof UsergroupAddOutlined
  | typeof FundProjectionScreenOutlined
  | typeof InsertRowRightOutlined
  | typeof CreditCardOutlined
  | typeof BulbOutlined
  | typeof FolderOpenOutlined
  | typeof ContainerOutlined
  | typeof ReadOutlined
  | typeof AuditOutlined
  | typeof IdcardOutlined
  | typeof ToolOutlined
  | typeof LaptopOutlined
  | typeof GlobalOutlined
  | typeof FileSearchOutlined
  | typeof FileDoneOutlined
  | typeof FileProtectOutlined
  | typeof BankOutlined
  | typeof AppstoreOutlined;

export const phongTrungTamCards: CardData[] = [
  {
    id: 1,
    title: 'Trung tâm Tư vấn pháp luật & Phục vụ cộng đồng',
    path: '/phong-trungtam/trungtam-tvpl-pvcd',
    IconComponent: ProfileOutlined,
  },
  {
    id: 2,
    title: 'Trung tâm Học liệu',
    path: '/phong-trungtam/trungtam-hl',
    IconComponent: ProjectOutlined,
  },
  { id: 3, title: 'Thư viện', path: '/phong-trungtam/thuvien', IconComponent: BookOutlined },
  {
    id: 4,
    title: 'Phòng Tư vấn tuyển sinh',
    path: '/phong-trungtam/phong-tvts',
    IconComponent: UsergroupAddOutlined,
  },
  {
    id: 5,
    title: 'Phòng Truyền thông và Quan hệ doanh nghiệp',
    path: '/phong-trungtam/phong-tt-qhdn',
    IconComponent: FundProjectionScreenOutlined,
  },
  {
    id: 6,
    title: 'Phòng Tổ chức nhân sự',
    path: '/phong-trungtam/phong-tcns',
    IconComponent: ApartmentOutlined,
  },
  {
    id: 7,
    title: 'Phòng Thanh tra - Pháp chế',
    path: '/phong-trungtam/phong-tt-pc',
    IconComponent: InsertRowRightOutlined,
  },
  {
    id: 8,
    title: 'Phòng Tài chính - Kế toán',
    path: '/phong-trungtam/phong-tc-kt',
    IconComponent: CreditCardOutlined,
  },
  {
    id: 9,
    title: 'Phòng Khoa học công nghệ và Hợp tác phát triển',
    path: '/phong-trungtam/phong-khcn-htpt',
    IconComponent: BulbOutlined,
  },
  {
    id: 10,
    title: 'Phòng Hành chính - Tổng hợp',
    path: '/phong-trungtam/phong-hc-th',
    IconComponent: FolderOpenOutlined,
  },
  {
    id: 11,
    title: 'Phòng Đào tạo Sau đại học',
    path: '/phong-trungtam/phong-dtsdh',
    IconComponent: ContainerOutlined,
  },
  {
    id: 12,
    title: 'Phòng Đào tạo Đại học',
    path: '/phong-trungtam/phong-dtdh',
    IconComponent: ReadOutlined,
  },
  {
    id: 13,
    title: 'Phòng Đảm bảo chất lượng và Khảo thí',
    path: '/phong-trungtam/phong-dbcl-kt',
    IconComponent: AuditOutlined,
  },
  {
    id: 14,
    title: 'Phòng Công tác sinh viên',
    path: '/phong-trungtam/phong-ctsv',
    IconComponent: IdcardOutlined,
  },
  {
    id: 15,
    title: 'Phòng Cơ sở vật chất',
    path: '/phong-trungtam/phong-csvc',
    IconComponent: ToolOutlined,
  },
  {
    id: 16,
    title: 'Phòng Cơ sở dữ liệu và Công nghệ thông tin',
    path: '/phong-trungtam/phong-csdl-cntt',
    IconComponent: LaptopOutlined,
  },
];

export const vienCards: CardData[] = [
  {
    id: 1,
    title: 'Viện Sở hữu trí tuệ, Khởi nghiệp và Đổi mới sáng tạo',
    path: '/vien/vien-shtt-kn-dmst',
    IconComponent: GlobalOutlined,
  },
  { id: 2, title: 'Viện Luật so sánh', path: '/vien/vien-lss', IconComponent: FileSearchOutlined },
  {
    id: 3,
    title: 'Viện Đào tạo và Bồi dưỡng',
    path: '/vien/vien-dt-bd',
    IconComponent: FileDoneOutlined,
  },
  {
    id: 4,
    title: 'Viện Đào tạo quốc tế',
    path: '/vien/vien-dtqt',
    IconComponent: FileProtectOutlined,
  },
];

export const vanphongCard: CardData[] = [
  {
    id: 1,
    title: 'Văn phòng Đảng ủy - Hội đồng trường - Công đoàn',
    path: '/vanphong/vanphong-vpdu-hdt-cd',
    IconComponent: BankOutlined,
  },
];

export const khoaCard: CardData[] = [
  { id: 1, title: 'Tất cả các Khoa', path: '/khoa', IconComponent: AppstoreOutlined },
];
