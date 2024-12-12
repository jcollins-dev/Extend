export interface PageLayoutProps {
  pageName?: 'ProteinMachine' | 'machineHealth' | 'machinePerformance'; // add new pages here for custom css added to Page element,
  subtractDaysCount?: number; // number of days to go back for default dateRange
}
