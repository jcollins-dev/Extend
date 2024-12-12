import {
  // faBookOpen, This icon was used for Manuals and Guides
  faListUl,
  faLineChart
} from '@fortawesome/free-solid-svg-icons';

import { NavFlyoutType, SidenavItemProps } from 'types';
import { JBTRoutes } from './routes';
import {
  EngineIcon,
  MaintenanceIcon,
  HelpIcon,
  MachineManagementIcon,
  UserShieldIcon,
  PartsIcon
} from 'icons';
import { PermissionScopeName } from 'types/user-management';
//import { FleetNavigationEntityType } from 'providers';

const adminPortalFlag: boolean = process.env.REACT_APP_ENABLE_ADMIN_PORTAL == 'true';

const NAV_ITEMS_TO_ID: { [item: string]: number } = {
  fleet: 1,
  maintenance: 2,
  parts: 9
};

let sideNavItems: SidenavItemProps[];
if (parseFloat(process.env.REACT_APP_NAV_VERSION as string) >= 2) {
  sideNavItems = [
    {
      id: 1,
      icon: { iconElement: EngineIcon, iconType: 'custom' },
      label: NavFlyoutType.Fleet,
      name: PermissionScopeName.FLEET,
      useFleetMenu: true,
      fleetLinks: {
        machine: JBTRoutes.machine,
        line: JBTRoutes.line,
        plant: JBTRoutes.site
      }
    },
    {
      id: 2,
      icon: { iconElement: MaintenanceIcon, iconType: 'custom' },
      label: NavFlyoutType.Maintenance,
      name: PermissionScopeName.MAINTENANCE_MANAGER,
      // link: JBTRoutes.maintenanceService,
      // These are commented for now (08 Aug 2023) as they are not functional but they can be enabled later.
      // subItems: [
      //   // { id: 4, label: NavFlyoutType.ServiceDashboard, link: JBTRoutes.maintenanceService },
      //   // { id: 5, label: 'Service Events', link: JBTRoutes.maintenanceServiceevents },
      //   // { id: 6, label: 'Routine Maintenance', link: JBTRoutes.maintenanceRoutine },
      //   {
      //     id: 7,
      //     label: NavFlyoutType.ManualsAndGuides,
      //     useFleetMenu: true,
      //     icon: { iconElement: faBookOpen, iconType: 'fa' },
      //     link: JBTRoutes.maintenanceManuals
      //   }
      //   // { id: 8, label: 'Remote Diagnostics', link: JBTRoutes.maintenanceRemotediagnostics }
      // ],
      useFleetMenu: true,
      fleetLinks: {
        machine: JBTRoutes.maintenanceServicemachine
      }
    },
    {
      id: 9,
      icon: { iconElement: PartsIcon, iconType: 'custom' },
      label: NavFlyoutType.Parts,
      name: PermissionScopeName.SHOP,
      // link: JBTRoutes.parts,
      subItems: [
        // { id: 10, label: NavFlyoutType.Catalog, link: JBTRoutes.partsCatalog },
        // { id: 11, label: 'Suggestions', link: JBTRoutes.partsSuggestions },
        // { id: 12, label: 'Lead Times', link: JBTRoutes.partsLeadtimes },
        {
          id: 13,
          label: NavFlyoutType.Orders,
          icon: { iconElement: faListUl, iconType: 'fa' },
          useFleetMenu: true,
          link: JBTRoutes.partsOrders
        }
        // { id: 14, label: 'Inventory', link: JBTRoutes.partsInventory }
      ],
      useFleetMenu: true,
      fleetLinks: {
        machine: JBTRoutes.partsMachine
      }
    },
    {
      id: 17,
      icon: { iconElement: MachineManagementIcon, iconType: 'custom' },
      label: NavFlyoutType.MachineManagement,
      name: PermissionScopeName.MACHINE_MANAGEMENT,
      link: JBTRoutes.machineManagement,
      visible: adminPortalFlag
    },
    {
      id: 18,
      icon: { iconElement: UserShieldIcon, iconType: 'custom' },
      label: NavFlyoutType.UserManagement,
      name: PermissionScopeName.USER_MANAGEMENT,
      link: JBTRoutes.userManagement,
      visible: adminPortalFlag
    },
    {
      id: 19,
      icon: { iconElement: faLineChart, iconType: 'fa' },
      label: NavFlyoutType.Reports,
      link: JBTRoutes.machineReports,
      visible: false
    },
    {
      id: 16,
      icon: { iconElement: HelpIcon, iconType: 'custom' },
      label: NavFlyoutType.Help,
      link: JBTRoutes.help
    }
  ];
} else {
  sideNavItems = [
    {
      id: 1,
      icon: { iconElement: EngineIcon, iconType: 'custom' },
      label: NavFlyoutType.Fleet,
      name: PermissionScopeName.FLEET,
      useFleetMenu: true
    },
    {
      id: 2,
      icon: { iconElement: MaintenanceIcon, iconType: 'custom' },
      label: NavFlyoutType.Maintenance,
      name: PermissionScopeName.MAINTENANCE_MANAGER,
      link: JBTRoutes.maintenanceService,
      subItems: [
        // { id: 4, label: NavFlyoutType.ServiceDashboard, link: JBTRoutes.maintenanceService },
        // { id: 5, label: 'Service Events', link: JBTRoutes.maintenanceServiceevents },
        // { id: 6, label: 'Routine Maintenance', link: JBTRoutes.maintenanceRoutine },
        { id: 7, label: NavFlyoutType.ManualsAndGuides, link: JBTRoutes.maintenanceManuals }
        // { id: 8, label: 'Remote Diagnostics', link: JBTRoutes.maintenanceRemotediagnostics }
      ]
    },
    {
      id: 9,
      icon: { iconElement: PartsIcon, iconType: 'custom' },
      label: NavFlyoutType.Parts,
      name: PermissionScopeName.SHOP,
      link: JBTRoutes.parts,
      subItems: [
        // { id: 10, label: NavFlyoutType.Catalog, link: JBTRoutes.partsCatalog },
        // { id: 11, label: 'Suggestions', link: JBTRoutes.partsSuggestions },
        // { id: 12, label: 'Lead Times', link: JBTRoutes.partsLeadtimes },
        { id: 13, label: NavFlyoutType.Orders, link: JBTRoutes.partsOrders }
        // { id: 14, label: 'Inventory', link: JBTRoutes.partsInventory }
      ]
    },
    {
      id: 17,
      icon: { iconElement: MachineManagementIcon, iconType: 'custom' },
      label: NavFlyoutType.MachineManagement,
      name: PermissionScopeName.MACHINE_MANAGEMENT,
      link: JBTRoutes.machineManagement,
      visible: adminPortalFlag
    },
    {
      id: 18,
      icon: { iconElement: UserShieldIcon, iconType: 'custom' },
      label: NavFlyoutType.UserManagement,
      name: PermissionScopeName.USER_MANAGEMENT,
      link: JBTRoutes.userManagement,
      visible: adminPortalFlag
    },
    {
      id: 19,
      icon: { iconElement: faLineChart, iconType: 'fa' },
      label: NavFlyoutType.Reports,
      link: JBTRoutes.machineReports,
      visible: false
    },
    {
      id: 16,
      icon: { iconElement: HelpIcon, iconType: 'custom' },
      label: NavFlyoutType.Help,
      link: JBTRoutes.help
    }
  ];
}

export { sideNavItems, NAV_ITEMS_TO_ID };

/* above needed to run story, below is commented out for that to happen
import {
  faBookOpen,
  faInfoCircle,
  faListUl,
  faTools,
  faUserShield,
  faLineChart
} from '@fortawesome/free-solid-svg-icons';

import { NavFlyoutType, SidenavItemProps } from 'types';
import { JBTRoutes } from './routes';
import { EngineIcon, MachineManagementIcon, PartsIcon } from 'icons';
import { PermissionScopeName } from 'types/user-management';
import { FleetNavigationEntityType } from 'providers';

const adminPortalFlag: boolean = process.env.REACT_APP_ENABLE_ADMIN_PORTAL == 'true';

const NAV_ITEMS_TO_ID: { [item: string]: number } = {
  fleet: 1,
  maintenance: 2,
  parts: 9
};

let sideNavItems: SidenavItemProps[];
if (parseFloat(process.env.REACT_APP_NAV_VERSION as string) >= 2) {
  sideNavItems = [
   
    {
      id: 1,
      icon: { iconElement: EngineIcon, iconType: 'custom' },
      label: NavFlyoutType.Fleet,
      name: PermissionScopeName.FLEET,
      useFleetMenu: true,
      fleetLinks: {
        [FleetNavigationEntityType.MACHINE]: JBTRoutes.machine,
        [FleetNavigationEntityType.LINE]: JBTRoutes.line,
        [FleetNavigationEntityType.PLANT]: JBTRoutes.site
      }
    },
    {
      id: 2,
      icon: { iconElement: faTools, iconType: 'fa' },
      label: NavFlyoutType.Maintenance,
      name: PermissionScopeName.MAINTENANCE_MANAGER,
      // link: JBTRoutes.maintenanceService,
      subItems: [
        // { id: 4, label: NavFlyoutType.ServiceDashboard, link: JBTRoutes.maintenanceService },
        // { id: 5, label: 'Service Events', link: JBTRoutes.maintenanceServiceevents },
        // { id: 6, label: 'Routine Maintenance', link: JBTRoutes.maintenanceRoutine },
        {
          id: 7,
          label: NavFlyoutType.ManualsAndGuides,
          useFleetMenu: true,
          icon: { iconElement: faBookOpen, iconType: 'fa' },
          link: JBTRoutes.maintenanceManuals
        }
        // { id: 8, label: 'Remote Diagnostics', link: JBTRoutes.maintenanceRemotediagnostics }
      ],
      useFleetMenu: true,
      fleetLinks: {
        [FleetNavigationEntityType.MACHINE]: JBTRoutes.maintenanceServicemachine
      }
    },
    {
      id: 9,
      icon: { iconElement: PartsIcon, iconType: 'custom' },
      label: NavFlyoutType.Parts,
      name: PermissionScopeName.SHOP,
      // link: JBTRoutes.parts,
      subItems: [
        // { id: 10, label: NavFlyoutType.Catalog, link: JBTRoutes.partsCatalog },
        // { id: 11, label: 'Suggestions', link: JBTRoutes.partsSuggestions },
        // { id: 12, label: 'Lead Times', link: JBTRoutes.partsLeadtimes },
        {
          id: 13,
          label: NavFlyoutType.Orders,
          icon: { iconElement: faListUl, iconType: 'fa' },
          useFleetMenu: true,
          link: JBTRoutes.partsOrders
        }
        // { id: 14, label: 'Inventory', link: JBTRoutes.partsInventory }
      ],
      useFleetMenu: true,
      fleetLinks: {
        [FleetNavigationEntityType.MACHINE]: JBTRoutes.partsMachine
      }
    },
    {
      id: 17,
      icon: { iconElement: MachineManagementIcon, iconType: 'custom' },
      label: NavFlyoutType.MachineManagement,
      name: PermissionScopeName.MACHINE_MANAGEMENT,
      link: JBTRoutes.machineManagement,
      visible: adminPortalFlag
    },
    {
      id: 18,
      icon: { iconElement: faUserShield, iconType: 'fa' },
      label: NavFlyoutType.UserManagement,
      name: PermissionScopeName.USER_MANAGEMENT,
      link: JBTRoutes.userManagement,
      visible: adminPortalFlag
    },
    {
      id: 19,
      icon: { iconElement: faLineChart, iconType: 'fa' },
      label: NavFlyoutType.Reports,
      link: JBTRoutes.machineReports,
      visible: false
    },
    {
      id: 16,
      icon: { iconElement: faInfoCircle, iconType: 'fa' },
      label: NavFlyoutType.Help,
      link: JBTRoutes.help
    }
  ];
} else {
  sideNavItems = [
   
    {
      id: 1,
      icon: { iconElement: EngineIcon, iconType: 'custom' },
      label: NavFlyoutType.Fleet,
      name: PermissionScopeName.FLEET,
      useFleetMenu: true
    },
    {
      id: 2,
      icon: { iconElement: faTools, iconType: 'fa' },
      label: NavFlyoutType.Maintenance,
      name: PermissionScopeName.MAINTENANCE_MANAGER,
      link: JBTRoutes.maintenanceService,
      subItems: [
        // { id: 4, label: NavFlyoutType.ServiceDashboard, link: JBTRoutes.maintenanceService },
        // { id: 5, label: 'Service Events', link: JBTRoutes.maintenanceServiceevents },
        // { id: 6, label: 'Routine Maintenance', link: JBTRoutes.maintenanceRoutine },
        { id: 7, label: NavFlyoutType.ManualsAndGuides, link: JBTRoutes.maintenanceManuals }
        // { id: 8, label: 'Remote Diagnostics', link: JBTRoutes.maintenanceRemotediagnostics }
      ]
    },
    {
      id: 9,
      icon: { iconElement: PartsIcon, iconType: 'custom' },
      label: NavFlyoutType.Parts,
      name: PermissionScopeName.SHOP,
      link: JBTRoutes.parts,
      subItems: [
        // { id: 10, label: NavFlyoutType.Catalog, link: JBTRoutes.partsCatalog },
        // { id: 11, label: 'Suggestions', link: JBTRoutes.partsSuggestions },
        // { id: 12, label: 'Lead Times', link: JBTRoutes.partsLeadtimes },
        { id: 13, label: NavFlyoutType.Orders, link: JBTRoutes.partsOrders }
        // { id: 14, label: 'Inventory', link: JBTRoutes.partsInventory }
      ]
    },
    {
      id: 17,
      icon: { iconElement: MachineManagementIcon, iconType: 'custom' },
      label: NavFlyoutType.MachineManagement,
      name: PermissionScopeName.MACHINE_MANAGEMENT,
      link: JBTRoutes.machineManagement,
      visible: adminPortalFlag
    },
    {
      id: 18,
      icon: { iconElement: faUserShield, iconType: 'fa' },
      label: NavFlyoutType.UserManagement,
      name: PermissionScopeName.USER_MANAGEMENT,
      link: JBTRoutes.userManagement,
      visible: adminPortalFlag
    },
    {
      id: 19,
      icon: { iconElement: faLineChart, iconType: 'fa' },
      label: NavFlyoutType.Reports,
      link: JBTRoutes.machineReports,
      visible: false
    },
    {
      id: 16,
      icon: { iconElement: faInfoCircle, iconType: 'fa' },
      label: NavFlyoutType.Help,
      link: JBTRoutes.help
    }
  ];
}

export { sideNavItems, NAV_ITEMS_TO_ID };
*/
