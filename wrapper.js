const getProp = require('@f/get-prop');
const parse = require('lambda-multipart-promise');
const noop = () => null;

const respond = (callback) => (statusCode, body, opts) => {
  opts = opts || {};
  if (typeof body === 'object') { body = JSON.stringify(body); }
  return callback(null, Object.assign({}, { statusCode, body }, opts));
};

module.exports = (fn, opts) => async (event, context, callback) => {
  try {
    // Set Verbose flag
    const verbose = !!(getProp('queryStringParameters.verbose', event));

    // set up verbose console log
    let log;
    if (verbose) { log = console.log; } else { log = noop; }

    // parse multipart form data, if present
    let multipartData;
    if (event.headers['Content-Type'] && event.headers['Content-Type'].includes('multipart/form-data')) {
      log('parsing multipart body')
      multipartData = await parse(event.body, event.headers, { verbose });
      log('parsing complete', multipartData)
    }

    // parse json data, if present
    let jsonData;
    if (event.headers['Content-Type'] && event.headers['Content-Type'].includes('application/json')) {
      log('parsing json body')
      jsonData = JSON.parse(event.body);
      log('parsing complete', jsonData)
    }

    return await fn({
      verbose,
      log,
      multipartData,
      jsonData,
      event,
      context,
      callback,
      respond: respond(callback),
    })
  } catch (e) {
    response = (opts && opts.surfaceErrors) ? { error: e.toString() } : null;
    return respond(callback)(500, response);
  }
}
