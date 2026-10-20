import type { Theme } from './themes';

const CLOSING = 'Usa estas variables CSS (--bg, --surface, --text, --muted, --border, --accent, --accent-ink, --accent-soft, --radius, --shadow) en lugar de colores fijos.';

const hasStyle = (t: Theme) => Object.keys(t.light).length > 0 || Object.keys(t.dark).length > 0 || Boolean(t.font);

const lightValues = (t: Theme): [string, string | undefined][] => [
  ['acento', t.light['--accent']],
  ['color secundario del degradado', t.light['--accent-2']],
  ['radio de esquina', t.light['--radius']],
  ['sombra', t.light['--shadow']],
  ['fuente', t.font],
  ['fondo', t.light['--bg']],
  ['superficie', t.light['--surface']],
  ['texto', t.light['--text']],
];

const DARK_NAMES: [string, string][] = [
  ['fondo', '--bg'],
  ['superficie', '--surface'],
  ['texto', '--text'],
  ['acento', '--accent'],
];

const darkChanges = (t: Theme) =>
  DARK_NAMES.flatMap(([name, key]) => (t.dark[key] && t.dark[key] !== t.light[key] ? [`${name} ${t.dark[key]}`] : []));

export const stylePrompt = (theme: Theme): string => {
  if (!hasStyle(theme)) return '';
  const dark = darkChanges(theme);
  const lines = [
    `Estilo visual: ${theme.label}.`,
    ...lightValues(theme).flatMap(([name, value]) => (value ? [`- ${name}: ${value}`] : [])),
    ...(dark.length ? [`- modo oscuro: ${dark.join(', ')}`] : []),
    CLOSING,
  ];
  return `\n${lines.join('\n')}`;
};
