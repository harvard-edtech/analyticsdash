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
import ProgressBar from '../../shared/ProgressBar';
import ProgressBarContainer from '../../shared/ProgressBarContainer';
import MessageStudentsModal from '../../shared/MessageStudentsModal';

// Import canvas data
import getCanvasData from '../../helpers/getCanvasData';

// Constants
const STATES = {
  MAIN: 'main-view',
  SEND_MESSAGE: 'send-message-view',
};

/* ---------------------------- Class --------------------------- */

class GradingProgressContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Currently viewed assignment
      assignment: null,
      // Current widget view
      state: STATES.MAIN,
    };
  }

  render() {
    const {
      assignment,
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
          <ProgressBar
            ariaLabel="Overall grading progress"
            percentProgress={percentGraded}
          />
        );

        // Student-by-student grading data for CSV download button
        const gradingProgressData = subs.map((submission) => {
          const submitter = canvasData.getUser(submission.submitterId);
          return ({
            student: submitter.name,
            graded: (submission.gradedAt ? 'Yes' : 'No'),
          });
        });

        const overallView = (
          <ProgressBarContainer
            title="Grading Progress"
            progressBars={[overallProgressBar]}
            tooltipProps={{
              text: 'Displays the percentage of all submissions that have been given a grade.',
              onOpenHelp,
            }}
            csvDownloadProps={{
              filename: `${assignment.name} grading progress`,
              headerMap: {
                student: 'Student',
                graded: 'Graded?',
              },
              data: gradingProgressData,
              id: 'rubric-grading-progress-download-button',
            }}
          />
        );

        /* ---------------------- Rubric View ------------------------ */
        let rubricBars;

        if (assignment.rubric) {
          // Create map of rubric criteria -> number of submissions with a grade
          const rubricProgressMap = {};
          assignment.rubric.forEach((criterion) => {
            rubricProgressMap[criterion.id] = {
              value: 0,
              description: criterion.description,
            };
          });

          // Populate rubric progress map by checking each submission
          subs.forEach((sub) => {
            sub.rubricAssessments.forEach((assessment) => {
              assessment.assessmentRatings.forEach((rating) => {
                if (rating.points !== null) {
                  rubricProgressMap[rating.criterionId].value += 1;
                }
              });
            });
          });

          // Use progress map to define a progress bar for each criterion
          rubricBars = Object.values(rubricProgressMap).map(
            ({ value, description }) => {
              const progress = ((value / subs.length) * 100);

              return (
                <ProgressBar
                  key={`${description}-progress-bar`}
                  title={description}
                  ariaLabel={`${description} progress`}
                  percentProgress={progress}
                />
              );
            }
          );
        }

        const rubricView = (
          assignment.rubric
            ? (
              <ProgressBarContainer
                title="Rubric Grading Progress"
                progressBars={rubricBars}
                tooltipProps={{
                  text: 'For each rubric item, displays the percentage of all submissions that have a grade.',
                  onOpenHelp,
                }}
                csvDownloadProps={{
                  filename: `${assignment.name} rubric grading progress`,
                  headerMap: { todo: 'TODO' },
                  data: gradingProgressData,
                  id: 'rubric-grading-progress-download-button',
                }}
              />
            )
            : null
        );

        /* ---------------------- Action Modals ---------------------- */

        const graderIds = canvasData.listTTMs().map((user) => {
          return user.Id;
        });

        const sendMessageModal = (
          (state === STATES.SEND_MESSAGE)
            ? (
              <MessageStudentsModal
                recipientIds={graderIds}
                subject={`Grading progress on ${assignment.name}`}
                defaultBody={`Hi! Please check Canvas for ungraded submissions for the ${assignment.name} assignment.`}
                onClose={() => { this.setState({ state: STATES.MAIN }); }}
              />
            )
            : null
        );

        setActions([
          {
            key: 'message-graders-action',
            id: 'message-graders-action',
            label: 'Message all teaching team members',
            description: 'Send an editable message to all course graders',
            onClick: () => { this.setState({ state: STATES.SEND_MESSAGE }); },
          },
          {
            key: 'open-speedgrader-action',
            id: 'open-speedgrader-action',
            label: 'Open assignment in SpeedGrader',
            description: 'Open this assignment in the Canvas SpeedGrader',
            onClick: () => {
              window.open(
                `https://canvas.harvard.edu/courses/${canvasData.getCourseId()}/gradebook/speed_grader?assignment_id=${assignment.id}`
              );
            },
          },
        ]);

        /* ------------------------ Full body ------------------------ */

        body = (
          <div>
            {/* Main grading progress bar */}
            {overallView}
            {/* Detailed rubric progress bars */}
            {rubricView}
            {/* Action modal */}
            {sendMessageModal}
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
