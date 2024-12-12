import React, { useEffect, ReactElement, useState, useRef } from 'react';
import styled from 'styled-components';
import { Card, ClickablePartBubble } from 'components';
import Typography from 'components/Typography/Typography';
import { convertRemToPixels } from 'helpers';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Bubble } from 'types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDOM from 'react-dom';
import { truncatePartName } from 'helpers/part';

type HeaderTextJustification = 'left' | 'center' | 'right';

interface PopUpCardProps {
  show: boolean;
  setShowFunction: (b: boolean) => void;
  marker?: Bubble;
  children?: React.ReactNode | React.ReactNode[];
  widthRem?: number;
  headerText?: string;
  headerTextJustification?: HeaderTextJustification;
  baseRef?: React.MutableRefObject<HTMLDivElement | null>;
  location?: Location;
  positionX?: number;
  positionY?: number;
  fitContent?: boolean;
  backgroundColor?: string;
  bubbleColor?: string;
  hideCloseButton?: boolean;
  padChildren?: boolean;
}

const PopUpCardRoot = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  flex-grow: 1;
  max-height: 23.9375rem;
  box-shadow: 0rem 0.875rem 1.563rem rgba(0, 43, 104, 0.2);
  border-radius: 0.625rem;
`;

const PopUpOuterCard = styled(Card)`
  display: flex;
  flex-grow: 1;
`;

interface InnerCardProps {
  padChildren?: boolean;
}
const InnerCard = styled.div<InnerCardProps>`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => (props.padChildren ? '1.25rem' : '0')};
`;

const ClickableBubbleCanvas = styled.svg`
  height: 2rem;
  width: 2rem;
  overflow: visible;
`;

const XButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const HeaderText = styled(Typography)`
  margin: 0;
  text-align: ${(props: PopUpCardProps) => props.headerTextJustification || 'center'};
`;

const XButton = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
  cursor: pointer;
`;

const LEFT_OFFSET_PX = convertRemToPixels(1);
const DEFAULT_WIDTH_REM = 10;
type Location = 'left' | 'right';

function getPopUpWidthPX(inputWidth: number | undefined) {
  if (typeof inputWidth === 'undefined') {
    return convertRemToPixels(DEFAULT_WIDTH_REM);
  }
  return convertRemToPixels(inputWidth);
}

function detectClickOutside(
  ref: React.MutableRefObject<HTMLDivElement | null>,
  setShowFunction: (b: boolean) => void,
  baseRef?: React.MutableRefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: Event) {
      //Click on parent is handled by parent
      if (!(baseRef?.current && !baseRef.current.contains(event.target as Element))) {
        return;
      }

      if (ref.current && !ref.current.contains(event.target as Element)) {
        setShowFunction(false);
      }
    }
    // Bind the event listener
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [ref, baseRef]);
}

const showPopUp = (
  baseLeft: number,
  baseTop: number,
  inputWidth: number | undefined,
  location: Location
) => {
  const popUpWidthPX = getPopUpWidthPX(inputWidth);
  const retLeft: number =
    location === 'left'
      ? baseLeft - popUpWidthPX - LEFT_OFFSET_PX
      : baseLeft + popUpWidthPX + LEFT_OFFSET_PX;
  return {
    left: retLeft,
    top: baseTop
  };
};
/**
 *
 * Component to serve as the basis for card-style popups. Note: Since this positions itself absolutely in relation to the base ref provided, make sure the base ref provided has the
 * property `position: relative` in CSS. Otherwise it will position itself weirdly.
 *
 * @param show boolean variable that controls the visibility of the pop up
 * @param marker optional clickable bubble to show in the corner of the pop up card
 * @param widthRem width (in rem) to make the pop up
 * @param baseRef the ref to use as the base location for this pop up. The pop up will position itself relative to this ref. If not provided, it will place itself at 0,0 on the document body.
 * @param location one of 'left' or 'right' to determine which side to pop up on
 * @param positionX optional number used in conjunction with positionY for the position of the pop up, baseRef has priority over this param
 * @param positionY optional number used in conjunction with positionX for the position of the pop up, baseRef has priority over this param
 * @param fitContent optional boolean to set width to min-content, otherwise width is set with widthRem
 * @param backgroundColor optional string for the background color of the pop up
 * @param bubbleColor optional string for the color of optional bubble set in marker param
 */
function PopUpCard({
  show,
  setShowFunction,
  marker,
  children,
  widthRem,
  headerText,
  headerTextJustification,
  baseRef,
  location,
  positionX = 0,
  positionY = 0,
  fitContent = false,
  backgroundColor,
  bubbleColor,
  hideCloseButton,
  padChildren = true
}: PopUpCardProps): ReactElement {
  const [left, setLeft] = useState<number>(0);
  const [top, setTop] = useState<number>(0);
  const wrapperRef = useRef(null);
  detectClickOutside(wrapperRef, setShowFunction, baseRef);

  // the pop up will handle placing itself relative to the placement of the provided base ref
  useEffect(() => {
    if (baseRef && baseRef.current && baseRef.current.offsetLeft) {
      const { left: newLeft, top: newTop } = showPopUp(
        baseRef.current.offsetLeft,
        baseRef.current.offsetTop,
        widthRem,
        location ?? 'left'
      );

      setLeft(newLeft);
      setTop(newTop);
    } else {
      setLeft(positionX);
      setTop(positionY);
    }
  });

  return ReactDOM.createPortal(
    <PopUpCardRoot
      style={{
        display: show ? 'block' : 'none',
        top: top,
        left: left,
        width: fitContent ? 'min-content' : getPopUpWidthPX(widthRem)
      }}
      ref={wrapperRef}
    >
      <PopUpOuterCard backgroundColor={backgroundColor}>
        <InnerCard padChildren={padChildren}>
          {!hideCloseButton && (
            <XButtonContainer>
              {headerText && (
                <HeaderText headerTextJustification={headerTextJustification} variant="h3">
                  {truncatePartName(headerText, 32)}
                </HeaderText>
              )}
              {marker && (
                <ClickableBubbleCanvas>
                  <ClickablePartBubble
                    index={marker?.index || '0'}
                    radius={12}
                    id={'pop-up-card-bubble'}
                    x={16}
                    y={16}
                    color={bubbleColor}
                  />
                </ClickableBubbleCanvas>
              )}
              <XButton onClick={() => setShowFunction(false)} icon={faTimes} />
            </XButtonContainer>
          )}
          {children}
        </InnerCard>
      </PopUpOuterCard>
    </PopUpCardRoot>,
    baseRef && baseRef.current && baseRef.current.offsetLeft ? baseRef?.current : document.body // contain
  );
}

export default PopUpCard;
