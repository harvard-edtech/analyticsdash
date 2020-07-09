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

    console.log(this.props);
    console.log(configuration);

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
      // Lookup assignment submission grades
      const subs = canvasData.listSubmissions(assignment.id);
      const scores = subs.map((sub) => { return sub.score; });

      // Determine bucket sizes
      const bucketSize = assignment.points_possible / nBuckets;
      console.log(bucketSize);

      // Collate grade data into buckets
      const histogramData = [];
      for (let i = 0; i < nBuckets; i++) {
        console.log(i);
        histogramData.push({
          range: `${bucketSize * i} - ${bucketSize * (i + 1) - 0.1}`,
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
        //histogramData[bucketIndex].numSubmissions += 1;
      });

      body = (
        <div style={{height:500}}>
          <ResponsiveBar
            data={[{range: 'hi', numSubmissions: 5}]}
            indexBy="range"
            keys={['numSubmissions']}
          />
        </div>
      );
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
