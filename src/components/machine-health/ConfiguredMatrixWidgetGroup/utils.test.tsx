// Utils
import { parseTagValue } from './utils';

// Types
import { BaseTagDataType, BaseTagType, BooleanTagDisplayValue } from 'types/protein';

// Constants
import { NO_SELECTION } from 'constants/machineTags';

const mockTag = {
  id: 'tagId',
  type: BaseTagType.Tag,
  values: [
    {
      value: 1,
      timestamp: '2021-01-01T00:00:00.000Z'
    }
  ]
};

describe('parseTagValue', () => {
  it('converts boolean tag latest value to On or Off', () => {
    const mockBooleanTag1 = {
      ...mockTag,
      meta: {
        dataType: BaseTagDataType.Boolean
      }
    };

    const mockBooleanTag2 = {
      ...mockBooleanTag1,
      values: [
        {
          value: 0,
          timestamp: '2021-01-01T00:00:00.000Z'
        }
      ]
    };

    expect(parseTagValue(mockBooleanTag1)).toBe(BooleanTagDisplayValue.On);
    expect(parseTagValue(mockBooleanTag2)).toBe(BooleanTagDisplayValue.Off);
  });

  it('handles and adds precision and units to numerical tags', () => {
    const numericalTag1 = {
      ...mockTag,
      unit: '°C',
      values: [
        {
          value: 1.234567,
          timestamp: '2021-01-01T00:00:00.000Z'
        }
      ]
    };

    const numericalTag2 = {
      ...mockTag,
      unit: '°F',
      values: [
        {
          value: 2,
          timestamp: '2021-01-01T00:00:00.000Z'
        }
      ]
    };

    expect(parseTagValue(numericalTag1)).toBe('1.2 °C');
    expect(parseTagValue(numericalTag2)).toBe('2.0 °F');
  });

  it('handles the latest value of a string tag without throwing an error', () => {
    const stringTag = {
      ...mockTag,
      values: [
        {
          value: 'string1',
          timestamp: '2021-01-01T00:00:00.000Z'
        },
        {
          value: 'string2',
          timestamp: '2021-01-02T00:00:00.000Z'
        }
      ]
    };

    expect(parseTagValue(stringTag)).toBe('string1');
  });

  it('returns "No selection" if the tag value is empty string', () => {
    const stringTag = {
      ...mockTag,
      values: [
        {
          value: '',
          timestamp: '2021-01-01T00:00:00.000Z'
        },
        {
          value: 'nuggets',
          timestamp: '2021-01-02T00:00:00.000Z'
        }
      ]
    };

    expect(parseTagValue(stringTag)).toBe(NO_SELECTION);
  });
});
