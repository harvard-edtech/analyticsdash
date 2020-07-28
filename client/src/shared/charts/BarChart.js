/**
 * A bar chart
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

class BarChart extends Component {
  /**
   * Render BarChart
   * @author Gabe Abrams
   */
  render() {
    return (
      <div>
        BarChart still being build!
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
   * @param {string} seriesLabel - the label of the series
   * @param {string} barLabel - the label of the bar
   * @return {node} valid html element
   */
  tooltipFormatter: PropTypes.func,
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
  tooltipFormatter: (value, seriesLabel) => {
    return `${seriesLabel}: ${value}`;
  },
};

export default BarChart;
