import type { Theme } from './themes';

const ROOT = ':root';
const DARK = ':root[data-theme=dark]';

const blockBounds = (code: string, selector: string) => {
  const start = code.indexOf(`${selector}{`);
  if (start < 0) return null;
  const open = start + selector.length + 1;
  return { open, close: code.indexOf('}', open) };
};

const setDeclaration = (body: string, token: string, value: string) => {
  const existing = new RegExp(`(^|;)(\\s*)${token}:[^;]*`);
  if (existing.test(body)) return body.replace(existing, (_, sep: string, space: string) => `${sep}${space}${token}:${value}`);
  return `${body.replace(/;\s*$/, '')};${token}:${value}`;
};

const overrideBlock = (code: string, selector: string, overrides: Record<string, string>) => {
  const bounds = blockBounds(code, selector);
  if (!bounds) return code;
  const body = Object.entries(overrides).reduce(
    (acc, [token, value]) => setDeclaration(acc, token, value),
    code.slice(bounds.open, bounds.close),
  );
  return code.slice(0, bounds.open) + body + code.slice(bounds.close);
};

export function applyTheme(code: string, theme: Theme): string {
  if (!blockBounds(code, ROOT)) return code;
  const themed = overrideBlock(overrideBlock(code, ROOT, theme.light), DARK, theme.dark);
  if (!theme.font) return themed;
  const anchor = (blockBounds(themed, DARK) ?? blockBounds(themed, ROOT))!;
  return themed.slice(0, anchor.close + 1) + `body{font-family:${theme.font}}` + themed.slice(anchor.close + 1);
}
