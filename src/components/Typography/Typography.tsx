import React, { ReactNode, ReactElement } from 'react';
import styled from 'styled-components';

interface TypographyProps {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'helper'
    | 'body1'
    | 'body2'
    | 'modelheading'
    | 'buttonlabel'
    | 'inputlabel'
    | 'tablecolumn'
    | 'tablerow'
    | 'tablerowlight'
    | 'stepheading'
    | 'subtitle';
  color?: string;
  children?: ReactNode;
  weight?: 'bold' | 'semi-bold' | 'medium' | 'normal';
  mb?: string | number;
  as?: 'label' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'a';
  size?: string | number;
  [key: string]: unknown;
  className?: string;
}

const TypographyTextbase = styled.p<TypographyProps>`
  font-family: ${(props) => props.theme.typography.family};
  color: ${({ theme, color }) => {
    if (color && Object.prototype.hasOwnProperty.call(theme.colors, color)) {
      return theme.colors[color as never];
    }
    switch (color) {
      case 'success':
        return '#28B981';
      case 'warning':
        return '#CB6E17';
      case 'danger':
        return '#AB091E';
      case 'bluefont':
        return '#233957';
      case 'greyfont':
        return '#303E47';
      case 'bluehighlight':
        return '#018CD8';
      default:
        return color;
    }
  }};
  font-size: ${({ size }) => size};
  font-weight: ${({ weight }) => {
    switch (weight) {
      case 'bold':
        return 700;
      case 'semi-bold':
        return 600;
      case 'medium':
        return 500;
      default:
        return 400;
    }
  }};
  margin-top: 0;
  margin-bottom: ${(props) => props.mb};
`;

const Typography_h1 = styled(TypographyTextbase)`
  font-size: 2.1875rem;
  font-weight: 500;
  color: #233957;
`.withComponent('h1');

const Typography_h2 = styled(TypographyTextbase)`
  font-size: 1.3125rem;
  font-weight: 700;
`.withComponent('h2');

const Typography_h3 = styled(TypographyTextbase)`
  font-size: 1.25rem;
  font-weight: 500;
  color: #233957;
`.withComponent('h3');

const Typography_h4 = styled(TypographyTextbase)`
  font-size: 1rem;
  font-weight: 600;
  color: #233957;
`.withComponent('h4');

const Typography_h5 = styled(TypographyTextbase)`
  font-size: 1rem;
  font-weight: 500;
`.withComponent('h5');

const Typography_h6 = styled(TypographyTextbase)`
  font-size: 0.75rem;
  font-weight: 500;
`.withComponent('h6');

const Typography_helper = styled(TypographyTextbase)`
  font-size: 0.75rem;
  font-weight: 500;
  color: #303e47;
`;

const Typography_modelheading = styled(TypographyTextbase)`
  font-size: 0.875rem;
  font-weight: 700;
`;

const Typography_buttonlabel = styled(TypographyTextbase)`
  font-size: 0.875rem;
  font-weight: 700;
  background-color: #c2c2c2;
  color: white;
`;

const Typography_inputlabel = styled(TypographyTextbase)`
  display: block;
  margin-bottom: 0.3125rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Typography_tablecolumn = styled(TypographyTextbase)`
  font-size: 0.875rem;
  font-weight: 500;
`.withComponent('td');

const Typography_tablerow = styled(TypographyTextbase)`
  font-size: 0.875rem;
  font-weight: 600;
`.withComponent('tr');

const Typography_tablerowlight = styled(TypographyTextbase)`
  font-size: 0.875rem;
  font-weight: 400;
`.withComponent('tr');

const Typography_body1 = styled(TypographyTextbase)`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.125rem;
`;

const Typography_body2 = styled(TypographyTextbase)`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
`;

const Typography_stepheading = styled(TypographyTextbase)`
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.125rem;
  margin-bottom: 0;
`;

const Typography_subtitle = styled(TypographyTextbase)`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.1875rem;
  padding-bottom: 0.5rem;
`;

export const Typography = ({
  variant,
  color,
  children,
  weight,
  mb = '1rem',
  as,
  size = '0.875rem',
  ...rest
}: TypographyProps): ReactElement => {
  let TypographyComponent;
  switch (variant) {
    case 'h1':
      TypographyComponent = Typography_h1;
      break;
    case 'h2':
      TypographyComponent = Typography_h2;
      break;
    case 'h3':
      TypographyComponent = Typography_h3;
      break;
    case 'h4':
      TypographyComponent = Typography_h4;
      break;
    case 'h5':
      TypographyComponent = Typography_h5;
      break;
    case 'h6':
      TypographyComponent = Typography_h6;
      break;
    case 'helper':
      TypographyComponent = Typography_helper;
      break;
    case 'body1':
      TypographyComponent = Typography_body1;
      break;
    case 'body2':
      TypographyComponent = Typography_body2;
      break;
    case 'modelheading':
      TypographyComponent = Typography_modelheading;
      break;
    case 'buttonlabel':
      TypographyComponent = Typography_buttonlabel;
      break;
    case 'inputlabel':
      TypographyComponent = Typography_inputlabel;
      break;
    case 'tablecolumn':
      TypographyComponent = Typography_tablecolumn;
      break;
    case 'tablerow':
      TypographyComponent = Typography_tablerow;
      break;
    case 'tablerowlight':
      TypographyComponent = Typography_tablerowlight;
      break;
    case 'stepheading':
      TypographyComponent = Typography_stepheading;
      break;
    case 'subtitle':
      TypographyComponent = Typography_subtitle;
      break;
    default:
      TypographyComponent = TypographyTextbase;
      break;
  }
  if (variant === 'buttonlabel' || variant === 'inputlabel') {
    return (
      <TypographyComponent as="label" color={color} {...rest}>
        {children}
      </TypographyComponent>
    );
  } else {
    return (
      <TypographyComponent color={color} weight={weight} mb={mb} as={as} size={size} {...rest}>
        {children}
      </TypographyComponent>
    );
  }
};

export default Typography;
