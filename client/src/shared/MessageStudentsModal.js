// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared components
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

// Constants
const STATES = {
  PREVIEW: 'message-preview',
  LOADING: 'message-loading',
  SUCCESS: 'message-success',
  FAILURE: 'message-failure',
}

class MessageStudentsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: STATES.PREVIEW,
    };
  }

  sendMessage() {
    this.setState({ state: STATES.LOADING });
    try {
      // Send message here
      this.setState({ state: STATES.SUCCESS });
    } catch (err) {
      this.setState({ state: STATES.FAILURE });
    }
  }

  render() {
    const {
      state,
    } = this.state;

    const {
      recipientIds,
      subject,
      defaultBody,
      onClose,
    } = this.props;

    const onClosePreview = (button) => {
      if (button === Modal.BUTTONS.OKAY) {
        return this.sendMessage();
      }
      // Otherwise, close modal
      return onClose();
    };

    const previewView = (
      <div />
    );

    const loadingView = (
      <LoadingSpinner />
    );

    const successView = (
      <div>
        The message was sent successfully!
      </div>
    );

    const failureView = (
      <div />
    );

    let body;
    let type;
    let onCloseView;
    if (state === STATES.PREVIEW) {
      body = previewView;
      type = Modal.TYPES.OKAY_CANCEL;
      onCloseView = onClosePreview;
    } else if (state === STATES.LOADING) {
      body = loadingView;
      type = Modal.TYPES.BLOCKED;
    } else if (state === STATES.SUCCESS) {
      body = successView;
      type = Modal.TYPES.NO_BUTTONS;
      onCloseView = onClose;
    } else if (state === STATES.FAILURE) {
      body = failureView;
      type = Modal.TYPES.NO_BUTTONS;
      onCloseView = onClose;
    }

    return (
      <Modal
        key={`message-students-modal-${state}`}
        body={body}
        onClose={onCloseView}
        title="Message Preview"
        type={type}
        okayLabel="Send Message"
      />
    );
  }
}

MessageStudentsModal.propTypes = {
  recipientIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  subject: PropTypes.string.isRequired,
  defaultBody: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

MessageStudentsModal.defaultProps = {
  // No handler
  onClose: () => {},
};

export default MessageStudentsModal;
