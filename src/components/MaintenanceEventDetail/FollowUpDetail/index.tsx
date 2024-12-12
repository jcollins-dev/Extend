// 3rd Party
import React, { ReactElement, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import 'react-day-picker/lib/style.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

// Components
import { BaseSelect, Button, Input, Typography } from 'components';
import { ButtonContainer, Footer, Table } from '..';

// Types
import { ChangeEvent, Machine } from 'types';
import { MaintenanceEvent } from 'types/maintenance';

// Api
import { useCreateMaintenanceEventsMutation } from 'api';

// Helpers
import { toISO8601 } from 'helpers';

interface FollowUpDetailProps {
  maintenanceEvent?: MaintenanceEvent;
  machines?: Machine[];
  machineId?: string;
  onClose: () => void;
  onSubmitClick: () => void;
  newService?: boolean;
}

// Styling
const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  flex: 1;
  position: relative;
`;

const InputGroup = styled.div`
  margin-top: 2rem;
  margin-bottom: 0.75rem;
`;

const Label = styled.label`
  display: block;
  color: #5d6a86;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1rem;
  margin-bottom: 0.25rem;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
  box-shadow: ${({ theme }) => theme.colors.borders.border02.shadow};
  border-radius: 0.375rem;
`;
const FollowUpDetail = ({
  maintenanceEvent,
  onClose,
  onSubmitClick,
  machines,
  machineId,
  newService
}: FollowUpDetailProps): ReactElement => {
  const [pmDetails, setPMDetails] = useState<Partial<MaintenanceEvent>>(
    maintenanceEvent ? maintenanceEvent : {}
  );
  const getMachineById = useCallback(
    (id: string) => {
      const match = machines?.find((machine) => machine.id === id);
      match &&
        setPMDetails((pmDetails) => ({
          ...pmDetails,
          machineId: id,
          machineDescription: match.description
        }));
    },
    [machines]
  );

  useEffect(() => {
    if (machineId || pmDetails.machineId) {
      getMachineById(machineId || (pmDetails?.machineId as string));
    } else {
      setPMDetails((pmDetails) => ({
        ...pmDetails,
        machineId: undefined,
        machineDescription: undefined
      }));
    }
  }, [getMachineById, machineId]);

  const { t } = useTranslation(['fpns', 'common']);
  const isValid = (): boolean => {
    const valid = Boolean(
      pmDetails?.priority &&
        pmDetails?.machineDescription &&
        pmDetails?.subcomponent &&
        pmDetails?.suggestedDue &&
        pmDetails?.machineId &&
        pmDetails?.description
    );
    return valid;
  };
  type propNames =
    | 'priority'
    | 'machineDescription'
    | 'subcomponent'
    | 'description'
    | 'suggestedDue'
    | 'machineId';
  const priorityOptions = ['1', '2', '3'];

  const handlePMDetailsUpdate = (pm: MaintenanceEvent) => {
    setPMDetails(pm);
  };

  const getMachineId = (id: string) => {
    machines?.find((machine) => {
      if (machine.description === id) {
        setPMDetails({ ...pmDetails, machineId: machine.id, machineDescription: id });
      }
    });
  };

  // Needed to manipulate Date into type String
  const copyPMInfo = (
    pm: Partial<MaintenanceEvent> | undefined,
    propName: propNames,
    value: string | number | Date | boolean
  ) => {
    const copyPMDetails = { ...pmDetails, [propName]: value } as MaintenanceEvent;
    handlePMDetailsUpdate(copyPMDetails);
  };

  const handleChange = (value: string | Date | number | boolean, propName: propNames) => {
    setPMDetails({ ...pmDetails, [propName]: value });
  };

  const handleDayChange = (selectedDay: Date) => {
    copyPMInfo(pmDetails, 'suggestedDue', toISO8601(selectedDay));
  };

  const [createEvent] = useCreateMaintenanceEventsMutation();

  return (
    <Container>
      <Table>
        <tbody>
          <tr>
            <td>
              <Typography as="span" size="0.75rem">
                {t('priority_level')}:
              </Typography>
            </td>
            <td>
              <BaseSelect
                variant={'white'}
                value={pmDetails?.priority ? pmDetails.priority?.toString() : '0'}
                handleChange={(event): void => {
                  handleChange(event.target.value, 'priority');
                }}
                options={priorityOptions}
                placeholder={t('select_dot', { ns: 'common' }) as string}
                id="priority"
              />
            </td>
          </tr>
          <tr>
            <td>
              <Typography as="span" size="0.75rem">
                {t('machine')}:
              </Typography>
            </td>
            <td>
              {!newService ? (
                <Input
                  type="string"
                  id="machineDescription"
                  variant="white"
                  value={pmDetails?.machineDescription}
                  onChange={(event: ChangeEvent) => {
                    handleChange(event.target.value, 'machineDescription');
                  }}
                />
              ) : (
                <BaseSelect
                  variant={'white'}
                  value={pmDetails?.machineDescription ? pmDetails.machineDescription : 'Machine'}
                  handleChange={(event) => {
                    getMachineId(event.target.value);
                  }}
                  options={machines ? machines.map((m) => m.description) : []}
                  placeholder={t('select_dot', { ns: 'common' }) as string}
                  id="machine"
                />
              )}
            </td>
          </tr>
          <tr>
            <td>
              <Typography as="span" size="0.75rem">
                {t('subcomponent')}:
              </Typography>
            </td>
            <td>
              <Input
                type="string"
                id="subcomponent"
                variant="white"
                value={pmDetails?.subcomponent}
                onChange={(event: ChangeEvent) => {
                  if (event.target.value[0] !== ' ')
                    handleChange(event.target.value, 'subcomponent');
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <Typography as="span" size="0.75rem">
                {t('suggested_date')}:
              </Typography>
            </td>
            <td>
              <Input
                type="date"
                max="9999-12-31"
                onChange={(e: ChangeEvent) => {
                  handleDayChange(e.target.value as unknown as Date);
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: '0 0 6rem' }}>
              <InputGroup>
                <Label>{t('description', { ns: 'common' })}</Label>
                <StyledTextarea
                  rows={8}
                  value={pmDetails?.description}
                  onChange={(event) => {
                    if (event.target.value.length <= 1000)
                      handleChange(event.target.value as string, 'description');
                  }}
                />
              </InputGroup>
            </td>
          </tr>
        </tbody>
      </Table>
      <Footer flexDirection={'row'}>
        <ButtonContainer>
          <Button variant="link" onClick={onClose}>
            {t('dismiss', { ns: 'common' })}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              createEvent([
                {
                  description: pmDetails?.description,
                  machineID: pmDetails?.machineId,
                  subcomponent: pmDetails?.subcomponent,
                  suggestedDue: pmDetails?.suggestedDue
                }
              ]).then(() => {
                toast.success(t('maintenance_event_created'), {
                  toastId: 'event-created'
                });
                onSubmitClick();
                onClose();
              });
            }}
            disabled={!isValid()}
          >
            {t('confirm', { ns: 'common' })}
          </Button>
        </ButtonContainer>
      </Footer>
    </Container>
  );
};

export default FollowUpDetail;
