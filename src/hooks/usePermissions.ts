import { useGetUserQuery } from 'api';
import { isEmpty } from 'lodash';
import { Role, User } from 'types';
import { useUser } from 'selectors';
import { Permission } from 'types/user-management';
const b2cflag: boolean = process.env.REACT_APP_ENABLE_B2C == 'true';

export default function usePermissions(): Permission {
  const getUser = () => {
    const { data: user } = useGetUserQuery();
    return user;
  };

  const user = b2cflag ? (useUser() as User) : getUser();

  const isAdmin = user?.allOrganizations && user?.allPlants && user?.allMachines;

  return {
    role: isAdmin ? Role.Admin : Role.User,
    isAdmin: isAdmin ?? false,
    noAccess:
      (user && isEmpty(user.organizations) && isEmpty(user.plants) && isEmpty(user.machines)) ??
      false,
    scopes: user?.permissions && !isEmpty(user.permissions) ? user.permissions : [],
    isEnabledPermission: user?.enable_ap_permission ?? false,
    machines: user?.machines ? user?.machines : []
  };
}
