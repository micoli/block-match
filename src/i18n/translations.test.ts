import { describe, expect, it } from 'vitest';
import translations from './translations.yaml';
import { detectLanguage, translate } from './translate';
import type { Language, Messages } from './translate';

const catalog = translations as Record<Language, Messages>;

const flatten = (messages: Messages, prefix = ''): string[] =>
  Object.entries(messages).flatMap(([key, value]) =>
    typeof value === 'string' ? [`${prefix}${key}`] : flatten(value, `${prefix}${key}.`),
  );

const sources = import.meta.glob<string>(['../**/*.ts', '../**/*.tsx', '!../**/*.test.ts'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

describe('translations', () => {
  it('defines the same keys in every language', () => {
    expect(flatten(catalog.en).sort()).toEqual(flatten(catalog.fr).sort());
  });

  it('defines every key used in the source', () => {
    const known = new Set(flatten(catalog.fr));
    const used = Object.values(sources).flatMap((code) =>
      [...code.matchAll(/\bt\(\s*'([\w.]+)'/g)].map(([, key]) => key),
    );
    expect(used.length).toBeGreaterThan(20);
    used.forEach((key) => expect(known, key).toContain(key));
  });

  it('keeps the same placeholders in every language', () => {
    const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();
    flatten(catalog.fr).forEach((key) => {
      expect(placeholders(translate(catalog, 'en', key)), key).toEqual(placeholders(translate(catalog, 'fr', key)));
    });
  });
});

describe('translate', () => {
  it('interpolates params and falls back to the key', () => {
    expect(translate(catalog, 'en', 'common.level', { level: 3 })).toBe('Level 3');
    expect(translate(catalog, 'fr', 'common.level', { level: 3 })).toBe('Niveau 3');
    expect(translate(catalog, 'en', 'nope.missing')).toBe('nope.missing');
  });
});

describe('detectLanguage', () => {
  it('prefers the saved language, then the browser, then French', () => {
    expect(detectLanguage('en', 'fr-FR')).toBe('en');
    expect(detectLanguage(null, 'en-GB')).toBe('en');
    expect(detectLanguage(null, 'fr-CA')).toBe('fr');
    expect(detectLanguage('xx', 'de-DE')).toBe('fr');
  });
});
