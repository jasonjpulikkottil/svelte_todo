import { PrismaClient } from '@prisma/client';
import { authenticate } from '$lib/auth'; 

const prisma = new PrismaClient();

// GET /api/todos: Fetch all todos for the authenticated user
export async function GET({ request }) {
  try {
    const { id } = authenticate(request);

    const todos = await prisma.todo.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return new Response(JSON.stringify(todos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST /api/todos: Create a new todo for the authenticated user
export async function POST({ request }) {
  try {
    const { id } = authenticate(request);

    const { text, completed } = await request.json();

    if (!text || typeof completed !== 'boolean') {
      return new Response(
        JSON.stringify({ error: 'Invalid input data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newTodo = await prisma.todo.create({
      data: {
        text,
        completed,
        userId: id,
      },
    });

    return new Response(
      JSON.stringify(newTodo),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error creating todo:", error);
    return new Response(
      JSON.stringify({ error: 'An error occurred: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
