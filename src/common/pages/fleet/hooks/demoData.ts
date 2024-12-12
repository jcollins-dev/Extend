export const customerData: Record<string, unknown> = {
  afw4345lsdf: {
    name: 'Proseal Customer 1',
    bu: 1,
    subscription: 'free',
    sites: ['site1afe94', 'site2r4e698']
  },
  tkl4225loiu: {
    bu: 2,
    name: 'Proseal Customer 2',
    subscription: 'paid',
    sites: ['site3afe54', 'sitewere600']
  }
};

// only doing demo data for one customer
export const sitesData: Record<string, unknown> = {
  site1afe94: {
    name: 'Site 1',
    timeZone: 'Europe/Amsterdam',
    lines: ['line1afe94']
  },
  site2r4e698: {
    name: 'Site 2',
    timeZone: 'Europe/Amsterdam',
    line: ['line2r4e698', 'line3r2e4567']
  }
};

// only doing demo data for one site
export const linesData: Record<string, unknown> = {
  line2r4e698: {
    name: 'Line 2',
    machines: ['machine1afe94', 'machine2r4e698']
  },
  line3r2e4567: {
    name: 'Line 3',
    machines: ['machine3afe94']
  }
};

// only doing demo data for one line
export const machinesData: Record<string, unknown> = {
  machine1afe94: {
    name: 'GF-435H',
    connectionStatus: 'connected',
    productionStatus: 'running',
    serialNumber: 'GH-56789',
    orderNumber: 'aas234rfs'
  }
};
