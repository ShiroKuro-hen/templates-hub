import type { Theme } from './themes';

export type Overrides = { accent?: string; radius?: number; shadow?: 'none' | 'soft' | 'hard'; font?: 'system' | 'serif' | 'mono' };

const SHADOWS = {
  none: 'none',
  soft: '0 1px 2px rgba(0,0,0,.06),0 6px 20px rgba(0,0,0,.08)',
  hard: '4px 4px 0 var(--text)',
};

const FONTS = {
  system: 'system-ui,-apple-system,"Segoe UI",sans-serif',
  serif: 'Georgia,"Times New Roman",serif',
  mono: 'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
};

const HEX = /^#[0-9a-f]{6}$/i;
const MAX_RADIUS = 32;

const isHex = (v: unknown): v is string => typeof v === 'string' && HEX.test(v);
const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isKey = <K extends string>(map: Record<K, string>, v: unknown): v is K => typeof v === 'string' && Object.hasOwn(map, v);

const clampRadius = (n: number) => Math.min(MAX_RADIUS, Math.max(0, Math.round(n)));
const compact = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Overrides;

const sanitize = (o: Partial<Record<keyof Overrides, unknown>>): Overrides => compact({
  accent: isHex(o.accent) ? o.accent : undefined,
  radius: isNumber(o.radius) ? clampRadius(o.radius) : undefined,
  shadow: isKey(SHADOWS, o.shadow) ? o.shadow : undefined,
  font: isKey(FONTS, o.font) ? o.font : undefined,
});

const linear = (channel: number) => {
  const v = channel / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => linear(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (x: number, y: number) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);

const inkFor = (accent: string) => (contrast(1, luminance(accent)) > contrast(0, luminance(accent)) ? '#ffffff' : '#000000');

const accentVars = (accent: string) => ({
  '--accent': accent,
  '--accent-ink': inkFor(accent),
  '--accent-soft': `color-mix(in srgb,${accent} 14%,var(--bg))`,
  '--accent-2': `color-mix(in srgb,${accent} 55%,#ffffff)`,
});

const overrideVars = (o: Overrides): Record<string, string> => ({
  ...(o.accent ? accentVars(o.accent) : {}),
  ...(o.radius !== undefined ? { '--radius': `${o.radius}px` } : {}),
  ...(o.shadow ? { '--shadow': SHADOWS[o.shadow] } : {}),
});

export const customize = (base: Theme, o: Overrides): Theme => {
  const s = sanitize(o);
  const vars = overrideVars(s);
  const font = s.font ? FONTS[s.font] : base.font;
  return {
    id: base.id,
    label: base.label,
    light: { ...base.light, ...vars },
    dark: { ...base.dark, ...vars },
    ...(font ? { font } : {}),
  };
};

export const toParams = (styleId: string, o: Overrides): URLSearchParams => {
  const s = sanitize(o);
  const params = new URLSearchParams({ s: styleId });
  if (s.accent) params.set('a', s.accent.slice(1));
  if (s.radius !== undefined) params.set('r', String(s.radius));
  if (s.shadow) params.set('sh', s.shadow);
  if (s.font) params.set('f', s.font);
  return params;
};

export const fromParams = (p: URLSearchParams) => {
  const accent = p.get('a');
  return {
    styleId: p.get('s'),
    overrides: sanitize({
      accent: accent === null ? undefined : `#${accent}`,
      radius: parseFloat(p.get('r') ?? ''),
      shadow: p.get('sh') ?? undefined,
      font: p.get('f') ?? undefined,
    }),
  };
};
