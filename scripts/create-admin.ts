import { config } from 'dotenv';
import { resolve } from 'path';
import * as readline from 'readline';
import { users } from '../app/lib/schema';
import { hashPassword } from '../app/lib/password';

// Load environment variables BEFORE any imports that use them
config({ path: resolve(__dirname, '../.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Use dynamic imports after dotenv is loaded
(async () => {
  try {
    // Dynamic imports execute AFTER config() has run
    const { db } = await import('../app/lib/db');

    console.log('Create Admin User\n');

    const username = await question('Enter admin username: ');
    const password = await question('Enter admin password (min 8 chars): ');

    if (password.length < 8) {
      console.error('Error: Password must be at least 8 characters');
      rl.close();
      process.exit(1);
    }

    const hashedPassword = await hashPassword(password);

    const result = await db.insert(users).values({
      username,
      password: hashedPassword,
      role: 'admin',
    }).returning({ id: users.id, username: users.username });

    console.log('\nAdmin user created successfully!');
    console.log('ID:', result[0].id);
    console.log('Username:', result[0].username);

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    rl.close();
    process.exit(1);
  }
})();
