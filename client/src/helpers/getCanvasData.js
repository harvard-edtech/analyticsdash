// Import caccl
import initCACCL from 'caccl/client/cached';

// Import stats
import stats from 'stats-lite';

// Import queries
import GRAPH_QL_QUERIES from '../constants/GRAPH_QL_QUERIES';

// Initialize caccl
const { api } = initCACCL();

/* --------------------------- Helpers -------------------------- */

/**
 * Round to two decimal places
 * @author Gabe Abrams
 * @param {number} num - the number to round
 * @return {number} rounded number
 */
const round = (num) => {
  return (Math.round(100 * num) / 100);
};

/* ---------------------------- Class --------------------------- */

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
        const assignmentId = Number.parseInt(assignment._id);

        // Find the assignment index
        let assignmentIndex;
        for (let i = 0; i < this.assignments.length; i++) {
          if (this.assignments[i].id === assignmentId) {
            assignmentIndex = i;
            break;
          }
        }

        // Process assignment
        this.assignments[assignmentIndex].needsGradingCount = (
          assignment.needsGradingCount
        );
        this.assignments[assignmentIndex].hasSubmissions = (
          assignment.hasSubmittedSubmissions
        );

        // Process submissions
        const submissions = (
          assignment
            .submissionsConnection
            .nodes
            .map((sub) => {
              // Process sub
              const submittedAt = (
                !sub.missing
                  ? new Date(sub.submittedAt || sub.createdAt)
                  : null
              );
              const gradedAt = (
                (sub.gradedAt)
                  ? new Date(sub.gradedAt)
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
                gradedAt,
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

      // Missing, submitted
      let numMissing = 0;
      this.submissions[assignmentId].forEach((sub) => {
        if (sub.missing) {
          numMissing += 1;
        }
      });
      this.assignments[i].numMissingSubmissions = numMissing;
      this.assignments[i].numSubmitted = this.students.length - numMissing;

      // Percent submitted
      this.assignments[i].percentSubmitted = (
        this.students.length > 0
          ? round(
            100 * (this.assignments[i].numSubmitted / this.students.length)
          ) || 0
          : 0
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
      let stdev = 0;
      if (nonzeroScores.length > 0) {
        median = round(stats.median(nonzeroScores));
        mean = round(stats.mean(nonzeroScores));
        stdev = round(stats.stdev(nonzeroScores));
      }
      this.assignments[i].medianNonzeroScore = median;
      this.assignments[i].avgNonzeroScore = mean;
      this.assignments[i].stdevNonzeroScore = stdev;

      // Stats on grading
      this.assignments[i].gradingStarted = (nonzeroScores.length > 0);
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
      if (a.avgSubmissionTime > b.avgSubmissionTime) {
        return -1;
      }
      if (a.avgSubmissionTime < b.avgSubmissionTime) {
        return 1;
      }
      return 0;
    });

    // Create assignment orderings
    const byMostRecentSubmissions = [...this.assignments];
    byMostRecentSubmissions.sort((a, b) => {
      // Sort by hasSubmissions
      if (a.hasSubmissions && !b.hasSubmissions) {
        return -1;
      }
      if (!a.hasSubmissions && b.hasSubmissions) {
        return 1;
      }
      return 0;
    });
    const byMostRecentGrading = [...this.assignments];
    byMostRecentGrading.sort((a, b) => {
      // Sort by gradingStarted
      if (a.gradingStarted && !b.gradingStarted) {
        return -1;
      }
      if (!a.gradingStarted && b.gradingStarted) {
        return 1;
      }
      return 0;
    });
    this.assignmentsOrdered = {
      byMostRecentSubmissions,
      byMostRecentGrading,
    };
  }

  /**
   * Get the list of assignments
   * @author Gabe Abrams
   * @param {string} [sortOrder=byMostRecentGrading] - the order to sort by.
   *   allowed values: byMostRecentGrading, byMostRecentSubmissions
   * @return {Assignment[]} assignments in the course with some added params
   */
  listAssignments(sortOrder = 'byMostRecentGrading') {
    return this.assignmentsOrdered[sortOrder];
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

  /**
   * Get the current courseId
   * @author Gabe Abrams
   * @return {number} courseId
   */
  getCourseId() {
    return this.courseId;
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
