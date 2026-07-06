import { eq } from 'drizzle-orm';
import { db, pool } from './db/db.js';
import { demoUsers } from './db/schema.js';

async function main() {
  try {
    console.log('🚀 Starting CRUD operations...');

    // 1. CREATE
    const [newUser] = await db
      .insert(demoUsers)
      .values({ name: 'JS Developer', email: 'js.dev@example.com' })
      .returning();

    console.log('✅ CREATE: User created:', newUser);

    // 2. READ
    const foundUsers = await db.select().from(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('✅ READ: Found user:', foundUsers[0]);

    // 3. UPDATE
    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name: 'Master JS Developer' })
      .where(eq(demoUsers.id, newUser.id))
      .returning();
    
    console.log('✅ UPDATE: User updated:', updatedUser);

    // 4. DELETE
    await db.delete(demoUsers).where(eq(demoUsers.id, newUser.id));
    console.log('✅ DELETE: User wiped out.');

  } catch (error) {
    console.error('❌ Error performing CRUD operations:', error);
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Database pool closed.');
    }
  }
}

main();