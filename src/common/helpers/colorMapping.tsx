// Color and Icon mappping for Proseal
import React from 'react';
import { Icon1 } from 'icons/icon1';
import { Icon2 } from 'icons/icon2';
import { Icon3 } from 'icons/icon3';
import { Icon5 } from 'icons/icon5';
import { Icon6 } from 'icons/icon6';
import { Icon4 } from 'icons/icon4';

// Color mapping for Proseal
export const categoryMapping = {
  'Stopped by Operator': {
    icon: <Icon1 color={'#00A6FF'} />,
    color: '#00A6FF'
  },
  'Machine Running': {
    icon: <Icon2 color={'#00FF00'} />,
    color: '#00FF00'
  },
  'Machine Error': {
    icon: <Icon3 color={'#FFA500'} />,
    color: '#FFA500'
  },
  'External Error': {
    icon: <Icon4 color={'#FF0000'} />,
    color: '#FF0000'
  },
  'Process Error': {
    icon: <Icon5 color={'#B59410'} />,
    color: '#B59410'
  },
  Undefined: {
    icon: <Icon6 color={'#C83D95'} />,
    color: '#C83D95'
  }
} as Record<string, unknown>;

// This should be coming from API for Proseal
export const recipeMapping = {
  nuggets: '#E66C37',
  nuggets2: '#750985',
  fish: '#C83D95'
};
