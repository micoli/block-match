import { LANGUAGES } from './translate';
import { useI18n } from './useI18n';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="language-switcher" role="group" aria-label={t('home.language')}>
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          className={`language-switcher__button ${code === language ? 'language-switcher__button--active' : ''}`}
          aria-pressed={code === language}
          onClick={() => setLanguage(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
