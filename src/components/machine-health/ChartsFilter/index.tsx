// 3rd party libs
import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Component
import { BaseSelect, Column, Row, Typography } from 'components';

interface Props {
  onChangeFilter: (value: string) => void;
  filterNames?: { value: string | number; timestamp: string }[];
}

const ChartsFilter = ({ onChangeFilter, filterNames }: Props): ReactElement => {
  const [psu, setPsu] = useState('');
  const { t } = useTranslation(['common']);
  const filterOptions: { label: string; value: string }[] = [{ value: '', label: 'PSU Name' }];
  filterNames?.forEach((filterName) => {
    filterOptions.push({ label: `${filterName.value}`, value: `${filterName.value}` });
  });
  return (
    <Row>
      <Typography size="0.8125rem" style={{ marginTop: '0.75rem' }}>
        {t('filter_by')}:{' '}
      </Typography>
      <Column size={2}>
        <BaseSelect
          variant="white"
          value={psu}
          handleChange={(e) => {
            setPsu(e.target.value);
            onChangeFilter(e.target.value);
          }}
          options={filterOptions}
        />
      </Column>
      <Column size={10} />
    </Row>
  );
};

export default ChartsFilter;
