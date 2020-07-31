/**
 * Container component for charts
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ChartContainer extends Component {
  /**
   * Render ChartContainer
   * @author Grace Whitney
   */
  render() {
    return (
      <div />
    );
  }
}

ChartContainer.propTypes = {
  // Chart title
  title: PropTypes.string,
  // CSVDownloadButton props
  CSVDownloadProps: PropTypes.shape({
    // Map of prop to header: prop => header title
    headerMap: PropTypes.objectOf(PropTypes.any).isRequired,
    // Array of data objects containing the same props as in the headerMap
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  // Chart to render inside container
  children: PropTypes.node.isRequired,
};

ChartContainer.defaultProps = {
  // No chart title
  title: null,
};

export default ChartContainer;
