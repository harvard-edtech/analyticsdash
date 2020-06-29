export default {
  /**
   * List submissions with rubrics and comments
   * @author Gabe Abrams
   * @param {number} courseId - the id of the course
   */
  listSubmissions: (courseId) => {
    return `
query MyQuery {
  course(id: ${ courseId }) {
    assignmentsConnection {
      nodes {
        submissionsConnection(filter: {}) {
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
            user {
              _id
            }
            createdAt
          }
        }
        _id
      }
    }
  }
}`;
  },
};
