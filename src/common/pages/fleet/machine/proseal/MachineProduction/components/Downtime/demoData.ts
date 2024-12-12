// this data is shared between
// bar chart and live graph section
// use a provider
export default {
  downtime_data: [
    {
      status: 'Stopped By Operator',
      total_time_seconds: 10565,
      count: 40,
      production_percentage: 40,
      category: 'Machine Stopped',
      color: '#0000c2'
    },
    {
      status: 'Break Detected',
      total_time_seconds: 4171,
      count: 30,
      production_percentage: 30,
      category: 'Machine Stopped',
      color: '#0000c2'
    },
    {
      status: 'Change Over',
      total_time_seconds: 3271,
      count: 17,
      production_percentage: 77,
      category: 'Machine Stopped',
      color: '#0000c2'
    },
    {
      status: 'Emergency Stop By Operator',
      total_time_seconds: 1777,
      count: 8,
      production_percentage: 8,
      category: 'Safety Circuit Interrupted',
      color: '#f6f64f'
    },
    {
      status: 'Tray Length Error',
      total_time_seconds: 1292,
      count: 8,
      production_percentage: 8,
      category: 'Machine Error',
      color: '#785c01'
    },
    {
      status: 'Film Snap Error',
      total_time_seconds: 956,
      count: 7,
      production_percentage: 7,
      category: 'Machine Error',
      color: '#785c01'
    },
    {
      status: 'Printer Error',
      total_time_seconds: 432,
      count: 1,
      production_percentage: 1,
      category: 'External Error',
      color: '#ff0000'
    }
  ]
};
