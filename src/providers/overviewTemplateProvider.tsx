// 3rd party libraries
import React, { createContext, ReactNode, useContext, useState } from 'react';

import { useDateRange } from 'components';
// Helpers
import { getRandomColor } from 'helpers/colors';

// Theme
import theme from 'themes';

// Types
import {
  DataAnalysisDefaultProps,
  DataAnalysisProperty,
  DataAnalysisYAxisMinMax,
  MachineTagsModel
} from 'types/protein';

/**
 * Provide machine tags from parent down to all its nested children
 */

type OverviewTemplateContextType = {
  tagsData: MachineTagsModel[];
  setTagsData: (tagsData: MachineTagsModel[]) => void;
  startTime: Date;
  endTime: Date;
  setDateRange: (startTime: Date, endTime: Date) => void;
  filterDataParams: DataAnalysisProperty[];
  setFilterDataParams: (filterParams: DataAnalysisProperty[]) => void;
  yAxisMinMax: DataAnalysisYAxisMinMax[];
  setYAxisMinMax: (yAxisMinMax: DataAnalysisYAxisMinMax[]) => void;
};

const defaultValue = {
  tagsData: [],
  setTagsData: (tagsData: MachineTagsModel[]) => {
    console.log('tagsData is not set' + tagsData);
  },
  startTime: new Date(),
  endTime: new Date(),
  setDateRange: (startTime: Date, endTime: Date) => {
    console.log(`date range is default 7 days: startDate: ${startTime} endDate: ${endTime}`);
  },
  filterDataParams: [],
  setFilterDataParams: (filterDataParams: DataAnalysisProperty[]) => {
    console.log('filterParams is not set' + filterDataParams);
  },
  yAxisMinMax: [],
  setYAxisMinMax: (yAxisMinMax: DataAnalysisYAxisMinMax[]) => {
    console.log('yAxisMinMax is not set' + yAxisMinMax);
  }
};

const OverviewTemplateContext = createContext<OverviewTemplateContextType>(defaultValue);

export const useOverviewTemplate = (): OverviewTemplateContextType => {
  return useContext(OverviewTemplateContext);
};

type Props = {
  children: ReactNode;
};

export const OverviewTemplateProvider = (props: Props): JSX.Element => {
  const [machineTagsData, setMachineTagsData] = useState<MachineTagsModel[]>([]);

  const { dateRange, setDateRange } = useDateRange();
  const { startTime, endTime } = dateRange;

  const [filterDataParams, setFilterDataParams] =
    useState<DataAnalysisProperty[]>(DataAnalysisDefaultProps);
  const [yAxisMinMax, setYAxisMinMax] = useState<DataAnalysisYAxisMinMax[]>([]);

  const setDateRangeHandler = (startTime: Date, endTime: Date) => {
    setDateRange({ startTime, endTime });
  };

  const contextValue = {
    tagsData: machineTagsData,
    setTagsData: (tags: MachineTagsModel[]) => {
      tags.map((tag, i) => {
        tag.extrinsics = {
          color: theme.colors.kpiChartColors[i] || getRandomColor()
        };

        return tag;
      });
      setMachineTagsData(tags);
    },
    startTime,
    endTime,
    setDateRange: setDateRangeHandler,
    filterDataParams: filterDataParams,
    setFilterDataParams: setFilterDataParams,
    yAxisMinMax: yAxisMinMax,
    setYAxisMinMax: setYAxisMinMax
  };
  return (
    <OverviewTemplateContext.Provider value={contextValue}>
      {props.children}
    </OverviewTemplateContext.Provider>
  );
};
