// 3rd party libs
import React, { useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { SerializedError } from '@reduxjs/toolkit';
import Tooltip from 'rc-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

// Components
import { Card, KPIOverTimeGraph, Typography, PermissionWrapper } from 'components';
import { AdminCardEditButton, DataRenderer, MachineStatesChart } from 'components/machine-health';
import TagGroup from './TagGroup';
import ChartTagData from './ChartTagData';

// Types
import { BaseTag, BaseTagDataType, ConfiguredWidget } from 'types/protein';
import { Interpolation } from 'types/graph';
import { PermissionScopeName } from 'types/user-management';
import { Role, UserScopes } from 'types';

// Providers
import { useDate, useSyncZoom, useTimeZone } from 'providers';

// Utils
import { axisStyle, formatLineSeriesTooltip, toLineSeries, yAxis } from './utils';

interface Props {
  data: ConfiguredWidget;
  machineId: string;
}

const StyledCard = styled(Card)`
  background: ${({ theme }) => theme.colors.lightGrey1};
  position: relative;
`;

const HeaderInner = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const BodyInner = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Graphs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledLoadingWrapper = styled.div`
  height: 40px;
  padding-top: 1rem;
`;

const EditButtonContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;

const MatrixWidget = ({ data, machineId }: Props): JSX.Element => {
  const { timeZone } = useTimeZone();
  const { zoomedDomain, onBrushDomainChangeEnd, resetZoom } = useSyncZoom();
  const { startTime, endTime } = useDate();
  const theme = useTheme();

  const [chartForWidgetId, setChartForWidgetId] = useState('');
  const [chartTags, setChartTags] = useState<string[]>();
  const [tagData, setTagData] = useState<BaseTag[]>([]);
  const [statesData, setStatesData] = useState<BaseTag[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<
    Record<string, FetchBaseQueryError | SerializedError | undefined>
  >({});
  const [isEditAdminPopupOpen, setIsEditAdminPopupOpen] = useState<boolean>(false);

  const { numberTags, stringTags, booleanTags } = useMemo(() => {
    const booleanTags: BaseTag[] = [];
    const numberTags: BaseTag[] = [];
    const stringTags: BaseTag[] = [];

    tagData?.forEach((tag) => {
      if (tag.meta?.dataType === BaseTagDataType.Boolean) {
        booleanTags.push(tag);
      } else if (tag.values.every((value) => typeof value.value === 'number')) {
        numberTags.push(tag);
      } else if (tag.values.every((value) => typeof value.value === 'string')) {
        stringTags.push(tag);
      }
    });

    return { booleanTags, numberTags, stringTags };
  }, [tagData]);

  const { numberSeries, booleanSeries } = useMemo(() => {
    const numberSeries = formatLineSeriesTooltip(toLineSeries(numberTags), timeZone);
    const booleanSeries = formatLineSeriesTooltip(toLineSeries(booleanTags), timeZone);
    return { numberSeries, booleanSeries };
  }, [booleanTags, numberTags, timeZone]);

  return (
    <StyledCard borderColor={theme.colors.mediumGrey1}>
      <EditButtonContainer>
        <Tooltip placement="top" overlay="Edit">
          <IconButton onClick={() => setIsEditAdminPopupOpen(true)}>
            <FontAwesomeIcon icon={faPencil} />
          </IconButton>
        </Tooltip>
      </EditButtonContainer>
      <Card.Header bgColor={theme.colors.lightGrey1}>
        <HeaderInner>
          <Typography weight="bold" as="h3" size="1.125rem" mb={0}>
            {data.name}
          </Typography>
          {data.id && (
            <PermissionWrapper
              page={PermissionScopeName.FLEET}
              scope={UserScopes.Write}
              role={Role.Admin}
            >
              <AdminCardEditButton
                isEditAdminPopupOpen={isEditAdminPopupOpen}
                machineId={machineId}
                setIsEditAdminPopupOpen={setIsEditAdminPopupOpen}
                widgetId={data.id}
              />
            </PermissionWrapper>
          )}
        </HeaderInner>
      </Card.Header>
      <Card.Body pt={0}>
        <BodyInner>
          {data.members?.map((tagGroup) => (
            <TagGroup
              key={tagGroup.id}
              data={tagGroup}
              isChartVisible={tagGroup.id === chartForWidgetId}
              onToggleChart={() => {
                if (tagGroup.id === chartForWidgetId) {
                  setChartForWidgetId('');
                  setChartTags(undefined);
                } else {
                  setChartForWidgetId(tagGroup.id);
                  setChartTags(tagGroup.tags?.map((tag) => tag.id));
                }
                setTagData([]);
              }}
            />
          ))}
        </BodyInner>
        {chartForWidgetId && chartTags && (
          <>
            <DataRenderer
              isLoading={false}
              error={
                Object.values(error).some((error) => !!error) ? 'Failed to load tags' : undefined
              }
            >
              <Graphs>
                {booleanTags.length !== 0 && (
                  <KPIOverTimeGraph
                    key={`chart-${chartForWidgetId}`}
                    series={booleanSeries}
                    title={data.name as string}
                    axisH={yAxis(timeZone)}
                    axisV={axisStyle.vertical}
                    sync={true}
                    brush={{
                      zoomedDomain,
                      onBrushDomainChangeEnd,
                      resetZoom
                    }}
                    isBooleanChart={true}
                    interpolation={Interpolation.StepAfter}
                    displayZeroLine={true}
                  />
                )}
                {numberTags.length !== 0 && (
                  <KPIOverTimeGraph
                    key={`chart-${chartForWidgetId}`}
                    series={numberSeries}
                    title={data.name as string}
                    axisH={yAxis(timeZone)}
                    axisV={axisStyle.vertical}
                    sync={true}
                    brush={{
                      zoomedDomain,
                      onBrushDomainChangeEnd,
                      resetZoom
                    }}
                    isBooleanChart={false}
                    interpolation={Interpolation.Linear}
                    displayZeroLine={true}
                  />
                )}
                {stringTags.length !== 0 && (
                  <MachineStatesChart
                    hideSubStepIds
                    isStringTagChart
                    title={data.name as string}
                    states={stringTags}
                  />
                )}
                {statesData?.length !== 0 && (
                  <MachineStatesChart
                    hideSubStepIds
                    title={data.name as string}
                    states={statesData}
                  />
                )}
              </Graphs>
            </DataRenderer>
            <StyledLoadingWrapper>
              <DataRenderer isLoading={Object.values(loading).some((load) => !!load)} />
            </StyledLoadingWrapper>
          </>
        )}
      </Card.Body>
      {chartTags?.map((tagId) => (
        <ChartTagData
          currentTagValue={tagData.find((tag) => tag.id === tagId)}
          endTime={endTime}
          key={tagId}
          setError={setError}
          setLoading={setLoading}
          setStatesData={setStatesData}
          setTagData={setTagData}
          startTime={startTime}
          tagId={tagId}
        />
      ))}
    </StyledCard>
  );
};

export default MatrixWidget;
