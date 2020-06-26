/**
 * Widget store where user can add widgets
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

// Import other components
import WidgetPreview from './WidgetPreview';

// Import widgets
import idToWidget from '../widgets/idToWidget';

class WidgetStore extends Component {
  /**
   * Render the WidgetStore
   * @author Gabe Abrams
   */
  render() {
    const {
      installedWidgetIds,
      onAddWidget,
      onOpenDashboard,
    } = this.props;

    /* ------------------------ List Widgets ------------------------ */

    // Get the list of widgets that are not installed
    const widgets = Object.values(idToWidget).filter((widget) => {
      return (installedWidgetIds.indexOf(widget.id) < 0);
    });

    // Turn widgets into elements
    let body = widgets.map((widget) => {
      return (
        <WidgetPreview
          key={widget.id}
          widget={widget}
          onAddWidget={() => {
            onAddWidget(widget.id);
          }}
        />
      );
    });

    /* ---------------------- No Widgets Notice --------------------- */

    if (widgets.length === 0) {
      body = (
        <div className="alert alert-success">
          <h3>
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="mr-2"
            />
            All widgets installed!
          </h3>
          <div>
            Check back later for new widgets, but for now,
            you&apos;ve installed all the widgets we have.
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              aria-label="go back to dashboard"
              onClick={onOpenDashboard}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="mr-2"
              />
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    /* ---------------------------- Body ---------------------------- */
    return (
      <div>
        {body}
      </div>
    );
  }
}

WidgetStore.propTypes = {
  // List of widgets ids that are installed
  installedWidgetIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * Add a widget
   * @param {string} id - the id of the widget to add
   */
  onAddWidget: PropTypes.func.isRequired,
  // Handler for when user wants to go back to the dashboard
  onOpenDashboard: PropTypes.func.isRequired,
};

export default WidgetStore;
