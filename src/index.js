const timeout = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function retry(input, options = {}) {
  if (typeof input !== 'function') {
    return Promise.reject(
      new Error(
        `Expected input to be a function, but received: ${typeof input}`
      )
    );
  }

  if (typeof options !== 'object' || options === null) {
    return Promise.reject(
      new Error(
        `Expected options to be an object, but received: ${options}<${typeof options}>`
      )
    );
  }

  const { retries = 3, delay = 1000 } = options;

  return new Promise((resolve, reject) => {
    const inputResult = input();

    if (!(inputResult instanceof Promise)) {
      return resolve(inputResult);
    }

    inputResult
      .then((data) => resolve(data))
      .catch((error) => {
        if (retries === 0) {
          return reject(error);
        }

        timeout(delay).then(() =>
          resolve(retry(input, { retries: retries - 1, delay }))
        );
      });
  });
}

module.exports = retry;
