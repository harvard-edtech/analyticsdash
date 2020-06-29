// Import caccl
import initCACCL from 'caccl/client/cached';

// Import queries
import GRAPH_QL_QUERIES from '../constants/GRAPH_QL_QUERIES';

// Initialize caccl
const { api } = initCACCL();

class CanvasData {
  /**
   * Create and start loading
   * @author Gabe Abrams
   * @param {number} courseId - the id of the Canvas course
   */
  constructor(courseId) {
    this.courseId = courseId;
  }

  /**
   * Wait for all data to be loaded
   * @author Gabe Abrams
   * @param {User[]} students - the list of students in the course
   */
  async loadData(students) {
    const { courseId } = this;

    // Load in parallel
    const [
      assignments,
      assignmentGroups,
      teachingTeamMembers,
      unprocessedSubmissions,
    ] = await Promise.all([
      api.course.assignment.list({ courseId, ignoreOverridesForDates: true }),
      api.course.assignmentGroup.list({ courseId }),
      api.course.listTeachingTeamMembers({
        courseId,
        includeAvatar: true,
        activeOnly: true,
        includeEmail: true,
      }),
      api.graphQL.sendQuery({
        query: GRAPH_QL_QUERIES.listSubmissions(courseId),
      }),
    ]);

    // Store to this
    this.assignments = assignments;
    this.assignmentGroups = assignmentGroups;
    this.students = students;
    this.teachingTeamMembers = teachingTeamMembers;

    // Create user id lookup map
    this.idToUser = {};
    [this.students, this.teachingTeamMembers].forEach((users) => {
      users.forEach((user) => {
        this.idToUser[user.id] = user;
      });
    });

    // Process submissions and store them
    this.submissions = {}; // assignmentId => submissions[]
    unprocessedSubmissions.course.assignmentsConnection.nodes
      .forEach((assignment) => {
        const assignmentId = assignment._id;

        // Process submissions
        const submissions = (
          assignment
            .submissionsConnection
            .nodes
            .map((sub) => {
              // Process sub
              const submittedAt = (
                sub.submittedAt || sub.createdAt
                  ? new Date(sub.submittedAt || sub.createdAt)
                  : null
              );

              // Process comments
              const comments = (
                (sub.commentsConnection.nodes || [])
                  .map((comment) => {
                    const authorId = (
                      comment.author && comment.author._id
                        ? comment.author._id
                        : null
                    );
                    const createdAt = (
                      comment.createdAt
                        ? new Date(comment.createdAt)
                        : null
                    );
                    return {
                      authorId,
                      createdAt,
                      text: comment.comment,
                      read: comment.read,
                    };
                  })
              );

              // Process rubric assessments
              const rubricAssessments = (
                (sub.rubricAssessmentsConnection.nodes || [])
                  .map((rubricAssessment) => {
                    const assessorId = rubricAssessment.assessor._id;
                    const assessmentRatings = (
                      rubricAssessment.assessmentRatings.map((rating) => {
                        return {
                          commentText: rating.comments || '',
                          points: rating.points,
                          ratingId: rating._id,
                          criterionId: rating.criterion._id,
                        };
                      })
                    );
                    return {
                      assessorId,
                      assessmentRatings,
                      score: rubricAssessment.score,
                    };
                  })
              );

              // Put submission into one object
              return {
                submittedAt,
                comments,
                rubricAssessments,
                attempt: sub.attempt,
                late: sub.late,
                missing: sub.missing,
                score: sub.score,
                submitterId: sub.user._id,
              };
            })
        );

        // Simplify submission objects
        this.submissions[assignmentId] = submissions;
      });

    // Add submission lists for assignments that have no subs
    this.assignments.forEach((assignment) => {
      const assignmentId = assignment.id;
      if (!this.submissions[assignmentId]) {
        this.submissions[assignmentId] = [];
      }
    });

    // Add submission-based analytics to assignments
    this.assignments.forEach((assignment, i) => {
      const assignmentId = assignment.id;

      // Average, first, last submission time
      let firstSubmissionTime = null;
      let lastSubmissionTime = null;
      let totalMS = 0;
      let timeDenom = 0;
      this.submissions[assignmentId].forEach((sub) => {
        if (sub.submittedAt) {
          // Avg
          totalMS += sub.submittedAt.getTime();
          timeDenom += 1;

          // First, last
          if (
            !firstSubmissionTime
            || firstSubmissionTime.getTime() > sub.submittedAt.getTime()
          ) {
            firstSubmissionTime = sub.submittedAt;
          }
          if (
            !lastSubmissionTime
            || lastSubmissionTime.getTime() < sub.submittedAt.getTime()
          ) {
            lastSubmissionTime = sub.submittedAt;
          }
        }
      });
      this.assignments[i].avgSubmissionTime = (
        timeDenom > 0
          ? new Date(Math.round(totalMS / timeDenom))
          : null
      );
      this.assignments[i].firstSubmissionTime = firstSubmissionTime;
      this.assignments[i].lastSubmissionTime = lastSubmissionTime;

      // Attempts
      let totalAttempts = 0;
      let attemptsDenom = 0;
      this.submissions[assignmentId].forEach((sub) => {
        if (sub.attempt && sub.attempt >= 0) {
          totalAttempts += sub.attempt;
          attemptsDenom += 1;
        }
      });
      this.assignments[i].avgAttempts = (
        attemptsDenom > 0
          ? Math.round(100 * (totalAttempts / attemptsDenom)) / 100
          : null
      );

      // Lateness
      let numLate = 0;
      this.submissions[assignmentId].forEach((sub) => {
        if (sub.late) {
          numLate += 1;
        }
      });
      this.assignments[i].numLateSubmissions = numLate;

      // Missing
      let numMissing = 0;
      this.submissions[assignmentId].forEach((sub) => {
        if (sub.missing) {
          numMissing += 1;
        }
      });
      this.assignments[i].numMissingSubmissions = numMissing;

      // Has submissions
      this.assignments[i].hasSubmissions = (
        numMissing < this.submissions[assignmentId].length
      );

      // Score stats
      // > Filter scores to just nonzero ones
      const nonzeroScores = (
        this.submissions[assignmentId]
          .map((sub) => {
            return sub.score;
          })
          .filter((score) => {
            return (score && score > 0);
          })
          .sort()
      );
      // > Calculate
      let median = 0;
      let mean = 0;
      let totalScore = 0;
      if (nonzeroScores.length > 0) {
        // Median
        const middleIndex = Math.floor(nonzeroScores.length / 2);
        median = (
          nonzeroScores.length % 2 !== 0
            ? nonzeroScores[middleIndex]
            : Math.round(
              (
                100
                * (nonzeroScores[middleIndex - 1] + nonzeroScores[middleIndex])
              ) / 2
            ) / 100
        );

        // Mean
        nonzeroScores.forEach((sub) => {
          totalScore += sub.score;
        });
        mean = Math.round(100 * (totalScore / nonzeroScores.length)) / 100;
      }
      this.assignments[i].medianNonzeroScore = median;
      this.assignments[i].avgNonzeroScore = mean;

      // Mark assignment as graded
      this.assignments[i].gradingStarted = (totalScore > 0);
    });

    // Sort assignments by average timestamp
    this.assignments.sort((a, b) => {
      // Handle nulls (send them to the end of the list)
      if (a.avgSubmissionTime === null && b.avgSubmissionTime === null) {
        return 0;
      }
      if (a.avgSubmissionTime === null) {
        return 1;
      }
      if (b.avgSubmissionTime === null) {
        return -1;
      }

      // Compare timestamps
      if (a.avgSubmissionTime < b.avgSubmissionTime) {
        return -1;
      }
      if (a.avgSubmissionTime > b.avgSubmissionTime) {
        return 1;
      }
      return 0;
    });

    // Find the most recent assignments
    this.mostRecentAssignmentWithSubmissions = null;
    this.mostRecentGradedAssignment = null;
    for (let i = 0; i < this.assignments.length; i++) {
      // Update sub assignment
      if (
        !this.mostRecentAssignmentWithSubmissions
        && this.assignments[i].hasSubmissions
      ) {
        this.mostRecentAssignmentWithSubmissions = assignments[i];
      }

      // Update graded assignment
      if (
        !this.mostRecentGradedAssignment
        && this.assignments[i].gradingStarted
      ) {
        this.mostRecentGradedAssignment = assignments[i];
      }

      // Exit loop if done
      if (
        this.mostRecentAssignmentWithSubmissions
        && this.mostRecentGradedAssignment
      ) {
        break;
      }
    }
  }

  /**
   * Get the most recent assignment that has at least one submission
   * @author Gabe Abrams
   * @return {Assignment} most recent assignment with submissions
   */
  getMostRecentAssignmentWithSubmissions() {
    return this.mostRecentAssignmentWithSubmissions;
  }

  /**
   * Get the most recent assignment that has at least one graded submission
   * @author Gabe Abrams
   * @return {Assignment} most recent assignment with at least one graded sub
   */
  getMostRecentGradedSubmission() {
    return this.mostRecentGradedAssignment;
  }

  /**
   * Get the list of assignments
   * @author Gabe Abrams
   * @return {Assignment[]} assignments in the course with some added params
   */
  listAssignments() {
    return this.assignments;
  }

  /**
   * Get the list of submissions for an assignment
   * @author Gabe Abrams
   * @param {number} assignmentId - the id for the assignment to query
   * @return {object[]} custom submission objects
   */
  listSubmissions(assignmentId) {
    return this.submissions[assignmentId] || [];
  }

  /**
   * Get the list of assignment groups in the course
   * @author Gabe Abrams
   * @return {AssignmentGroup[]} assignment groups
   */
  listAssignmentGroups() {
    return this.assignmentGroups;
  }

  /**
   * Get the list of students in the course
   * @author Gabe Abrams
   * @return {User[]} students
   */
  listStudents() {
    return this.students;
  }

  /**
   * Get the list of teaching team members in the course
   * @author Gabe Abrams
   * @return {User[]} TTMs
   */
  listTTMs() {
    return this.teachingTeamMembers;
  }

  /**
   * Get a user based on the user's Canvas id
   * @author Gabe Abrams
   * @param {number} id - the id of the user
   * @return {User} the user
   */
  getUser(id) {
    return this.idToUser[id] || null;
  }
}

/* ---------------------- Cache and Export ---------------------- */

// Cache the CanvasData object
let canvasData;

/**
 * Initialize the CanvasData object OR get the cached version
 * @param {number} [courseId] - the course id (only required the first
 *   time this function is called)
 * @return {CanvasData} initialized CanvasData instance
 */
export default (courseId) => {
  if (!canvasData) {
    canvasData = new CanvasData(courseId);
  }

  return canvasData;
};
