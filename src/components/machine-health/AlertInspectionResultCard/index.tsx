// Third Party
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { BaseSelect, Button, Typography, Card } from 'components';

// Types
import { AlertDataScienceIssueType } from 'types/machine-health/alerts';

interface AlertInspectionResultCard {
  confirmable: boolean;
  selectedIssue?: AlertDataScienceIssueType;
  selectedDetails?: string;

  onIssueSelect: (type: AlertDataScienceIssueType) => void;
  onIssueSelectConfirm: () => void;
  onNoIssueSelectConfirm: () => void;
  onDetailsChange: (details: string) => void;
}

export const IconContainer = styled.div`
  margin-right: 1rem;
`;

export const Table = styled.table<{ mb?: string }>`
  width: 100%;
  margin-bottom: ${({ mb }) => mb || '0'};

  td {
    padding: 0.5rem 0;

    &:first-child {
      width: 33%;
    }
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;

  padding: 1rem 0 1rem 0;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
  box-shadow: ${({ theme }) => theme.colors.borders.border02.shadow};
  border-radius: 0.375rem;
`;

const getIssueOptions = (
  t: TFunction<'mh'[], undefined>
): { label: string; value: AlertDataScienceIssueType }[] => {
  return [
    {
      label: t('sensor_issue'),
      value: AlertDataScienceIssueType.SensorIssue
    },
    {
      label: t('mechanical_issue'),
      value: AlertDataScienceIssueType.MechanicalIssue
    },
    {
      label: t('other', { ns: 'common' }),
      value: AlertDataScienceIssueType.Other
    }
  ];
};

const AlertInspectionResultCard = ({
  onIssueSelect,
  onIssueSelectConfirm,
  onNoIssueSelectConfirm,
  selectedIssue,
  confirmable,
  selectedDetails,
  onDetailsChange
}: AlertInspectionResultCard): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['mh', 'common']);

  return (
    <Card>
      <Card.Header bgColor={theme.colors.negativeRed4}>
        <IconContainer>
          <FontAwesomeIcon icon={faWrench} />
        </IconContainer>
        <Typography as="h3" mb={0} size="0.9rem">
          {t('inspection_result')}
        </Typography>
      </Card.Header>
      <Card.Body pt={0} pb={0}>
        <Table>
          <tbody>
            <tr>
              <td>
                <Typography as="span" size="0.75rem">
                  {t('issue_found')}:
                </Typography>
              </td>
              <td>
                <BaseSelect
                  value={selectedIssue as string}
                  variant="white"
                  placeholder={t('choose_issue_type') as string}
                  handleChange={(event) =>
                    onIssueSelect(event.target.value as AlertDataScienceIssueType)
                  }
                  options={getIssueOptions(t)}
                />
              </td>
            </tr>
          </tbody>
        </Table>
        <StyledTextarea
          rows={8}
          value={selectedDetails}
          placeholder={t('please_provide_details', { ns: 'common' }) as string}
          onChange={(event) => onDetailsChange(event.target.value as string)}
        />
        <ActionContainer>
          <Button
            size={'small'}
            bgColor={theme.colors.mediumBlue4}
            borderColor={theme.colors.mediumBlue4}
            onClick={onNoIssueSelectConfirm}
          >
            {t('no_issue')}
          </Button>
          <Button
            size={'small'}
            disabled={!confirmable}
            variant={'primary'}
            onClick={onIssueSelectConfirm}
          >
            {t('confirm_issue')}
          </Button>
        </ActionContainer>
      </Card.Body>
    </Card>
  );
};

export default AlertInspectionResultCard;
