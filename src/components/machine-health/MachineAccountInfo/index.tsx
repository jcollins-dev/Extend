// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { Loader, Summary, Typography, FlyoutHeader } from 'components';

// Types
import { AccountInfo, MachineAccountInfoQueryParams } from 'types/protein';

// Api
import { useGetAccountInfoQuery } from 'api';

type Props = {
  close?: () => void;
};

// Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.875rem;
  height: 100%;
  outline: none;
`;

const Body = styled.div`
  padding: 0rem 1rem;
`;

const getTags = (info: AccountInfo) => {
  const tags: Record<string, string> = {};
  for (const tag of info.tags) {
    tags[tag.name || tag.tagId] = tag.value ? `${tag.value} ${tag.unit}` : '--';
  }
  return tags;
};

// TODO [hmachaao]: review values with PO
const toSummaryData = (info?: AccountInfo): { [key in string]: string | string[] } => {
  if (!info) return {};
  return {
    'Customer Name': info['companyName'],
    'PRoCARE Status': info['procare'] ? 'Active' : '--',
    'Warranty Status': info['warrantyExpired'] ? 'Expired' : '--',
    'Serial Number': info['serialNumber'],
    ...getTags(info)
  };
};

const MachineAccountInfo = ({ close }: Props): JSX.Element => {
  const { machineId } = useParams<MachineAccountInfoQueryParams>();
  const { data, isLoading, error } = useGetAccountInfoQuery({ machineId });
  const { t } = useTranslation(['mh']);

  return (
    <Container tabIndex={0}>
      <FlyoutHeader heading={t('account_detail') as string} onClose={close} />
      <Body>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Typography color="negativeRed">{t('failed_to_load_account_info')}</Typography>
        ) : (
          <Summary title={t('account_information')} data={toSummaryData(data)} />
        )}
      </Body>
    </Container>
  );
};

export default MachineAccountInfo;
