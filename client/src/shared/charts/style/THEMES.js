import COLORS from './COLORS';

/**
 * Set of color themes based on colors in COLORS.js
 * @author Aryan Pandey
 * @author Grace Whitney
 */
export default {
  // The default color theme
  NORMAL: [
    COLORS.BLUE,
    COLORS.GREEN,
    COLORS.YELLOW,
    COLORS.RED,
    COLORS.PURPLE,
    COLORS.ALT_BLUE,
    COLORS.ALT_GREEN,
    COLORS.ALT_YELLOW,
    COLORS.ALT_RED,
    COLORS.ALT_PURPLE,
  ],
  // Set of nice/good/pleasant colors
  PLEASANT: [
    COLORS.BLUE,
    COLORS.PURPLE,
    COLORS.GREEN,
  ],
  // Set of unpleasant/bad colors
  UNPLEASANT: [
    COLORS.PURPLE,
    COLORS.RED,
    COLORS.YELLOW,
  ],
};
