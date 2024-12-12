import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PageLayout } from '../PageLayout';
import styled from 'styled-components';
import { TooltipWrapper } from 'components';

const DemoHolder = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
`;

const DemoColor = styled.span`
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 0.9em;
`;

export default {
  title: 'Extend/Layouts/PageLayout',
  component: PageLayout,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      //excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PageLayout>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PageLayout> = (args) => {
  return (
    <DemoHolder>
      <PageLayout {...args} />
    </DemoHolder>
  );
};

export const Fleet = Template.bind({});
Fleet.args = {
  pageTabs: {
    tabs: [
      {
        label: 'Machine Health',
        slug: 'machine-health',
        // this normally gets set automatically
        isCurrent: true,
        handle: {
          click: () => alert('routing is disabled for demo')
        }
      },
      {
        label: 'Machine Performance',
        slug: 'machine-performance',
        handle: {
          click: () => alert('routing is disabled for demo')
        }
      },
      {
        label: (
          <>
            Alerts <DemoColor> (3)</DemoColor>
          </>
        ),
        slug: 'alerts',
        isDisabled: true,
        handle: {
          click: () => alert('routing is disabled for demo')
        }
      },
      {
        label: <TooltipWrapper Tooltip="this is a demo link with a tooltip">Custom</TooltipWrapper>,
        slug: 'external',
        isDisabled: true,
        handle: {
          click: () => alert('routing is disabled for demo')
        }
      }
    ]
  }
};
