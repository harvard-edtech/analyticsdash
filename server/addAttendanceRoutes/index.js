const listAttendanceRecords = require('./helpers/listAttendanceRecords');
const listEvents = require('./helpers/listEvents');

/* --------------------------- Helpers -------------------------- */

/**
 * Get attendance logs
 * @author Gabe Abrams
 * @async
 * @param {number} courseId - the id of the course to get attendance for
 * @return {object[]} event list with attendance info
 */
const getEventsWithAttendance = async (courseId) => {
  // Get the records
  const [events, attendanceRecords] = await Promise.all([
    listEvents(courseId),
    listAttendanceRecords(courseId),
  ]);

  // Pre-process attendance records
  const ihidToAttendanceRecords = {}; // ihid => attendanceRecord
  attendanceRecords.forEach((record) => {
    if (!ihidToAttendanceRecords[record.ihid]) {
      ihidToAttendanceRecords[record.ihid] = [];
    }
    ihidToAttendanceRecords[record.ihid].push(record);
  });

  // Add attendance to each event
  const eventsWithAttendance = events.map((event) => {
    const attendance = ihidToAttendanceRecords[event.ihid] || [];

    const newEvent = event;
    newEvent.attendance = attendance;
    return newEvent;
  });

  // Return
  return eventsWithAttendance;
};

/* --------------------------- Routes --------------------------- */

/**
 * Add routes
 * @author Gabe Abrams
 * @param {ExpressApp} app - the express app to add routes to
 */
module.exports = (app) => {
  app.get('/api/courses/:course/attendance', async (req, res) => {
    // Use helper
    try {
      const courseId = Number.parseInt(req.params.course);
      const eventsWithAttendance = await getEventsWithAttendance(courseId);

      // Send to client
      return res.handleSuccess(eventsWithAttendance);
    } catch (err) {
      return res.handleError(`An error occurred while looking up attendance: ${err.message}`);
    }
  });
};
