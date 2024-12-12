import React, { ComponentProps, useState, useEffect } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import WarningPrompt from '.';
import { Button, TabNav } from 'components';
import { BrowserRouter as Router, Route, Switch, useHistory, useLocation } from 'react-router-dom';

export default {
  title: 'UI/WarningPrompt',
  component: WarningPrompt,
  decorators: [
    (Story) => (
      <Router>
        <Story />
      </Router>
    )
  ]
} as Meta;

const ActionTemplate: Story<ComponentProps<typeof WarningPrompt>> = (args) => {
  const [isVisible, setIsVisible] = useState(false);

  const onConfirm = () => {
    setIsVisible(false);
    alert('Confirmed');
  };

  return (
    <>
      <Button onClick={() => setIsVisible(true)} variant="danger" width="6rem">
        Delete
      </Button>
      <WarningPrompt
        {...args}
        isVisible={isVisible}
        onCancelCallback={() => setIsVisible(false)}
        onConfirmCallback={onConfirm}
      />
    </>
  );
};

export const ActionPrompt = ActionTemplate.bind({});

interface Tab {
  isTabEnabled: boolean;
  route: string;
  title: string;
}

const TABS: Record<string, Tab> = {
  tab1: {
    isTabEnabled: true,
    route: '/tab1',
    title: 'A Tab With Routing'
  },
  tab2: {
    isTabEnabled: true,
    route: '/tab2',
    title: 'Another Tab With Routing'
  },
  tab3: {
    isTabEnabled: true,
    route: '/tab3',
    title: 'Third Tab With Routing'
  }
};

ActionPrompt.args = {
  helperText: 'The item will be no longer available. Are you sure you want to delete it?',
  isConfirmPrompt: true,
  title: 'Confirm Deletion'
};

const NavigationTemplate: Story<ComponentProps<typeof WarningPrompt>> = (args) => {
  const history = useHistory();
  const location = useLocation();

  const [isDirty, setIsDirty] = useState(false);

  const isActive = (tab: Tab) => location.pathname === tab.route;

  const navItem = (tab: Tab) => {
    return {
      active: isActive(tab),
      isTabEnabled: tab.isTabEnabled,
      label: tab.title,
      onClick: () => location.pathname !== tab.route && history.push(tab.route)
    };
  };

  useEffect(() => {
    setIsDirty(true);
  }, [location.pathname]);

  useEffect(() => {
    history.push(TABS.tab1.route);
  }, []);

  return (
    <>
      <TabNav items={[navItem(TABS.tab1), navItem(TABS.tab2), navItem(TABS.tab3)]} />
      <Switch>
        <Route path={TABS.tab1.route}></Route>
        <Route path={TABS.tab2.route}></Route>
        <Route path={TABS.tab3.route}></Route>
      </Switch>
      <WarningPrompt {...args} isVisible={isDirty} />
    </>
  );
};

export const NavigationPrompt = NavigationTemplate.bind({});

NavigationPrompt.args = {
  helperText:
    'You have customised this machine and not saved the changes. Are you sure you want to navigate away without saving?',
  title: 'Unsaved Changes'
};
