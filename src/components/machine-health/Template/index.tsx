import React, { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

// 3rd party libs
import styled from 'styled-components';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// Theme
import theme from 'themes';
// Types
import { DataAnalysisView, ProteinMachineRouteQueryParams } from 'types/protein';
import { AddFileIcon, ChevronThinIcon, MoreIcon, TemplateIcon } from 'icons';

// Components
import { Button, UserPrompt } from 'components';

// Api
import { useDeleteTemplateMutation } from 'api';

interface DataAnalysisTemplateProps {
  templateInfo?: DataAnalysisView;
  backgroundColor?: string;
  createTemplate?: boolean;
  onClick?: (selectedTemplateId?: string) => void;
}

const TemplateDiv = styled.div<DataAnalysisTemplateProps>`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  padding-top: 0.5rem;
  cursor: pointer;
  background: ${({ backgroundColor, theme }) =>
    backgroundColor ? backgroundColor : theme.colors.white};
  border-radius: 0.375rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.mediumGrey1};
  align-items: center;
  justify-content: flex-start;
  margin: 1.25rem 0;
`;

const TemplateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: flex-start;
`;

const TemplateWrapperContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const TemplateMoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  padding-bottom: 1rem;
  padding-top: 1rem;
  padding-left: 0.5rem;
  position: relative;
`;

const ButtonContainer = styled(Button)`
  position: absolute;
  margin-top: 1rem;
  align-self: flex-end;
  padding: 0.5rem;
  font-weight: 400;
  border-radius: 0.325rem;
  width: 6rem;
  color: ${theme.colors.black};
  background-color: ${theme.colors.white};
`;

const TemplateTitle = styled.div`
  color: ${theme.colors.mediumBlue};
  margin-bottom: 0.5rem;
  margin-left: 1rem;
  font-size: 1.3125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5625rem;
  letter-spacing: 0em;
  text-align: center;
`;

const TemplateTimeStamp = styled.div`
  color: ${theme.colors.mediumGrey2};
  margin-left: 1rem;
  font-size: 0.8125rem;
`;

const ChevronIconContainer = styled.div`
  margin-left: 1rem;
  align-self: center;
`;

export const DataAnalysisTemplate: FC<DataAnalysisTemplateProps> = (templateInfo) => {
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { t } = useTranslation(['mh']);
  const viewName = templateInfo ? templateInfo?.templateInfo?.viewName : t('new_template');
  const viewId = templateInfo ? templateInfo?.templateInfo?.viewId : '';
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTemplate] = useDeleteTemplateMutation();

  const clickHandler = () => {
    templateInfo.onClick && templateInfo?.onClick(templateInfo.templateInfo?.viewId);
  };

  const moreClickHandler = (event: MouseEvent) => {
    setShowDelete(true);
    event.stopPropagation();
  };

  const deleteViewHandler = () => {
    setShowDelete(false);
    setShowDeleteModal(true);
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = () => {
    deleteTemplate({
      machineId: machineId,
      templateId: viewId || ''
    })
      .unwrap()
      .then(() => {
        toast.success(t('view_deleted'), {
          toastId: 'view-deleted'
        });
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.warn('Delete view error: ', error);
        toast(t('problem_deleting_the_view'));
      });
    setShowDeleteModal(false);
  };

  return (
    <>
      <TemplateDiv
        onMouseLeave={() => setShowDelete(false)}
        backgroundColor={templateInfo.backgroundColor}
        key={`${viewName}`}
      >
        <TemplateMoreContainer onClick={moreClickHandler}>
          {!templateInfo.createTemplate && MoreIcon()}
        </TemplateMoreContainer>

        {showDelete && (
          <ButtonContainer onClick={deleteViewHandler}>{t('delete_view')}</ButtonContainer>
        )}
        <TemplateWrapperContainer onClick={clickHandler}>
          {viewName ? TemplateIcon() : AddFileIcon()}
          <TemplateContainer>
            <TemplateTitle>{viewName ? viewName : t('create_new_view')}</TemplateTitle>
            {templateInfo.templateInfo && (
              <TemplateTimeStamp>{templateInfo?.templateInfo?.timestampCreated}</TemplateTimeStamp>
            )}
          </TemplateContainer>
          <ChevronIconContainer>{ChevronThinIcon()}</ChevronIconContainer>
        </TemplateWrapperContainer>
      </TemplateDiv>
      <UserPrompt
        visible={showDeleteModal}
        message={t('template_delete_prompt', { item: viewName })}
        subMessage={t('template_delete_submessage') as string}
        promptIcon={faExclamationTriangle}
        promptIconColor={theme.colors.negativeRed}
        primaryActionLabel={t('delete', { ns: 'common' })}
        primaryActionColor={theme.colors.negativeRed}
        primaryActionBorderColor={theme.colors.negativeRed}
        secondaryActionLabel={t('cancel', { ns: 'common' })}
        handleCancel={handleCancel}
        handlePrimaryAction={handleDelete}
        handleSecondaryAction={handleCancel}
      />
    </>
  );
};

export default DataAnalysisTemplate;
