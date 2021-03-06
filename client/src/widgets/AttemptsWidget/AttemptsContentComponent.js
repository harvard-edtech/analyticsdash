/**
 * Content for the Attempts component
 * @author Aryan Pandey
 */

// Import React
import React, { Component } from 'react';

// Import shared chart component
import BarChart from '../../shared/charts/BarChart';

// Import shared components
import AssignmentsDropdown from '../../shared/AssignmentsDropdown';
import LoadingSpinner from '../../shared/LoadingSpinner';

// Import colors
import COLORS from '../../shared/charts/style/COLORS';

// Get data
import getCanvasData from '../../helpers/getCanvasData';

/* ---------------------------- Class --------------------------- */

class AttemptsContentComponent extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      // Current assignment
      assignment: null,
    };
  }

  /**
   * Render ContentComponent
   * @author Aryan Pandey
   */
  render() {
    const {
      assignment,
    } = this.state;

    // Load students
    const totalStudents = getCanvasData().listStudents().length;

    /* ------------------------ Assignment Dropdown ------------------------ */

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

    /* ---------------------------- -Bar Chart- ---------------------------- */
    let data;

    if (totalStudents && assignment) {
      // Initialize initial bucket state for bar chart
      data = [
        {
          label: '0 (Didn\'t Submit)',
          // Add 0 index as separate series so we can set its color separately
          values: { 'No Submissions': totalStudents },

        // ^ Initialize no submissions bucket to total students at start
        // number gets decremented when attempts are added
        },
        {
          label: '1',
          value: 0,
        },
        {
          label: '2',
          value: 0,
        },
        {
          label: '3',
          value: 0,
        },
        {
          label: '4',
          value: 0,
        },
        {
          label: '5+',
          value: 0,
        },
      ];

      // Fill bar chart with attempts data
      const submissionsList = getCanvasData().listSubmissions(assignment.id);

      submissionsList.forEach((value) => {
        // extract attempts data
        const { attempt } = value;

        // If number of attempts exceeds num buckets, group all into last bucket
        if (attempt >= data.length) {
          data[data.length - 1].value += 1;
          // Decrement no submissions bucket
          data[0].values['No Submissions'] -= 1;
          return;
        }

        if (attempt !== 0) {
          // Add attempt to respective bucket
          data[attempt].value += 1;
          // Decrement no submissions bucket
          data[0].values['No Submissions'] -= 1;
        }
      });
    }

    /**
     * custom tooltip function that appears on hover
     * @author {Aryan Pandey}
     * @param {object} args - object containing all arguments
     * @param {string | number} args.id - id of bar being hovered over
     * @param {number} args.value - value of bar being hovered over
     * @param {number} args.index - index of bar being hovered over
     * @param {string | number} args.indexValue - index value of the bar
     *   being hovered over
     * @param {string} args.color - color of bar being hovered over
     * @param {object} args.data - object containing raw data associated
     *   with current index
     * @returns {node} html div of the custom tooltip
     */
    const customTooltip = (args) => {
      const percentage = ((args.value / totalStudents) * 100).toFixed(2);
      return (
        <div>
          <strong>
            {args.value}
            {' '}
          </strong>
          students (
          {' '}
          <strong>
            {' '}
            {percentage}
            %
            {' '}
          </strong>
          {' '}
          )
        </div>
      );
    };

    /* -------------------------------- Body ------------------------------- */

    let body;

    // Waiting for assignment
    if (!assignment) {
      body = (
        <LoadingSpinner />
      );
    }
    if (!body) {
      body = (
        // initialize the bar chart
        <BarChart
          title="Assignment Attempts"
          bars={data}
          valueAxisLabel="Students"
          barAxisLabel="Attempts"
          tooltipFormatter={customTooltip}
          maxValue={totalStudents}
          colorMap={{ 'No Submissions': COLORS.GRAY }}
        />
      );
    }
    /* --------------------------- Create Full UI -------------------------- */

    return (
      <div>
        {assignmentDropdown}
        {body}
      </div>
    );
  }
}

export default AttemptsContentComponent;
