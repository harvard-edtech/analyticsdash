/**
 * Content component for Submission Punctuality Widget
 * @author Aryan Pandey
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faListUl } from '@fortawesome/free-solid-svg-icons';

// Import Charts
import BarChart from '../../shared/charts/BarChart';
import PieChart from '../../shared/charts/PieChart';

// Import shared components
import AssignmentsDropdown from '../../shared/AssignmentsDropdown';
import LoadingSpinner from '../../shared/LoadingSpinner';
import Tooltip from '../../shared/Tooltip';

// Import Modal components
import MessageStudentModal from '../../shared/MessageStudentsModal';
import Modal from '../../shared/Modal';

// Import colors
import COLORS from '../../shared/charts/style/COLORS';

// Import styles
import './SubmissionPunctualityContentComponent.css';

// Get data
import getCanvasData from '../../helpers/getCanvasData';

/* -------------------------- Constants ------------------------- */

// States
const STATES = {
  HOME: 'home',
  MESSAGE_LATE_STUDENTS: 'message-late-students',
  MESSAGE_NO_SUBMISSIONS: 'message-no-submissions',
  SHOW_DETAILED_VIEW: 'show-detailed-view',
};

// Submission Types
const SUBMISSION = {
  LATE: 'Late',
  ON_TIME: 'On Time',
  NO_SUB: 'No Submission',
  SUBMITTED: 'Submitted',
};

// Total days to display
const DAYS = 11;
// Number of bars to partition a day into
const DAY_PARTITION = 3;
// Number of days to show that are considered on time
// (inclusize of due date)
const ON_TIME_DAYS = 7;
// Label strings that get added onto each bar in order.
// Must have entries equal to DAY_PARTITION
const BAR_LABELS = ['morning', 'midday', 'evening'];

/* ---------------------------- Class --------------------------- */

class SubmissionPunctualityContentComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Current assignment
      assignment: null,
      // Current state
      state: STATES.HOME,
    };
  }

  render() {
    const {
      assignment,
      state,
    } = this.state;

    const {
      configuration,
      setActions,
      onOpenHelp,
    } = this.props;

    const {
      gracePeriod,
    } = configuration;

    /* ----------------------------- Helpers ------------------------------ */

    /**
     * Returns the median value from an array of numbers
     * @param {number[]} arr - Array of unsorted numbers
     * @returns {number} median value
     */
    const getMedian = (arr) => {
      const mid = Math.floor(arr.length / 2);
      const nums = [...arr].sort((a, b) => { return a - b; });
      return (
        arr.length % 2 !== 0
          ? nums[mid]
          : (nums[mid - 1] + nums[mid]) / 2
      );
    };

    /**
     * returns date string as month/day from date object
     * @param {object} date - JS Date Object
     * @returns {string} formatted date string
     */
    const getDateString = (date) => {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    /**
     * takes student info and returns formatted table row
     * @param {Object} student - canvas student object
     *   with additional props
     * @param {number} rowNum - current row index
     * @returns{node} formatted table row div
     */
    const generateTableRow = (student, rowNum) => {
      return (
        <tr>
          <th scope="row">{rowNum}</th>
          <td>{student.name}</td>
          <td>{student.sis_user_id}</td>
          <td>{student.subType}</td>
          <td>
            {
              (student.submittedAt
                ? student.submittedAt.toString()
                : 'n/a'
              )
            }
          </td>
        </tr>
      );
    };

    /* ---------------------------- Body ---------------------------- */
    let body;
    let messageModal;
    let detailedViewModal;

    const canvasData = getCanvasData();

    // Define assignment dropdown menu
    const assignmentDropdown = (
      <AssignmentsDropdown
        onChange={(newAssignment) => {
          this.setState({
            assignment: newAssignment,
          });
        }}
        byMostRecentGrading
      />
    );

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

      // Assignment has no submissions
      if (subs.length === 0) {
        body = (
          <div style={{ padding: '10px' }}>
            This assignment has no submissions.
          </div>
        );
      } else {
        // anchor date used to partition barchart
        let anchorDate;

        // Get assignment due date
        const dueDate = assignment.due_at;

        if (dueDate) {
          // if dueDate present, use it as the anchor
          anchorDate = dueDate;
        } else {
          // else use median submission time as anchor
          const subTimes = subs.map((sub) => {
            return sub.submittedAt.getTime();
          });
          anchorDate = new Date(getMedian(subTimes));
        }

        /* --------------------- Filter Submissions ------------------------ */

        // Array to hold submitter data
        const submitters = [];

        // Counters
        let onTimeSubmissions = 0;
        let lateSubmissions = 0;

        // Late, On time or Submitted
        let submissionType;

        subs.forEach((sub) => {
          if (dueDate) {
            // Filter submissions into on time and late if due date present
            if (
              (sub.submittedAt.getTime() - (gracePeriod * 60000))
              <= dueDate.getTime()
            ) {
            // was submitted before the due date (accounting for grace period)
              submissionType = SUBMISSION.ON_TIME;
              onTimeSubmissions += 1;
            } else {
            // was submitted after the due date
              submissionType = SUBMISSION.LATE;
              lateSubmissions += 1;
            }
          } else {
            // If no due date, mark as submitted
            submissionType = SUBMISSION.SUBMITTED;
          }
          // Push submitter data
          submitters.push(
            {
              subType: submissionType,
              submittedAt: sub.submittedAt,
              ...canvasData.getUser(sub.submitterId),
            }
          );
        });

        // Get students
        const students = canvasData.listStudents();

        // Find students who did not submit
        students.forEach((student) => {
          const found = subs.some((sub) => {
            return (sub.submitterId === String(student.id));
          });
          if (!found) {
            submitters.push(
              {
                subType: SUBMISSION.NO_SUB,
                ...student,
              }
            );
          }
        });
        /* ----------------------- Create Pie Chart ----------------------- */

        // Initilize pieChart data array
        const pieData = [
          {
            label: 'No Sub',
            value: students.length - subs.length,
          },
        ];

        if (dueDate) {
          // If due date present, label subs as on time and late
          pieData.push({
            label: SUBMISSION.ON_TIME,
            value: onTimeSubmissions,
          },
          {
            label: SUBMISSION.LATE,
            value: lateSubmissions,
          });
        } else {
          // If not present, label as submitted
          pieData.push({
            label: SUBMISSION.SUBMITTED,
            value: subs.length,
          });
        }

        /* ----------------------- Create Bar Chart ----------------------- */

        // bar chart data
        const barChartData = [];

        // Calculate bucketSize
        const bucketSize = DAYS * DAY_PARTITION;

        // Set starting date
        anchorDate.setDate(anchorDate.getDate() - ON_TIME_DAYS);

        // initialize chart with empty bars and labels
        for (let i = 0; i < bucketSize; i++) {
          if (i % DAY_PARTITION === 0) {
            anchorDate.setDate(anchorDate.getDate() + 1);
          }
          let label;
          label = getDateString(anchorDate);

          label = `${label} ${BAR_LABELS[i % DAY_PARTITION]}`;
          barChartData.push({
            label,
            values: {
              'On Time': 0,
              Late: 0,
            },
          });
        }

        /* ----------------------- Fill Bar Chart ----------------------- */

        submitters.forEach((sub) => {
          if (sub.submittedAt) {
            let dateLabel = getDateString(sub.submittedAt);
            const hours = sub.submittedAt.getHours();

            dateLabel = `${dateLabel} ${BAR_LABELS[Math.floor(hours / (24 / DAY_PARTITION))]}`;

            if (dueDate) {
              if (
                sub.subType === SUBMISSION.ON_TIME
                || sub.subType === SUBMISSION.SUBMITTED
              ) {
                barChartData.find((o, i) => {
                  if (o.label === dateLabel) {
                    barChartData[i].values[SUBMISSION.ON_TIME] += 1;
                    return true; // stop searching
                  }
                  return false;
                });
              }
              if (sub.subType === SUBMISSION.LATE) {
                barChartData.find((o, i) => {
                  if (o.label === dateLabel) {
                    if (barChartData[i].values) {
                      barChartData[i].values[SUBMISSION.LATE] += 1;
                    }
                    return true; // stop searching
                  }
                  return false;
                });
              }
            } else {
            // If no due date, consider all submissions to be on time
              barChartData.find((o, i) => {
                if (o.label === dateLabel) {
                  barChartData[i].values[SUBMISSION.ON_TIME] += 1;
                  return true; // stop searching
                }
                return false;
              });
            }
          }
        });

        /* --------------------------- Detailed View ------------------------ */
        const detailedViewBtn = (
          <button
            type="button"
            onClick={() => {
              this.setState({ state: STATES.SHOW_DETAILED_VIEW });
            }}
            className="btn btn-secondary"
          >
            <FontAwesomeIcon
              icon={faListUl}
              className="mr-2"
            />
            Details
          </button>
        );

        detailedViewModal = (
          state === STATES.SHOW_DETAILED_VIEW
            ? (
              <Modal
                key="submission-punctuality-content-component-detailed-view"
                title="Submission Details"
                type={Modal.TYPES.OKAY}
                body={(
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th className="SubmissionPunctuality-detailed-view-table-header" scope="col">#</th>
                          <th className="SubmissionPunctuality-detailed-view-table-header" scope="col">Name</th>
                          <th className="SubmissionPunctuality-detailed-view-table-header" scope="col">University ID</th>
                          <th className="SubmissionPunctuality-detailed-view-table-header" scope="col">Submission Type</th>
                          <th className="SubmissionPunctuality-detailed-view-table-header" scope="col">Submission Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          // Dynamically get table rows
                          submitters.map((student, index) => {
                            return generateTableRow(student, index + 1);
                          })
                        }

                      </tbody>
                    </table>
                  </div>
          )}
                onClose={() => {
                  this.setState({
                    state: STATES.HOME,
                  });
                }}
              />
            )
            : null
        );
        /* ----------------------- Create Body----------------------- */
        body = (
          <div style={{ padding: '10px' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '70%' }}>
                <h5>
                  Submission Heatmap:
                  <Tooltip
                    text="When people submitted their final submission. Taller bars mean more people submitted at that time."
                    onOpenHelp={onOpenHelp}
                  />
                </h5>
                <BarChart
                  title="Submission Punctuality"
                  valueAxisLabel="Number of Submissions"
                  barAxisLabel="Submission Times"
                  bars={barChartData}
                  maxHeight={350}
                  colorMap={
                {
                  [SUBMISSION.LATE]: COLORS.RED,
                  [SUBMISSION.ON_TIME]: COLORS.BLUE,
                }
              }
                  tooltipFormatter={(bar) => {
                    return (
                      <div>
                        {`${bar.indexValue}: ${bar.value} submissions`}
                      </div>
                    );
                  }}
                  hideTitle
                />
              </div>
              <div style={{
                width: '30%',
                minWidth: '200px',
                height: '350 px',
              }}
              >
                <h5>
                  Submission Status:
                </h5>
                <PieChart
                  title="Submission Status:"
                  segments={pieData}
                  showLegend
                  hideTitle
                  colorMap={{
                    [SUBMISSION.LATE]: COLORS.RED,
                    [SUBMISSION.ON_TIME]: COLORS.BLUE,
                    [SUBMISSION.SUBMITTED]: COLORS.BLUE,
                    'No Sub': COLORS.GRAY,
                  }}
                  height={350}
                />
                {detailedViewBtn}
              </div>
            </div>
          </div>
        );

        /* --------------------------- Actions -------------------------- */

        const actions = [
          {
            key: 'message-late-students',
            id: 'SubmissionPunctualityContentComponent-message-late-students',
            label: (
              <span>
                <FontAwesomeIcon
                  icon={faBullhorn}
                  className="mr-2"
                />
                Message Late Students
              </span>
            ),
            description: 'Send message to students with late submissions',
            onClick: () => {
              this.setState({
                state: STATES.MESSAGE_LATE_STUDENTS,
              });
            },
          },
          {
            key: 'message-no-submissions',
            id: 'SubmissionPunctualityContentComponent-message-no-submissions',
            label: (
              <span>
                <FontAwesomeIcon
                  icon={faBullhorn}
                  className="mr-2"
                />
                Message students with no submissions
              </span>
            ),
            description: 'Send message to students who have not submitted the assignment',
            onClick: () => {
              this.setState({
                state: STATES.MESSAGE_NO_SUBMISSIONS,
              });
            },
          },
        ];

        // Set all actions only if we have a due date
        if (dueDate) {
          setActions(actions);
        } else {
          // if no dueDate, only allow message-no-submissions
          setActions([actions[1]]);
        }
        if (state === STATES.MESSAGE_LATE_STUDENTS) {
        // MessageModal component for messaging late students
          messageModal = (
            <MessageStudentModal
              recipientIds={
              submitters
                .filter(
                  (submitter) => {
                    return (submitter.subType === SUBMISSION.LATE);
                  }
                )
                .map((sub) => {
                  return sub.id;
                })
              }
              subject="Late Submission"
              defaultBody={`Your submission for ${assignment.name} was late`}
              onClose={() => {
                this.setState({
                  state: STATES.HOME,
                });
              }}
            />
          );
        } else if (state === STATES.MESSAGE_NO_SUBMISSIONS) {
        // MessageModal component for messaging students with no submissions
          messageModal = (
            <MessageStudentModal
              recipientIds={
                submitters
                  .filter(
                    (submitter) => {
                      return (submitter.subType === SUBMISSION.NO_SUB);
                    }
                  )
                  .map((sub) => {
                    return sub.id;
                  })
              }
              subject="Missing Submission"
              defaultBody={`You have not submitted ${assignment.name} yet`}
              onClose={() => {
                this.setState({
                  state: STATES.HOME,
                });
              }}
            />
          );
        }
      }
    }

    /* ----------------------- Create Full UI ----------------------- */
    return (
      <div>
        {assignmentDropdown}
        {body}
        {messageModal}
        {detailedViewModal}
      </div>
    );
  }
}

SubmissionPunctualityContentComponent.propTypes = {
  // The current configuration, which provides the grace period for submissions
  configuration: PropTypes.shape({ gracePeriod: PropTypes.number }).isRequired,
  /**
 * Handler for setting the list of actions in the action bar
 * @param {Action[]} actions - list of actions
 */
  setActions: PropTypes.func.isRequired,
  // Handler to call when user wants to open help
  onOpenHelp: PropTypes.func.isRequired,
};

export default SubmissionPunctualityContentComponent;
