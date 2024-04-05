import i18next from 'i18next';
import common_vi from './lang/vi.json';
import common_en from './lang/en.json';
import common_ko from './lang/ko.json';

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: 'en', // language to use
  resources: {
    en: {
      common: common_en, // 'common' is our custom namespace
    },
    vi: {
      common: common_vi,
    },
    ko: {
      common: common_ko,
    },
  },
});

export default i18next;
