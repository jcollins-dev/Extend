import styled, { css } from 'styled-components';
import { StyledTypes } from './';
import { styledTheme } from '../';

const pageHeadlineStyles = css`
  font-weight: 500;
  color: ${styledTheme.color.headline.primary};
  font-size: 20px;
`;

// default headline styles
const tileHeadlineStyles = css`
  font-weight: 500;
  color: ${styledTheme.color.headline.primary};
  font-size: ${styledTheme.fnt.base};
  margin: 0;
`;

// default headline styles
const popupHeadlineStyles = css`
  font-weight: 500;
  color: ${styledTheme.color.headline.primary};
  font-size: ${styledTheme.fnt.xl};
  margin: 0;
`;

interface Props extends StyledTypes.ContainerProps, StyledTypes.HeadlineProps {}
export const Headline = styled.h3.attrs(({ styleType }: StyledTypes.HeadlineProps) => ({
  as:
    styleType === 'page-headline'
      ? 'h1'
      : styleType === 'section-headline' || styleType === 'popup-headline'
      ? 'h2'
      : styleType === 'tile-headline'
      ? 'h3'
      : undefined
}))<Props>`
  ${({ styleType }) => {
    switch (styleType) {
      case 'page-headline':
        return pageHeadlineStyles;
      case 'popup-headline':
        return popupHeadlineStyles;

      case 'section-headline':
      default:
        return tileHeadlineStyles;
    }
  }}
`;

const labelStyles = css`
  font-weight: 500;
  color: ${styledTheme.color.primaryAlt};
`;
export const StyledText = styled.span.attrs(() => ({}))<StyledTypes.TextProps>`
  font-size: ${({ size }) => (size === 'sm' ? '.65em' : size === 'xs' && '.5em')};

  ${({ styleType }) => {
    switch (styleType) {
      case 'time-label':
        return labelStyles;
      default:
        return ``;
    }
  }}
`;
