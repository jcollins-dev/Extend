import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

//Components
import { Typography, Reports } from 'components';

// Api
import { useGetAccountInfoQuery } from 'api';

import { MachineAccountInfoQueryParams } from 'types/protein';

// Styling
const Root = styled.article`
  margin: 2rem;
`;

const ReportPage = (): ReactElement => {
  const { machineId } = useParams<MachineAccountInfoQueryParams>();
  const { data: accountData } = useGetAccountInfoQuery({ machineId });
  const { t } = useTranslation(['common']);

  return (
    <>
      <Root>
        <Typography variant="h2">{t('reports')}</Typography>
        <Reports
          // uuIDs={{ reportId: accountData?.reportId, workspaceId: accountData?.workspaceId }}
          powerBiList={accountData?.powerBiList}
        />
      </Root>
    </>
  );
};

export default ReportPage;
