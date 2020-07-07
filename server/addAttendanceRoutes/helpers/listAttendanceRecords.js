const { attendanceLogs } = require('./mongoCollections');

/**
 * List the attendance logs for a course
 * @author Gabe Abrams
 * @async
 * @param {number} courseId - the Canvas id of the course to search for
 *   attendance logs
 * @return {object[]} array of attendance log objects
 */
module.exports = async (courseId) => {
  try {
    const logs = await attendanceLogs.find({
      courseId: Number.parseInt(courseId),
    });

    // Return
    return logs;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`An error occurred while requesting attendance logs for course with id "${courseId}" from database:`);
    // eslint-disable-next-line no-console
    console.log(err);

    // Have to return something!
    return [];
  }
};
