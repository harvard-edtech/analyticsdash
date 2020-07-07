const { MongoClient } = require('mongodb');

// Constants and cached values
const DB_NAME = (process.env.DB_NAME || 'imhere-store');
const ATTENDANCE_LOGS_COLLECTION = 'attendance-logs';
const COURSE_EVENTS_COLLECTION = 'course-events';

// Keep track of the db
let db;

// Make sure we have a mongo url
const {
  MONGO_URL,
  MONGO_USER,
  MONGO_PASS,
  MONGO_HOST,
  MONGO_OPTIONS,
} = process.env;
if (
  !MONGO_URL
  && (
    !MONGO_USER
    || !MONGO_PASS
    || !MONGO_HOST
  )
) {
  // eslint-disable-next-line no-console
  console.log('No mongo variables in environment. Either include MONGO_URL or include all of the following: MONGO_USER, MONGO_PASS, and MONGO_HOST. Fatal error. Now exiting.');
  process.exit(1);
}
const mongoURL = (
  MONGO_URL
  || `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/imhere-store${MONGO_OPTIONS ? '?' : ''}${MONGO_OPTIONS || ''}`
);

/**
 * Wait for database to initialize
 * @author Gabe Abrams
 * @return {string[]} collectionNames
 */
const initDB = (
  MongoClient.connect(
    mongoURL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
    .catch((err) => {
      // This is a fatal error
      // eslint-disable-next-line no-console
      console.log('We could not connect to the Mongo DB. This is a fatal error! Now exiting.');
      // eslint-disable-next-line no-console
      console.log(err);
      process.exit(1);
    })
    .then((client) => {
      // Use client to get database
      db = client.db(DB_NAME);

      // Get the list of collections
      return db.listCollections().toArray();
    })
    .catch((err) => {
      // This is a fatal error
      // eslint-disable-next-line no-console
      console.log('We could not list the collections in the Mongo DB. This is a fatal error! Now exiting.');
      // eslint-disable-next-line no-console
      console.log(err);
      process.exit(1);
    })
    .then((collections) => {
      return collections.map((collection) => {
        return collection.name;
      });
    })
);

/*------------------------------------------------------------------------*/
/*                               Collection                               */
/*------------------------------------------------------------------------*/

class Collection {
  /**
   * Create a new Collection
   * @author Gabe Abrams
   * @param {string} collectionName - the collection name
   */
  constructor(collectionName) {
    // Save collection name
    this.collectionName = collectionName;

    // MongoDB Collection
    this.collection = null;

    // Initialize
    const init = async () => {
      // Get the collection names
      const collectionNames = await initDB;

      // Create collection if it doesn't exist
      if (collectionNames.indexOf(collectionName) < 0) {
        // Collection doesn't exist. Error
        // eslint-disable-next-line no-console
        console.log(`Provided MongoDB needs a "${collectionName}" collection but it didn't have one.`);
        process.exit(1);
      } else {
        // Collection exists. Get it
        this.collection = db.collection(this.collectionName);
      }
    };
    this.initialized = init();
  }

  /**
   * Run a query
   * @author Gabe Abrams
   * @async
   * @param {object} query - the query to run
   * @return {object} document
   */
  async find(query) {
    await this.initialized;

    let items = await this.collection.find(query).toArray();

    // Filter out internal ids
    if (items && items.length > 0) {
      items = items.map((item) => {
        const newItem = item;

        delete newItem._id;

        return newItem;
      });
    }

    return items;
  }
}

/*------------------------------------------------------------------------*/
/*                            Make Collections                            */
/*------------------------------------------------------------------------*/

const attendanceLogs = new Collection(ATTENDANCE_LOGS_COLLECTION);
const courseEvents = new Collection(COURSE_EVENTS_COLLECTION);

/*------------------------------------------------------------------------*/
/*                           Return Collections                           */
/*------------------------------------------------------------------------*/

/**
 * Set of Mongo collection classes
 * @author Gabe Abrams
 */
module.exports = {
  attendanceLogs,
  courseEvents,
};
