/**
 * A bar chart
 * @author Aryan Pandey
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import chart component
import { ResponsiveBar } from '@nivo/bar';

// Import themes
import genDefs from './style/genDefs';

// Constant values for the bar chart
const DEFAULT_CHART_WIDTH_PX = 750;
const DEFAULT_CHART_HEIGHT_PX = 500;
const MIN_BAR_WIDTH_PX = 40;
const MAX_BAR_WIDTH_PX = 100;

class BarChart extends Component {
  /**
   * Render BarChart
   * @author Aryan Pandey
   */

  render() {
    // destructure props
    const {
      title,
      valueAxisLabel,
      barAxisLabel,
      minValue,
      maxValue,
      lessPaddingBetweenBars,
      bars,
      showLegend,
      autoSizeOff,
      horizontal,
      tooltipFormatter,
      theme,
      colorMap,
    } = this.props;

    /* ------------------------ Translate Bars Data ------------------------- */

    // Array to hold translated bars data for the chart
    const data = [];

    // initialize keys array to only have valueAxisLabel as key in the start
    const keys = [valueAxisLabel];

    // Translate chart data from bars prop to data array usable by nivo
    bars.forEach((bar) => {
      // Check if only one value is present for a bar label
      if (bar.value) {
        data.push({ [barAxisLabel]: bar.label, [valueAxisLabel]: bar.value });
        return;
      }

      // Check if multiple values is present for a bar label
      if (bar.values) {
        data.push({ [barAxisLabel]: bar.label, ...bar.values });
        // Update keys array
        Object.keys(bar.values).forEach((valueLabel) => {
          // Add in key if not already in the array
          if (keys.indexOf(valueLabel) < 0) {
            keys.push(valueLabel);
          }
        });
      }
    });

    /* ------------------------- Initialize Defaults ------------------------ */
    // Set up default margins
    const margin = {
      top: 20, right: 20, bottom: 10, left: 80,
    };

    // boolean that sets padding flag
    let padding = (lessPaddingBetweenBars ? 0.1 : 0.3);

    // Declare variables for chart width and height
    let chartWidth = DEFAULT_CHART_WIDTH_PX;
    let chartHeight = DEFAULT_CHART_HEIGHT_PX;

    // number of bars
    const numBars = data.length;

    // bar width
    // TODO: find proper way to restructure under 80 lines
    let barWidth = ((DEFAULT_CHART_WIDTH_PX - (margin.left + margin.right)) / numBars) * (1 - padding);

    // TODO: Get color and pattern definitions from genDef

    /* ---------------------------- Auto Sizing --------------------------- */

    if (!autoSizeOff) {
      // Calculate minimum chart width

      if (!horizontal) {
        // TODO: find proper way to restructure under 80 lines
        const minChartWidth = (margin.left + margin.right) + ((numBars * MIN_BAR_WIDTH_PX) / (1 - padding));

        // adjust width if needed
        chartWidth = (
          minChartWidth > DEFAULT_CHART_WIDTH_PX
            ? minChartWidth
            : DEFAULT_CHART_WIDTH_PX
        );

        //  update bar width
        // TODO: find proper way to restructure under 80 lines
        barWidth = ((chartWidth - (margin.left + margin.right)) / numBars) * (1 - padding);

        if (barWidth > MAX_BAR_WIDTH_PX && !lessPaddingBetweenBars) {
        // increase padding to decrease bar width
        // TODO: find proper way to restructure under 80 lines
          padding = 1 - ((MAX_BAR_WIDTH_PX * numBars) / (chartWidth - margin.left - margin.right));
        }
      } else {
        // TODO: find proper way to restructure under 80 lines
        const minChartHeight = (margin.top + margin.bottom) + ((numBars * MIN_BAR_WIDTH_PX) / (1 - padding));

        chartHeight = (
          minChartHeight > DEFAULT_CHART_HEIGHT_PX
            ? minChartHeight
            : DEFAULT_CHART_HEIGHT_PX
        );
        // TODO: find proper way to restructure under 80 lines
        barWidth = ((chartHeight - (margin.top + margin.bottom)) / numBars) * (1 - padding);

        if (barWidth > MAX_BAR_WIDTH_PX && !lessPaddingBetweenBars) {
          // increase padding to decrease bar width
          // TODO: find proper way to restructure under 80 lines
          padding = 1 - ((MAX_BAR_WIDTH_PX * numBars) / (chartHeight - margin.top - margin.bottom));
        }
      }
    }

    /* ------------------------ Label Overlap ---------------------- */

    // boolean to keep track of if x axis ticks are rotated
    let rotateTicksX = false;
    // variable to determine how much legend offset needed if ticks rotated
    let tickXOffset; let tickYOffset;
    // max length of a tick
    let maxTickLengthX = 0; let maxTickLengthY = 0;

    data.forEach((elem) => {
      // truncate tick and add ellipsis if over 20 chars
      if (elem[barAxisLabel].length > 20) {
        elem[barAxisLabel] = `${elem[barAxisLabel].substring(0, 20)}...`;
      }

      // 8 is approx value we use for 1 char
      const approxTickWidth = elem[barAxisLabel].length * 8;

      // Set rotate flag if bar label length exceeds limit
      if (barWidth <= approxTickWidth && !horizontal) {
        rotateTicksX = true;
        if (approxTickWidth > maxTickLengthX) {
          // set maxTickLength value
          maxTickLengthX = approxTickWidth;

          // Update tickOffset value
          tickXOffset = Math.sin(Math.PI / 6) * maxTickLengthX;
        }
      }

      if (horizontal) {
        if (approxTickWidth > maxTickLengthY) {
          // set maxTickLength value
          maxTickLengthY = approxTickWidth;

          // Update tickOffset value
          tickYOffset = maxTickLengthY;
        }
      }
    });

    /* ------------------------ Axes ---------------------- */

    // Set up left axis
    const axisLeft = {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: valueAxisLabel,
      legendPosition: 'middle',
      legendOffset: (tickYOffset ? -tickYOffset - 15 : -60),
    };

    // Dynamically set marginLeft to be 10px left of the left tick legend
    margin.left = Math.abs(axisLeft.legendOffset) + 10;

    // Set up bottom axis
    const axisBottom = {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: (rotateTicksX ? -30 : 0),
      legend: barAxisLabel,
      // if tickXOffset defined, set legend offset to be
      // tickXOffset + tickSize + tickPadding + 15 extra px,
      // Default to 60 otherwise
      legendOffset: (tickXOffset ? tickXOffset + 5 + 5 + 15 : 60),
      legendPosition: 'middle',
    };

    // Dynamically set marginBottom to be 10px below the bottom tick legend
    margin.bottom = axisBottom.legendOffset + 10;

    /* ------------------------- Orientation ------------------------ */

    // boolean that sets horizontal or vertical flag
    const layout = (horizontal ? 'horizontal' : 'vertical');

    if (horizontal) {
      // If horizontal, switch label names of the axes
      axisLeft.legend = barAxisLabel;
      axisBottom.legend = valueAxisLabel;
    }

    /* ------------------------- Legends ------------------------ */

    let legends;
    // Add legend if flag included
    if (showLegend) {
      // Increase right margin size to accomodate legend

      // TODO: Make dynamic and possibly limit legend char length
      margin.right = 150;

      // legends object
      legends = [
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ];
    }

    /* ------------------------- Build Bar Component ------------------------ */

    const responsiveBarProps = {
      data,
      keys,
      margin,
      layout,
      padding,
      minValue,
      maxValue,
      axisLeft,
      axisBottom,
      legends,
      indexBy: barAxisLabel,
      enableGridX: horizontal,
      enableGridY: !horizontal,
      width: chartWidth,
      height: chartHeight,
      // TODO: add in color scheme from THEMES.JS
      colors: ['#33A0E4', '#F39A27', '#A981D4', '#33B16D', '#F0454F', '#B6E9F9', '#FFF771', '#FFD1E9', '#00CDE1', '#DADEE3'],
      borderColor: {
        from: 'color',
        modifiers: [
          ['darker', 0.6],
        ],
      },
      borderRadius: 1,
      borderWidth: 1,
      labelSkipHeight: 12,
      labelSkipWidth: 13,
      theme: {
        fontSize: 12,
        outlineWidth: 22,
        axis: {
          ticks: {
            text: {
              fill: '#aaaaaa',
              fontSize: 12,
            },
          },
          legend: {
            text: {
              fill: '#aaaaaa',
              fontSize: 20,
            },
          },
        },
      },
      // defs: defs}
      // fill: fill}
      labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] },
      animate: true,
      motionStiffness: 90,
      motionDamping: 15,
      tooltip: tooltipFormatter,
    };

    if (autoSizeOff) {
      delete responsiveBarProps.width;
      delete responsiveBarProps.height;
    }

    if (horizontal) {
      delete responsiveBarProps.width;
    } else {
      delete delete responsiveBarProps.height;
    }
    return (
      // Return Bar component wrapped in div
      /* eslint-disable react/jsx-props-no-spreading */
      <div>
        <h2>{title}</h2>
        <div style={{ height: '500px', overflowX: 'auto' }}>
          <ResponsiveBar
            {...responsiveBarProps}
          />
        </div>
      </div>
    );
  }
}

BarChart.propTypes = {
  // Title of the chart
  title: PropTypes.string.isRequired,
  // Value-axis label
  valueAxisLabel: PropTypes.string.isRequired,
  // Bar-axis label
  barAxisLabel: PropTypes.string.isRequired,
  // Minimum value (or 'auto')
  minValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  // Maximum value
  maxValue: PropTypes.number,
  // True if padding between bars should be smaller
  lessPaddingBetweenBars: PropTypes.bool,
  // Bar data
  bars: PropTypes.arrayOf(PropTypes.shape({
    // Label of the bar
    label: PropTypes.string.isRequired,
    // Map of the values for the bar: series label => value
    values: PropTypes.objectOf(PropTypes.number),
    // The value for the bar if only one series
    value: PropTypes.number,
  })).isRequired,
  // True to show the legend for the bar chart
  showLegend: PropTypes.bool,
  // False if the chart should not automatically size itself
  autoSizeOff: PropTypes.bool,
  // True if the chart is a horizontal bar chart
  horizontal: PropTypes.bool,
  /**
   * Tooltip formatter
   * @param {number} value - the value of the bar series item
   * @param {string} id - the label of the series
   * @param {string} indexValue - the label of the bar
   * @return {node} valid html element
   */
  tooltipFormatter: PropTypes.func,
  // Color theme
  theme: PropTypes.string,
  // Color map of ids to color
  colorMap: PropTypes.objectOf(PropTypes.any),
};

BarChart.defaultProps = {
  // No legend
  showLegend: false,
  // Normal amount of padding
  lessPaddingBetweenBars: false,
  // Automatic sizing is on
  autoSizeOff: false,
  // Vertical by default
  horizontal: false,
  // Minimum is zero
  minValue: 0,
  // Max value is highest value
  maxValue: 'auto',
  // No tooltip formatter
  tooltipFormatter: ({ id, value }) => {
    return `${id}: ${value}`;
  },
  theme: undefined,
  // No colorMap
  colorMap: {},
};

export default BarChart;
