// 3rd party libraries
import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

// Hooks
import { useQueryParams } from 'hooks';

// Types
import { Bubble, ImageResource, Machine, MachineBusinessUnit, Resource, ResourceType } from 'types';
import { Part } from 'types/parts';

// Components
import { PopUpCard, SubAssemblyGallery, SubAssemblyGridGallery } from 'components';
import { useGetPartsByIdsMutation } from 'api';
import PopUpPreviewCard from './PopUpPreviewCard';
import { traversePartTree, determineBackgroundColor, determineBubbleColor } from 'helpers/part';
import useWindowDimensions from 'hooks/useWindowDimensions';

const Container = styled.div`
  margin-bottom: 1.25rem;
  width: 100%;
  height: 100%;
`;

const SubAssemblyContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

// Component props
interface Props {
  machine?: Machine;
  assembly?: Part;
}

function determinePopUpOffset(
  clickLocationX: number,
  clickLocationY: number,
  screenWidth: number | null,
  screenHeight: number | null
) {
  if (screenWidth === null || screenHeight === null) {
    return {
      left: 500,
      top: 500
    };
  }
  let leftOffset = 0;
  let topOffset = 0;
  const adjustedX = clickLocationX - window.scrollX;
  const adjustedY = clickLocationY - window.scrollY;
  // apologies for the magic numbers here, these get
  // the pop up in rough position on 1080p displays
  if (adjustedX < 0.5 * screenWidth) {
    leftOffset = 18;
  } else if (adjustedX >= 0.5 * screenWidth) {
    leftOffset = -320;
  }

  if (adjustedY > 0.5 * screenHeight) {
    topOffset = -390;
  } else if (adjustedY <= 0.5 * screenHeight) {
    topOffset = 18;
  }
  return {
    left: clickLocationX + leftOffset,
    top: clickLocationY + topOffset
  };
}

export default function PartsAssembly({ machine, assembly }: Props): ReactElement {
  const history = useHistory();
  const query = useQueryParams();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [popUpX, setPopUpX] = useState<number>(0);
  const [popUpY, setPopUpY] = useState<number>(0);
  const [popUpPart, setPopUpPart] = useState<Part>();
  const [popUpMarker, setPopUpMarker] = useState<Bubble>();
  const [currentBubble, setCurrentBubble] = useState<React.MutableRefObject<null>>();
  const [partsForBubbles, setPartsForBubbles] = useState<Part[]>();
  const [currentZoom, setCurrentZoom] = useState<number>(100);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const [businessUnit, setBusinessUnit] = useState<MachineBusinessUnit | number | undefined>(
    machine?.businessUnit
  );
  const [assemblyState, setAssemblyState] = useState<boolean>(false);
  const [triggerParts, { isLoading: partsLoading }] = useGetPartsByIdsMutation();
  const handleOnClick = (
    marker: Bubble,
    event: React.MouseEvent,
    bubbleBaseRef: React.MutableRefObject<null>
  ) => {
    if (marker.partUuid) {
      const partForMarker = partsForBubbles?.find((p) => p.id === marker.partUuid);
      const { left, top } = determinePopUpOffset(
        event.pageX,
        event.pageY,
        screenWidth,
        screenHeight
      );

      //const targetAssembly = partsForBubbles?.find((p) => p.id === marker.partUuid);
      if (partForMarker && partForMarker.isAssembly && !partForMarker.isPurchasable) {
        traversePartTree(query, history, marker.index, marker.partLabel, partForMarker.id);
      } else {
        setShowPopUp(!showPopUp);
        setCurrentBubble(bubbleBaseRef);
        setPopUpX(left);
        setPopUpY(top);
        setPopUpPart(partForMarker);
        setPopUpMarker(marker);
      }
    }
    // TODO - error if not sub assembly or part id is not present
  };

  // Just take the first one until we can support multiple
  let assets = machine?.assets;
  if (assembly) {
    assets = assembly?.assets as Resource[];
  }
  let partIds: string[] = [];

  if (assets) {
    for (const asset of assets) {
      const a = asset as ImageResource;
      if (a.markers != undefined) {
        partIds = partIds.concat(a.markers.map((m: Bubble) => m.partUuid || ''));
      }
    }
    if (partIds.length === 0) {
      console.warn('No bubble data necessary.');
    }
  } else {
    console.warn('Machine/Assembly has no bubbles, therefore no bubble data can be loaded.');
    console.warn({ assets });
    console.warn({ machine });
    console.warn({ assembly });
    console.warn({ partIds });
  }

  // Make sure no empty strings get into the parts request
  partIds = partIds.filter((id) => id !== '');

  useEffect(() => {
    setPartsForBubbles(undefined);
  }, [assembly]);

  useEffect(() => {
    setBusinessUnit(machine?.businessUnit);
    setAssemblyState(() => assembly === undefined);
    if ((businessUnit == 5 || businessUnit == 6) && assemblyState) {
      setCurrentZoom(100);
    }
    if (
      (machine !== undefined || assembly !== undefined) &&
      partIds !== undefined &&
      !partsLoading &&
      partsForBubbles == undefined
    ) {
      triggerParts({
        uuids: partIds,
        subParts: false,
        onlyImages: true,
        flagAssemblies: true,
        machineId: machine !== undefined ? machine.id : undefined
      })
        .unwrap()
        .then((value) => {
          if (value !== undefined) {
            setPartsForBubbles(value);
          }
        })
        .catch((error) => {
          console.log(`Failed to retrieve parts for bubbles ${error}`);
        });
    }
  }, [partsLoading, partsForBubbles, machine, assembly]);

  const markedAssets = assets
    ? assets.filter((asset) => asset.type === ResourceType.MarkedImage)
    : undefined;
  const diagramPageCount = markedAssets?.length ? markedAssets.length : 0;

  const handleZoomIn = () => {
    if (currentZoom === 50) setCurrentZoom(100);
    else if (currentZoom === 100) setCurrentZoom(150);
  };
  const handleZoomOut = () => {
    if (diagramPageCount > 1 && currentZoom === 100) setCurrentZoom(50);
    else if (currentZoom === 150) setCurrentZoom(100);
  };

  useEffect(() => {
    setCurrentZoom(diagramPageCount == 1 ? 100 : 50);
  }, [diagramPageCount]);

  return (
    <Container>
      <PopUpCard
        show={showPopUp}
        setShowFunction={setShowPopUp}
        positionX={popUpX}
        positionY={popUpY}
        location={'left'}
        fitContent={true}
        backgroundColor={determineBackgroundColor(popUpPart)}
        bubbleColor={determineBubbleColor(popUpPart)}
        marker={popUpMarker}
        baseRef={currentBubble}
      >
        <PopUpPreviewCard
          onClickAssemblySubPart={(marker) => {
            if (marker) {
              const partForMarkerAssembly = partsForBubbles?.find((p) => p.id === marker.partUuid);
              if (partForMarkerAssembly) {
                setShowPopUp(false);
                traversePartTree(
                  query,
                  history,
                  marker.index,
                  marker.partLabel,
                  partForMarkerAssembly.id
                );
              }
            }
          }}
          show={showPopUp}
          setShowFunction={setShowPopUp}
          top={popUpY}
          left={popUpX}
          part={popUpPart}
          marker={popUpMarker}
        />
      </PopUpCard>
      <SubAssemblyContainer>
        {currentZoom == 50 && diagramPageCount > 1 ? (
          <SubAssemblyGridGallery
            itemsPerGroup={4}
            partDiagrams={markedAssets}
            parts={partsForBubbles}
            setCurrentSlide={setCurrentSlide}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            currentZoom={currentZoom}
          />
        ) : (
          <SubAssemblyGallery
            partDiagrams={markedAssets}
            onClick={handleOnClick}
            parts={partsForBubbles}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            currentZoom={currentZoom}
            businessUnit={businessUnit}
            rootImage={assemblyState}
          />
        )}
      </SubAssemblyContainer>
    </Container>
  );
}
