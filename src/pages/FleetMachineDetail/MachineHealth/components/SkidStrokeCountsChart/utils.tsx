const randomNumber = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min);
};

export const generateDemoDataIntensifiers = (): Record<string, unknown>[] => {
  const totalNumRecords = 100;
  const numSkids = 4;
  const numIntens = 4;
  const name = 'intensifier_utilization_';

  const d = new Date('2023-09-11T00:00:00.000Z'); //start date
  const step = 10; //every 10 minutes

  const valueOutOfRangeIndex = 5;

  const isSkidSet = {
    1: true,
    2: false,
    3: false,
    4: false
  };

  const data = [];

  for (let i = 0; i < totalNumRecords; i++) {
    const object = {};
    for (let y = 1; y <= numSkids; y++) {
      for (let s = 1; s <= numIntens; s++) {
        const key = name + `${y}` + '_' + `${s}`;
        let value;
        if (isSkidSet[y]) {
          if (s == 1) {
            if (i % valueOutOfRangeIndex !== 0) {
              value = randomNumber(270, 290);
            } else {
              value = randomNumber(100, 250);
            }
          } else if (s == 2) {
            if (i % valueOutOfRangeIndex !== 0) {
              value = randomNumber(280, 300);
            } else {
              value = randomNumber(100, 300);
            }
          } else if (s == 3) {
            if (i % valueOutOfRangeIndex !== 0) {
              value = randomNumber(290, 310);
            } else {
              value = randomNumber(200, 400);
            }
          } else {
            if (i % valueOutOfRangeIndex !== 0) {
              value = randomNumber(300, 320);
            } else {
              value = randomNumber(250, 500);
            }
          }
        } else {
          value = 0;
        }
        object[key] = value;
      }
    }
    object.timestamp = new Date(d.setMinutes(d.getMinutes() + step)).toISOString();
    data.push(object);
  }
  return data;
};

export const colorMappingDotsChartAvure = {
  1: '#118DFF',
  2: '#3A4BC6',
  3: '#E66C37',
  4: '#C83D95'
};

export const formatDataBySkid = (
  data: Record<string, unknown>[]
): { skids: Record<string, unknown>[]; skidsByTimestampAsKey: Record<string, unknown>[] } => {
  const skids = [] as Record<string, unknown>[];
  const skidsByTimestampAsKey = [] as Record<string, unknown>[];

  // Iterate over the data and separate it into skids
  data.forEach((item) => {
    for (const [key, value] of Object.entries(item)) {
      if (key === 'timestamp') continue;

      const [, , skid, intensifier] = key.split('_');

      if (!skid) continue;

      if (!skids[skid]) {
        skids[skid] = [];
      }

      skids[skid].push({
        [key]: value,
        skid: skid,
        intensifier: intensifier,
        value: value,
        timestamp: new Date(item.timestamp)
      });

      if (!skidsByTimestampAsKey[skid]) {
        skidsByTimestampAsKey[skid] = [];
      }

      const formattedTimestamp = new Date(item['timestamp']).toISOString();

      if (!skidsByTimestampAsKey[skid][formattedTimestamp]) {
        skidsByTimestampAsKey[skid][formattedTimestamp] = [];
      }

      skidsByTimestampAsKey[skid][formattedTimestamp].push({
        [key]: value,
        skid: skid,
        intensifier: intensifier,
        value: value,
        timestamp: new Date(item.timestamp)
      });
    }
  });

  // We do not always have all 4 intensifiers, in that case, if we only have 1 intensifier, values will be coming through as 0
  // We need to check for 0
  const isZero = (value) => value === 0;
  const hasSkids = skids.map((skid) => skid.every((e) => isZero(e.value)));
  hasSkids.shift();

  //We never set item at 0 so we are removing first element of the array
  skidsByTimestampAsKey.shift();
  skids.shift();

  const filteredSkids = [];
  const filteredByTimestampAsKey = [];

  // Now, based on hasSkids we make out final array of skids
  hasSkids.filter((el, index) => {
    if (!el) {
      filteredSkids.push(skids[index]);
      filteredByTimestampAsKey.push(skidsByTimestampAsKey[index]);
    }
  });

  return { skids: filteredSkids, skidsByTimestampAsKey: filteredByTimestampAsKey };
};
