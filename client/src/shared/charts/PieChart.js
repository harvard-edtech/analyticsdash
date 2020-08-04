/**
 * Pie chart displayed as a doughnut chart
 * @author Gabe Abrams
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import nivo chart
import { ResponsivePie } from '@nivo/pie';

// Import color definitions
import genDefs from './style/genDefs';

// Import style
import './PieChart.css';

// Style constants for nivo chart props
const PAD_ANGLE_DEGREES = 0.5;
const CORNER_RADIUS_PX = 2;
const BORDER_WIDTH_PX = 1;
const INNER_RADIUS_RATIO = 0.5;
const MARGINS = {
  top: 30,
  bottom: 80,
  left: 20,
  right: 20,
}; // Margins in pixels

class PieChart extends Component {
  /**
   * Render PieChart
   * @author Grace Whitney
   */
  render() {
    const {
      segments,
      theme,
      colorMap,
      showSegmentLabels,
      showLegend,
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

    // Define segment label function
    const formatSegmentLabel = (segment) => { return `${segment.id}`; };

    // Set up legend if specified
    const legends = [];
    if (showLegend) {
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

    // Get color definitions
    const chartGenDefs = genDefs(colorMap, theme);
    const { defs, fill } = chartGenDefs(
      chartData.map((segment) => { return segment.id; })
    );

    return (
      <div className="PieChart-body-container">
        <ResponsivePie
          data={chartData}

          defs={defs}
          fill={fill}

          innerRadius={INNER_RADIUS_RATIO}
          padAngle={PAD_ANGLE_DEGREES}
          cornerRadius={CORNER_RADIUS_PX}
          margin={MARGINS}
          borderWidth={BORDER_WIDTH_PX}

          enableRadialLabels={showSegmentLabels}
          radialLabel={formatSegmentLabel}

          enableSlicesLabels={false}

          legends={legends}

          tooltip={chartTooltipFormatter}
        />
      </div>
    );
  }
}

PieChart.propTypes = {
  // Segment data
  segments: PropTypes.arrayOf(PropTypes.shape({
    // Label of the segment
    label: PropTypes.string.isRequired,
    // The value for the segment
    value: PropTypes.number,
  })).isRequired,
  // Color theme
  theme: PropTypes.string,
  // Color map of ids to color
  colorMap: PropTypes.objectOf(PropTypes.any),
  // Segment label type
  showSegmentLabels: PropTypes.bool,
  // True to show segment values
  showLegend: PropTypes.bool,
  /**
   * Tooltip formatter
   * @param {number} value - the value of the pie segment
   * @param {string} label - the label of the segment
   * @return {node} valid html element
   */
  tooltipFormatter: PropTypes.func,
};

PieChart.defaultProps = {
  // Default theme
  theme: undefined,
  // No colorMap
  colorMap: {},
  // Segment labels hidden
  showSegmentLabels: false,
  // Legend hidden
  showLegend: false,
  // No tooltip formatter
  tooltipFormatter: undefined,
};

export default PieChart;
