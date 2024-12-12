import { getLanguageId, getUserLanguage, getUserRegion } from 'helpers/localization';

describe('Localization helper', () => {
  it('Default or no locale or language code should return "English"', () => {
    const displayableUserLanguage = getUserLanguage();
    expect('English').toEqual(displayableUserLanguage);
  });
  it('Locale "en-US" should return "English"', () => {
    const displayableUserLanguage = getUserLanguage('en-US');
    expect('English').toEqual(displayableUserLanguage);
  });
  it('Locale "en-US" should return "US"', () => {
    const region = getUserRegion('en-US');
    expect('US').toEqual(region);
  });
  it('Locale "en-US" should return "en"', () => {
    const languageId = getLanguageId('en-US');
    expect('en').toEqual(languageId);
  });
  it('Just language code  "de" should return "German"', () => {
    const displayableUserLanguage = getUserLanguage('de');
    expect('German').toEqual(displayableUserLanguage);
  });
  it('Just language code  "de" and display language as "en" should return "German"', () => {
    const displayableUserLanguage = getUserLanguage('de', 'en');
    expect('German').toEqual(displayableUserLanguage);
  });
  it('Just language code  "de" and display language as "de" should return "Deutsch"', () => {
    const displayableUserLanguage = getUserLanguage('de', 'de');
    expect('Deutsch').toEqual(displayableUserLanguage);
  });
  it('Just language code  "it" should return "Italian"', () => {
    const displayableUserLanguage = getUserLanguage('it');
    expect('Italian').toEqual(displayableUserLanguage);
  });
  it('Just language code  "it" and display language as "en" should return "Italian"', () => {
    const displayableUserLanguage = getUserLanguage('it', 'en');
    expect('Italian').toEqual(displayableUserLanguage);
  });
  it('Just language code  "it" and display language as "it" should return "italiano"', () => {
    const displayableUserLanguage = getUserLanguage('it', 'it');
    expect('italiano').toEqual(displayableUserLanguage);
  });
});
