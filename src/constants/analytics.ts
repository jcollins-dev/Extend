// TODO: move all this to a types file
export type AnalyticsEventTypes =
  | ECommerceAnalyticEventActions
  | UserAnalyticsEventActions
  | MaintenanceAnalyticEventActions
  | MachinePerformanceEventActions;

export enum AnalyticsCategories {
  ECOMMERCE = 'ECommerce',
  MAINTENANCE = 'Maintenance',
  USER = 'User',
  MACHINE_PERFORMANCE = 'Machine Performance'
}

export enum ECommerceAnalyticEventActions {
  ADD_TO_CART = 'add_to_cart',
  ADD_TO_CART_FROM_PDP = 'add_to_cart_from_pdp',
  ADD_TO_CART_FROM_SEARCH_RESULTS = 'add_to_cart_from_search_results',
  ADD_TO_CART_FROM_BUBBLE_POPUP = 'add_to_cart_from_bubble_popup',
  REMOVE_FROM_CART = 'remove_from_cart',
  EMPTY_CART = 'empty_cart',
  SEARCH = 'search',
  CHECKOUT_STARTED = 'checkout_started',

  // Conversions
  ORDER_QUOTE_GENERATED = 'order_quote_generated'
}

export enum UserAnalyticsEventActions {
  LOGIN = 'login',
  LOGOUT = 'logout'
}

export enum MaintenanceAnalyticEventActions {
  MAINTENANCE_EVENT_ASSIGNED = 'maintenance_event_assigned',
  MAINTENANCE_EVENT_COMPLETED = 'maintenance_event_completed',
  MAINTENANCE_EVENT_PARTS_KIT_ADDED_TO_CART = 'maintenance_event_parts_kit_added_to_cart'
}

export enum MachinePerformanceEventActions {
  MACHINE_HEALTH_TAB_OPENED = 'machine_health_tab_opened',
  MACHINE_PRODUCTION_TAB_OPENED = 'machine_production_tab_opened'
}
