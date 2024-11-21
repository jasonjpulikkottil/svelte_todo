// src/routes/api/todos/[id]/+server.js
import { PrismaClient } from '@prisma/client';
import { authenticate } from '$lib/auth'; // Import authenticate function to verify JWT

const prisma = new PrismaClient();

// PUT /api/todos/[id]: Update a todo (e.g., mark as completed)
export async function PUT({ request, params }) {
  try {
    const { id } = authenticate(request);  // Decode JWT and get user ID
    const todoId = parseInt(params.id);

    const { completed } = await request.json();

    if (typeof completed !== 'boolean') {
      return new Response(
        JSON.stringify({ error: 'Invalid input data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the todo for the authenticated user
    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: { completed },
    });

    return new Response(
      JSON.stringify(updatedTodo),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE /api/todos/[id]: Delete a todo
export async function DELETE({ request, params }) {
  try {
    const { id } = authenticate(request);  // Decode JWT and get user ID
    const todoId = parseInt(params.id);

    // Delete the todo for the authenticated user
    await prisma.todo.delete({
      where: { id: todoId }
    });

    return new Response(
      JSON.stringify({ message: 'Todo deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
