// 3rd party libs
import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { includes } from 'lodash';
import Tooltip from 'rc-tooltip';
import { useTranslation } from 'react-i18next';

// Components
import { Card, Column, Row } from 'components';
import Typography from 'components/Typography/Typography';
import DayPicker from 'components/DayPicker';
import TimePicker from 'components/TimePicker';

import theme from 'themes';
import ProductType from 'components/machine-health/ProductType';

// Helpers
import { toISO8601 } from 'helpers';

// Styling
const Container = styled(Card)`
  display: flex;
  margin: 0.3em 0;
`;

// Providers
import { useTimeZone } from 'providers';

const StyledTypography = styled(Typography)`
  margin-top: 0.75rem;
  margin-right: 0.625rem;
  margin-left: 0.625rem;
`;

const Header = styled('div')(({ theme }) => ({
  flex: '0 0 11.5625rem;',
  padding: '2rem',
  paddingTop: '8rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: theme.colors.lightGrey1,
  borderRight: `0.0625rem solid ${theme.colors.lightGrey2}`,
  textAlign: 'center'
}));

const Content = styled('div')(() => ({
  flex: 1,
  height: '18.3125rem'
}));

const FilterContent = styled('div')(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.colors.white,
  padding: '1rem',
  overflow: 'visible',
  zIndex: 999999
}));

const VerticalDivider = styled('div')(({ theme }) => ({
  borderLeft: `0.125rem solid ${theme.colors.mediumGrey1}`,
  height: '2.5rem',
  marginLeft: '1.5625rem',
  marginRight: '0.5625rem'
}));

const ProductContent = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.lightGrey2,
  padding: '1rem'
}));

const DisabledDayPicker = styled.div`
  .DayPickerInput > input {
    background-color: #e0e4e7;
  }
`;

interface Props {
  productTypes?: { value: string | number; timestamp: string }[];
}

const ProductTypeContainer = ({ productTypes }: Props): ReactElement => {
  const getNextDay = (day: Date) => {
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    return nextDay;
  };

  const { t } = useTranslation(['mh']);
  /**
   * Create date and time
   * Format of time parameter: HH: mm
   */
  const createDateTime = (date: Date, time: string) => {
    return moment(moment(date).format('DD/MM/YYYY') + ' ' + time, 'DD/MM/YYYY HH:mm').toDate();
  };

  const [startDateValue, setStartDateValue] = useState(new Date());
  const endDateInitialValue = getNextDay(startDateValue);
  const [endDateValue, setEndDateValue] = useState(endDateInitialValue);

  const [fromTime, setFromTime] = useState('06:00');
  const [toTime, setToTime] = useState('05:00');

  const [startDateTimeValue, setStartDateTimeValue] = useState(
    createDateTime(startDateValue, fromTime)
  );
  const [endDateTimeValue, setEndDateTimeValue] = useState(createDateTime(endDateValue, toTime));

  /**
   * The filter only allows 24h. In case it exceeds 24h the filter will set end date as start date, meaning the request is for the same day.
   */
  const checkDay = (startDay: Date) => {
    const isAMFrom = includes(moment(fromTime, 'h:mma').format('LT'), 'AM');
    const isPMFrom = includes(moment(fromTime, 'h:mma').format('LT'), 'PM');
    const isAMTo = includes(moment(toTime, 'h:mma').format('LT'), 'AM');
    const isPMTo = includes(moment(toTime, 'h:mma').format('LT'), 'PM');
    const isAfterTo = moment(toTime, 'h:mma').isSameOrAfter(moment(fromTime, 'h:mma'));
    const isBeforeTo = moment(toTime, 'h:mma').isSameOrBefore(moment(fromTime, 'h:mma'));
    const nextDay = getNextDay(startDay);
    if (
      (isPMFrom && isPMTo && isAfterTo) ||
      (isAMFrom && isAMTo && isAfterTo) ||
      (isAMFrom && isPMTo)
    ) {
      // It should be same day
      setEndDateValue(startDay);
      setEndDateTimeValue(createDateTime(startDay, toTime));
    }
    // It should be next day
    if (
      (isAMFrom && isAMTo && isBeforeTo) ||
      (isPMFrom && isPMTo && isBeforeTo) ||
      (isPMFrom && isAMTo)
    ) {
      setEndDateValue(nextDay);
      setEndDateTimeValue(createDateTime(nextDay, toTime));
    }
  };

  const { timeZone } = useTimeZone();

  useEffect(() => {
    checkDay(startDateValue);
  }, [toTime, fromTime]);

  useEffect(() => {
    checkDay(startDateValue);
  }, [startDateValue]);

  const renderProducts = () => {
    return productTypes?.map((product, index) => {
      return (
        <Column key={index} size={3}>
          <ProductType
            productTypeValue={product.value.toString()}
            startDatetime={toISO8601(startDateTimeValue, timeZone)}
            endDatetime={toISO8601(endDateTimeValue, timeZone)}
          />
        </Column>
      );
    });
  };
  return (
    <Container>
      <Header>
        <Typography size="1rem" weight="semi-bold">
          {t('lbs_by_product_type')}
        </Typography>
      </Header>
      <Content>
        <FilterContent className="filter">
          <StyledTypography size="0.8125rem" weight="bold" mb={0}>
            {t('start_date')}:
          </StyledTypography>
          <DayPicker
            icon="calendar"
            value={startDateValue}
            onDayChange={(value) => {
              setStartDateValue(value);
              const nextDay = new Date(value);
              nextDay.setDate(value.getDate() + 1);
              setEndDateValue(nextDay);
              setStartDateTimeValue(createDateTime(value, fromTime));
              setEndDateTimeValue(createDateTime(nextDay, toTime));
            }}
          />
          <StyledTypography size="0.8125rem" weight="bold" mb={0}>
            End Date:
          </StyledTypography>
          <Tooltip
            overlayClassName="information-tooltip"
            placement="top"
            overlay={<span> {t('time_range_cannot_exceed_24h')}.</span>}
            overlayStyle={{
              width: '18rem',
              fontSize: '0.75rem',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '0.875rem',
              letterSpacing: '0em',
              textAlign: 'left',
              backgroundColor: theme.colors.lightGrey1
            }}
          >
            <div>
              <DisabledDayPicker>
                <DayPicker
                  icon="calendar"
                  value={endDateValue}
                  dayPickerProps={{
                    disabledDays: {
                      before: endDateValue,
                      after: endDateValue
                    }
                  }}
                />
              </DisabledDayPicker>
            </div>
          </Tooltip>
          <VerticalDivider />
          <StyledTypography size="0.8125rem" weight="bold" mb={0}>
            Time:
          </StyledTypography>
          <TimePicker
            onChange={(value) => {
              setFromTime(value);
              setStartDateTimeValue(createDateTime(startDateValue, value));
            }}
            value={fromTime}
          />
          <StyledTypography size="0.8125rem" mb={0}>
            To:
          </StyledTypography>
          <TimePicker
            onChange={(value) => {
              setToTime(value);
              setEndDateTimeValue(createDateTime(endDateValue, value));
            }}
            value={toTime}
          />
        </FilterContent>
        <ProductContent>
          <Row>{renderProducts()}</Row>
        </ProductContent>
      </Content>
    </Container>
  );
};

export default ProductTypeContainer;
