/**
 * Pie chart displayed as a doughnut chart
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

// Import nivo chart
import { ResponsivePie } from '@nivo/pie';

class PieChart extends Component {
  /**
   * Render PieChart
   * @author Gabe Abrams
   */
  render() {
    return (
      <div>
        PieChart still being build!
      </div>
    );
  }
}

PieChart.propTypes = {
  // Title of the chart
  title: PropTypes.string.isRequired,
  // Segment data
  segments: PropTypes.arrayOf(PropTypes.shape({
    // Label of the segment
    label: PropTypes.string.isRequired,
    // The value for the segment
    value: PropTypes.number,
  })).isRequired,
  // Segment label type
  seriesLabelType: PropTypes.oneOf([
    'legend', // Show a legend
    'inner', // Show labels inside the segments
    'outer', // Show labels outside the segments
  ]),
  // True to show segment values
  showSegmentValues: PropTypes.bool,
  /**
   * Tooltip formatter
   * @param {number} value - the value of the bar series item
   * @param {string} label - the label of the segment
   * @return {node} valid html element
   */
  tooltipFormatter: PropTypes.func,
};

PieChart.defaultProps = {
  // Outside the segments
  seriesLabelType: 'outer',
  // Values hidden
  showSegmentValues: false,
  // No tooltip formatter
  tooltipFormatter: undefined,
};

export default PieChart;
