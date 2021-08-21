const retry = require('../src');

// Mock Promise success
const mockPromiseSuccess = jest.fn(() => {
  return new Promise((resolve) => resolve('success'));
});

// Mock Promise fail
const mockPromiseFail = jest.fn(() => {
  return new Promise((resolve, reject) => reject('fail'));
});

describe('Verify function arguments', () => {
  test('should trigger error for invalid input function', () => {
    const input = 'invalidInpunt';

    return retry(input).catch((e) => {
      expect(e.message).toBe(
        `Expected input to be a function, but received: ${typeof input}`
      );
    });
  });

  test('should trigger error for invalid options', () => {
    const options = null;

    return retry(mockPromiseSuccess, options).catch((e) => {
      expect(e.message).toBe(
        `Expected options to be an object, but received: ${options}<${typeof options}>`
      );
    });
  });

  test('should use default options when options argument is not provided', () => {
    return retry(mockPromiseSuccess).then(() => {
      expect(mockPromiseSuccess).toHaveBeenCalled();
    });
  });
});

describe('Verify function output', () => {
  test('should run input function without retries', async () => {
    return retry(mockPromiseSuccess).then((data) => {
      expect(mockPromiseSuccess.mock.calls.length).toBe(1);
      expect(data).toBe('success');
    });
  });

  test('should run input function with 1 retry and 1000ms delay', () => {
    return retry(mockPromiseFail, { retries: 1 }).catch((e) => {
      // 1 expected call + 1 retry
      expect(mockPromiseFail.mock.calls.length).toBe(2);
      expect(e).toBe('fail');
    });
  });

  test('should run input function with 3 retries and 200ms delay', () => {
    return retry(mockPromiseFail, { delay: 200 }).catch((e) => {
      // 1 expected call + 3 retries
      expect(mockPromiseFail.mock.calls.length).toBe(4);
      expect(e).toBe('fail');
    });
  });

  test('should not fail if input function does not return a Promise', () => {
    const nonPromiseFunction = jest.fn(() => 'success');

    return retry(nonPromiseFunction).then((data) => {
      expect(nonPromiseFunction).toHaveBeenCalled();
      expect(data).toBe('success');
    });
  });
});
