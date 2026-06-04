const anch = require('./anch.js');

const testCases = [
    { input: '', expected: '87a4b1e5b61a69f7222af98137e1352f84de7ceb20e7aa67ba29309949257ed7' },
    { input: 'hello', expected: '0b3890b851dbfc8a09cef2d0f8a7621480886cb1a08f46bad667eeae5c853cfc' },
    { input: 'cryptography', expected: '526aad6b01ab223ef7ac4343f2de05c2afb749b6b53bbe26e1ff58fe019de6d8' },
    { input: 'a'.repeat(1000), expected: 'fec180698a48e7f42f6e6e97796a8c7a0d430a64a48121cbb05d4c716d65c741' }
];

const hmacCases = [
    { key: 'key', message: '', expected: '16eca7dd1e93c1b0c03cadc1da181d4c1ac12934be0ffe849840557f81ec68b2' },
    { key: 'key', message: 'hello', expected: '0963543a6d6afadf95aabf52968a3703ed77d5e7fb2727e76c0e90f4b039ed30' },
    { key: 'very_long_key_that_exceeds_64_bytes_in_length_and_should_be_hashed_first_by_hmac_algorithm', message: 'a'.repeat(1000), expected: '0532d8070a0464a9ff478d16e8012e774fcaaff95850c10fbc94c2d2e8b0ae6a' }
];

console.log('Running ANCH JS Binding Tests...');
let passed = true;

// Hash test cases
for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const hashVal = anch.hash(tc.input);
    if (hashVal !== tc.expected) {
        console.error(`FAIL: Hash test case ${i} failed. Input: "${tc.input.length > 20 ? tc.input.substring(0, 20) + '...' : tc.input}"`);
        console.error(`Expected: ${tc.expected}`);
        console.error(`Got:      ${hashVal}`);
        passed = false;
    } else {
        console.log(`PASS: Hash test case ${i} passed.`);
    }

    // Verify test
    const verified = anch.verify(tc.input, tc.expected);
    if (!verified) {
        console.error(`FAIL: Verification test case ${i} failed.`);
        passed = false;
    } else {
        console.log(`PASS: Verification test case ${i} passed.`);
    }
}

// HMAC test cases
for (let i = 0; i < hmacCases.length; i++) {
    const tc = hmacCases[i];
    const hmacVal = anch.hmac_anch(tc.key, tc.message);
    if (hmacVal !== tc.expected) {
        console.error(`FAIL: HMAC test case ${i} failed.`);
        console.error(`Expected: ${tc.expected}`);
        console.error(`Got:      ${hmacVal}`);
        passed = false;
    } else {
        console.log(`PASS: HMAC test case ${i} passed.`);
    }

    // HMAC verify test
    const hmacVerified = anch.hmac_anch_verify(tc.key, tc.message, tc.expected);
    if (!hmacVerified) {
        console.error(`FAIL: HMAC verification test case ${i} failed.`);
        passed = false;
    } else {
        console.log(`PASS: HMAC verification test case ${i} passed.`);
    }
}

if (passed) {
    console.log('All tests passed successfully! 🎉');
    process.exit(0);
} else {
    console.error('Some tests failed!');
    process.exit(1);
}
