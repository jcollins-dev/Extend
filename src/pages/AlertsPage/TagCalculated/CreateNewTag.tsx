import ButtonComponent from 'components/Button';
import React, { useState } from 'react';
import { DropdownSubOptions } from '../Step3/DropdownSubOptions';
import {
  BottomWrapper,
  ButtonWrapper,
  DropdownWrapper,
  Heading,
  HeadingWrapper,
  InputWrapper,
  NewTagWrapper,
  Section,
  SectionOne,
  SectionTwo,
  StyledTextarea,
  TextAreaWrapper
} from './index.elements';
import { Input, InputLabel, Loader, TooltipWrapper } from 'components';
import { useTranslation } from 'react-i18next';
import ToolTipIcon from '../assets/info_logo.svg';
import { useGetMachineDataAnalysisTagsQuery } from 'api';
import { skipToken } from '@reduxjs/toolkit/dist/query';

type Props = {
  machineId: string | undefined;
};

const CreateNewTag = ({ machineId }: Props): JSX.Element => {
  const { t } = useTranslation(['mh']);

  const {
    data: tagValues,
    isFetching: isFetchingTagValues,
    isError: isErrorTagValues
  } = useGetMachineDataAnalysisTagsQuery(
    machineId
      ? {
          machineId: machineId
        }
      : skipToken
  );

  const [dropdownValue, setDropdownValue] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  if (isFetchingTagValues) {
    return <Loader />;
  }

  const TagDropdownOptions =
    tagValues &&
    !isErrorTagValues &&
    tagValues
      .filter((tag) => {
        return tag.value !== 0;
      })
      .map((tag) => ({ label: tag.tagId, value: tag.value as string }));

  return (
    <NewTagWrapper>
      <HeadingWrapper>
        <Heading>{t('calculated_tag')}</Heading>
      </HeadingWrapper>
      <Section>
        <SectionOne>
          <InputWrapper>
            <Input
              label={t('tag_name') as string}
              mandatory
              variant="white"
              placeholder={t('provide_a_name_to_your_tag') as string}
            />
          </InputWrapper>
          <TextAreaWrapper>
            <InputLabel>{t('tag_description')}</InputLabel>
            <StyledTextarea placeholder={t('description') as string} />
          </TextAreaWrapper>
        </SectionOne>
        <SectionTwo>
          <TextAreaWrapper>
            <div
              style={{
                display: 'flex'
              }}
            >
              <InputLabel mandatory>{t('expression')}</InputLabel>
              <TooltipWrapper Tooltip={t('expression') as string}>
                <img
                  style={{ cursor: 'pointer', marginTop: '-.2rem', marginLeft: '.5rem' }}
                  src={ToolTipIcon}
                  alt="ToolTip Icon"
                />
              </TooltipWrapper>
            </div>
            <StyledTextarea rows={5} />
          </TextAreaWrapper>
          <BottomWrapper>
            <DropdownWrapper>
              <DropdownSubOptions
                options={TagDropdownOptions ? TagDropdownOptions : []}
                handleMultiSelect={(e) => setDropdownValue(e)}
                value={dropdownValue}
                placeholder={t('select_tags_to_insert_into_the_expression') as string}
                isCustomAddButton
              />
            </DropdownWrapper>
            <ButtonWrapper>
              <ButtonComponent borderRadius="48px">{t('cancel')}</ButtonComponent>
              <ButtonComponent borderRadius="48px" variant="primary">
                {t('save')}
              </ButtonComponent>
            </ButtonWrapper>
          </BottomWrapper>
        </SectionTwo>
      </Section>
    </NewTagWrapper>
  );
};

export default CreateNewTag;
