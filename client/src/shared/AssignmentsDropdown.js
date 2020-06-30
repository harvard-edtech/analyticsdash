/**
 * COMPONENT_DESCRIPTION_HERE
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import data
import getCanvasData from '../helpers/getCanvasData';

class AssignmentsDropdown extends Component {
  constructor(props) {
    super(props);

    // Get the list of assignments
    const sortType = (
      props.byMostRecentGrading
        ? 'byMostRecentGrading'
        : 'byMostRecentSubmissions'
    );
    this.assignments = getCanvasData().listAssignments(sortType);

    // Get the chosen assignment
    let chosenAssignmentIndex = 0;
    if (props.initialAssignmentId) {
      for (let i = 0; i < this.assignments.length; i++) {
        if (this.assignments[i].id === props.initialAssignmentId) {
          // Found the matching assignment!
          chosenAssignmentIndex = i;
          break;
        }
      }
    }

    // Initialize state
    this.state = {
      // Chosen assignment index
      chosenAssignmentIndex, // Start with first assignment
    };
  }

  /**
   * Alert parent with the assignment
   * @author Gabe Abrams
   */
  componentDidMount() {
    const { onChange } = this.props;
    const { chosenAssignmentIndex } = this.state;

    // Alert parent to first assignment choice
    if (this.assignments.length > 0) {
      onChange(this.assignments[chosenAssignmentIndex]);
    }
  }

  /**
   * Render AssignmentsDropdown
   * @author Gabe Abrams
   */
  render() {
    const { onChange } = this.props;
    const { chosenAssignmentIndex } = this.state;

    // Create the assignment options
    const options = this.assignments.map((assignment, i) => {
      return (
        <option key={assignment.id}>
          {assignment.name}
        </option>
      );
    });

    return (
      <div className="input-group mb-2">
        <div className="input-group-prepend">
          <span className="font-weight-bold input-group-text alert-dark">
            Assignment
          </span>
        </div>
        <select
          className="custom-select alert-dark bg-white"
          selectedindex={chosenAssignmentIndex}
          onChange={(e) => {
            const { selectedIndex } = e.target;

            // Update state
            this.setState({
              chosenAssignmentIndex: selectedIndex,
            });

            // Notify parent
            onChange(this.assignments[selectedIndex]);
          }}
        >
          {options}
        </select>
      </div>
    );
  }
}

AssignmentsDropdown.propTypes = {
  /**
   * Handler for when the assignment changes
   * @param {object} assignment - the chosen assignment
   */
  onChange: PropTypes.func.isRequired,
  // True if sorting assignments byMostRecentGrading
  byMostRecentGrading: PropTypes.bool,
  // True if sorting assignments byMostRecentSubmissions
  byMostRecentSubmissions: PropTypes.bool,
  // The initial assignment to select
  initialAssignmentId: PropTypes.number,
};

AssignmentsDropdown.defaultProps = {
  // Default sort is by grading
  byMostRecentGrading: true,
  byMostRecentSubmissions: false,
  // Start with first assignment in the list
  initialAssignmentId: null,
};

export default AssignmentsDropdown;
