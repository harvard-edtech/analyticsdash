/**
 * Preview of a widget
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Shared propType
import Widget from '../shared/propTypes/Widget';

class WidgetPreview extends Component {
  /**
   * Render WidgetPreview
   * @author Gabe Abrams
   */
  render() {
    const {
      widget,
      onAddWidget,
    } = this.props;

    return (
      <div className="alert alert-secondary p-2">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-center mb-2">
          <div
            className="mt-1 mr-2"
            style={{ width: '55px', height: '55px' }}
          >
            <img
              src={widget.metadata.icon}
              className="w-100 h-100"
              aria-label={`icon for widget ${widget.metadata.title}`}
            />
          </div>
          <div className="flex-grow-1 text-left">
            <h3 className="m-0">
              {widget.metadata.title}
              <span style={{ fontWeight: 300 }}>
                &nbsp;Widget
              </span>
            </h3>
            <p className="lead m-0 font-weight-normal">
              {widget.metadata.subtitle}
            </p>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-info btn-lg"
              aria-label={`Add widget "${widget.metadata.title}" to the dashboard`}
              onClick={onAddWidget}
            >
              Add Widget
            </button>
          </div>
        </div>

        {/* Contents */}
        <div className="alert alert-light text-dark m-0">
          <div className="d-flex align-items-center justify-content-center">
            <div>
              {widget.metadata.description}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WidgetPreview.propTypes = {
  // The widget to preview
  widget: Widget.isRequired,
  // Handler to call when user chooses to add the widget
  onAddWidget: PropTypes.func.isRequired,
};

export default WidgetPreview;
