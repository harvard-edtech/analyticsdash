/**
 * Shared tooltip component
 * @author Aryan Pandey
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

// Import tippy tooltip library
import Tippy from '@tippyjs/react';

// Import styles
import './Tooltip.css';

class Tooltip extends Component {
  /**
   * Render Tooltip
   * @author Aryan Pandey
   */
  render() {
    // destructure props
    const {
      text,
      onOpenHelp,
    } = this.props;

    // Button for onOpenHelp function
    const helpButton = (
      <button
        type="button"
        className="Tooltip-help-button btn-xsm btn-info"
        onClick={onOpenHelp}
      >
        {/* Switch displays depending on screen size */}
        <span className="d-none d-md-block">
          Show More
        </span>
        <span className="d-sm-block d-md-none">
          More
        </span>
      </button>
    );

    // Html element that shows up on tooltip hover
    const tooltipContentElement = (
      <div className="Tooltip-container">
        <div className="Tooltip-help-bar bg-secondary">
          Help
          {
            // include helpButton only if onOpenHelp defined
            (onOpenHelp ? helpButton : null)
          }
        </div>
        <div className="Tooltip-text">
          {text}
        </div>
      </div>
    );

    // return tippy tooltip component
    return (
      <div style={{ display: 'inline' }}>
        <Tippy
          theme="transparent"
          placement="auto"
          content={tooltipContentElement}
          interactive
          allowHTML
          distance={5}
          interactiveBorder={5}
          hideOnClick={false}
        >
          <button
            type="button"
            className="Tooltip-circle"
          >
            <FontAwesomeIcon
              icon={faQuestionCircle}
            />
          </button>
        </Tippy>
      </div>
    );
  }
}

Tooltip.propTypes = {
  // Text that shows up on tooltip hover
  text: PropTypes.string.isRequired,
  // Function that opens the help component of the widget
  onOpenHelp: PropTypes.func,
};

Tooltip.defaultProps = {
  // no function passed
  onOpenHelp: undefined,
};

export default Tooltip;
