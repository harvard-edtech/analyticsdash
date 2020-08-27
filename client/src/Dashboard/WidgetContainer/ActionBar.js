/**
 * Action bar component for widgets
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared PropTypes
import Widget from '../../shared/propTypes/Widget';
import Action from '../../shared/propTypes/Action';

// Import style
import './ActionBar.css';

class ActionBar extends Component {
  /**
   * Render the ActionBar
   * @author Grace Whitney
   */
  render() {
    const {
      actions,
      widget,
    } = this.props;

    // If no actions have been provided, do not render the ActionBar
    if (!actions) {
      return null;
    }

    // Define a button for each action object
    const buttons = actions.map((action) => {
      const {
        key,
        id,
        label,
        description,
        onClick,
      } = action;

      return (
        <button
          key={key}
          id={`${widget.id}-${id}`}
          className="btn btn-light mr-2 ActionBar-button border border-dark"
          type="button"
          aria-label={description}
          onClick={onClick}
        >
          {label}
        </button>
      );
    });

    // Return the action bar with action buttons
    return (
      <div className="alert d-flex align-items-center text-left bg-info m-0 p-2">
        {/* Header */}
        <h3 className="d-inline-block text-light mr-2 mb-0">
          Actions:
        </h3>
        <div className="ActionBar-button-container">
          {/* Action buttons */}
          {buttons}
        </div>
      </div>
    );
  }
}

ActionBar.propTypes = {
  // Array of action objects
  actions: PropTypes.arrayOf(Action).isRequired,
  // Widget that is rendering the action bar
  widget: Widget.isRequired,
};

export default ActionBar;
