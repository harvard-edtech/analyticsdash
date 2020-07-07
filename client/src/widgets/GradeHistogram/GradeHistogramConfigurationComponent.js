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

    onChangeConfiguration();

    return (
      <div>
        {configuration.nBuckets}
        <button
          label="Configuration"
          type="button"
          aria-label="configuration"
          onClick={() => { onChangeConfiguration(); }}
        />
      </div>
    );
  }
}

GradeHistogramConfigurationComponent.propTypes = {
  configuration: PropTypes.shape({ nBuckets: PropTypes.number }).isRequired,
  onChangeConfiguration: PropTypes.func.isRequired,
};

export default GradeHistogramConfigurationComponent;
