/* eslint-disable import/no-unresolved */
/**
 * Content for the Attempts component
 * @author Aryan Pandey
 */

// Import React
import React, { Component } from 'react';

// Import chart component
import { ResponsiveBar } from '@nivo/bar';

// Import shared components
import AssignmentsDropdown from '../../shared/AssignmentsDropdown';
import LoadingSpinner from '../../shared/LoadingSpinner';

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

    // Load students
    this.numStudents = getCanvasData().listStudents().length;
  }

  /**
   * Render ContentComponent
   * @author Aryan Pandey
   */
  render() {
    const {
      assignment,
    } = this.state;

    const { numStudents } = this;

    // Initialize empty buckets for bar chart
    const data = [
      {
        attempts: 'No Submissions',
        students: 0,
      },
      {
        attempts: '1',
        students: 0,
      },
      {
        attempts: '2',
        students: 0,
      },
      {
        attempts: '3',
        students: 0,
      },
      {
        attempts: '4',
        students: 0,
      },
      {
        attempts: '4+',
        students: 0,
      },
    ];

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

    if (numStudents && assignment) {
      const submissionsList = getCanvasData().listSubmissions(assignment.id);

      submissionsList.forEach((value) => {
        // extract attempts data
        const { attempt } = value;
        if (attempt > 4) {
          data[4].students += 1;
        }
        data[attempt].students += 1;
      });
    }

    // custtom tooltip that appears on hover
    const customTooltip = (args) => {
      const percentage = ((args.value / numStudents) * 100).toFixed(2);
      return (
        <div>
          <strong>{args.value} </strong>
          students ( <strong> {percentage}% </strong> ) used {args.index} attempt(s)
        </div>
      );
    };
    const getColor = (bar) => { return bar.indexValue === 'No Submissions' ? '#DCDCDC' : '#03A9F3'; };

    // initialize the bar chart
    const bar = (
      <ResponsiveBar
        data={data}
        keys={['students']}
        indexBy="attempts"

        margin={{
          top: 20, right: 80, bottom: 50, left: 80,
        }}
        padding={0.3}
        colors={getColor}
        maxValue={numStudents}
        borderColor={{
          from: 'color',
          modifiers: [
            ['darker', 0.6],
          ],
        }}
        borderRadius={1}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Students',
          legendPosition: 'middle',
          legendOffset: -60,
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Attempts',
          legendPosition: 'middle',
          legendOffset: 40,
        }}
        borderWidth={1}
        labelSkipHeight={12}
        theme={{
          fontSize: 12,
          axis: {
            ticks: {
              text: {
                fill: '#aaaaaa',
              },
            },
            legend: {
              text: {
                fill: '#333333',
                fontSize: '20px',
              },
            },
          },
        }}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate
        motionStiffness={90}
        motionDamping={15}
        tooltip={customTooltip}
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

    /* ----------------------- Create Full UI ----------------------- */

    return (
      <div>
        {assignmentDropdown}
        {body}
        <div style={{ width: '100%', height: '500px', paddingBottom: '10px' }}>
          {bar}
        </div>
      </div>
    );
  }
}

export default AttemptsContentComponent;
