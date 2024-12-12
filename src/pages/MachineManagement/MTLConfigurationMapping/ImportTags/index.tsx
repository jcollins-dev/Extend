// 3rd party libs
import React, { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useWizard } from 'react-use-wizard';

// API
import {
  useGetImportedMachineTagListQuery,
  useGetOnboardingMachineByIdQuery,
  useUpdateMachineToMasterMappingMutation,
  useMapMasterMatchingTagsMutation
} from 'api';

// Routing
import { JBTRoutes } from 'constants/routes';
import { useParams } from 'react-router';

// Components
import { Button, Loader, Typography } from 'components';
import DeviceAccordion from '../DeviceAccordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleCheck,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

//styling
const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  overflow-y: scroll;
  padding-top: 1rem;
  padding-left: 2.375rem;
  padding-right: 1.625rem;
`;

const FooterButtonsContainer = styled.div`
  width: 100%;
  padding-right: 0.75rem;
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: white;
  border-top: 0.0625rem solid ${(props) => props.theme.colors.lightMediumGrey};

  button {
    margin: 1rem;
    width: auto;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  flex: none;
  order: 3;
  align-self: stretch;
  flex-grow: 0;
`;
const ComparisonMethodContainer = styled.div`
  width: 100%;
  max-height: 10rem;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  padding-top: 1rem;
  padding-left: 2.375rem;
  padding-right: 1.625rem;
`;

const IconContainer = styled.div`
  margin-right: 0.1rem;
`;

const TitleContainer = styled.div<{ padding?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 0.2rem;
  ${({ padding }) => (padding ? 'padding-top: 2rem' : '')}
`;

const Checkbox = styled.div<{ selected: boolean }>`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.8rem;
  border-radius: 1rem;
  border: 0.0125rem solid
    ${({ selected, theme }) =>
      selected ? theme.colors.primaryBlue3 : theme.colors.lightMediumGrey};
  ${({ selected, theme }) => (selected ? `background: ${theme.colors.lightBlue};` : '')}
  position: relative;

  & > * {
    flex: none;
    order: 0;
    flex-grow: 1;
  }
`;

const CheckboxTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  margin: 0;
  gap: 0;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.5rem;
`;

const CheckedIcon = styled.div`
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: bold;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
`;

const TypographyContainer = styled.div`
  padding-top: 1rem;
`;

const ImportTags = (): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  const {
    data: importedMachineTagList,
    isLoading: isImportedMachineTagListLoading,
    isFetching: isImportedMachineTagListFetching,
    refetch: refetchImportedMachineTagList
  } = useGetImportedMachineTagListQuery({ machineId: machineId });
  const {
    data: onboardingMachine,
    isLoading: isOnboardingMachineLoading,
    isFetching: isOnboardingMachineFetching,
    refetch: refetchOnboardingMachine
  } = useGetOnboardingMachineByIdQuery({ machineId: machineId });
  const [updateMachineToMasterMapping] = useUpdateMachineToMasterMappingMutation();
  const [mapMasterMatchingTags] = useMapMasterMatchingTagsMutation();

  const theme = useTheme();
  const { goToStep } = useWizard();
  const [devices, setDevices] = useState<string[]>([]);
  const [machineToMasterMapping, setMachineToMasterMapping] = useState<boolean>(false);
  const toastId = useRef<React.ReactText>('');

  // At least one import has to be successful to be able to continue
  const [importedAtLeastOne, setImportedAtLeastOne] = useState<boolean>(false);

  useEffect(() => {
    if (importedMachineTagList?.data) {
      setDevices(importedMachineTagList.data.map((_, idx) => 'Device ' + ++idx));
    }
  }, [importedMachineTagList]);

  useEffect(() => {
    setMachineToMasterMapping(onboardingMachine?.machineToMasterMapping || false);
  }, [onboardingMachine]);

  const handleContinue = () => {
    toastId.current = toast.loading(`Machine to Master mapping is in progress...`);

    updateMachineToMasterMapping({
      machineId,
      machineToMasterMapping
    })
      .unwrap()
      .then(() => {
        toast.update(toastId.current, {
          render: `Machine to Master mapping is updated successfully.`,
          type: 'success',
          isLoading: false,
          closeButton: true,
          autoClose: 5000
        });
        refetchOnboardingMachine();
        goToStep(2);
      })
      .catch((error) => {
        console.warn('Machine to Master mapping error: ', error);
        toast.update(toastId.current, {
          render: `Failed to update Machine to Master mapping${
            error?.data?.detail ? `: ${error.data.detail}` : ''
          }`,
          type: 'error',
          isLoading: false,
          closeButton: true,
          autoClose: 5000
        });
      });

    if (importedMachineTagList) {
      const machineTagListIds = importedMachineTagList.data?.map((tag) => tag.id) as string[];
      mapMasterMatchingTags({ machineId, machineTagListIds })
        .unwrap()
        .then(() => {
          console.log('Machine taglist export successful');
        })
        .catch((error) => {
          console.warn('Machine to Master taglist update error: ', error);
          toast.update(toastId.current, {
            render: `Failed to update Machine taglist${
              error?.data?.detail ? `: ${error.data.detail}` : ''
            }`,
            type: 'error',
            isLoading: false,
            closeButton: true,
            autoClose: 5000
          });
        });
    }
  };

  const addDevice = () => {
    setDevices([...devices, 'Device ' + (devices.length + 1)]);
  };

  const handleSuccessfulImport = () => {
    setImportedAtLeastOne(true);
    refetchImportedMachineTagList();
  };

  const handleSuccessfulDelete = (deviceName: string, isDraft: boolean) => {
    setDevices(
      devices.filter((device) => {
        return device !== deviceName;
      })
    );
    if (!isDraft) refetchImportedMachineTagList();
  };

  return (
    <>
      <ComparisonMethodContainer>
        <TitleContainer>
          <IconContainer>
            <FontAwesomeIcon icon={faInfoCircle} />
          </IconContainer>
          <Typography weight="bold">Select Comparison Method</Typography>
        </TitleContainer>
        <Typography>
          {' '}
          Choose the way you would like to compare and map the uploaded tags.{' '}
        </Typography>
        {isOnboardingMachineLoading || isOnboardingMachineFetching ? (
          <Loader />
        ) : (
          <CheckboxContainer>
            <Checkbox
              selected={!machineToMasterMapping}
              onClick={() => setMachineToMasterMapping(!machineToMasterMapping)}
            >
              <CheckedIcon hidden={machineToMasterMapping}>
                <FontAwesomeIcon size="xs" icon={faCircleCheck} color={theme.colors.mediumBlue} />
              </CheckedIcon>
              <IconContainer>
                <FontAwesomeIcon icon={faCircleArrowRight} />
              </IconContainer>
              <CheckboxTextWrapper>
                <Typography weight="bold">Template to Machine</Typography>
                <Typography> Identify the master tags in imported machine tags </Typography>
              </CheckboxTextWrapper>
            </Checkbox>
            <Checkbox
              selected={machineToMasterMapping}
              onClick={() => setMachineToMasterMapping(!machineToMasterMapping)}
            >
              <CheckedIcon hidden={!machineToMasterMapping}>
                <FontAwesomeIcon size="xs" icon={faCircleCheck} color={theme.colors.mediumBlue} />
              </CheckedIcon>
              <IconContainer>
                <FontAwesomeIcon icon={faCircleArrowLeft} />
              </IconContainer>
              <CheckboxTextWrapper>
                <Typography weight="bold">Machine to Template</Typography>
                <Typography> Identify the imported machine tags in master tags </Typography>
              </CheckboxTextWrapper>
            </Checkbox>
          </CheckboxContainer>
        )}
        <TypographyContainer>
          <Typography>
            Click <span style={{ fontWeight: 'bold' }}>&apos;Continue&apos;</span> if you change the
            comparison method.
          </Typography>
        </TypographyContainer>
      </ComparisonMethodContainer>
      <ContentContainer>
        <TitleContainer padding={true}>
          <IconContainer>
            <FontAwesomeIcon icon={faInfoCircle} />
          </IconContainer>
          <Typography weight="bold">Upload Machine Tags</Typography>
        </TitleContainer>
        {isImportedMachineTagListLoading || isImportedMachineTagListFetching ? (
          <Loader />
        ) : (
          <>
            {devices.map(
              (e, idx) =>
                importedMachineTagList && (
                  <DeviceAccordion
                    key={idx}
                    machineTagListId={importedMachineTagList?.data?.at(idx)?.id}
                    name={e}
                    digitalEdgeType={importedMachineTagList.digitalEdgeType}
                    machineId={machineId}
                    isReview={false}
                    isDraft={importedMachineTagList?.data?.at(idx) ? false : true}
                    data={importedMachineTagList?.data?.at(idx) || undefined}
                    handleSuccessfulImport={handleSuccessfulImport}
                    handleSuccessfulDelete={handleSuccessfulDelete}
                  />
                )
            )}
            <ButtonContainer>
              <Button onClick={addDevice}>Add another device +</Button>
            </ButtonContainer>
          </>
        )}
      </ContentContainer>
      <FooterButtonsContainer>
        <Button
          disabled={false}
          variant="thin"
          onClick={() => {
            window.location.assign(JBTRoutes.onboardingPage.replace(':machineId', machineId));
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={
            !importedAtLeastOne &&
            (!Array.isArray(importedMachineTagList?.data) || !importedMachineTagList?.data.length)
          }
          bgColor={theme.colors.mediumBlue}
          variant="primary"
          onClick={() => {
            handleContinue();
          }}
        >
          Continue
        </Button>
      </FooterButtonsContainer>
    </>
  );
};

export default ImportTags;
