import { includes } from 'lodash';
import { JBTRoutes } from 'constants/routes';
import { PermissionScopeName } from 'types/user-management';

export const getPermissionNameByLocation = (pathname: string): PermissionScopeName | undefined => {
  if (includes(pathname, JBTRoutes.fleet)) return PermissionScopeName.FLEET;
  if (includes(pathname, JBTRoutes.machineManagement))
    return PermissionScopeName.MACHINE_MANAGEMENT;
  if (includes(pathname, JBTRoutes.maintenance)) return PermissionScopeName.MAINTENANCE_MANAGER;
  if (includes(pathname, JBTRoutes.parts)) return PermissionScopeName.SHOP;
  if (includes(pathname, JBTRoutes.userManagement)) return PermissionScopeName.USER_MANAGEMENT;
};
