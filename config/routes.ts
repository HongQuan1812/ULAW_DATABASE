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
    icon: 'home',
    component: './MainPage/MainPage',
  },
  {
    path: '/phong-trungtam',
    name: 'phong-trungtam',
    icon: 'team',
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
        path: '/phong-trungtam/phong-tcns',
        name: 'phong-tcns',
        component: './PhongTrungTam/PhongTCNS',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/vien',
    name: 'vien',
    icon: 'bank',
  },
  {
    path: 'vanphong',
    name: 'vanphong',
    icon: 'home',
  },
  {
    path: 'khoa',
    name: 'khoa',
    icon: 'book',
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
