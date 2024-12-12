import React, { FC, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Input,
  Typography,
  DateRangeProps,
  DateButtonWithDropdown,
  useDateRange
} from 'components';
import { useOverviewTemplate } from 'providers';
import { ChangeEvent } from 'types';
import { DataAnalysisProperty, DataAnalysisPropTypes } from 'types/protein';
import { DATA_DATE_LIMIT_DAYS } from 'constants/machineConfig';

interface PropertyFiltersProps {
  setFiltersSelected: (selected: boolean) => void;
}

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Line = styled.hr`
  border-top: ${(props) => `0.0625rem solid ${props.theme.colors.lightGrey3}`};
  margin-top: 0rem;
  margin-bottom: 1rem;
  width: 100%;
`;

const DateRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 0 1rem 1rem 1rem;
  gap: 1rem;
`;

const DataContainer = styled(DateRangeContainer)`
  gap: 0.125rem;
  align-items: stretch;
`;

const DataWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const InputContainer = styled.div`
  flex: 1;
`;

const Footer = styled.div<{ flexDirection?: string }>`
  width: 100%;
  border-bottom-left-radius: 0.625rem;
  border-bottom-right-radius: 0.625rem;
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || 'column'};
  justify-content: end;
  padding: 2rem;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.5rem;
  & button {
    padding: 0.75rem 1rem;
  }
  & button:last-child {
    margin-left: 1rem;
  }
`;

const PropertyFilters: FC<PropertyFiltersProps> = ({
  setFiltersSelected
}: PropertyFiltersProps) => {
  const { setFilterDataParams, filterDataParams, yAxisMinMax, setYAxisMinMax } =
    useOverviewTemplate();

  const { dateRange, setDateRange } = useDateRange();
  const { t } = useTranslation(['mh']);

  const [propsChanged, setPropsChanged] = useState(1);
  const theme = useTheme();
  const hasGoBackDateLimit = DATA_DATE_LIMIT_DAYS;

  const dataParamsCloned: DataAnalysisProperty[] = filterDataParams.map((param) => {
    const left = yAxisMinMax.filter((minMax) => minMax.left);
    const right = yAxisMinMax.filter((minMax) => minMax.right);
    switch (param.property) {
      case DataAnalysisPropTypes.FirstYAxisMin:
        param = { ...param, value: left.length > 0 ? left[0]?.min : null };
        break;
      case DataAnalysisPropTypes.FirstYAxisMax:
        param = { ...param, value: left.length > 0 ? left[0]?.max : null };
        break;
      case DataAnalysisPropTypes.SecondYAxisMin:
        param = { ...param, value: right.length > 0 ? right[0]?.min : null };
        break;
      case DataAnalysisPropTypes.SecondYAxisMax:
        param = { ...param, value: right.length > 0 ? right[0]?.max : null };
        break;
      default:
        break;
    }
    return param;
  });
  const [filterProps, setFilterProps] = useState<DataAnalysisProperty[]>(
    dataParamsCloned as DataAnalysisProperty[]
  );

  const handleDateRange = (range: DateRangeProps) => {
    setPropsChanged(propsChanged + 1);
    setDateRange(range);
  };

  const handlePropertyChange = (value: string | Date | number, propName: DataAnalysisPropTypes) => {
    setPropsChanged(propsChanged + 1);
    const filterPropsClone: DataAnalysisProperty[] = filterProps.map((prop) => {
      if (prop.property === propName) {
        prop = { ...prop, value: value };
      }
      return prop;
    });
    setFilterProps(filterPropsClone);
  };

  const cancelBtnHandler = () => {
    setFiltersSelected(false);
  };

  const applyBtnHandler = () => {
    setFilterDataParams(filterProps);
    const minValL = filterProps.find(
      (property) => property.property === DataAnalysisPropTypes.FirstYAxisMin
    );
    const maxValL = filterProps.find(
      (property) => property.property === DataAnalysisPropTypes.FirstYAxisMax
    );
    const minValR = filterProps.find(
      (property) => property.property === DataAnalysisPropTypes.SecondYAxisMin
    );
    const maxValR = filterProps.find(
      (property) => property.property === DataAnalysisPropTypes.SecondYAxisMax
    );
    setYAxisMinMax([
      {
        left: true,
        min: minValL ? parseInt(minValL.value as string) : 0,
        max: maxValL ? parseInt(maxValL.value as string) : 0
      },
      {
        right: true,
        min: minValR ? parseInt(minValR.value as string) : 0,
        max: maxValR ? parseInt(maxValR.value as string) : 0
      }
    ]);
    setPropsChanged(1);
    setFiltersSelected(false);
  };

  const getParamValue = (paramType: string) => {
    const dataParam = filterProps.find((prop) => prop.property === paramType);
    return dataParam?.value !== null ? dataParam?.value : '';
  };

  return (
    <FiltersContainer>
      <Line />
      <DateRangeContainer>
        <DateButtonWithDropdown
          {...{ dateRange, setDateRange: handleDateRange, hasGoBackDateLimit }}
        />
      </DateRangeContainer>
      <Line />
      <DataContainer>
        <DataWrapper>
          <Typography size="0.8125rem" mb={0} weight="bold">
            {t('data')}
          </Typography>
        </DataWrapper>
        <DataWrapper>
          <Typography as="span" mb={0} style={{ flex: 1 }} size="0.8125rem">
            {t('maximum_data_point')}
          </Typography>
          <InputContainer>
            <Input
              type="number"
              id="maxDataPoints"
              variant="white-dark"
              value={
                filterProps.find((prop) => prop.property === DataAnalysisPropTypes.MaxDataPoints)
                  ?.value
              }
              onChange={(event: ChangeEvent) => {
                handlePropertyChange(
                  Number.parseInt(event.target.value || '0'),
                  DataAnalysisPropTypes.MaxDataPoints
                );
              }}
            />
          </InputContainer>
        </DataWrapper>
        <DataWrapper>
          <InputContainer>
            <Input
              label={t('total_rows_displayed') as string}
              type="number"
              id="totalRowsDisplayed"
              variant="white-dark"
              value={
                filterProps.find(
                  (prop) => prop.property === DataAnalysisPropTypes.TotalRowsDisplayed
                )?.value
              }
              onChange={(event: ChangeEvent) => {
                handlePropertyChange(
                  Number.parseInt(event.target.value || '0'),
                  DataAnalysisPropTypes.TotalRowsDisplayed
                );
              }}
            />
          </InputContainer>
        </DataWrapper>
        <DataWrapper>
          <InputContainer style={{ marginRight: '1rem' }}>
            <Input
              label={t('first_yaxis_minimum') as string}
              type="number"
              id="y-axisMinimum"
              variant="white-dark"
              value={getParamValue(DataAnalysisPropTypes.FirstYAxisMin)}
              onChange={(event: ChangeEvent) => {
                handlePropertyChange(
                  Number.parseInt(event.target.value || '0'),
                  DataAnalysisPropTypes.FirstYAxisMin
                );
              }}
            />
          </InputContainer>
          <InputContainer>
            <Input
              label={t('first_yaxis_maximum') as string}
              type="number"
              id="y-axisMaximum"
              variant="white-dark"
              value={getParamValue(DataAnalysisPropTypes.FirstYAxisMax)}
              onChange={(event: ChangeEvent) => {
                handlePropertyChange(
                  Number.parseInt(event.target.value || '0'),
                  DataAnalysisPropTypes.FirstYAxisMax
                );
              }}
            />
          </InputContainer>
        </DataWrapper>
        <DataWrapper>
          <InputContainer style={{ marginRight: '1rem' }}>
            <Input
              label={t('second_yaxis_minimum') as string}
              type="number"
              id="secondY-axisMinimum"
              variant="white-dark"
              value={getParamValue(DataAnalysisPropTypes.SecondYAxisMin)}
              onChange={(event: ChangeEvent) => {
                handlePropertyChange(
                  Number.parseInt(event.target.value || '0'),
                  DataAnalysisPropTypes.SecondYAxisMin
                );
              }}
            />
          </InputContainer>
          <InputContainer>
            <Input
              label={t('second_yaxis_maximum') as string}
              type="number"
              id="secondY-axisMaximum"
              variant="white-dark"
              value={getParamValue(DataAnalysisPropTypes.SecondYAxisMax)}
              onChange={(event: ChangeEvent) => {
                handlePropertyChange(
                  Number.parseInt(event.target.value || '0'),
                  DataAnalysisPropTypes.SecondYAxisMax
                );
              }}
            />
          </InputContainer>
        </DataWrapper>
      </DataContainer>
      <Footer>
        <ButtonContainer>
          <Button bgColor={theme.colors.primaryBlue4} onClick={cancelBtnHandler}>
            {t('cancel', { ns: 'common' })}
          </Button>
          <Button variant="primary" disabled={propsChanged === 1} onClick={applyBtnHandler}>
            {t('apply', { ns: 'common' })}
          </Button>
        </ButtonContainer>
      </Footer>
    </FiltersContainer>
  );
};

export default PropertyFilters;
