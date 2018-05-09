const getProp = require('@f/get-prop');

const respond = (callback) => (statusCode, body, opts) => {
  opts = opts || {};
  if (typeof body === 'object') { body = JSON.stringify(body); }
  return callback(null, Object.assign({}, { statusCode, body }, opts));
};

module.exports = (fn, opts) => async (event, context, callback) => {
  try {
    const verbose = !!(getProp('queryStringParameters.verbose', event));
    return await fn({ verbose, event, context, callback, respond: respond(callback) })
  } catch (e) {
    response = (opts && opts.surfaceErrors) ? { error: e.toString() } : null;
    return respond(callback)(500, response);
  }
}
