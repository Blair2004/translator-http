// Basic ISO 639-1 language code to English name mapping.
export const LANGUAGE_NAMES = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  ar: 'Arabic',
  hi: 'Hindi',
  tr: 'Turkish',
  pl: 'Polish',
  sv: 'Swedish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
  cs: 'Czech',
  ro: 'Romanian',
  el: 'Greek',
  he: 'Hebrew',
  id: 'Indonesian',
  vi: 'Vietnamese',
  th: 'Thai'
};

export function expandLanguage(code) {
  if (!code) return { code, name: code };
  const c = code.toLowerCase();
  return { code: c, name: LANGUAGE_NAMES[c] || c };
}
