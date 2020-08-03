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

  toggleCSVButtonOn() {
    this.setState({ showDownloadButton: true });
  }

  toggleCSVButtonOff() {
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
      CSVDownloadProps,
      children,
    } = this.props;

    const {
      filename,
      id,
      headerMap,
      data,
    } = CSVDownloadProps;

    // Create elements
    const titleElem = (
      title
        ? (
          <h3 className="ChartContainer-title">
            {title}
          </h3>
        )
        : null
    );
    const CSVDownloadElem = (
      <div
        className={`ChartContainer-download-button ChartContainer-download-button-${showDownloadButton ? 'visible' : 'hidden'}`}
        onMouseOver={() => { this.toggleCSVButtonOn(); }}
        onFocus={() => { this.toggleCSVButtonOn(); }}
        onMouseLeave={() => { this.toggleCSVButtonOff(); }}
        onBlur={() => { this.toggleCSVButtonOff(); }}
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
      <div className="ChartContainer-container">
        {titleElem}
        <div
          className="ChartContainer-contents"
          onMouseOver={() => { this.toggleCSVButtonOn(); }}
          onFocus={() => { this.toggleCSVButtonOn(); }}
          onMouseLeave={() => { this.toggleCSVButtonOff(); }}
          onBlur={() => { this.toggleCSVButtonOff(); }}
        >
          {CSVDownloadElem}
          {children}
        </div>
      </div>
    );
  }
}

ChartContainer.propTypes = {
  // Chart title
  title: PropTypes.string,
  // CSVDownloadButton props
  CSVDownloadProps: PropTypes.shape({
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
  // No chart title
  title: null,
};

export default ChartContainer;