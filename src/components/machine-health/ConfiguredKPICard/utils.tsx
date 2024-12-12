import { BaseTag, BaseTagValue, ConfiguredTagStateValue } from 'types/protein';
import { Value } from 'components/KPICard/CardComponents';

export interface ValueExtended extends Value {
  tagType: string;
  tagValue: number | string;
}

export const formatTagData = (tagsArray: BaseTag[]): ValueExtended[] => {
  if (!tagsArray?.length) return [];

  const transformedTagArray = tagsArray.map((tag) => {
    switch (tag.type) {
      case 'state': {
        const stateValue = tag.values[0] as ConfiguredTagStateValue;
        return {
          unit: tag.name ? (tag.name as string) : '',
          key: tag.id,
          value: stateValue?.value ? `${stateValue.name} (${stateValue.value})` : '-',
          tagType: tag.type,
          tagValue: stateValue?.value
        };
      }
      case 'tag': {
        const tagValue = tag.values[0] as BaseTagValue;
        return {
          unit: tag.name ? (tag.name as string) : '',
          key: tag.id,
          value: tagValue?.value ? `${tagValue.value} ${tag.unit}` : '-',
          tagType: tag.type,
          tagValue: tagValue?.value
        };
      }
      default:
        return {
          unit: '',
          key: '',
          value: '',
          tagType: '',
          tagValue: ''
        };
    }
  });

  return transformedTagArray;
};
