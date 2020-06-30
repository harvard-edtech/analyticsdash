// Import requirements
import REQUIREMENTS from '../../constants/REQUIREMENTS';

// Import canvas data
import getCanvasData from '../../helpers/getCanvasData';

// Check requirements
let loaded;
let atLeastOneGraded;
let atLeastOneSubmitted;

/**
 * Check if a set of requirements are met
 * @author Gabe Abrams
 * @param {string[]} [requirements] - the list of requirements
 * @return {string} message to user (or null if no failed requirements)
 */
export default (requirements) => {
  // No requirements to meet! Success
  if (!requirements) {
    return null;
  }

  // Load if required
  if (!loaded) {
    const assignments = getCanvasData().listAssignments();
    atLeastOneGraded = assignments.some((assignment) => {
      return assignment.gradingStarted;
    });
    atLeastOneSubmitted = assignments.some((assignment) => {
      return assignment.hasSubmissions;
    });
    loaded = true;
  }

  // Check requirements
  const failedRequirements = [];
  for (let i = 0; i < requirements.length; i++) {
    if (requirements[i]) {
      // At least one graded
      if (
        requirements[i] === REQUIREMENTS.AT_LEAST_ONE_GRADED_ASSIGNMENT
        && !atLeastOneGraded
      ) {
        failedRequirements.push(REQUIREMENTS.AT_LEAST_ONE_GRADED_ASSIGNMENT);
      }

      // At least one submitted
      if (
        requirements[i] === REQUIREMENTS.AT_LEAST_ONE_SUBMITTED_ASSIGNMENT
        && !atLeastOneSubmitted
      ) {
        failedRequirements.push(REQUIREMENTS.AT_LEAST_ONE_SUBMITTED_ASSIGNMENT);
      }
    }
  }

  // No message if no failed requirements
  if (!failedRequirements || failedRequirements.length === 0) {
    return null;
  }

  // Create a message
  let message = 'Analytics will appear here once your course ';
  for (let i = 0; i < failedRequirements.length; i++) {
    if (i > 0) {
      message += ', ';
    }
    if (i === failedRequirements.length - 2 && failedRequirements.length > 2) {
      message += 'and ';
    }
    message += failedRequirements[i];
  }
  message += '.';
  return message;
};
