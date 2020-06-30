/**
 * Introduction of a student
 * @author Gabe Abrams
 */

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class StudentIntroduction extends Component {
  /**
   * Render StudentIntroduction
   * @author Gabe Abrams
   */
  render() {
    const { student } = this.props;

    return (
      <div className="d-flex align-items-center">
        {/* Profile Image */}
        <div className="mr-3">
          <img
            src={student.avatar_url}
            aria-label={`profile image for student "${student.name}"`}
            style={{ height: '100px' }}
            className="img-thumbnail"
          />
        </div>
        {/* Name */}
        <div className="flex-grow-1 text-left">
          <p className="lead m-0">
            Introducing
          </p>
          <h3 className="font-weight-bold m-0">
            {student.name}
          </h3>
        </div>
      </div>
    );
  }
}

StudentIntroduction.propTypes = {
  student: PropTypes.shape({
    // Link to profile image
    avatar_url: PropTypes.string.isRequired,
    // Student name
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default StudentIntroduction;
