import THEMES from './THEMES';

/**
 * List of themes (array of pairs of colors and textures)
 * @author Gabe Abrams
 * @param {object} [colorMap={}] - map id => color def from COLORS.js
 * @param {object} [theme=THEMES.NORMAL] - the color theme from THEMES.js
 * @return {function} mapping function that returns a color def given a series
 *   id
 */
export default (colorMap = {}, theme = THEMES.NORMAL) => {
  // Get the full list of colors
  // > Start with the colors in the map
  const allChartColors = Object.values(colorMap);
  // > Start the index at the end of the colorMap colors
  let nextColorIndex = allChartColors.length;
  // > Add in theme colors that aren't already in the list
  theme.forEach((color) => {
    if (allChartColors.indexOf(color) < 0) {
      allChartColors.push(color);
    }
  });

  /**
   * Get the color def for a series id
   * @author Gabe Abrams
   * @param {string} [id] - the id of the series
   * @return {object} the color def for this series, or just the next color in
   *   the sequence if no id is provided
   */
  const genDef = (id) => {
    // If the id is in the colorMap, return that def
    if (colorMap[id]) {
      return colorMap[id];
    }

    // Choose the next color
    const color = allChartColors[nextColorIndex % allChartColors.length];

    // Increment the next color index
    nextColorIndex += 1;

    // Return the color
    return color;
  };

  /**
   * Generate the defs and fill object arrays for a chart
   * @author Grace Whitney
   * @param  {string[]} ids - an array of the series ids to generate defs and
   *   fill arrays for
   * @return {object} - an object that contains the defs and fill arrays for the
   *   specified series ids
   */
  return (ids) => {
    const defs = [];
    const fill = [];

    // Add def and fill objects for each id
    ids.forEach((id) => {
      const colorDef = genDef(id);
      defs.push(colorDef);
      fill.push({
        match: {
          id,
        },
        id: colorDef.id,
      });
    });

    return ({ defs, fill });
  };
};
