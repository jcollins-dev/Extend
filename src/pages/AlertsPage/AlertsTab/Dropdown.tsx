import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IcoFrame } from 'icons/IcoFrame';
import { IcoPlus } from 'icons/IconPlus';
import { capitalizeFirst } from 'helpers';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { HeaderWrapper, LinkCell, LinkColumn, Nav, NavMenu, NavSubMenu } from './Dropdown.elements';
import { NavLink } from 'react-router-dom';

export const Dropdown = (): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const SUB_ROUTES = {
    createAlert: 'create-alert'
  };

  return (
    <Nav>
      <NavMenu ref={ref}>
        <li className="nav__menu-item" onClick={() => setIsComponentVisible(!isComponentVisible)}>
          <HeaderWrapper>
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
                  fontSize: '14px'
                }}
              >
                {capitalizeFirst(t('new_alert') as string)}
              </span>
              <span>
                <FontAwesomeIcon
                  className="icon"
                  icon={isComponentVisible ? faChevronUp : faChevronDown}
                />
              </span>
            </div>
          </HeaderWrapper>

          {isComponentVisible && (
            <NavSubMenu>
              <li className="nav__submenu-item">
                <LinkColumn>
                  <NavLink to={SUB_ROUTES.createAlert}>
                    <IcoFrame width="50" />
                    <LinkCell>{t('create_new_alert')}</LinkCell>
                  </NavLink>
                </LinkColumn>
              </li>
            </NavSubMenu>
          )}
        </li>
      </NavMenu>
    </Nav>
  );
};

function useComponentVisible(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);

  /*eslint-disable-next-line*/
  const ref = useRef<any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current?.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
