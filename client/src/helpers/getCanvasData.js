// Import caccl
import initCACCL from 'caccl/client/cached';

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
   */
  async loadData() {
    const { courseId } = this;

    // Load in parallel
    const [
      assignments,
      assignmentGroups,
      students,
      teachingTeamMembers,
      unprocessedSubmissions,
    ] = await Promise.all([
      api.course.assignment.list({ courseId, ignoreOverridesForDates: true }),
      api.course.assignmentGroup.list({ courseId }),
      api.course.listStudents({
        courseId,
        includeAvatar: true,
        activeOnly: true,
        includeEmail: true,
      }),
      api.course.listTeachingTeamMembers({
        courseId,
        includeAvatar: true,
        activeOnly: true,
        includeEmail: true,
      }),
      api.graphQL.sendQuery({
        query: `
query MyQuery {
  course(id: ${courseId}) {
    assignmentsConnection {
      nodes {
        submissionsConnection(first: 1000) {
          nodes {
            attempt
            commentsConnection {
              nodes {
                author {
                  _id
                }
                createdAt
                comment
                read
              }
            }
            submittedAt
            score
            rubricAssessmentsConnection {
              nodes {
                assessor {
                  _id
                }
                score
                _id
                assessmentRatings {
                  comments
                  points
                  _id
                  criterion {
                    _id
                  }
                }
              }
            }
            late
            missing
          }
        }
        _id
      }
    }
  }
}
        `,
      }),
    ]);

    // Store to this
    this.assignments = assignments;
    this.assignmentGroups = assignmentGroups;
    this.students = students;
    this.teachingTeamMembers = teachingTeamMembers;

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
              return {
                attempt: sub.attempt,
                comments: sub.commentsConnection.nodes,
                late: sub.late,
                missing: sub.missing,
                rubricAssessments: sub.rubricAssessmentsConnection.nodes,
                score: sub.score,
                submittedAt: sub.submittedAt,
              };
            })
        );

        // Simplify submission objects
        this.submissions[assignmentId] = submissions;
      });
    // Add assignments that aren't listed
    assignments.forEach((assignment) => {
      const assignmentId = assignment.id;
      if (!this.submissions[assignmentId]) {
        this.submissions[assignmentId] = [];
      }
    });
  }
}

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
