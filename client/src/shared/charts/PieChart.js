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

// Import shared component
import ChartContainer from '../ChartContainer';

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
      title,
      hideTitle,
      segments,
      theme,
      colorMap,
      showSegmentLabels,
      showLegend,
      tooltipFormatter,
      height,
    } = this.props;

    // Ensure chartTitle is defined in case of propTypes failure
    const chartTitle = title || 'Analytics Chart';

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

    // Define CSV download button props
    const csvFilename = `${chartTitle.replace(' ', '-').toLowerCase()}-data`;
    const csvHeaderMap = {
      label: 'Category',
      value: 'Value',
    };

    return (
      <ChartContainer
        title={chartTitle}
        hideTitle={hideTitle}
        csvDownloadProps={{
          filename: csvFilename,
          headerMap: csvHeaderMap,
          data: chartData,
          id: `${csvFilename}-download-button`,
        }}
      >
        <div style={{
          height: `${height}px`,
          maxHeight: '100%',
        }}
        >
          <ResponsivePie
            /* Data */
            data={chartData}

            /* Colors and patterns */
            defs={defs}
            fill={fill}

            /* Styling parameters */
            innerRadius={INNER_RADIUS_RATIO}
            padAngle={PAD_ANGLE_DEGREES}
            cornerRadius={CORNER_RADIUS_PX}
            margin={MARGINS}
            borderWidth={BORDER_WIDTH_PX}

            /* Labels and legends */
            enableRadialLabels={showSegmentLabels}
            radialLabel={formatSegmentLabel}

            enableSlicesLabels={false}

            legends={legends}

            tooltip={chartTooltipFormatter}
          />
        </div>
      </ChartContainer>
    );
  }
}

PieChart.propTypes = {
  // Chart title
  title: PropTypes.string.isRequired,
  // If true, title is hidden
  hideTitle: PropTypes.bool,
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
  // Height of the chart
  height: PropTypes.number,
};

PieChart.defaultProps = {
  // Do not hide title
  hideTitle: false,
  // Default theme
  theme: undefined,
  // No colorMap
  colorMap: undefined,
  // Segment labels hidden
  showSegmentLabels: false,
  // Legend hidden
  showLegend: false,
  // No tooltip formatter
  tooltipFormatter: undefined,
  // Default chart height
  height: 500,
};

export default PieChart;
