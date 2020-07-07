// Import caccl
import initCACCL from 'caccl/client/cached';

// Initialize caccl
const { sendRequest } = initCACCL();

/**
 * Visit an endpoint on the server
 * @author Gabe Abrams
 * @async
 * @param {string} path - the path of the server endpoint
 * @param {string} [method=GET] - the method of the endpoint
 * @param {object} [params] - query/body parameters to include
 */
export default async (opts) => {
  const response = await sendRequest({
    path: opts.path,
    method: opts.method,
    params: opts.params,
  });

  // Check for failure
  if (!response || !response.body) {
    throw new Error('We didn\'t get a response from the server. Please check your internet connection.');
  }
  if (!response.body.success) {
    const err = new Error(response.body.message || 'An unknown error occurred. Please contact an admin.');
    err.code = response.body.code || 'NOCODE1';
    throw err;
  }

  // Success! Extract the body
  const { body } = response.body;

  // Return
  return body;
};
