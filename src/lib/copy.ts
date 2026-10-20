export const flash = (b: HTMLElement, msg = 'Copiado') => {
  const old = b.textContent;
  b.textContent = msg;
  setTimeout(() => (b.textContent = old), 1200);
};

export const copy = async (b: HTMLElement, text: string) => {
  try { await navigator.clipboard.writeText(text); flash(b); } catch { flash(b, 'No se pudo copiar'); }
};
