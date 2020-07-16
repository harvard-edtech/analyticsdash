/**
 * Pie chart displayed as a doughnut chart
 * @author Gabe Abrams
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

// Import nivo chart
import { ResponsivePie } from '@nivo/pie';

// Import color themes
// import THEMES from './style/THEMES';

class PieChart extends Component {
  /**
   * Render PieChart
   * @author Grace Whitney
   */
  render() {
    const {
      title,
      segments,
      seriesLabelType,
      showSegmentValues,
      tooltipFormatter,
    } = this.props;

    const chartData = segments.map((segment) => {
      return {
        id: segment.label,
        value: segment.value,
      };
    });

    return (
      <div style={{ height: 500 }}>
        <ResponsivePie
          title={title}
          data={chartData}
        />
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
