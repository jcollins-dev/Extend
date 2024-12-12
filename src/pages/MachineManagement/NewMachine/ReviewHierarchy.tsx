import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'components';
import { JBTRoutes } from 'constants/routes';
import { useGetPartHierarchyQuery } from 'api';
import { PartNode } from 'types/machine-management';
import { useWizard } from 'react-use-wizard';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import Parts from './Parts';
import theme from 'themes';
import styled from 'styled-components';

const RootContainer = styled.div`
  //flex-grow: 1;
  height: 100%;
`;

interface ColumnProps {
  pxFromTop?: number;
}
const Container = styled.div<ColumnProps>`
  margin: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  border: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
  border-radius: 0.625rem;
  height: calc(100% - 8.875rem); // 4rem margin and the height of the buttons container
  height: ${(props) =>
    props.pxFromTop ? `calc(100vh - ${props.pxFromTop / 16}rem - 6.875rem)` : '80vh'};
  overflow: hidden;
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

const Column = styled.div`
  width: 33%;
  height: 100%;
  overflow: auto;
  border-right: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
`;

const ColumnContent = styled.div`
  height: 100%;
`;

export const ReviewHierarchy = ({ machineId }: { machineId: string }): JSX.Element => {
  const [pxFromTop, setPxFromTop] = useState<number>(0);
  const elRef = useRef<HTMLDivElement>(null);
  const { goToStep } = useWizard();
  const [partsInHierarchy, setPartsInHierarchy] = useState<PartNode[]>([]);
  const [columnsWithParts, setColumnsWithParts] = useState<PartNode[][]>([]);
  const [selectedPartIds, setSelectedPartIds] = useState<string[]>([]);
  const { data: partHierarchyData, isFetching } = useGetPartHierarchyQuery(
    machineId === ''
      ? skipToken
      : {
          machineId: machineId
        }
  );

  useEffect(() => {
    if (elRef && elRef.current) {
      setPxFromTop(elRef.current.offsetTop);
    }
  }, [elRef]);

  useEffect(() => {
    if (partHierarchyData !== undefined) {
      const arr = Object.keys(partHierarchyData).map((k) => partHierarchyData[k] as PartNode);
      const sorted_arr = arr.sort((a, b) => {
        if (a.description !== undefined && b.description !== undefined) {
          return a.description > b.description ? 1 : -1;
        } else return -1;
      });
      setPartsInHierarchy(sorted_arr);
    }
  }, [isFetching]);

  const handleClick = (clickedPart: PartNode, columnNumber: number) => {
    //if User click on one of the first columns, remove columns that doesn't have to show anymore
    selectedPartIds.splice(columnNumber);
    columnsWithParts.splice(columnNumber);

    clickedPart.children && columnsWithParts.push(clickedPart.children);
    selectedPartIds.push(clickedPart.id);

    setColumnsWithParts([...columnsWithParts]);
    setSelectedPartIds([...selectedPartIds]);
  };

  return (
    <RootContainer>
      <Container ref={elRef} pxFromTop={pxFromTop}>
        <Column>
          <ColumnContent>
            <Parts
              columnNumber={0}
              partHierarchy={partsInHierarchy}
              isFetching={isFetching}
              selectedPartIds={selectedPartIds}
              columnsWithParts={columnsWithParts}
              handleClick={handleClick}
            />
          </ColumnContent>
        </Column>
        {columnsWithParts &&
          columnsWithParts.length > 0 &&
          columnsWithParts.map((parts, i) => {
            return (
              <Column key={i}>
                <ColumnContent>
                  <Parts
                    columnNumber={i + 1}
                    partHierarchy={parts}
                    isFetching={isFetching}
                    selectedPartIds={selectedPartIds}
                    columnsWithParts={columnsWithParts}
                    handleClick={handleClick}
                  />
                </ColumnContent>
              </Column>
            );
          })}
      </Container>
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
          disabled={false}
          variant="primary"
          onClick={() => {
            goToStep(1);
          }}
        >
          Continue
        </Button>
      </ButtonsContainer>
    </RootContainer>
  );
};
