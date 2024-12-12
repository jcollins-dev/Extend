// 3rd party libs
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { Tabs } from 'components';
//import { Typography } from 'components';
import PartAssembly from './PartAssembly';
import SearchView from './SearchView';
import SearchCategoryView from './SearchCategoryView';
//import ClickablePartBubble from 'components/ClickablePartBubble/ClickablePartBubble';
import { ClickablePartBubble, Typography } from 'components';
import theme, { themeColors } from 'themes';
// Icons
// import { UserGuide } from 'icons';

// Types
import { Machine } from 'types';
import { Part } from 'types/parts';

interface Props {
  machineId: string;
  machine?: Machine;
  part?: Part;
}

enum TabType {
  DIAGRAM = 'diagram',
  SEARCH = 'search',
  SHOP_BY_CATEGORY = 'shop_by_category'
}

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const TabPanels = styled.div<{ tab: TabType }>`
  overflow-x: hidden;
  display: flex;

  > * {
    transform: translateX(
      ${({ tab }) => (tab === TabType.DIAGRAM ? '0%' : tab === TabType.SEARCH ? '-100%' : '-200%')}
    );
    transition: transform 0.4s ease-in-out;
  }
`;

const TabPanel = styled.div`
  width: 100%;
  flex-shrink: 0;
`;

// TODO: restore this
// const UserGuideBtn = styled.button`
//   cursor: pointer;
//   padding: 0;
//   background: none;
//   border: none;
//   display: flex;
//   align-items: center;

//   & svg {
//     margin-right: 0.625rem;
//   }
// `;

const LegendContainer = styled.div`
  position: relative;
  padding: 0.5rem 0.5rem;
  display: flex;
  gap: 1rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 0;
  max-width: 60rem;
  flex-wrap: wrap;
  align: center;
  margin-left: auto;
  margin-right: auto;
`;

const ClickableBubbleCanvas = styled.svg`
  height: 2rem;
  width: 2rem;
  overflow: visible;
  display: inline-block;
  vertical-align: middle;
  flex-grow: 0;
  flex-shrink: 0;
`;

const TextContainer = styled(Typography)`
  margin-top: 0.7rem;
  margin-left: 0.0011rem;
  display: inline-block;
  vertical-align: middle;
  flex-grow: 0;
  flex-shrink: 0;
`;

const SubLegendContainer = styled.div`
  position: relative;

  gap: 1rem;
  align-items: center;
  justify-content: space-around;
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  flex-shrink: 0;
`;

const FindPart = ({ machineId, machine, part }: Props): JSX.Element => {
  const [tabType, setTabType] = useState<TabType>(TabType.DIAGRAM);
  const { t } = useTranslation(['fpns']);

  return (
    <>
      <TabsContainer>
        <Tabs
          currentTabPanel={tabType}
          setTabPanel={setTabType}
          items={[
            {
              label: t('parts_diagram'),
              panel: TabType.DIAGRAM
            },
            {
              label: t('search_for_parts'),
              panel: TabType.SEARCH
            },
            {
              label: t('shop_by_category'),
              panel: TabType.SHOP_BY_CATEGORY
            }
          ]}
        />
        {/* <UserGuideBtn
          onClick={() => {
            // TODO - launch user guide
          }}
        >
          {UserGuide()}
          <Typography as="span" mb={0} color="mediumBlue" weight="bold">
            Open Guide
          </Typography>
        </UserGuideBtn> */}
      </TabsContainer>
      {tabType === TabType.DIAGRAM && (
        <LegendContainer>
          <SubLegendContainer>
            <ClickableBubbleCanvas>
              <ClickablePartBubble
                bubbleType="squareLegend"
                index={'0'}
                radius={12}
                id={'pop-up-card-bubble'}
                x={16}
                y={16}
                color={themeColors.onTrackGreen2}
              />
            </ClickableBubbleCanvas>
            {/* to be renamed as Unpurchasable assembly when all symbols are uncommented */}
            <TextContainer>{t('assembly')}</TextContainer>
          </SubLegendContainer>
          {/* to be uncommented later */}
          {/* 
          <SubLegendContainer>
            <ClickableBubbleCanvas>
              <ClickablePartBubble
                bubbleType="squareCircleLegend"
                index={0}
                radius={12}
                id={'pop-up-card-bubble'}
                x={16}
                y={16}
                color={themeColors.onTrackGreen2}
              />
            </ClickableBubbleCanvas>
            <TextContainer>Purchasable Assembly</TextContainer>
          </SubLegendContainer>
          */}
          <SubLegendContainer>
            <ClickableBubbleCanvas>
              <ClickablePartBubble
                bubbleType="circle"
                index={'0'}
                radius={12}
                id={'pop-up-card-bubble'}
                x={16}
                y={16}
                color={themeColors.mediumBlue}
              />
            </ClickableBubbleCanvas>
            <TextContainer>{t('purchasable_part')}</TextContainer>
          </SubLegendContainer>

          <SubLegendContainer>
            <ClickableBubbleCanvas>
              <ClickablePartBubble
                bubbleType="circle"
                index={'0'}
                radius={12}
                id={'pop-up-card-bubble'}
                x={16}
                y={16}
                color={theme.colors.lightGrey5}
              />
            </ClickableBubbleCanvas>
            <TextContainer>{t('unpurchasable_part')}</TextContainer>
          </SubLegendContainer>
          {/* to be uncommented later */}
          {/* 
          <SubLegendContainer>
            <ClickableBubbleCanvas>
              <ClickablePartBubble
                bubbleType="circle"
                index={0}
                radius={12}
                id={'pop-up-card-bubble'}
                x={16}
                y={16}
                color={theme.colors.negativeRed}
              />
            </ClickableBubbleCanvas>
            <TextContainer>Part Missing from ERP</TextContainer>
          </SubLegendContainer>
          <SubLegendContainer>
            <ClickableBubbleCanvas>
              <ClickablePartBubble
                bubbleType="circle"
                index={0}
                radius={12}
                id={'pop-up-card-bubble'}
                x={16}
                y={16}
                color={'#FFA500'}
              />
            </ClickableBubbleCanvas>
            <TextContainer>Part/Assembly missing from BOM</TextContainer>
          </SubLegendContainer>
          */}
          <SubLegendContainer>
            <ClickableBubbleCanvas>
              <ClickablePartBubble
                bubbleType="circleOutline"
                index={'0'}
                radius={12}
                id={'pop-up-card-bubble'}
                x={16}
                y={16}
                color={themeColors.black}
              />
            </ClickableBubbleCanvas>
            <TextContainer>{t('unidentified_assembly_part')}</TextContainer>
          </SubLegendContainer>
        </LegendContainer>
      )}

      <TabPanels tab={tabType}>
        <TabPanel id="diagram" role="tabpanel">
          <PartAssembly machine={machine} assembly={part} />
        </TabPanel>
        <TabPanel id="search" role="tabpanel">
          <SearchView machineId={machineId} part={part} />
        </TabPanel>
        <TabPanel id="shop_by_category" role="tabpanel">
          <SearchCategoryView
            machineId={machineId}
            businessUnitId={machine?.businessUnit as string}
          />
        </TabPanel>
      </TabPanels>
    </>
  );
};

export default FindPart;
