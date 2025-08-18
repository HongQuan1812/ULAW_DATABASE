export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    path: '/trangchu',
    name: 'trangchu',
    icon: 'smile',
    component: './MainPage/MainPage',
  },
  {
    path: '/vien',
    name: 'vien',
    icon: 'deploymentUnit',
  },
  {
    path: 'khoa',
    name: 'khoa',
    icon: 'appstore',
  },
  {
    path: 'vanphong',
    name: 'vanphong',
    icon: 'bank',
  },
  {
    path: '/phong-trungtam',
    name: 'phong-trungtam',
    icon: 'cluster',
    routes: [
      {
        path: '/phong-trungtam/trungtam-tvpl-pvcd',
        name: 'trungtam-tvpl-pvcd',
        component: './PhongTrungTam/TrungtamTVPLVPVCD',
      },
      {
        path: '/phong-trungtam/trungtam-hl',
        name: 'trungtam-hl',
        component: './PhongTrungTam/TrungtamHL',
      },
      {
        path: '/phong-trungtam/thuvien',
        name: 'thuvien',
        component: './PhongTrungTam/ThuVien',
      },
      {
        path: '/phong-trungtam/phong-tvts',
        name: 'phong-tvts',
        component: './PhongTrungTam/PhongTVTS',
      },
      {
        path: '/phong-trungtam/phong-tt-qhdn',
        name: 'phong-tt-qhdn',
        component: './PhongTrungTam/PhongTTQHDN',
      },
      {
        path: '/phong-trungtam/phong-tcns',
        name: 'phong-tcns',
        component: './PhongTrungTam/PhongTCNS',
      },
      {
        path: '/phong-trungtam/phong-tt-pc',
        name: 'phong-tt-pc',
        component: './PhongTrungTam/PhongTTPC',
      },
      {
        path: '/phong-trungtam/phong-tc-kt',
        name: 'phong-tc-kt',
        component: './PhongTrungTam/PhongTCKT',
      },
      {
        path: '/phong-trungtam/phong-khcn-htpt',
        name: 'phong-khcn-htpt',
        component: './PhongTrungTam/PhongKHCNHTPT',
      },
      {
        path: '/phong-trungtam/phong-hc-th',
        name: 'phong-hc-th',
        component: './PhongTrungTam/PhongHCTH',
      },
      {
        path: '/phong-trungtam/phong-dtsdh',
        name: 'phong-dtsdh',
        component: './PhongTrungTam/PhongDTSDH',
      },
      {
        path: '/phong-trungtam/phong-dtdh',
        name: 'phong-dtdh',
        component: './PhongTrungTam/PhongDTDH',
      },
      {
        path: '/phong-trungtam/phong-dbcl-kt',
        name: 'phong-dbcl-kt',
        component: './PhongTrungTam/PhongDBCLKT',
      },
      {
        path: '/phong-trungtam/phong-ctsv',
        name: 'phong-ctsv',
        component: './PhongTrungTam/PhongCTSV',
      },
      {
        path: '/phong-trungtam/phong-csvc',
        name: 'phong-csvc',
        component: './PhongTrungTam/PhongCSVC',
      },
      {
        path: '/phong-trungtam/phong-csdl-cntt',
        name: 'phong-csdl-cntt',
        component: './PhongTrungTam/PhongCSDLCNTT',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
