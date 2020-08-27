/**
 * Content for the GradeStats component
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import caccl
import initCACCL from 'caccl/client/cached';

// Import FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

// Import shared components
import AssignmentsDropdown from '../../shared/AssignmentsDropdown';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Modal from '../../shared/Modal';
import CopyButton from '../../shared/CopyButton';
import Tooltip from '../../shared/Tooltip';

// Get data
import getCanvasData from '../../helpers/getCanvasData';

/* -------------------------- Constants ------------------------- */

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

class GradeStatsContent extends Component {
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
   * Render GradeStatsContent
   * @author Gabe Abrams
   */
  render() {
    const {
      setActions,
      onOpenHelp,
    } = this.props;
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

    // Create announcement language
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
          {/* Subtitle */}
          <div className="text-left mt-2">
            <strong>
              Statistics:
            </strong>
            {' '}
            <Tooltip
              text="stats based only on nonzero scores"
              onOpenHelp={onOpenHelp}
            />
          </div>

          {/* Stat Group */}
          <div className="list-group text-left">
            {/* Mean */}
            <li className="list-group-item pt-1 pb-1 pr-1 pl-2">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <strong>
                    Mean:&nbsp;
                  </strong>
                  {assignment.avgNonzeroScore}
                </div>
                <div>
                  <CopyButton
                    text={assignment.avgNonzeroScore}
                    small
                  />
                </div>
              </div>
            </li>

            {/* Median */}
            <li className="list-group-item pt-1 pb-1 pr-1 pl-2">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <strong>
                    Median:&nbsp;
                  </strong>
                  {assignment.medianNonzeroScore}
                </div>
                <div>
                  <CopyButton
                    text={assignment.medianNonzeroScore}
                    small
                  />
                </div>
              </div>
            </li>

            {/* Standard Deviation */}
            <li className="list-group-item pt-1 pb-1 pr-1 pl-2">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <strong>
                    SD:&nbsp;
                  </strong>
                  {assignment.stdevNonzeroScore}
                </div>
                <div>
                  <CopyButton
                    text={assignment.stdevNonzeroScore}
                    small
                  />
                </div>
              </div>
            </li>
          </div>
        </div>
      );
    }

    /* --------------------------- Actions -------------------------- */

    const actions = [
      {
        key: 'send-grade-stats-announcement',
        id: 'GradeStatsContent-send-grade-stats-announcement',
        label: (
          <span>
            <FontAwesomeIcon
              icon={faBullhorn}
              className="mr-2"
            />
            Post Stats Announcement
          </span>
        ),
        description: 'send grade stats announcement to students',
        onClick: () => {
          this.setState({
            state: STATES.ANNOUNCEMENT_PREVIEW,
          });
        },
      },
    ];

    setActions(actions);

    /* ---------------------------- Modal --------------------------- */

    let modal;

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
      );
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

GradeStatsContent.propTypes = {
  /**
   * Handler for setting the list of actions in the action bar
   * @param {Action[]} actions - list of actions
   */
  setActions: PropTypes.func.isRequired,
  // Handler to call when user wants to open help
  onOpenHelp: PropTypes.func.isRequired,
};

export default GradeStatsContent;
