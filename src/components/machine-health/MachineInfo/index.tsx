// 3rd party libs
import React from 'react';
import { useParams } from 'react-router-dom';
import momentTz from 'moment-timezone';
import { useTranslation } from 'react-i18next';

// Components
import { Typography } from 'components';

// Types
import { MachineAccountInfoQueryParams } from 'types/protein';

// Api
import { useGetAccountInfoQuery } from 'api';

// Providers
import { useTimeZone } from 'providers';

//PROTEIN MACHINE INFO

const MachineInfo = (): JSX.Element => {
  const { machineId } = useParams<MachineAccountInfoQueryParams>();
  const { data } = useGetAccountInfoQuery({ machineId }, { pollingInterval: 30000 });

  console.log('data', data);
  const { t } = useTranslation(['common']);
  // Empty object as fallback, assigned vars will be undefined
  const { serialNumber, order, currProdState } = data || {};
  const isRunning = currProdState == 'Production Running';
  const { timeZone } = useTimeZone();
  let formattedZone = '';
  if (timeZone) {
    const offset = momentTz.tz(timeZone).format('Z');
    formattedZone = `${timeZone} ( UTC ${offset} ) |`;
  }

  return (
    <Typography color="mediumGrey3">
      {t('serial_number')}: {serialNumber} | {t('order_number')}: {order} | {formattedZone}{' '}
      {t('production_state')}:
      <Typography
        as="span"
        color={isRunning ? 'onTrackGreen' : 'atRiskYellow'}
        style={{ marginLeft: '0.5rem' }}
      >
        {currProdState}
      </Typography>
    </Typography>
  );
};

export default MachineInfo;
