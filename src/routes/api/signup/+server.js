import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST({ request }) {
  const { username, password } = await request.json();

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Return a success message
    return new Response(JSON.stringify({ message: 'User created successfully!' }), { status: 201 });
  } catch (err) {
    // If the user already exists or there's another error
    return new Response(JSON.stringify({ error: 'User already exists or invalid data' }), { status: 400 });
  }
}
