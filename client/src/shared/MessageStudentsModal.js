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
};

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
      // TODO: Send message here through CACCL

      // Set state with artificial delay for now
      setTimeout(
        () => { return this.setState({ state: STATES.SUCCESS }); },
        2000
      );
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

    const numRecipients = recipientIds.length;

    const previewView = (
      <div>
        <h5 style={{ paddingBottom: '10px' }}>
          You are about to send the following message to
          {` ${numRecipients}`}
          {numRecipients === 1 ? ' person' : ' people'}
          :
        </h5>
        <table className="table table-sm table-bordered">
          <colgroup>
            <col span="1" style={{ width: '15%' }} />
            <col span="1" style={{ width: '85%' }} />
          </colgroup>
          <tbody>
            <tr>
              <th className="table-info" scope="row">Subject:</th>
              <td>{subject}</td>
            </tr>
            <tr>
              <th className="table-info" scope="row">Body:</th>
              <td>{defaultBody}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );

    const loadingView = (
      <h5 style={{ textAlign: 'center' }}>
        Sending Message...
        <LoadingSpinner />
      </h5>
    );

    const successView = (
      <div>
        The message was sent successfully!
      </div>
    );

    const failureView = (
      <div>
        We encountered a problem while sending the message.
        Please try again later or contact an admin if the problem persists.
      </div>
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
