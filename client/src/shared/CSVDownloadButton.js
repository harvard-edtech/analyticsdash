/**
 * CSV downloader
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import CSV generator
import Papa from 'papaparse';

// Import shared components
import DownloadButton from './DownloadButton';

class CSVDownloadButton extends Component {
  /**
   * Render CSVDownloadButton
   * @author Gabe Abrams
   */
  render() {
    const {
      id,
      filename,
      headerMap,
      data,
    } = this.props;

    // Create CSV
    // > Create input for Papaparse
    const headers = [];
    const rows = [];
    Object.keys(headerMap).forEach((prop) => {
      // Get header title
      headers.push(headerMap[prop]);

      // Add data to each row
      (data || []).forEach((datum, i) => {
        // Add row entry if there isn't one
        if (!rows[i]) {
          rows[i] = [];
        }

        // Add this prop
        rows[i].push(
          datum[prop] === undefined
            ? '-'
            : datum[prop]
        );
      });
    });
    // > Use Papa to create downloadable content
    const downloadData = encodeURIComponent(Papa.unparse({
      fields: headers,
      data: rows,
    }));

    // Make sure filename has extension
    const filenameWithExtension = `${filename}${filename.endsWith('.csv') ? '' : '.csv'}`;

    // Create the download button
    return (
      <DownloadButton
        id={id}
        label="CSV"
        filename={filenameWithExtension}
        downloadData={downloadData}
      />
    );
  }
}

CSVDownloadButton.propTypes = {
  // Name of the file
  filename: PropTypes.string.isRequired,
  // Map of prop to header: prop => header title
  headerMap: PropTypes.objectOf(PropTypes.any).isRequired,
  // Array of data objects containing the same props as in the headerMap
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  // Id for the button
  id: PropTypes.string.isRequired,
};

export default CSVDownloadButton;
