// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import caccl
import initCACCL from 'caccl/client/cached';

// Import shared components
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

// Get course data
import getCanvasData from '../helpers/getCanvasData';

// Constants
const STATES = {
  PREVIEW: 'message-preview',
  LOADING: 'message-loading',
  SUCCESS: 'message-success',
  FAILURE: 'message-failure',
};

// Initialize caccl
const { api } = initCACCL();

class MessageStudentsModal extends Component {
  constructor(props) {
    super(props);

    const { defaultBody } = this.props;

    this.state = {
      state: STATES.PREVIEW,
      messageBody: defaultBody,
    };
  }

  async sendMessage() {
    const {
      recipientIds,
      subject,
    } = this.props;

    const {
      messageBody,
    } = this.state;

    this.setState({ state: STATES.LOADING });
    const canvasData = getCanvasData();
    const courseId = canvasData.getCourseId();

    try {
      await api.conversation.create({
        recipientIds,
        subject,
        courseId,
        body: messageBody,
      });
      this.setState({ state: STATES.SUCCESS });
    } catch (err) {
      this.setState({ state: STATES.FAILURE });
    }
  }

  render() {
    const {
      state,
      messageBody,
    } = this.state;

    const {
      recipientIds,
      subject,
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
          <caption>Message info</caption>
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
              <td>
                <form>
                  <input
                    type="text"
                    style={{ width: '100%' }}
                    value={messageBody}
                    onChange={(event) => {
                      this.setState({ messageBody: event.target.value });
                    }}
                  />
                </form>
              </td>
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
  // Ids of the message recipients
  recipientIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  // Subject of the message
  subject: PropTypes.string.isRequired,
  // Default body of the message (will be editable)
  defaultBody: PropTypes.string.isRequired,
  // Function called when the modal is closed
  onClose: PropTypes.func,
};

MessageStudentsModal.defaultProps = {
  // No handler
  onClose: () => {},
};

export default MessageStudentsModal;
