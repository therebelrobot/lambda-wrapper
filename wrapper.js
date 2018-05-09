
const respond = (callback) => (statusCode, body, opts) => {
  opts = opts || {};
  if (typeof body === 'object') { body = JSON.stringify(body); }
  return callback(null, Object.assign({}, { statusCode, body }, opts));
};

module.exports = (fn, opts) => async (event, context, callback) => {
  try {
    return await fn({ event, context, callback, respond: respond(callback) })
  } catch (e) {
    response = (opts && opts.surfaceErrors) ? { error: e.toString() } : null;
    return respond(callback)(500, response);
  }
}
