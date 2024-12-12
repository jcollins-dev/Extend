// 3rd party
import React, { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useWizard } from 'react-use-wizard';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { toast } from 'react-toastify';

// Components
import { Button } from 'components';
import { PartsList } from './PartsList';
import { DiagramView } from './DiagramView';

// Constants
import { JBTRoutes } from 'constants/routes';

// API
import {
  useAddBubbleMutation,
  useLazyGetMachineOnboardingPartsByIdsQuery,
  useGetPartHierarchyQuery,
  useGetPartsWithoutBubblesQuery,
  useUpdateBubbleMutation,
  useGetPartsInBomNotLinkedToERPQuery,
  useGetBubbleEditsForMachineQuery
} from 'api';

// Types
import { DiagramHistory, OnboardingMachine, PartNode } from 'types/machine-management';
import { DiagramAction, Part } from 'types/parts';
import { Bubble, Id, ImageResource, Resource } from 'types';
import { APIError } from 'types/errors';

// Styling
const RootContainer = styled.div`
  width: 100%;
`;

interface ContentContainerProps {
  pxFromTop?: number;
}
const ContentContainer = styled.div<ContentContainerProps>`
  width: 100%;
  height: ${(props) => (props.pxFromTop ? `calc(100vh - ${props.pxFromTop / 16}rem)` : '80vh')};
  display: flex;
  padding: 1.875rem 1.825rem 1.125rem 2.375rem;

  & > div:first-child {
    margin-right: 1.25rem;
    width: 21.5625rem;
    flex-shrink: 0;
  }
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

// Component properties
interface AddBubbleProps {
  machine?: OnboardingMachine;
}

export const AddBubbles = ({ machine }: AddBubbleProps): JSX.Element => {
  const theme = useTheme();
  // Element top variables
  const [pxFromTop, setPxFromTop] = useState<number>(0);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elRef && elRef.current) {
      setPxFromTop(elRef.current.offsetTop);
    }
  }, [elRef]);
  // Part state variables
  const [rootPartIds, setRootPartIds] = useState<string[]>([]);
  const [allPartIds, setAllPartIds] = useState<string[]>([]);
  const [activePartIds, setActivePartIds] = useState<string[]>([]);
  const [activeParts, setActiveParts] = useState<Part[]>([]);
  const [activePartChildren, setActivePartChildren] = useState<PartNode[]>([]);
  const [currentSlide, setCurrentSlide] = useState(-1);
  const [selectedBubble, setSelectedBubble] = useState<Bubble>();
  const [selectedPart, setSelectedPart] = useState<Part>();
  const [selectedDiagram, setSelectedDiagram] = useState<Resource>();
  const [refreshNeeded, setRefreshNeeded] = useState<boolean>(false);
  const [diagramHistory, setDiagramHistory] = useState<DiagramHistory>([]);

  // API calls
  const {
    data: partHierarchy,
    isFetching: isFetchingPartHierarchy /*,
    error: partHierarchyError*/
  } = useGetPartHierarchyQuery(machine ? { machineId: machine.id } : skipToken);
  const {
    data: partsWithoutBubbles /*,
    isFetching: isFetchingPartsWithoutBubbles,
    error: partsWithoutBubbleError*/
  } = useGetPartsWithoutBubblesQuery(machine ? { machineId: machine.id } : skipToken);
  const [getPartsTrigger, { data: allParts, isFetching: fetchingParts }] =
    useLazyGetMachineOnboardingPartsByIdsQuery();
  const { data: partsInBomNotInErp } = useGetPartsInBomNotLinkedToERPQuery(
    machine ? machine.id : skipToken
  );
  const { data: bubbleEdits } = useGetBubbleEditsForMachineQuery(
    machine ? { machineId: machine.id } : skipToken
  );
  // Creation and update calls
  const [addBubble] = useAddBubbleMutation();
  const [updateBubble] = useUpdateBubbleMutation();

  // Determine the root parts
  useEffect(() => {
    if (partHierarchy) {
      const rootParts = Object.values(partHierarchy).filter(
        (part) => part.parentSku?.toLowerCase() === 'none'
      );

      setRootPartIds(rootParts.map((part) => part.id));
      // Initialize the active parts as the root parts
      setActivePartIds(rootParts.map((part) => part.id));

      // All part IDs
      const allIdsSet = new Set<string>();
      // Function to traverse the parts
      const traversePartHierarchy = (partNode: PartNode) => {
        allIdsSet.add(partNode.id);
        if (partNode.children) {
          partNode.children.map((childNode) => traversePartHierarchy(childNode));
        }
      };
      Object.values(partHierarchy).forEach((partNode) => {
        traversePartHierarchy(partNode);
      });
      setAllPartIds(Array.from(allIdsSet));
    }
  }, [partHierarchy]);

  // Retrieve the current parts being viewed in the hierarchy
  useEffect(() => {
    if (machine && !isFetchingPartHierarchy) {
      getPartsTrigger({
        subParts: false,
        onlyImages: false,
        flagAssemblies: true,
        includeResources: true,
        machineId: machine ? machine.id : undefined,
        businessUnitId: machine ? machine.businessUnitId : undefined
      })
        .unwrap()
        .then((retrievedParts) => {
          if (retrievedParts) {
            setRefreshNeeded(false);
          }
        });
    }
  }, [machine, isFetchingPartHierarchy, refreshNeeded]);

  // Active parts use effect to help reload when changes are made
  useEffect(() => {
    if (!fetchingParts) {
      // Get the active parts
      const initialActiveParts =
        allParts && allPartIds
          ? activePartIds.map((partId) => allParts.find((part) => part.id === partId))
          : [];
      const newActiveParts = initialActiveParts.filter(
        (part: Part | undefined): part is Part => !!part
      );
      setActiveParts(newActiveParts);
    }
  }, [allParts, allPartIds, activePartIds, fetchingParts]);

  // Set the active part IDs when the diagram history is updated
  useEffect(() => {
    if (rootPartIds) {
      if (diagramHistory.length === 0) setActivePartIds(rootPartIds);
      else setActivePartIds(diagramHistory[diagramHistory.length - 1]);
    }
  }, [diagramHistory, rootPartIds]);

  useEffect(() => {
    let parts: PartNode[] = [];

    if (partHierarchy && activeParts[currentSlide]) {
      const partHierarchyKeys = Object.keys(partHierarchy);
      const currentPartSku = activeParts[currentSlide].sku;
      let key = '';
      for (const k of partHierarchyKeys) {
        if (k.toLowerCase() === currentPartSku || k.toUpperCase() === currentPartSku) {
          key = k;
          break;
        }
      }
      if (key && partHierarchy[key]?.children) {
        console.log('partHierarchy[key]?.children : ', partHierarchy[key]?.children);
        partHierarchy[key]?.children?.forEach((part) => {
          const pn = {
            description: part.description,
            sku: part.sku,
            hasBubble: part.hasBubble
          } as PartNode;
          parts = [...parts, pn];
        });
        setActivePartChildren(parts);
      }
    }
  }, [currentSlide, activeParts]);

  const { goToStep } = useWizard();
  const handleBubbleClick = (
    marker: Bubble,
    event: React.MouseEvent,
    bubbleBaseRef: React.MutableRefObject<null>,
    part?: Part,
    diagram?: Resource,
    bubbleEditId?: Id
  ) => {
    // Dive deeper into the hierarchy if it is an assembly
    if (part?.isAssembly && marker.partUuid) {
      const copyDiagramState = [...diagramHistory];
      copyDiagramState.push([marker.partUuid]);
      setDiagramHistory([...copyDiagramState]);
    } else {
      setSelectedBubble({
        ...marker,
        bubbleEditId: bubbleEditId
      });
      if (part) setSelectedPart(part);
      if (diagram) setSelectedDiagram(diagram);
    }
  };
  const handleEmptySpaceClick: DiagramAction = (
    event: React.MouseEvent,
    width?: number,
    height?: number,
    diagram?: Resource
  ) => {
    // Get the bounds of the diagram element
    const elRect = event.currentTarget.getBoundingClientRect();
    // Get the scale of the original diagram size to the diagram element size
    // (using height works the same, since it is a uniform scale)
    const scale = width ? width / elRect.width : 0;

    // Adjust the mouse x and y based on the element's position on the page,
    // and scale by the calculated scale
    const newX = (event.clientX - elRect.x) * scale;
    const newY = (event.clientY - elRect.y) * scale;

    setSelectedBubble({ id: '', index: '', radius: 0, x: newX, y: newY });
    setSelectedDiagram(diagram);
  };

  const handleBubbleChange = (changedBubble: Bubble, partSku: string) => {
    if (selectedDiagram && machine) {
      // If it is a new bubble
      if (changedBubble.id === '') {
        const parentPart = activeParts.find((part) => part.id === selectedDiagram.parentId);
        if (parentPart) {
          addBubble({
            index: changedBubble.index,
            x: changedBubble.x,
            y: changedBubble.y,
            radius: changedBubble.radius,
            resourceId: selectedDiagram.id,
            sku: partSku,
            parentSku: parentPart.sku,
            machineId: machine.id
          })
            .unwrap()
            .then(() => {
              toast.success(`Bubble added successfully`);
              setRefreshNeeded(true);
            })
            .catch((error: APIError) => {
              const failMessage = `Bubble creation failed${
                error.data && error.data.detail ? `: ${error.data.detail}` : ''
              }`;
              toast.error(failMessage);
              console.error(error);
            });
        }
      } else if (selectedBubble) {
        updateBubble({
          id: selectedBubble.id,
          index: changedBubble.index,
          partSku: partSku,
          machineId: machine.id,
          radius: changedBubble.radius
        })
          .unwrap()
          .then(() => {
            toast.success(`Bubble updated successfully`);
            setRefreshNeeded(true);
          })
          .catch((error: { status: number; data?: { detail?: string } }) => {
            const failMessage = `Bubble update failed${
              error.data && error.data.detail ? `: ${error.data.detail}` : ''
            }`;
            toast.error(failMessage);
            console.error(error);
          });
      }
    }
  };
  const handleSlideChange = (slide: number): void => {
    setCurrentSlide(slide);
  };
  // Data transformation
  const skusWithoutBubbles = partsWithoutBubbles
    ? partsWithoutBubbles.map((partNode) => (partNode.sku ? partNode.sku : ''))
    : [];
  const availableSkus =
    partHierarchy && partsWithoutBubbles
      ? Object.keys(partHierarchy)
          .concat(skusWithoutBubbles)
          .filter((sku) => sku !== '')
      : [];

  // Filter active parts and reference active part children
  let activeChildIds: string[] = [];
  activeParts.forEach((part) => {
    if (part && part.assets) {
      part.assets.forEach((asset) => {
        const bubbles = (asset as ImageResource).markers;
        if (bubbles) {
          const bubblesWithParts = bubbles.filter((bubble) => bubble.partUuid);
          const bubblePartIds = bubblesWithParts.map((bubble) => bubble.partUuid);
          activeChildIds = activeChildIds.concat(
            bubblePartIds.filter((bubbleId: string | undefined): bubbleId is string => !!bubbleId)
          );
        }
      });
    }
    const partNode = part && partHierarchy ? partHierarchy[part.sku] : undefined;
    if (part && partNode && partNode.id === part.id && partNode.children) {
      activeChildIds = activeChildIds.concat(partNode.children.map((childNode) => childNode.id));
    }
  });

  const initialChildParts = allParts
    ? activeChildIds.map((childId) => allParts.find((part) => part.id === childId))
    : [];
  const activeChildParts: Part[] = initialChildParts.filter(
    (part: Part | undefined): part is Part => !!part
  );
  const activeChildPartsWithPurchasable =
    activeChildParts && partsInBomNotInErp
      ? activeChildParts.map((part) => {
          const isPurchasable = !(part.sku in partsInBomNotInErp);
          const adjustedPart = { ...part, isPurchasable: isPurchasable };
          return adjustedPart;
        })
      : activeChildParts;

  const diagramDataReady = !refreshNeeded && !fetchingParts && activeParts.length;
  return (
    <RootContainer>
      <ContentContainer ref={elRef} pxFromTop={pxFromTop}>
        <PartsList parts={activePartChildren} heading="Parts Without Bubbles" />
        <DiagramView
          parts={diagramDataReady ? activeParts : undefined}
          childParts={diagramDataReady ? activeChildPartsWithPurchasable : undefined}
          bubbleEdits={bubbleEdits}
          availableSkus={new Set(availableSkus)}
          onBubbleClick={handleBubbleClick}
          onEmptySpaceClick={handleEmptySpaceClick}
          selectedBubble={selectedBubble}
          selectedPart={selectedPart}
          handleBubbleChange={handleBubbleChange}
          deselectBubbleAndPart={() => {
            setSelectedBubble(undefined);
            setSelectedPart(undefined);
            setSelectedDiagram(undefined);
          }}
          diagramHistory={diagramHistory}
          updateDiagramHistory={(stateIndex: number) => {
            if (stateIndex === 0) setDiagramHistory([]);
            else if (stateIndex > 0 && stateIndex < diagramHistory.length)
              setDiagramHistory(diagramHistory.slice(0, stateIndex));
          }}
          triggerRefresh={() => {
            // Setting a timeout to prevent race condition for edit and part/bubble data
            setTimeout(() => setRefreshNeeded(true), 375);
          }}
          allMachineParts={allParts}
          getCurrentSlide={handleSlideChange}
        />
      </ContentContainer>
      <ButtonsContainer>
        <Button
          disabled={false}
          variant="thin"
          onClick={() => {
            window.location.assign(
              JBTRoutes.onboardingPage.replace(':machineId', machine?.id || '')
            );
          }}
        >
          Cancel
        </Button>
        <Button
          bgColor={theme.colors.mediumBlue}
          variant="primary"
          disabled={false}
          onClick={() => {
            goToStep(2);
          }}
        >
          Continue
        </Button>
      </ButtonsContainer>
    </RootContainer>
  );
};
