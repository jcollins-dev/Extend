import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

/* Types */
interface Props {
  name: string;
  link: string;
  img?: string;
  direction?: string;
}
/* End types */

/* Styling */
const Root = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 0;

  box-sizing: border-box;
  border-radius: 0.625rem;

  text-decoration: none;
  &:link {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:hover {
    text-decoration: none;
  }
  &:visited {
    text-decoration: none;
  }
`;

const MainContent = styled.div<{ direction: string }>`
  display: flex;
  flex-direction: ${({ direction }) => (direction ? direction : 'column')};
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

const ImgContainer = styled.div<{ direction: string }>`
  width: ${({ direction }) => (direction ? 'unset' : '100%')};
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: ${({ direction }) => (direction ? 'left' : 'center')};
  img {
    border-radius: 0.1875rem;
    width: 100%;
    height: 100%;
    height: 7.125rem;
    object-fit: contain;
  }
  text-align: ${({ direction }) => (direction ? 'left' : 'center')};
  margin-right: ${({ direction }) => (direction ? '3rem' : '0rem')};
`;

const NameContainer = styled.div`
  color: ${(props) => props.theme.colors.headings.h1 || 'black'};
  font-family: ${(props) => props.theme.typography.family};
  font-size: ${(props) => props.theme.typography.components.catalogCardHeader.size || '1rem'};
  font-weight: ${(props) => props.theme.typography.components.catalogCardHeader.weight || 'bold'};
  letter-spacing: 0;
  line-height: ${(props) =>
    props.theme.typography.components.catalogCardHeader.lineHeight || '1.1875rem'};
  flex-grow: 1;
  text-transform: capitalize;
`;

const ItemIcon = styled.div`
  width: 0.75rem;
  font-size: 1.25rem;
  line-height: 2rem;
  display: flex;
  margin-right: 1rem;
`;

/* End styling */

const CatalogCard = ({ name, link, img, direction }: Props): ReactElement => {
  return (
    <Root to={link}>
      <MainContent direction={direction as string}>
        <ImgContainer direction={direction as string}>
          {img ? (
            <img src={img} alt={name} />
          ) : (
            <img src="/assets/placeholder/machines/default.jpg" alt={name} />
          )}
        </ImgContainer>
        <NameContainer>{name}</NameContainer>
      </MainContent>
      <ItemIcon>
        <FontAwesomeIcon icon={faChevronRight} color="black" />
      </ItemIcon>
    </Root>
  );
};

export default CatalogCard;
