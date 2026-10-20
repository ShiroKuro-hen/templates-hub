import themes from './themes.json';

export type Theme = { id: string; label: string; light: Record<string, string>; dark: Record<string, string>; font?: string };

export const THEMES = themes as Theme[];

const block = (selector: string, vars: Record<string, string>) =>
  Object.keys(vars).length ? `${selector}{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')}}` : '';

export const themeCss = (t: Theme) =>
  block(':root[data-theme=light]', t.light) + block(':root[data-theme=dark]', t.dark) + (t.font ? `body{font-family:${t.font}}` : '');
