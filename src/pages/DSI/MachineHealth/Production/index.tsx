// 3rd party libs
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { find, last } from 'lodash';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import ChartsOverTimeContainer from './ChartsOverTimeContainer';
import {
  PageGrid,
  TileWidget,
  TileWidgetCellValueProps,
  gridDSIProduct,
  PageGridColHeader
} from 'components';
import ProductTypeContainer from 'pages/DSI/MachineHealth/Production/ProductTypeContainer';
import WidgetContainer from 'pages/DSI/MachineHealth/Production/WidgetContainer';
import round from 'lodash/round';

// Hooks
import useMachineHealthByBuKpi from 'hooks/useMachineHealthByBuKpi';

// Types
import { BusinessUnit, DSIKpiId, DSIKPIType, MachineHealthInterval } from 'types/dsi';
import { DSImachineStatusProvider } from 'providers/useDSImachineStatusProviderLastHour';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5vw;
`;

const ProductTiles = () => {
  const { machineId } = useParams<{ machineId: string }>();
  const { t } = useTranslation(['mh']);
  const { machineHealth: currentKpiResult, isLoading: isLoading } = useMachineHealthByBuKpi(
    machineId,
    DSIKPIType.DsiCurrentKpi,
    MachineHealthInterval.LastHour,
    true,
    BusinessUnit.DSI
  );

  const { machineHealth: infeedPieceSizeResult, isLoading: isLoadingInfeed } =
    useMachineHealthByBuKpi(
      machineId,
      DSIKPIType.InfeedPieceSize,
      MachineHealthInterval.LastHour,
      true,
      BusinessUnit.DSI
    );

  const currentPsu = find(currentKpiResult, (o) => o.id === DSIKpiId.CurrentPSU);
  const appName = find(currentKpiResult, (o) => o.id === DSIKpiId.App);
  const infeedPieceSizeItem = find(infeedPieceSizeResult, (o) => o.id === DSIKpiId.InfeedPiece);
  const infeedPieceSizeLastValue = infeedPieceSizeItem?.values && last(infeedPieceSizeItem.values);
  const infeedPieceSizeValueModified =
    infeedPieceSizeLastValue?.value && round(infeedPieceSizeLastValue.value, 0).toLocaleString();

  const productLeftCellValues = [
    {
      value: `${infeedPieceSizeValueModified ?? '-'}${infeedPieceSizeValueModified ? 'g' : ''}`,
      title: t('avg_last_1min') as string
    }
  ];

  const productRightCellValues =
    appName &&
    (appName.values.map(({ value }, i) => ({
      value,
      title: `${t('asu', { item: i + 1 }) as string}`
    })) as TileWidgetCellValueProps[]);

  return (
    <>
      <TileWidget
        ga="c-1"
        isLoading={isLoadingInfeed ? true : false}
        title={t('infeed_piece_size') as string}
        cellValues={productLeftCellValues}
      />
      <TileWidget
        ga="c-2"
        isLoading={isLoading}
        title={`${currentPsu?.value?.value || ``}`}
        subTitle={t('current_psu') as string}
        cellValues={productRightCellValues}
      />
    </>
  );
};

const Production = (): ReactElement => {
  const { machineId } = useParams<{ machineId: string }>();
  const { t } = useTranslation(['mh']);

  const { machineHealth: currentKpiResult } = useMachineHealthByBuKpi(
    machineId,
    DSIKPIType.DsiCurrentKpi,
    MachineHealthInterval.LastHour,
    true,
    BusinessUnit.DSI
  );

  const productType = find(currentKpiResult, (o) => o.id === DSIKpiId.ProductType);

  return (
    <Container>
      <PageGrid {...gridDSIProduct}>
        <PageGridColHeader ga="title">{t('product')}</PageGridColHeader>
        <ProductTiles />
      </PageGrid>

      <DSImachineStatusProvider machineId={machineId}>
        <WidgetContainer />
      </DSImachineStatusProvider>

      <ProductTypeContainer productTypes={productType?.values} />
      <div>
        <ChartsOverTimeContainer />
      </div>
    </Container>
  );
};

export default Production;
