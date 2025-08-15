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
        path: '/phong-trungtam/phong-tcns',
        name: 'phong-tcns',
        component: './PhongTrungTam/PhongTCNS',
      },
      {
        path: '/phong-trungtam/trungtam-tvpl-pvcd',
        name: 'trungtam-tvpl-pvcd',
        component: './PhongTrungTam/TrungtamTVPLVPVCD',
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
