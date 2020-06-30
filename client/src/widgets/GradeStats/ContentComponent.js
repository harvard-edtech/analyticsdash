/**
 * Dummy content component
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';

// Import caccl
import initCACCL from 'caccl/client/cached';

// Import FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faArrowUp } from '@fortawesome/free-solid-svg-icons';

// Import shared components
import AssignmentsDropdown from '../../shared/AssignmentsDropdown';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Modal from '../../shared/Modal';

// Get data
import getCanvasData from '../../helpers/getCanvasData';

// States
const STATES = {
  HOME: 'home',
  ANNOUNCEMENT_PREVIEW: 'announcement-preview',
  ANNOUNCEMENT_BEING_CREATED: 'announcement-being-created',
  ANNOUNCEMENT_CREATED: 'announcement-created',
};

/* ----------------------- Initialization ----------------------- */

// Initialize caccl
const { api } = initCACCL();

/* ---------------------------- Class --------------------------- */

class ContentComponent extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      // Current assignment
      assignment: null,
      // Current state
      state: STATES.HOME,
      // A fatal error message
      fatalErrorMessage: null,
    };

    // Load students
    this.numStudents = getCanvasData().listStudents().length;
  }

  /**
   * Render ContentComponent
   * @author Gabe Abrams
   */
  render() {
    const {
      assignment,
      state,
      fatalErrorMessage,
    } = this.state;

    // Create assignment chooser
    const assignmentDropdown = (
      <AssignmentsDropdown
        onChange={(newAssignment) => {
          this.setState({
            assignment: newAssignment,
          });
        }}
      />
    );

    /* ---------------------------- Body ---------------------------- */

    let body;

    // Waiting for assignment
    if (!assignment) {
      body = (
        <LoadingSpinner />
      );
    }

    // Assignment was there
    if (!body) {
      body = (
        <div>
          <div className="row">
            <div
              className="col"
              style={{ fontSize: '25px' }}
            >
              <strong>
                Mean:&nbsp;
              </strong>
              {assignment.avgNonzeroScore}
            </div>
            <div
              className="col"
              style={{ fontSize: '25px' }}
            >
              <strong>
                Median:&nbsp;
              </strong>
              {assignment.medianNonzeroScore}
            </div>
            <div
              className="col"
              style={{ fontSize: '25px' }}
            >
              <strong>
                SD:&nbsp;
              </strong>
              {assignment.stdevNonzeroScore}
            </div>
          </div>

          <div className="mt-3">
            <button
              type="button"
              className="btn btn-lg btn-secondary"
              aria-label="send grade stats announcement to students"
              onClick={() => {
                this.setState({
                  state: STATES.ANNOUNCEMENT_PREVIEW,
                });
              }}
            >
              <FontAwesomeIcon
                icon={faBullhorn}
                className="mr-2"
              />
              Post Stats Announcement
            </button>
          </div>
        </div>
      );
    }

    /* ---------------------------- Modal --------------------------- */

    let modal;

    const announcementTitle = (
      assignment
        ? `Grade stats for "${assignment.name.trim()}"`
        : ''
    );
    const announcementMessage = (
      assignment
        ? `For the assignment "${assignment.name.trim()}," the mean was ${assignment.avgNonzeroScore} points, the median was ${assignment.medianNonzeroScore} points, and the standard deviation was ${assignment.stdevNonzeroScore} points.`
        : ''
    );
    if (fatalErrorMessage) {
      modal = (
        <Modal
          key="error"
          title="Oops! An error occurred!"
          body={fatalErrorMessage}
          type={Modal.TYPES.OKAY}
          onClose={() => {
            this.setState({
              fatalErrorMessage: null,
            });
          }}
        />
      );
    } else if (state === STATES.ANNOUNCEMENT_PREVIEW) {
      modal = (
        <Modal
          key="preview"
          title="Announcement Preview"
          type={Modal.TYPES.OKAY_CANCEL}
          okayLabel="Post Announcement"
          body={(
            <div>
              <div className="alert alert-info m-0">
                <h3 className="lead font-weight-bold">
                  {announcementTitle}
                </h3>
                <p className="m-0">
                  {announcementMessage}
                </p>
              </div>
            </div>
          )}
          onClose={async (button) => {
            if (button === Modal.BUTTONS.CANCEL) {
              return this.setState({
                state: STATES.HOME,
              });
            }

            // Update modal
            this.setState({
              state: STATES.ANNOUNCEMENT_BEING_CREATED,
            });

            // Send the announcement!
            try {
              await api.course.announcement.create({
                courseId: getCanvasData().getCourseId(),
                title: announcementTitle,
                message: announcementMessage,
              });
            } catch (err) {
              return this.setState({
                fatalErrorMessage: err.message,
              });
            }

            // Finish
            this.setState({
              state: STATES.ANNOUNCEMENT_CREATED,
            });
          }}
        />
      );
    } else if (state === STATES.ANNOUNCEMENT_BEING_CREATED) {
      modal = (
        <Modal
          key="being-created"
          title="Creating Announcement..."
          type={Modal.TYPES.BLOCKED}
          body={(
            <LoadingSpinner />
          )}
        />
      );
    } else if (state === STATES.ANNOUNCEMENT_CREATED) {
      modal = (
        <Modal
          key="created"
          title="Announcement Posted!"
          body="The announcement has been sent and will immediately be visible to students."
          type={Modal.TYPES.OKAY}
          okayLabel="Close"
          onClose={() => {
            this.setState({
              state: STATES.HOME,
            });
          }}
        />
      )
    }

    /* ----------------------- Create Full UI ----------------------- */

    return (
      <div>
        {modal}
        {assignmentDropdown}
        {body}
      </div>
    );
  }
}

export default ContentComponent;
