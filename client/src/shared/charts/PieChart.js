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
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';

// Import nivo chart
import { ResponsivePie } from '@nivo/pie';

// Import color themes
// import THEMES from './style/THEMES';

// Import style
import './PieChart.css';

// Style constants
const PAD_ANGLE = 0.5;
const CORNER_RADIUS = 2;
const BORDER_WIDTH = 1;
const INNER_RADIUS = 0.55;

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

    // Convert segment data to required format
    const chartData = segments.map((segment) => {
      return {
        id: segment.label,
        value: segment.value,
      };
    });

    // Convert tooltip formatter to segment data fields
    let chartTooltipFormatter;
    if (tooltipFormatter) {
      chartTooltipFormatter = (segment) => {
        return (
          tooltipFormatter({
            label: segment.id,
            value: segment.value,
          })
        );
      };
    }

    // Determine label prop values
    const enableOuterLabels = seriesLabelType === 'outer';
    const enableInnerLabels = (
      seriesLabelType === 'inner'
      || (seriesLabelType === 'legend' && showSegmentValues)
    );

    // Define segment label function
    const formatSegmentLabel = (segment) => {
      const id = (seriesLabelType === 'legend' ? '' : segment.id);
      const value = (showSegmentValues ? `(${segment.value})` : '');
      return (
        `${id} ${value}`
      );
    };

    // Set up legend if specified
    const legends = [];
    if (seriesLabelType === 'legend') {
      legends.push({
        anchor: 'bottom',
        direction: 'row',
        translateY: 45,
        translateX: 10,
        itemWidth: 100,
        itemHeight: 20,
        itemTextColor: '#000',
        symbolSize: 20,
        symbolShape: 'circle',
      });
    }

    return (
      <div className="PieChart-body-container">
        <div>
          {title}
          <FontAwesomeIcon
            icon={faCloudDownloadAlt}
          />
        </div>
        <ResponsivePie
          data={chartData}

          innerRadius={INNER_RADIUS}
          padAngle={PAD_ANGLE}
          cornerRadius={CORNER_RADIUS}
          margin={{
            top: 30,
            bottom: 80,
            left: 20,
            right: 20,
          }}
          borderWidth={BORDER_WIDTH}

          enableRadialLabels={enableOuterLabels}
          radialLabel={formatSegmentLabel}

          enableSlicesLabels={enableInnerLabels}
          sliceLabel={formatSegmentLabel}

          legends={legends}

          tooltip={chartTooltipFormatter}
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
   * @param {number} value - the value of the pie segment
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
