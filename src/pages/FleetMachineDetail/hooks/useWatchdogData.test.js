import moment from 'moment';
import { NUM_OF_TIMESTAMPS_TO_CHECK } from './useWatchdogData';

// This function contains logic from useEffect function (lines 41-75)
const isMachineDisconnected = (connectionStatus, lastConnectedDates) => {
  if (!lastConnectedDates) return;

  // we will be comparing timestamps in UTC timezone
  const tz = 'UTC';

  //Check if it was more than 15 min ago
  const nowTimestamp = moment().subtract(15, 'minutes').tz(tz).valueOf();

  const apiTimestamp = connectionStatus && Date.parse(connectionStatus?.lastKnownConnected);

  // if we don't have any timestamp from api, or watchdog timestamp is way in the past then we set disconnected to true
  if (!apiTimestamp || apiTimestamp < nowTimestamp) {
    return true;
  }

  if (lastConnectedDates?.current?.length === NUM_OF_TIMESTAMPS_TO_CHECK) {
    lastConnectedDates?.current?.shift();
  }
  connectionStatus?.lastKnownConnected &&
    lastConnectedDates?.current?.push(connectionStatus.lastKnownConnected);

  //compare dates only when array has all 5 last values
  if (lastConnectedDates?.current?.length === NUM_OF_TIMESTAMPS_TO_CHECK) {
    const isSameTimestamp = new Set(lastConnectedDates?.current);
    if (isSameTimestamp.size === 1) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

describe('isMachineConnected logic', () => {
  it('is disconnected to FALSE', () => {
    const timestamp = moment().subtract(10, 'minutes').tz('UTC').format();

    const connectionStatus = {};
    connectionStatus.lastKnownConnected = timestamp;

    const lastConnectedDates = {};
    lastConnectedDates.current = [];

    const isDisconnected = isMachineDisconnected(connectionStatus, lastConnectedDates);
    expect(isDisconnected).toEqual(false);
  });

  it('is disconnected to FALSE', () => {
    const timestamp = moment().subtract(10, 'minutes').tz('UTC').format();

    const connectionStatus = {};
    connectionStatus.lastKnownConnected = timestamp;

    const lastConnectedDates = {};
    lastConnectedDates.current = [timestamp];

    const isDisconnected = isMachineDisconnected(connectionStatus, lastConnectedDates);
    expect(isDisconnected).toEqual(false);
  });

  it('is disconnected to FALSE', () => {
    const timestamp = moment().subtract(10, 'minutes').tz('UTC').format();

    const connectionStatus = {};
    connectionStatus.lastKnownConnected = timestamp;

    const lastConnectedDates = {};
    lastConnectedDates.current = [timestamp, timestamp];

    const isDisconnected = isMachineDisconnected(connectionStatus, lastConnectedDates);
    expect(isDisconnected).toEqual(false);
  });

  it('is disconnected to FALSE', () => {
    const timestamp = moment().subtract(10, 'minutes').tz('UTC').format();

    const connectionStatus = {};
    connectionStatus.lastKnownConnected = timestamp;

    const lastConnectedDates = {};
    lastConnectedDates.current = [timestamp, timestamp, timestamp];

    const isDisconnected = isMachineDisconnected(connectionStatus, lastConnectedDates);
    expect(isDisconnected).toEqual(false);
  });

  it('is disconnected to FALSE', () => {
    const timestamp = moment().subtract(10, 'minutes').tz('UTC').format();

    const connectionStatus = {};
    connectionStatus.lastKnownConnected = timestamp;

    const lastConnectedDates = {};
    lastConnectedDates.current = [timestamp, timestamp, timestamp, timestamp];

    const isDisconnected = isMachineDisconnected(connectionStatus, lastConnectedDates);
    expect(isDisconnected).toEqual(true);
  });

  it('is disconnected to TRUE', () => {
    const timestamp = moment().subtract(10, 'minutes').tz('UTC').format();

    const connectionStatus = {};
    connectionStatus.lastKnownConnected = timestamp;

    const lastConnectedDates = {};
    lastConnectedDates.current = [timestamp, timestamp, timestamp, timestamp, timestamp];

    const isDisconnected = isMachineDisconnected(connectionStatus, lastConnectedDates);
    expect(isDisconnected).toEqual(true);
  });

  it('is disconnected to FALSE', () => {
    const timestamp = moment().subtract(10, 'minutes').tz('UTC').format();
    const timestamp2 = moment().subtract(5, 'minutes').tz('UTC').format();

    const connectionStatus = {};
    connectionStatus.lastKnownConnected = timestamp2;

    const lastConnectedDates = {};
    lastConnectedDates.current = [timestamp, timestamp, timestamp, timestamp, timestamp];

    const isDisconnected = isMachineDisconnected(connectionStatus, lastConnectedDates);
    expect(isDisconnected).toEqual(false);
  });

  it('is disconnected to FALSE', () => {
    const timestamp = moment().subtract(10, 'minutes').tz('UTC').format();
    const timestamp2 = moment().subtract(5, 'minutes').tz('UTC').format();

    const connectionStatus = {};
    connectionStatus.lastKnownConnected = timestamp2;

    const lastConnectedDates = {};
    lastConnectedDates.current = [timestamp, timestamp, timestamp, timestamp, timestamp2];

    const isDisconnected = isMachineDisconnected(connectionStatus, lastConnectedDates);
    expect(isDisconnected).toEqual(false);
  });
});
