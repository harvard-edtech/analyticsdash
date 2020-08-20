/**
 * A bar chart
 * @author Aryan Pandey
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import chart component
import { ResponsiveBar } from '@nivo/bar';

// Import shared component
import ChartContainer from '../../ChartContainer';

// Import themes
import genDefs from '../style/genDefs';

// Import constants
import CONSTANTS from './CONSTANTS';

class BarChart extends Component {
  /**
   * Render BarChart
   * @author Aryan Pandey
   */

  render() {
    // destructure props
    const {
      containerWidth,
      maxHeight,
      title,
      hideTitle,
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
    const chartData = [];

    // initialize keys array to only have valueAxisLabel as key in the start
    const keys = [valueAxisLabel];

    // Translate chart data from bars prop to data array usable by nivo
    bars.forEach((bar) => {
      // Check for single bar series case
      if (bar.value !== undefined && !Number.isNaN(bar.value)) {
        chartData.push(
          {
            // Set barAxisLabel as the key for the bar label
            [barAxisLabel]: bar.label,
            // Set valueAxisLabel as the key for the bar value
            [valueAxisLabel]: bar.value,
          }
        );
      }

      // Check for multiple bar series case
      if (bar.values) {
        // Set barAxisLabel as the key for the bar label
        // And use the key-value pairs in the bar.values object
        chartData.push({ [barAxisLabel]: bar.label, ...bar.values });

        // Update keys array
        Object.keys(bar.values).forEach((valueLabel) => {
          // Add in key only if not already in the array
          if (keys.indexOf(valueLabel) < 0) {
            keys.push(valueLabel);
          }
        });
      }
    });

    /* ------------------------- Define Chart Styles ------------------------ */

    // Ensure chartTitle is always defined
    const chartTitle = title || 'Analytics Chart';

    // Set up default margins
    const margin = {
      top: CONSTANTS.MARGIN_TOP_PX,
      right: CONSTANTS.MARGIN_RIGHT_PX,
      bottom: CONSTANTS.MARGIN_BOTTOM_PX,
      left: CONSTANTS.MARGIN_LEFT_PX,
    };

    // boolean that sets padding flag
    let padding = (lessPaddingBetweenBars ? 0.1 : 0.3);

    // Declare variables for chart width and height
    let chartWidth = containerWidth;
    let chartHeight = CONSTANTS.MIN_CHART_HEIGHT_PX;

    // number of bars
    const numBars = chartData.length;

    // bar width
    let barWidth;

    // get color defs
    const chartGenDefs = genDefs(colorMap, theme);
    const { defs, fill } = chartGenDefs(keys);

    // define theme
    const chartTheme = {
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
    };

    /* ---------------------------- CSV Button --------------------------- */

    // header map for CSV button
    const csvHeaderMap = {};

    // Fill headerMap with values from chartData
    chartData.forEach((bar) => {
      Object.keys(bar).forEach((barSeries) => {
        csvHeaderMap[barSeries] = barSeries;
      });
    });

    /* ------------------------- Helper functions  -------------------------- */

    /**
     * Calculates and returns minimum chart length required (bar-axis)
     *   for bars to be >= MIN_BAR_WIDTH
     * @author Aryan Pandey
     * @return {number} min chart length
     */
    const getMinChartLength = () => {
      // set which margins to consider
      const margins = (
        horizontal
          ? margin.top + margin.bottom
          : margin.left + margin.right
      );

      // return the min chart length
      return (
        margins
        + (
          (numBars * CONSTANTS.MIN_BAR_WIDTH_PX)
          / (1 - padding)
        )
      );
    };

    /**
     * Increases chart padding to decrease bar width
     *   if bar is too wide
     * @author Aryan Pandey
     */
    const updatePadding = () => {
      // set which margins to consider
      const margins = (
        horizontal
          ? margin.top + margin.bottom
          : margin.left + margin.right
      );

      // set which chartLength to consider
      const chartLength = (
        horizontal
          ? chartHeight
          : chartWidth
      );

      //  calculate current bar width
      barWidth = (
        (
          (chartLength - margins) / numBars
        )
          * (1 - padding)
      );

      // if bar width is greater than limit,
      // decrease it by increasing padding
      if (barWidth > CONSTANTS.MAX_BAR_WIDTH_PX && !lessPaddingBetweenBars) {
        padding = (
          1
            - (
              (CONSTANTS.MAX_BAR_WIDTH_PX * numBars) / (chartLength - margins)
            )
        );
      }
    };

    /* ---------------------------- Auto Sizing --------------------------- */

    if (!autoSizeOff) {
      // get min chart length needed
      const requiredChartLength = getMinChartLength();

      // vertical chart case
      if (!horizontal) {
        // increase chart width if below minimum width needed
        chartWidth = (
          requiredChartLength > CONSTANTS.MIN_CHART_WIDTH_PX
            ? requiredChartLength
            : containerWidth
        );
      }

      // horizontal chart case
      if (horizontal) {
        // increase chart height if below minimum height needed
        chartHeight = (
          requiredChartLength > chartHeight
            ? requiredChartLength
            : chartHeight
        );
      }

      // update padding to ensure no bars are too wide
      updatePadding();
    }

    /* ------------------------ Label Overlap ---------------------- */

    // boolean to keep track x-axis tick rotation
    let rotateTicksX = false;
    // variable to keep track of space occupied by ticks
    let tickXOffset; let tickYOffset;
    // max length of a tick
    let maxTickLength = 0;

    // Cycle through all the ticks
    chartData.forEach((elem) => {
      // truncate tick and add ellipsis if over 20 chars
      if (elem[barAxisLabel].length > 20) {
        // eslint-disable-next-line no-param-reassign
        elem[barAxisLabel] = `${elem[barAxisLabel].substring(0, 20)}...`;
      }

      // calculate approx width of the tick
      const approxTickWidth = (
        elem[barAxisLabel].length * CONSTANTS.APPROX_CHAR_WIDTH_PX
      );

      // set maxTickLength value
      if (approxTickWidth > maxTickLength) {
        maxTickLength = approxTickWidth;
      }

      // Set rotate flag if bar label length exceeds limit
      // or automatically if autoSizeOff
      if ((autoSizeOff || barWidth <= approxTickWidth) && !horizontal) {
        rotateTicksX = true;

        // Update tickOffset value
        tickXOffset = Math.sin(Math.PI / 6) * maxTickLength;
      }

      if (horizontal) {
        // Update tickOffset value
        tickYOffset = maxTickLength;
      }
    });

    /* ------------------------ Axes ---------------------- */

    // Set up left axis
    const axisLeft = {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: (horizontal ? barAxisLabel : valueAxisLabel),
      legendPosition: 'middle',
      legendOffset: (
        tickYOffset
          ? -tickYOffset - 15
          : -CONSTANTS.DEFAULT_LEGEND_OFFSET_PX
      ),
    };

    // Dynamically set marginLeft to be 10px left of the left tick legend
    margin.left = Math.abs(axisLeft.legendOffset) + 10;

    // Set up bottom axis
    const axisBottom = {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: (rotateTicksX ? CONSTANTS.TICK_ROTATION_DEG : 0),
      legend: (horizontal ? valueAxisLabel : barAxisLabel),
      legendOffset: (
        tickXOffset
          ? tickXOffset + 25
          : CONSTANTS.DEFAULT_LEGEND_OFFSET_PX
      ),
      legendPosition: 'middle',
    };

    // Dynamically set marginBottom to be 10px below the bottom tick legend
    margin.bottom = axisBottom.legendOffset + 10;

    /* ------------------------- Orientation ------------------------ */

    // boolean that sets horizontal or vertical flag
    const layout = (horizontal ? 'horizontal' : 'vertical');

    /* ------------------------- Legends ------------------------ */

    let legends;
    // Add legend if flag included
    if (showLegend) {
      // Get max length of legends
      const maxLegendLength = Math.max(
        ...(keys.map((el) => {
          return el.length;
        })
        )
      );

      // approximate max width of legend text
      const approxMaxLegendWidth = (
        maxLegendLength * CONSTANTS.APPROX_CHAR_WIDTH_PX
      );

      // Increase right margin size to accomodate legends
      margin.right += approxMaxLegendWidth + 10;

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
        },
      ];
    }

    /* ------------------------- Build Bar Component ------------------------ */

    const responsiveBarProps = {
      data: chartData,
      keys,
      margin,
      layout,
      padding,
      minValue,
      maxValue,
      axisLeft,
      axisBottom,
      legends,
      defs,
      fill,
      indexBy: barAxisLabel,
      enableGridX: horizontal,
      enableGridY: !horizontal,
      width: chartWidth,
      height: chartHeight,
      theme: chartTheme,
      enableLabel: false,
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
      delete responsiveBarProps.height;
    }
    return (
      <ChartContainer
        title={chartTitle}
        hideTitle={hideTitle}
        csvDownloadProps={{
          filename: chartTitle,
          headerMap: csvHeaderMap,
          data: chartData,
          id: `${chartTitle}-download-button`,
        }}
      >
        <div style={{
          width: `${containerWidth}px`,
          // scale height only upto max height, scroll if over
          height: (
            chartHeight <= maxHeight
              ? chartHeight
              : maxHeight
          ),
          overflowX: 'auto',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        >
          <ResponsiveBar
          // eslint-disable-next-line react/jsx-props-no-spreading
            {...responsiveBarProps}
          />
        </div>
      </ChartContainer>
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
  // if true, title is hidden
  hideTitle: PropTypes.bool,
  // maximum height of the chart container in px
  maxHeight: PropTypes.number,
  // width of the chart container in px
  containerWidth: PropTypes.number,
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
  // No theme
  theme: undefined,
  // No colorMap
  colorMap: undefined,
  // Default to false
  hideTitle: false,
  // default maximum
  maxHeight: CONSTANTS.MAX_CHART_HEIGHT_PX,
  // default width
  containerWidth: CONSTANTS.MIN_CHART_WIDTH_PX,
};

export default BarChart;
