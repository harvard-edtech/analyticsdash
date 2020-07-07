const { courseEvents } = require('./mongoCollections');

/**
 * List the events associated with a course
 * @author Gabe Abrams
 * @async
 * @param {number} courseId - the Canvas id of the course to search for
 *   meetings
 * @param {boolean} [includeArchived] - if true, also include events that
 *   are archived
 * @return {object[]} array of event objects
 */
module.exports = async (courseId, includeArchived) => {
  try {
    let events = await courseEvents.find({
      courseId: Number.parseInt(courseId),
    });

    if (!events || events.length === 0) {
      // No courses listed. There definitely aren't any events for this course
      return [];
    }

    // Filter events if not including archived
    if (!includeArchived) {
      events = events.filter((event) => {
        return !event.archived;
      });
    }

    // Return
    return events;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`An error occurred while requesting course events for course with id "${courseId}" from database:`);
    // eslint-disable-next-line no-console
    console.log(err);

    // Have to return something!
    return [];
  }
};
