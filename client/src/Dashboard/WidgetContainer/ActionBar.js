/**
 * Action bar component for widgets
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared PropTypes
import Widget from '../../shared/propTypes/Widget';

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

    if (!actions) {
      return null;
    }

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

    return (
      <div className="alert bg-info d-flex align-items-center justify-content-start m-0 p-2">
        <h3 className="text-light mr-2">
          Actions:
        </h3>
        <div className="d-flex ActionBar-button-container">
          {buttons}
        </div>
      </div>
    );
  }
}

ActionBar.propTypes = {
  // Array of action objects
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      // Unique key for the action button
      key: PropTypes.string.isRequired,
      // Id for the action button
      id: PropTypes.string.isRequired,
      // Label for the action button
      label: PropTypes.string.isRequired,
      // Description of the action that will be taken
      description: PropTypes.string.isRequired,
      // Handler function for the action
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  // Widget that is rendering the action bar
  widget: Widget.isRequired,
};

export default ActionBar;
