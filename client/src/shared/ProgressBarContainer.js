/**
 * Styled container for progress bars with CSV download
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared components
import Tooltip from './Tooltip';
import CSVDownloadButton from './CSVDownloadButton';

class ProgressBarContainer extends Component {
  render() {
    const {
      title,
      progressBars,
      tooltipProps,
      csvDownloadProps,
    } = this.props;

    return (
      <div className="my-2">
        <div className="d-flex justify-content-between">
          <h5 className="d-inline">
            {title}
            <Tooltip
              // Directly pass through child props without destructuring
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...tooltipProps}
            />
          </h5>
          <CSVDownloadButton
            // Directly pass through child props without destructuring
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...csvDownloadProps}
          />
        </div>
        {progressBars}
      </div>
    );
  }
}

ProgressBarContainer.propTypes = {
  // Title for the container
  title: PropTypes.string.isRequired,
  // Array of progress bars to display in the container
  progressBars: PropTypes.arrayOf(PropTypes.node).isRequired,
  // Props to pass to the tooltip
  tooltipProps: PropTypes.shape({
    // Text that shows up on tooltip hover
    text: PropTypes.string.isRequired,
    // Function that opens the help component of the widget
    onOpenHelp: PropTypes.func,
  }).isRequired,
  // Props to pass to the CSV download button
  csvDownloadProps: PropTypes.shape({
    // Name for the download file
    filename: PropTypes.string.isRequired,
    // Map of prop to header: prop => header title
    headerMap: PropTypes.objectOf(PropTypes.any).isRequired,
    // Array of data objects containing the same props as in the headerMap
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    // Id for the button
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default ProgressBarContainer;
