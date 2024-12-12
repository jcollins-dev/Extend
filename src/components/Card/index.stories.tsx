import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import Card from '.';
import { Typography } from 'components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import theme from 'themes';

export default {
  title: 'UI/Card',
  component: Card
} as Meta;

export const SimpleHeaderAndBody = (): JSX.Element => (
  <div style={{ width: '400px' }}>
    <Card>
      <Card.Header bgColor={theme.colors.mediumBlue4}>Text heading with bgColor</Card.Header>
      <Card.Body>Card.Body provides some default padding to quickly create card content</Card.Body>
    </Card>
  </div>
);

export const HeaderWithTypography = (): JSX.Element => (
  <div style={{ width: '400px' }}>
    <Card>
      <Card.Header bgColor={theme.colors.mediumBlue4}>
        <Typography variant="h2">We can pass any react element into the heading</Typography>
      </Card.Header>
      <Card.Body>Card.Body provides some default padding to quickly create card content</Card.Body>
    </Card>
  </div>
);

export const HeadingWithIcon = (): JSX.Element => (
  <div style={{ width: '400px' }}>
    <Card>
      <Card.Header
        icon={<FontAwesomeIcon icon={faShoppingCart} />}
        bgColor={theme.colors.mediumBlue4}
      >
        With heading Icon
      </Card.Header>
      <Card.Body>Card.Body provides some default padding to quickly create card content</Card.Body>
    </Card>
  </div>
);

export const BorderColor = (): JSX.Element => (
  <div style={{ width: '400px' }}>
    <Card borderColor={theme.colors.negativeRed}>
      <Card.Body>A card with a border color.</Card.Body>
    </Card>
  </div>
);

export const WithNoBody = (): JSX.Element => (
  <div style={{ width: '400px' }}>
    <Card>
      <Card.Header bgColor={theme.colors.mediumBlue4}>Heading</Card.Header>
      We do not have to use the Body component if we do not want any padding
    </Card>
  </div>
);
