// 3rd part libs
import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

// Components
import { Modal, TabNav } from 'components';
import {
  Overview,
  ProductMovement,
  ProductProcessing
} from 'pages/ProteinMachine/MachineConfig/MachineHealth';
import { useWidgetTableContext, WidgetTableProvider } from 'components/machine-health';

// Types
import { ModalSize } from 'types';
import { WidgetTableDataItem } from 'types/machine-health';
import { WidgetType } from 'types/protein';

interface Tab {
  isTabEnabled: boolean;
  title: string;
}

const TABS: Record<string, Tab> = {
  overview: {
    isTabEnabled: true,
    title: 'Overview'
  },
  productProcessing: {
    isTabEnabled: true,
    title: 'Product Processing'
  },
  productMovement: {
    isTabEnabled: true,
    title: 'Product Movement'
  }
};

// Styled Components
const StyledTitleContainer = styled.div`
  color: ${(props) => props.theme.colors.darkGrey};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 3rem 1.5rem;
`;

const StyledTitle = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.3125rem;
  letter-spacing: 0rem;
  text-align: left;
  width: 100%;
`;

const StyledSubtitle = styled.div`
  font-size: ${({ theme }) => theme.typography.text.helper.size};
  font-style: normal;
  font-weight: ${({ theme }) => theme.typography.text.helper.weight};
  line-height: ${({ theme }) => theme.typography.text.helper.lineHeight};
  letter-spacing: 0rem;
  text-align: left;
  width: 100%;
`;

const StyledBodyContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const StyledTableWrapper = styled.div`
  padding: 2rem 4rem;
`;

interface Props {
  closeModal: () => void;
  copyDestinationItem: WidgetTableDataItem | undefined;
  copyMachineId: string;
  copyWidgetType: WidgetType;
  setIsDirty: (isDirty: boolean) => void;
  setVisible: (visible: boolean) => void;
  visible: boolean;
}

const ModalCopyTable = ({
  closeModal,
  copyDestinationItem,
  copyMachineId,
  copyWidgetType,
  setIsDirty,
  setVisible,
  visible
}: Props): JSX.Element => {
  const { setLocalTableRows } = useWidgetTableContext();
  const [activeTab, setActiveTab] = useState(TABS.overview.title);

  const navItem = (tab: Tab) => {
    return {
      label: tab.title,
      onClick: () => {
        setActiveTab(tab.title);
      },
      active: activeTab === tab.title,
      isTabEnabled: tab.isTabEnabled
    };
  };

  const handleCopyClick = (copyItem: WidgetTableDataItem) => {
    if (!copyDestinationItem) {
      closeModal();
      return;
    }

    setLocalTableRows((prev) => {
      const copyIndex = prev.findIndex((widget) => widget.id === copyDestinationItem?.id);
      const copyMembers: WidgetTableDataItem[] | undefined = copyItem.members?.map((member) => ({
        ...member,
        id: uuidv4()
      }));

      const next = [...prev];

      copyIndex >= 0 &&
        (next[copyIndex] = {
          ...next[copyIndex],
          // Add the copy data into the existing widget's members key as an array.
          // We do this due to the structure of the widget table data.
          // Similar to how data is passed to the widget table ...
          // ... in the AdminCardEditButton component.
          members: [
            {
              ...copyDestinationItem,
              members: copyMembers,
              tags: copyItem.tags
            }
          ]
        });

      return next;
    });
    setIsDirty(true);
    closeModal();
  };

  return (
    <Modal
      allowContentScroll
      title={
        <StyledTitleContainer>
          <StyledTitle>Duplicate Machine Configuration</StyledTitle>
          <StyledSubtitle>{`Copy a machine's configuration including widgets and layout`}</StyledSubtitle>
        </StyledTitleContainer>
      }
      visible={visible}
      onClose={() => setVisible(false)}
      size={ModalSize.LARGE}
    >
      <StyledBodyContainer>
        <TabNav
          items={[
            navItem(TABS.overview),
            navItem(TABS.productProcessing),
            navItem(TABS.productMovement)
          ]}
        />
        <StyledTableWrapper>
          <WidgetTableProvider>
            {activeTab === TABS.overview.title && (
              <Overview
                copyWidgetType={copyWidgetType}
                handleCopyCallback={handleCopyClick}
                hideButtonRow
                isCopyTab
                isDirty={false}
                overrideMachineId={copyMachineId}
                removePadding
                setIsDirty={() => undefined}
              />
            )}
            {activeTab === TABS.productProcessing.title && (
              <ProductProcessing
                copyWidgetType={copyWidgetType}
                handleCopyCallback={handleCopyClick}
                hideButtonRow
                isCopyTab
                isDirty={false}
                overrideMachineId={copyMachineId}
                removePadding
                setIsDirty={() => undefined}
              />
            )}
            {activeTab === TABS.productMovement.title && (
              <ProductMovement
                copyWidgetType={copyWidgetType}
                handleCopyCallback={handleCopyClick}
                hideButtonRow
                isCopyTab
                isDirty={false}
                overrideMachineId={copyMachineId}
                removePadding
                setIsDirty={() => undefined}
              />
            )}
          </WidgetTableProvider>
        </StyledTableWrapper>
      </StyledBodyContainer>
    </Modal>
  );
};

export default ModalCopyTable;
