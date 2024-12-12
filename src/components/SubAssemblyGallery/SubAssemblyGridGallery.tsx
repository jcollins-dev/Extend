// 3rd party
import React, { ReactElement, ReactEventHandler, useState } from 'react';
import styled from 'styled-components';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.min.css';
import 'swiper/modules/grid/grid.min.css';

// import required modules
import SwiperCore from 'swiper';

// Components
import { Button, Loader, SubAssembly, Typography } from 'components';

// Types
import { Resource } from 'types';
import { Part } from 'types/parts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassMinus, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import theme from 'themes';

// Custom styling
const GalleryContainer = styled.div`
  width: 100%;
`;

const ThumbsContainer = styled.div`
  display: flex;
`;

interface ThumbProps {
  active?: boolean;
}

const ThumbImage = styled.div<ThumbProps>`
  width: 2.75rem !important;
  height: 2.75rem;
  margin-right: 0.625rem;
  opacity: ${({ active }) => (active ? 1.0 : 0.35)};

  &last-child {
    margin-right: 0;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ active }) => (active ? 'auto' : 'pointer')};
  object-fit: contain;
  border-radius: 0.3125rem;
  border: ${(props) => props.theme.colors.borders.nav.border};
  background-color: ${(props) => props.theme.colors.white};

  & img {
    display: block;
    width: 100%;
  }

  &:hover {
    opacity: 1;
  }
`;

const GridGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  cursor: grab;
  margin-top: 1rem;
`;

interface DiagramProps {
  zoomedOut?: boolean;
  active?: boolean;
}
const DiagramOuterContainer = styled.div<DiagramProps>`
  width: calc((100% / 2) - 1.5rem);
  margin-right: 1.5rem;
  margin-bottom: 1.5rem;
  cursor: ${({ zoomedOut }) => (zoomedOut ? 'zoom-in' : 'auto')};
  opacity: ${({ zoomedOut }) => (zoomedOut ? 0.65 : 1)};

  border: 0.0625rem solid ${() => theme.colors.lightGrey2};
  border-radius: 0.5rem;
  box-shadow: 0 0.625rem 0.9375rem rgba(0, 0, 0, 0.1), 0 0.25rem 0.375rem rgba(0, 0, 0, 0.05);

  &:hover {
    opacity: 1;
  }
`;

const DiagramContainer = styled.div<DiagramProps>`
  pointer-events: ${({ zoomedOut }) => (zoomedOut ? 'none' : 'auto')};
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
  itemsPerGroup?: number;
  partDiagrams?: Resource[] | null;
  parts?: Part[];
  currentZoom?: number;
  currentSlide?: number;
  setCurrentSlide?: React.Dispatch<React.SetStateAction<number>>;
  handleZoomIn?: () => void;
  handleZoomOut?: () => void;
}
// SubAssemblyGridGallery and SubAssemblyGallery split into two functions
// because reinitilizing Swiper when dynamic changes are made to its proeprties
// was non-trivial and just calling it as a different function worked
export default function SubAssemblyGridGallery({
  itemsPerGroup = 4,
  partDiagrams,
  parts,
  currentZoom,
  setCurrentSlide,
  handleZoomIn,
  handleZoomOut
}: Props): ReactElement {
  // Split the diagrams up into groups
  const groupCount = partDiagrams ? Math.ceil(partDiagrams.length / itemsPerGroup) : 0;
  const groups: [Resource[]] = [[]]; // Typescript will requires having the initial target
  if (groupCount > 0) {
    for (let i = 0; i < groupCount; i++) {
      if (i > 0) groups.push([]);
    }
    partDiagrams?.forEach((diagram, index) => {
      const groupIndex = Math.floor(index / itemsPerGroup);
      groups[groupIndex].push(diagram);
    });
  }

  const [currentGroup, setCurrentGroup] = useState<number>(0);
  const [swiper50, setSwiper50] = useState<SwiperCore>();
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const handleGroupClick = (groupIndex: number) => {
    if (groupIndex >= 0 && groupIndex < groups.length) {
      setCurrentGroup(groupIndex);
      if (swiper50) swiper50?.slideTo(groupIndex);
    }
  };

  // Do a custom build for this thing
  // Send 4 items in a slide at a time, giving each an index and an onclick handler
  // Generate the thumbnails without swiper
  return (
    <GalleryContainer>
      {partDiagrams && partDiagrams.length > 0 ? (
        <>
          <ThumbsContainer>
            {partDiagrams.map((diagram, i) => {
              const myGroupIndex = Math.floor(i / itemsPerGroup);
              return (
                <ThumbImage
                  key={i}
                  active={currentGroup === myGroupIndex}
                  onClick={() => {
                    if (currentGroup !== myGroupIndex) handleGroupClick(myGroupIndex);
                  }}
                >
                  <img src={diagram.url} onError={handleImgError} />
                </ThumbImage>
              );
            })}
            {drawZoomControls(currentZoom, handleZoomIn, handleZoomOut)}
          </ThumbsContainer>

          <div id="containerSwiperGrid">
            <Swiper
              id="swiperGrid"
              spaceBetween={16}
              touchMoveStopPropagation={false}
              preventClicks={false}
              preventClicksPropagation={false}
              loop={false}
              onSwiper={(swiper) => setSwiper50(swiper)}
              onSlideChange={(swiper) => {
                setSwiper50(swiper);
                setCurrentGroup(swiper.activeIndex);
              }}
              onTransitionStart={() => setIsSwiping(true)}
              onTransitionEnd={() => setIsSwiping(false)}
            >
              {groups.map((group, i) => (
                <SwiperSlide id={`group-${i}`} key={i}>
                  <GridGroup>
                    {group.map((diagram, j) => (
                      <DiagramOuterContainer
                        zoomedOut={true}
                        key={j}
                        onClick={() => {
                          if (!isSwiping) {
                            setCurrentSlide && setCurrentSlide(i * itemsPerGroup + j);
                            handleZoomIn && handleZoomIn();
                          }
                        }}
                      >
                        <DiagramContainer zoomedOut={true}>
                          <SubAssembly {...diagram} parts={parts} />
                        </DiagramContainer>
                      </DiagramOuterContainer>
                    ))}
                  </GridGroup>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </GalleryContainer>
  );
}

function drawZoomControls(
  currentZoom?: number,
  handleZoomIn?: () => void,
  handleZoomOut?: () => void
): React.ReactNode {
  return (
    <ZoomControlsContainer>
      <Button
        variant="inline-link"
        onClick={handleZoomOut}
        disabled={currentZoom === 50}
        style={{ backgroundColor: 'transparent', border: 'none' }}
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlassMinus}
          color={currentZoom === 50 ? theme.colors.lightGrey3 : theme.colors.darkGrey}
        />
      </Button>
      <Typography variant="stepheading" style={{ marginLeft: '0.75rem' }}>
        {currentZoom}%
      </Typography>
      <Button
        variant="inline-link"
        onClick={handleZoomIn}
        disabled={currentZoom === 100}
        style={{ backgroundColor: 'transparent', border: 'none' }}
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlassPlus}
          color={currentZoom === 100 ? theme.colors.lightGrey3 : theme.colors.darkGrey}
        />
      </Button>
    </ZoomControlsContainer>
  );
}
