import React, { createContext, ReactNode, useContext } from 'react';

/**
 * Provide language info from parent down to all its nested children
 */

type ContextType = {
  language: string;
  languageId: string;
  languageName: string;
  languageNameInEnglish: string;
  region: string;
};

const defaultValue = {
  language: 'en-US',
  languageId: 'en',
  languageName: 'English',
  languageNameInEnglish: 'English',
  region: 'US'
};

export const LanguageContext = createContext<ContextType>(defaultValue);

export const useLanguage = (): ContextType => {
  return useContext(LanguageContext);
};

type Props = {
  context: ContextType;
  children: ReactNode;
};

export const LanguageProvider = (props: Props): JSX.Element => {
  return (
    <LanguageContext.Provider value={props.context}>{props.children}</LanguageContext.Provider>
  );
};
