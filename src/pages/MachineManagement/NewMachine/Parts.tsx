import React from 'react';
import Typography from 'components/Typography/Typography';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ClickablePartBubble, Loader } from 'components';
import { themeColors } from 'themes';
import { PartNode } from 'types/machine-management';

const Part = styled.div<{ isSelected?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 0.25rem;
  padding-right: 1rem;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.background.background5 : 'transparent'};

  div > p {
    color: ${({ isSelected, theme }) =>
      isSelected ? theme.colors.text.white : theme.colors.text.black};
  }
`;

const Container = styled.div``;

const PartWithBubble = styled.div`
  display: flex;
  padding-right: 1rem;

  p {
    margin-right: 1rem;
    margin-top: 0.5rem;
  }
`;

const ArrowContainer = styled.div`
  margin-top: 0.5rem;
`;

const Parts = ({
  columnNumber,
  partHierarchy,
  isFetching,
  selectedPartIds,
  handleClick
}: {
  columnNumber: number;
  partHierarchy: PartNode[] | undefined;
  isFetching: boolean;
  selectedPartIds: string[];
  columnsWithParts: PartNode[][];
  handleClick: (clickedPart: PartNode, columnNumber: number) => void;
}): JSX.Element => {
  return (
    <Container>
      {isFetching ? (
        <Loader margin="auto" />
      ) : (
        partHierarchy &&
        partHierarchy.map((part) => {
          return (
            <Part
              isSelected={selectedPartIds.indexOf(part.id) !== -1}
              key={part.id}
              onClick={() => {
                if (
                  part.children &&
                  part.children?.length > 0 &&
                  selectedPartIds.indexOf(part.id) === -1
                ) {
                  handleClick(part, columnNumber);
                }
              }}
            >
              <PartWithBubble>
                <Typography variant="body1">
                  {part.description + '(' + part.sku + ')' || part.sku}
                </Typography>
                {part.children &&
                  part.children?.length > 0 &&
                  (selectedPartIds.indexOf(part.id) === -1 ? (
                    <Bubble
                      index={part.children?.length}
                      color={themeColors.mediumBlue}
                      fontColor={themeColors.white}
                    />
                  ) : (
                    <Bubble
                      index={part.children?.length}
                      color={themeColors.white}
                      fontColor={themeColors.mediumBlue}
                    />
                  ))}
              </PartWithBubble>
              {part.children && part.children?.length > 0 && (
                <ArrowContainer>
                  {selectedPartIds.indexOf(part.id) !== -1 ? (
                    <FontAwesomeIcon icon={faCheck} color={themeColors.white} />
                  ) : (
                    <FontAwesomeIcon style={{ fontSize: '1rem' }} icon={faArrowRight} />
                  )}
                </ArrowContainer>
              )}
            </Part>
          );
        })
      )}
    </Container>
  );
};

const ClickableBubbleCanvas = styled.svg`
  height: 2rem;
  width: 2rem;
  overflow: visible;
  display: inline-block;
  vertical-align: middle;
  flex-grow: 0;
  flex-shrink: 0;
`;

const Bubble = ({
  index,
  color,
  fontColor
}: {
  index: number;
  color: string;
  fontColor: string;
}) => {
  return (
    <ClickableBubbleCanvas>
      <ClickablePartBubble
        bubbleType="circle"
        index={index.toString()}
        radius={12}
        id={'pop-up-card-bubble'}
        x={16}
        y={16}
        color={color}
        fontColor={fontColor}
      />
    </ClickableBubbleCanvas>
  );
};

export default Parts;
