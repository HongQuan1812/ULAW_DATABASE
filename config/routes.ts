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
    component: './DTTT/MainPage/MainPage',
    access: 'canUser',
  },
  {
    path: '/chinhquy',
    name: 'chinhquy',
    icon: 'book',
    access: 'canUser',
    routes: [
      {
        path: '/chinhquy/vanbang2',
        name: 'vanbang2',
        component: './DTTT/ChinhQuy/VanBang2',
        access: 'canUser',
      },
      {
        path: '/chinhquy/lienthong',
        name: 'lienthong',
        component: './DTTT/ChinhQuy/LienThong',
        access: 'canUser',
      },
    ],
  },
  {
    path: '/daotao-tuxa',
    name: 'daotao-tuxa',
    icon: 'laptop',
    access: 'canUser',
    routes: [
      {
        path: '/daotao-tuxa/daihoc',
        name: 'daihoc',
        component: './DTTT/DTTX/DaiHoc',
        access: 'canUser',
      },
      {
        path: '/daotao-tuxa/vanbang2',
        name: 'vanbang2',
        component: './DTTT/DTTX/VanBang2',
        access: 'canUser',
      },
      {
        path: '/daotao-tuxa/lienthong',
        name: 'lienthong',
        component: './DTTT/DTTX/LienThong',
        access: 'canUser',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/vualam-vuahoc',
    name: 'vualam-vuahoc',
    icon: 'read',
    access: 'canUser',
    routes: [
      {
        path: '/vualam-vuahoc/daihoc',
        name: 'daihoc',
        component: './DTTT/VLVH/DaiHoc',
        access: 'canUser',
      },
      {
        path: '/vualam-vuahoc/vanbang2',
        name: 'vanbang2',
        component: './DTTT/VLVH/VanBang2',
        access: 'canUser',
      },
      {
        path: '/vualam-vuahoc/lienthong',
        name: 'lienthong',
        component: './DTTT/VLVH/LienThong',
        access: 'canUser',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: 'saudaihoc',
    name: 'saudaihoc',
    icon: 'container',
    access: 'canUser',
    component: './DTTT/SauDaiHoc/SauDaiHoc',
  },
  {
    path: '/thongtin-canhan',
    name: 'thongtin-canhan',
    icon: 'idcard',
    access: 'canUser',
    routes: [
      {
        path: '/thongtin-canhan',
        component: './DTTT/UserInfo/UserInfo',
        access: 'canUser',
      },
      {
        path: ':enrollmentCode',
        component: './DTTT/UserInfo/UserEnrollmentDetail',
        access: 'canUser',
        hideInMenu: true,
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/quanly-hoso',
    name: 'quanly-hoso',
    icon: 'solution',
    access: 'canAdminPdtOrSdh',
    routes: [
      {
        path: '/quanly-hoso',
        component: './Admin/EnrollmentControl/EnrollmentControl',
        access: 'canAdminPdtOrSdh',
      },
      {
        path: ':enrollmentCode',
        component: './Admin/EnrollmentControl/EnrollmentDetail',
        access: 'canAdminPdtOrSdh',
        hideInMenu: true,
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/quanly-taikhoan',
    name: 'quanly-taikhoan',
    icon: 'usergroupAdd',
    component: './Admin/AccountControl/AccountControl',
    access: 'canAdminPdtOrSdh',
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
