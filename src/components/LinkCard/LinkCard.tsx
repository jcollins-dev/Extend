// 3rd party libraries
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

/* Types */
interface Props {
  name: string;
  link: string;
  cta: string;
  img?: string;
  details?: string[];
}
/* End types */

/* Styling */
const Root = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: ${(props) => props.theme.colors.background.background1};
  border-radius: 0.625rem 0.625rem 0 0;
  border: ${(props) => props.theme.colors.borders.border02.border};
  border-bottom: none;

  justify-content: space-between;
  padding: 0.9375rem;
`;

const ImgContainer = styled.div`
  width: 100%;
  flex-grow: 1;
  flex-shrink: 0;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    height: 6.25rem;
    object-fit: contain;
  }
`;

const NameContainer = styled.div`
  color: ${(props) => props.theme.colors.headings.h1 || 'black'};
  font-family: ${(props) => props.theme.typography.family};
  font-size: ${(props) => props.theme.typography.components.cardHeader.size || '1.1875rem'};
  font-weight: ${(props) => props.theme.typography.components.cardHeader.weight || 'bold'};
  letter-spacing: 0;
  line-height: ${(props) => props.theme.typography.components.cardHeader.lineHeight || '1.3125rem'};
  flex-grow: 1;
`;

const DetailsContainer = styled.div``;

const Detail = styled.div``;

const CTA = styled.div`
  width: 100%;
  height: 2.5rem;
  flex-grow: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.125rem;

  background-color: ${(props) => props.theme.colors.background.link};
  box-shadow: ${(props) => props.theme.colors.borders.border02.shadow};
  border-radius: 0 0 0.625rem 0.625rem;

  color: ${(props) => props.theme.colors.card.cta || '#584CCF'};
  font-family: ${(props) => props.theme.typography.family};
  font-size: ${(props) => props.theme.typography.components.cardCta.size || '0.875rem'};
  font-weight: ${(props) => props.theme.typography.components.cardCta.weight || 'bold'};
  letter-spacing: 0;
  line-height: ${(props) => props.theme.typography.components.cardCta.lineHeight || '1rem'};
`;
/* End styling */

const LinkCard = ({ name, link, img, details, cta }: Props): ReactElement => {
  return (
    <Root to={link}>
      <MainContent>
        <ImgContainer>
          {img ? (
            <img src={img} alt={name} />
          ) : (
            <img src="/assets/placeholder/machines/default.jpg" alt={name} />
          )}
        </ImgContainer>
        <NameContainer>{name}</NameContainer>
        {details && details.length > 0 && (
          <DetailsContainer>
            {details.map((detail, i) => (
              <Detail key={`detail-${i}`}>{detail}</Detail>
            ))}
          </DetailsContainer>
        )}
      </MainContent>
      <CTA>{cta}</CTA>
    </Root>
  );
};

export default LinkCard;
