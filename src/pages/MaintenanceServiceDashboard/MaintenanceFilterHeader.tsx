import React from 'react';

import { faCaretDown, faAngleRight, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader, Typography } from 'components';
import { ReactElement } from 'react';
import styled from 'styled-components';

import { default as theme } from 'themes';

const HeaderRootContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  > h4 {
    margin: 0;
  }
`;

const HeaderNameContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.darkGrey};
  > p {
    margin: 0;
    margin-left: 0.625rem;
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

const FilterHeaderNode = (
  name: string,
  icon?: (color?: string) => ReactElement,
  active?: boolean,
  isLoading?: boolean,
  isClickable?: boolean,
  onClick?: () => void
): React.ReactElement => {
  return (
    <HeaderRootContainer>
      <HeaderNameContainer>
        {isLoading && (
          <LoaderContainer>
            <Loader size={15} margin={0} />
          </LoaderContainer>
        )}
        {!isLoading && <ActiveArrow icon={active ? faCaretDown : faCaretRight} />}
        {icon ? icon(theme.colors.mediumGrey3) : ''}
        <HeaderText variant="body1">{name}</HeaderText>
      </HeaderNameContainer>
      {isClickable && (
        <IconContainer>
          <FontAwesomeIcon icon={faAngleRight} onClick={onClick} />
        </IconContainer>
      )}
    </HeaderRootContainer>
  );
};

export default FilterHeaderNode;
