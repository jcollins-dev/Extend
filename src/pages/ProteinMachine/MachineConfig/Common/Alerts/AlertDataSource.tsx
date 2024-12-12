// Third Party
import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

// Hooks
import { useSearch, useSort } from 'hooks';

// Types
import { MachineMasterTag } from 'types/protein';
import { BaseType, SortState, ColumnConfig } from 'types';

// Components
import { SearchInput, BaseTable, Typography, Pagination, ActionButton } from 'components';

// Constants
import { PAGE_LENGTH, SEARCH_COOLDOWN } from 'constants/search';
import { AlertsTableDropdownItem } from 'types/machine-health/widget-table';

const WordBreak = styled.span<{ capitalize?: boolean }>`
  text-transform: ${(props) => (props.capitalize ? 'capitalize' : 'none')};
  word-break: break-all;
`;

/* Initial states for searching */
const masterTagListSearchByProps = ['friendlyName', 'id'];
const SORT_STATE = { id: SortState.ascending };
const ITEMS_PER_PAGE = PAGE_LENGTH.XLARGE;

interface Props {
  onClose: () => void;
  tagList?: AlertsTableDropdownItem[];
  handleSelect: (value: AlertsTableDropdownItem) => void;
}

const StyledSelectTagComponent = styled.div`
  .back_button {
    border: none;
    background: none;
    cursor: pointer;
    width: 30px;
  }

  .header_wrapper {
    display: flex;
    flex-direction: row;
    margin: 1rem 1rem 2rem;

    h2 {
      margin-bottom: 6px;
    }
  }

  .search_field_wrapper {
    margin: 1rem;
  }

  .rc-table-cell {
    svg {
      margin-bottom: 1px;
    }
  }
`;

const StyledTableWrapper = styled.div`
  margin: 0 1rem;
`;

export const AlertDataSource = ({ onClose, tagList, handleSelect }: Props): JSX.Element => {
  const [tableData, setTableData] = useState(tagList);
  const [searchVal, setSearchVal] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(0);

  const searchedMasterTagList = useSearch<AlertsTableDropdownItem>(
    searchVal,
    tableData,
    masterTagListSearchByProps
  );
  const { t } = useTranslation(['mh', 'common']);

  const sortedMasterTagList = useSort<AlertsTableDropdownItem>(SORT_STATE, searchedMasterTagList);

  const paginatedMasterTagList = useMemo(() => {
    // pageNumber is 0-indexed for array slicing
    const start = pageNumber * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return sortedMasterTagList.slice(start, end);
  }, [pageNumber, sortedMasterTagList]);

  // Required to update local state with fetched data once available
  useEffect(() => {
    setTableData(tagList?.map((tag) => ({ ...tag, key: tag.id })));
  }, [tagList]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchVal(event.target.value);
  };

  const handleSelectTag = (value: AlertsTableDropdownItem) => {
    handleSelect(value);
    onClose();
  };

  const columnConfigs = (): ColumnConfig[] => {
    return [
      {
        title: t('name_unit') as string,
        dataIndex: 'id',
        key: 'id',
        render: (_, value) => {
          const { id } = value as MachineMasterTag;
          return <WordBreak>{id}</WordBreak>;
        }
      },
      {
        title: t('last_value') as string,
        dataIndex: 'lastValue',
        key: 'lastvalue',
        render: (_, value) => {
          const val = value as AlertsTableDropdownItem;
          const lastValue =
            val && val.values && val.values?.length > 0 ? val.values[0].value : '--';
          return <WordBreak>{lastValue}</WordBreak>;
        }
      },
      {
        title: '',
        dataIndex: 'action',
        key: 'action',
        render: (_, value) => {
          return (
            <ActionButton
              marginTop={'0'}
              onClick={() => handleSelectTag(value as AlertsTableDropdownItem)}
            >
              {t('select', { ns: 'common' })}
            </ActionButton>
          );
        },
        width: '5rem'
      }
    ];
  };

  return (
    <StyledSelectTagComponent>
      <div className="header_wrapper">
        <button className="back_button" onClick={() => onClose()}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <Typography size="1.3125rem" as="h2" mb="1px" color="darkGrey" weight="bold">
          {t('select_tag')}
        </Typography>
      </div>

      <div className="search_field_wrapper">
        <SearchInput
          borderRadius="0.625rem"
          onChange={debounce(handleSearchChange, SEARCH_COOLDOWN)}
          placeholder={t('type_tag_technical_name') as string}
          variant="white"
        />
      </div>
      <StyledTableWrapper>
        <BaseTable
          columnConfigs={columnConfigs()}
          data={paginatedMasterTagList}
          renderCustomEmptyText={() => {
            return (
              <Typography
                color="darkGrey"
                weight="medium"
                style={{ marginLeft: '1.25rem', marginTop: '1.5rem' }}
              >
                {t('no_tags_available')}
              </Typography>
            );
          }}
          rowKey={(record: BaseType) => `${record.id}`}
        />
      </StyledTableWrapper>
      <Pagination
        itemsPerPage={ITEMS_PER_PAGE}
        numItems={sortedMasterTagList.length}
        onPageChange={(selected: number) => setPageNumber(selected)}
        currentPage={pageNumber}
      />
    </StyledSelectTagComponent>
  );
};
