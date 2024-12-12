// 3rd party libraries
import React, { ReactElement } from 'react';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from 'rc-table';
import { ExpandableConfig, GetComponentProps } from 'rc-table/lib/interface';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { Loader, Typography } from 'components';

import breakpoint from 'constants/breakpoints';
import theme from 'themes';

// Types
import {
  BaseTableProps,
  BaseType,
  ColumnConfig,
  HeaderProps,
  SortClickHandler,
  SortState,
  SortableHeaderProps,
  TableProps
} from 'types';

/* Styled components */

// Style the base rc-table component (which is a actually a div)
const StyledTableComponent = styled(Table)<{
  alternatingRowColoring?: boolean;
  borderBottomRow?: boolean;
  hideScroll?: boolean;
  outerBorderColor?: string;
  borderRadius?: string;
  cellPadding?: string;
  id?: string;
  gridArea?: string;
  headerSticky?: boolean;
  verticalAlign?: 'baseline' | 'bottom' | 'middle';
}>`
  border-radius: ${({ borderRadius }) => borderRadius ?? '0.5rem'};
  border: ${({ theme }) => theme.colors.borders.border02.border};
  ${({ outerBorderColor }) => outerBorderColor && `border-color: ${outerBorderColor}`};
  grid-area: ${({ gridArea }) => gridArea};
  &.hasSubheaders {
    thead {
      tr {
        th {
          border-right: ${({ theme }) => theme.colors.borders.border02.border};
        }
        th:last-child {
          border-right: 0;
        }
      }
    }
  }

  /* Hide edge overlap caused by items without border-radii */
  overflow: hidden;

  table {
    border-spacing: 0;

    .groupHeader {
      font-size: ${({ theme }) => theme.typography.components.catalogCardHeader.size};
      text-align: center;
    }
  }

  /* Apply alternate row coloring + optional borders */
  tbody {
    tr {
      border-bottom: ${({ theme }) => theme.colors.borders.border02.border};
      vertical-align: ${({ verticalAlign }) => verticalAlign || 'inherit'};

      & th {
        ${({ borderBottomRow, theme }) =>
          borderBottomRow
            ? `border-bottom: ${theme.colors.borders.border02.border};`
            : `border-bottom: none;`}
      }
    }
    tr:nth-child(2n) {
      ${({ alternatingRowColoring, theme }) =>
        alternatingRowColoring !== false
          ? `background-color: ${theme.colors.background.background2};`
          : `background-color: transparent;`}
    }

    tr:last-child {
      border-bottom: none;
      background-color: transparent;
      & th {
        border-bottom: none;
      }
    }
  }

  /* Override default padding on cell */
  .rc-table-cell {
    padding: ${({ cellPadding }) => cellPadding ?? ''};
  }

  /* Hide scrollbar */
  .rc-table-body {
    ${({ hideScroll }) =>
      hideScroll
        ? `scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
        -ms-overflow-style: none;
        `
        : ``}
  }

  /* Reduce scrollbar header padding*/
  .rc-table-cell-scrollbar {
    // Leave for debugging purposes
    // any padding is causing the columns to be misaligned
    //${({ hideScroll }) => (hideScroll ? `padding: 0;` : ``)}
    padding: 0;
  }

  /* Footer */
  .rc-table-footer {
    border-width: 0.15rem 0 0 0;
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.lightGrey2};
  }
  .rc-table-content {
    max-height: ${({ headerSticky }) => (headerSticky ? 'calc(100vh - 16.8rem)' : 'auto')};
    overflow: scroll !important;
  }
`;

const StyledTableNoTitle = styled.table`
  min-width: 100%;
  border-collapse: separate;

  .rc-table-expand-icon-col {
    width: 1rem;
  }
`;

const StyledTableWithTitle = styled.table`
  min-width: 100%;
  border-collapse: separate;
  border-top: none; /* get rid of top border */
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;

  .rc-table-expand-icon-col {
    width: 1rem;
  }
`;

const HeaderNoTitle = styled.thead`
  position: sticky;
  top: 0px;
  z-index: 10;
  tr {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;

    th {
      font-size: ${(props) => props.theme.typography.components.tableHeader.size};
      font-weight: ${(props) => props.theme.typography.components.tableHeader.weight};
      line-height: ${(props) => props.theme.typography.components.tableHeader.lineHeight};
      border-bottom: ${(props) => props.theme.colors.borders.border02.border};
    }

    th:first-child {
      border-top-left-radius: 0.5rem;
    }
    th:last-child {
      border-top-right-radius: 0.5rem;
    }
  }
`;

const HeaderWithTitle = styled.thead`
  tr {
    th {
      font-size: ${(props) => props.theme.typography.components.tableHeader.size};
      font-weight: ${(props) => props.theme.typography.components.tableHeader.weight};
      line-height: ${(props) => props.theme.typography.components.tableHeader.lineHeight};
      border-bottom: ${(props) => props.theme.colors.borders.border02.border};
      border-top: none;
    }
  }
`;

const HeaderRow = styled.tr<{ bg?: string }>`
  background-color: ${(props) => (props.bg ? props.bg : props.theme.colors.background.background7)};
`;

const TableTitleRow = styled.div`
  background-color: ${(props) => props.theme.colors.background.background2};
  height: 3rem;
  display: flex;
  align-items: center;
  border-bottom: ${(props) => props.theme.colors.borders.border02.border};
  padding-left: 1rem;
  font-weight: bold;
`;

const TableTitle = styled.div`
  padding-left: 10px;
  max-width: 25%;
`;

const BaseCell = styled.th`
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  text-align: left;
  word-wrap: break-word;
  color: ${(props) => props.theme.colors.table.primary};

  @media ${breakpoint.device.xxl} {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media ${breakpoint.device.xxxl} {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }

  @media ${breakpoint.device.xxxxl} {
    padding-left: 0.5rem;
    padding-right: 1.5rem;
  }
`;

const HeaderCell = styled(BaseCell)`
  padding-left: 0.625rem;
  padding-right: 0.625rem;

  @media ${breakpoint.device.xxl} {
    padding-left: 0.375rem;
    padding-right: 0.375rem;
  }
`;

const Cell = styled(BaseCell)`
  font-size: ${(props) => props.theme.typography.components.tableRow2.size};
  font-weight: ${(props) => props.theme.typography.components.tableRow2.weight};
  line-height: ${(props) => props.theme.typography.components.tableRow2.lineHeight};
  background-color: transparent;
`;

const BodyRow = styled.tr<{ bg?: string }>`
  background-color: ${(props) => (props.bg ? props.bg : 'inherit')};
  & td {
    transition: all 0.3s;
  }

  &:hover td {
    background: palevioletred;
    transform: scale(1.01);
  }
`;

const StyledSortableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubTitleContainer = styled.div`
  color: ${(props) => props.theme.colors.mediumGrey2};
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  letter-spacing: 0em;
  text-align: left;
`;

/* End of styled components */

const Header = ({ title, subtitle }: HeaderProps): JSX.Element => {
  return (
    <StyledSortableHeader>
      <TitleContainer>
        {title}
        {subtitle && <SubTitleContainer>{subtitle}</SubTitleContainer>}
      </TitleContainer>
    </StyledSortableHeader>
  );
};

export const SortableHeader = ({
  key,
  title,
  subtitle,
  sortState,
  clickHandler
}: SortableHeaderProps): JSX.Element => {
  const sortIcon =
    sortState === SortState.descending
      ? faSortDown
      : sortState === SortState.ascending
      ? faSortUp
      : faSort;

  const columnTitle = (title: string | JSX.Element) => {
    if (typeof title === 'string') {
      return title;
    }

    if (typeof title.props.children === 'object') {
      const colTitle = (
        <>
          {title.props.children[0]}
          <Typography size="0.8125rem" color={theme.colors.mediumGrey2} mb={0}>
            {title.props.children[1].props.children}
          </Typography>
        </>
      );
      return colTitle;
    } else {
      return title.props.children;
    }
  };

  return (
    <StyledSortableHeader
      onClick={() => {
        if (!clickHandler) return;
        if (!sortState) return;
        clickHandler(key, sortState);
      }}
    >
      <TitleContainer>
        {columnTitle(title)}
        {subtitle && <SubTitleContainer>{subtitle}</SubTitleContainer>}
      </TitleContainer>
      <FontAwesomeIcon icon={sortIcon} />
    </StyledSortableHeader>
  );
};

// Insert data and elements into provided column configurations
const transformColumnConfigs = (columnConfigs: ColumnConfig[], clickHandler?: SortClickHandler) => {
  return columnConfigs.map((colCfg) => {
    // This supports table with subheaders
    if (colCfg.children) {
      const updatedChildConfig = colCfg.children.map((item) => {
        return {
          ...item,
          title: item.customHeader
            ? item.customHeader
            : item.sortState
            ? SortableHeader({
                key: item.key,
                title: item.title as string,
                subtitle: item.subtitle as string,
                sortState: item.sortState,
                clickHandler: clickHandler
              })
            : Header({
                title: item.title as string,
                subtitle: item.subtitle as string
              })
        };
      });
      colCfg.children = updatedChildConfig;
      return colCfg;
    } else {
      return {
        ...colCfg,
        title: colCfg.customHeader
          ? colCfg.customHeader
          : colCfg.sortState
          ? SortableHeader({
              key: colCfg.key || '',
              title: colCfg.title as string,
              subtitle: colCfg.subtitle as string,
              sortState: colCfg.sortState,
              clickHandler: clickHandler
            })
          : Header({
              title: colCfg.title as string,
              subtitle: colCfg.subtitle as string
            })
      };
    }
  });
};

const BaseTable = <T extends BaseType>({
  columnConfigs,
  gridArea,
  data,
  sortHandler,
  expandable,
  title,
  titleIcon,
  alternatingRowColoring,
  bodyRowComponent,
  onRow,
  rowKey,
  customHeader,
  isDataLoading,
  borderBottomRow,
  headerBgColor,
  scroll,
  hideScroll,
  outerBorderColor,
  borderRadius,
  showHeader,
  cellPadding,
  renderCustomEmptyText,
  renderCustomFooter,
  className,
  id,
  headerSticky,
  verticalAlign
}: BaseTableProps<T>): ReactElement => {
  const transformedColumns = transformColumnConfigs(columnConfigs, sortHandler);
  const { t } = useTranslation(['common']);
  // Defining the components to override the defaults of rc-table
  const components = {
    table: title ? StyledTableWithTitle : StyledTableNoTitle,
    header: {
      wrapper: customHeader ? customHeader : title ? HeaderWithTitle : HeaderNoTitle,
      row: HeaderRow,
      cell: HeaderCell
    },
    body: {
      row: bodyRowComponent || BodyRow,
      cell: Cell
    }
  };

  return (
    <StyledTableComponent
      gridArea={gridArea}
      cellPadding={cellPadding}
      alternatingRowColoring={alternatingRowColoring}
      borderBottomRow={borderBottomRow}
      hideScroll={hideScroll}
      outerBorderColor={outerBorderColor}
      borderRadius={borderRadius}
      expandable={expandable as ExpandableConfig<BaseType>}
      title={() => {
        if (title) {
          return (
            <TableTitleRow>
              {titleIcon && <FontAwesomeIcon icon={titleIcon} />}
              <TableTitle>{title}</TableTitle>
            </TableTitleRow>
          );
        }
        return null;
      }}
      columns={transformedColumns}
      data={data}
      components={components}
      scroll={scroll}
      onRow={onRow as GetComponentProps<BaseType>}
      onHeaderRow={() => {
        // Pass through the background color to the HeaderRow component
        return {
          bg: headerBgColor
        } as React.HTMLAttributes<TableProps>;
      }}
      rowKey={rowKey}
      emptyText={isDataLoading ? <Loader size={40} /> : renderCustomEmptyText ?? t('no_data')}
      footer={renderCustomFooter}
      showHeader={showHeader}
      className={className}
      id={id}
      headerSticky={headerSticky}
      verticalAlign={verticalAlign}
    />
  );
};

export default BaseTable;
