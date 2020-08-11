/**
 * Container component for charts
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import local components
import CSVDownloadButton from './CSVDownloadButton';

// Import styles
import './ChartContainer.css';

class ChartContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // True if container is in focus or has mouseover
      showDownloadButton: false,
    };
  }

  /**
   * Handler for showing the CSV download button
   * @author Grace Whitney
   */
  showCSVButton() {
    this.setState({ showDownloadButton: true });
  }

  /**
   * Handler for hiding the CSV download button
   * @author Grace Whitney
   */
  hideCSVButton() {
    this.setState({ showDownloadButton: false });
  }

  /**
   * Render ChartContainer
   * @author Grace Whitney
   */
  render() {
    const {
      showDownloadButton,
    } = this.state;

    const {
      title,
      hideTitle,
      csvDownloadProps,
      children,
    } = this.props;

    const {
      filename,
      id,
      headerMap,
      data,
    } = csvDownloadProps;

    // Create elements
    const titleElem = (
      !hideTitle
        ? (
          <h4 className="ChartContainer-title">
            {title}
          </h4>
        )
        : null
    );

    const CSVDownloadElem = (
      <div
        className={`ChartContainer-download-button ChartContainer-download-button-${showDownloadButton ? 'visible' : 'hidden'}`}
      >
        <CSVDownloadButton
          id={id}
          filename={filename}
          headerMap={headerMap}
          data={data}
        />
      </div>
    );

    return (
      <div
        className="ChartContainer-container"
        onMouseOver={() => { this.showCSVButton(); }}
        onFocus={() => { this.showCSVButton(); }}
        onMouseLeave={() => { this.hideCSVButton(); }}
        onBlur={() => { this.hideCSVButton(); }}
      >
        {titleElem}
        <div className="ChartContainer-contents">
          {CSVDownloadElem}
          {children}
        </div>
      </div>
    );
  }
}

ChartContainer.propTypes = {
  // Chart title
  title: PropTypes.string.isRequired,
  // If true, title is hidden
  hideTitle: PropTypes.bool,
  // CSVDownloadButton props
  csvDownloadProps: PropTypes.shape({
    // Name of the file
    filename: PropTypes.string.isRequired,
    // Map of prop to header: prop => header title
    headerMap: PropTypes.objectOf(PropTypes.any).isRequired,
    // Array of data objects containing the same props as in the headerMap
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    // Id for the button
    id: PropTypes.string.isRequired,
  }).isRequired,
  // Chart to render inside container
  children: PropTypes.node.isRequired,
};

ChartContainer.defaultProps = {
  // Do not hide title
  hideTitle: false,
};

export default ChartContainer;
