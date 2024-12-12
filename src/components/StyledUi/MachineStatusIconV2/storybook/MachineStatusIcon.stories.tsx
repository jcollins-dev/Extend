import React from 'react';
import { MachineStatusIcon } from '../MachineStatusIcon';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from 'styled-components';

export default {
  title: 'StyledUi/MachineStatusIconV2',
  component: MachineStatusIcon
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof MachineStatusIcon>;

const CenterDiv = styled.div`
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MachineStatusIcon> = (args) => {
  return (
    <CenterDiv>
      <MachineStatusIcon {...args} />
    </CenterDiv>
  );
};

export const WatchDogStatus = Template.bind({});
WatchDogStatus.args = {
  machineId: `8f84c4e6-e6d1-434b-8e9b-16d7deb9aec2`,
  hasError: undefined,
  isLoading: false,
  machineStatus: 'good',
  dataStatus: 'good',
  lastConnected: '2000-09-23T12:39:57+00:00'
};

export const DSIMachineStatus = Template.bind({});
DSIMachineStatus.args = {
  machineId: `8f84c4e6-e6d1-434b-8e9b-16d7deb9aec2`,
  productionState: 'running',
  lastConnected: '2000-09-23T12:39:57+00:00',
  bottom: true
};

export const FailedToLoadMachine = Template.bind({});
FailedToLoadMachine.args = {
  machineId: `8f84c4e6-e6d1-434b-8e9b-16d7deb9aec2`,
  bottom: true
};
