/**
 * Action bar component for widgets
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ActionBar extends Component {
  /**
   * Render the ActionBar
   * @author Grace Whitney
   */
  render() {
    return (
      <div>
        Action Bar still being built!
      </div>
    );
  }
}

ActionBar.propTypes = {
  // Array of action objects
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      // Label for the action button
      label: PropTypes.string.isRequired,
      // Handler function for the action
      actionHandler: PropTypes.function.isRequired,
    })
  ).isRequired,
};

export default ActionBar;
