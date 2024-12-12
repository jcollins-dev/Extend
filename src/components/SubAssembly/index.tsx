// Third party
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

// Hooks
import { useImageSize } from 'hooks';

// Components
import { Loader } from 'components';
import ClickablePartBubble from '../ClickablePartBubble/ClickablePartBubble';

// Types
import { ImageResource } from 'types';
import { DiagramAction, DiagramBubbleAction, Part } from 'types/parts';

// Helpers
import { determineBubbleColor } from 'helpers/part';

// Component properties
interface SubAssemblyProps extends ImageResource {
  onClick?: DiagramBubbleAction;
  parts?: Part[];
  setDiagramSize?: React.Dispatch<
    React.SetStateAction<{
      width: number;
      height: number;
    }>
  >;
  inEditableView?: boolean;
  onEmptySpaceClick?: DiagramAction;
  preventClicks?: boolean;
}

interface Props {
  height?: number;
}

// Styling
const Root = styled.div<Props>`
  overflow: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  height: 100%; //${(props) => (props.height ? `${props.height / 16}rem` : '100%')};
  min-height: 15rem;
`;

const SubAssembly = ({
  url,
  markers,
  onClick,
  parts,
  setDiagramSize,
  inEditableView,
  onEmptySpaceClick,
  preventClicks
}: SubAssemblyProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const imageSize = useImageSize(url);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ratio, setRatio] = useState((imageSize?.width ?? 0) / (imageSize?.height ?? 1));

  useEffect(() => {
    if (imageSize) setRatio(imageSize.width / imageSize.height);

    return () => {
      setRatio(0);
    };
  }, [imageSize]);

  useEffect(() => {
    setDiagramSize &&
      setDiagramSize({
        width: size.width,
        height: size.height
      });
  }, [size]);

  // When the element ref is ready, calculate the width based on the image's aspect ratio
  useEffect(() => {
    let isMounted = true;

    // Helper function
    const getNewDimensions = (
      ref: React.RefObject<HTMLDivElement>,
      ratio: number
    ): { width: number; height: number } => {
      let newDimensions = { width: 0, height: 0 };
      if (ref.current) {
        const containerRatio = ref.current.clientWidth / ref.current.clientHeight;
        newDimensions = inEditableView
          ? containerRatio > 1
            ? {
                width: containerRatio ? ref.current.clientHeight * ratio : 0,
                height: ref.current.clientHeight
              }
            : {
                width: ref.current.clientWidth,
                height: containerRatio ? ref.current.clientWidth / ratio : 0
              }
          : ratio > 1
          ? {
              width: containerRatio ? ref.current.clientHeight * ratio : 0,
              height: ref.current.clientHeight
            }
          : {
              width: ref.current.clientWidth,
              height: containerRatio ? ref.current.clientWidth / ratio : 0
            };
      }
      return newDimensions;
    };

    // Function to handle resizing the image
    // TODO - figure out how to handle this on component or parent resize instead of window
    const handleResize = () => {
      if (ref && ref.current && isMounted) {
        const newDimensions = getNewDimensions(ref, ratio);
        if (size.width !== newDimensions.width || size.height !== newDimensions.height) {
          setSize(newDimensions);
        }
      }
    };

    if (ref && ref.current && isMounted) {
      // Remove in case it already exists
      window.removeEventListener('resize', handleResize);
      // Add the event listener
      window.addEventListener('resize', handleResize);

      setSize(getNewDimensions(ref, ratio));
    }

    return () => {
      isMounted = false;
      // Adding this logic below because, without it, the final size
      // is not always calculated and the position bubble positions
      // might be wrong
      if (ref && ref.current) {
        setSize(getNewDimensions(ref, ratio));
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [ref, ratio]);

  // On page resize, test if the element has changed size and adjust.
  // TODO - make sure this works with breakpoints switches

  let body: React.ReactNode = <Loader />;
  if (ref?.current && imageSize) {
    body = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size ? size.width : '100%'}
        height={size ? size.height : '100%'}
        preserveAspectRatio="xMidYMin meet"
        viewBox={`0 0 ${imageSize?.width ?? 0} ${imageSize?.height ?? 0}`}
      >
        <g>
          <image
            onClick={(event) => {
              if (onEmptySpaceClick) onEmptySpaceClick(event, imageSize?.width, imageSize?.height);
            }}
            width={imageSize?.width ?? 0}
            height={imageSize?.height ?? 0}
            href={url}
          />
          <g>
            {markers?.map((marker, i) => {
              const part = parts?.find((p) => p.id == marker.partUuid);
              // Disable the bubble if:
              // - the part is loaded and it is not an assembly or
              //   does not have correpsonding product
              // - or disregard the product ID if in edit mode
              const isDisabled = inEditableView ? false : !part;
              return (
                <ClickablePartBubble
                  bubbleType={part?.isAssembly ? 'square' : 'circle'}
                  key={`part-bubble-${i}-${marker.id}`}
                  onClick={onClick}
                  {...marker}
                  part={part}
                  color={determineBubbleColor(
                    parts?.find((p) => p.id == marker.partUuid),
                    inEditableView ? marker.missingInBom : false,
                    marker.bubbleEditId ? true : false
                  )}
                  disabled={isDisabled}
                  loading={
                    inEditableView && (marker.missingInBom || !!marker.bubbleEditId) ? false : !part
                  }
                  preventClicks={preventClicks}
                />
              );
            })}
          </g>
        </g>
      </svg>
    );
  }

  return (
    <Root height={!inEditableView ? size.height : undefined} ref={ref}>
      {body}
    </Root>
  );
};

export default SubAssembly;
