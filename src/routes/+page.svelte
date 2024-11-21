<script>
  import { onMount } from 'svelte';

  let todos = [];
  let newTodo = '';
  let isLoading = true;
  let errorMessage = '';

  // Fetch todos on mount
  onMount(async () => {
    const token = localStorage.getItem('token');
    console.log(localStorage.getItem('token')); // Add this to verify if token is present

    if (!token) {
      window.location.href = '/login'; // Redirect to login if not authenticated
    }

    try {
      const response = await fetch('/api/todos', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        todos = await response.json();
      } else {
        throw new Error('Failed to load todos');
      }
    } catch (error) {
      errorMessage = error.message;
      console.error('Error fetching todos:', error);
    } finally {
      isLoading = false;
    }
  });

  // Logout function to clear token and redirect to login
  function logout() {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/login'; // Redirect to login page
  }

  // Add a new todo
  async function addTodo() {
    if (newTodo.trim()) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ text: newTodo, completed: false })
        });

        if (response.ok) {
          const newTodoItem = await response.json();  // Get the new todo item from the response
          todos = [...todos, newTodoItem];  // Add the new todo to the todos array
          newTodo = '';  // Clear the input field
        } else {
          throw new Error('Failed to add todo');
        }
      } catch (error) {
        errorMessage = error.message;
        console.error('Error adding todo:', error);
      }
    }
  }

  // Mark a todo as completed
  async function toggleComplete(id) {
    const token = localStorage.getItem('token');
    
    // Find the todo to toggle its completion state locally first
    const todoToToggle = todos.find(todo => todo.id === id);
    if (!todoToToggle) return;

    // Optimistically update the UI first
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    todos = updatedTodos;

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todoToToggle.completed }), // Send the updated completed status
      });

      if (!response.ok) {
        throw new Error('Failed to toggle todo completion');
      }

      // If response fails, revert the UI change to keep the state consistent
      const updatedTodo = await response.json();
      todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
      );
    } catch (error) {
      // In case of error, revert UI update to prevent inconsistent state
      console.error('Error toggling todo completion:', error);
      errorMessage = error.message;

      // Revert to the previous state if an error occurs
      todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
    }
  }

  // Delete a todo
  async function deleteTodo(id) {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        todos = todos.filter(todo => todo.id !== id);
      } else {
        throw new Error('Failed to delete todo');
      }
    } catch (error) {
      errorMessage = error.message;
      console.error('Error deleting todo:', error);
    }
  }
</script>

<main>
  <div class="container">
    <div class="todo-box">
      <h1>Todos</h1>

      {#if isLoading}
        <p class="loading">Loading...</p>
      {/if}

      {#if errorMessage}
        <p class="error">Error: {errorMessage}</p>
      {/if}

      <div class="todo-form">
        <input type="text" bind:value={newTodo} placeholder="Add a new task" />
        <button on:click={addTodo}>Add</button>
      </div>

      <ul class="todo-list">
        {#each todos as todo}
          <li class="todo-item">
            <input type="checkbox" checked={todo.completed} on:change={() => toggleComplete(todo.id)} />
            {todo.text}
            <button on:click={() => deleteTodo(todo.id)} class="delete-btn">Delete</button>
          </li>
        {/each}
      </ul>

      <button on:click={logout} class="logout-btn">Logout</button>
    </div>
  </div>
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #f4f6f9;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .todo-box {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #333;
  }

  .loading {
    font-size: 1.2rem;
    color: #888;
  }

  .error {
    color: red;
    font-weight: bold;
  }

  .todo-form {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  input[type="text"] {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
    width: 200px;
  }

  button {
    padding: 10px 15px;
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #4cae4c;
  }

  .todo-list {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
  }

  .todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
  }

  .todo-item input[type="checkbox"] {
    margin-right: 15px;
  }

  .delete-btn {
    background-color: #d9534f;
    border: none;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  .delete-btn:hover {
    background-color: #c9302c;
  }

  .logout-btn {
    background-color: #f0ad4e;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
  }

  .logout-btn:hover {
    background-color: #ec971f;
  }

  .todo-item button {
    margin-left: 10px;
  }
</style>
