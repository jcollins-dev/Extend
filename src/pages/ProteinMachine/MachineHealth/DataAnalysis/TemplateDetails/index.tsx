// 3rd party libs
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLineChart, faDownload, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useHistory, useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// Lodash
import merge from 'lodash/merge';
import flatten from 'lodash/flatten';

// Components
import { BaseSelect, Button, Typography } from 'components';
import { DataRenderer, MachineTagsChart } from 'components/machine-health';
import MachineStatesChart from 'components/machine-health/MachineStatesChart';
//import PropertiesTab from '../Properties';
//import SaveTemplateModal from '../SaveTemplateModal/TemplateDetails';
//import HistoricalStatisticsModal from '../HistoricalStatisticsModal';

// Theme
import theme from 'themes';

// Types
import {
  BaseTag,
  BaseTagDataType,
  DataAnalysisPropTypes,
  MachineTagsModel,
  ProteinMachineRouteQueryParams
} from 'types/protein';
import { Interpolation } from 'types/graph';

// Helpers
import { dataToCSV, transformDataToUniqueRows } from './helpers';

// Hooks
import { useQueryMachineTags, useQueryParams } from 'hooks';

// Constants
import { JBTRoutes } from 'constants/routes';
import breakpoint from 'constants/breakpoints';

// Providers
import { DateProvider, useContainerResize, useOverviewTemplate, useTimeZone } from 'providers';

// Api
import { useGetTemplateQuery, useGetTemplatesQuery } from 'api';
import PropertiesTab from 'components/machine-health/Properties';
import HistoricalStatisticsModal from 'components/machine-health/HistoricalStatisticsModal';
import SaveTemplateModal from 'components/machine-health/SaveTemplateModal/TemplateDetails';

interface SideMenuProps {
  isOpen: boolean;
}

interface ButtonSidenavProps {
  isOpen: boolean;
}

const FLYOUT_TRANSITION_DURATION = 500;

// Styling
export const MainViewContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  background-image: radial-gradient(${theme.colors.darkGrey} 3%, transparent 4%);
  background-color: ${theme.colors.lightGrey1};
  background-position: 0 0, 0.3125rem 0.3125rem;
  background-size: 1.5625rem 1.5625rem;
  height: 100%;
`;

const SideMenu = styled.div<SideMenuProps>`
  flex: 0 0 30rem;
  margin-right: ${({ isOpen }) => (isOpen ? '0' : '-30rem')};
  transition: margin-right ${FLYOUT_TRANSITION_DURATION / 1000}s;
  position: relative;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  height: 99%;
  overflow: visible;
  border-left: ${theme.colors.mediumGrey1} 0.0625rem solid;
`;

const Header = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const HeaderTitle = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  padding: 1.125rem;
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const HeaderButtonContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.darkGrey};
  padding: 1.125rem;
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const CloseButton = styled.button`
  background: inherit;
  border: none;
  cursor: pointer;
  padding: 0 0.25rem;
`;

const ButtonSidenav = styled.div<ButtonSidenavProps>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  //height: 100%;
  background: ${theme.colors.lightGrey1};
  width: 3.625rem;
`;

const NoGraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  background-image: url('/assets/imgs/icons/graph.png');
  height: 16.875rem;
  background-repeat: no-repeat;
  background-position: center;
`;

const ExpandFlyoutButton = styled.div`
  vertical-align: top;
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 0;
  border-left: ${theme.colors.mediumGrey1} 0.0625rem solid;
  padding: 0;
`;

const IconContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.darkGrey};
  border: none;
  cursor: pointer;
  padding: 1rem;
  text-align: center;
`;

const Graphs = styled.div`
  flex: 1;
  padding: 1rem;
  margin: auto;
  & > div:last-child {
    margin-top: 1rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const DropdownContainer = styled.div`
  padding: 1rem;
  padding-top: 3.25rem;
  width: 21rem;
`;

const GraphContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

const ButtonRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  height: 3.5rem;
  justify-content: flex-end;
  padding-right: 3.5625rem;
  padding-top: 0.5rem;
  position: relative;
  width: 100%;

  @media ${breakpoint.device.xxl} {
    height: 0;
    padding-top: 0;
    top: -3.625rem;
  }

  & > button {
    height: 2.5rem;
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin-right: 0.25rem;
  margin-left: 0 !important;
`;

const TemplateDetails = (): JSX.Element => {
  const { timeZone } = useTimeZone();
  const { t } = useTranslation(['mh']);
  const [flyout, setFlyout] = useState(false);
  const [saveNewTemplate, setSaveNewTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [recipeHistoryModalOpen, setRecipeHistoryModalOpen] = useState(false);
  const [recipeHistoryMessages, setRecipeHistoryMessages] = useState<
    {
      message: string;
      type: 'info' | 'error';
    }[]
  >([]);

  const { setResizeDelay, setShouldResize } = useContainerResize();

  useEffect(() => {
    setResizeDelay(FLYOUT_TRANSITION_DURATION);
  }, []);

  useEffect(() => {
    setShouldResize(flyout);
  }, [flyout]);

  const {
    startTime,
    endTime,
    tagsData,
    filterDataParams,
    setYAxisMinMax,
    setTagsData,
    setFilterDataParams
  } = useOverviewTemplate();

  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const query = useQueryParams();
  const tempId = query.get('templateId');

  /**
   * Query templates
   */
  const {
    data: templates,
    isFetching: isFetchingTemplates,
    isLoading: isLoadingTemplates
  } = useGetTemplatesQuery({
    machineId: machineId
  });

  /**
   * Query template
   */
  const {
    data: template,
    isLoading: isLoadingTemplate,
    isFetching: isFetchingTemplate
  } = useGetTemplateQuery(
    {
      machineId: machineId,
      templateId: templateId as string
    },
    { skip: templateId === 'undefined' || !templateId }
  );

  /**
   * Query machine tags history
   */
  const {
    tags: rawTags,
    states,
    isLoading,
    isFetching,
    error
  } = useQueryMachineTags({
    startDatetime: startTime,
    endDatetime: endTime,
    tagCodes: tagsData.map((tag) => tag.tagId),
    limit: Number.parseInt(
      filterDataParams.find((param) => param.property === DataAnalysisPropTypes.MaxDataPoints)
        ?.value as string
    )
  });

  const preFilterTags = rawTags?.map((rawTag) => {
    const tagData = tagsData.find((tagData) => tagData.tagId === rawTag.id);
    const extrinsics = merge(tagData?.extrinsics ?? {}, rawTag?.extrinsics ?? {});

    return {
      ...rawTag,
      extrinsics
    };
  });

  const tags = preFilterTags?.filter((tag) => tagsData.some((tagData) => tagData.tagId === tag.id));

  const yAxisMinMax = useMemo(() => {
    const leftYs = tags?.filter((d) =>
      tagsData
        .filter((d) => d.left)
        .map((t) => t.tagId)
        .includes(d.id)
    );
    const rightYs = tags?.filter((d) =>
      tagsData
        .filter((d) => d.right)
        .map((t) => t.tagId)
        .includes(d.id)
    );
    const lys = flatten(
      leftYs?.map((s) => s.values.map((d) => (typeof d.value === 'number' ? d.value : 0)))
    );
    const rys = flatten(
      rightYs?.map((s) => s.values.map((d) => (typeof d.value === 'number' ? d.value : 0)))
    );
    return [
      {
        left: lys && lys.length > 0 ? true : false,
        min: 0,
        max: Math.max(...lys)
      },
      {
        right: rys && rys.length > 0 ? true : false,
        min: 0,
        max: Math.max(...rys)
      }
    ];
  }, [isFetching, isLoading]);

  useEffect(() => {
    if (tempId !== null) {
      setTemplateId(tempId);
    }
    if (template) {
      const selectedTags = template.tags.map((tag) => {
        return {
          left: tag.isLeftSide ? true : false,
          right: tag.isLeftSide ? false : true,
          tagId: tag.tagCode
        } as MachineTagsModel;
      });
      setTagsData(selectedTags);
      const minValL = template.properties.filter(
        (property) => property.property === DataAnalysisPropTypes.FirstYAxisMin
      )[0].value;
      const maxValL = template.properties.filter(
        (property) => property.property === DataAnalysisPropTypes.FirstYAxisMax
      )[0].value;
      const minValR = template.properties.filter(
        (property) => property.property === DataAnalysisPropTypes.SecondYAxisMin
      )[0].value;
      const maxValR = template.properties.filter(
        (property) => property.property === DataAnalysisPropTypes.SecondYAxisMax
      )[0].value;
      setYAxisMinMax([
        {
          left: true,
          min: minValL ? parseInt(minValL as string) : 0,
          max: maxValL ? parseInt(maxValL as string) : 0
        },
        {
          right: true,
          min: minValR ? parseInt(minValR as string) : 0,
          max: maxValR ? parseInt(maxValR as string) : 0
        }
      ]);
      setFilterDataParams(template.properties);
    } else {
      setYAxisMinMax(yAxisMinMax);
    }
  }, [tempId, template]);

  const openFlyout = (): void => {
    setFlyout(true);
  };

  const openSaveNewTemplate = (): void => {
    setSaveNewTemplate(true);
  };

  const closeSaveNewTemplate = (): void => {
    handleNameChange('');
    setSaveNewTemplate(false);
  };

  const handleNameChange = (name: string) => {
    setNewTemplateName(name);
  };

  const downloadTemplateCSV = () => {
    if (stringTags.length < 1 && numberTags.length < 1 && (states?.length || 0) < 1) {
      return toast.error(t('no_data_to_download'));
    }

    const data = transformDataToUniqueRows({
      endTime,
      numberTags,
      showDatestamp: false,
      showDuration: false,
      states,
      stringTags,
      timeZone
    });

    const csv = dataToCSV(data);

    saveAs(
      new Blob(csv, { type: 'text/csv;charset=utf-8', endings: 'native' }),
      `data-analysis-template.csv`
    );
  };

  const history = useHistory();

  const templateSelectHandler = (selectedTemplateId?: string) => {
    history.push({
      pathname: JBTRoutes.machineHealthDataAnalysisTemplate.replace(':machineId', machineId),
      search: `?templateId=${selectedTemplateId}`
    });
  };

  const { numberTags, stringTags, booleanTags } = useMemo(() => {
    const booleanTags: BaseTag[] = [];
    const numberTags: BaseTag[] = [];
    const stringTags: BaseTag[] = [];

    tags?.forEach((tag) => {
      if (tag.meta?.dataType === BaseTagDataType.Boolean) {
        booleanTags.push(tag);
      } else if (tag.values.every((value) => typeof value.value === 'number')) {
        numberTags.push(tag);
      } else if (
        tag.values.every((value) => typeof value.value === 'string') ||
        tag.meta?.dataType === BaseTagDataType.String
      ) {
        stringTags.push(tag);
      }
    });

    return { booleanTags, numberTags, stringTags };
  }, [tags]);

  const downloadRecipeHistory = () => {
    if (stringTags.length < 1 || numberTags.length < 1) {
      return toast.error(t('no_data_to_download'));
    }

    const data = transformDataToUniqueRows({
      endTime,
      numberTags,
      showDatestamp: true,
      showDuration: true,
      states,
      stringTags,
      timeZone
    });

    const csv = dataToCSV(data);

    saveAs(
      new Blob(csv, { type: 'text/csv;charset=utf-8', endings: 'native' }),
      `recipe-setpoint-history.csv`
    );
  };

  const handleDownLoadRecipeHistoryClick = () => {
    // if warnings are present, show warning modal
    if (stringTags.length === 0) {
      setRecipeHistoryMessages((prev) => [
        ...prev,
        {
          message: t('one_string_tag_must_be_selected'),
          type: 'error'
        }
      ]);
    }

    if (numberTags.length === 0) {
      setRecipeHistoryMessages((prev) => [
        ...prev,
        {
          message: t('one_number_tag_must_be_selected'),
          type: 'error'
        }
      ]);
    }

    // otherwise download the recipe history
    if (stringTags.length > 0 && numberTags.length > 0) {
      setRecipeHistoryMessages([]);
      downloadRecipeHistory();
    }
  };

  useEffect(() => {
    if (recipeHistoryMessages.length > 0) {
      setRecipeHistoryModalOpen(true);
    }
  }, [recipeHistoryMessages]);

  // Plot number tags
  const tagsGraph =
    tagsData.length !== 0 && tags?.length !== 0 && numberTags && numberTags.length > 0 ? (
      <MachineTagsChart
        tags={numberTags}
        rightAxisTags={tagsData.filter((d) => d.right).map((t) => t.tagId)}
        filterDataParams={filterDataParams}
        isBooleanChart={false}
        interpolation={Interpolation.Linear}
      />
    ) : null;

  // Plot boolean tags
  const booleanTagsGraph =
    tagsData.length !== 0 && tags?.length !== 0 && booleanTags && booleanTags.length > 0 ? (
      <MachineTagsChart
        tags={booleanTags}
        rightAxisTags={tagsData.filter((d) => d.right).map((t) => t.tagId)}
        filterDataParams={filterDataParams}
        isBooleanChart={true}
        interpolation={Interpolation.StepAfter}
      />
    ) : null;

  // Plot string tags
  const stringTagsGraph =
    tagsData.length !== 0 && tags?.length !== 0 && stringTags && stringTags.length > 0 ? (
      <MachineStatesChart
        hideSubStepIds
        isStringTagChart
        title={t('machine_tags')}
        states={stringTags}
      />
    ) : null;

  // Plot states
  const statesGraph =
    tagsData.length !== 0 && states?.length !== 0 ? (
      <MachineStatesChart hideSubStepIds title={t('machine_states')} states={states} />
    ) : null;

  // combine graphs
  const graphs =
    tagsGraph || stringTagsGraph || booleanTagsGraph || statesGraph ? (
      <Graphs>
        {tagsGraph}
        {booleanTagsGraph}
        {stringTagsGraph}
        {statesGraph}
      </Graphs>
    ) : null;

  const content = (
    <ContentContainer>
      <DataRenderer
        isLoading={isLoadingTemplates || isFetchingTemplates}
        error={error && (t('failed_to_load_tags') as string)}
      >
        {!isFetchingTemplates && templates && templateId !== 'undefined' && (
          <DropdownContainer>
            <BaseSelect
              variant={'white'}
              value={(templateId as string) || ''}
              handleChange={(event): void => {
                setTemplateId(event.target.value);
                templateSelectHandler(event.target.value);
              }}
              options={templates?.map((template) => {
                return {
                  value: template.viewId as string,
                  label: template.viewName as string
                };
              })}
              placeholder={t('select_dot') as string}
              id="viewId"
            />
          </DropdownContainer>
        )}
      </DataRenderer>
      <DataRenderer
        isLoading={isLoading || isFetching || isLoadingTemplate || isFetchingTemplate}
        error={error && (t('failed_to_load_tags') as string)}
      >
        {graphs ? (
          <DateProvider context={{ startTime, endTime }}>
            <GraphContainer>{graphs}</GraphContainer>
          </DateProvider>
        ) : (
          <NoGraphContainer>
            <Typography variant="h2">{t('no_properties_selected')}</Typography>
            <Typography size="1.125rem" color="mediumGrey2">
              {t('template_select_properties_message')}
            </Typography>
          </NoGraphContainer>
        )}
      </DataRenderer>
    </ContentContainer>
  );

  return (
    <>
      <ButtonRowContainer>
        <Button
          variant="warning"
          bgColor={theme.colors.mediumBlue}
          onClick={() => handleDownLoadRecipeHistoryClick()}
          icon={<StyledIcon icon={faDownload} color={theme.colors.white} />}
          width="fit-content"
        >
          {t('recipe_setpoint_history')}
        </Button>
        <Button
          variant="warning"
          bgColor={theme.colors.mediumBlue}
          onClick={() => downloadTemplateCSV()}
          icon={<StyledIcon icon={faDownload} color={theme.colors.white} />}
          width="fit-content"
        >
          {t('download_csv')}
        </Button>
      </ButtonRowContainer>
      <MainViewContainer>
        {content}
        <ButtonSidenav isOpen={!flyout}>
          <ExpandFlyoutButton onClick={openFlyout}>
            <IconContainer>
              <FontAwesomeIcon
                style={{ fontSize: '1.5rem' }}
                icon={faLineChart}
                color={theme.colors.white}
              />
            </IconContainer>
          </ExpandFlyoutButton>
        </ButtonSidenav>
        <SideMenu isOpen={flyout} tabIndex={0}>
          {!saveNewTemplate && (
            <>
              <Header>
                <HeaderTitle>
                  <Typography as="h3" mb={0} size="1.125rem" weight="bold">
                    {t('properties')}
                  </Typography>
                </HeaderTitle>
                <HeaderButtonContainer>
                  <CloseButton onClick={() => setFlyout(false)}>
                    <FontAwesomeIcon
                      style={{ fontSize: '1.5rem' }}
                      icon={faArrowRight}
                      color={theme.colors.white}
                    />
                  </CloseButton>
                </HeaderButtonContainer>
              </Header>
              <PropertiesTab openSaveNewTemplate={openSaveNewTemplate} />
            </>
          )}
          {saveNewTemplate && (
            <SaveTemplateModal
              properties={filterDataParams}
              tagsData={tagsData.map((tag) => {
                return {
                  tagCode: tag.tagId,
                  isLeftSide: tag.left ? true : false
                };
              })}
              templateName={newTemplateName}
              closeModal={closeSaveNewTemplate}
              handleNameChange={handleNameChange}
            />
          )}
        </SideMenu>
      </MainViewContainer>

      <HistoricalStatisticsModal
        isOpen={recipeHistoryModalOpen}
        messages={recipeHistoryMessages}
        onCloseCallback={() => {
          setRecipeHistoryMessages([]);
          setRecipeHistoryModalOpen(false);
        }}
        onDownloadCallback={() => {
          downloadRecipeHistory();
          setRecipeHistoryModalOpen(false);
        }}
      />
    </>
  );
};

export default TemplateDetails;
