import { MachineHealthTabs, MachinePerformanceTabs } from 'types/protein';

export const JBTRoutes = {
  accessDenied: '/access-denied',
  admin: '/admin',
  adminAddNewMachine: '/admin/add-new-machine',
  login: '/login',
  fleet: '/fleet',
  fleetMachine: '/fleet/:machineId',
  site: '/fleet/site/:plantId',
  line: '/fleet/line/:lineId',
  help: '/help',
  machineManagement: '/machine-management',
  machineManagementNew: '/machine-management-new',
  machineManagementHierarchy: '/machine-management-hierarchy/:machineId',
  dashboard: '/dashboard',
  onboardingPage: '/onboarding/:machineId',
  onboardingMaintenanceSchedulePage: '/onboarding/:machineId/maintenance-schedule',
  machineManagementMtlConfigurationMapping:
    '/machine-management-mtl-configuration-mapping/:machineId',
  machineReviewAndPublish: '/machine-review-and-publish/:machineId',
  alertManagement: '/alert-management',
  alertCreator: '/alert-creator',
  alertTemplateManagement: '/alert-template-management',
  demoTable: '/demo-table',

  // route for create new alert
  createAlert: '/create-alert',

  /**
   *  User Management
   */
  userManagement: '/user-management',
  /**
   *  Aseptic
   */
  asepticMHOverview: '/fleet/machine/:machineId/machine-health/overview',
  asepticMHFoilPress: '/fleet/machine/:machineId/machine-health/foil-press',
  asepticMHChangeOver: '/fleet/machine/:machineId/machine-health/changeover',
  asepticMHLaneStatus: '/fleet/machine/:machineId/machine-health/lane-status',
  asepticMHAlarms: '/fleet/machine/:machineId/machine-health/alarms',
  asepticMHKPIs: '/fleet/machine/:machineId/machine-health/kpis',
  asepticAlerts: '/fleet/machine/:machineId/alerts/',
  /**
   *  DSI
   */
  DSI: '/fleet/machine/:machineId',
  DSIMachines: '/fleet/machines/:machineId',
  DSIOverview: '/fleet/machine/:machineId/overview',
  DSIOee: '/fleet/machine/:machineId/oee',
  DSIMachineHealth: '/fleet/machine/:machineId/machine-health',
  DSIMachineProduction: '/fleet/machine/:machineId/production',
  DSIDataAnalysis: '/fleet/machine/:machineId/data-analysis',
  DSIAlarms: '/fleet/machine/:machineId/alarms',

  maintenance: '/maintenance',
  maintenanceService: '/maintenance/servicedashboard',
  maintenanceServicemachine: '/maintenance/servicedashboard/machine/:machineId',
  maintenanceServiceevents: '/maintenance/serviceevents',
  maintenanceRoutine: '/maintenance/routine',
  maintenanceManuals: '/maintenance/manuals',
  maintenanceRemotediagnostics: '/maintenance/remotediagnostics',
  maintenanceMachinepmparts: '/maintenance/machinepmparts/:machineId',
  notifications: '/notifications',
  parts: '/parts',
  partsCatalog: '/parts/catalog',
  partsMachine: '/parts/machine/:machineId',
  partsSuggestions: '/parts/suggestions',
  partsLeadtimes: '/parts/leadtimes',
  partsOrders: '/parts/orders',
  partsInventory: '/parts/inventory',
  partsProduct: '/parts/product/:productId',
  iops: '/iops',
  settings: '/settings',

  // /** Admin Portal */
  // findMachine:'/machine-management/new',

  /** Machine (all business units) */
  machine: '/fleet/machine/:machineId',
  machinePerformance: '/fleet/machine/:machineId/machine-performance',
  machineProduction: '/fleet/machine/:machineId/machine-production',
  machineHealth: '/fleet/machine/:machineId/machine-health',
  machineHealthAlarms: '/fleet/machine/:machineId/machine-health/alarms',
  machineAlerts: '/fleet/machine/:machineId/alerts',
  machineReports: '/fleet/machine/:machineId/reports',
  customerReports: '/:machineId/reports',
  // Configurator
  //// Common
  machineCommonConfig: '/fleet/machine/:machineId/config/common',
  machineConfigAlerts: '/fleet/machine/:machineId/config/common/alerts',
  machineConfigAlarmsList: '/fleet/machine/:machineId/config/common/alarms-list',
  machineConfigMasterTagList: '/fleet/machine/:machineId/config/common/master-tag-list',
  machineConfigUnitClasses: '/fleet/machine/:machineId/config/common/unit-classes',
  machineConfigInformation: '/fleet/machine/:machineId/config/common/information',
  machineMasterTagListDashBoard: '/machine-management/mastertaglistdashboard',
  //// Machine Health
  machineHealthConfig: '/fleet/machine/:machineId/config/machine-health',
  machineHealthConfigOverview: '/fleet/machine/:machineId/config/machine-health/overview',
  machineHealthConfigProductProcessing:
    '/fleet/machine/:machineId/config/machine-health/product-processing',
  machineHealthConfigProductMovement:
    '/fleet/machine/:machineId/config/machine-health/product-movement',
  machineHealthConfigAlarms: '/fleet/machine/:machineId/config/machine-health/alarms-toggle',
  machineHealthConfigCleaning: '/fleet/machine/:machineId/config/machine-health/cleaning',

  //// Machine Performance
  machinePerformanceConfig: '/fleet/machine/:machineId/config/machine-performance',
  machinePerformanceConfigCurrent: '/fleet/machine/:machineId/config/machine-performance/current',
  machinePerformanceConfigHistoricRecipes:
    '/fleet/machine/:machineId/config/machine-performance/historic-recipes',

  machineHealthOverview: '/fleet/machine/:machineId/machine-health/overview',
  machineHealthFoilPress: '/fleet/machine/:machineId/machine-health/foil-press',
  machineHealthChangeOver: '/fleet/machine/:machineId/machine-health/changeover',
  machineHealthLaneStatus: '/fleet/machine/:machineId/machine-health/lane-status',
  machineHealthKPIs: '/fleet/machine/:machineId/machine-health/kpis',

  // Alerts
  machineAlertsConfig: '/fleet/machine/:machineId/config/alerts',

  // Data analysis
  machineHealthDataAnalysisTemplate:
    '/fleet/machine/:machineId/machine-health/data-analysis/template-details'
};

// Hard-coded slugs representing the top level nav within Protein Machine Health section
export const proteinMachineHealthSlugs = {
  [MachineHealthTabs.Overview]: 'overview',
  [MachineHealthTabs.ProductProcessing]: 'product-processing',
  [MachineHealthTabs.ProductMovement]: 'product-movement',
  [MachineHealthTabs.Cleaning]: 'cleaning',
  [MachineHealthTabs.Alarms]: 'alarms',
  [MachineHealthTabs.DataAnalysis]: 'data-analysis'
};

export const proteinMachinePerformanceSlugs = {
  [MachinePerformanceTabs.Current]: 'current',
  [MachinePerformanceTabs.HistoricRecipes]: 'historic-recipes'
};
