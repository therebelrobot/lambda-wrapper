const getProp = require('@f/get-prop');
const parse = require('lambda-multipart-promise');
const noop = () => null;

const respond = (callback, log) => (statusCode, body, opts) => {
  opts = opts || {};
  if (typeof body === 'object') { body = JSON.stringify(body); }
  const response = Object.assign({}, { statusCode, body }, opts)
  log('Response', response)
  return callback(null, response);
};

module.exports = (fn, opts) => async (event, context, callback) => {
  // Set Verbose flag
  let verbose = !!(getProp('queryStringParameters.verbose', event));
  // set up verbose console log
  let log;
  if (verbose) { log = console.log; } else { log = noop; }

  // catch anything that goes wrong
  try {

    // parse multipart form data, if present
    let multipartData;
    if (event.headers['Content-Type'] && event.headers['Content-Type'].includes('multipart/form-data')) {
      log('Parsing multipart body')
      multipartData = await parse(event.body, event.headers, { verbose });
      log('Parsing complete', multipartData)
    }

    // parse json data, if present
    let jsonData;
    if (event.headers['Content-Type'] && event.headers['Content-Type'].includes('application/json')) {
      log('Parsing json body')
      jsonData = JSON.parse(event.body);
      log('Parsing complete', jsonData)
    }

    log('Executing Handler')
    return await fn({
      verbose,
      log,
      multipartData,
      jsonData,
      event,
      context,
      callback,
      respond: respond(callback, log),
    })
  } catch (e) {
    response = (opts && opts.surfaceErrors) ? { error: e.toString() } : null;
    return respond(callback, log)(500, response);
  }
}
