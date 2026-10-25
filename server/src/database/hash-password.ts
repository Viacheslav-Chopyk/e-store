import { hashPassword } from '../auth/password.js';

// Prints a value for the users."passwordHash" column, for adding users by hand (e.g. in DBeaver).
// Usage: npm run hash-password -- <password>
const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run hash-password -- <password>');
  process.exit(1);
}
console.log(await hashPassword(password));
