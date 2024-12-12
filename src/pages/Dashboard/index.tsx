import React, { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
// Icons
// import { faLandmark } from '@fortawesome/free-solid-svg-icons';
import { DashBoarCardContent } from './DashBoardCardContent';
import theme from 'themes';
import { find } from 'lodash';

// Hooks
import { usePermissions } from 'hooks';

//Types
import { PermissionScopeName } from 'types/user-management';
import { getPermissionNameByLocation } from 'pages/Permission/utils';

//components
import { Ketch, Typography, PermissionWrapper } from 'components';
import { useTranslation } from 'react-i18next';

//styling
import {
  Root,
  DashboardRowBottom,
  DashboardRowTop,
  DashBoardCard,
  DashBoardIcon,
  StyledTypography,
  DashboardHeader,
  DashboardImageWrapper,
  DashBoadKiteWrapper,
  ImageWrapper
} from './DashboardStyledComponents';

const Dashboard = (): ReactElement => {
  const { t } = useTranslation(['common']);
  const history = useHistory();
  const permission = usePermissions();
  const scopePermission = find(
    permission?.scopes,
    (scopeItem) => scopeItem.name === PermissionScopeName.FLEET
  );
  console.log('scopePermission' + scopePermission);
  return (
    <>
      <Ketch />
      <Root>
        <DashboardRowTop>
          <DashboardHeader>
            <DashBoardIcon
              src="/assets/imgs/icons/Omniblue_landing_icon.svg"
              alt="OmniBlue logo"
              swidth="4.75rem"
              sheight="4.905rem"
            />
            <Typography size="3rem" weight="bold" color={theme.colors.primaryBlue5}>
              {t('dashboard')}
            </Typography>
            <StyledTypography size="0.875rem" weight="normal" color={theme.colors.lightGrey8}>
              {t('Please_select_to_get_started')}
            </StyledTypography>
          </DashboardHeader>
          <DashboardImageWrapper>
            <DashBoardIcon src="/assets/imgs/icons/landing_connections.svg" alt="OmniBlue logo" />
          </DashboardImageWrapper>
        </DashboardRowTop>
        <DashboardRowBottom>
          {DashBoarCardContent.map((card) => {
            // For ROLE = User if hide Admin modules

            return (
              <PermissionWrapper key={card.alt} page={getPermissionNameByLocation(card.path)}>
                <DashBoardCard
                  key={card.alt}
                  onClick={() => {
                    history.push(card.path);
                  }}
                >
                  <ImageWrapper>
                    <DashBoardIcon src={card.icon} alt={card.alt} />
                  </ImageWrapper>
                  <Typography size="1rem" weight="bold" color={theme.colors.darkGray3}>
                    {t(card.title)}
                  </Typography>
                  <StyledTypography size="0.875rem" weight="normal" color={theme.colors.lightGrey8}>
                    {t(card.description)}
                  </StyledTypography>
                </DashBoardCard>
              </PermissionWrapper>
            );
          })}
          <DashBoadKiteWrapper left="-11rem">
            <DashBoardIcon src="/assets/imgs/icons/landing_kite.svg" alt="OmniBlue logo" />
          </DashBoadKiteWrapper>
        </DashboardRowBottom>
      </Root>
    </>
  );
};

export default Dashboard;
