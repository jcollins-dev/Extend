import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { BaseTable } from 'components';
import { ColumnConfig } from 'types';
import { ProsealAdminRecipe } from 'types/proseal';
import NumberPicker from 'components/NumberPicker';

const TableContainer = styled.div`
  table {
    width: 100%;
    table-layout: fixed !important;
  }

  th:nth-child(n + 2) {
    white-space: nowrap;
  }

  thead th {
    font-weight: bold;
  }
`;

const generateColumnConfigs = (
  quantityChange: QuantityChangeProps,
  t: TFunction<'mh'[], undefined>
): ColumnConfig[] => {
  return [
    {
      title: t('recipe_name') as string,
      dataIndex: 'recipeName',
      key: 'recipeName',
      render(value) {
        return <>{value}</>;
      }
    },
    {
      title: t('number_of_impressions') as string,
      dataIndex: 'numberOfImpressions',
      key: 'numberOfImpressions',
      render(value) {
        return <>{value}</>;
      }
    },
    {
      title: t('target_packs_per_minute') as string,
      dataIndex: 'targetPacksPerMinute',
      key: 'targetPacksPerMinute',
      render(value, record) {
        return (
          <>
            <NumberPicker
              value={value as number}
              onChange={(event) => quantityChange(event, record as ProsealAdminRecipe)}
            />
          </>
        );
      }
    }
  ];
};

type QuantityChangeProps = (
  event: React.ChangeEvent<HTMLInputElement>,
  record: ProsealAdminRecipe
) => void;

type AdminRecipeTableProps = {
  data: ProsealAdminRecipe[];
  quantityChange: QuantityChangeProps;
};

const AdminRecipeTable = ({ data, quantityChange }: AdminRecipeTableProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  return (
    <TableContainer>
      <BaseTable
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigs(quantityChange, t)}
        data={data}
        rowKey={(record) => `${record.name}-${record.numberOfImpressions}`}
        borderBottomRow
      />
    </TableContainer>
  );
};

export default AdminRecipeTable;
