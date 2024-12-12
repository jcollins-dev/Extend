import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import { Button, Card, Indicator, Typography } from 'components';
import { MaintenanceEvent } from 'types/maintenance';
import { CTAsStretch, IndicatorContainer } from '.';
import theme from 'themes';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useGetProductsQuery } from 'api';
import { LONG_LEAD_TIME_THRESHOLD } from 'constants/parts';

interface OrderPartsKitCardProps {
  maintenanceEvent: MaintenanceEvent;
  onClick: CallableFunction;
}

function drawLeadTime(maxLeadTime: number | undefined, t: TFunction<'fpns'[], undefined>) {
  if (
    maxLeadTime === undefined ||
    maxLeadTime === null ||
    maxLeadTime === 0 ||
    maxLeadTime >= LONG_LEAD_TIME_THRESHOLD
  ) {
    return <Typography variant="body2">{t('lead_time_2_weeks', { ns: 'fpns' })}</Typography>;
  } else if (maxLeadTime === 1) {
    return <Typography variant="body2">{t('lead_time_1-2_days', { ns: 'fpns' })}</Typography>;
  } else if (maxLeadTime >= 2) {
    return (
      <Typography variant="body2">
        {t('lead_time_num_days', { ns: 'fpns', item: maxLeadTime })}
      </Typography>
    );
  }
}

const OrderPartsKitCard = ({ maintenanceEvent, onClick }: OrderPartsKitCardProps): JSX.Element => {
  const [maxLeadTime, setMaxLeadTime] = useState<number>();
  const { t } = useTranslation(['fpns']);
  const { data: products, isFetching: productsAreLoading } = useGetProductsQuery(
    maintenanceEvent?.purchasables && maintenanceEvent?.purchasables.length > 0
      ? {
          productIds: maintenanceEvent?.purchasables.map(
            (purchasable) => purchasable.purchasableId
          ),
          includeAssets: false
        }
      : skipToken
  );

  useEffect(() => {
    if (!productsAreLoading) {
      const leadTimes = products?.items.map((product) => {
        return product.leadTime;
      });

      leadTimes && setMaxLeadTime(Math.max(...leadTimes));
    }
  }, [productsAreLoading]);

  return (
    <>
      <IndicatorContainer>
        <Indicator color={theme.colors.negativeRed}>
          {t('require_immediate_action', { ns: 'common' })}
        </Indicator>
      </IndicatorContainer>
      <Card borderColor={theme.colors.negativeRed}>
        <Card.Header
          bgColor={theme.colors.negativeRed4}
          icon={<FontAwesomeIcon icon={faShoppingCart} />}
        >
          <Typography mb={0} size="0.8125rem" weight="medium">
            {t('order_pm_kit')}
          </Typography>
        </Card.Header>
        <Card.Body>
          {maintenanceEvent.purchasables && (
            <Typography variant="body2">
              {t('order_parts_for', { item: maintenanceEvent.description })}
            </Typography>
          )}
          <CTAsStretch>
            <>{!productsAreLoading && drawLeadTime(maxLeadTime, t)}</>
            <Button
              arrow
              variant="primary"
              size="small"
              width="auto"
              onClick={() => {
                onClick();
              }}
            >
              {t('view_kit_details')}
            </Button>
          </CTAsStretch>
        </Card.Body>
      </Card>
    </>
  );
};

export default OrderPartsKitCard;
