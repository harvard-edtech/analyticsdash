/**
 * A customizable header at the top of the page
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

// Import style
import './Header.css';

class Header extends Component {
  /**
   * Render Header
   * @author Gabe Abrams
   */
  render() {
    const {
      addon,
      leftButton,
      rightButton,
    } = this.props;

    // Create buttons
    const leftButtonElem = (
      leftButton
        ? (
          <button
            type="button"
            className="Header-left-button btn btn-light text-dark"
            onClick={leftButton.onClick}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="mr-1"
            />
            {leftButton.contents}
          </button>
        )
        : null
    );
    const rightButtonElem = (
      rightButton
        ? (
          <button
            type="button"
            className="Header-right-button btn btn-light text-dark"
            onClick={rightButton.onClick}
          >
            {rightButton.contents}
          </button>
        )
        : null
    );

    return (
      <div className="Header-container">
        <nav className="navbar bg-secondary text-light shadow">
          {leftButtonElem}
          <h2 className="m-0 text-center w-100">
            CourseDash
            {addon && (
              <span style={{ fontWeight: 300 }}>
                &nbsp;|&nbsp;
                {addon}
              </span>
            )}
          </h2>
          {rightButtonElem}
        </nav>
      </div>
    );
  }
}

// List or properties and their types
Header.propTypes = {
  // Button on left of navbar
  leftButton: PropTypes.shape({
    contents: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  // Button on right of navbar
  rightButton: PropTypes.shape({
    contents: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  // Text addon for the title
  addon: PropTypes.string,
};

Header.defaultProps = {
  // By default, there are no buttons
  leftButton: null,
  rightButton: null,
  // No addon
  addon: null,
};

export default Header;
