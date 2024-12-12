// 3rd party
import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';

// Components
import { Button, Loader, SubAssemblyGallery, Switch as ToggleSwitch, Typography } from 'components';
import { default as BubbleEditsModal } from './BubbleEditsModal';
import { default as BubbleHelpModal } from './BubbleHelpModal';
import { default as EditBubbleModal } from './EditBubbleModal';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';

// Types
import { DiagramHistory, EditedBubbleRecord, PreviousEditRecord } from 'types/machine-management';
import { DiagramAction, DiagramBubbleAction, Part } from 'types/parts';
import { Bubble, BubbleWithMatchingEdit, Id, ImageResource, Resource, ResourceType } from 'types';

// Helpers
import { isBetween } from './utils';

// Styling
const Container = styled.div`
  min-height: 24rem;
  height: 100%;
  border: 0.0625rem solid ${(props) => props.theme.colors.lightMediumGrey};
  border-radius: 0.625rem;
  padding: 2.25rem 1rem 1rem 1rem;
  overflow: auto;
  position: relative;
  flex-grow: 1;
  background-color: ${(props) => props.theme.colors.white};
`;

const ControlsContainer = styled.div`
  position: absolute;
  padding-right: 1.25rem;
  width: calc(100% - 1.25rem);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  top: 0;
  margin-top: 0.5rem;

  & > * {
    margin-left: 1rem;
    flex-shrink: 0;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
`;

const Breadcrumbs = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
`;

const Breadcrumb = styled.div`
  cursor: pointer;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  font-weight: 700;
  margin-right: 0.5rem;

  &:last-child {
    margin-right: 0;
  }
`;

const DiagramContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 15rem;
  overflow: auto;
`;

const LegendContainer = styled.div`
  bottom: 0.5rem;
  width: calc(100% - 1.25rem);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 1rem 1.25rem 0.8rem 0rem;
  z-index: 2;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.6875rem;

  &:last-child {
    margin-right: 0;
  }
`;

type BubbleVariant =
  | 'purchasable-part'
  | 'unpurchasable-part'
  | 'undetected'
  | 'assembly'
  | 'not-in-bom'
  | 'user-edit';

interface LegendColor {
  variant: BubbleVariant;
  borderColor?: string;
}
const LegendBubble = styled.div<LegendColor>`
  width: 0.9375rem;
  height: 0.9375rem;
  border-radius: 0.46875rem;
  margin-right: 0.75rem;
  background-color: ${({ theme, variant }) =>
    variant === 'purchasable-part'
      ? theme.colors.mediumBlue
      : variant === 'unpurchasable-part'
      ? theme.colors.lightGrey5
      : variant === 'assembly'
      ? theme.colors.onTrackGreen2
      : variant === 'not-in-bom'
      ? theme.colors.atRiskYellow2
      : variant === 'user-edit'
      ? theme.colors.extendedPalettePurple2
      : 'transparent'};
  border: solid 0.25rem
    ${({ theme, variant }) => (variant === 'undetected' ? theme.colors.mediumGrey1 : 'transparent')};
`;

const LegendLabel = styled.div`
  font-size: 0.75rem;
  line-height: 1.5;
  font-weight: 500;
  color: #1e1e1e;
`;

const LegendBubbleItem = ({
  label,
  variant
}: {
  label: string;
  variant: BubbleVariant;
}): JSX.Element => {
  return (
    <LegendItem>
      <LegendBubble variant={variant} />
      <LegendLabel>{label}</LegendLabel>
    </LegendItem>
  );
};

// Component properties
interface DiagramViewProps {
  parts?: Part[];
  childParts?: Part[];
  bubbleEdits?: EditedBubbleRecord[];
  availableSkus?: Set<string>;
  onBubbleClick?: DiagramBubbleAction;
  onEmptySpaceClick?: DiagramAction;
  selectedBubble?: Bubble;
  selectedPart?: Part;
  handleBubbleChange: (bubble: Bubble, partSku: string) => void;
  deselectBubbleAndPart: () => void;
  diagramHistory: DiagramHistory;
  updateDiagramHistory: (diagramStateIndex: number) => void;
  triggerRefresh?: () => void;
  allMachineParts?: Part[];
  getCurrentSlide: (slide: number) => void;
}

export const DiagramView = ({
  parts,
  childParts,
  bubbleEdits,
  availableSkus,
  onBubbleClick,
  onEmptySpaceClick,
  selectedBubble,
  selectedPart,
  handleBubbleChange,
  deselectBubbleAndPart,
  diagramHistory,
  updateDiagramHistory,
  triggerRefresh,
  allMachineParts,
  getCurrentSlide
}: DiagramViewProps): JSX.Element => {
  const theme = useTheme();
  const [inEditMode, setInEditMode] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [currentZoom, setCurrentZoom] = useState<number>(100);
  const [showAllEditsModal, setShowAllEditsModal] = useState<boolean>(false);

  //required to get parts of current slide image
  useEffect(() => {
    getCurrentSlide(currentSlide);
  }, [currentSlide]);
  // Grab the assets from the parts
  let resources: Resource[] = [];
  parts?.forEach((part) => {
    if (part.assets) resources = resources.concat(part.assets as Resource[]);
  });
  const imageResources: ImageResource[] = resources.filter(
    (resource) => resource.type === ResourceType.MarkedImage
  );
  // Variables to help retain context instead of reiterating over arrays
  let defaultRadius = 45;
  const editIdsWithBubbles: Record<Id, BubbleWithMatchingEdit> = {};

  // Filter fown the relevant bubble edit records by whether relate to current child parts or pages
  const relevantBubbleEdits: EditedBubbleRecord[] = bubbleEdits
    ? bubbleEdits.filter((edit) => {
        const relatesToChildPart =
          edit.partId && childParts
            ? childParts.findIndex((childPart) => childPart.id === edit.partId) > -1
            : false;
        const relatesToResource = edit.resourceId
          ? imageResources.findIndex((resource) => resource.id === edit.resourceId) > -1
          : false;

        return relatesToChildPart || relatesToResource;
      })
    : [];

  // Add bubble edits to the resources bubbles (inline) so they can be passed easily to the SubAssembly
  const resourcesWithBubbleEdits = imageResources.map((resource) => {
    const editsForResource = relevantBubbleEdits.filter((edit) => edit.resourceId === resource.id);
    // A list to help track which edits were related to current bubbles
    const unfoundEditIds = editsForResource.map((edit) => edit.id);

    // Add edits to existing bubbles
    const updatedBubbles: Bubble[] = resource.markers
      ? resource.markers.map((bubble) => {
          // Set the default radius so unfound edits have similar size to current bubbles
          defaultRadius = bubble.radius;
          // Check if there is a bubble edit that matches the
          const editRecord: EditedBubbleRecord | undefined = editsForResource.find((edit) => {
            return edit.bubbleId
              ? edit.bubbleId === bubble.id
              : isBetween(edit.x, bubble.x - bubble.radius, bubble.x + bubble.radius) &&
                  isBetween(edit.y, bubble.y - bubble.radius, bubble.y + bubble.radius);
          });

          // Remove the edit from the IDs list if it was found
          if (editRecord) {
            const index = unfoundEditIds.findIndex((editId) => editId === editRecord.id);
            if (index > -1) {
              // Remove this ID
              unfoundEditIds.splice(index, 1);
            }
          }

          // Check if the edit's values are already present
          const indicesMatch = editRecord
            ? editRecord.newIndex
              ? editRecord.newIndex === bubble.index
              : editRecord.oldIndex
              ? editRecord.oldIndex === bubble.index
              : false
            : false;

          const coordinatesMatch = editRecord
            ? isBetween(editRecord.x, bubble.x - bubble.radius, bubble.x + bubble.radius) &&
              isBetween(editRecord.y, bubble.y - bubble.radius, bubble.y + bubble.radius)
            : false;

          const correspondingPart = childParts?.find((part) => {
            return (
              // If the bubble has a part ID (i.e. not missing in BOM)
              bubble.partUuid &&
              part.sku ===
                (editRecord && editRecord.newSku
                  ? editRecord.newSku
                  : editRecord && editRecord.oldSku
                  ? editRecord.oldSku
                  : undefined)
            );
          });
          const partsMatch = !!correspondingPart;

          const dataMatches = indicesMatch && coordinatesMatch && partsMatch;

          if (editRecord) {
            // Add a new entry to the variable tracking edits to bubbles
            editIdsWithBubbles[editRecord.id] = {
              ...bubble,
              matchesEdit: dataMatches
            };
          }

          return {
            ...bubble,
            bubbleEditId: editRecord && !dataMatches ? editRecord.id : undefined
          };
        })
      : [];

    // Add bubbles for edits that were not matched
    const isEdit = (item: EditedBubbleRecord | undefined): item is EditedBubbleRecord => {
      return !!item;
    };
    const unfoundEdits = unfoundEditIds
      .map((editId) => editsForResource.find((edit) => edit.id === editId))
      .filter(isEdit);

    const newBubbles: Bubble[] = unfoundEdits.map((unfoundEdit) => {
      const correspondingPart = childParts?.find((part) =>
        unfoundEdit.newSku
          ? part.sku === unfoundEdit.newSku
          : unfoundEdit.oldSku
          ? part.sku === unfoundEdit.oldSku
          : false
      );
      return {
        // Bubble ID is necessary so, adding string to help
        // logically separate it from an existing bubble
        id: `edit-${unfoundEdit.id}`,
        index: unfoundEdit.newIndex
          ? unfoundEdit.newIndex
          : unfoundEdit.oldIndex
          ? unfoundEdit.oldIndex
          : '',
        x: unfoundEdit.x,
        y: unfoundEdit.y,
        radius: defaultRadius,
        missingInBom: unfoundEdit.missingInBom,
        bubbleEditId: unfoundEdit.id,
        partUuid: correspondingPart ? correspondingPart.id : undefined
      };
    });

    return {
      ...resource,
      markers: updatedBubbles.concat(newBubbles)
    };
  });

  // Get the current page of the diagram's ID
  const currentPageId = resourcesWithBubbleEdits[currentSlide]
    ? resourcesWithBubbleEdits[currentSlide].id
    : undefined;

  // Add the part description to bubble edits, where possible
  const editsWithPartDescriptions: PreviousEditRecord[] =
    currentPageId !== undefined
      ? relevantBubbleEdits
          // Filter out edits not on the page in view
          .filter((edit) => edit.resourceId === currentPageId)
          // Filter to ensure they are unique
          .filter(
            (edit, index, currentEdits) =>
              currentEdits.findIndex((filteredEdit) => filteredEdit.id === edit.id) === index
          )
          // Filter out any that match the existing bubbles
          .filter(
            (edit) =>
              !(
                Object.keys(editIdsWithBubbles).includes(edit.id) &&
                editIdsWithBubbles[edit.id].matchesEdit
              )
          )
          .map((edit) => {
            const oldPart = edit.oldSku
              ? childParts?.find((child) => child.sku === edit.oldSku)
              : undefined;
            const newPart = edit.newSku
              ? childParts?.find((child) => child.sku === edit.newSku)
              : undefined;
            const existingBubble = Object.keys(editIdsWithBubbles).includes(edit.id)
              ? editIdsWithBubbles[edit.id]
              : undefined;
            const assembly = allMachineParts?.find((part) => part.sku === edit.parentSku);
            return {
              ...edit,
              oldPartDesc: oldPart ? oldPart.description : undefined,
              newPartDesc: newPart ? newPart.description : undefined,
              radius: defaultRadius,
              bubbleId: existingBubble?.id,
              assemblySku: assembly ? assembly.sku : undefined,
              assemblyDesc: assembly ? assembly.description : undefined
            };
          })
      : [];

  const handleEmptySpaceClick: DiagramAction = (
    event: React.MouseEvent,
    width?: number,
    height?: number,
    diagram?: Resource
  ) => {
    if (!showEditModal && inEditMode && onEmptySpaceClick) {
      setShowEditModal(true);
      onEmptySpaceClick(event, width, height, diagram);
    }
  };

  const handleBubbleClick: DiagramBubbleAction = (
    marker: Bubble,
    event: React.MouseEvent,
    bubbleBaseRef: React.MutableRefObject<null>,
    part?: Part,
    diagram?: Resource,
    bubbleEditId?: Id
  ) => {
    if (!showEditModal && onBubbleClick) {
      if (!part?.isAssembly && inEditMode) {
        setShowEditModal(true);
        onBubbleClick(marker, event, bubbleBaseRef, part, diagram, bubbleEditId);
      } else if (part?.isAssembly) {
        onBubbleClick(marker, event, bubbleBaseRef, part, diagram, bubbleEditId);
      }
    }
  };

  // Zoom change handlers
  const handleZoomIn = () => {
    if (currentZoom === 50) setCurrentZoom(100);
    else if (currentZoom === 100) setCurrentZoom(150);
  };
  const handleZoomOut = () => {
    if (resources.length > 1 && currentZoom === 100) setCurrentZoom(50);
    else if (currentZoom === 150) setCurrentZoom(100);
  };

  return (
    <Container>
      <DiagramContainer
        onClick={() => {
          if (showEditModal) {
            setShowEditModal(false);
            deselectBubbleAndPart();
          }
        }}
      >
        {parts && resources ? (
          <SubAssemblyGallery
            parts={childParts}
            partDiagrams={resourcesWithBubbleEdits}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            onClick={!showEditModal ? handleBubbleClick : undefined}
            inEditableView={true}
            onEmptySpaceClick={!showEditModal && inEditMode ? handleEmptySpaceClick : undefined}
            preventClicks={!inEditMode || showEditModal}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            currentZoom={currentZoom}
          />
        ) : (
          <Loader />
        )}
      </DiagramContainer>
      <ControlsContainer>
        <Breadcrumbs>
          {diagramHistory.map((_, i) => {
            const label = i === 0 ? `Root` : `<  Level-${i}`;
            return (
              <Breadcrumb key={i} onClick={() => updateDiagramHistory(i)}>
                {label}
              </Breadcrumb>
            );
          })}
        </Breadcrumbs>
        <FontAwesomeIcon
          fontSize="1.5rem"
          icon={faCircleQuestion}
          style={{ cursor: 'pointer' }}
          role="button"
          onClick={() => setShowHelpModal(true)}
        />
        <ToggleContainer>
          <Typography
            variant="modelheading"
            style={{ marginRight: '0.75rem', marginBottom: 0 }}
          >{`Turn ${inEditMode ? 'off' : 'on'} edit mode`}</Typography>
          <ToggleSwitch
            checked={inEditMode}
            onChange={(checked) => setInEditMode(checked)}
            offColor={theme.colors.mediumGrey2}
            offHandleColor={theme.colors.mediumGrey1}
            onColor={theme.colors.mediumBlue}
            onHandleColor={theme.colors.mediumBlue3}
            height={16}
            width={32}
          />
        </ToggleContainer>
        {editsWithPartDescriptions.length > 0 && (
          <Button width="10.5625rem" onClick={() => setShowAllEditsModal(true)}>
            Show Previous Edits
          </Button>
        )}
      </ControlsContainer>
      <LegendContainer>
        <LegendBubbleItem label="Purchasable part" variant="purchasable-part" />
        <LegendBubbleItem label="Not purchasable" variant="unpurchasable-part" />
        <LegendBubbleItem label="No bubble detected" variant="undetected" />
        <LegendBubbleItem label="Parent assembly" variant="assembly" />
        <LegendBubbleItem label="Not linked to part" variant="not-in-bom" />
        <LegendBubbleItem label="Previous user edits" variant="user-edit" />
      </LegendContainer>
      <BubbleHelpModal
        visible={showHelpModal}
        handleClose={() => {
          setShowHelpModal(false);
        }}
      />
      <EditBubbleModal
        visible={showEditModal}
        handleClose={() => {
          deselectBubbleAndPart();
          setShowEditModal(false);
        }}
        handleSubmit={handleBubbleChange}
        selectedBubble={selectedBubble}
        selectedPart={selectedPart}
        availableSkus={availableSkus}
        bubbleEdit={
          selectedBubble && selectedBubble.bubbleEditId && bubbleEdits
            ? bubbleEdits.find((edit) => selectedBubble.bubbleEditId === edit.id)
            : undefined
        }
      />
      <BubbleEditsModal
        visible={showAllEditsModal}
        handleClose={(shouldRefresh) => {
          setShowAllEditsModal(false);
          if (shouldRefresh && triggerRefresh) {
            triggerRefresh();
          }
        }}
        bubbleEdits={editsWithPartDescriptions}
      />
    </Container>
  );
};
