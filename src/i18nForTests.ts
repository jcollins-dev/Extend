import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: ['fpns'],
  defaultNS: 'fpns',

  debug: true,

  resources: {
    en: {
      common: COMMON_EN,
      fpns: FPNS_EN,
      mh: MH_EN
    },
    de: {
      common: COMMON_DE,
      fpns: FPNS_DE,
      mh: MH_DE
    },
    it: {
      common: COMMON_IT,
      fpns: FPNS_IT,
      mh: MH_IT
    }
  }
});

export default i18n;
