import React, { ReactElement, forwardRef } from 'react';
import styled, { CSSProperties } from 'styled-components';
import { Typography } from 'components';
import { getBackgroundColor, getBorderColor } from 'helpers';

interface Props {
  heading?: string;
  children?: React.ReactNode;
  status?: string;
  height?: string;
  mb?: string | number;
  icon?: ReactElement;
  removeHeaderMargin?: boolean;
  rightContent?: ReactElement;
  // Custom header
  component?: JSX.Element;
  // Custom styling
  style?: CSSProperties;
  className?: string;
}

interface ContainerProps {
  removeHeaderMargin?: boolean;
  status?: string;
}

type Ref =
  | ((instance: HTMLDivElement | null) => void)
  | React.RefObject<HTMLElement>
  | null
  | undefined;

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  border: ${(props) => `0.0625rem solid ${getBorderColor((props && props.status) ?? '')}`};
  border-radius: 0.625rem;
  overflow: auto;
  height: ${(props: Props) => (props.height ? props.height : 'auto')};
  margin-bottom: ${(props: Props) => (props.mb ? props.mb : '0')};
`;

const Header = styled.header<ContainerProps>`
  padding: 1.25rem;
  background-color: ${(props) => getBackgroundColor((props && props.status) ?? '')};
  display: flex;
  justify-content: space-between;
  align-items: center;

  > * {
    margin: 0;
  }

  ${(props) =>
    !props.removeHeaderMargin &&
    `> :first-child {
    margin-right: 1rem;
  }`}
`;

const KPICard = (
  {
    heading,
    children,
    removeHeaderMargin,
    rightContent,
    status,
    component,
    icon,
    className,
    ...rest
  }: Props,
  ref: Ref
): JSX.Element => (
  <Container status={status} {...rest} className={className ? `kpi-card ${className}` : `kpi-card`}>
    {(component || heading) && (
      <Header removeHeaderMargin={removeHeaderMargin} status={status} ref={ref}>
        {component ? (
          component
        ) : (
          <>
            <Typography variant="h3">
              {heading} {icon}
            </Typography>
            {rightContent}
          </>
        )}
      </Header>
    )}
    {children}
  </Container>
);

export default forwardRef(KPICard);
