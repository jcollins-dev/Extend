import React, { ReactNode } from 'react';
import { ChartsWithFiltersPageContainer, baseClass } from './ChartsWithFiltersPage.elements';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';
import { ChartsWithFiltersPageProviders } from './ChartsWithFiltersPageProviders';
import { DownloadCSVButtonProps } from 'components/StyledUi/DownloadCSVButton';
import { SearchBarArea } from './areas';
import { ChartsArea } from './areas/ChartsArea/ChartsArea';

export interface ChartsWithDataFiltersPagePropsChart {
  title: string;
  groupKey: string;
  categoryKey?: string;
  chartType?: string;
  colorKey?: string;
  colors?: Record<string, string>;
  ChartComponent?: ReactNode;
}

export interface ChartsWithFiltersPageProps extends StyledUiContainerProps {
  data?: Record<string, unknown>[];
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  categoryKey?: string;
  csvFileName?: string;
  viewTitle?: string;
  csvFileSettings?: DownloadCSVButtonProps;
  charts?: ChartsWithDataFiltersPagePropsChart[];
  hideSearch?: boolean;
}

interface Props extends ChartsWithFiltersPageProps {
  children?: ReactNode | ReactNode[];
}

export const ChartsWithFiltersPage = ({
  children,
  className,
  charts,
  gridRows,
  gridCols,
  gridGap,
  ...rest
}: Props): JSX.Element => {
  const containerSettings = {
    gridRows,
    gridCols,
    gridGap,
    className: className ? `${baseClass} ${className}` : baseClass
  };

  return (
    <ChartsWithFiltersPageContainer {...containerSettings}>
      <ChartsWithFiltersPageProviders {...{ charts, ...rest }}>
        <header className={`${baseClass}__header`}>
          <SearchBarArea />
        </header>

        {charts && (
          <div className={`${baseClass}__charts-area`}>
            <ChartsArea />
          </div>
        )}

        {children && <div className={`${baseClass}__tables-area`}>{children}</div>}
      </ChartsWithFiltersPageProviders>
    </ChartsWithFiltersPageContainer>
  );
};
