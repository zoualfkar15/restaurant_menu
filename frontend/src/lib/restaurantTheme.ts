import type { CSSProperties } from 'react';

/** Default MenuQR teal (`primary-600`). Used when a restaurant has no custom color. */
export const DEFAULT_PRIMARY_HEX = '#087f5b';
const LOADING_PRIMARY_HEX = '#8a8a86';

const PRIMARY_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
type PrimaryStep = (typeof PRIMARY_STEPS)[number];

/** Mix toward white (tints) or black (shades) from the 600-level hex. */
const MIX: Record<PrimaryStep, { toward: 'white' | 'black'; amount: number }> = {
  50: { toward: 'white', amount: 0.92 },
  100: { toward: 'white', amount: 0.8 },
  200: { toward: 'white', amount: 0.62 },
  300: { toward: 'white', amount: 0.42 },
  400: { toward: 'white', amount: 0.22 },
  500: { toward: 'white', amount: 0.08 },
  600: { toward: 'white', amount: 0 },
  700: { toward: 'black', amount: 0.18 },
  800: { toward: 'black', amount: 0.36 },
  900: { toward: 'black', amount: 0.52 },
  950: { toward: 'black', amount: 0.7 },
};

export function parseHexColor(value: string | null | undefined): string | null {
  if (!value) return null;
  const hex = value.trim();
  return /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex.toLowerCase() : null;
}

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function mixChannel(from: number, to: number, amount: number) {
  return Math.round(from + (to - from) * amount);
}

function paletteChannels(hex: string): Record<PrimaryStep, string> {
  const [r, g, b] = hexToRgb(hex);
  const out = {} as Record<PrimaryStep, string>;
  for (const step of PRIMARY_STEPS) {
    const { toward, amount } = MIX[step];
    const [tr, tg, tb] = toward === 'white' ? [255, 255, 255] : [0, 0, 0];
    out[step] = `${mixChannel(r, tr, amount)} ${mixChannel(g, tg, amount)} ${mixChannel(b, tb, amount)}`;
  }
  return out;
}

export function primaryCssVars(hex: string): CSSProperties {
  const palette = paletteChannels(hex);
  const style: Record<string, string> = {};
  for (const step of PRIMARY_STEPS) {
    style[`--primary-${step}`] = palette[step];
  }
  return style as CSSProperties;
}

export function restaurantThemeStyle(options: { loading?: boolean; color?: string | null }): CSSProperties | undefined {
  if (options.loading) return primaryCssVars(LOADING_PRIMARY_HEX);
  const custom = parseHexColor(options.color ?? null);
  if (!custom) return undefined;
  return primaryCssVars(custom);
}
