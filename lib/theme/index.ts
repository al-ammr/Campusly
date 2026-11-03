export type ThemeChoice = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'campusly_theme';

export const themeInitScript = `
(function() {
  try {
    var key = 'campusly_theme';
    var stored = localStorage.getItem(key);
    var choice = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    var isDark = choice === 'dark' || (choice === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } catch (e) {}
})();
`;
