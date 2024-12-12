// 3rd party libs
import React, { useEffect, useMemo, useState } from 'react';
import Tooltip from 'rc-tooltip';
import styled from 'styled-components';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { transparentize } from 'polished';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Lodash
import debounce from 'lodash/debounce';
import round from 'lodash/round';

// Components
import { BaseSelect, Button, Checkbox, Loader, SearchInput } from 'components';
import PropertyFilters from '../PropertyFilters/PropertyFilters';
import { useOverviewTemplate } from 'providers';

// Types
import { ChangeEvent } from 'types';
import {
  DataAnalysisTagStatus,
  MachineTagsModel,
  ProteinMachineRouteQueryParams,
  Tag
} from 'types/protein';
import { useGetMachineDataAnalysisTagsQuery } from 'api';

// Hooks
import { useQueryParams, useSearch } from 'hooks';

// Icons
import { DataAnalysisFilterIcon } from 'icons';

// Theme
import theme from 'themes';

interface PropertiesTabProps {
  openSaveNewTemplate: () => void;
}

const tagSort = (a: MachineTagsModel, b: MachineTagsModel): number => {
  // First sort on whether "selected" or not
  if ((a?.left || a?.right) && !b?.left && !b?.right) {
    return -1;
  } else if ((b?.left || b?.right) && !a?.left && !a?.right) {
    return 1;
  }
  // Assuming both are "selected" or not, then sort on the name
  // (if it exists)
  else if (a?.name && b?.name) {
    return a.name.localeCompare(b.name);
  }
  // Assuming we haven't sorted by this point, sort by tag ID
  else if (a?.tagId && b?.tagId) {
    return a.tagId.localeCompare(b.tagId);
  }

  // If not sorted by this point, they're the same (somehow)
  return 0;
};

const tagsMenuOptions = [DataAnalysisTagStatus.Active, DataAnalysisTagStatus.AllTags];

const PropertiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.8125rem 1.1875rem 1.0625rem 1.0625rem;
`;

const SelectContainer = styled.div`
  margin-left: 1rem;
  flex: 1;
`;

const FilterContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const SearchInputContainer = styled.div`
  margin-left: 1rem;
  flex: 2;
`;

const NameUnitContainer = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
  letter-spacing: 0em;
  text-align: left;
`;

const UnitContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: 0em;
  text-align: left;
`;

const ValueContainer = styled(UnitContainer)``;

const TableContainer = styled.div`
  overflow: visible;
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TooltipInformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  letter-spacing: 0em;
  text-align: left;
  word-wrap: break-word;
`;

const StyledTable = styled.table`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  thead,
  tbody,
  tr,
  td,
  th {
    display: block;
  }

  tr:after {
    content: ' ';
    display: block;
    visibility: hidden;
    clear: both;
  }

  th {
    font-size: ${(props) => props.theme.typography.components.tableHeader.size};
    font-weight: ${(props) => props.theme.typography.components.tableHeader.weight};
    line-height: ${(props) => props.theme.typography.components.tableHeader.lineHeight};
    padding: 0.6875rem 1rem;
  }

  tbody {
    overflow-y: auto;
    tr {
      border-bottom: ${(props) => props.theme.colors.borders.border02.border};
    }

    td {
      padding: auto;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      text-align: left;
    }
  }

  thead {
    border-bottom: ${(props) => props.theme.colors.borders.border02.border};
    border-top: ${(props) => props.theme.colors.borders.border02.border};
  }

  tbody td,
  thead th {
    width: 19.2%;
    float: left;
  }
`;

const ButtonContainer = styled.div`
  padding: 1.5rem;
`;

const searchByProps = ['name', 'tagId'];

const PropertiesTab = ({ openSaveNewTemplate }: PropertiesTabProps): JSX.Element => {
  const [tagsFilteredData, setTagsFilteredData] = useState<MachineTagsModel[]>([]);
  const [tagsMenu, setTagsMenu] = useState<DataAnalysisTagStatus>(DataAnalysisTagStatus.Active);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSelected, setFilterSelected] = useState(false);
  const [tagsModified, setTagsModified] = useState(false);
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { tagsData, setTagsData } = useOverviewTemplate();

  const [checkedTags, setCheckedTags] = useState<Record<string, string>>({});

  const query = useQueryParams();
  const tempId = query.get('templateId');
  const { t } = useTranslation(['mh']);

  /**
   * Query for tag history
   */
  const { data: tagsRawData, isFetching: isFetching } = useGetMachineDataAnalysisTagsQuery(
    machineId ? { machineId, numbersOnly: 'false' } : skipToken
  );

  const tagsModelData = useMemo(
    () =>
      tagsRawData?.reduce((acc: MachineTagsModel[], tag: Tag) => {
        acc.push({
          ...tag,
          left: false,
          right: false
        } as MachineTagsModel);
        return acc;
      }, []) ?? [],
    [tagsRawData]
  );

  const filteredTags = useSearch<MachineTagsModel>(searchQuery, tagsModelData, searchByProps);

  useEffect(() => {
    if (filteredTags.length == 0) return setTagsFilteredData([]);

    if (tempId !== null) {
      const copyFiltered: MachineTagsModel[] = filteredTags
        .map((tag) => {
          const foundTag = tagsData.find((td) => td.tagId === tag.tagId);
          if (foundTag) {
            return {
              left: foundTag.left,
              right: foundTag.right,
              tagId: foundTag.tagId,
              name: tag.name,
              unit: tag.unit,
              value: tag.value,
              extrinsics: foundTag.extrinsics
            };
          }
          return tag;
        })
        .sort(tagSort);

      setTagsFilteredData(
        tagsMenu === DataAnalysisTagStatus.Active
          ? copyFiltered.filter((tag) => tag.value !== 0)
          : copyFiltered
      );
    }
  }, [tempId, tagsData, filteredTags, tagsMenu]);

  useEffect(() => {
    if (filteredTags.length == 0) return setTagsFilteredData([]);

    const copyFiltered: MachineTagsModel[] = filteredTags
      .map((tag) => {
        const originalTag = tagsData.find((originalTag) => originalTag.tagId === tag.tagId);
        tag.left = originalTag?.left;
        tag.right = originalTag?.right;
        tag.extrinsics = originalTag?.extrinsics;
        return tag;
      })
      .sort(tagSort);

    setTagsFilteredData(
      tagsMenu === DataAnalysisTagStatus.Active
        ? copyFiltered.filter((tag) => tag.value !== 0)
        : copyFiltered
    );
  }, [tagsData]);

  useEffect(() => {
    return () => {
      debouncedSearchChange.cancel();
    };
  }, []);

  const getCheckedTagsRefresh = () => {
    return tagsData.reduce((acc: Record<string, string>, tag: MachineTagsModel) => {
      if (tag.right || tag.left) {
        acc[tag.tagId] = tag.right ? 'right' : 'left';
      }

      return acc;
    }, {} as Record<string, string>);
  };

  const handleCheck = (record: MachineTagsModel, checkname: string, checkValue: boolean) => {
    const newCheckedTags = { ...checkedTags, ...getCheckedTagsRefresh() };

    if (!checkValue) {
      if (newCheckedTags[record.tagId]) {
        delete newCheckedTags[record.tagId];
      }
    } else {
      newCheckedTags[record.tagId] = checkname;
    }

    setCheckedTags(newCheckedTags);

    const tagsToShow = tagsModelData.reduce((acc: MachineTagsModel[], tag: MachineTagsModel) => {
      if (newCheckedTags[tag.tagId]) {
        tag.left = false;
        tag.right = false;
        tag[newCheckedTags[tag.tagId]] = true;
        acc.push(tag);
      }

      return acc;
    }, []);

    setTagsData(tagsToShow);
    setTagsModified(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  const handleFilterSelect = () => {
    setFilterSelected(!filterSelected);
  };

  const debouncedSearchChange = useMemo(() => debounce(handleSearchChange, 300), []);

  const formatValue = (value: React.ReactNode): React.ReactNode => {
    const pattern = /e/;
    if (value && typeof value === 'number') {
      // check for exponential notation, e.g. 1.2e+23
      if (pattern.test(value as unknown as string)) {
        return (value as number).toPrecision(2);
      }
      return round(value, 2).toFixed(2);
    }
    return value;
  };

  return (
    <PropertiesContainer>
      <SearchContainer>
        <FilterContainer onClick={handleFilterSelect}>
          {DataAnalysisFilterIcon(
            filterSelected ? theme.colors.white : theme.colors.darkGrey,
            filterSelected ? theme.colors.mediumBlue : theme.colors.white
          )}
        </FilterContainer>
        <SearchInputContainer>
          <SearchInput
            placeholder={t('search_properties_dot') as string}
            onChange={debouncedSearchChange}
            borderRadius="0.5rem"
            variant={filterSelected ? 'disabled' : 'white'}
          />
        </SearchInputContainer>
        <SelectContainer>
          <BaseSelect
            variant={filterSelected ? 'disabled' : 'white'}
            value={tagsMenu}
            handleChange={(event): void => {
              setTagsMenu(event.target.value as DataAnalysisTagStatus);
            }}
            options={tagsMenuOptions}
            id="tagsMenu"
          />
        </SelectContainer>
      </SearchContainer>
      <TableContainer>
        {isFetching && <Loader />}
        {!isFetching && !filterSelected && (
          <StyledTable>
            <thead>
              <tr style={{ paddingRight: '0.875rem' }}>
                <th style={{ width: '48%', textAlign: 'left' }}>{t('name_unit')}</th>
                <th style={{ width: '24%', textAlign: 'left' }}>{t('value')}</th>
                <th style={{ width: '14%' }}>{t('left')}</th>
                <th style={{ width: '14%' }}>{t('right')}</th>
              </tr>
            </thead>
            <tbody>
              {tagsFilteredData?.map((record: MachineTagsModel) => {
                const { name, unit, value, left, right, link, tagId, extrinsics } = record;
                const backgroundColor = transparentize(0.55, extrinsics?.color ?? 'transparent');

                return (
                  <tr key={`${name}-${tagId}`} style={{ backgroundColor }}>
                    <td style={{ width: '48%', textAlign: 'left' }}>
                      <Tooltip
                        overlayClassName="information-tooltip"
                        placement={'left'}
                        overlay={
                          <TooltipInformationContainer>
                            {link && (
                              <div>
                                {t('link')}: {link}
                              </div>
                            )}
                            {tagId && (
                              <div>
                                {t('full_name')}: {tagId}
                              </div>
                            )}
                          </TooltipInformationContainer>
                        }
                        arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
                        overlayStyle={{
                          width: '16rem',
                          fontSize: '0.75rem',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          lineHeight: '0.875rem',
                          letterSpacing: '0em',
                          textAlign: 'left'
                        }}
                        align={{
                          offset: [-24, 0]
                        }}
                      >
                        <NameUnitContainer>
                          <NameContainer>{name ? name : tagId}</NameContainer>
                          <UnitContainer>{unit !== null ? '(' + unit + ')' : ''}</UnitContainer>
                        </NameUnitContainer>
                      </Tooltip>
                    </td>
                    <td style={{ width: '24%', textAlign: 'right' }}>
                      <ValueContainer>{formatValue(value)}</ValueContainer>
                    </td>
                    <td style={{ width: '14%', textAlign: 'center' }}>
                      <Checkbox
                        width={20}
                        height={20}
                        checked={!!(left as boolean)}
                        onChange={(event: ChangeEvent) => {
                          const val = event.target.checked;
                          handleCheck(record as MachineTagsModel, 'left', val);
                        }}
                      />
                    </td>
                    <td style={{ width: '14%', textAlign: 'center' }}>
                      <Checkbox
                        width={20}
                        height={20}
                        checked={!!(right as boolean)}
                        onChange={(event: ChangeEvent) => {
                          const val = event.target.checked;
                          handleCheck(record as MachineTagsModel, 'right', val);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </StyledTable>
        )}
        {!isFetching && filterSelected && (
          <PropertyFilters setFiltersSelected={setFilterSelected} />
        )}
      </TableContainer>
      {tagsModified && (
        <ButtonContainer>
          <Button variant="primary" onClick={() => openSaveNewTemplate()}>
            {t('save_as_new_view')}
          </Button>
        </ButtonContainer>
      )}
    </PropertiesContainer>
  );
};

export default PropertiesTab;
