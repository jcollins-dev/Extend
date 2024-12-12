// 3rd party
import React, { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styled, { useTheme } from 'styled-components';
import { FleetBreadCrumbsProps, FleetBreadCrumbs } from 'components/StyledUi/FleetBreadCrumbs';

// Types
import { IconSpec } from 'types';
import { BreadCrumb } from 'components/Breadcrumbs';

// Components
import { Breadcrumbs, Indicator, Typography } from 'components';

interface Props {
  heading: string;
  message?: string;
  messageColor?: string;
  icon?: IconSpec;
  mb?: string;
  breadcrumbs?: BreadCrumb[];
  rightContent?: ReactNode;
  onlyBreadcrumbs?: boolean;
  breadCrumbSettings?: FleetBreadCrumbsProps;
}

const BreadcrumbsContainer = styled.div<{ mb?: string }>`
  height: 3.5rem;
  ${({ mb }) => mb && `margin-bottom: ${mb};`}
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
`;

const ContentContainer = styled.div`
  width: 50%;
`;

const IconContainer = styled.div`
  height: 1.675rem;
  font-size: 1.675rem;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
`;

const StyledIndicator = styled(Indicator)`
  display: inline;
  margin: 0;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PageHeader = ({
  heading,
  message,
  messageColor,
  breadcrumbs,
  icon,
  mb,
  rightContent,
  onlyBreadcrumbs,
  breadCrumbSettings
}: Props): JSX.Element => {
  const theme = useTheme();
  return (
    <>
      {!breadCrumbSettings ? (
        <BreadcrumbsContainer mb={mb}>
          {(!breadcrumbs || breadcrumbs.length === 0) && (
            <HeaderContainer>
              {icon && (
                <IconContainer>
                  {icon.iconType === 'fa' ? (
                    <FontAwesomeIcon icon={icon.iconElement as IconDefinition} />
                  ) : (
                    (icon.iconElement as (color?: string) => JSX.Element)(theme.colors.darkGrey)
                  )}
                </IconContainer>
              )}
              <Typography size="1.125rem" as="h3" mb={0} color="darkGrey" weight="normal">
                {heading}
              </Typography>
            </HeaderContainer>
          )}
          <Breadcrumbs items={breadcrumbs} />
        </BreadcrumbsContainer>
      ) : (
        <FleetBreadCrumbs {...breadCrumbSettings} />
      )}

      {!onlyBreadcrumbs && message && rightContent && (
        <HeaderContainer>
          <ContentContainer>
            {message && (
              <MessageContainer>
                {messageColor && <StyledIndicator color={messageColor} />}
                <Typography mb={0} size="1.125rem" weight="bold" color={messageColor}>
                  {message}
                </Typography>
              </MessageContainer>
            )}
          </ContentContainer>
          <ContentContainer>{rightContent}</ContentContainer>
        </HeaderContainer>
      )}
    </>
  );
};

export default PageHeader;
