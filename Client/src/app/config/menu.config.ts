import { LanguageCode } from '../enums/LanguageCode.enum';
import { RolesEnum } from '../enums/roles.enum';
import { RouterEnum } from '../enums/router.enum';

export const MenuConfig = {
  title: 'MENU.TITLE',
  footerTitle: 'MENU.FOOTER_TITLE',
  authMenuItems: [
    { label: 'MENU.ADMIN_PANEL', routerLink: `/${RouterEnum.admin}`, roles: [RolesEnum.ADMIN] },
    {
      label: 'MENU.PROFILE',
      routerLink: `/${RouterEnum.user}`,
    },
    { label: 'MENU.WEATHER_LOGS', routerLink: `/${RouterEnum.weatherLogs}` },
    { label: 'MENU.MAP', routerLink: `/${RouterEnum.map}` },
  ],
  nonAuthMenuItems: [
    { label: 'MENU.LOGIN', routerLink: `/${RouterEnum.login}` },
    { label: 'MENU.REGISTER', routerLink: `/${RouterEnum.register}` },
  ],
  langs: [
    { label: 'English', value: LanguageCode.ENGLISH },
    { label: 'Polski', value: LanguageCode.POLISH },
  ],
};
