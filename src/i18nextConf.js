import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationCS from './assets/locales/cs/translation.json'
import translationEN from './assets/locales/en/translation.json'
const fallbackLng = "cs";
const availableLanguages = ['cs', 'en'];

const resources = {
    cs: {
        translation: translationCS
    },
    en: {
        translation: translationEN
    }
};

i18n
    .use(Backend) // load translations using http (default public/assets/locals/en/translations)
    .use(LanguageDetector) // detect user language
    .use(initReactI18next) // pass the i18n instance to react-i18next.
    .init({
        resources,
        detection: {
            checkWhitelist: true, // options for language detection
        },
        fallbackLng,
        debug: false,

        whitelist: availableLanguages,

        interpolation: {
            escapeValue: false, // no need for react. it escapes by default
        }
    });

export default i18n;
