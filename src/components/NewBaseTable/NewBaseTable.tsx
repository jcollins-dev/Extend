// 3rd party libs
import React, { useEffect, useMemo, useState, FC } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  Column,
  CellContext,
  ColumnOrderState,
  Header,
  Table,
  getFilteredRowModel
} from '@tanstack/react-table';
import { useDrag, useDrop } from 'react-dnd';
import { default as theme } from 'themes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faList,
  faGripVertical,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import Filter from '../../img/table-filter-icon.svg';
import ClearFilter from '../../img/clear_filter.svg';
import camelCase from 'lodash/camelCase';
import { isEmpty, cloneDeep } from 'lodash';

import { BaseType, ModalSize, TableColumnConfigs } from 'types';
import {
  Typography,
  Modal,
  Checkbox,
  Button,
  StyledTable,
  StyledColumnRefContainer,
  StyledNonDraggableColumnRefContainer,
  StyledDragRefContainer,
  StyledTFoot,
  StyledAscDescContainer,
  OptionWrapper,
  ColumnOption,
  TableFilterOption,
  FilterSelectWrapper,
  ImageOptionWrapper,
  ImageOption,
  OptionsModalContainer,
  SelectionHeader,
  OptionalColumnContainer,
  OptionColumnCheckboxWrapper,
  OptionalColumnName,
  SelectAllOptionalColumn,
  ModalButtonsContainer,
  StyledRootContainer,
  BaseSelect,
  TooltipWrapper,
  DebounceInput,
  Loader
} from 'components';
import { useTanStackFilterOptions } from 'selectors';
//column cofig
import { useTranslation } from 'react-i18next';
import { convertCamelCaseintoTitleCase } from 'helpers';

export interface ColumnConfig extends BaseType {
  id: string;
  header: string;
  isEnableSorting: boolean;
  isSelected: boolean;
  renderer: (cellValue: CellContext<TableColumnConfigs, string>) => JSX.Element | React.ReactNode;
}

interface SortState extends BaseType {
  id: string;
  desc: boolean;
}

interface NewBaseTableProps {
  newTableData: TableColumnConfigs[];
  columnConfigs: ColumnConfig[];
  sortState: SortState;
  enableFilter?: boolean;
  handleFilterRequest?: (val: string) => void;
  isShowColumnOptions?: boolean;
  isShowGlobalSearch?: boolean;
  isDataLoading?: boolean;
}

interface OptionalColumnsState {
  key: string;
  name: string;
  isSelected?: boolean;
}

const keyPrefix = 'health-data';
const columnHelper = createColumnHelper<TableColumnConfigs>();

const addKeysToData = (keyPrefix: string, data: TableColumnConfigs[]) => {
  return data.map((item) => {
    return {
      ...item,
      key: `${keyPrefix}-${item.id}`
    };
  });
};

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  );
  return [...columnOrder];
};

const DraggableColumnHeader: FC<{
  header: Header<TableColumnConfigs, unknown>;
  table: Table<TableColumnConfigs>;
  tableColumns: OptionalColumnsState[];
  handleOptionChange: (name?: string, isSelected?: boolean) => void;
}> = ({ header, table, tableColumns, handleOptionChange }) => {
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const [{ isOver }, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<TableColumnConfigs>) => {
      const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder);
      setColumnOrder(newColumnOrder);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    item: () => column,
    type: 'column'
  });

  return (
    <StyledColumnRefContainer
      ref={dropRef}
      style={{
        opacity: isDragging ? 0 : 1,
        padding: '0.5rem'
      }}
      key={header.id}
    >
      <div ref={previewRef}>
        {header.isPlaceholder ? null : (
          <StyledDragRefContainer ref={dragRef}>
            <OptionColumnCheckboxWrapper
              key={header.column.id}
              style={{
                backgroundColor: isOver ? 'lightgrey' : 'white'
              }}
            >
              <Checkbox
                key={header.column.id}
                id={`${header.column.id}-${header.index}`}
                width={20}
                height={20}
                checked={
                  tableColumns?.find((tableColumn) => tableColumn.key === column.id)?.isSelected
                }
                onChange={() => {
                  const opt = tableColumns?.find((tableColumn) => tableColumn.key === column.id);
                  handleOptionChange(opt?.name, opt?.isSelected);
                }}
              />
              <OptionalColumnName>
                {convertCamelCaseintoTitleCase(header.column.id)}
              </OptionalColumnName>
              <FontAwesomeIcon
                icon={faGripVertical}
                color={theme.colors.darkBlue}
                style={{ marginLeft: 'auto', marginTop: 'auto', marginBottom: 'auto' }}
                size="xs"
              />
            </OptionColumnCheckboxWrapper>
          </StyledDragRefContainer>
        )}
      </div>
    </StyledColumnRefContainer>
  );
};

const NewBaseTable = (props: NewBaseTableProps): JSX.Element => {
  const filterOptions = useTanStackFilterOptions();
  const { t } = useTranslation(['common']);
  const {
    newTableData,
    columnConfigs,
    sortState,
    enableFilter,
    handleFilterRequest,
    isShowColumnOptions,
    isShowGlobalSearch,
    isDataLoading
  } = props;
  const [sorting, setSorting] = useState<SortingState>([sortState]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showColumnOptions, setShowColumnOptions] = useState<boolean>(false);
  const [tableColumns, setTableColumns] = useState<OptionalColumnsState[]>([]);
  const [tempTableColumns, setTempTableColumns] = useState<OptionalColumnsState[]>([]);
  const [EnableOptionSave, setEnableOptionSave] = useState<boolean>(false);
  const [selectAllOptionalColumns, setSelectAllOptionalColumns] = useState<boolean>(false);
  // const [colOptions, setColOptions] = useState<string[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [showFilterSelect, setShowFilterSelect] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<boolean>(enableFilter as boolean);
  const [showClearFilter, setShowClearFilter] = useState<boolean>(false);

  const [globalFilter, setGlobalFilter] = React.useState('');
  let columns = columnConfigs.map((columnConfig) =>
    columnHelper.accessor(columnConfig?.id, {
      id: columnConfig.id,
      header: () => columnConfig.header,
      cell: (info: CellContext<TableColumnConfigs, string>) => (
        <span>{columnConfig.renderer(info)}</span>
      ),
      enableSorting: columnConfig.isEnableSorting
    })
  );
  useEffect(() => {
    columns.forEach((opt) => {
      const targetCol = columnConfigs.find((colConfig) => colConfig.id === opt.id);
      tableColumns.push({
        key: camelCase(opt.id),
        name: opt.id || '',
        isSelected: targetCol?.isSelected
      });
    });
  }, []);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((column) => column.id as string)
  );

  const data = useMemo(() => {
    if (!newTableData?.length) return [];

    return addKeysToData(keyPrefix, newTableData);
  }, [newTableData]);

  const triggerShowColumnOptions = (): void => {
    const newTableColumns = cloneDeep(tableColumns);
    const activeColumns: OptionalColumnsState[] = [];
    newTableColumns.forEach((col) => {
      if (col.key !== 'isDummy') activeColumns.push(col);
    });
    setTempTableColumns(newTableColumns);
    setTableColumns(activeColumns);
    setShowColumnOptions(true);
  };

  const onCloseCommentModal = () => {
    /* eslint-disable  @typescript-eslint/no-non-null-assertion */
    setTableColumns(tempTableColumns);
    setShowColumnOptions!(false);
  };

  const handleEnableSave = () => {
    setEnableOptionSave(true);
  };

  const handleOptionChange = (name?: string, isSelected?: boolean) => {
    tableColumns.forEach((col) => {
      if (col.name === name) {
        col.isSelected = !isSelected;
      }
    });
    setTableColumns([...tableColumns]);
    handleEnableSave();
  };

  const handleSelectAllOptionsChange = () => {
    tableColumns.forEach((col) => {
      col.isSelected = !selectAllOptionalColumns;
    });
    setTableColumns([...tableColumns]);
    setSelectAllOptionalColumns(!selectAllOptionalColumns);
    handleEnableSave();
  };

  const handleOptionSelectionSave = () => {
    // let optionList: OptionalColumnsState[] = [];
    // optionList = tableColumns;
    // optionList.forEach((col) => {
    //   if (col.isSelected) {
    //     if (!colOptions.includes(col.key)) {
    //       colOptions.push(col.key);
    //     }
    //   } else if (colOptions.includes(col.key)) {
    //     colOptions.splice(colOptions.indexOf(col.key), 1);
    //   }
    // });
    // // setColOptions([...colOptions]);
    // alert('saved');
    setTableColumns(tempTableColumns);
    setShowColumnOptions!(false);
  };

  if (!isEmpty(tableColumns)) {
    columns = columns.filter((column) => {
      const compareItem = tableColumns.find(
        (tableColumn) => tableColumn.key === camelCase(column.id)
      );
      return compareItem && compareItem.isSelected;
    });
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnOrder,
      globalFilter
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true
  });
  const handleFilterOptionChange = (val: string): void => {
    /* eslint-disable  @typescript-eslint/no-non-null-assertion */
    handleFilterRequest!(val);
    setSelectedMachine('');
    setShowFilterSelect(false);
    setShowFilter(!showFilter);
    setShowClearFilter(true);
  };
  const handleFilterClick = () => {
    setShowFilterSelect(!showFilterSelect);
  };
  const handleClearFilterClick = () => {
    setShowFilter(!showFilter);
    setShowClearFilter(false);
    /* eslint-disable  @typescript-eslint/no-non-null-assertion */
    handleFilterRequest!('All');
  };
  const handleSearchValueChange = (value: string[]): void => {
    // should be removed when method is implemented
    console.log('Not yet implemented:...', value);
  };
  return (
    <StyledRootContainer>
      <ColumnOption>
        <OptionWrapper>
          <TableFilterOption>
            {showFilter && (
              <ImageOptionWrapper>
                <TooltipWrapper Tooltip="Select Filter">
                  <ImageOption src={Filter} onClick={handleFilterClick} />
                </TooltipWrapper>
              </ImageOptionWrapper>
            )}
            {showClearFilter && (
              <ImageOptionWrapper>
                <TooltipWrapper Tooltip="Clear Filter">
                  <ImageOption
                    src={ClearFilter}
                    onClick={handleClearFilterClick}
                    marginTop="-0.25rem"
                    marginLeft="-0.1rem"
                  />
                </TooltipWrapper>
              </ImageOptionWrapper>
            )}
            {showFilterSelect && (
              <FilterSelectWrapper>
                <BaseSelect
                  variant="white"
                  handleChange={(e) => {
                    handleFilterOptionChange(e.target.value as string);
                  }}
                  handleChangeSearch={(value) => {
                    handleSearchValueChange(value as string[]);
                  }}
                  options={filterOptions as { value: string; label: string }[]}
                  placeholder="Filter Options"
                  value={selectedMachine}
                />
              </FilterSelectWrapper>
            )}
          </TableFilterOption>
        </OptionWrapper>
        {isShowColumnOptions && (
          <OptionWrapper
            onClick={() => {
              /* eslint-disable  @typescript-eslint/no-non-null-assertion */
              triggerShowColumnOptions!();
            }}
          >
            <FontAwesomeIcon
              icon={faList}
              style={{
                marginRight: '.4rem'
              }}
            />{' '}
            Column options (
            {table.getHeaderGroups()[0].headers.filter((head) => head.id !== 'action').length}{' '}
            Columns)
          </OptionWrapper>
        )}

        {isShowGlobalSearch && (
          <OptionWrapper>
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                position: 'absolute'
              }}
            />
            <DebounceInput
              value={globalFilter ?? ''}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder={t('search') as string}
              style={{
                paddingLeft: '1.2rem',
                marginBottom: '-.3rem'
              }}
            />
          </OptionWrapper>
        )}
      </ColumnOption>
      <Modal
        onClose={onCloseCommentModal}
        size={ModalSize.XXSMALL_AUTO_HEIGHT}
        title="Column Options"
        visible={showColumnOptions as boolean}
        widthOverride="25rem"
      >
        <OptionsModalContainer>
          <SelectionHeader>
            <Typography variant="body2" color={theme.colors.darkGrey}>
              Select columns to show
            </Typography>
          </SelectionHeader>

          <OptionalColumnContainer>
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id}>
                {headerGroup.headers.map(
                  (header) =>
                    header.id !== 'action' && (
                      <DraggableColumnHeader
                        key={header.id}
                        header={header}
                        table={table}
                        tableColumns={tableColumns}
                        handleOptionChange={handleOptionChange}
                      />
                    )
                )}
              </div>
            ))}

            {tableColumns.map((opt, index) => {
              const headerGroup = table.getHeaderGroups()[0];
              const headers = headerGroup?.headers;
              const header = headers?.find((header) => header.id === opt.name);

              return header ? (
                ''
              ) : (
                <StyledNonDraggableColumnRefContainer key={index}>
                  <OptionColumnCheckboxWrapper>
                    <Checkbox
                      key={index}
                      id={`${opt.name}-${index}`}
                      width={20}
                      height={20}
                      checked={opt.isSelected}
                      onChange={() => {
                        handleOptionChange(opt.name, opt.isSelected);
                      }}
                    />
                    <OptionalColumnName>{opt.name}</OptionalColumnName>
                  </OptionColumnCheckboxWrapper>
                </StyledNonDraggableColumnRefContainer>
              );
            })}
          </OptionalColumnContainer>
          <SelectAllOptionalColumn>
            <Checkbox
              id={`opt-all`}
              width={15}
              height={15}
              checked={selectAllOptionalColumns}
              onChange={() => {
                handleSelectAllOptionsChange();
              }}
            />
            <OptionalColumnName>Select All</OptionalColumnName>
          </SelectAllOptionalColumn>
        </OptionsModalContainer>
        <ModalButtonsContainer>
          <Button onClick={onCloseCommentModal} bgColor={theme.colors.primaryBlue4}>
            Cancel
          </Button>
          <Button
            disabled={!EnableOptionSave}
            onClick={() => {
              handleOptionSelectionSave();
            }}
            bgColor={theme.colors.mediumBlue}
            variant="primary"
          >
            Save
          </Button>
        </ModalButtonsContainer>
      </Modal>

      <StyledTable>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : 'disabled-sort',
                          onClick: header.column.getToggleSortingHandler()
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: (
                            <StyledAscDescContainer>
                              <div>
                                <FontAwesomeIcon icon={faChevronUp} size="xs" />
                              </div>
                              <div>
                                <FontAwesomeIcon
                                  icon={faChevronDown}
                                  style={{ visibility: 'hidden' }}
                                  size="xs"
                                />
                              </div>
                            </StyledAscDescContainer>
                          ),
                          desc: (
                            <StyledAscDescContainer>
                              <div>
                                <FontAwesomeIcon icon={faChevronDown} size="xs" />
                              </div>
                              <div>
                                <FontAwesomeIcon
                                  icon={faChevronUp}
                                  style={{ visibility: 'hidden' }}
                                  size="xs"
                                />
                              </div>
                            </StyledAscDescContainer>
                          )
                        }[header.column.getIsSorted() as string] ?? (
                          <StyledAscDescContainer>
                            <div>
                              <FontAwesomeIcon icon={faChevronUp} size="xs" />
                            </div>
                            <div>
                              <FontAwesomeIcon icon={faChevronDown} size="xs" />
                            </div>
                          </StyledAscDescContainer>
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {isDataLoading ? (
            <Loader size={40} />
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '2rem'
                }}
              >
                No data
              </td>
            </tr>
          )}
        </tbody>
        <StyledTFoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </StyledTFoot>
      </StyledTable>
    </StyledRootContainer>
  );
};

export default NewBaseTable;
