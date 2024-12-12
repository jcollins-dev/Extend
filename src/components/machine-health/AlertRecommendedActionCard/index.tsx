import React from 'react';
import Card from 'components/Card';
import Typography from 'components/Typography/Typography';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AlertRecommendedActionCard {
  detailedInstructions?: string;
}

const IconContainer = styled.div`
  margin-right: 1rem;
`;

const List = styled.ul`
  padding-left: 1rem;
`;

const AlertRecommendedActionCard = ({
  detailedInstructions
}: AlertRecommendedActionCard): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['mh']);

  return (
    <Card>
      <Card.Header bgColor={theme.colors.mediumBlue4}>
        <IconContainer>
          <FontAwesomeIcon icon={faCheck} />
        </IconContainer>
        <Typography as="h3" mb={0} size="0.9rem">
          {t('recommended_actions')}
        </Typography>
      </Card.Header>
      <Card.Body pt={0} pb={0}>
        <List>
          <li>
            <Typography as="p" mb={0} size="0.8rem">
              {detailedInstructions}
            </Typography>
          </li>
        </List>
      </Card.Body>
    </Card>
  );
};

export default AlertRecommendedActionCard;
