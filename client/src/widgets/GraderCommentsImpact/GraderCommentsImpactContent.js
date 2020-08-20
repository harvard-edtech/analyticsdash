/**
 * Content for the GraderCommentsImpact widget
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared components 
import BarChart from '../../shared/charts/BarChart';
import PieChart from '../../shared/charts/PieChart';

// Import shared colors 
import COLORS from '../../shared/charts/style/COLORS';
// Import data
import getCanvasData from '../../helpers/getCanvasData';

/* -------------------------- Constants ------------------------- */

// States
const STATES = {
  HOME: 'home',
  MESSAGE_PREVIEW: 'message-preview',
};

/* ---------------------------- Class --------------------------- */

class GraderCommentsImpactContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Current view state 
      state: STATES.HOME,
    }
  }

  messageActionHandler() {
    this.setState(STATES.MESSAGE_PREVIEW)
  }

  render() {
    const {
      setActions,
    } = this.props;

    const {
      state,
    } = this.state;

    /* -------------------- Calculate data ----------------------- */
    const canvasData = getCanvasData();
    const assignments = getCanvasData.listAssignments();
    let readData = [];
    // For each assignment, collate raw comment read data
    assignments.forEach((assignment) => {
      // Do nothing if assignment grading has not started
      if (!assignment.gradingStarted) {
        return;
      }

      const submissions = canvasData.listSubmissions(assignment.id);
      // Arrays to store students for each condition
      const studentsWithUnreadComments = [];
      const studentsWithReadComments = [];
      const studentsWithNoComments = [];
      // Process submission assignments
      submissions.forEach((submission) => {
        const {
          comments,
          gradedAt,
          submitterId,
        } = submission;

        // Don't process ungraded submissions (TODO?)
        if (gradedAt) {
          // Get user object from submitterId
          const student = canvasData.getUser(submitterId);

          // No comments
          if (comments.length === 0) {
            studentsWithNoComments.push(student);
          } else {
            const commentRead = comments.some((comment) => {
              return comment.read;
            });
            if (commentRead) {
              studentsWithReadComments.push(student);
            } else {
              studentsWithUnreadComments.push(student);
            }
          }
        }
      });

      // Push assignment data
      readData.push({
        assignmentId: assignment.id,
        assignmentName: assignment.name,
        studentsWithUnreadComments,
        studentsWithReadComments,
        studentsWithNoComments,
      });
    });

    /* ----------------------- Bar Chart ------------------------- */

    // Convert raw data into bar chart data format
    const barChartData = readData.map((datum) => {
      // Convert array lengths to percentages
      const read = datum.studentsWithReadComments.length;
      const unread = datum.studentsWithUnreadComments.length;
      const none = datum.studentsWithNoComments.length;

      const total = read + unread + none;
      const readPct = (read / total) * 100;
      const unreadPct = (unread / total) * 100;
      const nonePct = (none / total) * 100;

      return ({
        label: datum.assignmentName,
        values: {
          'Read Comment(s)': readPct,
          'Had No Comments': nonePct,
          'Did Not Read Comment(s)': unreadPct,
        },
      });
    });

    const barChart = (
      <BarChart
        title="Comments Read Per Assignment"
        valueAxisLabel="Percentage of Comments Read"
        barAxisLabel="Assignment"
        minValue={0}
        maxValue={100}
        bars={barChartData}
        colorMap={{
          'Read Comment(s)': COLORS.BLUE,
          'Had No Comments': COLORS.GRAY,
          'Did Not Read Comment(s)': COLORS.RED,
        }}
      />
    );

    return (
      barChart
    );
  }
}

GraderCommentsImpactContent.propTypes = {
  /**
   * Handler for setting the list of actions in the action bar
   * @param {Action[]} actions - list of actions
   */
  setActions: PropTypes.func.isRequired,
};

export default GraderCommentsImpactContent;
