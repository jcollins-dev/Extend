export const getLanguageId = (localeOrLanguageId = 'en-US'): string => {
  const localeOrLanguageIdParts = localeOrLanguageId.split('-');
  return localeOrLanguageIdParts[0];
};

export const getUserRegion = (localeOrLanguageId = 'en-US'): string => {
  const localeOrLanguageIdParts = localeOrLanguageId.split('-');
  return localeOrLanguageIdParts[1];
};

export const getUserLanguage = (localeOrLanguageId = 'en-US', displayLanguage?: string): string => {
  const languageId = getLanguageId(localeOrLanguageId);
  const nameGenerator = new Intl.DisplayNames(
    displayLanguage ? getLanguageId(displayLanguage) : 'en',
    { type: 'language' }
  );
  return nameGenerator.of(languageId) as string;
};

export const getLocalizationKey = (value: string): string | string[] => {
  return value.replace(/([A-Z])/g, (str) => `_${str.toLowerCase()}`).replace(/(^_)/g, '');
};
