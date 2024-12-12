import React, { ReactNode, useState } from 'react';
import { StyledTabsNavItem } from '../StyledTabs.elements';

export interface UseStyledTabsProps {
  /**
   *  tabs is an object with the nav label as the key.  The value is a react component or string
   *  EXAMPLE:
   *  {
   *    ['overview']: <SomeComponent setting someProp={someVariable} title='text title'>,
   *    ['machine health']: <div><h2>this is a component</h2>,
   *    ['machine id']: 'text only content'
   *  }
   */
  tabs: {
    [key: string]: ReactNode | ReactNode[];
  };
  /** for css grid-area */
  gridArea?: string;
  /** to add a custom classname modifier, the base class is .styled-tabs */
  className?: string;
  /** tab key*/
  showTab?: string;
}

/**
 * useStyledTabs is a hook that takes an incoming object { tags } who's keys
 * are the labels for the tab button and the keys values are the content of the tab
 * example: { tabs: { ['label namne']: <Component /> } }
 *
 * When using this hook, the Nav and Tab items will not be wrapped in containers and there will be no
 * overall parent container.  The return of this hook will provide the buttons and the tabs.  You will
 * need to make sure you are styling the show and hide state.
 *
 * A className 'styled-tabs-container__tab--is-hidden' get's assigned to all hidden tabs.  It is up to you
 * to decide how that is handled when using this hook.  This was meant to be able to use the features of the
 * StyledTabs component while being able to control the style placement
 *
 *
 * Buttons will be styled based on setting
 *
 * You can add new styles or select previously used styles by assigning a value
 * to the styleType property.  To add the styles to the StyledTabsNavItem styled component found in
 * STyledTabs.elements.tsx.
 */

export const useStyledTabs = ({ tabs, showTab }: UseStyledTabsProps): [ReactNode, ReactNode] => {
  const [tab, setTab] = useState(showTab || Object.keys(tabs)[0]);

  const GeneratedNav = [] as ReactNode[];
  const GeneratedTabs = [] as ReactNode[];

  Object.entries(tabs).map(([key, Tab]) => {
    GeneratedTabs.push(
      <div
        key={key}
        className={`styled-tabs-container__tab styled-tabs-container__tab--${key.replaceAll(
          ' ',
          '-'
        )}${tab !== key ? ` styled-tabs-container__tab--is-hidden` : ``}`}
      >
        {Tab}
      </div>
    );

    GeneratedNav.push(
      <StyledTabsNavItem
        key={key}
        onClick={() => setTab(key)}
        className={`styled-tabs-nav__button styled-tabs-nav__button--${key.replaceAll(' ', '')}${tab === key ? ` styled-tabs-nav__button--is-current` : `-`
          }`}
      >
        {key}
      </StyledTabsNavItem>
    );
  });

  return [GeneratedNav, GeneratedTabs];
};
