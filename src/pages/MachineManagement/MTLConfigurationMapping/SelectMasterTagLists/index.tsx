// 3rd party libs
import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';

// API
import { useGetMasterTagListMappingsQuery, useSaveMappingMasterTagListMutation } from 'api';

// Routing
import { JBTRoutes } from 'constants/routes';
import { useParams } from 'react-router';

// Components
import { Button, Loader, SelectedMasterTagListTable, Typography } from 'components';
import { MasterTagListMappingPayload } from 'types/machine-management';
import { useWizard } from 'react-use-wizard';

//styling
const Root = styled.div`
  height: 17rem;
  width: 32rem;
  margin: auto;
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0.125rem solid;
  border-radius: 0.625rem;
  border-color: #e2e2e2;
  h3 {
    padding: 2rem;
  }
`;

const TableContainer = styled.div`
  padding: 2rem 1rem 1rem 2rem;
`;
interface ContentContainerProps {
  pxFromTop?: number;
}
const ContentContainer = styled.div<ContentContainerProps>`
  width: 100%;
  height: 100%;
  display: block;
`;
const ButtonsContainer = styled.div`
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

const SelectMasterTagList = (): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  const theme = useTheme();
  const { goToStep } = useWizard();
  const [selectedMatserTagList, setSelectedMasterList] = useState<string[]>([]);
  const { data: masterTagListMapping, isLoading: masterTagListMappingLoading } =
    useGetMasterTagListMappingsQuery({ machineId }, { refetchOnMountOrArgChange: true });
  const [saveMappingMasterTagList] = useSaveMappingMasterTagListMutation();

  const handleSelectedCheckBoxes = (checked: boolean, id: string) => {
    checked
      ? setSelectedMasterList([id, ...selectedMatserTagList])
      : setSelectedMasterList(selectedMatserTagList.filter((item) => item !== id));
  };
  const handleContinue = () => {
    const payload: MasterTagListMappingPayload = {};
    payload.machineId = machineId;
    payload.masterTagListIds = selectedMatserTagList;

    saveMappingMasterTagList(payload).then(() => {
      goToStep(1);
    });
  };

  useEffect(() => {
    masterTagListMapping?.map((mtl) => {
      if (mtl.selected) {
        setSelectedMasterList([mtl.id, ...selectedMatserTagList]);
      }
    });
  }, [masterTagListMapping]);
  return (
    <>
      {masterTagListMappingLoading && <Loader />}
      {!masterTagListMappingLoading &&
        (!masterTagListMapping || masterTagListMapping?.length === 0) && (
          <Root>
            <Typography color={theme.colors.darkGrey} variant="h3">
              No Tag Template Lists Exist. Please contact the administrator to create a new master
              tag list.
            </Typography>
          </Root>
        )}
      {!masterTagListMappingLoading &&
        masterTagListMapping &&
        masterTagListMapping?.length !== 0 && (
          <ContentContainer>
            <TableContainer>
              <SelectedMasterTagListTable
                data={masterTagListMapping || []}
                isDataLoading={masterTagListMappingLoading}
                headerBgColor={theme.colors.lightGrey1}
                onSelectMasterTagList={handleSelectedCheckBoxes}
                selectedMasterTagList={selectedMatserTagList}
              />
            </TableContainer>
          </ContentContainer>
        )}
      <ButtonsContainer>
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
          bgColor={theme.colors.mediumBlue}
          disabled={selectedMatserTagList.length > 0 ? false : true}
          variant="primary"
          onClick={() => {
            handleContinue();
          }}
        >
          Continue
        </Button>
      </ButtonsContainer>
    </>
  );
};

export default SelectMasterTagList;
