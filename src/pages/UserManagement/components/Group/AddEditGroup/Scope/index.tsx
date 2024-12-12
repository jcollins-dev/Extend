// 3rd party libs
import React, { ReactElement } from 'react';
import theme from 'themes';
import { faAngleRight, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Tooltip from 'rc-tooltip';

// Components
import { KPICard, Typography } from 'components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Cell, Row as CardRow } from 'components/KPICard/CardComponents';

interface Props {
  onScopeDetail: (isVisibleScopeDetail: boolean) => void;
  counts: { organizations: string; plants: string; machines: string };
}

const StyledScopeIcon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 0;
  margin-top: 0.125rem;
  margin-right: 0;
`;

const StyledHeader = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
  margin-right: 0 !important;
`;

const MandatoryIndicator = styled.span`
  color: ${({ theme }) => theme.colors.darkRed};
`;

const Scope = ({ onScopeDetail, counts }: Props): ReactElement => {
  return (
    <>
      <KPICard
        mb="1rem"
        component={
          <StyledHeader
            onClick={() => {
              onScopeDetail(true);
            }}
          >
            <Typography size="1rem" weight="bold" mb={0}>
              <Tooltip
                overlayClassName="information-tooltip"
                placement="top"
                overlay={
                  <span>
                    All fields are mandatory. Organizations, Lines and machines can not be empty.
                  </span>
                }
              >
                <FontAwesomeIcon color={theme.colors.darkGrey} icon={faCircleInfo} />
              </Tooltip>{' '}
              Scope <MandatoryIndicator>*</MandatoryIndicator>{' '}
              <StyledScopeIcon color={theme.colors.darkGrey} icon={faAngleRight} />
            </Typography>
          </StyledHeader>
        }
      >
        <CardRow>
          <Cell>
            <Typography size="2.25rem" color={theme.colors.darkGrey} weight="bold">
              {counts.organizations}
            </Typography>
            <Typography size="0.8125rem" color={theme.colors.mediumGrey3} weight="normal">
              Customers
            </Typography>
          </Cell>
          <Cell>
            <Typography size="2.25rem" color={theme.colors.darkGrey} weight="bold">
              {counts.plants}
            </Typography>
            <Typography size="0.8125rem" color={theme.colors.mediumGrey3} weight="normal">
              Sites
            </Typography>
          </Cell>
          <Cell>
            <Typography size="2.25rem" color={theme.colors.darkGrey} weight="bold">
              {counts.machines}
            </Typography>
            <Typography size="0.8125rem" color={theme.colors.mediumGrey3} weight="normal">
              Machines
            </Typography>
          </Cell>
        </CardRow>
      </KPICard>
    </>
  );
};

export default Scope;
