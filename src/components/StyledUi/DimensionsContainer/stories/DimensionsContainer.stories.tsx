import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DimensionsContainer } from '../DimensionsContainer';
import { UseContainerSizeReturnProps } from '../hooks/useContainerSize';

export default {
  title: 'StyledUi/DimensionsContainer'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof DimensionsContainer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DimensionsContainer> = (args) => {
  return <DimensionsContainer {...args} />;
};

export const DimensionsContainerDemo = Template.bind({});
DimensionsContainerDemo.args = {
  Component: ({ width, height }: UseContainerSizeReturnProps): JSX.Element => (
    <div>
      width: {width} | height: {height}
    </div>
  )
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const UsageTemplate: ComponentStory<typeof DimensionsContainer> = () => {
  const NeedsDims = ({ width, height }: UseContainerSizeReturnProps) => (
    <>
      w:{width}px | h:{height}px
    </>
  );

  const NeedsRef = ({ divRef }: UseContainerSizeReturnProps) => {
    if (divRef?.current && divRef !== null) {
      divRef.current.style.background = 'red';
      divRef.current.style.color = 'white';
      divRef.current.style.padding = '1em';
    }

    return <>we are styling the container via ref</>;
  };

  const PrintDims = () => <DimensionsContainer Component={NeedsDims} />;

  const StyleRef = () => <DimensionsContainer Component={NeedsRef} />;

  return (
    <div>
      <h2>Print Dims</h2>
      <PrintDims />
      <hr />
      <h2>Style Dims</h2>
      <StyleRef />
    </div>
  );
};

export const Usage = UsageTemplate.bind({});
