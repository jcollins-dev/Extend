import { BaseType, Id, Line, Role, UserScopes } from 'types';

export interface Group extends BaseType {
  id: string;
  name: string;
  internalAccessGroup: boolean;
  allOrganizations: boolean;
  organizationsCount: number;
  usersCount: number;
}

export interface GroupItem extends BaseType {
  id?: string;
  name: string;
  internalAccessGroup: boolean;
  allOrganizations: boolean;
  allPlants: boolean;
  allMachines: boolean;
  organizations?: GroupOrganization[];
  plants?: GroupPlant[];
  machines?: string[];
  permissions?: GroupPermission[];
}

export interface User extends BaseType {
  id?: Id;
  firstName?: string;
  lastName?: string;
  email?: string;
  sfUserId?: string;
  sfUserName?: string;
  organizations?: string[];
  plants?: string[];
  machines?: string[];
  scopes?: UserScopes[];
  preferences?: BaseType;
  allOrganizations?: boolean;
  allMachines?: boolean;
  allPlants?: boolean;
  textAlert?: boolean;
  emailAlert?: boolean;
  phone?: string;
  groupId?: Id;
}

export interface UserValidationState extends BaseType {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface UserFormElement extends BaseType {
  user: User;
  validationState: UserValidationState;
  id: string;
}

export interface UserManagementPermission extends BaseType {
  id: string;
  name: string;
}

export interface GroupOrganization extends BaseType {
  organizationId: string;
  value: string;
  label: string;
  allPlants: boolean;
  allMachines: boolean;
  plants: GroupPlant[];
  machines: string[];
  selectedPlants: { plantIndex: number; value: string }[];
}

export interface GroupPlant extends BaseType {
  plantId: string;
  value?: string;
  label?: string;
  allMachines: boolean;
  machines: string[];
}

export interface GroupPermission extends BaseType {
  permissionId: string;
  read?: boolean;
  write?: boolean;
}

export interface GroupScope extends BaseType {
  allOrganizations: boolean;
  allPlants: boolean;
  allMachines: boolean;
  organizations: GroupOrganization[];
  plants: GroupPlant[];
  machines: string[];
}

export interface ScopeCount extends BaseType {
  organizations: string;
  plants: string;
  machines: string;
}

export interface UserManagementGroupsParams extends BaseType {
  type: string;
  offset?: number;
  limit?: number;
}

export interface ValidateUserEmailAvailableParams extends BaseType {
  email: string;
  userId?: Id;
}

export interface UserItem extends User, BaseType {
  id?: string;
}

export interface DeleteUserParams extends BaseType {
  userId: Id;
}

export enum UserManagementTableType {
  GROUP = 'GROUP',
  USER = 'USER'
}

export interface PermissionScope extends BaseType {
  permissionId: string;
  name: string;
  read?: boolean;
  write?: boolean;
}

export enum PermissionScopeName {
  FLEET = 'Fleet',
  MACHINE_MANAGEMENT = 'Machine Management',
  MAINTENANCE_MANAGER = 'Maintenance Manager',
  SHOP = 'Shop',
  USER_MANAGEMENT = 'User Management'
}

export interface Permission {
  isAdmin: boolean;
  role: Role;
  scopes: PermissionScope[];
  noAccess: boolean;
  isEnabledPermission: boolean;
  machines: string[];
}

export type LinesById = { [lineId: Id]: Line };
