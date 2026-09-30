export type Messages = { [key: string]: string | Messages };

export const LANGUAGES = ['fr', 'en'] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'fr';

export const LOCALES: Record<Language, string> = { fr: 'fr-FR', en: 'en-US' };

const lookup = (messages: Messages, key: string) => {
  const value = key.split('.').reduce<string | Messages | undefined>((node, part) => {
    if (typeof node !== 'object') return undefined;
    return node[part];
  }, messages);
  return typeof value === 'string' ? value : undefined;
};

export const translate = (
  catalog: Record<Language, Messages>,
  language: Language,
  key: string,
  params: Record<string, string | number> = {},
) => {
  const template = lookup(catalog[language], key) ?? lookup(catalog[DEFAULT_LANGUAGE], key) ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
};

export const detectLanguage = (preferred: string | null, browserLanguage: string): Language => {
  const saved = LANGUAGES.find((language) => language === preferred);
  if (saved) return saved;
  return LANGUAGES.find((language) => browserLanguage.toLowerCase().startsWith(language)) ?? DEFAULT_LANGUAGE;
};
