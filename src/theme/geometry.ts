import { tokens } from './tokens';

export interface CardGeometry {
  width: number;
  height: number;
  radius: number;
  /** Width of a Home mini card (2 columns). */
  miniWidth: number;
  /** Area available for the question text on the front face. */
  textBox: { width: number; height: number };
}

/** Fixed heights inside the front face (top icon row, footer). */
export const FRONT_LAYOUT = {
  topRow: 36,
  footer: 28,
  padding: 8,
} as const;

/**
 * Card size for a screen: width = min(screenWidth − 48, 360) (grown up to 25% when the system
 * font scale is large), height = width / ratio, both reduced when the height does not fit
 * the available height (screen height − reservedHeight).
 */
export const getCardGeometry = (
  screen: { width: number; height: number },
  reservedHeight: number,
  fontScale = 1,
): CardGeometry => {
  const { ratio, maxWidth, frame, innerInset, radiusRatio } = tokens.card;
  const { screenPadding, gridGap } = tokens.layout;
  const growth = Math.min(Math.max(fontScale, 1), 1.25);
  let width = Math.min(screen.width - screenPadding * 2, maxWidth * growth);
  let height = width / ratio;
  const available = screen.height - reservedHeight;
  if (available > 0 && height > available) {
    height = available;
    width = height * ratio;
  }
  const inset = frame + innerInset + FRONT_LAYOUT.padding;
  return {
    width,
    height,
    radius: radiusRatio * width,
    miniWidth: (screen.width - screenPadding * 2 - gridGap) / 2,
    textBox: {
      width: width - inset * 2,
      height: height - inset * 2 - FRONT_LAYOUT.topRow - FRONT_LAYOUT.footer,
    },
  };
};

/** Base question size by length: ≤ 120 → 26pt, 121–160 → 23pt, 161–200 → 21pt. */
export const questionBaseSize = (text: string): 26 | 23 | 21 => {
  if (text.length <= 120) return 26;
  if (text.length <= 160) return 23;
  return 21;
};

/** Average glyph width (em) and line height used to estimate wrapped text height. */
const CHAR_WIDTH_EM = 0.5;
const LINE_HEIGHT_EM = 1.25;

export const estimateTextHeight = (text: string, boxWidth: number, size: number): number => {
  const charsPerLine = Math.max(1, Math.floor(boxWidth / (size * CHAR_WIDTH_EM)));
  const words = text.split(/\s+/);
  let lines = 1;
  let current = 0;
  for (const word of words) {
    const len = word.length;
    if (current === 0) current = len;
    else if (current + 1 + len <= charsPerLine) current += 1 + len;
    else {
      lines += 1;
      current = len;
    }
  }
  return lines * size * LINE_HEIGHT_EM;
};

export interface QuestionFit {
  /** Value for the Text `fontSize` prop (before the OS font scale is applied). */
  fontSize: number;
  /** Rendered size in pt (fontSize × fontScale), never below the minimum. */
  renderedSize: number;
  /** For `adjustsFontSizeToFit`: never shrink below the 20pt minimum. */
  minimumFontScale: number;
  lineHeight: number;
  fits: boolean;
}

/**
 * Starts at `questionBaseSize(text)` scaled by the OS font scale and steps down until the text
 * fits the box, never below `tokens.type.minQuestionSize` (20pt).
 */
export const questionFit = (text: string, boxWidth: number, boxHeight: number, fontScale = 1): QuestionFit => {
  const min = tokens.type.minQuestionSize;
  let rendered = Math.max(questionBaseSize(text) * fontScale, min);
  while (rendered > min && estimateTextHeight(text, boxWidth, rendered) > boxHeight) {
    rendered = Math.max(min, rendered - 1);
  }
  return {
    fontSize: rendered / fontScale,
    renderedSize: rendered,
    minimumFontScale: Math.min(1, min / rendered),
    lineHeight: (rendered * LINE_HEIGHT_EM) / fontScale,
    fits: estimateTextHeight(text, boxWidth, rendered) <= boxHeight,
  };
};
