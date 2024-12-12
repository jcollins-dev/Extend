// 3rd party libs
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

// Theme
import theme from 'themes';

// Components
import { Typography } from 'components';

// Types
import { IconSpec } from 'types';

export interface BreadCrumb {
  label: string;
  link?: string;
  component?: JSX.Element;
}

interface Props {
  items?: BreadCrumb[];
  landingIcon?: IconSpec;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 1.625rem;

  > * + * {
    margin-left: 0.75rem;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const FirstLinkContainer = styled.div`
  cursor: pointer;
`;

const BackButtonIcon = styled.div`
  width: 1.125rem;
  height: 1.625rem;
  cursor: pointer;
  font-size: 1.375rem;
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const Breadcrumbs = ({ items, landingIcon }: Props): JSX.Element => {
  const history = useHistory();
  return (
    <Container>
      <BackButtonIcon
        onClick={() => {
          // Go back by using the 2nd to last item in the list, if it has a link
          if (items && items.length > 1) {
            const penultimateItem = items[items.length - 2];
            if (penultimateItem.link) {
              if (penultimateItem.link === 'back') {
                location.reload();
                return history.goBack();
              } else history.push(penultimateItem.link);
            }
            // TODO - what if a link is not provided?
          }
          // TODO - what to do when on the first breadcrumb?
        }}
      >
        {landingIcon ? (
          landingIcon.iconType === 'fa' ? (
            <FontAwesomeIcon icon={landingIcon.iconElement as IconProp} />
          ) : (
            (landingIcon.iconElement as (color?: string) => JSX.Element)(theme.colors.darkGrey)
          )
        ) : (
          items && items.length > 0 && <FontAwesomeIcon icon={faArrowLeft} />
        )}
      </BackButtonIcon>
      {items &&
        items.map((item, idx, items) =>
          idx !== items.length - 1 && item.link ? (
            <React.Fragment key={`${item.link}-${item.label}`}>
              {item.link === 'back' ? (
                <FirstLinkContainer
                  role="link"
                  onClick={() => {
                    location.reload();
                    return history.goBack();
                  }}
                >
                  <Typography size="1.125rem" as="h3" mb={0} color="darkGrey" weight="normal">
                    {item.label}
                  </Typography>
                </FirstLinkContainer>
              ) : (
                <StyledLink to={item.link} key={`${item.link}-${item.label}`}>
                  <Typography size="1.125rem" as="h3" mb={0} color="darkGrey" weight="normal">
                    {item.label}
                  </Typography>
                </StyledLink>
              )}
              <FontAwesomeIcon icon={faChevronRight} />
            </React.Fragment>
          ) : (
            // The last item is not a link and is styled differently
            <React.Fragment key={item.label}>
              {idx === items.length - 1 ? (
                <Typography size="1.3125rem" as="h2" mb="1px" color="darkGrey" weight="bold">
                  {item.label}
                </Typography>
              ) : (
                <Typography size="1.125rem" as="h3" mb="1px" color="darkGrey" weight="normal">
                  {item.label}
                </Typography>
              )}

              {item.component}
              {/*Should still have chevron when not the last item and not a link*/}
              {idx !== items.length - 1 && <FontAwesomeIcon icon={faChevronRight} />}
            </React.Fragment>
          )
        )}
    </Container>
  );
};

export default Breadcrumbs;
