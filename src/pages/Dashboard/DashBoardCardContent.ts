import { JBTRoutes } from 'constants/routes';
export const DashBoarCardContent = [
  {
    icon: '/assets/imgs/icons/dashboard.svg',
    width: '2.906rem',
    height: '2.853rem',
    alt: 'dash icon',
    title: 'card_dashboards',
    description: 'card_dashboards_desc',
    path: JBTRoutes.fleet
  },
  {
    icon: '/assets/imgs/icons/maintenance_mgr.svg',
    width: '2.326rem',
    height: '2.491rem',
    alt: 'maintenance icon',
    title: 'card_maintenance_manager',
    description: 'card_maintenance_manager_desc',
    path: JBTRoutes.maintenanceService
  },
  {
    icon: '/assets/imgs/icons/parts_shop.svg',
    width: '3.125rem',
    height: '3rem',
    alt: 'parts icon',
    title: 'card_parts_shop',
    description: 'card_parts_shop_desc',
    path: JBTRoutes.partsCatalog
  },
  {
    icon: '/assets/imgs/icons/machine_mgr.svg',
    width: '2.886rem',
    height: '2.354rem',
    alt: 'Machine icon',
    title: 'card_machine_management',
    description: 'card_machine_management_desc',
    path: JBTRoutes.machineManagement
  },
  {
    icon: '/assets/imgs/icons/group_user_mgr.svg',
    width: '3.25rem',
    height: '3.25rem',
    alt: 'group icon',
    title: 'card_group_user_management',
    description: 'card_group_user_management_desc',
    path: JBTRoutes.userManagement
  },
  {
    icon: '/assets/imgs/icons/bell.svg',
    width: '3.25rem',
    height: '3.25rem',
    alt: 'Alerts icon',
    title: 'card_alerts',
    description: 'card_alerts_desc',
    path: JBTRoutes.alertCreator
  }
];
