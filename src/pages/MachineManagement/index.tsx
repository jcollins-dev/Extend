// 3rd party libs
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import theme from 'themes';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { JBTRoutes } from 'constants/routes';
import { useGetOnboardingMachinesQuery } from 'api';

const ITEMS_PER_PAGE = PAGE_LENGTH.SMALL;
import { PAGE_LENGTH } from 'constants/search';
import { ModalSize } from 'types';

import { MachineProgressType, Tabs, MtlOption } from 'types/machine-management';

import { Button, Indicator, Loader, Modal, Pagination, TabNav, Typography } from 'components';
import MachineManagementTable from 'components/MachineManagementTable';
import { HeaderModalUploadCategory, ModalUploadCategory } from './ModalUploadCategory';
import { HeaderModalPhotoUpload, ModalPhotoUpload } from './ModalPhotoUpload';

import MasterTagList from './MasterTagList';
import { useLocation } from 'react-router-dom';
import MachineManagementPopupcard from './MachineManagementPopup/MachineManagementPopupcard';
import { useTranslation } from 'react-i18next';

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
`;

const PurchaseButtons = styled.div`
  display: flex;
  max-width: 21rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  * + * {
    margin-left: 1rem;
  }
`;

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  position: fixed;
  right: 1rem;
  bottom: 3rem;
  z-index: 1;
  > button {
    border-radius: 50rem;
    width: 3rem;
    height: 3rem;
    > svg {
      margin: 0;
    }
  }
`;

const SubMenuButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > button {
    margin-bottom: 1rem;
  }
`;

const StyledIndicator = styled(Indicator)`
  display: inline;
  margin: 0;
`;

const TableContainer = styled.div`
  padding: 2rem 1rem 1rem 2rem;
`;

const Container = styled.div`
  width: 100%;
  padding: 0 1.5rem 0 1.5rem;
`;
/*
function sortBy(sortState: MachineManagementSortState): string | undefined {
  if (sortState.state === SortState.unsorted || sortState.state === SortState.none) {
    return undefined;
  }
  return sortState.column
}

function sortDir(sortState: MachineManagementSortState): 'ASC' | 'DESC' | undefined {
  if (sortState.state === SortState.ascending) {
    return 'ASC';
  } else if (sortState.state === SortState.descending) {
    return 'DESC';
  }
  return undefined;
}
*/
interface ActiveMmRow {
  mtlId: string;
  position: { x: number; y: number };
  mtlOption?: MtlOption;
}

const MachineManagement = (): JSX.Element => {
  const location = useLocation();
  const { t } = useTranslation(['mh']);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setCurrentTab(parseInt(tabParam));
    }
  }, []);
  const [currentTab, setCurrentTab] = useState(Tabs.Machines);
  const [showUploadCategoriesModal, setShowUploadCategoriesModal] = useState<boolean>(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState<boolean>(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [activeMm, setActiveMm] = useState<ActiveMmRow>();
  const [clickPosition, setClickPosition] = useState<number>(0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  const { data: onboardingMachines, isLoading: onboardingMachinesLoading } =
    useGetOnboardingMachinesQuery();

  const rows = useMemo(() => {
    if (onboardingMachines === undefined) {
      return [];
    }
    return onboardingMachines;
  }, [onboardingMachines]);

  const machineInProgress = rows.filter((machine) => {
    if (
      machine.diagrams != MachineProgressType.DONE ||
      machine.maintenanceSchedule != MachineProgressType.DONE ||
      machine.provisionGateway != MachineProgressType.DONE ||
      machine.tagList != MachineProgressType.DONE
    )
      return machine;
  });

  const machineOnboarded = rows.filter((machine) => {
    if (
      machine.diagrams === MachineProgressType.DONE &&
      machine.maintenanceSchedule === MachineProgressType.DONE &&
      machine.provisionGateway === MachineProgressType.DONE &&
      machine.tagList === MachineProgressType.DONE
    )
      return machine;
  });

  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastPost = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - ITEMS_PER_PAGE;
  const machines = machineOnboarded.slice(indexOfFirstPost, indexOfLastPost);

  const onModalClose = () => {
    setShowUploadCategoriesModal(!showUploadCategoriesModal);
  };

  const onModalPhotosClose = () => {
    setShowPhotoUploadModal(!showPhotoUploadModal);
  };

  const onRowActionsHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    mtlId: string
  ) => {
    const itemBounds = event.currentTarget.getBoundingClientRect();
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    setClickPosition(event.clientY);
    if (!mtlId) {
      setActiveMm(undefined);
    }
    setActiveMm({
      mtlId: mtlId,
      position: {
        x: itemBounds.x,
        y: itemBounds.y + itemBounds.height + winScroll
      }
    });
  };
  const closePopups = () => {
    setActiveMm(undefined);
  };

  useEffect(() => {
    closePopups();
  }, [showSubMenu, showPhotoUploadModal, showUploadCategoriesModal]);
  return (
    <>
      <TabNav
        items={[
          {
            label: t('machines'),
            onClick: () => setCurrentTab(Tabs.Machines),
            active: currentTab === Tabs.Machines,
            isTabEnabled: true
          },
          {
            label: t('tag_templates'),
            onClick: () => setCurrentTab(Tabs.MasterTagList),
            active: currentTab === Tabs.MasterTagList,
            isTabEnabled: true
          }
        ]}
      />
      {currentTab === Tabs.Machines && (
        <Container>
          {onboardingMachinesLoading && <Loader size={40} />}
          {!onboardingMachinesLoading &&
            machineInProgress.length == 0 &&
            machineOnboarded.length == 0 && (
              <Root>
                <Typography color={theme.colors.darkGrey} variant="h3">
                  There are no connected machines yet.
                </Typography>
                <PurchaseButtons>
                  <Button
                    variant="primary"
                    disabled={false}
                    onClick={() => {
                      window.location.assign(JBTRoutes.machineManagementNew);
                    }}
                  >
                    Onboard New Machine +
                  </Button>
                </PurchaseButtons>
              </Root>
            )}
          {!onboardingMachinesLoading &&
            (machineInProgress.length != 0 ?? machineOnboarded.length != 0) && (
              <>
                <TableContainer>
                  <StyledIndicator color={theme.colors.atRiskYellow}>
                    In Progress ({machineInProgress.length})
                  </StyledIndicator>
                  <MachineManagementTable
                    data={machineInProgress}
                    isDataLoading={onboardingMachinesLoading}
                    headerBgColor={theme.colors.machineManagementColors.lightOrange}
                    onOpenActions={onRowActionsHandler}
                  />
                </TableContainer>
                {activeMm && activeMm.mtlOption === undefined && (
                  <MachineManagementPopupcard
                    visible={activeMm && activeMm.mtlOption === undefined}
                    handleClose={closePopups}
                    posX={activeMm.position.x}
                    posY={activeMm.position.y}
                    clickPosition={clickPosition}
                    machineId={activeMm?.mtlId}
                    vh={vh}
                  />
                )}
                <TableContainer>
                  <StyledIndicator color={theme.colors.onTrackGreen}>
                    Complete ({machineOnboarded.length})
                  </StyledIndicator>
                  <MachineManagementTable
                    data={machines}
                    isDataLoading={onboardingMachinesLoading}
                    headerBgColor={theme.colors.machineManagementColors.lightGreen}
                    onOpenActions={onRowActionsHandler}
                  />
                  <Pagination
                    onPageChange={(page) => setCurrentPage(page)}
                    itemsPerPage={ITEMS_PER_PAGE}
                    numItems={machineOnboarded.length}
                    currentPage={currentPage}
                  />
                </TableContainer>
              </>
            )}
          <ButtonDiv>
            {showSubMenu && (
              <SubMenuButtonDiv>
                <Button
                  variant="primary"
                  disabled={false}
                  onClick={() => {
                    setShowPhotoUploadModal(true);
                  }}
                >
                  Photos +
                </Button>
                <Button
                  variant="primary"
                  disabled={false}
                  onClick={() => {
                    setShowUploadCategoriesModal(true);
                  }}
                >
                  Shop by Category +
                </Button>
                <Button
                  variant="primary"
                  disabled={false}
                  onClick={() => {
                    window.location.assign(JBTRoutes.machineManagementNew);
                  }}
                >
                  New Machine +
                </Button>
              </SubMenuButtonDiv>
            )}
            <Button variant="primary" onClick={() => setShowSubMenu(!showSubMenu)}>
              {showSubMenu ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faPlus} />}
            </Button>
          </ButtonDiv>
          <Modal
            visible={showUploadCategoriesModal}
            size={ModalSize.SMALL}
            onClose={onModalClose}
            title={HeaderModalUploadCategory}
          >
            <ModalUploadCategory setShowModal={setShowUploadCategoriesModal} />
          </Modal>
          <Modal
            visible={showPhotoUploadModal}
            size={ModalSize.SMALL}
            onClose={onModalPhotosClose}
            title={HeaderModalPhotoUpload}
          >
            <ModalPhotoUpload setShowModal={setShowPhotoUploadModal} />
          </Modal>
        </Container>
      )}
      {currentTab === Tabs.MasterTagList && (
        <Container>
          <MasterTagList />
          <ButtonDiv>
            {showSubMenu && (
              <SubMenuButtonDiv>
                <Button
                  variant="primary"
                  disabled={false}
                  onClick={() => {
                    window.location.assign(JBTRoutes.machineMasterTagListDashBoard);
                  }}
                >
                  {t('create_new_template')}
                </Button>
              </SubMenuButtonDiv>
            )}
            <Button variant="primary" onClick={() => setShowSubMenu(!showSubMenu)}>
              {showSubMenu ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faPlus} />}
            </Button>
          </ButtonDiv>
        </Container>
      )}
    </>
  );
};

export default MachineManagement;
