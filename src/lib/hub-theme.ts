import { customize, fromParams, type Overrides } from './customize';
import { THEMES, type Theme } from './themes';

export type HubState = { styleId: string; overrides: Overrides };

const STYLE_KEY = 'hub-style';
const CUSTOM_KEY = 'hub-custom';

const readStored = (key: string) => {
  try { return localStorage.getItem(key); } catch { return null; }
};

const storedOverrides = (): Overrides => {
  try { return JSON.parse(readStored(CUSTOM_KEY) ?? '{}') ?? {}; } catch { return {}; }
};

const knownStyle = (id: string | null) => THEMES.find((t) => t.id === id)?.id ?? THEMES[0].id;

export const readState = (): HubState => {
  const fromUrl = fromParams(new URLSearchParams(location.search));
  if (fromUrl.styleId) return { styleId: knownStyle(fromUrl.styleId), overrides: fromUrl.overrides };
  return { styleId: knownStyle(readStored(STYLE_KEY)), overrides: storedOverrides() };
};

export const saveState = (styleId: string, overrides: Overrides) => {
  try {
    localStorage.setItem(STYLE_KEY, styleId);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(overrides));
  } catch {}
};

export const currentTheme = (state: HubState = readState()): Theme =>
  customize(THEMES.find((t) => t.id === state.styleId) ?? THEMES[0], state.overrides);
