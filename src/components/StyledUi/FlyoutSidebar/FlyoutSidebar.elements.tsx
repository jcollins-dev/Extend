import styled from 'styled-components';
import { styledTheme } from '../';


export const HeaderSection = styled('div').attrs(() => ({
    className: 'ui-flyout__header'
  }))`
    display: flex;
    justify-content: space-between;
    overflow: hidden;
  `;
  
  export const Title = styled('h3').attrs(() => ({
    styleType: 'tile-headline',
    className: 'ui-flyout__title'
  }))`
    display: flex;
    flex-direction: row;
    margin: 0;
    padding-top: ${styledTheme.space.lg};
    padding-right: ${styledTheme.space.lg};
    padding-bottom: ${styledTheme.space.lg};
    padding-left: 2rem;
  `;

  export const IconButton = styled('button').attrs(() => ({
    className: `ui-flyout__icon-btn`
  }))`
    display: block;
    background-color: transparent;
    border: none;
    color: ${styledTheme.color.primaryAlt};
    cursor: pointer;
    padding: 0 ${styledTheme.space.lg};
  `;