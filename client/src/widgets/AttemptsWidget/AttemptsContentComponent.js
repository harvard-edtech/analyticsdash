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

// Import css
import './AttemptsContentComponent.css';

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
      // Initialize empty buckets for bar chart
      data = [
        {
          attempts: '0 (Didn\'t Submit)',
          // Initialize no submissions bucket to total students at start
          // number gets decremented when attempts are added
          numStudents: totalStudents,
        },
        {
          attempts: '1',
          numStudents: 0,
        },
        {
          attempts: '2',
          numStudents: 0,
        },
        {
          attempts: '3',
          numStudents: 0,
        },
        {
          attempts: '4',
          numStudents: 0,
        },
        {
          attempts: '5+',
          numStudents: 0,
        },
      ];

      // Fill bar chart with attempts data
      const submissionsList = getCanvasData().listSubmissions(assignment.id);

      submissionsList.forEach((value) => {
        // extract attempts data
        const { attempt } = value;

        // If number of attempts exceeds num buckets, group all into last bucket
        if (attempt >= data.length) {
          data[data.length - 1].numStudents += 1;
          // Decrement no submissions bucket
          data[0].numStudents -= 1;
          return;
        }
        data[attempt].numStudents += 1;
        // Decrement no submissions bucket
        // If attempt is 0, it cancels out
        data[0].numStudents -= 1;
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

    /**
     * returns desired color for respective bars
     * @author {Aryan Pandey}
     * @param {object} barObj - object containing all arguments
     * @param {string | number} barObj.id - id of bar
     * @param {number} barObj.value - value of bar
     * @param {number} barObj.index - index of bar
     * @param {string | number} barObj.indexValue - index value of the bar
     * @param {object} barObj.data - object containing raw data associated
     *   with bar
     * @returns {string} desired color of the bar
     */
    const getColor = (barObj) => { return (barObj.index === 0 ? '#DCDCDC' : '#03A9F3'); };

    // initialize the bar chart
    const barChart = (
      <div className="AttemptsContentComponent-body-container">
        <ResponsiveBar
          data={data}
          keys={['numStudents']}
          indexBy="attempts"
          margin={{
            top: 20, right: 80, bottom: 50, left: 80,
          }}
          padding={0.3}
          colors={getColor}
          maxValue={totalStudents}
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
      </div>
    );

    /* -------------------------------- Body ------------------------------- */

    let body;

    // Waiting for assignment
    if (!assignment) {
      body = (
        <LoadingSpinner />
      );
    }
    if (!body) {
      body = barChart;
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
