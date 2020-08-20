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

    const previewView = (
      <div />
    );

    const loadingView = (
      <LoadingSpinner />
    );

    const successView = (
      <div />
    );

    const failureView = (
      <div />
    );

    let body;
    let type;
    if (state === STATES.PREVIEW) {
      body = previewView;
      type = Modal.TYPES.OKAY_CANCEL;
    } else if (state === STATES.LOADING) {
      body = loadingView;
      type = Modal.TYPES.BLOCKED;
    } else if (state === STATES.SUCCESS) {
      body = successView;
      type = Modal.TYPES.NO_BUTTONS;
    } else if (state === STATES.FAILURE) {
      body = failureView;
      type = Modal.TYPES.NO_BUTTONS;
    }

    return (
      <Modal
        body={body}
        onClose={onClose}
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
  onClose: PropTypes.func.isRequired,
}

export default MessageStudentsModal;
