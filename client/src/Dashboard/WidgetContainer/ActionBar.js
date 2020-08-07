/**
 * Action bar component for widgets
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared PropTypes
import Widget from '../../shared/propTypes/Widget';

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

    if (actions === []) {
      return;
    }

    const buttons = actions.forEach((action) => {
      const {
        id,
        label,
        description,
        onClick,
      } = action;

      return (
        <button
          id={`${widget.id}-${id}`}
          className="btn ActionBar-button"
          type="button"
          aria-label={description}
          onClick={onClick}
        >
          {label}
        </button>
      );
    });

    return (
      <div>
        {buttons}
      </div>
    );
  }
}

ActionBar.propTypes = {
  // Array of action objects
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      // Id for the action button
      id: PropTypes.string.isRequired,
      // Label for the action button
      label: PropTypes.string.isRequired,
      // Longer description of the action that will be taken
      description: PropTypes.string.isRequired,
      // Handler function for the action
      actionHandler: PropTypes.func.isRequired,
      // Optional view for the confirmation modal instead of default
      confirmationComponent: PropTypes.node,
    })
  ).isRequired,
  // Widget that is rendering the action bar
  widget: Widget.isRequired,
};

export default ActionBar;
