module.exports = {

  // Maximum allowed height for the bar chart.
  // If height exceeds this value,
  // chart becomes vertically scrollable
  MAX_CHART_HEIGHT_PX: 800,

  // Minimum required width for the bar chart.
  // If width is lower than this value,
  // width is set to this value
  MIN_CHART_WIDTH_PX: 750,

  // Minimum required height for the bar chart.
  // If height is lower than this value,
  // height is set to this value
  MIN_CHART_HEIGHT_PX: 500,

  // Min required bar width when autosize is off.
  // If width is lower, chart expands to cover more space
  MIN_BAR_WIDTH_PX: 40,

  // Max allowed bar width when autosize is off.
  // If width is higher, padding increases to decrease bar width
  MAX_BAR_WIDTH_PX: 100,

  // Initial or default chart margins
  MARGIN_TOP_PX: 20,
  MARGIN_RIGHT_PX: 20,
  MARGIN_BOTTOM_PX: 10,
  MARGIN_LEFT_PX: 80,

  // Tick rotation in degrees
  TICK_ROTATION_DEG: -30,
  // Default legend offset
  DEFAULT_LEGEND_OFFSET_PX: 60,
  // Approximate value for width of single character
  APPROX_CHAR_WIDTH_PX: 8,
};
