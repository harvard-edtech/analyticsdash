/**
 * Content for the GradingProgress widget
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared components
import AssignmentsDropdown from '../../shared/AssignmentsDropdown';
import LoadingSpinner from '../../shared/LoadingSpinner';
import MessageStudentsModal from '../../shared/MessageStudentsModal';
import Tooltip from '../../shared/Tooltip';
import CSVDownloadButton from '../../shared/CSVDownloadButton';

// Get data
import getCanvasData from '../../helpers/getCanvasData';

// Constants
const STATES = {
  MAIN: 'main-view',
  SEND_MESSAGE: 'send-message-view',
}

/* ---------------------------- Class --------------------------- */

class GradingProgressContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Currently viewed assignment
      assignment: null,
      // Rubric view expanded
      expanded: false,
      // Current widget view
      state: STATES.MAIN,
    };
  }

  render() {
    const {
      assignment,
      expanded,
      state,
    } = this.state;

    const {
      setActions,
      onOpenHelp,
    } = this.props;

    // Get Canvas data
    const canvasData = getCanvasData();

    // Define assignment dropdown menu
    const assignmentDropdown = (
      <AssignmentsDropdown
        onChange={(newAssignment) => {
          this.setState({
            assignment: newAssignment,
          });
        }}
        byMostRecentSubmissions
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
      // Look up assignment submissions
      const subs = canvasData.listSubmissions(assignment.id);
      const totalSubmissions = subs.length;

      if (totalSubmissions === 0) {
        body = (
          <div>
            This assignment has no submissions.
          </div>
        );
      } else {
        const percentGraded = (
          (1 - (assignment.needsGradingCount / totalSubmissions)) * 100
        );

        /* ------------------ Main Progress Bar ---------------------- */

        const overallProgressBar = (
          <div className="progress mt-1">
            <div
              aria-label="Grading progress"
              className="progress-bar bg-info"
              role="progressbar"
              style={{ width: `${percentGraded}%` }}
              aria-valuenow={percentGraded}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {percentGraded.toFixed(0)}
              %
            </div>
          </div>
        );

        // Student-by-student grading data for CSV download button
        const gradingProgressData = [{ todo: 'TODO' }];

        /* ---------------------- Rubric View ------------------------ */

        const expandRubricButton = (
          !expanded
            ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  this.setState({
                    expanded: true,
                  });
                }}
              >
                Rubric View
              </button>
            )
            : (
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  this.setState({
                    expanded: false,
                  });
                }}
              >
                Hide Rubric View
              </button>
            )
        );

        const rubricView = (
          expanded
            ? (
              <div className="text-left" style={{ width: '80%' }}>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="d-inline-block">
                      Rubric Grading Progress
                    </h5>
                    <Tooltip
                      text="For each rubric item, displays the percentage of all submissions that have a grade."
                      onOpenHelp={onOpenHelp}
                    />
                  </div>
                  <CSVDownloadButton
                    filename={`${assignment.name} rubric grading progress`}
                    headerMap={{ todo: 'TODO' }}
                    data={gradingProgressData}
                    id="rubric-grading-progress-download-button"
                  />
                </div>
                <div className="progress mt-1">
                  <div
                    aria-label="Grading progress"
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: `${percentGraded}%` }}
                    aria-valuenow={percentGraded}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {percentGraded.toFixed(0)}
                    %
                  </div>
                </div>
              </div>
            )
            : null
        );

        /* ---------------------- Action Modals ---------------------- */

        setActions([
          {
            key: 'message-graders-action',
            id: 'message-graders-action',
            label: 'Message all graders',
            description: 'Send an editable message to all course graders',
            onClick: () => { this.setState({ state: STATES.SEND_MESSAGE }); },
          },
          {
            key: 'open-speedgrader-action',
            id: 'open-speedgrader-action',
            label: 'Open assignment in SpeedGrader',
            description: 'Open this assignment in the Canvas SpeedGrader',
            onClick: () => {},
          },
        ]);

        /* ------------------------ Full body ------------------------ */

        body = (
          <div>
            {/* Main grading progress bar */}
            <div className="d-flex justify-content-between my-2">
              {/* Progress bar title and annotations */}
              <div className="text-left" style={{ width: '80%' }}>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="d-inline-block">
                      Grading Progress
                    </h5>
                    <Tooltip
                      text="Displays the percentage of all submissions that have been given a final grade."
                      onOpenHelp={onOpenHelp}
                    />
                  </div>
                  <CSVDownloadButton
                    filename={`${assignment.name} grading progress`}
                    headerMap={{ todo: 'TODO' }}
                    data={gradingProgressData}
                    id="grading-progress-download-button"
                  />
                </div>
                {overallProgressBar}
              </div>
              {/* Expand rubric button if not expanded */}
              <div className="d-flex align-items-center justify-content-around">
                {expandRubricButton}
              </div>
            </div>
            <div>
              {rubricView}
            </div>
          </div>
        );
      }
    }


    return (
      <div>
        {assignmentDropdown}
        {body}
      </div>
    );
  }
}

GradingProgressContent.propTypes = {
  /**
   * Handler for setting the list of actions in the action bar
   * @param {Action[]} actions - list of actions
   */
  setActions: PropTypes.func.isRequired,
  /**
   * Handler that opens the help component of the widget
   */
  onOpenHelp: PropTypes.func.isRequired,
};

export default GradingProgressContent;
