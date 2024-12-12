import React from 'react';
import { HeaderWrapper, Nav, NavMenu } from './index.elements';
import { IcoPlus } from 'icons/IconPlus';
import { capitalizeFirst } from 'helpers';
import { useTranslation } from 'react-i18next';
type THeaderProps = {
  setIsNewAlertToggle: React.Dispatch<React.SetStateAction<boolean>>;
};
const Header = ({ setIsNewAlertToggle }: THeaderProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  return (
    <Nav>
      <NavMenu>
        <li className="nav__menu-item">
          <HeaderWrapper onClick={() => setIsNewAlertToggle((value) => !value)}>
            <div
              style={{
                display: 'flex',
                paddingTop: '10px'
              }}
            >
              <IcoPlus width="50" />
            </div>
            <div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                {capitalizeFirst(t('add_a_tag') as string)}
              </span>
            </div>
          </HeaderWrapper>
        </li>
      </NavMenu>
    </Nav>
  );
};

export default Header;
