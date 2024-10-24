import i18n from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { fileURLToPath } from 'url';

// Recréation de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de i18n
i18n.use(Backend).init({
  backend: {
    loadPath: path.join(__dirname, '../locales/{{lng}}.json'), // Chemin des fichiers de traduction
  },
  fallbackLng: 'ar',
  preload: ['en', 'fr', 'ar'], // Charger les langues au démarrage
  interpolation: {
    escapeValue: false, // Désactiver l'échappement pour les variables
  },
  detection: {
    order: ['querystring', 'cookie', 'header'], // Méthodes de détection de la langue
    caches: ['cookie']
  }
});

export default i18n;
