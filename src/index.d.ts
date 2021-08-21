interface Options {
  retries?: number = 3;
  delay?: number = 1000;
}

/**
 * Runs the input function and returns it's result. Result is expected to be a Promise.
 * If error occurs, it will retry input function based on provided options.
 *
 * @param input Function to execute
 * @param options Configuration options
 */
declare function retry(
  input: () => Promise<any>,
  options: Options
): Promise<any>;

export = retry;
