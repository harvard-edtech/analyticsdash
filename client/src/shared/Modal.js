/**
 * A generic popup modal
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import other components
import BootstrapModal from 'react-bootstrap/Modal';

/*
To use this modal, import it:
import Modal from '../shared/Modal';

Add it in JSX:
<Modal
  title="Are you sure?"
  body="This is a dangerous action!"
  type={Modal.TYPES.OKAY_CANCEL}
  onClose={(button) => {
    if (button === Modal.BUTTONS.OKAY) {
      // Do something
    }
  }}
/>
*/

class Modal extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      // If true, the modal is shown
      visible: false,
    };
  }

  /**
   * Upon mount, wait a moment then animate the modal in
   * @author Gabe Abrams
   */
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        visible: true,
      });
    }, 10);
  }

  /**
   * Handles the closing of the modal
   * @author Gabe Abrams
   * @param {string} button - the button that was clicked when closing the
   *   modal
   */
  handleClose(button) {
    // Deconstruct props
    const { onClose } = this.props;

    // Update the state
    this.setState({ visible: false });

    // Call the handler after the modal has animated out
    setTimeout(() => {
      onClose(button);
    }, 400);
  }

  /**
   * Renders the modal
   * @author Gabe Abrams
   */
  render() {
    // Deconstruct props and state
    const {
      title,
      body,
      type,
      noHeader,
      okayLabel,
      okayColor,
    } = this.props;
    const { visible } = this.state;

    // Create footer
    let footer;
    if (type === Modal.TYPES.BLOCKED) {
      footer = null;
    } else if (type === Modal.TYPES.NO_BUTTONS) {
      footer = null;
    } else if (type === Modal.TYPES.NO_BUTTONS_AND_BLOCKED) {
      footer = null;
    } else if (type === Modal.TYPES.OKAY_CANCEL) {
      footer = (
        <div>
          <button
            type="button"
            className={`btn btn-${okayColor} mr-1`}
            onClick={() => {
              this.handleClose(Modal.BUTTONS.OKAY);
            }}
          >
            {okayLabel}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              this.handleClose(Modal.BUTTONS.CANCEL);
            }}
          >
            Cancel
          </button>
        </div>
      );
    } else if (type === Modal.TYPES.CANCEL) {
      footer = (
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              this.handleClose(Modal.BUTTONS.CANCEL);
            }}
          >
            Cancel
          </button>
        </div>
      );
    } else if (type === Modal.TYPES.YES_NO) {
      footer = (
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-1"
            onClick={() => {
              this.handleClose(Modal.BUTTONS.YES);
            }}
          >
            Yes
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              this.handleClose(Modal.BUTTONS.NO);
            }}
          >
            No
          </button>
        </div>
      );
    } else if (type === Modal.TYPES.YES_NO_CANCEL) {
      footer = (
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-1"
            onClick={() => {
              this.handleClose(Modal.BUTTONS.YES);
            }}
          >
            Yes
          </button>
          <button
            type="button"
            className="btn btn-secondary mr-1"
            onClick={() => {
              this.handleClose(Modal.BUTTONS.NO);
            }}
          >
            No
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              this.handleClose(Modal.BUTTONS.CANCEL);
            }}
          >
            Cancel
          </button>
        </div>
      );
    } else if (type === Modal.TYPES.BACK_CONTINUE) {
      footer = (
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-1"
            onClick={() => {
              this.handleClose(Modal.BUTTONS.BACK);
            }}
          >
            Back
          </button>
          <button
            type="button"
            className="btn btn-info"
            onClick={() => {
              this.handleClose(Modal.BUTTONS.CONTINUE);
            }}
          >
            Continue
          </button>
        </div>
      );
    } else {
      // Okay modal
      footer = (
        <div>
          <button
            type="button"
            className={`btn btn-${okayColor} mr-1`}
            onClick={() => {
              this.handleClose(Modal.BUTTONS.OKAY);
            }}
          >
            {okayLabel}
          </button>
        </div>
      );
    }

    // Render the modal
    return (
      <BootstrapModal
        show={visible}
        size="lg"
        onHide={() => {
          if (
            type !== Modal.TYPES.BLOCKED
            && type !== Modal.TYPES.NO_BUTTONS_AND_BLOCKED
          ) {
            this.handleClose(Modal.BUTTONS.CANCEL);
          }
        }}
        style={{ zIndex: 5000000000 }}
        backdropClassName="App-z-index-200000 Modal-backdrop"
        centered
      >
        {!noHeader && (
          <BootstrapModal.Header
            closeButton={(
              type !== Modal.TYPES.BLOCKED
              && type !== Modal.TYPES.NO_BUTTONS_AND_BLOCKED
            )}
          >
            <BootstrapModal.Title>
              {title}
            </BootstrapModal.Title>
          </BootstrapModal.Header>
        )}
        <BootstrapModal.Body>
          {body}
        </BootstrapModal.Body>
        {footer && (
          <BootstrapModal.Footer>
            {footer}
          </BootstrapModal.Footer>
        )}
      </BootstrapModal>
    );
  }
}

// Types of buttons that can be clicked
Modal.BUTTONS = {
  YES: 'yes',
  NO: 'no',
  CANCEL: 'cancel',
  CONTINUE: 'continue',
  BACK: 'back',
};

// Types of modals to show
Modal.TYPES = {
  OKAY: 'okay',
  CANCEL: 'cancel',
  OKAY_CANCEL: 'okay-cancel',
  YES_NO: 'yes-no',
  YES_NO_CANCEL: 'yes-no-cancel',
  BACK_CONTINUE: 'back-continue',
  NO_BUTTONS: 'no-buttons',
  BLOCKED: 'blocked', // no cancel, no X, no way to get out
  NO_BUTTONS_AND_BLOCKED: 'no-buttons-and-blocked',
};

// Prop types
Modal.propTypes = {
  // The body of the modal
  body: PropTypes.node.isRequired,
  // Handler to call when modal is closed
  onClose: PropTypes.func,
  // The title of the modal
  title: PropTypes.node,
  // If true, no header
  noHeader: PropTypes.bool,
  // Type of the modal
  type: PropTypes.string,
  // The text of the okay button
  okayLabel: PropTypes.string,
  // The bootstrap color of the okay button
  okayColor: PropTypes.string,
};

// Default prop values
Modal.defaultProps = {
  // Generic Title
  title: 'Prompt',
  // Header exists
  noHeader: false,
  // By default, the modal is an okay modal
  type: Modal.TYPES.OKAY,
  // By default, the okay button is labeled "Okay"
  okayLabel: 'Okay',
  // By default, the okay button is info color
  okayColor: 'info',
  // No handler
  onClose: () => {},
};

export default Modal;
