// 3rd party
import React, { ReactElement, ReactEventHandler, useState } from 'react';
import styled from 'styled-components';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination, Scrollbar } from 'swiper';

// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/modules/grid/grid.min.css';
import 'swiper/swiper-bundle.min.css';

// import required modules
import SwiperCore from 'swiper';

// Components
import { Button, Loader, SubAssembly, SubAssemblyZoom, Typography } from 'components';

// Types
import { MachineBusinessUnit, Resource } from 'types';
import { DiagramAction, DiagramBubbleAction, Part } from 'types/parts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassMinus, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import theme from 'themes';

// Custom styling
const GalleryContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  // Override Swiper's coloring
  --swiper-theme-color: #018cd8;

  & .swiper {
    width: 100%;
    height: 100%;
  }

  // Tweak position of next/prev arrows
  & .swiper-button-next {
    right: 0.125rem;
  }

  & .swiper-button-prev {
    left: 0.125rem;
  }

  & .swiper-slide {
    width: 100%;
    height: 100%;
  }

  & .react-transform-wrapper {
    width: 100%;
    height: 100%;
  }

  & .react-transform-component {
    width: 100%;
    height: 100%;
  }
  & svg {
    padding-bottom: 1rem;
  }
`;

const ThumbsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  & .swiper {
    margin: inherit;
    width: auto;
    height: auto;
    padding-bottom: 0.7rem;
  }

  & .swiper-slide {
    width: 2.75rem !important;
    height: 2.75rem;
    margin-right: 0.625rem;
    opacity: 0.35;

    &last-child {
      margin-right: 0;
    }
  }

  & .swiper-slide-thumb-active {
    opacity: 1;
  }
`;

const ThumbImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  object-fit: contain;
  border-radius: 0.3125rem;
  border: ${(props) => props.theme.colors.borders.nav.border};
  background-color: ${(props) => props.theme.colors.white};

  & img {
    display: block;
    width: 100%;
    height: 100%;
    padding: 1px;
  }
`;

const PositionContainer = styled.div`
  padding-left: 0.5vh;
  padding-right: 0.5vh;
`;

interface DiagramProps {
  zoomedOut?: boolean;
  pan?: boolean;
  active?: boolean;
}
export const DiagramOuterContainer = styled.div<DiagramProps>`
  width: 100%;
  height: 100%;
  cursor: ${({ zoomedOut, pan }) => (zoomedOut ? 'pointer' : pan ? 'all-scroll' : 'auto')};
  opacity: ${({ zoomedOut }) => (zoomedOut ? 0.65 : 1)};

  &:hover {
    opacity: 1;
  }
`;

export const DiagramContainer = styled.div<DiagramProps>`
  width: 100%;
  height: 100%;
  pointer-events: ${({ zoomedOut }) => (zoomedOut ? 'none' : 'auto')};
`;

interface MiniPictureProps {
  width?: number;
  height?: number;
}

export const MiniPictureContainer = styled.div<MiniPictureProps>`
  width: ${({ width }) => (width ? `${width / 16}rem` : '20%')};
  height: ${({ height }) => (height ? `${height / 16}rem` : '20%')};
  background-color: white;
  position: fixed;
  top: 0.625rem;
  right: 0.625rem;
  z-index: 5;
  border: 0.0625rem solid ${() => theme.colors.lightGrey2};
  border-radius: 0.5rem;
  box-shadow: 0 0.625rem 0.9375rem rgba(0, 0, 0, 0.1), 0 0.25rem 0.375rem rgba(0, 0, 0, 0.05);
`;

export const BlueBoxContainer = styled.div<{
  width?: number;
  height?: number;
  top?: number;
  right?: number;
}>`
  border: 0.125rem solid ${() => theme.colors.mediumBlue};
  position: fixed;
  top: ${({ top }) => (top !== undefined ? `${top / 16}rem` : '0.625rem')};
  right: ${({ right }) => (right !== undefined ? `${right / 16}rem` : '6rem')};
  width: ${({ width }) => (width !== undefined ? `${width / 16}rem` : '6rem')};
  height: ${({ height }) => (height !== undefined ? `${height / 16}rem` : '6rem')};
  z-index: 6;
`;

const ZoomControlsContainer = styled.div`
  display: flex;
  align-items: center;
`;

// Helper functions
const placeholderPart = '/assets/placeholder/part.svg';

const handleImgError: ReactEventHandler<HTMLImageElement> = (event) => {
  const img = event.target as HTMLImageElement;
  img.src = placeholderPart;
};

interface Props {
  partDiagrams?: Resource[] | null;
  onClick?: DiagramBubbleAction;
  parts?: Part[];
  currentZoom?: number;
  currentSlide?: number;
  setCurrentSlide?: React.Dispatch<React.SetStateAction<number>>;
  handleZoomIn?: () => void;
  handleZoomOut?: () => void;
  inEditableView?: boolean;
  onEmptySpaceClick?: DiagramAction;
  preventClicks?: boolean;
  businessUnit?: MachineBusinessUnit | number;
  rootImage?: boolean;
}

export default function SubAssemblyGallery({
  partDiagrams,
  onClick,
  parts,
  currentZoom,
  currentSlide,
  setCurrentSlide,
  handleZoomIn,
  handleZoomOut,
  inEditableView,
  onEmptySpaceClick,
  preventClicks,
  businessUnit,
  rootImage
}: Props): ReactElement {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore>();
  const [swiper100, setSwiper100] = useState<SwiperCore>();

  if (currentSlide && currentSlide >= 0) {
    swiper100?.slideTo(currentSlide);
  }
  return (
    <GalleryContainer>
      {partDiagrams && partDiagrams.length > 0 ? (
        <>
          <ThumbsContainer>
            <Swiper
              scrollbar
              mousewheel={true}
              modules={[Mousewheel, Pagination, Scrollbar]}
              slidesPerView={'auto'}
              freeMode={false}
              watchSlidesProgress={true}
              onSwiper={(swiper) => {
                setThumbsSwiper(swiper);
              }}
              onClick={() => {
                thumbsSwiper?.clickedIndex != undefined &&
                  setCurrentSlide &&
                  setCurrentSlide(thumbsSwiper?.clickedIndex);
              }}
              speed={10}
            >
              {drawThumbSwiperSlide(partDiagrams)}
            </Swiper>
            <PositionContainer>
              {currentSlide != undefined ? currentSlide + 1 : ''} / {partDiagrams.length}
            </PositionContainer>
            {partDiagrams.length >= 1 &&
              drawZoomControls(
                businessUnit,
                rootImage,
                currentZoom,
                handleZoomIn,
                handleZoomOut,
                partDiagrams.length,
                inEditableView
              )}
          </ThumbsContainer>
          <Swiper
            id="swiper"
            scrollbar
            mousewheel={false}
            modules={[Pagination, Scrollbar]}
            // slidesPerView={'auto'}
            freeMode={false}
            watchSlidesProgress={true}
            thumbs={{ swiper: thumbsSwiper }}
            slidesPerView={1}
            spaceBetween={16}
            touchMoveStopPropagation={false}
            preventClicks={false}
            preventClicksPropagation={false}
            noSwiping={currentZoom === 150}
            noSwipingClass="swiper-slide"
            onSwiper={(swiper) => {
              setSwiper100(swiper);
            }}
            onSlideChange={(swiper) => {
              setCurrentSlide && setCurrentSlide(swiper?.activeIndex);
            }}
          >
            {DrawSwiperSlideAssembly(
              partDiagrams,
              onClick,
              parts,
              false,
              currentZoom,
              inEditableView,
              onEmptySpaceClick,
              preventClicks
            )}
          </Swiper>
        </>
      ) : (
        <Loader />
      )}
    </GalleryContainer>
  );
}

function DrawSwiperSlideAssembly(
  partDiagrams: Resource[],
  onClick?: DiagramBubbleAction,
  parts?: Part[],
  zoomedOut?: boolean,
  currentZoom?: number,
  inEditableView?: boolean,
  onEmptySpaceClick?: DiagramAction,
  preventClicks?: boolean
): React.ReactNode {
  return partDiagrams.map((diagram, i) => {
    return (
      <SwiperSlide key={i}>
        {currentZoom === 150 ? (
          <SubAssemblyZoom
            diagram={diagram}
            onClick={onClick}
            parts={parts}
            i={i}
            zoomedOut={zoomedOut}
            currentZoom={currentZoom}
            inEditableView={inEditableView}
            onEmptySpaceClick={onEmptySpaceClick}
            preventClicks={preventClicks}
          />
        ) : (
          <DiagramOuterContainer zoomedOut={zoomedOut}>
            <DiagramContainer zoomedOut={zoomedOut}>
              <SubAssembly
                {...diagram}
                onClick={(bubble, event, bubbleBaseRef, part, _, bubbleEditId) => {
                  if (onClick)
                    onClick(bubble, event, bubbleBaseRef, part, diagram as Resource, bubbleEditId);
                }}
                parts={parts}
                inEditableView={inEditableView}
                onEmptySpaceClick={(event, width, height) => {
                  if (onEmptySpaceClick)
                    onEmptySpaceClick(event, width, height, diagram as Resource);
                }}
                preventClicks={preventClicks}
              />
            </DiagramContainer>
          </DiagramOuterContainer>
        )}
      </SwiperSlide>
    );
  });
}

function drawThumbSwiperSlide(partDiagrams: Resource[]): React.ReactNode {
  return partDiagrams.map((diagram, i) => (
    <SwiperSlide key={i}>
      <ThumbImage>
        <img src={diagram.url} onError={handleImgError} />
      </ThumbImage>
    </SwiperSlide>
  ));
}

function drawZoomControls(
  businessUnit?: MachineBusinessUnit | number,
  rootImage?: boolean,
  currentZoom?: number,
  handleZoomIn?: () => void,
  handleZoomOut?: () => void,
  diagramPageCount?: number,
  inEditableView?: boolean
): React.ReactNode {
  const disabledZoomOut =
    (inEditableView && currentZoom && currentZoom <= 100) ||
    currentZoom === 50 ||
    (currentZoom === 100 && diagramPageCount == 1);
  const restrictedBU: (MachineBusinessUnit | number | undefined)[] = [5, 6];
  return (
    <>
      {!rootImage && (
        <ZoomControlsContainer>
          <Button
            variant="inline-link"
            onClick={handleZoomOut}
            disabled={disabledZoomOut}
            style={{ backgroundColor: 'transparent', border: 'none' }}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlassMinus}
              color={disabledZoomOut ? theme.colors.lightGrey3 : theme.colors.darkGrey}
            />
          </Button>
          <Typography
            variant="stepheading"
            style={{ marginLeft: '0.75rem', paddingBottom: '1rem' }}
          >
            {currentZoom}%
          </Typography>
          <Button
            variant="inline-link"
            onClick={handleZoomIn}
            disabled={rootImage && restrictedBU.includes(businessUnit)}
            style={{ backgroundColor: 'transparent', border: 'none' }}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlassPlus}
              color={
                (rootImage && restrictedBU.includes(businessUnit)) ||
                (currentZoom && currentZoom > 100)
                  ? theme.colors.lightGrey3
                  : theme.colors.darkGrey
              }
            />
          </Button>
        </ZoomControlsContainer>
      )}
    </>
  );
}
