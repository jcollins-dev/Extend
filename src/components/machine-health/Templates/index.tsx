import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 3rd party libs
import styled from 'styled-components';

// Theme
import theme from 'themes';
// Types
import { DataAnalysisView, ProteinMachineRouteQueryParams } from 'types/protein';
//import { MainViewContainer } from '..';
import { Loader, Typography } from 'components';
import { DataAnalysisTemplate } from '../Template';

// Api
import { useGetTemplatesQuery } from 'api';
import { MainViewContainer } from 'pages/ProteinMachine/MachineHealth/DataAnalysis/TemplateDetails';

interface TemplatesProps {
  onClick: (selectedTemplateId?: string) => void;
}

const TemplatesWrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;

  &.template_view {
    justify-content: center;
  }
`;

const TemplatesContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Templates: FC<TemplatesProps> = ({ onClick }: TemplatesProps) => {
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { t } = useTranslation(['mh']);
  /**
   * Query templates
   */
  const { data: templates, isFetching } = useGetTemplatesQuery({
    machineId: machineId
  });

  return (
    <MainViewContainer>
      <TemplatesWrapperContainer className="template_view">
        <Typography as="h3" size="1.3125rem" weight="bold">
          {t('your_views')}:
        </Typography>
        {isFetching && <Loader />}
        {!isFetching && (
          <TemplatesContainer className="template">
            {templates?.map((template: DataAnalysisView) => {
              return (
                <DataAnalysisTemplate
                  key={`${template.viewName}`}
                  templateInfo={template}
                  onClick={onClick}
                  createTemplate={false}
                ></DataAnalysisTemplate>
              );
            })}
            <DataAnalysisTemplate
              onClick={onClick}
              backgroundColor={theme.colors.lightGrey2}
              createTemplate={true}
            ></DataAnalysisTemplate>
          </TemplatesContainer>
        )}
      </TemplatesWrapperContainer>
    </MainViewContainer>
  );
};

export default Templates;
