import React, { useState, useEffect, useRef } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface Option {
  value: string;
  label: string;
  flag: string;
}

interface CustomDropdownProps {
  options: Option[];
}

const DropdownContainer = styled.div`
  display: flex;
  gap: 15px;
`;
const InnerDropdownContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
const PopupContainer = styled.ul`
  position: absolute;
  top: 100%;
  background-color: white;
  min-width: 100px;
  padding: 10px;
  border: 1px;
  list-style: none;
  margin: 0px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1);
}
`;
const PopupInnerContainer = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`;

const DropdownSelect: React.FC<CustomDropdownProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation(['common']);
  // State for managing the selected option
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container

  // Function to toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle option selection
  const handleOptionSelect = (option: Option): void => {
    const language = typeof option.value === 'string' ? option.value : '';
    setSelectedOption(option);
    setIsOpen(false);
    i18n.changeLanguage(language);
  };

  // Effect to handle clicks outside the dropdown
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
    <DropdownContainer ref={dropdownRef}>
      <div>
        {selectedOption ? (
          <InnerDropdownContainer>
            {selectedOption.label === 'English : English' && (
              <>
                <span style={{ color: '#E5E9ED' }}>{'EN'}</span>
                <img src={selectedOption.flag} />
              </>
            )}
            {selectedOption.label === 'Italian : Italia' && (
              <>
                <span style={{ color: '#E5E9ED' }}>{'IT'}</span>
                <img src={selectedOption.flag} />
              </>
            )}
            {selectedOption.label === 'German : Deutsch' && (
              <>
                <span style={{ color: '#E5E9ED' }}>{'GE'}</span>
                <img src={selectedOption.flag} />
              </>
            )}
          </InnerDropdownContainer>
        ) : (
          <InnerDropdownContainer>
            {options[0].label === 'English : English' && (
              <>
                <span style={{ color: '#E5E9ED' }}>{'EN'}</span>
                <img src={options[0].flag} />
              </>
            )}
          </InnerDropdownContainer>
        )}
      </div>
      <FontAwesomeIcon
        icon={faChevronDown}
        style={{ color: '#E5E9ED', cursor: 'pointer' }}
        onClick={toggleDropdown}
      />
      {isOpen && (
        <PopupContainer>
          {options.map((option) => (
            <li
              key={option.value}
              style={{
                padding: 5,
                cursor: 'pointer'
              }}
              onClick={() => handleOptionSelect(option)}
            >
              <PopupInnerContainer>
                <img src={option.flag} />
                <span style={{ paddingLeft: 8 }}> {option.label}</span>
              </PopupInnerContainer>
            </li>
          ))}
        </PopupContainer>
      )}
    </DropdownContainer>
  );
};

export default DropdownSelect;
