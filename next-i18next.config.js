/** @type {import('next-i18next').UserConfig} */
module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'zh',
    locales: ['en', 'zh'],
  },
  serializeConfig: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  saveMissing: process.env.NODE_ENV === 'development',
  nonExplicitSupportedLngs: true,
  ns: ['common', 'errorMessage', 'meta', 'auth'],
  preload: ['en', 'zh'],
  defaultNS: 'common',
};
