
const respond = (callback) => (statusCode, body, opts) => {
  opts = opts || {};
  if (typeof body === 'object') { body = JSON.stringify(body); }
  return callback(null, Object.assign({}, { statusCode, body }, opts));
};

module.exports = (opts, fn) => async (event, context, callback) => {
  try {
    return await fn(event, context, callback, respond(callback))
  } catch (e) {
    response = opts.suppressErrors ? null : { error: e.toString() }
    return respond(callback)(500, response);
  }
}
