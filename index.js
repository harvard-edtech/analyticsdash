// Import CACCL
const initCACCL = require('caccl/server/react');

// Import routes
const addRoutes = require('./server/addRoutes');

// Initialize CACCL
const app = initCACCL();

// Add routes
addRoutes(app);
