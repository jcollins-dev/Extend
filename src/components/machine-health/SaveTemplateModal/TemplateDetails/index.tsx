// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { Button, Input, Typography } from 'components';

// Theme
import theme from 'themes';

// Types
import { ChangeEvent } from 'types';
import {
  DataAnalysisProperty,
  DataAnalysisTag,
  ProteinMachineRouteQueryParams
} from 'types/protein';
import { JBTRoutes } from 'constants/routes';

// Api
import { useCreateTemplateMutation } from 'api';

interface SaveTemplateModalProps {
  tagsData: DataAnalysisTag[];
  properties: DataAnalysisProperty[];
  templateName: string;
  closeModal: () => void;
  handleNameChange: (name: string) => void;
}

// Styling
export const MainViewContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: center;
  background-image: radial-gradient(${theme.colors.darkGrey} 3%, transparent 4%);
  background-color: ${theme.colors.lightGrey1};
  background-position: 0 0, 0.3125rem 0.3125rem;
  background-size: 1.5625rem 1.5625rem;
`;

const Header = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const NewTemplateContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem;
  padding-top: 1.875rem;
`;

const NewTemplateContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NewTemplateDescriptionContainer = styled.div`
  margin-top: 0.625rem;
  margin-bottom: 0.9375rem;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: 0em;
  text-align: left;
`;

const NewTemplateDisclaimerContainer = styled.div`
  margin-top: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: 0em;
  text-align: left;
  color: #979797;
`;

const TemplateButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;

  > * + * {
    margin-left: 0.875rem;
  }
`;

const SaveTemplateModal = ({
  properties,
  tagsData,
  templateName,
  closeModal,
  handleNameChange
}: SaveTemplateModalProps): JSX.Element => {
  const [createTemplate] = useCreateTemplateMutation();

  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { t } = useTranslation(['mh']);

  const history = useHistory();
  const templateReload = (selectedTemplateId: string) => {
    history.push({
      pathname: JBTRoutes.machineHealthDataAnalysisTemplate.replace(':machineId', machineId),
      search: `?templateId=${selectedTemplateId}`
    });
  };

  return (
    <>
      <Header>
        <Typography as="h3" mb={0} size="1.3125rem" weight="bold">
          {t('save_as_copy')}
        </Typography>
      </Header>
      <NewTemplateContainer>
        <NewTemplateContentContainer>
          <Typography as="h3" mb={0} size="1.3125rem" weight="bold">
            {t('new_view')}
          </Typography>
          <NewTemplateDescriptionContainer>
            {t('new_template_description')}
          </NewTemplateDescriptionContainer>
          <Input
            variant="white"
            placeholder={t('template_name')}
            width="100%"
            value={templateName}
            onChange={(event: ChangeEvent) => {
              const templateName = event.target.value as string;
              handleNameChange(templateName);
            }}
          />
          <NewTemplateDisclaimerContainer>
            {t('template_disclaimer_content')}
          </NewTemplateDisclaimerContainer>
        </NewTemplateContentContainer>
        <TemplateButtonsContainer>
          <Button onClick={closeModal}>{t('cancel', { ns: 'common' })}</Button>
          <Button
            variant="primary"
            onClick={() => {
              createTemplate({
                machineId: machineId,
                template: {
                  viewName: templateName,
                  tags: tagsData,
                  properties: properties
                }
              })
                .unwrap()
                .then((templateResponse) => {
                  if (templateResponse && templateResponse.viewId) {
                    toast.success(t('view_saved'), {
                      toastId: 'view-saved'
                    });
                    closeModal();
                    templateReload(templateResponse.viewId);
                  } else {
                    toast(t('problem_saving_the_view'));
                  }
                })
                .catch((error) => {
                  console.warn('Save view error: ', error);
                  toast(t('problem_saving_the_view'));
                });
            }}
          >
            {t('save', { ns: 'common' })}
          </Button>
        </TemplateButtonsContainer>
      </NewTemplateContainer>
    </>
  );
};

export default SaveTemplateModal;
