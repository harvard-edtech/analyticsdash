/**
 * Configuration panel content for the GradeHistogram component
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* ---------------------------- Class --------------------------- */

class GradeHistogramConfigurationComponent extends Component {
  render() {
    const {
      configuration,
      onChangeConfiguration,
    } = this.props;
    console.log(this.props);

    const options = [5, 10, 15, 20].map((n) => {
      return (
        <option key={n}>
          {n}
        </option>
      );
    });

    console.log(configuration.nBuckets);

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
          value={configuration.nBuckets}
          onChange={(e) => {
            onChangeConfiguration({ nBuckets: e.target.value });
          }}
        >
          {options}
        </select>
      </div>
    );
  }
}

GradeHistogramConfigurationComponent.propTypes = {
  configuration: PropTypes.shape({ nBuckets: PropTypes.number }).isRequired,
  onChangeConfiguration: PropTypes.func.isRequired,
};

export default GradeHistogramConfigurationComponent;
