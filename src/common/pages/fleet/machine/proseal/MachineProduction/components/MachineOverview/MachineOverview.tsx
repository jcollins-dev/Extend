import React from 'react';
import {
  MachineOverviewWidget,
  MachineOverviewWidgetProps
} from 'common/components/MachineWidgets/MachineOverviewWidget';

import demoImage from './demo-machine-image.jpg';

import { useMachineOverviewData } from '../../../hooks/useMachineOverview';
import { styledTheme } from 'components';
import { IcoRecipes } from 'icons/IcoRecipes';
import { IcoProductionMetrics } from 'icons/IcoProductionMetrics';
import { IcoMachineState } from 'icons/IcoMachineState';

export const MachineOverview = ({ className }: MachineOverviewWidgetProps): JSX.Element => {
  //////////////////////////////////
  // TODO:
  //  - move colors to theme
  //  - consider making MachineOverviewWidget more generic
  const { data, ...apiStatus } = useMachineOverviewData();

  const widgetSettings = {
    title: 'Machine Overview',
    className,
    // send the tiles as an array, the id will be assigned to the grid-area or className
    tiles: [
      {
        id: 'status',
        title: data?.status,
        value: (
          <>
            <span>#</span>
            {data?.job_number}
          </>
        ),
        label: 'Job Number',
        color: '#29A429',
        Icon: <IcoMachineState color="white" />
      },
      {
        id: 'recipe',
        title: 'product recipe',
        value: `${data?.recipe}`,
        color: styledTheme.color.secondary,
        Icon: <IcoRecipes color="white" />
      },
      {
        id: 'metrics',
        title: 'production metrics',
        value: (data?.todays_pack_count as string)?.toLocaleString(),
        label: `${`today's pack count`}`,
        color: '#835DD0',
        Icon: <IcoProductionMetrics color="white" />
      },
      {
        id: 'tooling',
        title: 'tooling set metrics',
        value: `#${data?.tooling_set_maintenance}`,
        label: `${`today's pack count`}`,
        cycles_until_next_maintenance: 40000,
        isHidden: true
      }
    ],
    image: demoImage,
    ...apiStatus
  };

  return <MachineOverviewWidget {...widgetSettings} />;
};
