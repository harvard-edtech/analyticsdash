export default `
query MyQuery {
  course(id: "53450") {
    assignmentsConnection(after: "MQ") {
      nodes {
        _id
        name
        pointsPossible
        state
        needsGradingCount
        submissionsConnection() {
          nodes {
            submittedAt
            score
            gradedAt
            commentsConnection {
              nodes {
                author {
                  _id
                  enrollments {
                    id
                  }
                }
                comment
                createdAt
              }
            }
            excused
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
        quiz {
          _id
        }
        hasSubmittedSubmissions
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  account(id: "1") {
    id
    name
    coursesConnection {
      nodes {
        courseCode
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}`;
