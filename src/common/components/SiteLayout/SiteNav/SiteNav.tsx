import React, { ReactNode } from 'react';
import { SiteNavContainer } from './SiteNav.elements';
import { IcoNavFleet } from 'icons/IcoNavFleet';
import { IcoNavMaintenance } from 'icons/IcoNavMaintenance';
import { IcoNavParts } from 'icons/IcoNavParts';
import { IcoMachineManagement } from 'icons/IcoMachineManagement';
import { IcoUserManagement } from 'icons/IcoUserManagement';
import { IcoInfo } from 'icons/IcoInfo';

const mainNavItems: SiteNavMainNavItemProps[] = [
  {
    slug: 'fleet',
    label: 'Fleet',
    Icon: <IcoNavFleet />
  },
  {
    slug: 'maintenance',
    label: 'Maintenance',
    Icon: <IcoNavMaintenance />
  },
  {
    slug: 'parts',
    label: 'Parts',
    Icon: <IcoNavParts />
  },
  {
    slug: 'machine-management',
    label: 'Machine Management',
    Icon: <IcoMachineManagement />
  },
  {
    slug: 'user-management',
    label: 'User Management',
    authLevel: 10,
    Icon: <IcoUserManagement />
  },
  {
    slug: 'Help',
    label: 'Help',
    Icon: <IcoInfo />
  }
];

export interface SiteNavMainNavItemProps {
  slug: string;
  label: string;
  Icon: ReactNode | ReactNode[];
  authLevel?: number;
}

interface ItemProps extends SiteNavMainNavItemProps {
  handleClick?: (slug?: typeof mainNavItems) => void;
}

const Item = ({ label, Icon }: ItemProps): JSX.Element => {
  return (
    <button className="site-nav-main-item" type="button">
      {Icon}
      <span className="site-nav-main-item__label">{label}</span>
    </button>
  );
};

export const SiteNav = (): JSX.Element => {
  /*const [subNavItems, setSubNavItems] = useState<
    Record<string, { slug: string; label: string }> | undefined
  >(undefined);*/

  return (
    <SiteNavContainer className="site-layout__nav">
      <div className="site-nav-main">
        {mainNavItems.map((item) => (
          <Item key={item.slug} {...item} />
        ))}
      </div>
      <div>bottom</div>
    </SiteNavContainer>
  );
};
