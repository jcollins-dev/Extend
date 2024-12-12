import React, { useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { SubAssembly } from 'components';
import { Resource } from 'types';
import { DiagramAction, DiagramBubbleAction, Part } from 'types/parts';
import {
  BlueBoxContainer,
  MiniPictureContainer,
  DiagramOuterContainer,
  DiagramContainer
} from './SubAssemblyGallery';

interface Props {
  diagram?: Resource | undefined;
  onClick?: DiagramBubbleAction | undefined;
  parts?: Part[];
  currentZoom?: number;
  i?: number;
  zoomedOut?: boolean;
  inEditableView?: boolean;
  onEmptySpaceClick?: DiagramAction;
  preventClicks?: boolean;
}

export default function SubAssemblyZoom({
  diagram,
  onClick,
  parts,
  currentZoom,
  i,
  zoomedOut,
  inEditableView,
  onEmptySpaceClick,
  preventClicks
}: Props): JSX.Element {
  const [blueBoxSize, setBlueBoxSize] = useState({ width: 7, height: 7 });
  const [blueBoxPosition, setBlueBoxPosition] = useState({ top: 7, right: 10 + 7 * 0.67 });
  const [miniImageSize, setMiniImageSize] = useState({ width: 0, height: 0 });
  const [diagramSize, setDiagramSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    //mini Image is 20% of big image
    const miniImage = {
      width: diagramSize.width * 0.2,
      height: diagramSize.height * 0.2
    };
    setMiniImageSize(miniImage);
    setBlueBoxSize({
      width: miniImage.width * 0.67,
      height: miniImage.height * 0.67
    });
    setBlueBoxPosition({ ...blueBoxPosition, right: miniImage.width / 3 + 10 });
  }, [diagramSize]);
  return (
    <div style={{ height: '100%' }}>
      <BlueBoxContainer
        height={blueBoxSize.height}
        width={blueBoxSize.width}
        top={blueBoxPosition.top}
        right={blueBoxPosition.right}
      ></BlueBoxContainer>
      <MiniPictureContainer width={diagramSize.width * 0.2} height={diagramSize.height * 0.2}>
        <SubAssembly
          {...(diagram as Resource)}
          parts={parts}
          preventClicks={preventClicks}
          inEditableView={inEditableView}
        />
      </MiniPictureContainer>
      <TransformWrapper
        onPanning={(e) => {
          const calculatedTop = 10 + e.state.positionY * 0.2 * -1;
          let tempPosition = blueBoxPosition;

          if (e.state.positionY > 0) {
            tempPosition = { ...tempPosition, top: 10 };
          } else if (calculatedTop + blueBoxSize.height <= miniImageSize.height + 10) {
            tempPosition = { ...tempPosition, top: calculatedTop };
          }
          const positionZero = 10 + miniImageSize.width - blueBoxSize.width;
          const calculatedRight = positionZero + e.state.positionX * 0.2;

          if (e.state.positionX >= 0) {
            tempPosition = { ...tempPosition, right: positionZero };
          } else if (calculatedRight < 10) {
            tempPosition = { ...tempPosition, right: 10 };
          } else {
            tempPosition = { ...tempPosition, right: calculatedRight };
          }
          setBlueBoxPosition(tempPosition);
        }}
        initialPositionX={0}
        initialPositionY={0}
        initialScale={currentZoom ? currentZoom / 100 : 1}
        minScale={currentZoom ? currentZoom / 100 : 1}
        maxScale={currentZoom ? currentZoom / 100 : 1}
        key={i}
      >
        <TransformComponent>
          <DiagramOuterContainer zoomedOut={zoomedOut} pan={true}>
            <DiagramContainer zoomedOut={zoomedOut}>
              <SubAssembly
                {...(diagram as Resource)}
                onClick={onClick}
                parts={parts}
                setDiagramSize={setDiagramSize}
                preventClicks={preventClicks}
                onEmptySpaceClick={onEmptySpaceClick}
                inEditableView={inEditableView}
              />
            </DiagramContainer>
          </DiagramOuterContainer>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
