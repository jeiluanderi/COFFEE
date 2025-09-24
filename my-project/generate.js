const crypto = require('crypto');

// Generate a random string of 32 bytes (256 bits) and encode it in Base64.
// This is a common practice for generating secure keys.
const jwtSecret = crypto.randomBytes(32).toString('base64');
const refreshTokenSecret = crypto.randomBytes(32).toString('base64');

console.log('New JWT Secret:', jwtSecret);
console.log('New Refresh Token Secret:', refreshTokenSecret);