import React from 'react';
import { LiveChartActionButtonsContainer } from './LiveChartActionButtons.elements';
import { EyeIcon } from 'icons/EyeIcon';
import { styledTheme } from 'common/theme';

interface Props {
  onSearch?: () => void;
  onShowLabels?: () => void;
  showLabels: boolean;
}

export const LiveChartActionButtons = ({ onShowLabels, showLabels }: Props): JSX.Element => {
  return (
    <LiveChartActionButtonsContainer>
      {/* Commenting it out because functionality will be added later */}
      {/* <button className="livechart--button">
        <SearchIcon color={styledTheme.colors.secondary} /> Search Data
      </button> */}
      <button className="livechart--button" onClick={onShowLabels}>
        <EyeIcon color={styledTheme.colors.secondary} />{' '}
        {showLabels ? 'Hide Labels' : 'Reveal labels'}
      </button>
    </LiveChartActionButtonsContainer>
  );
};
