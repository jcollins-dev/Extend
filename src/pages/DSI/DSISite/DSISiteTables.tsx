// 3rd party libs
import React, { ReactElement } from 'react';
import round from 'lodash/round';
import { find, upperCase } from 'lodash';

// Components
import { Column, Row } from 'components';
import { SiteTable } from 'components/site';

// Types
import { MachineLineStatus, SiteTableType } from 'types/protein';
import {
  BusinessUnit,
  DSIKpiId,
  DSIKPIType,
  MachineHealthInterval,
  SiteTableDataType
} from 'types/dsi';

// Hooks
import useMachineHealthByBuKpi from 'hooks/useMachineHealthByBuKpi';

interface Props {
  plantId: string;
  type: SiteTableType;
  machines: MachineLineStatus[];
  isLoading: boolean;
}

const DSISiteTables = ({ plantId, type, machines, isLoading }: Props): ReactElement => {
  const tableData: MachineLineStatus[] = [];
  machines?.forEach((machine) => {
    const dsiData = {
      [DSIKPIType.DsiCurrentKpi]: '',
      [DSIKPIType.MachineInfoOEE]: '',
      [DSIKPIType.Yield]: '',
      [DSIKPIType.ProductProcessed]: '',
      [DSIKPIType.ThroughputPieceCount]: '',
      [DSIKPIType.ThroughputRate]: '',
      [DSIKPIType.OutputWeight]: ''
    };
    const data = {
      ...machine,
      ...dsiData
    };
    tableData.push(data);
  });

  const dataTypes = [
    {
      kpiType: DSIKPIType.DsiCurrentKpi,
      interval: MachineHealthInterval.LastHour,
      includeHistoricData: false,
      field: ''
    },
    {
      kpiType: DSIKPIType.MachineInfoOEE,
      interval: MachineHealthInterval.CurrentDay,
      includeHistoricData: false,
      field: ''
    },
    {
      kpiType: DSIKPIType.Yield,
      interval: MachineHealthInterval.LastHour,
      includeHistoricData: false
    },
    {
      kpiType: DSIKPIType.ProductProcessed,
      interval: MachineHealthInterval.LastHour,
      includeHistoricData: false
    },
    {
      kpiType: DSIKPIType.ThroughputPieceCount,
      interval: MachineHealthInterval.LastHour,
      includeHistoricData: false,
      field: ''
    },
    {
      kpiType: DSIKPIType.ThroughputRate,
      interval: MachineHealthInterval.LastHour,
      includeHistoricData: false
    },
    {
      kpiType: DSIKPIType.OutputWeight,
      interval: MachineHealthInterval.CurrentDay,
      includeHistoricData: false
    }
  ];
  tableData.forEach((tableDataItem, indexTableData) => {
    dataTypes.forEach((dataType) => {
      if (tableDataItem.businessUnit === upperCase(BusinessUnit.DSI)) {
        const { machineHealth: kpiResult } = useMachineHealthByBuKpi(
          tableDataItem.id,
          dataType.kpiType,
          dataType.interval,
          dataType.includeHistoricData,
          BusinessUnit.DSI
        );
        if (dataType.kpiType === DSIKPIType.DsiCurrentKpi) {
          const currentPsu = find(kpiResult, function (o) {
            return o.id === DSIKpiId.CurrentPSU;
          });
          tableData[indexTableData][DSIKPIType.DsiCurrentKpi] =
            (currentPsu && currentPsu.value && currentPsu.value.value) ?? '';
        } else if (dataType.kpiType === DSIKPIType.MachineInfoOEE) {
          const oeeCumulative = find(kpiResult, function (o) {
            return o.id === DSIKpiId.OeeCumulative;
          });

          const oeeCumulativeValue =
            oeeCumulative &&
            oeeCumulative.value &&
            oeeCumulative.value.value &&
            round(Math.min(oeeCumulative.value.value * 100, 100), 0);
          const oeeCumulativeUnit = oeeCumulative && oeeCumulative.unit;

          tableData[indexTableData][DSIKPIType.MachineInfoOEE] = oeeCumulativeValue
            ? `${oeeCumulativeValue}${oeeCumulativeUnit}`
            : '';
        } else {
          const value =
            kpiResult &&
            kpiResult[0] &&
            kpiResult[0].value &&
            kpiResult[0].value.value &&
            round(kpiResult[0].value.value, 0).toLocaleString();
          const unit = kpiResult && kpiResult[0] && kpiResult[0].unit;
          tableData[indexTableData][dataType.kpiType] = tableData[indexTableData][
            dataType.kpiType
          ] = value ? `${value}${unit}` : '';
        }
      }
    });
  });

  return (
    <Row>
      <Column size={3}>
        <SiteTable
          plantId={plantId}
          type={type}
          tableData={{ tableType: SiteTableDataType.OEE, tableData: tableData }}
          isTableDataLoading={isLoading}
          className="hasSubheaders"
        />
      </Column>
    </Row>
  );
};

export default DSISiteTables;
