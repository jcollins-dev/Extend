import i18next from 'i18next';

import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import CrowdinBackend from './i18nCrowdinOTA';

//Import all translation files
import COMMON_EN from 'locale/en/common.json';
import FPNS_EN from 'locale/en/fpns.json';

import MH_EN from 'locale/en/mh.json';
import COMMON_DE from 'locale/de/common.json';
import FPNS_DE from 'locale/de/fpns.json';
import MH_DE from 'locale/de/mh.json';
import COMMON_IT from 'locale/it/common.json';
import FPNS_IT from 'locale/it/fpns.json';
import MH_IT from 'locale/it/mh.json';

// Always include english in resources so we
// pull english strings from our local /src/locale/en files
// eslint-disable-next-line
const resources: any = {
  en: {
    common: COMMON_EN,
    fpns: FPNS_EN,
    mh: MH_EN
  }
};

if (process.env.REACT_APP_CROWDIN_INTEGRATION === 'true') {
  i18next.use(new CrowdinBackend());
} else {
  resources['de'] = {
    common: COMMON_DE,
    fpns: FPNS_DE,
    mh: MH_DE
  };

  resources['it'] = {
    common: COMMON_IT,
    fpns: FPNS_IT,
    mh: MH_IT
  };
}

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: resources,
    fallbackLng: 'en-US',
    ns: ['common', 'fpns', 'mh'],
    partialBundledLanguages: true
  });

export default i18next;
