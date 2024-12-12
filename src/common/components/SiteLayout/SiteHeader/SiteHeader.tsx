import React from 'react';
import { SiteHeaderContainer } from './SiteHeader.elements';

interface SiteHeaderProps {
  handleToggleNav: () => void;
}
export const SiteHeader = ({ handleToggleNav }: SiteHeaderProps): JSX.Element => {
  return (
    <SiteHeaderContainer className="site-layout__header">
      <button type="button" className="burger-menu-button" onClick={() => handleToggleNav()}>
        <span className="sr-only">open navigation</span>
      </button>
      <a href="/" className="back-to-site">
        back to site
      </a>
      <div>Site Header Placeholder</div>
    </SiteHeaderContainer>
  );
};
