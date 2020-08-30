/**
 * Configuration panel content for the Submission Punctuality widget
 * @author Aryan Pandey
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Constants
const GRACE_PERIOD_MINS = [0, 5, 10, 15, 30, 60];

/* ---------------------------- Class --------------------------- */

class SubmissionPunctualityConfigureComponent extends Component {
  render() {
    const {
      configuration,
      onChangeConfiguration,
    } = this.props;

    const options = GRACE_PERIOD_MINS.map((n) => {
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
            Grace Period (mins):
          </span>
        </div>
        <select
          id="n-buckets-select"
          className="custom-select alert-dark bg-white"
          aria-label="choose the number of histogram buckets"
          value={configuration.gracePeriod}
          onChange={(e) => {
            onChangeConfiguration({ gracePeriod: Number(e.target.value) });
          }}
        >
          {options}
        </select>
      </div>
    );
  }
}

SubmissionPunctualityConfigureComponent.propTypes = {
  // Current widget configuration
  configuration: PropTypes.shape({ gracePeriod: PropTypes.number }).isRequired,
  // Function to call when configuration is changed
  onChangeConfiguration: PropTypes.func.isRequired,
};

export default SubmissionPunctualityConfigureComponent;
