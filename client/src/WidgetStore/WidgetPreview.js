/**
 * Preview of a widget
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

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
      <div className="alert alert-warning">
        <div className="d-flex align-items-center">
          {/* Title */}
          <div className="flex-grow-1">
            <h3>
              {widget.metadata.title}
            </h3>
          </div>

          {/* Buttons */}
          <div>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              aria-label={`Add widget "${widget.metadata.title}" to the dashboard`}
              onClick={onAddWidget}
            >
              Add Widget
            </button>
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
