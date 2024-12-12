// Mapping of machine statuses for different BUs
// Disconnected status will depend of lastConnectedDate

export const mappedStatuses: { [key: string]: string } = {
  Disconnected: 'Offline', // protein, value base on last_connected_val
  'Production Stopped': 'Connected', //protein
  'Production Running': 'Connected', //protein
  running: 'Connected',
  cleaning: 'Connected',
  idle: 'Connected',
  paused: 'Connected',
  stop_alarm: 'Connected',
  stop: 'Connected',
  Offline: 'Offline', //dsi not connected
  Running: 'Connected', //dsi
  'Not Running': 'Connected', //dsi
  'No Product': 'Connected', //dsi
  'In Production': 'Connected' // Pascal
};

export const mappedStateProtein: { [key: string]: string } = {
  running: 'Running',
  cleaning: 'Cleaning',
  idle: 'Idle',
  paused: 'Paused',
  stop_alarm: 'Stop By Alarm',
  Disconnected: 'Unknown',
  stop: 'Paused'
};

export const mappedStateDSI: { [key: string]: string } = {
  Offline: 'Unknown',
  'No Product': 'No Product',
  Running: 'Running',
  'Not Running': 'Not Running',
  Disconnected: 'Unknown'
};
