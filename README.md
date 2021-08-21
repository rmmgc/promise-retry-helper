# promise-retry-helper

Small utility function to retry a Promise.  
If this function does not meet your needs, there are other packages in [npm registry](https://www.npmjs.com/search?q=retry%20promise) that you can explore.

## Installation

This package can be used in node and browser environments.

### Node.js

Install package via npm
```
$ npm install promise-retry-helper
```
or via yarn
```
$ yarn add promise-retry-helper
```

### Browser

Simply load `./dist/promise-retry-helper.min.js` via `script` tag.

```javascript
<script src="./dist/promise-retry-helper.min.js"></script>
```
The function will be available globally under the name `promiseRetryHelper`.

## Usage

`retry(input: Function, options?: object)`

Calls `input` function and waits until the returned *Promise* ends up fulfilled or rejected. If *Promise* is rejected, it will attempt to retry the `input` function.

`input` (required) - Function to execute. It should return a *Promise*.  
`options` (optional) - Configuration object:
- `retries` (optional, default: 3) - Maximum amount of times to retry the input function.
- `delay` (optional, default: 1000) - Number of milliseconds between each retry.

When you want to trigger a retry, you can just reject a *Promise* in `input` function.

## Example

```javascript
const retry = require('promise-retry-helper');

retry(() => {
  const randomId = Math.floor(Math.random() * 2);
  return fetch(`https://jsonplaceholder.typicode.com/todos/${randomId}`)
    .then(response => {
      if (response.ok) {
        // Success, retry will not be triggered
        return response;
      }

      // Trigger retry
      return Promise.reject(response);
    });
})
  .then((response) => {
    // Handle success
  })
  .catch((error) => {
    // Handle error
  });
```

Using with async/await
```javascript
const retry = require('promise-retry-helper');

const inputFunction = async () => {
  const randomId = Math.floor(Math.random() * 2);

  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${randomId}`);

  if (response.ok) {
    // Success, retry will not be triggered
    return response.json();
  }

  // Trigger retry
  throw response
}

try {
  const data = await retry(inputFunction, { retries: 2, delay: 500 });
  // Handle success
} catch(error) {
  // Handle error
}
```

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).
