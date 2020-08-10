/**
 * Content for the GradeHistogram component
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import library components
import { ResponsiveBar } from '@nivo/bar';

// Import shared components
import AssignmentsDropdown from '../../shared/AssignmentsDropdown';
import LoadingSpinner from '../../shared/LoadingSpinner';

// Import style
import './GradeHistogramContentComponent.css';

// Import chart style
import genDefs from '../../shared/charts/style/genDefs';

// Get data
import getCanvasData from '../../helpers/getCanvasData';

/* ---------------------------- Class --------------------------- */

class GradeHistogramContentComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Current assignment
      assignment: null,
    };
  }

  render() {
    const {
      assignment,
    } = this.state;

    const {
      configuration,
      setActions,
    } = this.props;

    const {
      numBuckets,
    } = configuration;

    // Define assignment dropdown menu
    const assignmentDropdown = (
      <AssignmentsDropdown
        onChange={(newAssignment) => {
          const actionHandler = () => {
            console.log('Yo');
          };
          setActions([
            {
              id: 'say-hi',
              label: 'Say Hi',
              description: 'Say hello to your friends',
              onClick: actionHandler,
            },
          ]);
          this.setState({
            assignment: newAssignment,
          });
        }}
        byMostRecentGrading
      />
    );

    const canvasData = getCanvasData();

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
      // Assignment has no points
      if (assignment.points_possible === 0) {
        body = (
          <div>
            This assignment had no points available.
          </div>
        );
      } else if (subs.length === 0) {
        body = (
          <div>
            This assignment has no graded submissions.
          </div>
        );
      } else {
        // Get submission grades
        const scores = subs.map((sub) => { return sub.score; });

        // Determine bucket sizes
        const bucketSize = assignment.points_possible / numBuckets;

        // Collate grade data into buckets
        const histogramData = [];
        for (let i = 0; i < numBuckets; i++) {
          const min = Number((bucketSize * i).toFixed(2));
          const max = Number((bucketSize * (i + 1)).toFixed(2) - 0.01);

          // First and last buckets have alternate label format
          let label;
          if (i === 0) {
            label = `Under ${max}`;
          } else if (i === numBuckets - 1) {
            label = `Above ${min}`;
          } else {
            label = `${min} - ${max}`;
          }

          histogramData.push({
            label,
            numSubmissions: 0,
          });
        }
        scores.forEach((score) => {
          let bucketIndex;
          if (score >= assignment.points_possible) {
            bucketIndex = numBuckets - 1;
          } else if (score <= 0) {
            bucketIndex = 0;
          } else {
            bucketIndex = Math.floor(score / bucketSize);
          }
          histogramData[bucketIndex].numSubmissions += 1;
        });

        body = (
          <div className="GradeHistogramContentComponent-body-container">
            <ResponsiveBar
              data={histogramData}
              indexBy="label"
              keys={['numSubmissions']}
              padding={0.05}
              groupMode="grouped"
              margin={{
                top: 50,
                right: 50,
                bottom: 50,
                left: 50,
              }}
              label="label"
              enableGridY
              axisLeft={{
                legend: 'Number of Submissions',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: 'middle',
                legendOffset: -40,
              }}
              axisBottom={{
                legend: 'Grade Range',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: 'middle',
                legendOffset: 40,
              }}
              tooltip={(bar) => {
                return (
                  <div>
                    {`${bar.value} submissions (${((bar.value / subs.length) * 100).toFixed(2)}%)`}
                  </div>
                );
              }}
            />
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

GradeHistogramContentComponent.propTypes = {
  // The current configuration, which provides the number of histogram buckets
  configuration: PropTypes.shape({ numBuckets: PropTypes.number }).isRequired,
  // Function that takes an array of action objects
  setActions: PropTypes.func.isRequired,
};

export default GradeHistogramContentComponent;
