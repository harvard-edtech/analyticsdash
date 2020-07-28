import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';

class DownloadButton extends Component {
  render() {
    // Deconstruct props
    const {
      label,
      filename,
      downloadData,
      id,
    } = this.props;

    const href = `data:application/octet-stream,${downloadData}`;

    // Render the button, icon is on its left
    return (
      <a
        id={id}
        download={filename}
        href={href}
        className="DownloadButton btn btn-sm btn-secondary"
        aria-label={`Click to download ${filename}`}
      >
        <FontAwesomeIcon
          icon={faCloudDownloadAlt}
          className="mr-2"
        />
        {label}
      </a>
    );
  }
}

DownloadButton.propTypes = {
  // The label to be displayed on the screen e.g. 'Download CSV'
  label: PropTypes.node.isRequired,
  // Download file name
  filename: PropTypes.string.isRequired,
  // Download data (already converted to one string)
  downloadData: PropTypes.string.isRequired,
  // Id for the button
  id: PropTypes.string.isRequired,
};

export default DownloadButton;
