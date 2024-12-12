import { BaseTable } from 'components';
import React from 'react';
import { ColumnConfig } from 'types';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import styled from 'styled-components';
import { ProsealRecipeStats } from 'types/proseal';
import { GET_PACKS_PER_MINUTE_COLOR } from './helpers';
import theme from 'themes';

const TableContainer = styled.div`
  table {
    width: 100%;
    table-layout: fixed !important;
  }

  th:nth-child(1) {
    width: 20rem;
  }

  th:nth-child(n + 2) {
    white-space: nowrap;
  }
`;

const generateColumnConfigs = (t: TFunction<'mh'[], undefined>): ColumnConfig[] => {
  return [
    {
      title: t('recipe') as string,
      dataIndex: 'name',
      key: 'name',
      render(_, record) {
        const rec = record as ProsealRecipeStats;
        return `${rec.name} (${rec.numberOfImpressions} imp)`;
      }
    },
    {
      title: t('avg_packs_per_min_vs_target') as string,
      dataIndex: 'avgPacksPerMin',
      key: 'avgPacksPerMin',
      render(value, _record) {
        const record = _record as ProsealRecipeStats;

        return {
          props: {
            style: {
              ...GET_PACKS_PER_MINUTE_COLOR(record.avgPacksPerMin, record.targetPacksPerMin),
              borderLeft: `0.0625rem solid ${theme.colors.lightGrey6}`
            }
          },
          children: (
            <>
              <div>{value}</div>
              <div>Actual</div>
            </>
          )
        };
      }
    },
    {
      title: '',
      dataIndex: 'targetPacksPerMinute',
      key: 'targetPacksPerMinute',
      render(value) {
        return (
          <>
            <div>{value}</div>
            <div>{t('target')}</div>
          </>
        );
      }
    },
    {
      title: t('avg_feed_factor_vs_target') as string,
      dataIndex: 'avgFeedFactor',
      key: 'avgFeedFactor',
      render() {
        return {
          props: {
            style: {
              //...GET_FEED_FACTOR_COLOR(value as number),
              borderLeft: `0.0625rem solid ${theme.colors.lightGrey6}`
            }
          },
          children: (
            <>
              <div>{t('not_enabled')}</div>
              <div></div>
            </>
          )
        };
      }
    },
    {
      title: '',
      dataIndex: 'targetFeedFactor',
      key: 'targetFeedFactor',
      render(value) {
        return (
          <>
            <div>{value}</div>
            <div>{t('target')}</div>
          </>
        );
      }
    },
    {
      title: t('avg_oee_in_percent') as string,
      dataIndex: 'avgOee',
      key: 'avgOee',
      render(value) {
        return {
          props: {
            style: {
              borderLeft: `0.0625rem solid ${theme.colors.lightGrey6}`
            }
          },
          children: <>{Math.round((value as number) * 100)}%</>
        };
      }
    }
  ];
};

type RecipeTableProps = {
  data: ProsealRecipeStats[];
};

const RecipeTable = (props: RecipeTableProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  return (
    <TableContainer>
      <BaseTable
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigs(t)}
        data={props.data}
        rowKey={(record) => `${record.name}`}
        borderBottomRow
      />
    </TableContainer>
  );
};

export default RecipeTable;
