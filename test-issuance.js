const { default: axios } = require('axios');

const BASE_URL = 'http://localhost:3000';
const ISSUE_URL = `${BASE_URL}/coupons/test`;
const RESET_URL = `${BASE_URL}/coupons/reset`;
const TOTAL_REQUESTS = 5000;
const TEST_DURATION_MS = 3000;

const reset = async () => {
  try {
    await axios.post(RESET_URL);
  } catch (e) {
    console.error(e);
  }
};

const issue = async () => {
  try {
    const response = await axios.post(ISSUE_URL);

    return response.data;
  } catch (e) {
    console.error(e.data.message);
  }
};

const test = async () => {
  await reset();

  console.log('test start');

  let success = 0;
  let failure = 0;

  const promises = [];

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    promises.push(issue());
  }

  const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('time out'), TEST_DURATION_MS));

  const results = await Promise.race([Promise.allSettled(promises), timeoutPromise]);

  if (results === 'time out') {
    console.log(results);
    return;
  }

  results.forEach((result) => {
    if (result && result.message === 'issuing') {
      success++;
    } else {
      failure++;
    }
  });

  console.log(`Total requests: ${TOTAL_REQUESTS}`);
  console.log(`Success: ${success}`);
  console.log(`Failure: ${failure}`);
};

test();
