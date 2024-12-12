import React from 'react';
import { addDayToRangeBetween, formatDate, formatDuration, toISO8601 } from 'helpers';
import {
  getShortDate,
  pmFormatDate,
  ConvertToHHMMSS,
  ConvertHHMMSStoMinutes,
  AddHHMMSS
} from './dates';

const date = new Date(2020, 10, 1, 12, 34, 56);
const altDate = new Date(2020, 8, 14, 12, 34, 56);
const fixedInterval = date.valueOf() - altDate.valueOf();

const rangeFrom = new Date(2022, 0, 1);
const rangeTo = new Date(2022, 0, 9);
const inputDayA = new Date(2022, 0, 2);
const inputDayB = new Date(2022, 0, 8);
const inputDayC = new Date(2022, 0, 4);
const inputDayD = new Date(2022, 0, 5);

describe('Date Helper - formatDate', () => {
  it('Should format short dates correctly', () => {
    expect(formatDate(date, 'short')).toBe('11/01/20');
  });

  it('Should format long dates correctly', () => {
    expect(formatDate(date, 'long')).toBe('11/01/2020');
  });

  it('Should format hours:minutes correctly', () => {
    expect(formatDate(date, 'hours-minutes')).toMatch(/12:34\WPM$/);
  });

  it('Should format hours:minutes:seconds correctly', () => {
    expect(formatDate(date, 'hours-minutes-seconds')).toMatch(/12:34:56\WPM$/);
  });

  it('Should format time elapsed correctly', () => {
    expect(formatDate(fixedInterval, 'time-elapsed')).toBe('48 days 00:00:00');

    // 1 min
    expect(formatDate(1000 * 60, 'time-elapsed')).toBe('01:00');

    // 1 hour
    expect(formatDate(1000 * 60 * 60, 'time-elapsed')).toBe('01:00:00');
  });

  it('Should format date objects to a ISO 8601 formatted string', () => {
    expect(toISO8601(new Date('July 15 2017'))).toBe('2017-07-15T00:00:00+00:00');
  });
});

describe('Date helper - formatDuration', () => {
  it('Should format hours:mins:secs correctly', () => {
    // Zero
    expect(formatDuration(0, 'hours:mins:secs')).toBe('00:00:00');
    // 1 minute 40 secs
    expect(formatDuration(100_000, 'hours:mins:secs')).toBe('00:01:40');
    // 2 mins, rounded
    expect(formatDuration(120_300, 'hours:mins:secs')).toBe('00:02:00');
    // 1 hour, 10 mins
    expect(formatDuration(4200_000, 'hours:mins:secs')).toBe('01:10:00');
    // 49 hours, 10 mins, 20 secs
    expect(formatDuration(177_020_000, 'hours:mins:secs')).toBe('49:10:20');
  });

  it('Should format hours:mins correctly', () => {
    // Zero
    expect(formatDuration(0, 'hours:mins')).toBe('00:00');
    // 1 minute 40 secs
    expect(formatDuration(100_000, 'hours:mins')).toBe('00:01');
    // 2 mins, rounded
    expect(formatDuration(120_300, 'hours:mins')).toBe('00:02');
    // 1 hour, 10 mins
    expect(formatDuration(4200_000, 'hours:mins')).toBe('01:10');
    // 49 hours, 10 mins, 20 secs
    expect(formatDuration(177_020_000, 'hours:mins')).toBe('49:10');
  });

  it('should format days hrs mins secs correctly', () => {
    // Zero
    expect(formatDuration(0, 'days hrs mins secs')).toBe('');
    // 1 minute 40 secs
    expect(formatDuration(100_000, 'days hrs mins secs')).toBe('1 mins 40 secs');
    // 2 mins, rounded
    expect(formatDuration(120_300, 'days hrs mins secs')).toBe('2 mins');
    // 1 hour, 10 mins
    expect(formatDuration(4200_000, 'days hrs mins secs')).toBe('1 hrs 10 mins');
    // 2 days, 1 hour, 10 mins, 20 secs
    expect(formatDuration(177_020_000, 'days hrs mins secs')).toBe('2 days 1 hrs 10 mins 20 secs');
  });
});

describe('Date helper - addDayToRangeBetween', () => {
  it('Should update the range by replacing the range endpoint that is closer to the given day', () => {
    const newRangeA = addDayToRangeBetween(inputDayA, rangeFrom, rangeTo);
    // New range should be from: 2022-01-02, to: 2022-01-09
    expect(newRangeA.from).toBe(inputDayA);

    const newRangeB = addDayToRangeBetween(inputDayB, rangeFrom, rangeTo);
    // New range should be from: 2022-01-01, to: 2022-01-08
    expect(newRangeB.to).toBe(inputDayB);

    const newRangeC = addDayToRangeBetween(inputDayC, rangeFrom, rangeTo);
    // New range should be from: 2022-01-04, to: 2022-01-09
    expect(newRangeC.from).toBe(inputDayC);

    const newRangeD = addDayToRangeBetween(inputDayD, rangeFrom, rangeTo);
    // New range should be from: 2022-01-01, to: 2022-01-05
    expect(newRangeD.to).toBe(inputDayD);
  });

  describe('Date Helper - getShortDate', () => {
    const testDate = new Date(2022, 1, 14);
    expect(getShortDate(new Date(2022, 1, 14, 11, 22, 33, 444))).toEqual(testDate);
  });
});

describe('PM Format Date', () => {
  it('Should format the given date into Month, Day, and Year', () => {
    expect(pmFormatDate(date)).toBe('Nov 1st 2020');
  });
});

describe('Seconds to HH:MM:SS format', () => {
  it('Should convert the given seconds to HH:MM:SS format', () => {
    const seconds = 8274;
    expect(ConvertToHHMMSS(seconds)).toBe('02:17:54');
  });
});

describe('HH:MM:SS to difference in minutes as a string', () => {
  it('Should calculate the difference beween two HH:MM:SS formats and return a string of minutes', () => {
    const targetTimeStamp = '05:00:11';
    const actualTimeStamp = '05:49:11';
    expect(ConvertHHMMSStoMinutes(targetTimeStamp, actualTimeStamp)).toBe(' (+49 min)');
  });
});

describe('Adding two durations in the HH:MM:SS format and returning a sum duration in same format', () => {
  it('Should calculate the difference beween two HH:MM:SS formats and return a string of minutes', () => {
    const firstDuration = '00:10:11';
    const secondDuration = '00:39:11';
    expect(AddHHMMSS(firstDuration, secondDuration)).toBe('00:49:22');
  });
});
