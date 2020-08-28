/**
 * Class for styled progress bar
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import style
import './ProgressBar.css';

class ProgressBar extends Component {
  render() {
    const {
      title,
      ariaLabel,
      percentProgress,
    } = this.props;

    const titleBar = (
      title
        ? (
          <h6 className="d-inline-flex text-left align-items-center mb-0 mr-1 ProgressBar-title">
            {title}
          </h6>
        )
        : null
    );

    return (
      <div className="d-flex my-2 ProgressBar-outer">
        {titleBar}
        <div className="progress ProgressBar-bar">
          <div
            aria-label={ariaLabel}
            className="progress-bar bg-warning"
            role="progressbar"
            style={{ width: `${percentProgress}%` }}
            aria-valuenow={percentProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {percentProgress.toFixed(0)}
            %
          </div>
        </div>
      </div>
    );
  }
}

ProgressBar.propTypes = {
  // Title for the individual progress bar
  title: PropTypes.string,
  // Accessibility label for the progress bar
  ariaLabel: PropTypes.string.isRequired,
  // Percent progress to display in the progress bar
  percentProgress: PropTypes.number.isRequired,
};

ProgressBar.defaultProps = {
  title: null,
};

export default ProgressBar;
