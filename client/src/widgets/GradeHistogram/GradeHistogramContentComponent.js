/**
 * Content for the GradeHistogram component
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import shared components
import AssignmentsDropdown from '../../shared/AssignmentsDropdown';
import LoadingSpinner from '../../shared/LoadingSpinner';
import BarChart from '../../shared/charts/BarChart';

// Import style
import './GradeHistogramContentComponent.css';

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
    } = this.props;

    const {
      numBuckets,
    } = configuration;

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
          const max = Number((bucketSize * (i + 1) - 0.01).toFixed(2));

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
            value: 0,
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
          histogramData[bucketIndex].value += 1;
        });

        body = (
          <BarChart
            title="Grade Distribution"
            valueAxisLabel="Number of Submissions"
            barAxisLabel="Grade Range"
            lessPaddingBetweenBars
            bars={histogramData}
            tooltip={(bar) => {
              return (
                <div>
                  {`${bar.value} submissions (${((bar.value / subs.length) * 100).toFixed(2)}%)`}
                </div>
              );
            }}
          />
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
};

export default GradeHistogramContentComponent;
