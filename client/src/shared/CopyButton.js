/**
 * Button for copying text to the clipboard
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboard,
  faClipboardCheck,
} from '@fortawesome/free-solid-svg-icons';

class CopyButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // True if copied
      copied: false,
    };
  }

  /**
   * Render CopyButton
   * @author Gabe Abrams
   */
  render() {
    const {
      text,
      item,
      small,
      variant,
    } = this.props;
    const { copied } = this.state;

    const buttonText = (
      copied
        ? `${item ? `${item} ` : ''}Copied`
        : `Copy ${item ? `${item} ` : ''}`
    );

    return (
      <button
        className={`btn btn-${variant} CopyButton-button ${small ? 'btn-sm' : ''}`}
        type="button"
        aria-label="copy to clipboard"
        disabled={copied}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);

            // Save copy success
            this.setState({
              copied: true,
            });

            // Wait a moment then put the button back
            await new Promise((r) => { setTimeout(r, 3000); });
            this.setState({
              copied: false,
            });
          } catch (err) {
            // eslint-disable-next-line no-alert
            prompt(
              'Oops! Your browser blocked us from copying to the clipboard. Please copy it manually:',
              text
            );
          }
        }}
      >
        <FontAwesomeIcon
          icon={(
            copied
              ? faClipboardCheck
              : faClipboard
          )}
          className="mr-2"
        />
        {buttonText}
      </button>
    );
  }
}

CopyButton.propTypes = {
  // The text to copy
  text: PropTypes.string.isRequired,
  // Name of the item being copied
  item: PropTypes.string,
  // True if button is small
  small: PropTypes.bool,
  // Variant
  variant: PropTypes.string,
};

CopyButton.defaultProps = {
  // No item name
  item: null,
  // Normal size
  small: false,
  // Info
  variant: 'info',
};

export default CopyButton;
