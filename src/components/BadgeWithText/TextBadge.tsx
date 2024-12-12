import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserPrompt } from 'components';
import { useAuth, useAuthB2C } from 'hooks';
import { useTranslation } from 'react-i18next';

const MainContainer = styled.div`
  height: 40px;
  width: 72px;
  position: relative;
`;

const OuterBadgeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const InnerBadgeContainer = styled.div`
  width: 40px;
  height: 36px;
  border-radius: 50%;
  background-color: #e5e9ed;
  color: #475467;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-weight: 500;
`;

interface PersonBadgeProps {
  name: string;
}

const PopupInnerContainer = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;

  > span {
    cursor: pointer;
  }
`;
const PopupContainer = styled.ul`
  position: absolute;
  top: 128%;
  right:-12px;
  background-color: white;
  min-width: 100px;
  padding: 10px;
  border: 1px;
  list-style: none;
  margin: 0px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1);
}
`;

const TextBadge: React.FC<PersonBadgeProps> = ({ name }) => {
  const auth = useAuth();
  const authB2C = useAuthB2C();
  const { t } = useTranslation(['common']);
  const b2cflag: boolean = process.env.REACT_APP_ENABLE_B2C == 'true';
  const [isLogoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const handleLogout = () => {
    b2cflag ? authB2C.signout() : auth.signout();
  };

  const getInitials = (name: string): string => {
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0));
    return initials.join('');
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = () => {
    setLogoutModalOpen(!isLogoutModalOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <MainContainer>
      <OuterBadgeContainer ref={dropdownRef}>
        <InnerBadgeContainer>{getInitials(name)}</InnerBadgeContainer>
        <div>
          <FontAwesomeIcon
            icon={faChevronDown}
            style={{ color: '#E5E9ED', cursor: 'pointer' }}
            onClick={handleToggle}
          />
          {isOpen && (
            <PopupContainer>
              <PopupInnerContainer>
                <span onClick={handleOptionSelect}> {'Logout'}</span>
              </PopupInnerContainer>
            </PopupContainer>
          )}
        </div>
      </OuterBadgeContainer>
      {isLogoutModalOpen && (
        <UserPrompt
          visible={isLogoutModalOpen}
          message={t('logout_prompt')}
          subMessage={t('you_will_be_logged_out_in') as string}
          primaryActionLabel={t('continue_session')}
          secondaryActionLabel={t('log_out')}
          handleCancel={handleCancelLogout}
          handlePrimaryAction={handleCancelLogout}
          handleSecondaryAction={handleLogout}
          timeoutAction="secondary-action"
        />
      )}
    </MainContainer>
  );
};

export default TextBadge;
