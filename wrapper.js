
const respond = (callback) => (statusCode, body, opts) => {
  if (typeof body === 'object') { body = JSON.stringify(body); }
  return callback(null, Object.assign({}, { statusCode, body }, opts));
};

module.exports = async (opts, fn) => (event, context, callback) => {
  try {
    return fn(event, context, callback, respond(callback))
  } catch (e) {
    return respond(callback)(500, opts.suppressErrors ? null : { error: e.toString() });
  }
}
