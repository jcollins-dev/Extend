// 3rd party
import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
// Components
import { Switch as ToggleSwitch, SearchInput, InformationTooltip } from 'components';

// API

// Types
import { PartNode } from 'types/machine-management';

// Constants

// Styling
const Container = styled.div`
  width: 100%;
  height: 100%;
`;
const Header = styled.div`
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.3125rem;
  margin-bottom: 1.25rem;
  color: ${(props) => props.theme.colors.black};
`;

const ContentContainer = styled.div`
  width: 100%;
  height: calc(100% - 5.375rem);
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.white};
  border: 0.0625rem solid ${(props) => props.theme.colors.lightMediumGrey};
  border-radius: 0.625rem;
  overflow: hidden;
`;
const Row = styled.div`
  display: flex;
  flex-grow: 1;
  min-height: 3.125rem;

  div {
    width: 50%;
  }
`;

const LabelRow = styled(Row)`
  background-color: ${(props) => props.theme.colors.lightGrey2};
  flex-grow: 0;
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
  line-height: 1.125rem;
  padding: 1rem;
  border-bottom: 0.0625rem solid ${(props) => props.theme.colors.lightGrey3};
`;

const LabelCell = styled(Cell)`
  font-weight: 700;
`;

const PartRows = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  height: 15rem;
`;
const FiltersContainer = styled.div`
  display: flex;
  margin-bottom: 0.625rem;
`;
const Searchbox = styled.div`
  width: 18.063rem;
  height: 2.375rem;
`;
const ToggleFilerBox = styled.div`
  display: flex;
  margin-left: 0.625rem;
  margin-top: 0.313rem;
`;

// Component properties
interface PartsListProps {
  parts?: PartNode[];
  heading: string;
}

export const PartsList = ({ parts, heading }: PartsListProps): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['fpns']);
  const [infilterMode, setActiveTableFilter] = useState<boolean>(false);
  const [displayedParts, setDisplayedParts] = useState<PartNode[] | undefined>([]);
  const handleGlobalSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const searchTerm = event.target.value;
    const targetParts: PartNode[] | undefined = [];
    if (parts) {
      parts.forEach((part) => {
        if (
          part.description?.includes(searchTerm.toLocaleLowerCase()) ||
          part.description?.includes(searchTerm.toLocaleUpperCase()) ||
          part.sku?.includes(searchTerm)
        ) {
          targetParts?.push(part);
        }
      });
      setDisplayedParts([...targetParts]);
    }
  };
  useEffect(() => {
    if (infilterMode) {
      const bubble: PartNode[] | undefined = [];
      parts?.forEach((part) => {
        if (!part.hasBubble) {
          bubble?.push(part);
        }
      });
      setDisplayedParts([...bubble]);
    } else {
      setDisplayedParts(parts);
    }
  }, [infilterMode]);
  useEffect(() => {
    if (parts) {
      setDisplayedParts([...parts]);
    }
  }, [parts]);
  return (
    <Container>
      <Header>{heading}</Header>
      <FiltersContainer>
        <Searchbox>
          {/* <PartsSearch type="search" placeholder="Search Table" /> */}
          <SearchInput
            placeholder={t('search_product_name_or_sku') as string}
            onChange={handleGlobalSearchChange}
          />
        </Searchbox>
        <ToggleFilerBox>
          <ToggleSwitch
            checked={infilterMode}
            onChange={(checked) => setActiveTableFilter(checked)}
            offColor={theme.colors.mediumGrey2}
            offHandleColor={theme.colors.mediumGrey1}
            onColor={theme.colors.mediumBlue}
            onHandleColor={theme.colors.mediumBlue3}
            height={16}
            width={32}
          />
          <InformationTooltip placement="top" tooltipText={t('parts_without_bubble')} />
        </ToggleFilerBox>
      </FiltersContainer>
      <ContentContainer>
        <LabelRow>
          <LabelCell>Part name</LabelCell>
          <LabelCell>Part number</LabelCell>
        </LabelRow>
        <PartRows>
          {displayedParts?.map((part, i) => (
            <Row key={i}>
              <Cell>{part.description}</Cell>
              <Cell>{part.sku}</Cell>
            </Row>
          ))}
        </PartRows>
      </ContentContainer>
    </Container>
  );
};
