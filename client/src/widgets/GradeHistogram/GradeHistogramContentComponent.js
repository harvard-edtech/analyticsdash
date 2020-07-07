/**
 * Content for the GradeHistogram component
 * @author Grace Whitney
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import library components
import { Bar } from 'nivo';

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
    }
  }

  render() {
    const {
      assignment,
    } = this.state;

    const {
      configuration,
    } = this.props;

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

    // Collate assignment grade data from getCanvasData
    const assignmentSubs = getCanvasData().submissions[assignment.assignmentId];
    const scores = assignmentSubs.map((sub) => { return sub.score });


    return (
      <div>
        {assignmentDropdown}
      </div>
    );
  }
}

GradeHistogramContentComponent.propTypes = {
  // The current configuration, which provides the number of histogram buckets
  configuration: PropTypes.shape({ nBuckets: PropTypes.number }).isRequired,
};

export default GradeHistogramContentComponent;
