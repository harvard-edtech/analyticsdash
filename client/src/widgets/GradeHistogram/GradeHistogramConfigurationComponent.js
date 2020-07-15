/**
 * Configuration panel content for the GradeHistogram component
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Constants
const NUM_BUCKETS_OPTIONS = [2, 5, 10, 15, 20];

/* ---------------------------- Class --------------------------- */

class GradeHistogramConfigureComponent extends Component {
  render() {
    const {
      configuration,
      onChangeConfiguration,
    } = this.props;

    const options = NUM_BUCKETS_OPTIONS.map((n) => {
      return (
        <option key={n}>
          {n}
        </option>
      );
    });

    return (
      <div className="input-group mb-2">
        <div className="input-group-prepend">
          <span className="font-weight-bold input-group-text alert-dark">
            Number of Buckets:
          </span>
        </div>
        <select
          id="n-buckets-select"
          className="custom-select alert-dark bg-white"
          aria-label="choose the number of histogram buckets"
          value={configuration.numBuckets}
          onChange={(e) => {
            onChangeConfiguration({ numBuckets: e.target.value });
          }}
        >
          {options}
        </select>
      </div>
    );
  }
}

GradeHistogramConfigureComponent.propTypes = {
  // Current widget configuration
  configuration: PropTypes.shape({ numBuckets: PropTypes.number }).isRequired,
  // Function to call when configuration is changed
  onChangeConfiguration: PropTypes.func.isRequired,
};

export default GradeHistogramConfigureComponent;
