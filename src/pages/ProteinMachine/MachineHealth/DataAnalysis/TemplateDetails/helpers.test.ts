import { BaseTagType } from 'types/protein';
//import { tagHistoryToCSV } from './helpers';
import { transformDataToUniqueRows } from './helpers';
import { dataToCSV } from './helpers';

describe('tagHistoryToCSV', () => {
  const args = {
    endTime: new Date('2022-01-30T00:00:00.000Z'),
    numberTags: [
      {
        id: 'test-num-id',
        name: 'test-num-name',
        type: BaseTagType.Tag,
        values: [
          {
            timestamp: '2023-02-05T08:02:28.698000+00:00',
            value: 1
          }
        ]
      }
    ],
    showDateStamp: false,
    showDuration: false,
    states: [],
    stringTags: [
      {
        id: 'test-string-id',
        name: 'test-string-name',
        type: BaseTagType.Tag,
        values: [
          {
            timestamp: '2023-02-06T08:02:28.698000+00:00',
            value: 'test-string-value'
          }
        ]
      }
    ],
    timeZone: 'UTC'
  };

  it('should should be a csv string', () => {
    const csv = transformDataToUniqueRows(args);
    const formattedCSV = dataToCSV(csv);
    expect(formattedCSV).toBeDefined();
  });

  // it('should return the TimeStamp column', () => {
  //   const csv = transformDataToUniqueRows(args);
  //   const formattedCSV = dataToCSV(csv);
  //   expect(formattedCSV).toStrictEqual([
  //     '"sep=;"\n','Timestamp;test-string-name;test-num-name\n',
  //     '2023-02-05T08:02:28.698000+00:00;test-string-value;;\n',
  //     '2023-02-06T08:02:28.698000+00:00;test-string-value;1;\n'
  //   ]);
  // });

  // it('should return the DateStamp and Duration columns abd perform calculations', () => {
  //   const csv = transformDataToUniqueRows({
  //     ...args,
  //     showDatestamp: true,
  //     showDuration: true
  //   });
  //   const formattedCSV = dataToCSV(csv);
  //   expect(formattedCSV).toStrictEqual([
  //     '"sep=;"\n','Date;Start Time;Duration;test-string-name;test-num-name\n',
  //     "01/28/2022;12:00:00 AM;00:00:00;test-string-value;;",
  //     "01/29/2022;12:00:00 AM;48:00:00;test-string-value;1"
  //   ]);
  // });
});
