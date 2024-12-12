import React, { useEffect, useRef } from 'react';
import { MachineOverviewWidget } from 'components/StyledUi/widgets/MachineOverviewWidget';
import {
  useFleetMachineAccountData,
  usePressurizeCycleDataById
} from 'pages/FleetMachineDetail/hooks';

import { useTranslation } from 'react-i18next';

// these will be needed when pascal is added to BE
//import { useGetMachineAssetsQuery } from 'api';
//import { ResourceType } from 'types';

import MachineImage from '../../assets/avure-temp-machine-image.jpg';
import { DotsLoadingIcon } from './LoadingIcon';

export const FleetMachineOverviewWidget = (): JSX.Element => {
  const { t } = useTranslation(['mh']);

  const { accountData, isLoading: isLoadingAccountData } = useFleetMachineAccountData();

  const { isLoading, hasError, hasMessage, avgWaitTime, batchCount } = usePressurizeCycleDataById();

  // On a first render we show load icon, but hide when page stays open and keeps receiving new data
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [isLoading, isLoadingAccountData]);

  // this isn't working yet, this machine needs to be added to below api call
  /*
  const { accountData, machineId } = useFleetMachineAccountData()
  useGetMachineAssetsQuery({
    machineId: machineId as string,
    assetType: ResourceType.LineImage
  })
  */

  const imagePath = MachineImage;

  let totalBatches = <p>No cycles in the last hour</p>;
  let totalAverageWaitTime = <p>No cycles in the last hour</p>;

  if (batchCount?.failed || batchCount?.passed) {
    if (batchCount.failed > 0 || batchCount.passed > 0) {
      totalBatches = (
        <p>
          <span>
            {batchCount.passed}/{batchCount.failed + batchCount.passed}
          </span>{' '}
          in the last hour
        </p>
      );
      if (avgWaitTime)
        totalAverageWaitTime = (
          <p>
            <span>{avgWaitTime}</span> sec in the last hour
          </p>
        );
    }
  }

  return (
    <MachineOverviewWidget
      {...{
        title: accountData?.description,
        isLoading: isFirstRender.current ? isLoading || isLoadingAccountData : false,
        hasError,
        hasMessage,
        imagePath,
        tooltipText: 'Edit',
        contentRows: [
          {
            label: t('processed_cycles') as string,
            value: isLoading ? <DotsLoadingIcon /> : totalBatches
          },
          {
            label: 'Average Cycle Time', //t('wait_time') as string,
            value: isLoading ? <DotsLoadingIcon /> : totalAverageWaitTime
          }
        ]
        // handleHeaderIconClick: () => console.log('modal handle would be here')
      }}
    />
  );
};
