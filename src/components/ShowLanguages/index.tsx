// 3rd Party
import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// Components
import BaseSelect from 'components/BaseSelect/BaseSelect';

// Api
import { useGetLanguagesQuery } from 'api';

// Types
import { SelectChangeHandler } from 'types';

// Providers
import { useLanguage } from 'providers';
import Loader from 'components/Loader';
import { shouldNotShowLanguageDropdown } from 'helpers';
import { useLocation } from 'react-router-dom';

const ShowLanguagesContainer = styled.div`
  cursor: pointer;
  position: absolute;
  color: ${(props) => props.theme.colors.darkGrey};
  top: 1.3125rem;
  right: 5.5rem;
  height: 2rem;
  select {
    padding-right: 2rem;
  }
`;

const ShowLanguages = (): ReactElement => {
  const location = useLocation();
  const showLanguagesDropdown = !shouldNotShowLanguageDropdown(location.pathname);
  const { data: languages, isFetching: languagesLoading } = useGetLanguagesQuery();
  const { languageId } = useLanguage();
  const { i18n } = useTranslation(['common']);
  const [language, setLanguage] = useState(languageId);

  const getLanguages = () =>
    languages?.map((a) => ({
      value: a.id,
      label: `${a.name} - ${a.id.toUpperCase()}` || a.id
    })) || [];

  const onClickLanguageChange: SelectChangeHandler = (event): void => {
    const language = typeof event.target.value === 'string' ? event.target.value : '';
    setLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <>
      {showLanguagesDropdown && (
        <ShowLanguagesContainer>
          {languagesLoading && <Loader />}
          {!languagesLoading && (
            <BaseSelect
              value={language}
              handleChange={onClickLanguageChange}
              options={getLanguages()}
              variant="white"
            />
          )}
        </ShowLanguagesContainer>
      )}
    </>
  );
};

export default ShowLanguages;
