import React, { ReactNode, useState } from 'react';
import { SiteLayoutContainer } from './SiteLayout.elements';

import { SiteHeader } from './SiteHeader/SiteHeader';
import { SiteNav } from './SiteNav/SiteNav';
import { SiteFooter } from './SiteFooter/SiteFooter';

interface Props {
  children: ReactNode | ReactNode[];
}

export const SiteLayout = ({ children }: Props): JSX.Element => {
  const [showNav, setShowNav] = useState(false);

  const handleToggleNav = () => setShowNav(!showNav);

  const mainClass = showNav ? 'mobile-view-container is-open' : 'mobile-view-container';

  return (
    <SiteLayoutContainer>
      <SiteHeader {...{ handleToggleNav }} />
      <div className="mobile-view-mask">
        <div className={mainClass}>
          <SiteNav />
          {children}
        </div>
      </div>
      <SiteFooter />
    </SiteLayoutContainer>
  );
};
