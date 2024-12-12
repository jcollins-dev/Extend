import React from 'react';
import { TableWrapper } from './index.elements';
import { useTranslation } from 'react-i18next';
import { CellContext } from '@tanstack/react-table';
import { capitalizeFirst } from 'helpers';
import { BaseType } from 'types';
import { NewBaseTable } from 'components';
import { IcoTrash } from 'icons/IcoTrash';
import theme from 'themes';
import { NavLink } from 'react-router-dom';

interface TableColumnConfigs extends BaseType {
  tag_name?: string;
  description?: string;
  expression?: string;
}

const TableData = [
  {
    id: 1,
    name: 'Tag Name 1',
    description: 'Sint sunt ullamco nisi Lorem id ex aute aliquip velit.',
    expression: 'Expression 1'
  },
  {
    id: 2,
    name: 'Tag Name 2',
    description: 'Est magna ut aliqua ipsum sunt nostrud eiusmod.',
    expression: 'Expression 2'
  },
  {
    id: 3,
    name: 'Tag Name 3',
    description:
      'Lorem id ea non ad ullamco sunt est consectetur proident cillum exercitation exercitation.',
    expression: 'Expression 3'
  },
  {
    id: 4,
    name: 'Tag Name 4',
    description: 'Eu culpa sit consectetur consequat sunt anim.',
    expression: 'Expression 4'
  },
  {
    id: 5,
    name: 'Tag Name 5',
    description:
      'Cillum cupidatat non nulla mollit do occaecat ex incididunt quis eiusmod irure cupidatat.',
    expression: 'Expression 5'
  },
  {
    id: 6,
    name: 'Tag Name 6',
    description:
      'Esse magna esse Lorem est elit reprehenderit cillum quis amet laborum cupidatat commodo.',
    expression: 'Expression 6'
  },
  {
    id: 7,
    name: 'Tag Name 7',
    description: 'Consectetur ut nostrud irure sint anim.',
    expression: 'Expression 7'
  },
  {
    id: 8,
    name: 'Tag Name 8',
    description: 'Laborum ea culpa duis Lorem eiusmod culpa.',
    expression: 'Expression 8'
  },
  {
    id: 9,
    name: 'Tag Name 9',
    description: 'Et dolor magna ea enim amet deserunt ipsum.',
    expression: 'Expression 9'
  },
  {
    id: 10,
    name: 'Tag Name 10',
    description: 'Do velit id ex ullamco sunt velit est quis consequat eu mollit nisi in.',
    expression: 'Expression 10'
  },
  {
    id: 11,
    name: 'Tag Name 11',
    description:
      'Laboris occaecat dolor ipsum labore eu nostrud ad irure enim Lorem excepteur et pariatur.',
    expression: 'Expression 11'
  },
  {
    id: 12,
    name: 'Tag Name 12',
    description: 'Eiusmod ea mollit dolore do aliquip qui.',
    expression: 'Expression 12'
  },
  {
    id: 13,
    name: 'Tag Name 13',
    description:
      'Aute pariatur irure deserunt reprehenderit adipisicing reprehenderit labore nisi excepteur non minim anim.',
    expression: 'Expression 13'
  },
  {
    id: 14,
    name: 'Tag Name 14',
    description: 'Ex Lorem laborum eu ut eiusmod deserunt elit in ea ut reprehenderit.',
    expression: 'Expression 14'
  },
  {
    id: 15,
    name: 'Tag Name 15',
    description:
      'Eiusmod tempor magna pariatur quis voluptate voluptate voluptate anim in laboris ut ipsum id eu.',
    expression: 'Expression 15'
  },
  {
    id: 16,
    name: 'Tag Name 16',
    description: 'Do incididunt amet occaecat excepteur fugiat culpa in.',
    expression: 'Expression 16'
  },
  {
    id: 17,
    name: 'Tag Name 17',
    description: 'Et occaecat in cillum ullamco eu et voluptate do.',
    expression: 'Expression 17'
  },
  {
    id: 18,
    name: 'Tag Name 18',
    description: 'Excepteur tempor nisi commodo anim aute magna culpa culpa adipisicing.',
    expression: 'Expression 18'
  },
  {
    id: 19,
    name: 'Tag Name 19',
    description:
      'Reprehenderit qui tempor adipisicing amet tempor consequat magna Lorem mollit ea exercitation.',
    expression: 'Expression 19'
  },
  {
    id: 20,
    name: 'Tag Name 20',
    description: 'Non cillum nostrud enim pariatur aliquip reprehenderit labore.',
    expression: 'Expression 20'
  },
  {
    id: 21,
    name: 'Tag Name 21',
    description:
      'Anim aute sint id voluptate dolor mollit esse nostrud quis exercitation ipsum velit esse excepteur.',
    expression: 'Expression 21'
  },
  {
    id: 22,
    name: 'Tag Name 22',
    description: 'Eiusmod sint in tempor aliqua elit culpa aute.',
    expression: 'Expression 22'
  },
  {
    id: 23,
    name: 'Tag Name 23',
    description:
      'Ullamco occaecat nulla excepteur esse consectetur id dolor voluptate reprehenderit elit sunt aliqua.',
    expression: 'Expression 23'
  },
  {
    id: 24,
    name: 'Tag Name 24',
    description: 'Nulla nulla officia occaecat quis eiusmod minim est.',
    expression: 'Expression 24'
  },
  {
    id: 25,
    name: 'Tag Name 25',
    description: 'Velit quis tempor ea elit consectetur.',
    expression: 'Expression 25'
  },
  {
    id: 26,
    name: 'Tag Name 26',
    description: 'Minim sit cupidatat consequat pariatur anim sint.',
    expression: 'Expression 26'
  },
  {
    id: 27,
    name: 'Tag Name 27',
    description: 'Laborum laborum elit reprehenderit aliqua enim ut enim ut sit quis ullamco.',
    expression: 'Expression 27'
  },
  {
    id: 28,
    name: 'Tag Name 28',
    description:
      'Lorem dolor culpa id quis aliquip eiusmod officia et eu ullamco deserunt do sint.',
    expression: 'Expression 28'
  },
  {
    id: 29,
    name: 'Tag Name 29',
    description: 'Dolore ad ullamco eu irure officia.',
    expression: 'Expression 29'
  },
  {
    id: 30,
    name: 'Tag Name 30',
    description: 'Laborum nulla deserunt dolore id et officia commodo incididunt excepteur.',
    expression: 'Expression 30'
  },
  {
    id: 31,
    name: 'Tag Name 31',
    description: 'Laboris esse commodo id cillum eiusmod aliqua labore.',
    expression: 'Expression 31'
  },
  {
    id: 32,
    name: 'Tag Name 32',
    description:
      'Nostrud ullamco ipsum nostrud pariatur anim velit esse culpa eiusmod enim quis sunt proident.',
    expression: 'Expression 32'
  },
  {
    id: 33,
    name: 'Tag Name 33',
    description:
      'Pariatur exercitation voluptate veniam velit sit cupidatat exercitation proident ut reprehenderit incididunt mollit.',
    expression: 'Expression 33'
  },
  {
    id: 34,
    name: 'Tag Name 34',
    description: 'Eu veniam tempor proident ipsum eu ea.',
    expression: 'Expression 34'
  },
  {
    id: 35,
    name: 'Tag Name 35',
    description: 'Dolore elit in dolor nisi nostrud aliqua enim.',
    expression: 'Expression 35'
  },
  {
    id: 36,
    name: 'Tag Name 36',
    description:
      'Minim sit in enim do fugiat consectetur anim veniam anim occaecat excepteur fugiat ipsum.',
    expression: 'Expression 36'
  }
];

const TagsTable = (): JSX.Element => {
  const { t } = useTranslation(['mh']);

  const columns = [
    {
      id: 'name',
      header: t('calculated_tag_name'),
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        return (
          <NavLink to={`#`} style={{ color: theme.colors.primaryBlue5, textDecoration: 'none' }}>
            {capitalizeFirst(cellValue.getValue().toLocaleLowerCase())}
          </NavLink>
        );
      }
    },
    {
      id: 'description',
      header: t('description'),
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
        capitalizeFirst(cellValue.getValue().toLocaleLowerCase())
    },
    {
      id: 'expression',
      header: t('expression'),
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        return capitalizeFirst(cellValue.getValue().toLocaleLowerCase());
      }
    },
    {
      id: 'action',
      header: '',
      isEnableSorting: false,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => {
        return (
          <div
            onClick={() => {
              alert(JSON.stringify(cellValue.row.original));
            }}
            style={{
              cursor: 'pointer'
            }}
          >
            <IcoTrash width="30" />
          </div>
        );
      }
    }
  ];

  const defaultSortState = {
    id: 'id',
    desc: true
  };

  return (
    <TableWrapper>
      <div>
        <NewBaseTable
          newTableData={TableData}
          columnConfigs={columns}
          sortState={defaultSortState}
          isShowColumnOptions
          isShowGlobalSearch
        />
      </div>
    </TableWrapper>
  );
};
export default TagsTable;
