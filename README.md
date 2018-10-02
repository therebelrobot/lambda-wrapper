# lambda-wrapper
A simple API wrapper for AWS lambda

## Usage

```bash
yarn add lambda-api-wrapper
npm i lambda-api-wrapper
```

Then wrap the handler you want to run in the wrapper:

```js
import * as wrapper from 'lambda-api-wrapper';

export const handler = async ({
  // lambda-api-wrapper adds a few nice-to-haves to your lambda functions:
  respond, // function, the response handler. must be returned by function. e.g return respond(500, 'you messed up!')
  verbose, // boolean, whether ?verbose=true was included in url
  log, // function, logs to cloudwatch if verbose === true
  multipartData, // parsed multipart form data from body
  jsonData, // parsed JSON data from post body
  formData, // parsed url-encoded form data from body

  // lambda's original function parameters are also included:
  event, context, callback }) => {
  // do stuff
  return respond(200, 'OK'); // respond with the status code and response info
};

export default wrapper(handler);
```

## CLI

In addition to the wrapper, if you globally install the library (`npm i -g lambda-api-wrapper`) you can run a handler independent of the wrapper/lambda framework for testing purposes.

```bash
lambda-wrap run \
  --path webhooks/this-webhook \ # infers .js on the filename
  --formData '{ "contact[email]": "person@example.com" }'
```

You ***must*** export `handler` (as shown above) to use this functionality. All `log`s and `respond`s will be piped to `console.log`. For now, `event`, `context`, and `callback` are not currently provided in this use case. If you'd like to add this functionality, please feel free to fork this repo and open a PR (I'm quite friendly ^_^ )

### License

MIT
