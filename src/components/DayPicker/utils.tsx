import React from 'react';
import { DayPickerProps } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import styled from 'styled-components';

export type OverlayProps = DayPickerProps & {
  classNames: Record<string, string>;
  children: React.ReactNode;
  style: React.CSSProperties;
};

const Container = styled.div`
  * > * {
    font-size: 0.75rem;
    font-weight: 500;
  }
`;

export const CustomOverlay = ({
  classNames,
  children,
  style,
  ...rest
}: OverlayProps): JSX.Element => {
  return (
    <div className={classNames?.overlayWrapper} style={style} {...rest}>
      <div className={classNames?.overlay}>
        <Container>{children}</Container>
      </div>
    </div>
  );
};
