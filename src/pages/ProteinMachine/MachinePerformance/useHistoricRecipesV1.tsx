import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ProteinMachineRouteQueryParams } from 'types/protein';
import { useGetMachineTagsHistoryQuery, useGetConfiguredWidgetQuery } from 'api';
import { BaseTag, MachinePerformanceSubTabs, ConfiguredWidget, WidgetType } from 'types/protein';
import { widgetTypeToLabelSuffixMap } from 'constants/machineConfig';
import { transformDataToUniqueRows } from '../MachineHealth/DataAnalysis/TemplateDetails/helpers';
import { useLanguage } from 'providers';
import { useDateRange } from 'components';
import { removeStringFromObjKey } from 'components/StyledUi/js';
import styled from 'styled-components';

const Center = styled.div`
  text-align: center;
`;
export interface UseHistoricRecipesReturnProps {
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;

  /** need for tag query */
  machineId?: string;
  languageId?: string;

  /** processConfiguredWidget function, needed for tag query */
  widgetId?: string;
  /** used for headersOrder in HistoricRecipe Table */
  recipeTag?: string;
  /**  formerly tagData from HistoricRecipeTable - this is the data used in transformDataToUniqueRows
   * it should contain the raw tag data  */
  stringTags?: BaseTag[];
  /** used to get machine tags history in getMachineTagsHistoryQuery.  formerly sent to HistoricRecipeTable as `label` from
   * historic recipes main page.
   */
  tagCodes?: string[];

  /** recipes tag query */
  /** the formatted and ordered recipes data */
  /** formatted like [{date (itemId), starttime, duration, activerecipe (groupId)}] */
  tableData?: string[];
  tableValues?: Record<string, unknown>[];
}

const HistoricRecipesContext = createContext<UseHistoricRecipesReturnProps>({
  isLoading: true
});

export const useHistoricRecipes = (): UseHistoricRecipesReturnProps =>
  useContext(HistoricRecipesContext);

interface HistoricRecipesProviderProps {
  children?: ReactNode | ReactNode[];
}

export const HistoricRecipesProvider = ({
  children
}: HistoricRecipesProviderProps): JSX.Element => {
  // first set of calls to make sure the reqs are met
  const { timeZone } = useDateRange();
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { languageId } = useLanguage();

  let isLoading = !timeZone || !machineId || !languageId ? true : false;

  // second call to get required info to get machineTags
  // this call get machine info and widget data
  const {
    data: configuredWidgetData,
    error: configuredWidgetError,
    isLoading: configuredWidgetIsLoading
  } = useGetConfiguredWidgetQuery({
    machineId,
    labels: [
      `${MachinePerformanceSubTabs.HistoricRecipes}_${
        widgetTypeToLabelSuffixMap[WidgetType.MatrixWidgetGroup]
      }`
    ],
    includeTagValues: true,
    languageId: languageId
  });

  let hasError = configuredWidgetError ? `error loading config` : undefined;

  // process the configuredWidget return for use with components and to fetch historic recipe tags
  const {
    recipeTag,
    widgetId,
    tagCodes,
    hasError: processConfigDataError
  } = processConfiguredWidgetData(configuredWidgetData) as UseHistoricRecipesReturnProps;

  hasError = processConfigDataError || hasError;

  if (!recipeTag || !widgetId || !tagCodes || configuredWidgetIsLoading || !widgetId)
    isLoading = true;

  // only load the loader and isLoading, hasError messages
  if (hasError) {
    return (
      <HistoricRecipesContext.Provider value={{ isLoading, hasError }}>
        <Center>{hasError}</Center>
      </HistoricRecipesContext.Provider>
    );
  }

  const cacher = useMemo(
    () => (
      <MachineIdLoaded
        {...{
          machineId: machineId as string,
          languageId: languageId as string,
          tagCodes: tagCodes as string[],
          recipeTag: recipeTag as string,
          widgetId: widgetId as string
        }}
      >
        {children}
      </MachineIdLoaded>
    ),
    [machineId, languageId, tagCodes, recipeTag, widgetId]
  );

  // all reqs are met for next step in provider
  // sending needed items down a level
  return cacher;
};

interface MachineIdLoadedProps {
  children: ReactNode | ReactNode[];
  machineId: string;
  languageId: string;
  tagCodes: string[];
  recipeTag: string;
  widgetId: string;
}
const MachineIdLoaded = ({
  children,
  machineId,
  languageId,
  tagCodes,
  recipeTag,
  widgetId
}: MachineIdLoadedProps): JSX.Element => {
  let isLoading = true;

  const {
    data: stringTags,
    isLoading: stringTagsIsLoading,
    hasError
  } = useMachineTagsHistoryQuery(machineId, languageId, tagCodes);

  const cachedData = useMemo(() => stringTags, [stringTags]);

  isLoading = stringTagsIsLoading ? true : false;

  const { tableValues, tableData } = generateTableSettings(cachedData, recipeTag);

  const cleanedTableValues = tableValues
    ? removeStringFromObjKey(tableValues, `activerecipe`, ` *`)
    : undefined;

  if (!cleanedTableValues) isLoading = true;

  if (hasError)
    return (
      <HistoricRecipesContext.Provider value={{ isLoading, hasError }}>
        <Center>{hasError || `error`}</Center>
      </HistoricRecipesContext.Provider>
    );

  return (
    <HistoricRecipesContext.Provider
      value={{
        tableData: tableData as string[] | undefined,
        isLoading,
        hasError,
        stringTags: cachedData,
        tableValues: cleanedTableValues,
        machineId,
        widgetId
      }}
    >
      {children}
    </HistoricRecipesContext.Provider>
  );
};

/** tagCodes, formerly label sent to HistoricRecipesTable */
/** this call gets the recipes history data and returns `stringTags` used to
 * popuplate table and pie charts */
const useMachineTagsHistoryQuery = (
  machineId: string,
  languageId: string,
  tagCodes: string[]
): {
  data?: BaseTag[];
  isLoading?: boolean;
  hasError?: string;
} => {
  const { startTime, endTime } = useDateRange().isoDateRange;

  const { data, isLoading, error } = useGetMachineTagsHistoryQuery({
    machineId,
    startDatetime: startTime,
    endDatetime: endTime,
    tagCodes, // : label,
    languageId
  });

  const cachedData = useMemo(() => data, [data]);

  const hasError = error ? `error getting machine tags` : undefined;

  return { data: cachedData, isLoading, hasError };
};

// this function is used to get the widgetId - used for permissions, recipeTag - used for headersOrder, tagCodes - used to get recipes
const processConfiguredWidgetData = (
  data?: ConfiguredWidget[]
): UseHistoricRecipesReturnProps | undefined => {
  /** TODO: recipe history table widget label = MP_HR_MAIN_RECIPE_HISTORY  (after BE script is executed) */
  // Initialize variables to hold the recipe tag name, an array of tag codes, and the widget ID.
  let recipeTag: string | undefined = undefined; // used in headersOrder
  let tagCodes: string[] | undefined = [];
  let widgetId: string | undefined = undefined;

  // Check if the first element in the data array is truthy. If not, set widgetData to undefined.
  // Otherwise, set widgetData to the first element in the array.
  const widgetData: ConfiguredWidget | undefined = !data?.[0] ? undefined : data[0];

  // Use map function to iterate through each member of widgetData.members.
  widgetData?.members?.map((member) => {
    // If the member's name is "Recipe History", iterate through its members to extract the recipe tag and tag codes.
    if (member.name === 'Recipe History') {
      member.members?.map((tag) => {
        // If the tag's name is "Active Recipe", extract the tag's name or ID and assign it to recipeTag.
        if (tag.name === 'Active Recipe')
          tag.tags?.map((tag) => (recipeTag = tag.name ? tag.name : tag.id));
        // If the tag's name is "Active Recipe" or "Tags and Setpoints", extract the tag's ID and add it to tagCodes.
        if (tag.name === 'Active Recipe' || tag.name === 'Tags and Setpoints')
          tag.tags?.map((d) => tagCodes?.push(d.id));
      });
    }
  });

  // Extract the widget ID from widgetData.
  widgetId = widgetData?.id;

  // Set tagCodes to undefined if it has length zero.
  tagCodes = tagCodes.length ? tagCodes : undefined;

  return { widgetId, tagCodes, recipeTag };
};

const generateTableSettings = (
  stringTags?: BaseTag[],
  recipeTag?: string
): { tableData?: string[]; tableValues?: Record<string, unknown>[] } => {
  const { dateRange, timeZone } = useDateRange();
  const { endTime } = dateRange;

  if (stringTags && recipeTag) {
    const getTableData = transformDataToUniqueRows({
      endTime,
      showDatestamp: true,
      showDuration: true,
      stringTags,
      timeZone,
      headersOrder: [
        {
          columnName: recipeTag,
          columnPosition: 0
        }
      ],
      emptyValueSymbol: `--`
    });

    const formatValuesForBaseTable = (tableData: string[]) => {
      const newTableValues: Record<string, unknown>[] = [];
      const keys = tableData[0].split(';');
      tableData.map((row: string, index: number) => {
        if (index !== 0) {
          const rowObject: Record<string, unknown> = {};
          row.split(';').map((item, index) => {
            rowObject[keys[index].toLowerCase().replace(/\s/g, '')] = item;
          });
          newTableValues.push(rowObject);
        }
      });
      return newTableValues;
    };

    const tableValues = getTableData && formatValuesForBaseTable(getTableData);

    return { tableValues, tableData: getTableData };
  }
  return { tableValues: undefined, tableData: undefined };
};