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
      nBuckets,
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
      // Lookup assignment submissions
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
        const bucketSize = assignment.points_possible / nBuckets;

        // Collate grade data into buckets
        const histogramData = [];
        for (let i = 0; i < nBuckets; i++) {
          histogramData.push({
            range: `${+(bucketSize * i).toFixed(2)} - ${+(bucketSize * (i + 1)).toFixed(2)}`,
            numSubmissions: 0,
          });
        }
        scores.forEach((score) => {
          let bucketIndex;
          if (score === assignment.points_possible) {
            bucketIndex = nBuckets - 1;
          } else {
            bucketIndex = Math.floor(score / bucketSize);
          }
          histogramData[bucketIndex].numSubmissions += 1;
        });

        body = (
          <div className="GradeHistogram-content-container">
            <ResponsiveBar
              data={histogramData}
              indexBy="range"
              keys={['numSubmissions']}
              padding={0.05}
              colors={{
                scheme: 'category10',
              }}
              margin={{
                top: 50,
                right: 50,
                bottom: 50,
                left: 50,
              }}
              label="range"
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
  configuration: PropTypes.shape({ nBuckets: PropTypes.number }).isRequired,
};

export default GradeHistogramContentComponent;
