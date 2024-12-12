import React from 'react';

import { faCaretDown, faAngleRight, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader, Typography } from 'components';
import { ReactElement } from 'react';
import styled from 'styled-components';

import { default as theme, themeColors } from 'themes';

interface NavHeaderProps {
  backgroundColor: string;
  padding: string;
  margin: string;
}

const NavHeaderRootContainer = styled.div<NavHeaderProps>`
  display: flex;
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.backgroundColor};
  > h4 {
    margin: 0;
  }
`;

const NavHeaderNameContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.darkGrey};
  > p {
    margin: 0;
    margin-left: 0.625rem;
    text-wrap: wrap;
  }
`;

const ActiveArrow = styled(FontAwesomeIcon)`
  padding-right: 0.625rem;
  min-height: 20px;
  min-width: 20px;
`;

const LoaderContainer = styled.div`
  padding-right: 0.625rem;
  display: flex;
  align-items: center;
  justify: center;
`;

const IconContainer = styled.div`
  cursor: pointer;
`;

const HeaderText = styled((props) => <Typography {...props} />)`
  text-overflow: ellipsis;
  max-width: 12.65rem;
  white-space: nowrap;
  overflow: hidden;
`;

const NavHeaderNode = (
  name: string,
  icon: (color?: string) => ReactElement,
  active?: boolean,
  isLoading?: boolean,
  isClickable?: boolean,
  onClick?: () => void,
  highlight?: boolean,
  highlightColor?: string
): React.ReactElement => {
  const getBackgroundColor = () => {
    return highlight && highlightColor ? (highlightColor as string) : '';
  };
  const getPadding = () => {
    return highlight && highlightColor ? '0.875rem 0.5rem 0.875rem 4.5rem' : '0';
  };
  const getMargin = () => {
    return highlight && highlightColor ? '0 -0.5rem 0 -4.5rem' : '0';
  };
  return (
    <NavHeaderRootContainer
      backgroundColor={getBackgroundColor()}
      padding={getPadding()}
      margin={getMargin()}
    >
      <NavHeaderNameContainer>
        {isLoading && (
          <LoaderContainer>
            <Loader size={15} margin={0} />
          </LoaderContainer>
        )}
        {!isLoading && (
          <ActiveArrow
            color={highlight && highlightColor ? theme.colors.white : themeColors.darkGrey}
            icon={active ? faCaretDown : faCaretRight}
          />
        )}
        {icon(highlight && highlightColor ? theme.colors.white : theme.colors.mediumGrey3)}
        <HeaderText
          color={highlight && highlightColor ? theme.colors.white : themeColors.darkGrey}
          variant="body1"
        >
          {name}
        </HeaderText>
      </NavHeaderNameContainer>
      {isClickable && (
        <IconContainer>
          <FontAwesomeIcon
            color={highlight && highlightColor ? theme.colors.white : themeColors.darkGrey}
            icon={faAngleRight}
            onClick={onClick}
          />
        </IconContainer>
      )}
    </NavHeaderRootContainer>
  );
};

export default NavHeaderNode;
