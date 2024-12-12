// 3rd party libs
import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useHistory } from 'react-router-dom';

// API
import { useDeleteMasterTagListVersionMutation, useGetMasterTagListQuery } from 'api';

// Routing
import { JBTRoutes } from 'constants/routes';

// Types
import { MtlOption } from 'types/machine-management';

// Components
import { Button, Loader, MasterTagListTable, Typography, WarningPrompt } from 'components';
import { default as VersionHistoryFlyout } from './VersionHistoryFlyout';
import { default as MtlOptionPopupCard } from './MtlOptionPopupCard';
import { toast } from 'react-toastify';
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

const CreateButton = styled.div`
  display: flex;
  max-width: 21rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  * + * {
    margin-left: 1rem;
  }
`;
const TableContainer = styled.div`
  padding: 2rem 1rem 1rem 2rem;
`;

interface ActiveMtlRow {
  mtlId: string;
  position: { x: number; y: number };
  mtlOption?: MtlOption;
}

const MasterTagList = (): JSX.Element => {
  const theme = useTheme();
  const history = useHistory();
  const [activeMtl, setActiveMtl] = useState<ActiveMtlRow>();
  const [showWarningPrompt, setShowWarningPrompt] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { t } = useTranslation(['mh']);
  const { data: masterTagList, isLoading: masterTagListLoading } = useGetMasterTagListQuery();
  const [deleteMasterTagListVersion] = useDeleteMasterTagListVersionMutation();

  useEffect(() => {
    if (confirmDelete) {
      deleteMasterTagListVersion({
        masterTagListId: activeMtl?.mtlId || ''
      })
        .unwrap()
        .then(() => {
          toast.success(`Latest Tag Template List version deleted!`, {
            toastId: 'mtl-deleted'
          });
        })
        .catch((error) => {
          console.warn('Delete MTL latest version error: ', error);
          toast('⚠️ There was a problem while deleting the MTL version.');
        });
      setShowWarningPrompt(false);
      setConfirmDelete(false);
    }
  }, [confirmDelete, activeMtl]);

  const gotoMasterTagListDashBoard = () => {
    history.push(JBTRoutes.machineMasterTagListDashBoard);
  };

  const onRowActionsHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    mtlId: string
  ) => {
    const itemBounds = event.currentTarget.getBoundingClientRect();
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

    setActiveMtl({
      mtlId: mtlId,
      position: {
        x: itemBounds.x,
        y: itemBounds.y + itemBounds.height + winScroll
      }
    });
  };

  const onOptionSelect = (optionType: MtlOption, mtlId: string) => {
    if (activeMtl && mtlId === activeMtl.mtlId) {
      setActiveMtl({ ...activeMtl, mtlOption: optionType });
    }
    if (optionType === MtlOption.Edit) {
      history.push(`${JBTRoutes.machineMasterTagListDashBoard}?mtlId=${mtlId}`);
    }
    if (optionType === MtlOption.Duplicate) {
      history.push(`${JBTRoutes.machineMasterTagListDashBoard}?mtlId=${mtlId}&duplicate=${true}`);
    }
    if (optionType === MtlOption.Delete) {
      setShowWarningPrompt(true);
    }
  };

  const closePopups = () => {
    setActiveMtl(undefined);
  };

  return (
    <>
      {masterTagListLoading && <Loader />}
      {!masterTagListLoading && (!masterTagList || masterTagList?.length === 0) && (
        <Root>
          <Typography color={theme.colors.darkGrey} variant="h3">
            {t('there_are_no_tag_template_lists_yet')}
          </Typography>
          <CreateButton>
            <Button
              variant="primary"
              disabled={false}
              onClick={() => {
                gotoMasterTagListDashBoard();
              }}
            >
              {t('create_a_new_tag_template_list')}
            </Button>
          </CreateButton>
        </Root>
      )}
      {!masterTagListLoading && masterTagList && masterTagList?.length !== 0 && (
        <TableContainer>
          <MasterTagListTable
            data={masterTagList || []}
            isDataLoading={masterTagListLoading}
            headerBgColor={theme.colors.lightGrey1}
            onOpenActions={onRowActionsHandler}
          />
        </TableContainer>
      )}
      {activeMtl && activeMtl.mtlOption === undefined && (
        <MtlOptionPopupCard
          mtlId={activeMtl && activeMtl.mtlId ? activeMtl.mtlId : ''}
          visible={activeMtl && activeMtl.mtlOption === undefined}
          handleOption={onOptionSelect}
          handleClose={() => closePopups()}
          posX={activeMtl.position.x}
          posY={activeMtl.position.y}
        />
      )}
      {activeMtl && activeMtl.mtlOption === MtlOption.Versions && (
        <VersionHistoryFlyout masterTagListId={activeMtl.mtlId} onClose={() => closePopups()} />
      )}
      <WarningPrompt
        helperText={`Are you sure you want to delete the latest version of this Tag Template List?`}
        isConfirmPrompt
        isVisible={showWarningPrompt}
        onCancelCallback={() => setShowWarningPrompt(false)}
        onConfirmCallback={() => setConfirmDelete(true)}
        title="Confirm Deletion"
      />
    </>
  );
};

export default MasterTagList;
