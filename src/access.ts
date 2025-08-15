import { UserInfoResponse } from '@/services/auth';

export default function access(initialState: {
  currentUser?: UserInfoResponse['data'] | undefined;
}) {
  const { currentUser } = initialState || {};

  const isLogin = !!currentUser?.username;

  const userRoles = currentUser?.role ? [currentUser.role] : [];

  const isAdminPdt = isLogin && userRoles.includes('adminPdt');
  const isAdminSdh = isLogin && userRoles.includes('adminSdh');

  return {
    canAdminPdt: isAdminPdt,

    canAdminSdh: isAdminSdh,

    canAdminPdtOrSdh: isAdminPdt || isAdminSdh,

    canUser: isLogin && userRoles.includes('user'),

    canAccessUserFeatures:
      isLogin &&
      (userRoles.includes('user') ||
        userRoles.includes('adminPdt') ||
        userRoles.includes('adminSdh')),

    canAccessDaiHocForm:
      isLogin &&
      (userRoles.includes('user') ||
        userRoles.includes('adminPdt') ||
        userRoles.includes('adminSdh')),
  };
}
