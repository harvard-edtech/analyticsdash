// Import other routes
const addAttendanceRoutes = require('./addAttendanceRoutes');

/**
 * Add routes
 * @author Gabe Abrams
 * @param {ExpressApp} app - the express app to add routes to
 */
module.exports = (app) => {
  // Add middleware for making sure the user is authorized
  app.use('/api/*', (req, res, next) => {
    // Check session info
    if (
      !req.session
      || !req.session.launchInfo
      || !req.session.launchInfo.courseId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Oops! Your session has expired. Please start over and try again.',
      });
    }

    // Make sure user has proper privileges
    if (req.session.launchInfo.isLearner) {
      return res.status(403).json({
        success: false,
        message: 'Oops! You are not allowed to do this. Please log in as a teaching team member and try again.',
      });
    }

    /**
     * Handle an error and respond to the client
     * @author Gabe Abrams
     * @param {Error|string} err - the error to send to the client
     *   or the error message
     * @param {number} [statusCode=500] - the https status code to use
     *   defined)
     */
    res.handleError = (err, statusCode) => {
      // Get the error message
      const message = (
        typeof err === 'string'
          ? err
          : err.message || 'An unknown error occurred.'
      );

      // Respond to user
      return (
        res
          .status(statusCode || 500)
          .json({
            message,
            success: false,
          })
      );
    };

    /**
     * Send successful API response
     * @author Gabe Abrams
     * @param {object} body - the body to respond with
     */
    res.handleSuccess = (body) => {
      return res.json({
        body,
        success: true,
      });
    };

    next();
  });

  // Add other routes
  addAttendanceRoutes(app);
};