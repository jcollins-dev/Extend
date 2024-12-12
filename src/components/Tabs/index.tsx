import React from 'react';
import styled from 'styled-components';
import Tab from './Tab';
import { TabShape } from 'types';

interface ContainerProps {
  type?: TabShape;
  rounded?: boolean;
}

interface TabItem<T> {
  label: string;
  panel: T;
}

interface Props<T> {
  items: TabItem<T>[];
  currentTabPanel: T;
  setTabPanel: (panel: T) => void;
  type?: TabShape;
  rounded?: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  > * + * {
    margin-left: ${(props) =>
      props.type && props.type === TabShape.SQUARE ? '0.5rem;' : '0.625rem;'};
  }
`;

const Tabs = <T extends unknown>({
  items,
  currentTabPanel,
  setTabPanel,
  type,
  rounded = true
}: Props<T>): JSX.Element => {
  return (
    <Container role="tablist" type={type} rounded={rounded}>
      {items.map((item) => (
        <Tab
          rounded={rounded}
          key={item.panel as string}
          onClick={() => {
            setTabPanel(item.panel);
          }}
          active={item.panel === currentTabPanel}
          controls={item.panel as string}
          type={type}
        >
          {item.label}
        </Tab>
      ))}
    </Container>
  );
};

export default Tabs;
